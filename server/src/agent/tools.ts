/** Tool layer — every tool emits an audit event; guard gates create_order. */

import { CATALOG } from "../data/catalog";
import { verifyMandate } from "../mandate/verify";
import { mandates } from "../routes/mandate";
import { consumeVerified, markVerified, type CartFingerprint } from "./guard";
import { createMockOrder, getMockOrder, approveAndCaptureMock } from "../paypal/mock";
import { log } from "../audit/bus";

export interface ToolResult {
  ok: boolean;
  output: unknown;
}

function item(sku: string) {
  const found = CATALOG.find((p) => p.sku === sku);
  if (!found) throw new Error(`Unknown SKU ${sku}`);
  return found;
}

export function listStorefront(runId: string): ToolResult {
  log("agent", "list_storefront", "INFO", `Read catalog — ${CATALOG.length} SKUs`, { runId });
  return { ok: true, output: { count: CATALOG.length } };
}

export function compareItems(
  runId: string,
  opts: { category: string; maxPriceCents: number }
): ToolResult {
  const pool = CATALOG.filter(
    (p) => p.category === opts.category && p.priceCents <= opts.maxPriceCents
  ).sort((a, b) => b.rating - a.rating);
  const best = pool[0] ?? null;
  log(
    "agent",
    "compare_items",
    "OK",
    best
      ? `Best in-scope ≤ $${(opts.maxPriceCents / 100).toFixed(2)}: ${best.name} (★${best.rating})`
      : `No ${opts.category} item within cap`,
    { runId, candidate: best?.sku ?? null, considered: pool.length }
  );
  return { ok: true, output: { best } };
}

export function verifyMandateTool(
  runId: string,
  args: { mandateId: string; sku: string; amountCents: number; category: string }
): ToolResult {
  const stored = mandates.get(args.mandateId);
  if (!stored) {
    log("agent", "verify_mandate", "BLOCKED", `Mandate ${args.mandateId} not found`, { runId });
    return { ok: false, output: { reason: "NOT_FOUND" } };
  }
  const result = verifyMandate(stored.payload, stored.signature, {
    amountCents: args.amountCents,
    category: args.category,
    now: Date.now(),
    secret: process.env.MANDATE_SIGNING_SECRET || "change-me-in-dev",
  });

  if (result.ok) {
    const fp: CartFingerprint = { runId, ...args };
    markVerified(fp);
    log(
      "agent",
      "verify_mandate",
      "OK",
      `✓ VERIFIED — $${(args.amountCents / 100).toFixed(2)} in scope, remaining $${(result.remainingCents / 100).toFixed(2)}`,
      { runId, verdict: result }
    );
  } else {
    log(
      "agent",
      "verify_mandate",
      "BLOCKED",
      `✗ ${result.reason} — mandate ${args.mandateId}`,
      { runId, verdict: result, attempted: args }
    );
  }
  return { ok: result.ok, output: result };
}

export function createOrder(
  runId: string,
  args: { mandateId: string; sku: string; amountCents: number; category: string }
): ToolResult {
  const allowed = consumeVerified({ runId, ...args });
  if (!allowed) {
    log(
      "agent",
      "create_order",
      "BLOCKED",
      "SPEND MANDATE VIOLATION — create_order never invoked (no verified mandate for this cart)",
      { runId, attempted: args }
    );
    throw new MandateViolationError("NO_VERIFIED_MANDATE");
  }
  const order = createMockOrder(args.amountCents, args.sku, args.mandateId);
  log(
    "agent",
    "create_order",
    "OK",
    `Order ${order.orderId} created — PAYER APPROVAL REQUIRED ($${(args.amountCents / 100).toFixed(2)})`,
    { runId, orderId: order.orderId }
  );
  return { ok: true, output: { orderId: order.orderId, status: order.status } };
}

export function captureOrder(runId: string, args: { orderId: string }): ToolResult {
  const order = approveAndCaptureMock(args.orderId);
  const mandate = mandates.get(order.mandateId);
  if (mandate) mandate.spentCents += order.amountCents;
  const remaining = mandate ? mandate.payload.capCents - mandate.spentCents : 0;
  log(
    "paypal",
    "capture_order",
    "OK",
    `Order ${order.orderId} — COMPLETED · mandate remaining $${(remaining / 100).toFixed(2)}`,
    { runId, orderId: order.orderId, remainingCents: remaining }
  );
  return { ok: true, output: { orderId: order.orderId, status: order.status, remainingCents: remaining } };
}

export class MandateViolationError extends Error {
  readonly code = "SPEND_MANDATE_VIOLATION";
  constructor(reason: string) {
    super(reason);
    this.name = "MandateViolationError";
  }
}

export function getOrder(orderId: string) {
  return getMockOrder(orderId);
}

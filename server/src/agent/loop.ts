/** Fixed tool dispatcher — NOT a general ReAct engine (plan: scope-creep guard).
 *  Two scripted demo goals; each step emits audit events as it runs. */

import {
  listStorefront,
  compareItems,
  verifyMandateTool,
  createOrder,
  MandateViolationError,
  type ToolResult,
} from "./tools";
import { mandates } from "../routes/mandate";
import { log } from "../audit/bus";

export type GoalId = "compliant" | "violation";

export interface RunOutcome {
  goalId: GoalId;
  runId: string;
  status: "AWAITING_APPROVAL" | "BLOCKED" | "ERROR";
  orderId?: string;
  blockedReason?: string;
  pickedSku?: string;
  amountCents?: number;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const GOALS: Record<GoalId, { label: string; narration: string }> = {
  compliant: {
    label: "Buy me the best headphones under my mandate",
    narration: "Agent picks the best in-scope item, verifies the mandate, opens a PayPal order.",
  },
  violation: {
    label: "Buy the $299 studio monitors",
    narration: "Agent attempts an out-of-scope, over-cap purchase — mandate must block it.",
  },
};

export async function runGoal(goalId: GoalId, mandateId: string): Promise<RunOutcome> {
  const runId = `run_${Date.now().toString(36)}`;
  const stored = mandates.get(mandateId);

  log("user", "agent_run", "INFO", `Goal "${GOALS[goalId].label}" started`, {
    runId,
    goalId,
    mandateId,
  });

  if (!stored) {
    log("agent", "agent_run", "BLOCKED", "No mandate provided — agent refuses to act", { runId });
    return { goalId, runId, status: "BLOCKED", blockedReason: "NO_MANDATE" };
  }

  if (goalId === "violation") {
    // Scripted attempt: agent "finds" the studio monitors and tries to buy.
    listStorefront(runId);
    await sleep(350);
    const amountCents = 29900;
    const category = "studio-monitors";
    const verify = verifyMandateTool(runId, {
      mandateId,
      sku: "aria-mon-299",
      amountCents,
      category,
    });
    await sleep(350);
    if (!verify.ok) {
      const reason = (verify.output as { reason: string }).reason;
      const spent = stored.spentCents;
      const remaining = stored.payload.capCents - spent;
      log(
        "agent",
        "create_order",
        "BLOCKED",
        `SPEND MANDATE VIOLATION — create_order never invoked. Reason: $${(amountCents / 100).toFixed(2)} attempt rejected (${reason}; scope [${stored.payload.categories.join(", ")}], remaining $${(remaining / 100).toFixed(2)})`,
        { runId, reason, attempted: { sku: "aria-mon-299", amountCents, category } }
      );
      return { goalId, runId, status: "BLOCKED", blockedReason: reason };
    }
    // verify passing on a violation script is a bug — fall through to safety stop
    log("agent", "agent_run", "WARN", "Violation script unexpectedly verified — stopping", { runId });
    return { goalId, runId, status: "ERROR", blockedReason: "SCRIPT_INVARIANT" };
  }

  // Compliant goal: best headphones within remaining cap.
  listStorefront(runId);
  await sleep(350);
  const remaining = stored.payload.capCents - stored.spentCents;
  const compare: ToolResult = compareItems(runId, { category: "headphones", maxPriceCents: remaining });
  await sleep(350);
  const best = (compare.output as { best: { sku: string; priceCents: number; category: string } | null }).best;
  if (!best) {
    log("agent", "agent_run", "BLOCKED", "Nothing in stock within mandate — no order attempted", { runId });
    return { goalId, runId, status: "BLOCKED", blockedReason: "NOTHING_IN_SCOPE" };
  }

  const verify = verifyMandateTool(runId, {
    mandateId,
    sku: best.sku,
    amountCents: best.priceCents,
    category: best.category,
  });
  await sleep(350);
  if (!verify.ok) {
    const reason = (verify.output as { reason: string }).reason;
    return { goalId, runId, status: "BLOCKED", blockedReason: reason, pickedSku: best.sku };
  }

  const order = await createOrder(runId, {
    mandateId,
    sku: best.sku,
    amountCents: best.priceCents,
    category: best.category,
  });
  const output = order.output as { orderId: string };
  return {
    goalId,
    runId,
    status: "AWAITING_APPROVAL",
    orderId: output.orderId,
    pickedSku: best.sku,
    amountCents: best.priceCents,
  };
}

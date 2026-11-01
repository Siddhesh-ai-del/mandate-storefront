/** Orders v2 facade: sandbox when configured, mock otherwise.
 *  Any sandbox error mid-flight degrades to mock (amber chip, never a dead demo). */

import { log } from "../audit/bus";
import { paypalRequest, sandboxConfigured } from "./client";
import {
  approveAndCaptureMock,
  createMockOrder,
  getMockOrder,
  type MockOrder,
} from "./mock";

export type OrderStatus = "PAYER_APPROVAL_REQUIRED" | "COMPLETED";

export interface CheckoutOrder {
  orderId: string;
  status: OrderStatus;
  amountCents: number;
  sku: string;
  mandateId: string;
  approveUrl?: string; // sandbox only
}

let degraded = false;

/** Sandbox orders live at PayPal; keep local metadata for cap accounting. */
const sandboxMeta = new Map<string, { amountCents: number; sku: string; mandateId: string }>();

export function isDegraded(): boolean {
  return degraded;
}

export function mode(): "SANDBOX" | "DEMO MODE" {
  return sandboxConfigured() && !degraded ? "SANDBOX" : "DEMO MODE";
}

function degrade(err: unknown, context: string): void {
  degraded = true;
  log(
    "system",
    "paypal",
    "WARN",
    `Sandbox error in ${context} — degraded to DEMO MODE: ${err instanceof Error ? err.message : String(err)}`
  );
}

/** Create an order. Guard has already verified the mandate for this cart. */
export async function createCheckoutOrder(
  amountCents: number,
  sku: string,
  mandateId: string
): Promise<CheckoutOrder> {
  if (sandboxConfigured() && !degraded) {
    try {
      const res = await paypalRequest<{
        id: string;
        status: string;
        links?: { rel: string; href: string }[];
      }>("POST", "/v2/checkout/orders", {
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: sku,
            custom_id: `mandate:${mandateId}`,
            description: `Mandate Storefront — ${sku}`,
            amount: { currency_code: "USD", value: (amountCents / 100).toFixed(2) },
          },
        ],
        application_context: { user_action: "PAY_NOW" },
      });
      sandboxMeta.set(res.id, { amountCents, sku, mandateId });
      const approveUrl = res.links?.find((l) => l.rel === "approve")?.href;
      return {
        orderId: res.id,
        status: "PAYER_APPROVAL_REQUIRED",
        amountCents,
        sku,
        mandateId,
        ...(approveUrl ? { approveUrl } : {}),
      };
    } catch (err) {
      degrade(err, "create_order");
    }
  }
  const mock = createMockOrder(amountCents, sku, mandateId);
  return { orderId: mock.orderId, status: mock.status, amountCents, sku, mandateId };
}

/** Poll order status (no webhooks — plan cut list #5). */
export async function getCheckoutOrder(orderId: string): Promise<CheckoutOrder | null> {
  const mock = getMockOrder(orderId);
  if (mock) {
    return {
      orderId: mock.orderId,
      status: mock.status,
      amountCents: mock.amountCents,
      sku: mock.sku,
      mandateId: mock.mandateId,
    };
  }
  const meta = sandboxMeta.get(orderId);
  if (sandboxConfigured() && !degraded && meta) {
    try {
      const res = await paypalRequest<{ id: string; status: string }>(
        "GET",
        `/v2/checkout/orders/${orderId}`
      );
      return {
        orderId: res.id,
        status: res.status === "COMPLETED" ? "COMPLETED" : "PAYER_APPROVAL_REQUIRED",
        ...meta,
      };
    } catch (err) {
      degrade(err, "get_order");
    }
  }
  return null;
}

/** Capture = the money moment. Sandbox: POST .../capture; mock: state transition. */
export async function captureCheckoutOrder(orderId: string): Promise<CheckoutOrder> {
  const mock = getMockOrder(orderId);
  if (mock) {
    const done = approveAndCaptureMock(orderId);
    return {
      orderId: done.orderId,
      status: done.status,
      amountCents: done.amountCents,
      sku: done.sku,
      mandateId: done.mandateId,
    };
  }
  const meta = sandboxMeta.get(orderId);
  if (sandboxConfigured() && !degraded && meta) {
    try {
      const res = await paypalRequest<{ id: string; status: string }>(
        "POST",
        `/v2/checkout/orders/${orderId}/capture`
      );
      if (res.status !== "COMPLETED") throw new Error(`Capture returned ${res.status}`);
      return { orderId: res.id, status: "COMPLETED", ...meta };
    } catch (err) {
      degrade(err, "capture_order");
      // fall through to mock capture so the demo never dead-ends
      return {
        orderId,
        status: "COMPLETED",
        ...meta,
      };
    }
  }
  throw new Error(`Unknown order ${orderId}`);
}

export function resetPaypalState(): void {
  degraded = false;
  sandboxMeta.clear();
}

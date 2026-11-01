/** Mock PayPal Orders v2 state machine (zero-credential demo mode).
 *  Real sandbox swaps in at P4 behind the same call shape. */

export type MockOrderStatus = "PAYER_APPROVAL_REQUIRED" | "COMPLETED";

export interface MockOrder {
  orderId: string;
  status: MockOrderStatus;
  amountCents: number;
  sku: string;
  mandateId: string;
  createdAt: string;
}

const orders = new Map<string, MockOrder>();
let seq = 1;

export function createMockOrder(amountCents: number, sku: string, mandateId: string): MockOrder {
  const order: MockOrder = {
    orderId: `MOCK-${String(seq++).padStart(4, "0")}-${Date.now().toString(36).toUpperCase()}`,
    status: "PAYER_APPROVAL_REQUIRED",
    amountCents,
    sku,
    mandateId,
    createdAt: new Date().toISOString(),
  };
  orders.set(order.orderId, order);
  return order;
}

export function getMockOrder(orderId: string): MockOrder | undefined {
  return orders.get(orderId);
}

export function approveAndCaptureMock(orderId: string): MockOrder {
  const order = orders.get(orderId);
  if (!order) throw new Error(`Unknown order ${orderId}`);
  if (order.status !== "PAYER_APPROVAL_REQUIRED") {
    throw new Error(`Order ${orderId} is ${order.status}, not capturable`);
  }
  order.status = "COMPLETED";
  return order;
}

export function resetMockOrders(): void {
  orders.clear();
  seq = 1;
}

/** The hard server-side rule: money movement requires a verified mandate
 *  for THIS EXACT cart. No verified mark → create_order throws, always. */

export interface CartFingerprint {
  runId: string;
  sku: string;
  amountCents: number;
  category: string;
  mandateId: string;
}

const verified = new Map<string, CartFingerprint>();

const key = (c: CartFingerprint) =>
  [c.runId, c.mandateId, c.sku, c.amountCents, c.category].join("|");

export function markVerified(f: CartFingerprint): void {
  verified.set(key(f), f);
}

/** True only if this exact cart passed verify_mandate in this run. Single-use. */
export function consumeVerified(f: CartFingerprint): boolean {
  const k = key(f);
  if (!verified.has(k)) return false;
  verified.delete(k);
  return true;
}

export function resetGuard(): void {
  verified.clear();
}

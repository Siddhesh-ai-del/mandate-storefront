import { timingSafeEqual } from "node:crypto";
import { signMandate, type MandatePayload } from "./sign";

export type VerifyReason =
  | "OK"
  | "BAD_SIGNATURE"
  | "EXPIRED"
  | "NOT_YET_VALID"
  | "OUT_OF_SCOPE"
  | "OVER_CAP";

export interface VerifyInput {
  amountCents: number;
  category: string;
  now: number; // epoch ms
  secret: string;
  alreadySpentCents?: number;
}

export type VerifyResult =
  | { ok: true; remainingCents: number }
  | { ok: false; reason: Exclude<VerifyReason, "OK">; remainingCents: number };

function safeEqualHex(a: string, b: string): boolean {
  const ba = Buffer.from(a, "hex");
  const bb = Buffer.from(b, "hex");
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

/**
 * Server-side gate for any money movement. Signature is checked before
 * anything else — tampered cap/scope/never pass this.
 */
export function verifyMandate(
  payload: MandatePayload,
  signature: string,
  input: VerifyInput
): VerifyResult {
  const expected = signMandate(payload, input.secret);
  const remaining = payload.capCents - (input.alreadySpentCents ?? 0);

  if (!safeEqualHex(signature, expected)) {
    return { ok: false, reason: "BAD_SIGNATURE", remainingCents: remaining };
  }
  const now = input.now;
  if (now > Date.parse(payload.expiresAt)) {
    return { ok: false, reason: "EXPIRED", remainingCents: remaining };
  }
  if (now < Date.parse(payload.issuedAt)) {
    return { ok: false, reason: "NOT_YET_VALID", remainingCents: remaining };
  }
  if (!payload.categories.includes(input.category)) {
    return { ok: false, reason: "OUT_OF_SCOPE", remainingCents: remaining };
  }
  if (input.amountCents > remaining) {
    return { ok: false, reason: "OVER_CAP", remainingCents: remaining };
  }
  return { ok: true, remainingCents: remaining };
}

import { createHmac } from "node:crypto";

export interface MandatePayload {
  mandateId: string;
  storeId: string;
  capCents: number;
  categories: string[];
  issuedAt: string; // ISO
  expiresAt: string; // ISO
  holder: string;
}

/** Deterministic JSON: object keys sorted recursively, arrays order-preserved. */
export function canonicalize(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(canonicalize).join(",")}]`;
  }
  if (value !== null && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
      a < b ? -1 : a > b ? 1 : 0
    );
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${canonicalize(v)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

export function signMandate(payload: MandatePayload, secret: string): string {
  return createHmac("sha256", secret).update(canonicalize(payload)).digest("hex");
}

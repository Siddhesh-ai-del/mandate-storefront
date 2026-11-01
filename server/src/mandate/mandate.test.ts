import { describe, expect, it } from "vitest";
import { signMandate, canonicalize } from "./sign";
import { verifyMandate } from "./verify";
import type { MandatePayload } from "./sign";

const SECRET = "test-secret";
const base: MandatePayload = {
  mandateId: "mnd_test1",
  storeId: "aria-audio",
  capCents: 4000,
  categories: ["headphones", "cables"],
  issuedAt: "2026-11-01T00:00:00.000Z",
  expiresAt: "2026-11-01T00:15:00.000Z",
  holder: "demo-user",
};

const at = (iso: string) => new Date(iso).getTime();

describe("canonicalize", () => {
  it("is stable under key reordering", () => {
    const reordered = { ...base };
    const shuffled = Object.fromEntries(Object.entries(base).reverse());
    expect(canonicalize(reordered)).toBe(canonicalize(shuffled));
  });
});

describe("verifyMandate", () => {
  const sig = signMandate(base, SECRET);

  it("accepts a valid in-scope purchase within cap and validity", () => {
    const r = verifyMandate(base, sig, {
      amountCents: 3999,
      category: "headphones",
      now: at(base.issuedAt),
      secret: SECRET,
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.remainingCents).toBe(4000);
  });

  it("rejects a tampered signature", () => {
    const tampered = { ...base, capCents: 99999 };
    const r = verifyMandate(tampered, sig, {
      amountCents: 100,
      category: "headphones",
      now: at(base.issuedAt),
      secret: SECRET,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("BAD_SIGNATURE");
  });

  it("rejects an expired mandate", () => {
    const r = verifyMandate(base, sig, {
      amountCents: 100,
      category: "headphones",
      now: at(base.expiresAt) + 1,
      secret: SECRET,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("EXPIRED");
  });

  it("rejects an amount over the remaining cap", () => {
    const r = verifyMandate(base, sig, {
      amountCents: 4001,
      category: "headphones",
      now: at(base.issuedAt),
      secret: SECRET,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.reason).toBe("OVER_CAP");
      expect(r.remainingCents).toBe(4000);
    }
  });

  it("rejects a category outside scope", () => {
    const r = verifyMandate(base, sig, {
      amountCents: 100,
      category: "studio-monitors",
      now: at(base.issuedAt),
      secret: SECRET,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("OUT_OF_SCOPE");
  });

  it("rejects an amount exactly one cent over when partially spent", () => {
    const r = verifyMandate(base, sig, {
      amountCents: 101,
      category: "cables",
      now: at(base.issuedAt),
      alreadySpentCents: 3900,
      secret: SECRET,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("OVER_CAP");
  });

  it("rejects a mandate signed with a different secret", () => {
    const foreignSig = signMandate(base, "wrong-secret");
    const r = verifyMandate(base, foreignSig, {
      amountCents: 100,
      category: "headphones",
      now: at(base.issuedAt),
      secret: SECRET,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("BAD_SIGNATURE");
  });
});

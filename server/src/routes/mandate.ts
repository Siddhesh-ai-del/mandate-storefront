import { Router } from "express";
import { randomBytes } from "node:crypto";
import { z } from "zod";
import { signMandate, type MandatePayload } from "../mandate/sign";
import { log } from "../audit/bus";

export const mandateRouter = Router();

const secret = () => process.env.MANDATE_SIGNING_SECRET || "change-me-in-dev";

/** In-memory mandate store: signature + running spend. */
export interface StoredMandate {
  payload: MandatePayload;
  signature: string;
  spentCents: number;
}
export const mandates = new Map<string, StoredMandate>();

export function resetMandates(): void {
  mandates.clear();
}

const mintSchema = z.object({
  capCents: z.number().int().positive().max(1_000_00),
  expiresInSec: z.number().int().min(60).max(3600),
  categories: z.array(z.string().min(1)).min(1).max(10),
  storeId: z.string().min(1).max(64),
  holder: z.string().min(1).max(64).default("demo-user"),
});

mandateRouter.post("/mandate", (req, res) => {
  const parsed = mintSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "INVALID_MANDATE_REQUEST", issues: parsed.error.issues });
  }
  const { capCents, expiresInSec, categories, storeId, holder } = parsed.data;
  const now = Date.now();
  const payload: MandatePayload = {
    mandateId: `mnd_${randomBytes(6).toString("hex")}`,
    storeId,
    capCents,
    categories: [...categories].sort(),
    issuedAt: new Date(now).toISOString(),
    expiresAt: new Date(now + expiresInSec * 1000).toISOString(),
    holder,
  };
  const signature = signMandate(payload, secret());
  mandates.set(payload.mandateId, { payload, signature, spentCents: 0 });

  log("user", "mint_mandate", "OK", `Mandate ${payload.mandateId} minted — cap $${(capCents / 100).toFixed(2)}, scope [${payload.categories.join(", ")}]`, { mandateId: payload.mandateId });
  res.status(201).json({ mandate: payload, signature });
});

mandateRouter.get("/mandate/:id", (req, res) => {
  const stored = mandates.get(req.params.id);
  if (!stored) return res.status(404).json({ error: "NOT_FOUND" });
  res.json({
    mandate: stored.payload,
    signature: stored.signature,
    spentCents: stored.spentCents,
    remainingCents: stored.payload.capCents - stored.spentCents,
  });
});

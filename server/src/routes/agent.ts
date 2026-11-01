import { Router } from "express";
import { z } from "zod";
import { GOALS, runGoal, type GoalId } from "../agent/loop";
import { captureOrder, getOrder, MandateViolationError } from "../agent/tools";
import { log } from "../audit/bus";

export const agentRouter = Router();

const runSchema = z.object({
  goalId: z.enum(["compliant", "violation"]),
  mandateId: z.string().min(1),
});

agentRouter.get("/agent/goals", (_req, res) => {
  res.json(GOALS);
});

agentRouter.post("/agent/run", async (req, res) => {
  const parsed = runSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "INVALID_REQUEST", issues: parsed.error.issues });
  }
  try {
    const outcome = await runGoal(parsed.data.goalId as GoalId, parsed.data.mandateId);
    res.json(outcome);
  } catch (e) {
    if (e instanceof MandateViolationError) {
      return res.status(403).json({ error: e.code, reason: e.message });
    }
    log("system", "agent_run", "WARN", `Agent run failed: ${e instanceof Error ? e.message : String(e)}`);
    res.status(500).json({ error: "AGENT_ERROR" });
  }
});

const approveSchema = z.object({ orderId: z.string().min(1) });

/** Human-in-the-loop: approve (payer action) + capture — the money moment. */
agentRouter.post("/agent/approve", (req, res) => {
  const parsed = approveSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "INVALID_REQUEST", issues: parsed.error.issues });
  }
  const order = getOrder(parsed.data.orderId);
  if (!order) return res.status(404).json({ error: "ORDER_NOT_FOUND" });
  if (order.status !== "PAYER_APPROVAL_REQUIRED") {
    return res.status(409).json({ error: "NOT_APPROVABLE", status: order.status });
  }
  log("user", "payer_approval", "OK", `Buyer approved order ${order.orderId} (sandbox buyer)`, {
    orderId: order.orderId,
  });
  const captured = captureOrder(`approve_${order.orderId}`, { orderId: order.orderId });
  res.json({ order: getOrder(order.orderId), captured: captured.output });
});

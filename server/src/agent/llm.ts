/** Live LLM mode (bonus): same tool layer, driven by tool-calling chat completions.
 *  Canned script remains the demo of record — any failure falls back to it. */

import { log } from "../audit/bus";
import { mandates } from "../routes/mandate";
import { verifyMandateTool, createOrder, listStorefront, compareItems, type ToolResult } from "./tools";
import { GOALS, runGoal, type GoalId, type RunOutcome } from "./loop";

export function llmConfigured(): boolean {
  return Boolean(process.env.LLM_API_KEY && process.env.LLM_BASE_URL && process.env.LLM_MODEL);
}

let llmDegraded = false;
export function isLlmDegraded(): boolean {
  return llmDegraded;
}
export function resetLlmState(): void {
  llmDegraded = false;
}

interface ChatMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string | null;
  tool_calls?: {
    id: string;
    type: "function";
    function: { name: string; arguments: string };
  }[];
  tool_call_id?: string;
}

const TOOLS = [
  {
    type: "function",
    function: {
      name: "list_storefront",
      description: "Read the catalog (9 SKUs) to see what exists.",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "compare_items",
      description: "Pick the best-rated item in a category under a price ceiling.",
      parameters: {
        type: "object",
        properties: {
          category: { type: "string" },
          maxPriceCents: { type: "number" },
        },
        required: ["category", "maxPriceCents"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "verify_mandate",
      description: "Server-side check: signature, expiry, scope, remaining cap. Required before create_order.",
      parameters: {
        type: "object",
        properties: {
          mandateId: { type: "string" },
          sku: { type: "string" },
          amountCents: { type: "number" },
          category: { type: "string" },
        },
        required: ["mandateId", "sku", "amountCents", "category"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_order",
      description: "Create a PayPal order. Throws SPEND_MANDATE_VIOLATION unless this exact cart passed verify_mandate.",
      parameters: {
        type: "object",
        properties: {
          mandateId: { type: "string" },
          sku: { type: "string" },
          amountCents: { type: "number" },
          category: { type: "string" },
        },
        required: ["mandateId", "sku", "amountCents", "category"],
      },
    },
  },
] as const;

const SYSTEM = `You are a shopping agent for Aria's Audio. You have a signed spend mandate: respect its cap, category scope, and expiry absolutely. Use tools to explore, verify the mandate BEFORE any purchase, and never attempt purchases outside the mandate. Keep tool calls minimal and decisive.`;

async function callLlm(messages: ChatMessage[]): Promise<ChatMessage> {
  const base = process.env.LLM_BASE_URL!;
  const res = await fetch(`${base.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.LLM_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.LLM_MODEL,
      messages,
      tools: TOOLS,
      tool_choice: "auto",
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`LLM HTTP ${res.status}`);
  const body = (await res.json()) as { choices: { message: ChatMessage }[] };
  return body.choices[0].message;
}

async function dispatch(
  runId: string,
  name: string,
  argsRaw: string
): Promise<{ result: ToolResult; data: unknown }> {
  const args = JSON.parse(argsRaw || "{}") as Record<string, unknown>;
  switch (name) {
    case "list_storefront":
      return { result: listStorefront(runId), data: {} };
    case "compare_items":
      return {
        result: compareItems(runId, {
          category: String(args.category),
          maxPriceCents: Number(args.maxPriceCents),
        }),
        data: args,
      };
    case "verify_mandate": {
      const a = {
        mandateId: String(args.mandateId),
        sku: String(args.sku),
        amountCents: Number(args.amountCents),
        category: String(args.category),
      };
      return { result: verifyMandateTool(runId, a), data: a };
    }
    case "create_order": {
      const a = {
        mandateId: String(args.mandateId),
        sku: String(args.sku),
        amountCents: Number(args.amountCents),
        category: String(args.category),
      };
      return { result: await createOrder(runId, a), data: a };
    }
    default:
      throw new Error(`Unknown tool ${name}`);
  }
}

/** Free-text goal via LLM; falls back to canned goal on any failure. */
export async function runLlmGoal(goalText: string, mandateId: string, fallbackGoal: GoalId): Promise<RunOutcome & { llmUsed: boolean }> {
  if (!llmConfigured() || llmDegraded) {
    const outcome = await runGoal(fallbackGoal, mandateId);
    return { ...outcome, llmUsed: false };
  }
  const runId = `llm_${Date.now().toString(36)}`;
  log("user", "agent_run", "INFO", `LLM goal: "${goalText.slice(0, 80)}"`, { runId, mandateId });

  const stored = mandates.get(mandateId);
  if (!stored) {
    log("agent", "agent_run", "BLOCKED", "No mandate provided — agent refuses to act", { runId });
    return { goalId: fallbackGoal, runId, status: "BLOCKED", blockedReason: "NO_MANDATE", llmUsed: false };
  }

  try {
    const messages: ChatMessage[] = [
      { role: "system", content: SYSTEM },
      {
        role: "user",
        content: `Goal: ${goalText}\nMandate: ${mandateId} (cap ${stored.payload.capCents} cents, categories: ${stored.payload.categories.join(", ")}, expires ${stored.payload.expiresAt}).`,
      },
    ];

    for (let step = 0; step < 6; step++) {
      const msg = await callLlm(messages);
      messages.push(msg);
      if (!msg.tool_calls?.length) {
        log("agent", "agent_run", "OK", `LLM finished: ${msg.content?.slice(0, 120) ?? "(no text)"}`, { runId });
        return { goalId: fallbackGoal, runId, status: "BLOCKED", blockedReason: "LLM_NO_ORDER", llmUsed: true };
      }
      for (const tc of msg.tool_calls) {
        const args = tc.function.arguments || "{}";
        let result: ToolResult;
        let data: unknown;
        try {
          ({ result, data } = await dispatch(runId, tc.function.name, args));
        } catch (err) {
          // MandateViolationError from create_order guard → tool error back to model
          result = {
            ok: false,
            output: { error: err instanceof Error ? err.message : String(err) },
          };
          data = {};
        }
        messages.push({
          role: "tool",
          tool_call_id: tc.id,
          content: JSON.stringify(result.output),
        });
        if (tc.function.name === "create_order" && result.ok) {
          const out = result.output as { orderId: string };
          const amt = (data as { amountCents?: number }).amountCents ?? 0;
          const sku = (data as { sku?: string }).sku ?? "";
          return {
            goalId: fallbackGoal,
            runId,
            status: "AWAITING_APPROVAL",
            orderId: out.orderId,
            pickedSku: sku,
            amountCents: amt,
            llmUsed: true,
          };
        }
      }
    }
    log("agent", "agent_run", "WARN", "LLM step budget exhausted — no order created", { runId });
    return { goalId: fallbackGoal, runId, status: "BLOCKED", blockedReason: "LLM_BUDGET", llmUsed: true };
  } catch (err) {
    llmDegraded = true;
    log(
      "system",
      "llm",
      "WARN",
      `LLM failure — falling back to canned script: ${err instanceof Error ? err.message : String(err)}`,
      { runId }
    );
    const outcome = await runGoal(fallbackGoal, mandateId);
    return { ...outcome, runId, llmUsed: false };
  }
}

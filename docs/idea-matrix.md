# Idea Matrix — PayPal AI Hackathon (REAL)
**Axes 1–5, all higher = better (scope = shippability by Nov 12). product-lens Mode 4 ICE cross-check. Evidence: outputs/paypal-ai-hackathon-win.md**

| # | Idea | Judging fit | Demo-ability | Scope | Wow | Honesty | Σ | ICE ~ |
|---|------|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| **C+** | **Agent-Ready Storefront with spend mandate** — WebMCP-style storefront + LLM agent that must verify a signed, capped, expiring mandate before executing real Orders v2 checkout via Agent Toolkit; AG Grid audit log | 5 | 5 | 4 | 5 | 4 | **23** | 3.0 |
| C | WebMCP storefront simulator alone (agent shops, PayPal sandbox checkout) | 5 | 5 | 4 | 5 | 3 | 22 | 2.9 |
| B | Guardrailed spend-mandate agent alone (consent artifact → `create_order`/`pay_order`) | 4 | 4 | 4 | 3 | 5 | 20 | 2.5 |
| A | Agentic post-purchase desk (dispute/refund agent) | 5 | 2 | 2 | 4 | 4 | 17 | 2.1 |
| D | AI invoice-chaser (published starter idea — flooded) | 4 | 4 | 5 | 1 | 4 | 18 | 2.6 |
| E | Chat-to-pay shop assistant (published starter idea — flooded) | 3 | 4 | 5 | 1 | 4 | 17 | 2.4 |

## product-lens Mode 1 — finalist interrogation

**C+ — Agent-Ready Storefront with spend mandate**
1. *Who:* a consumer delegating shopping to an AI assistant who doesn't fully trust it
   (specific person: "I'd let my agent buy, but only within limits I set")
2. *Pain:* delegation without control = agents either can't buy (useless) or can buy anything
   (terrifying). PayPal names consent/guardrails as protocol-level non-negotiables
3. *Why now:* WebMCP shipped Sep 2026 + Agent Toolkit tools exist + no public implementation
   exists (merchant-gated) → we build the public one
4. *10-star:* any agent, any store, provable permission, 3-click audit trail
5. *MVP:* storefront (curated local catalog) → user mints mandate (cap/expiry/scope) → agent
   shops within mandate → mandate violation attempt is BLOCKED and shown → PayPal sandbox
   checkout completes → AG Grid log shows every step
6. *Anti-goal:* NOT a real merchant integration, NOT protocol-spec compliance, NO Payouts,
   NO dispute seeding (sandbox disputes are hard), NO auth system
7. *Metric:* judge goes mandate → blocked spend → successful checkout in <90 seconds

**A — Post-purchase desk:** strong theory, but sandbox dispute seeding is unreliable →
demo-breaking risk (Stage 1 requires "runs consistently"). **Cut to stretch list.**

## Slop / saturation check
C+ appears in NO published idea list; D and E are literally items 3 and 9 of the list
everyone reads → Innovation criterion penalizes them regardless of execution.

## Recommendation
**C+** — it is C's demo strength plus B's innovation story in one golden flow, with the
block-then-approve moment as the video's 90-second wow. AG Grid audit log (MIT) feeds the
sponsor prize naturally. PayPal gets named three times on screen: storefront, Agent Toolkit,
Orders v2 checkout. Thin post-purchase slice (refund request on a completed order) stays on
the cut list unless time remains.

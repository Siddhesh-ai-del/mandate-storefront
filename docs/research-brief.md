# Research Brief — PayPal AI Hackathon (1-page pipeline insight brief)
**Full cited brief:** `outputs/paypal-ai-hackathon-win.md` (+ provenance) · **Backing evidence:** `outputs/.drafts/T1–T4`

## The problem / opportunity (evidence)
25,553 participants, no prescribed tracks — so the real contest is *fit*: Stage 1 is pass/fail on
"PayPal central + AI real + works", then 5 equal criteria with **Technological Implementation as
tie-breaker** (official rules). Devpost judge research: most submissions die on baseline
requirements before scoring. PayPal's own Dev Days winners were all "working integration" stories —
one narrow loop beats breadth.

## What the field will do (and must avoid)
The published starter-idea list everyone reads = flooded: gift-finder, price-watch, chat-to-pay,
invoice-chaser, NL dashboards. Anti-pattern: chatbot beside a checkout button.

## Winning angles (tied to criteria)
1. **Agentic post-purchase desk** (dispute/refund agent; PayPal's protocol blog names post-purchase
   as unaddressed) → Agentic Commerce + Most Impactful HMs
2. **Guardrailed agent spend-mandate** (signed, capped, expiring permission artifact before any
   `create_order`) → Innovation; nobody publishes this
3. **WebMCP agent-ready storefront simulator** (PayPal's Sep-2026 story, merchant-gated) → freshest
   official air cover, best video

**Common plumbing:** Orders v2 + JS SDK v6 button + **Agent Toolkit as the AI actor** (not beside)
— swap narrative, keep plumbing. Secondary surface: Invoicing (fastest AI depth) or Subscriptions.

**Stacked prize:** Best Use of AG Grid (only 5-slot sponsor pool) — build on AG Grid Community
(MIT) because 45-day Studio trials end before Dec 15 judging.

**Demo contract:** hosted URL + README-as-judge-interface + zero-credential demo mode; video
<3 min problem-first (90s to "show it working"); canned AI fallback since judges have no LLM keys;
client ID public by design, secret + sandbox passwords via Devpost private testing instructions.

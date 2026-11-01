# Winning Strategy — PayPal AI Hackathon 2026 (research brief draft)

**Deadline:** Nov 12, 2026, 12:00 PT · **Field:** 25,553 registered · **Prize pool:** $67,500+
**Research date:** 2026-10-31 · **Scale:** 4 subagent researchers + lead synthesis

## Executive summary

The hackathon has no prescribed problem statement — the constraint *is* the statement:
**PayPal must be central, AI must be real, the thing must work.** Stage 1 is pass/fail on that
baseline; Stage 2 scores five equally-weighted criteria where **Technological Implementation
breaks ties**. Winning entries across PayPal's own Dev Days and comparable Devpost AI events
share one shape: *one narrow end-to-end loop, a named user with a named problem, and a video
that shows it actually running.* The money is won by (a) a PayPal-deep, AI-native golden flow,
(b) a design that reads as a product rather than a proof-of-concept, and (c) stacking the
AG Grid sponsor prize — the only sponsor pool with 5 slots — alongside a Grand/Honorable bid.

## 1. The gate you must pass before being scored (Stage 1)

Derived verbatim from the official rules:

1. PayPal integration **central**, not decorative; AI genuinely used, not name-dropped
2. Fits theme (agents/automation, money movement, business, consumer, social impact)
3. Working, non-trivial, consistently-running implementation
4. Judges can run it: complete repo run-instructions **or** hosted URL (+ credentials where needed)
5. Public repo, **open-source license detectable in About section**
6. Public YouTube video, **<3 min**, showing it functioning; no copyrighted music
7. English throughout; new/significantly-updated since Oct 1, 2026
8. Third-party SDK usage authorized

Organizer's own advice: *"Make PayPal and AI impossible to miss. Name both in your description,
'Built With' section, and video, and show them working."* (updates page) Judges repeatedly fail
submissions on **baseline requirements alone** — most losses happen before scoring starts.

## 2. What wins Stage 2 (the five criteria, and the evidence behind each)

**Technological Implementation (tie-breaker #1 — prioritize this):**
- **PayPal surface choice (depth ÷ setup):** Orders v2 create/capture driven by an LLM, with the
  JS SDK v6 button as UI, is the top ratio — zero approvals, copy-paste quickstart, real sandbox
  money movement, and a genuine state machine (payer-action-required, patch, refunds) to show depth.
  Secondary: **Invoicing** (16 operations pre-wired as Agent Toolkit/MCP tools = max AI demo per
  hour) or **Subscriptions** (3 API objects + server-side status verification = obvious effort).
- **AI must be the actor:** wire the LLM as *decision-maker* over the money flow via PayPal's
  **Agent Toolkit** (`create_order`, `pay_order`, `create_refund`, `list_disputes`…) or the hosted
  sandbox MCP server — not a chatbot beside a button.
- **Avoid in this timeline:** Payouts (access request + funded account) and Agent Ready/ACP
  (form-gated). Judges have no LLM keys — host the demo (keys server-side) or ship a canned fallback.

**Design:** judges want "a complete, coherent product experience — not just a technical proof of
concept." Negative patterns: backend-heavy with no UI, slick video + thin repo, template look.

**Potential Impact:** "credible, specific case for solving a real problem for a real audience."
Winning precedent is specific-audience + specific-data: health-insurance marketplace, local
businesses, freelancer cash flow. "Everyone" scores zero.

**Innovation/Idea:** the published starter-idea list everyone reads (gift-finder, price-watch,
chat-to-pay, invoice-chaser, NL dashboard) defines the flooded categories — **do not build these.**
White space with official-air cover: agentic **post-purchase** (disputes/refunds/returns — PayPal's
protocol article explicitly names this unaddressed), **verifiable agent spend-mandates** (consent
artifacts; ignored by every published idea list), **WebMCP-style agent-ready storefront** (PayPal's
freshest story, Sep 2026, merchant-gated so a public sandbox recreation is genuinely novel).

**Presentation:** video <3 min, nothing essential past 3:00; structure: 0:00–0:20 problem hook →
0:20–0:40 solution → 0:40–2:30 narrated end-to-end demo → 2:30–2:50 tech+impact → 2:50–3:00 name
and stop. "Show something working within about 90 seconds." Record a backup video. Judges may never
run the app — the video and README must stand alone.

## 3. The demo & repo contract (README-as-judge-interface)

- Hosted URL is optional but strongly implied — judges who don't run it still need a great video;
  judges who do run it hit a README structured as: hero GIF + one-liner + hosted link → prerequisites
  → `.env.example` → exact 5-minute run walkthrough → architecture + "where PayPal & AI are used"
  → how each judging criterion is met → license.
- **Zero-credential demo mode** (observed pattern in the field): full experience works without API
  keys. PayPal **client ID is public by design**; only client secret + sandbox buyer/seller
  passwords stay private → Devpost's non-public testing instructions.
- `.env.example` must ship: `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_ENVIRONMENT`,
  `PORT` + LLM key var. Never commit secrets (organizer explicitly calls this out).
- Sandbox facts: free developer account, Default App, 2 sandbox accounts, ~5 minutes; buyer
  approval happens at `sandbox.paypal.com`; webhooks need public HTTPS (use the simulator).

## 4. Prize strategy (rules §8: one Grand-or-HM **+** one Sponsor prize — they stack)

| Lane | Target | Why |
|---|---|---|
| Main | Grand ($12k/$8k/$5k) or HM ($5k ×5: Most Creative, Most Impactful, **Best Demo Delivery**, Best Use of PayPal+AI, **Best Use of Agentic Commerce**) | 5 equal criteria reward the all-rounder shape |
| Stacked | **Best Use of AG Grid** ($5k/$2k/3×$1k = $10k pool, 5 slots) | Largest sponsor pool; AG Studio = npm install; judges score polish (widgets/theming/layout) — a data-dense app shows this naturally |

Sponsor caveats: AG Studio/Bryntum **45-day trials expire before Dec 15 judging ends** → build on
**AG Grid Community (MIT)** so judges can always evaluate, treat Studio as enhancement. Render
pays credits only; Channel3 needs its API called (and is off-theme for a table-heavy app);
APIMatic is dev-side only (free to adopt, invisible to judges).

## 5. Candidate angles (feeding Phase 2 ideation)

1. **Agentic post-purchase desk** — agent triages disputes/refunds, pulls order history, drafts
   evidence, executes refund via Agent Toolkit with human approval. Low saturation; HM targets:
   Agentic Commerce + Most Impactful.
2. **Guardrailed agent spending mandate** — signed, capped, expiring spend artifact the agent must
   verify before `create_order`/`pay_order`. Highest Innovation; PayPal's consent narrative.
3. **WebMCP agent-ready storefront simulator** — mock storefront exposing structured capabilities,
   agent shops it, real PayPal sandbox checkout. Rides PayPal's newest announcement; best video.

Common core to all three: **Orders v2 + JS SDK button + Agent Toolkit as the AI layer** — swap the
narrative, keep the plumbing. Anti-recommendation: the two explicitly published agentic ideas
(gift-finder, price-watch) — most-copied paths, flaky external data live on stage.

## Open questions / caveats
- Devpost `/updates`, `/forum_topics`, `/project-gallery` returned 403 to fetchers — forum signal
  and real saturation counts UNVERIFIED (inferred from published idea lists instead).
- Whether AG Grid Community alone satisfies the sponsor category vs. AG Studio specifically:
  UNVERIFIED (category name says AG Grid, sponsor messaging says AG Studio).
- Whether merely deploying on Render qualifies for its sponsor prize: UNVERIFIED.
- Judges having no LLM keys: third-party guide only, not official rules — mitigated regardless by
  hosting/canned fallback.

# Implementation Plan — "Agent-Ready Storefront with Spend Mandate" (Idea C+)

**Event:** PayPal AI Hackathon 2026 · **Deadline:** Nov 12, 2026, 12:00 PT (12 days from plan date)
**Status:** ⚠️ **AWAITING USER CONFIRMATION — do not start Phase 1 until the user approves scope, slice order, and cut list.**
**Plan date:** 2026-10-31 · **Sponsor lanes:** Best Use of AG Grid (stacked) + Grand / Best Use of Agentic Commerce / Best Demo Delivery

---

## Golden Demo Flow (click-by-click) — written first; everything below is designed around this

The flow a judge (and the <3min video) sees. Total target: **<90 seconds** to the wow moment.
Runs in **zero-credential demo mode** by default; flipping `.env` to sandbox makes the same flow hit real PayPal.

1. **Open the app** (`http://localhost:5173`). Landing screen shows three panels side by side:
   *Storefront* (left), *Mandate card* (center), *Agent console* (right) — AG Grid audit log docked full-width at the bottom.
   Status chips visible immediately: `PayPal: SANDBOX` or `DEMO MODE`, `LLM: GPT-…` or `SCRIPTED FALLBACK`. *(Proves Stage-1 "runs consistently" in 3 seconds.)*

2. **Browse the storefront.** A curated local catalog (e.g. "Aria's Audio Shop" — 8–10 products) rendered from the backend's structured capabilities endpoint (`/api/storefront`). Each item shows name, price, SKU, agent-facing capability metadata. This is the WebMCP-style "agent-ready" surface.

3. **Mint a mandate.** Click **"Mint Spend Mandate"** → form: cap `US$40.00`, expiry `+15 min`, scope `store:aria-audio, categories:[headphones, cables]`. Submit → backend signs it (HMAC-SHA256 over canonical payload) → mandate card displays: ID, cap, expiry, scope, truncated signature, status `ACTIVE`. *(The consent artifact — innovation story on screen.)*

4. **Give the agent a goal.** In the Agent console, pick the canned goal **"Buy me the best headphones under my mandate"** (free-text box exists for the live-LLM variant). Click **Run agent**.

5. **Watch the agent work — audit log fills live.** AG Grid rows stream in as the agent calls its tools:
   - `list_storefront` → reads structured capabilities
   - `compare_items` → picks best in-scope item ≤ cap
   - `verify_mandate` → **✓ VERIFIED** (green row) — signature valid, item in scope, price ≤ remaining cap
   - `create_order` → PayPal Orders v2 (sandbox: real POST; demo mode: mock order ID)
   - Status moves to **PAYER APPROVAL REQUIRED**

6. **Human approves.** The UI surfaces an approve button (sandbox: redirect to `sandbox.paypal.com` login with buyer account, or the JS-SDK approval URL; demo mode: local "Approve as sandbox buyer" sheet simulating the redirect). After approval → `capture_order` → **CAPTURED** (green), order ID shown, mandate remaining-cap decremented in the card.

7. **THE WOW MOMENT — the block.** Click **"Run violation scenario"**. Agent goal: *"Buy the $299 studio monitor"* (out of scope + over cap). The agent dutifully calls `verify_mandate` → **✗ BLOCKED** — a dramatic red AG Grid row + banner: `SPEND MANDATE VIOLATION — create_order never invoked. Reason: price $299.00 exceeds remaining cap $12.50`. The audit trail proves the money-movement call was *prevented*, not just filtered.

8. **Three-click audit story.** Click any audit row → detail drawer shows the full tool call/verdict JSON (mandate presented, verification result, PayPal order ID where applicable). This is the "provable permission, 3-click audit trail" payoff.

**Recovery line if sandbox hiccups mid-demo:** "That's the real sandbox being live — here's the identical flow in zero-credential demo mode" → toggle demo mode, replay steps 5–7 in <30s.

---

## Requirements Restatement

**Product:**
- A web app where a consumer delegates shopping to an LLM agent but keeps provable control via a signed spend mandate.
- Local curated storefront exposing **structured capabilities** (agent-readable catalog API — WebMCP-style, no real merchant integration).
- User mints a **signed spending mandate**: cap, expiry, scope. Signature verified server-side before any money movement.
- LLM agent shops the storefront and **must** verify the mandate before invoking PayPal **Orders v2** checkout (create → human approval at sandbox.paypal.com → capture), via PayPal Agent Toolkit or direct server calls.
- A mandate-violating attempt is **visibly BLOCKED** before order creation — the demo's wow moment.
- **AG Grid Community (MIT)** audit log records every agent step, tool call, verification verdict, and PayPal state transition.

**Technical:**
- Vite + React + TypeScript frontend · Node + Express backend · one LLM API key via env with deterministic canned fallback when absent · PayPal sandbox via `.env` · no database (in-memory + seed) · no auth.
- Zero-credential demo mode: full golden flow works with no LLM key and no PayPal credentials (mock order + local approval sheet).
- Offline-tolerant golden flow except one optional LLM call + one sandbox checkout.
- README-as-judge-interface, public repo, license, YouTube video <3 min.

**Hard constraints:** solo builder, 12 days; AG Grid **Community** (not Studio — trial expires before judging); no Payouts, no disputes, no Agent Ready/ACP (gated); golden flow must never be knowingly broken at any commit.

---

## Stack Decisions

| Layer | Choice | Why |
|---|---|---|
| Frontend | Vite + React 18 + TypeScript | Fastest known toolchain; no learning curve |
| Grid | **AG Grid Community (MIT)** | Sponsor prize eligibility that survives judging; `ag-grid-react` package only |
| Backend | Node + Express (TS via tsx) | Same language everywhere; trivial HTTP |
| PayPal | Direct Orders v2 REST calls server-side (create / get / capture), optionally wrapped by `@paypal/paypal-api-sdk` or plain fetch | Agent Toolkit evaluated in Slice 6; direct calls are the guaranteed fallback (Toolkit adoption is a stretch, see cut list) |
| Mandate signing | HMAC-SHA256 with server-held `MANDATE_SIGNING_SECRET` (env), canonical JSON payload | Real cryptographic verification, zero deps, honest demo |
| LLM | One OpenAI-compatible chat API (`LLM_API_KEY`, `LLM_BASE_URL`, `LLM_MODEL` env), tool-calling loop on the server | Judges have no keys → canned scripted agent is the default path |
| State | In-memory Maps + seed module; `POST /api/demo/reset` endpoint | Judges break demos; reset button is mandatory |
| Live log transport | Server-Sent Events (SSE) from backend audit bus → AG Grid rows | Simpler than websockets, no extra deps |
| Validation | zod at every API boundary | ECC security rule |

---

## Implementation Phases (vertical slices, demo order — golden flow alive after every slice)

Each slice ends with: golden-flow smoke check → commit → `HACKATHON.md` progress update.

### Phase 1 — Skeleton + audit spine (Day 1)
1. **Repo scaffold** (files: `package.json`, `vite.config.ts`, `tsconfig.json`, `server/` Express entry, `.env.example`, `.gitignore`)
   - Monorepo-ish layout: `client/` + `server/`; Vite proxy `/api` → Express; `npm run dev` runs both.
   - `.env.example`: `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_ENVIRONMENT`, `LLM_API_KEY`, `LLM_BASE_URL`, `LLM_MODEL`, `MANDATE_SIGNING_SECRET`, `PORT`.
   - Complexity: S · Deps: none · Risk: LOW
2. **Audit event bus + AG Grid log** (files: `server/src/audit/bus.ts`, `server/src/routes/events.ts` (SSE), `client/src/components/AuditGrid.tsx`)
   - Backend `audit.log(event)` → in-memory ring buffer (last 500) + SSE push. Frontend AG Grid Community renders rows (timestamp, actor, tool, verdict, summary), auto-height, detail drawer stub.
   - Every later slice only *emits events*; the log is the spine. Complexity: M · Risk: LOW

### Phase 2 — Storefront + mandate (Days 2–3)
3. **Storefront seed + capabilities API + UI** (files: `server/src/data/catalog.ts`, `server/src/routes/storefront.ts`, `client/src/components/Storefront.tsx`)
   - 8–10 seeded items (one shop, e.g. audio gear), `GET /api/storefront` returns agent-oriented JSON (items + capability descriptors: how to search/filter/buy). UI grid of product cards.
   - Complexity: S · Risk: LOW
4. **Mandate minting + verification core** (files: `server/src/mandate/sign.ts`, `server/src/mandate/verify.ts`, `server/src/routes/mandate.ts`, `client/src/components/MandateCard.tsx`, `client/src/components/MintDialog.tsx`)
   - Mint: cap, expiry, scope → canonical payload → HMAC sign → store in-memory → return mandate. Verify function: signature ✓, not expired, amount in scope, remaining cap. Unit tests written FIRST (RED→GREEN) for: valid, tampered signature, expired, over-cap, out-of-scope.
   - Complexity: M · Risk: M (canonicalization bugs — mitigate with strict ordered-key serialization + tests)

### Phase 3 — Agent + the BLOCK (Days 4–6) ← the demo's core
5. **Deterministic agent loop + tool layer, canned mode** (files: `server/src/agent/tools.ts`, `server/src/agent/loop.ts`, `server/src/routes/agent.ts`, `client/src/components/AgentConsole.tsx`)
   - Server-side agent with tools: `list_storefront`, `compare_items`, `verify_mandate`, `create_order`, `capture_order`. Each tool emits an audit event. Canned scripted mode replays a fixed plan for the two demo goals (compliant purchase, violation attempt) — no LLM needed. `POST /api/agent/run { goalId }` → SSE progress.
   - Complexity: M · Risk: M (agent loop scope creep — the loop is a fixed tool dispatcher, NOT a general ReAct engine)
6. **Mandate guard + violation scenario** (files: `server/src/agent/guard.ts`, `client/src/components/Banner.tsx`)
   - Hard server-side rule: `create_order` tool throws unless `verify_mandate` succeeded for that exact cart (guard state keyed by agent run). Violation → `SPEND_MANDATE_VIOLATION` audit event (severity: BLOCKED) → red row + banner. Also the natural place for a "tamper with the mandate" demo button (forge signature → verify fails) as bonus proof.
   - Complexity: M · Risk: LOW — this slice is the wow; polish it first when time allows.
7. **Mock checkout state machine** (files: `server/src/paypal/mock.ts`, order state transitions in audit log)
   - `create_order` → mock order id, status `PAYER_APPROVAL_REQUIRED`; local "Approve as buyer" sheet; `capture_order` → `COMPLETED`, cap decremented.
   - Golden flow now fully demoable end-to-end with zero credentials. Complexity: M · Risk: LOW

### Phase 4 — Real PayPal + real LLM (Days 7–9)
8. **PayPal sandbox integration** (files: `server/src/paypal/client.ts`, `server/src/paypal/orders.ts`)
   - OAuth client-credentials token cache → `POST /v2/checkout/orders` (intent CAPTURE) → approval URL surfaced in UI → redirect/return handling (no webhooks — poll `GET /v2/checkout/orders/:id`) → `POST .../capture`. `PAYPAL_ENVIRONMENT` switch; any sandbox error falls back to mock mode with a visible amber chip (never a dead screen).
   - Complexity: M · Risk: **HIGH** (sandbox flakiness, buyer-account login friction — mitigated by mock fallback + rehearsed recovery line)
9. **Live LLM integration** (files: `server/src/agent/llm.ts`, prompt + tool schema wiring)
   - Same tool layer, driven by tool-calling chat completions. Timeout (~10s) → automatic fall back to canned script with visible amber chip. Free-text goal input enabled only when LLM active.
   - Complexity: M · Risk: M (nondeterminism — canned path is the demo of record; LLM is the bonus)

### Phase 5 — Win package (Days 10–12)
10. **Hardening** — one Playwright E2E walking the golden flow (3× green), error states on every step, keyboard walkthrough, `ecc:security-audit`, zod pass. Complexity: M · Risk: LOW
11. **Demo UX polish** — reset button, demo-mode toggle, responsive check at 375px, one signature animation (banner slam on BLOCK), design pass per anti-slop rules. Complexity: S–M · Risk: LOW
12. **README + video + submission** — README-as-judge-interface (hero GIF, 5-min run, `.env.example`, architecture, "where PayPal & AI are used", criterion mapping, license), record video <3min (backup recording), Devpost submission checklist, hosted deploy (optional, low priority). Complexity: M · Risk: M (video timing — nothing essential past 3:00)

---

## Dependencies

- **Mandate verify (Slice 4) → guard (Slice 6) → PayPal create (Slice 8):** guard is the only legal path to `create_order`; build in that order.
- **Audit bus (Slice 2) → everything:** every slice emits events; do not build any feature without its audit events.
- **Mock checkout (Slice 7) before real sandbox (Slice 8):** guarantees golden flow liveness independent of PayPal.
- **Canned agent (Slice 5) before LLM (Slice 9):** canned path is the fallback and the demo of record.
- **E2E test (Slice 10) depends on all golden-flow slices;** video (Slice 12) depends on 10 + 11.
- External: sandbox PayPal developer account + 2 sandbox accounts (set up on Day 1, ~5 min); one LLM API key (optional).

## Risks

| Level | Risk | Mitigation |
|---|---|---|
| **HIGH** | PayPal sandbox flakiness / buyer-login friction breaks demo | Mock mode is the default; sandbox error → auto-fallback with amber chip; rehearsed recovery line; poll instead of webhooks (no public HTTPS needed) |
| **HIGH** | 12 days solo + video + submission | Cut list is binding; slices are demo-ordered so a stop at any point still yields a demoable app; video scripted from the golden flow above |
| **MEDIUM** | LLM nondeterminism mid-demo | Canned deterministic agent is the record path; LLM call has 10s timeout + fallback; LLM shown as enhancement |
| **MEDIUM** | Mandate canonicalization / signature bugs | Strict ordered-key canonical JSON; TDD on verify() edge cases in Slice 4 before anything consumes it |
| **MEDIUM** | Agent loop scope creep (building a general agent framework) | Fixed tool-dispatcher design; two canned goals only; no memory, no planning beyond scripted steps |
| **MEDIUM** | AG Grid Community vs Studio ambiguity for sponsor category | Community-only dependencies; README names "AG Grid Community (MIT)"; Studio listed as future enhancement, never required |
| **LOW** | SSE/proxy quirks in dev | Vite proxy configured in Slice 1; ring buffer replay on reconnect |
| **LOW** | Judges break the in-memory demo | Visible Reset button + demo mode from Slice 11 (endpoint exists from Slice 1) |

## Estimated Complexity

- Overall: **M** (well-understood stack, one integration each with PayPal and an LLM, no DB, no auth).
- Per slice: S (1, 3, 11-partial) · M (2, 4, 5, 6, 7, 8, 9, 10, 12). No XL slices by design.
- Time budget: ~9 build days + 3 harden/package days within 12, leaving ~2 days of slack for sandbox and video retries.

---

## CUT LIST (binding — scope creep is the #1 hackathon killer)

Explicitly OUT unless every phase above is done early and the user re-approves:

1. **Refunds / post-purchase / disputes** — sandbox dispute seeding unreliable (already cut in idea matrix).
2. **Payouts** — gated access, unfunded account.
3. **Agent Ready / ACP protocol compliance** — form-gated; we are "WebMCP-style", not protocol-certified. README wording must say "inspired by", never "compliant".
4. **Auth / multi-user / persistence / database** — in-memory only.
5. **Webhooks** — poll order status instead (avoids public HTTPS requirement).
6. **PayPal Agent Toolkit adoption** — direct REST calls are the guaranteed path; Toolkit wiring is a nice-to-have refactor in Phase 4 only if time remains.
7. **AG Grid Studio / Bryntum** — trial expires before judging; never a dependency.
8. **Subscriptions / invoicing** — different API objects, dilutes the single golden loop.
9. **Multiple storefronts / real merchant integration / actual WebMCP spec compliance.**
10. **Mobile-native polish** — only a 375px sanity check.
11. **Free-text agent goals as the primary demo** — canned goals are the record; free text is bonus when LLM key present.
12. **Hosted deploy beyond a basic free-tier URL** — optional; README + video carry judging weight.

---

**⚠️ PLAN STATUS: AWAITING USER CONFIRMATION.** Reply with approval (or edits to scope, slice order, storefront theme, or cut list) before Phase 1 begins. Next actions on approval: scaffold repo, seed catalog, commit this plan, set `HACKATHON.md` to `Status: phase-4`.

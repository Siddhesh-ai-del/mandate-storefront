# Mandate Storefront

**Delegate shopping to an AI agent that must verify a signed spend mandate before it can move money through PayPal.**

[![PayPal AI Hackathon 2026](https://img.shields.io/badge/PayPal%20AI%20Hackathon-2026-0070E0)](paypalaihackathon.devpost.com)
[![AG Grid Community](https://img.shields.io/badge/AG%20Grid-Community%20(MIT)-0093D5)](https://www.ag-grid.com)

> **Judge this in 60 seconds:** `npm install && npm run dev` → open http://localhost:5173 →
> click **Mint Spend Mandate** → **Run: compliant goal** → **Approve & capture**.
> Then **Run: violation goal** and watch the red banner slam. Zero credentials needed.

---

## Why this exists

AI agents can already shop for you. Nothing stops them from buying the wrong thing with
your money. Mandate Storefront makes permission **cryptographic, scoped, and auditable**:

- The human signs a **spend mandate** — a cap, a category scope, an expiry — as an
  HMAC-SHA256-signed artifact.
- The agent's `create_order` tool **hard-fails server-side** unless that exact cart
  passed `verify_mandate` in the same run. No UI check, no prompt hoping — the money
  path itself refuses.
- Every tool call, verdict, and block streams to an **AG Grid audit log** in real time.

**The demo moment:** the agent tries to buy $299 studio monitors under a $40
headphones-and-cables mandate. `verify_mandate` rejects it, `create_order` is never
invoked, and a full-width **SPEND MANDATE VIOLATION** banner slams down. The audit log
shows the BLOCKED verdict with the cryptographic reason.

## The golden flow (90 seconds)

| Step | You do | System does |
|---|---|---|
| 1 | Open the app | Chips report `PayPal: DEMO MODE`, `LLM: SCRIPTED FALLBACK` — honest degraded state, never a dead screen |
| 2 | **Mint Spend Mandate** ($40, headphones+cables, 15 min) | Server canonicalizes the payload, signs HMAC-SHA256, returns mandate + signature |
| 3 | **Run: compliant goal** | Agent reads the storefront, picks the best in-scope item (HD-700, ★4.8), calls `verify_mandate` → ✓ VERIFIED, then `create_order` → PayPal order `PAYER_APPROVAL_REQUIRED` |
| 4 | **Approve & capture (sandbox buyer)** | Human-in-the-loop payer approval → capture → `COMPLETED` → mandate remaining drops $40.00 → $5.01 |
| 5 | **Run: violation goal** | Agent attempts the $299 monitors → `OUT_OF_SCOPE` → banner slams, **no order created** |

## Architecture

```
client/                          server/
├─ App.tsx          panels + SSE ├─ index.ts          Express, /api, health, reset
├─ components/                    ├─ src/audit/bus.ts  event ring buffer (500) + SSE
│  ├─ Storefront.tsx              ├─ src/mandate/      sign.ts · verify.ts · TDD 8/8
│  ├─ MandateCard.tsx             ├─ src/agent/        guard.ts · tools.ts · loop.ts · llm.ts
│  ├─ AgentConsole.tsx            ├─ src/paypal/       client.ts (OAuth) · orders.ts · mock.ts
│  ├─ Banner.tsx                  └─ src/routes/       events · storefront · mandate · agent
│  └─ AuditGrid.tsx  AG Grid
└─ index.css        control-room theme
```

**The guard** (`server/src/agent/guard.ts`) is the security core: `create_order` requires
a single-use cart fingerprint (runId + mandateId + sku + amount + category) marked by a
passing `verify_mandate`. Verification is consumed on use — one verify, one order.

## Where PayPal and AI are used

**PayPal (Orders v2, intent CAPTURE):**
- `server/src/paypal/client.ts` — OAuth2 client-credentials with token cache
- `server/src/paypal/orders.ts` — create order (with `custom_id: mandate:<id>`), poll
  status (no webhooks), capture. **Auto-degrades to the mock state machine on any
  sandbox error** — the amber `WARN` audit event tells you why, the demo continues.
- Flip `.env` (`PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET`) to run the identical flow
  against a real sandbox.

**AI (two modes, honest chips):**
- **SCRIPTED FALLBACK** (default, zero credentials) — a deterministic tool-dispatcher
  agent. This is the *demo of record*: judges see the same behavior every time.
- **LIVE** (`LLM_API_KEY` + `LLM_BASE_URL` + `LLM_MODEL`, OpenAI-compatible) — real
  tool-calling loop over the same tool layer, 10s timeout, auto-fallback to canned on
  any failure. Free-text goal input unlocks only when live.

**AG Grid Community (MIT):** the audit dock — time / actor / tool / verdict / summary,
real-time via SSE, verdict cells color-coded (BLOCKED rows red-tinted).

## Run it

```bash
npm install
npm run dev        # server :3001 + client :5173
```

Optional switches (see `.env.example`):

```bash
cp .env.example .env
# PayPal sandbox:  PAYPAL_CLIENT_ID=... PAYPAL_CLIENT_SECRET=...
# Live LLM:        LLM_API_KEY=... LLM_BASE_URL=https://api.openai.com/v1 LLM_MODEL=gpt-4o-mini
# Mandate secret:  MANDATE_SIGNING_SECRET=$(openssl rand -hex 32)
```

Tests:

```bash
npm run typecheck   # tsc --noEmit
npm test            # vitest — mandate verify 8/8 (tamper, expiry, cap, scope, foreign secret)
npm run e2e         # playwright — golden flow, violation block, reset (3 specs)
```

## Judging criteria mapping

| Criterion | Evidence |
|---|---|
| **Technological Implementation** (tie-break) | HMAC-signed mandate artifact with canonical JSON + timing-safe compare; single-use server-side guard on the money path; PayPal Orders v2 OAuth + capture; SSE audit stream; AG Grid Community |
| **Use of PayPal** | Orders v2 CAPTURE intent end-to-end (create → payer approval → capture), sandbox facade with graceful degradation, mandate id embedded in `custom_id` |
| **Use of AI** | Tool-calling agent over a WebMCP-style storefront capabilities API; deterministic fallback for reliability; server never trusts the model (guard enforces) |
| **Innovation** | Permission layer agents don't have today: scoped, expiring, cryptographically-enforced spend mandates — "provably permissioned commerce" |
| **Demo delivery** | 90-second golden flow, zero-credential default, honest mode chips, live audit log, Reset button |

## Constraints (by design)

- In-memory state only (no DB, no auth) — it's a demo of the *mechanism*.
- One storefront ("Aria's Audio", 9 SKUs), two canned goals.
- "WebMCP-style" — inspired by agent-commerce protocols, not certified compliant.
- AG Grid **Community** only; Studio is never a dependency.

## License

MIT

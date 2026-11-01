# Mandate Storefront

[![CI](https://img.shields.io/github/actions/workflow/status/Siddhesh-ai-del/mandate-storefront/ci.yml?branch=main&style=for-the-badge&color=0F172A&labelColor=0F172A&label=CI&logo=githubactions&logoColor=white)](https://github.com/Siddhesh-ai-del/mandate-storefront/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-0F172A?style=for-the-badge&logo=opensourceinitiative&logoColor=white)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-0F172A?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-0F172A?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)

**Delegate AI shopping to a signed, server-enforced spend mandate — an agent can browse, compare, and check out through PayPal only within the cap, categories, and window you sign.**

## Overview

Mandate Storefront is a working reference implementation of a permission layer for
agentic commerce. The human signs a spend mandate (cap, category scope, expiry) as an
HMAC-SHA256 artifact; an AI agent shops a storefront and can move money through PayPal
Orders v2 **only** after a server-side verification of that exact cart. Exceed the
mandate and the money path refuses — visibly.

Built for the [PayPal AI Hackathon 2026](https://paypalaihackathon.devpost.com).

### Core principles

| Principle | What it means in this codebase |
|---|---|
| **Permission is cryptographic** | The mandate is canonicalized JSON signed with HMAC-SHA256. Verification uses timing-safe comparison. Prompt text is never permission. |
| **The money path refuses** | `create_order` throws `SPEND_MANDATE_VIOLATION` unless a single-use cart fingerprint (run + mandate + SKU + amount + category) passed `verify_mandate` in the same run. No UI check, no model goodwill. |
| **Honest states** | Zero credentials is the default and fully functional. Every degraded mode (demo PayPal, scripted agent) is a visible status chip — never a dead screen. |
| **Auditable by default** | Every tool call, verdict, and block streams over SSE into an AG Grid Community audit log in real time. |

## Why Mandate Storefront

AI agents that can shop can also overspend. Three documented failure modes this
project targets:

1. **Prompt-level permission is unenforceable.** "Only spend $40" in a system prompt
   is a suggestion. A scoped, signed artifact checked server-side is a guarantee.
2. **Agent demos are fragile.** Judges see inconsistent behavior, dead screens, and
   credential-dependent flows. Here the deterministic path is the demo of record;
   live integrations degrade gracefully with visible chips.
3. **Money movement without an audit trail is unacceptable.** Payments need a
   legible record of who attempted what, and why it was allowed or blocked.

## Capabilities (shipped)

- **Spend-mandate mint & verify** — cap, category scope, expiry; canonical JSON,
  HMAC-SHA256, timing-safe compare; TDD-covered (8/8: tamper, expiry, over-cap,
  out-of-scope, foreign secret, partial-spend edge).
- **Agent-readable storefront** — one seeded shop (9 SKUs) with WebMCP-style
  capability descriptors (`search_items`, `get_item`, `start_checkout`).
- **Deterministic agent core** — fixed tool dispatcher with two scripted goals
  (compliant purchase, violation attempt). This is the demo of record.
- **Live LLM mode (optional)** — OpenAI-compatible tool-calling loop over the same
  tool layer, 10s timeout, automatic fallback to the scripted path.
- **PayPal Orders v2** — mock state machine by default; sandbox facade (OAuth
  client-credentials, create/poll/capture) with auto-degrade on any error.
- **Human-in-the-loop capture** — the agent can never capture; only the payer approves.
- **Real-time audit log** — AG Grid Community over SSE with ring-buffer replay.
- **The violation banner** — full-width slam when the mandate gate rejects a cart.
- **Judge-proofing** — reset endpoint + button, E2E suite (3 specs), 375px support.

## Project status

**v0.1.0 — functional pre-release.** Built end-to-end for a hackathon; the golden
flow is E2E-tested and runs with zero credentials. Not audited; not production
infrastructure (in-memory state, no auth, single tenant — by design).

### Roadmap

| Phase | Scope | Status |
|---|---|---|
| 0.1.0 | Golden flow: mandates, agent core, mock checkout, audit log, sandbox + LLM facades | **Shipped** |
| 0.2 | Live PayPal sandbox verification (real developer account end-to-end) | Planned |
| 0.2 | Live LLM verification against a real provider | Planned |
| 0.3 | Persistence, multi-user auth, mandate revocation | Planned |
| — | Refunds, payouts, webhooks, protocol certification | Explicitly out of scope |

## Installation

Requires [Node.js](https://nodejs.org) **22.9+** and npm (the dev scripts use the
Node-native `--env-file-if-exists` flag). No local Node? Use Docker below.

```bash
git clone https://github.com/Siddhesh-ai-del/mandate-storefront.git
cd mandate-storefront
npm install
npm run dev        # API on :3001, app on http://localhost:5173
```

Or with Docker (no Node install needed):

```bash
git clone https://github.com/Siddhesh-ai-del/mandate-storefront.git
cd mandate-storefront
docker compose up  # app on http://localhost:5173
```

Open http://localhost:5173 — no credentials required. Optional integrations
(PayPal sandbox, live LLM) are configured via `.env`; see `.env.example`.

```bash
npm run typecheck   # tsc --noEmit
npm test            # vitest — mandate verify suite
npm run e2e         # playwright — golden flow, violation block, reset
```

## Architecture

```
Browser (React + AG Grid) ──SSE──▶ audit bus (ring buffer, replay)
       │
       ▼ REST /api
Express server
  ├─ mandate      sign · verify (HMAC-SHA256, timing-safe)
  ├─ agent        tools · guard (single-use cart fingerprint) · loop · llm
  ├─ paypal       client (OAuth) · orders facade · mock state machine
  └─ routes       events · storefront · mandate · agent
```

The security core is `server/src/agent/guard.ts`: `create_order` requires a verified,
single-use fingerprint of the exact cart. Verification is consumed on use — one
verification, one order.

## Repository layout

```
mandate-storefront/
├── client/src/            React app (panels, AgentConsole, Banner, AuditGrid)
├── server/                Express API
│   ├── index.ts
│   └── src/
│       ├── agent/         guard · tools · loop · llm
│       ├── audit/         event bus (SSE)
│       ├── mandate/       sign · verify (+ TDD suite)
│       ├── paypal/        client · orders · mock
│       └── routes/        events · storefront · mandate · agent
├── e2e/                   Playwright golden-flow specs
├── docs/                  plan, research, design flavors, demo assets
└── .github/               CI, templates, CODEOWNERS
```

## Contributing

Contributions welcome — see [CONTRIBUTING.md](CONTRIBUTING.md) for the TDD and
coverage standards this project holds (the mandate-verify suite must stay green).
All participation is governed by the [Code of Conduct](CODE_OF_CONDUCT.md).

## Security

Report vulnerabilities privately via
[GitHub Security Advisories](https://github.com/Siddhesh-ai-del/mandate-storefront/security/advisories/new).
See [SECURITY.md](SECURITY.md) for scope and guarantees.

## Support

See [SUPPORT.md](SUPPORT.md). Short version: GitHub issues and discussions; no SLA
at this stage.

## License

[MIT](LICENSE) — see [LICENSE](LICENSE).

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-11-01

First functional release. Built for the PayPal AI Hackathon 2026.

### Added

- Spend-mandate core: canonical-JSON HMAC-SHA256 signing, timing-safe verification
  (signature, expiry, scope, remaining cap) with TDD suite (8/8).
- Agent-readable storefront: seeded 9-SKU catalog with WebMCP-style capability
  descriptors and REST API.
- Deterministic agent: fixed tool dispatcher (`list_storefront`, `compare_items`,
  `verify_mandate`, `create_order`) with two scripted demo goals.
- Server-side mandate guard: `create_order` requires a single-use verified cart
  fingerprint; throws `SPEND_MANDATE_VIOLATION` otherwise.
- Mock PayPal Orders v2 state machine with human-in-the-loop payer approval and
  capture; mandate cap decremented on capture.
- PayPal sandbox facade: OAuth client-credentials token cache, create/poll/capture,
  automatic degrade to mock mode with visible audit warning on any error.
- Live LLM mode: OpenAI-compatible tool-calling loop over the same tool layer,
  10-second timeout, automatic fallback to the scripted path; free-text goal input
  only when live.
- Real-time audit log: SSE event bus with 500-event ring buffer and reconnect
  replay, rendered in AG Grid Community with verdict-coded cells.
- Violation banner with slam animation (respects `prefers-reduced-motion`).
- Demo reset (endpoint + UI button) clearing all server state.
- Playwright E2E suite (golden flow, violation block, reset).
- Neo-brutalist design system selected from five documented flavor mockups
  (`docs/flavors/`); responsive to 375px.
- GitHub Actions CI: typecheck, unit tests, production build, E2E.

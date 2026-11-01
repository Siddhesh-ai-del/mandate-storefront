# Security Policy

## Reporting a Vulnerability

Report security vulnerabilities **privately** via
[GitHub Security Advisories](https://github.com/Siddhesh-ai-del/mandate-storefront/security/advisories/new).
Please do **not** open public issues for security reports.

Include:

- Description of the issue and its impact
- Reproduction steps or a proof of concept
- Affected version (commit SHA or release tag)

You will receive an acknowledgment within 72 hours and a substantive response
within 7 days. Reports are handled discreetly; credit is given unless you prefer
anonymity.

## Scope

This project is a reference implementation built for a hackathon. In scope:

- Bypass of the server-side spend-mandate guard (`server/src/agent/guard.ts`,
  `server/src/mandate/`) — any path where money movement can occur without a
  valid, in-scope, unexpired mandate verification.
- Signature forgery, canonicalization exploits, or timing attacks against
  mandate verification.
- Unauthorized state mutation via the API (including the demo reset endpoint).

Out of scope:

- The mock PayPal state machine and demo-mode behavior (they move no real money).
- Denial of service against the local demo server.
- Issues requiring a compromised `MANDATE_SIGNING_SECRET` or `.env` exposure.
- Social-engineering of the demo payer-approval step (it is a deliberate,
  visible human-in-the-loop control, labeled as such).

## User Guarantees

- This application runs entirely locally by default: no credentials are required,
  no telemetry exists, and no data leaves your machine.
- `.env` is gitignored; the signing secret is read from the environment only and
  is never returned by any API endpoint.
- With PayPal sandbox credentials configured, order data flows to PayPal's
  sandbox environment only (`PAYPAL_ENVIRONMENT=SANDBOX`); production endpoints
  are never contacted unless explicitly configured.

## Supported Versions

Only the latest release on `main` receives security fixes.

# Contributing to Mandate Storefront

Thanks for considering a contribution. This project holds a small, strict set of
standards — they exist because the core guarantee (a money path that refuses
unauthorized movement) must never regress.

## Ways to contribute

- **Bug reports** — use the [bug report form](https://github.com/Siddhesh-ai-del/mandate-storefront/issues/new?template=bug_report.yml).
- **Feature ideas** — use the [feature request form](https://github.com/Siddhesh-ai-del/mandate-storefront/issues/new?template=feature_request.yml). Explain the problem first.
- **Code** — pick up an issue or open a PR against `main`.

All participation is governed by the [Code of Conduct](CODE_OF_CONDUCT.md).

## Development setup

```bash
git clone https://github.com/Siddhesh-ai-del/mandate-storefront.git
cd mandate-storefront
npm install
npm run dev
```

## Standards for code changes

### Test-Driven Development is mandatory

1. Write a failing test first (RED).
2. Implement the minimum to pass (GREEN).
3. Refactor with tests green.

### The mandate-verify suite must stay green

`server/src/mandate/` and `server/src/agent/guard.ts` are the security core. Every
existing case (tampered signature, expiry, over-cap, out-of-scope, foreign secret,
single-use fingerprint) must continue to pass, and new enforcement rules need new
RED→GREEN cases.

### Coverage

Minimum 80% on server code (`npm test`). E2E (`npm run e2e`) must pass for any
change touching the golden flow (mint → agent run → approve → capture, and the
violation block path).

### Before you push

```bash
npm run typecheck
npm test
npm run build
npm run e2e
```

CI runs the same four gates.

## Commit conventions

Conventional Commits: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `ci:`,
`chore:`, `perf:`. One sentence summary, imperative mood.

## Pull requests

- Use the PR template checklist.
- Keep PRs focused; the golden flow must remain demoable at every merge.
- Scope discipline: this project has an explicit cut list (see `docs/plan.md`).
  Refunds, payouts, webhooks, and persistence are out of scope for now — propose
  before building.

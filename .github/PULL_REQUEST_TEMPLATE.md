## Type of change

- [ ] Bug fix (non-breaking)
- [ ] New feature (non-breaking)
- [ ] Breaking change
- [ ] Documentation / tooling only
- [ ] Security-related (also requires a private advisory report)

## What this PR does

<!-- Clear description of the change and why it is needed. -->

## Checklist

- [ ] Tests added or updated for the changed behavior (TDD: test written first)
- [ ] `npm run typecheck` passes
- [ ] `npm test` passes (mandate/guard suite green, coverage ≥ 80% on server)
- [ ] `npm run build` passes
- [ ] `npm run e2e` passes (required for golden-flow changes)
- [ ] No secrets, keys, credentials, or `.env` content committed
- [ ] Commit messages follow Conventional Commits
- [ ] Golden flow still demoable: mint → run → approve → capture, and violation → BLOCKED

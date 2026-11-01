# Devpost Submission Checklist — PayPal AI Hackathon 2026

**Deadline: Nov 12, 2026, 12:00 PT (20:00 UTC)** · submissions close — no grace period.
**Owner actions below need the user's accounts (YouTube, Devpost, GitHub).**

## Required by rules (verified against official page 2026-10-31)

- [ ] **Public GitHub repo** with the full source
  - [ ] `git remote add origin … && git push` (6 commits ready: `155a609..cbea9b4`)
  - [ ] Confirm `.env` is gitignored (it is — verify no secrets in history before push)
  - [ ] Repo description + topics (paypal, ai, agentic-commerce, ag-grid)
- [ ] **Public YouTube video, ≤3 minutes**
  - [ ] Record per `docs/video-script.md` (two takes, backup the second)
  - [ ] Upload public, paste link in Devpost
- [ ] **How We Built It** (≤500 chars) — draft below
- [ ] **One-liner title** — "Mandate Storefront — provably permissioned AI shopping"
- [ ] **Built-With list**: PayPal Orders v2 API, Node/Express, React, TypeScript,
  AG Grid Community, OpenAI-compatible LLM API (optional), HMAC-SHA256

## Prize eligibility boxes to tick

- [ ] **Best Use of AG Grid** — README names AG Grid Community (MIT) + screenshot of
  audit dock in the gallery
- [ ] **Best Use of Agentic Commerce / PayPal** — README "Where PayPal and AI are used"
  section maps directly
- [ ] Screenshots gallery: landing, compliant flow mid-run, capture complete,
  violation banner slam, audit grid (≥4 images, 375px screenshot already in docs/)

## How We Built It (draft, <500 chars)

> "Mandate Storefront started with the failure mode: agents that can buy can overspend.
> We designed the money path first — create_order refuses unless a single-use HMAC-signed
> spend mandate verified that exact cart server-side. Built TDD (8/8 verify tests), mock
> PayPal Orders v2 first with auto-degrading sandbox facade, deterministic agent as demo
> of record with live tool-calling LLM as bonus. Every tool call streams to an AG Grid
> Community audit log over SSE. E2E-tested golden flow (Playwright 3/3). MIT licensed."

## Pre-submit verification (T-24h and T-2h)

- [ ] Fresh clone → `npm install && npm run dev` works on a clean machine
- [ ] `npm run typecheck && npm test && npm run e2e` all green on pushed HEAD
- [ ] Video link opens in private window (public visibility confirmed)
- [ ] Repo link opens logged-out (public visibility confirmed)
- [ ] All links on Devpost page resolve
- [ ] GitHub username matches Devpost account (eligibility rules)

## Decision log

- Deploy/hosting: **optional** (cut list #12) — README + video carry judging weight.
  Revisit only if everything above is done with ≥2 days spare.
- PayPal sandbox live run: user's developer account needed (5 min setup) — optional
  for judging (demo mode is legitimate), but strengthens the video if time allows.

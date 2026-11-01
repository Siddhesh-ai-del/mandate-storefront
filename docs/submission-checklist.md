# Devpost Submission Checklist — PayPal AI Hackathon 2026

**Deadline: Nov 12, 2026, 12:00 PT (20:00 UTC)** · submissions close — no grace period.
**Owner actions below need the user's accounts (YouTube, Devpost, GitHub).**

## Required by official rules ("What to Submit", re-verified 2026-11-01)

- [x] **Public code repo — all source, assets, instructions, license in About**
  - https://github.com/Siddhesh-ai-del/mandate-storefront — public, 11 commits,
    CI green ×3. GitHub detects **MIT** → About sidebar shows "MIT license"
    (verified via `gh api repos/… --jq .license`)
  - [x] `.env`/secrets absent from all history (`git log -S` + security-audit)
  - [ ] Add About topics: `paypal`, `ai-agents`, `agentic-commerce`, `ag-grid` (owner, 15s)
- [x] **Functional demo judges can run** — satisfied by option 1 (repo instructions;
  hosted URL is the alternative and stays cut). Fresh-clone rehearsal green:
  install → typecheck → 8/8 → build → 3/3 E2E on a clean machine. **Plus Docker**:
  `docker compose up` → app on :5173, image built + full UI smoke verified in-container
  (both with .env → LLM: LIVE and without → SCRIPTED FALLBACK); node:22.9+ trap fixed
  (`engines` + README) so the npm path can't fail on old Node
  - [ ] T-24h / T-2h re-run of the rehearsal on pushed HEAD (below)
- [ ] **Text description** — How We Built It draft below
- [ ] **Tools: name the AI model/service + explain how used** — draft below
- [ ] **Public YouTube video, ≤3 min** — record per `docs/video-script.md` (2 takes)
  - [ ] Voiceover only / royalty-free audio — **no copyrighted music or material**
  - [ ] Shows the project running in a desktop browser (its build target)
  - [ ] Upload public, paste link in Devpost; nothing essential past 2:25
- [ ] **One-liner title** — "Mandate Storefront — provably permissioned AI shopping"
- [ ] **Built-With list**: PayPal Orders v2 API, Node/Express, React, TypeScript,
  AG Grid Community, OpenRouter + NVIDIA Nemotron 3 Ultra (free tier, tool-calling),
  HMAC-SHA256, Playwright

## Prize eligibility boxes to tick

- [ ] **Best Use of AG Grid** — README names AG Grid Community (MIT) + screenshot of
  audit dock in the gallery
- [ ] **Best Use of Agentic Commerce / PayPal** — README "Where PayPal and AI are used"
  section maps directly
- [ ] Screenshots gallery: landing, compliant flow mid-run, capture complete,
  violation banner slam, audit grid (≥4 images, 375px screenshot already in docs/)

## Tools — how the AI is used (Devpost "Tools" field, draft)

> AI model: **NVIDIA Nemotron 3 Ultra (550B)**, OpenAI-compatible function-calling API
> free-tier served by **OpenRouter** (`nvidia/nemotron-3-ultra-550b-a55b:free`).
> It drives the agent's tool loop — `list_storefront`, `compare_items`,
> `verify_mandate`, `create_order` — for free-text shopping goals: the model picks
> items itself, then must pass server-side mandate verification before checkout.
> Chosen by benchmarking 4 free tool-capable models against our exact schema.
> With no key configured, a deterministic scripted agent runs the same tool layer
> as the demo of record (10s timeout → automatic, visibly-chipped fallback).
> PayPal Orders v2 API creates/captures orders; HMAC-SHA256 signs spend mandates.

## How We Built It (draft, <500 chars)

> "Mandate Storefront targets one failure mode: agents that can buy can overspend. We
> designed the money path first — create_order refuses unless a single-use HMAC-signed
> spend mandate verified that exact cart server-side. Built TDD (8/8 verify tests), mock
> PayPal Orders v2 with auto-degrading sandbox facade, deterministic agent as demo of
> record plus live OpenRouter tool-calling LLM. Every tool call streams to an AG Grid
> Community audit log over SSE. Playwright E2E 3/3. MIT licensed."

## Pre-submit verification (T-24h and T-2h)

- [ ] Fresh clone → `npm install && npm run dev` works on a clean machine
- [ ] `npm run typecheck && npm test && npm run e2e` all green on pushed HEAD
- [ ] Video link opens in private window (public visibility confirmed)
- [ ] Repo link opens logged-out (public visibility confirmed)
- [ ] All links on Devpost page resolve
- [ ] GitHub username matches Devpost account (eligibility rules)

## Decision log

- Deploy/hosting: **optional** (cut list #12) — repo instructions satisfy the official
  functional-demo requirement (option 1); hosted URL stays cut. Revisit only if
  everything above is done with ≥2 days spare.
- PayPal sandbox live run: **user's developer account creation failed (2026-11-01)** —
  DEMO MODE is legitimate and is what the script shows; if the account gets fixed,
  two `.env` values switch the identical flow to real Orders v2, no code change.
- Live LLM: configured with user's zero-credit OpenRouter key — model
  `nvidia/nemotron-3-ultra-550b-a55b:free` proven in rehearsal (11–25s per run);
  ~50 free requests/day → 1 practice run + 2 takes is comfortable.

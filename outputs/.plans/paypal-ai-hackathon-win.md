# Deep Research Plan — paypal-ai-hackathon-win
**Topic:** How to win the PayPal AI Hackathon (Nov 12, 2026 deadline): API/tooling choices, winning patterns, sponsor-prize strategy
**Date:** 2026-10-30

## Key questions
1. **Q1 — PayPal surface:** Which PayPal developer capabilities are fastest to
   integrate meaningfully in sandbox (Orders v2? Billing? Payouts? Buttons
   SDK?), and which best demonstrates "PayPal is central, not bolted-on"?
2. **Q2 — Winning patterns:** What did winners/strong entries in past PayPal
   hackathons and analogous "payments + AI" Devpost challenges do? What does
   Stage-1 pass/fail actually filter out?
3. **Q3 — Agentic commerce angle:** What is the current state of agentic
   commerce (AI agents that transact), and what would make a 13-day-buildable
   entry credible for the $5k "Best Use of Agentic Commerce" prize?
4. **Q4 — Sponsor prize strategy:** Concrete requirements for AG Grid /
   Render / Channel3 / APIMatic / Bryntum sponsor prizes — which are cheap
   add-ons to an already-strong main entry?
5. **Q5 — Saturation:** With 25,553 participants, which idea categories will
   be saturated (chatbot-on-checkout) and where is the white space?

## Evidence needed
- Official PayPal developer docs (API list, sandbox setup time, quickstarts)
- Official hackathon pages: rules (have), FAQs, resources page, webinars
- Prior PayPal/Devpost winner galleries + "how to win" postmortems
- Agentic commerce references (industry + hackathon-appropriate builds)
- Sponsor tool docs for effort estimates

## Scale decision
**Subagent mode — 4 `general` subagents** (broad, multi-faceted survey; OpenCode
adaptation: `researcher` agent does not exist → use `general`). One synthesis
round; lead-owned draft, cite, review (no `verifier`/`reviewer` agents — direct
adaptation: lead does verification).

## Task ledger
| Key | Owner | Task | Output |
|-----|-------|------|--------|
| T1 | general subagent | PayPal platform APIs: options, sandbox setup, "central integration" patterns, docs URLs | outputs/.drafts/paypal-ai-hackathon-win-T1.md |
| T2 | general subagent | Winning patterns: past PayPal/Devpost winners, Stage-1 filters, presentation/pitfalls | outputs/.drafts/paypal-ai-hackathon-win-T2.md |
| T3 | general subagent | Agentic commerce + white-space analysis for 25k-participant field | outputs/.drafts/paypal-ai-hackathon-win-T3.md |
| T4 | general subagent | Sponsor prizes (AG Grid, Render, Channel3, APIMatic, Bryntum): requirements + effort | outputs/.drafts/paypal-ai-hackathon-win-T4.md |
| Lead | lead | Draft → cite → verify → deliver final brief + provenance | outputs/paypal-ai-hackathon-win.md |

## Verification log
- 2026-10-31: 4/4 subagent outputs verified on disk (729 lines total). Lead cross-checked all
  rules-critical claims against own direct fetch of official rules page — PASS.
- 2026-10-31: Verification file written: 0 FATAL, 3 MAJOR (disclosed), 2 MINOR (accepted).
  Participant count 25,553 resolved from lead's HTML fetch (was UNVERIFIED in T3).

## Decision log
- 2026-10-30: Plan written before evidence per command contract.
- 2026-10-30: 4 subagents chosen (broad survey), general agent substituted for researcher (per command's OpenCode adaptation header).
- 2026-10-31: User confirmed plan ("yes") → evidence gathering launched in parallel.
- 2026-10-31: Direct-search citation path used (lead cites + verifies; no verifier/reviewer agents exist in OpenCode — command adaptation).

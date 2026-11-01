# Video Script — <3:00 hard stop (Devpost requirement: public YouTube, ≤3 min)

**Format:** screen recording + voiceover. Target 2:40. **Nothing essential past 2:25.**
**Backup:** record twice; upload the second if the first has any stumble.
**Rehearsal status:** every beat below was executed end-to-end by automated run
(`ALL BEATS PASSED`, ~18s machine-speed). Live-LLM segment measured 11–25s across runs.

## Pre-flight (do this 5 min before recording)

- [ ] `npm run dev` → chips must read **`PAYPAL: DEMO MODE`** + **`LLM: LIVE`**
      (`LLM: SCRIPTED FALLBACK` = `.env` not loaded or server started without it)
- [ ] One practice run of the full sequence first (also burns any cold-start rate limit)
- [ ] Free model has a daily request budget (~50) — plenty for 2 takes, not for 10

## Script (timed)

| Time | Screen | Voiceover |
|---|---|---|
| 0:00–0:10 | Title card → app landing (chips visible) | "Every AI agent that can shop for you can also buy the wrong thing with your money. Mandate Storefront gives agents permission you can prove — and a hard server-side stop when they exceed it." |
| 0:10–0:33 | Mint mandate ($40 / headphones+cables) → Sign | "I sign a spend mandate: forty dollars, headphones and cables only, fifteen minutes. The server canonicalizes it and signs it with HMAC-SHA256. This one artifact is the only permission the agent gets." |
| 0:33–1:03 | Run compliant goal — audit rows stream in real time | "The agent reads the storefront, compares the headphones in scope, and picks the best-rated one under my cap. Before any money moves, its verify-mandate tool runs server-side: signature, expiry, scope, remaining cap — all checked. Verified." |
| 1:03–1:18 | Approve & capture → remaining drops to $5.01 | "It opens a PayPal order — but it cannot capture. Only I, the payer, can approve. Capture completes, and the mandate drops from forty dollars to five-oh-one." |
| 1:18–1:48 | **Re-mint (2 clicks) → type free-text goal → `LLM: LIVE` chip → watch rows stream → approve** | "So far, two scripted buttons — my deterministic demo of record. Now I re-mint and hand the model a goal that isn't in any script: *'buy the best-rated headphones under forty.'* No code path planned this. The model reads the catalog itself, picks, verifies my signed mandate server-side, and opens the order. Real tool calls — about fifteen seconds, no script." |
| 1:48–2:10 | Run violation goal → banner slams → BLOCKED row tails into view | "And when it steps outside the lines? I ask for the two-hundred-ninety-nine-dollar studio monitors. Outside scope, over cap. The verification fails — and because create-order *requires* a verified cart fingerprint, the money path refuses. No order exists. The violation is in the audit log, with the cryptographic reason." |
| 2:10–2:25 | Audit grid scroll + reset + mode chips | "Every tool call streams into this AG Grid audit log in real time. Zero credentials to run — flip one env var and the same flow hits real PayPal sandbox. Reset any time a judge wants to try to break it." |
| 2:25–2:40 | Title card: repo URL + "MIT" | "Mandate Storefront. Permission you can prove. Code and setup in the repo — sixty-second run inside." |

## Recording notes (learned from rehearsal)

- **Re-mint** = exactly 2 clicks: `Re-mint` → `Sign new mandate` (form is pre-filled) → fresh $40
- **Live-LLM latency varies** (11–25s measured). Keep narrating over it — do **not** click again
  (a second click would queue a second run). If it ever fails, the chip flips to
  `SCRIPTED FALLBACK` and the canned buttons still work — keep rolling, mention honest degrade.
- **Audit grid auto-tails** the newest row into view — but only when you're at the bottom.
  If you scrolled up inspecting history, scroll back down before the violation beat.
- Approve-sheet button appears ~1–2s after a run completes (mock capture is instant).
- The violation banner animates a slam (skipped under `prefers-reduced-motion` — leave it on).

## Recording checklist

- [ ] Browser zoom 100%, window ≥1280×800, notifications off, bookmarks bar hidden
- [ ] Cursor highlight on (Zoom/Screen Studio), steady pace, no rapid scrolling
- [ ] Record cold (empty audit grid → streaming rows is the story); one practice run before, then wipe by `Reset demo`
- [ ] Voiceover: script once through for practice, then record for real
- [ ] Verify nothing essential happens after 2:25
- [ ] Export ≤3:00, upload as **public** on the user's YouTube, paste link into Devpost
- [ ] **Audio: voiceover only or royalty-free** — no copyrighted music/material
  (official rule); PayPal is named nominatively only (describing the integration)
- [ ] Second recording as backup before editing the first

## Title / YouTube description draft

- **Title:** Mandate Storefront — provably permissioned AI shopping with PayPal
- **Description:** PayPal AI Hackathon 2026 submission. An AI agent shops a storefront but must verify a signed, scoped, expiring spend mandate before PayPal Orders v2 checkout — server-side enforced. Demo includes a live LLM tool-calling run (free OpenAI-compatible model) plus the deterministic scripted agent. AG Grid Community audit log. Repo: <PASTE>

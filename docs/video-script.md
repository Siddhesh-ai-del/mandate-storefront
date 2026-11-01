# Video Script — <3:00 hard stop (Devpost requirement: public YouTube, ≤3 min)

**Format:** screen recording + voiceover. Target 2:45. **Nothing essential past 2:30.**
**Backup:** record twice; upload the second if the first has any stumble.

## Script (timed)

| Time | Screen | Voiceover |
|---|---|---|
| 0:00–0:15 | Title card → app landing (chips visible) | "Every AI agent that can shop for you can also buy the wrong thing with your money. Mandate Storefront gives agents permission you can prove — and a hard server-side stop when they exceed it." |
| 0:15–0:40 | Mint mandate ($40 / headphones+cables) | "I sign a spend mandate: forty dollars, headphones and cables only, fifteen minutes. The server canonicalizes it and signs it with HMAC-SHA256. This is the artifact the agent must present." |
| 0:40–1:15 | Run compliant goal — watch audit rows stream | "The agent reads the storefront, compares the headphones in scope, and picks the best-rated one under my cap. Before any money moves, its verify-mandate tool runs server-side: signature, expiry, scope, remaining cap — all checked. Verified." |
| 1:15–1:35 | Approve & capture → remaining drops to $5.01 | "It opens a PayPal order — but it cannot capture. Only I, the payer, can approve. Capture completes, and my mandate's remaining balance drops from forty dollars to five-oh-one." |
| 1:35–2:10 | Run violation goal → banner slams, audit shows BLOCKED | "Now the fun part. I ask the agent to buy the two-hundred-ninety-nine-dollar studio monitors. Outside scope, way over cap. The verification fails — and because create-order *requires* a verified cart fingerprint, the money path refuses. No order exists. The violation is in the audit log, with the cryptographic reason." |
| 2:10–2:30 | Audit grid scroll + reset + mode chips | "Every tool call streams to this AG Grid audit log in real time. The whole demo runs with zero credentials — flip one env var and the same flow hits real PayPal sandbox. Reset any time a judge wants to break it." |
| 2:30–2:45 | Title card: repo URL + "MIT" | "Mandate Storefront. Permission you can prove. Code and setup in the repo — sixty-second run inside." |

## Recording checklist

- [ ] Browser zoom 100%, window ≥1280×800, notifications off, bookmarks bar hidden
- [ ] Cursor highlight on (Zoom/Screen Studio), steady pace, no rapid scrolling
- [ ] Before recording: mint → run → capture once manually so audit rows look lived-in? NO — record cold, the empty→full grid is better
- [ ] Voiceover: script once through for practice, then record for real
- [ ] Verify nothing essential happens after 2:30
- [ ] Export ≤3:00, upload as **public** on the user's YouTube, paste link into Devpost
- [ ] Second recording as backup before editing the first

## Title / YouTube description draft

- **Title:** Mandate Storefront — provably permissioned AI shopping with PayPal
- **Description:** PayPal AI Hackathon 2026 submission. An AI agent shops a storefront but must verify a signed, scoped, expiring spend mandate before PayPal Orders v2 checkout — server-side enforced. AG Grid Community audit log. Repo: <PASTE>

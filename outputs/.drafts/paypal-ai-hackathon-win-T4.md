# T4 Findings — Sponsor prize strategy (PayPal AI Hackathon 2026)

Sources fetched live. Devpost pages (paypalaihackathon.devpost.com) return 403 to
automated fetches, so sponsor-page details are sourced from the PayPal developer
blog, sponsor blogs (AG Grid, Bryntum), and ReconScribe's detailed guide (which
quotes the Devpost sponsor pages). Anything not confirmed by a primary/official
page is marked **UNVERIFIED**.

---

## 1. Sponsor prizes + official eligibility requirements

Prize structure confirmed by PayPal's official developer blog
(https://developer.paypal.com/community/blog/PayPal_AI_Hackathon/):

| Sponsor | Prize | Eligibility requirement (per sponsor's own materials) |
|---|---|---|
| **AG Grid / AG Studio** | 1st $5,000 · 2nd $2,000 · 3rd ×3 $1,000 (= $10k pool, largest sponsor pool) | Must meaningfully use AG Grid tools. AG Grid's own hackathon blog pushes **AG Studio** (embedded dashboards, custom widgets, Studio Agent Framework); judges reportedly score "polish (custom widgets, theming, layout) and use of the Studio Agent Framework" (per ReconScribe quoting the Devpost AG Grid page — https://reconscribe.com/paypal-ai-hackathon-2026/). Free **45-day trial licence** for AG Studio + official PayPal boilerplate repo (https://github.com/paypaldev/hackathon-paypal-ag-grid-boilerplate) offered (https://www.ag-grid.com/blog/hackathon-paypal-and-ag-studio/). Whether plain AG Grid **Community** (MIT) alone satisfies the category vs. AG Studio specifically is **UNVERIFIED** — the category name on PayPal's blog is "Best Use of AG Grid" but all sponsor messaging says "AG Studio". |
| **APIMatic** | ×3 @ $1,000 cash (+ 6-month APIMatic Business subscription per ReconScribe; subscription value UNVERIFIED) | Must use the **APIMatic Context Plugin for PayPal** — it injects real PayPal SDK context into coding agents (Claude Code etc.) (https://www.apimatic.io/product/context-plugins). Works "without extra credentials" per ReconScribe quoting the Devpost APIMatic page. Participants who used it get 1 free month of APIMatic Basic (UNVERIFIED beyond ReconScribe). |
| **Bryntum** | ×3 @ $1,000 | Must build with Bryntum **Gantt, Scheduler, or Calendar** (Grid alone likely insufficient — Bryntum's blog names those three products). "Working proof of concept with AI functionality as a genuinely useful feature," public GitHub repo + YouTube demo. Bryntum CEO Mats Bryntse judges the category (https://bryntum.com/blog/hackathon-paypal-and-bryntum/). Free **45-day trial** licence. |
| **Channel3** | $1,500 (single winner) | Must **actually call the Channel3 API or MCP server** — "projects that only mention Channel3 without calling its API or MCP server do not qualify" (ReconScribe quoting Devpost channel3 page; https://reconscribe.com/paypal-ai-hackathon-2026/). Free API key without credit card + 20,000 free API credits with promo code `PAYPAL-HACKATHON-2026` (UNVERIFIED against Devpost page directly). |
| **Render** | 1st $1,000 · 2nd $750 · 3rd $500 — **paid in Render credits, NOT cash** | Must use Render tools; positioning is "deploy and orchestrate AI agents at scale with **Render Workflows**" (https://developer.paypal.com/community/blog/PayPal_AI_Hackathon/). $50 in Render credits offered to participants (per ReconScribe). Whether simply deploying (hosting) the app on Render satisfies the category, vs. using Render Workflows specifically, is **UNVERIFIED** — no explicit "deploying counts" statement was found on an official page. |

Rules context: rules section 8 allows **one Grand/Honorable-Mention prize plus one
Sponsor prize** per project; using multiple sponsor tools makes you eligible for
each but you can still win only one
(https://paypalaihackathon.devpost.com/details/faqs, as surfaced in search
snippets; full text at https://paypalaihackathon.devpost.com/rules — direct
fetch 403).

## 2. Effort estimate for a data-table-heavy AI app

- **AG Grid / AG Studio — LOW effort, highest fit.** AG Grid Community (MIT,
  `ag-grid-community`) is free with all core table features
  (https://github.com/ag-grid/ag-grid). AG Studio is an npm install
  (`ag-studio-react`) and drops an embedded, user-editable dashboard on top of
  plain arrays of objects — quick start is ~30 lines
  (https://www.ag-grid.com/studio/react/quick-start/). For a data-dense
  AI+PayPal app (transactions, reconciliation, dashboards) this is the most
  natural fit: tables, charts, custom widgets, and an agent framework ship
  together. Risk: Studio is a licensed product (Enterprise Licence page exists);
  the hackathon trial is 45 days, shorter than the judging window (see §4).
- **Render — LOW effort.** Deployment target; essentially "point your repo at
  Render." Adds no UI work. Value is credits only (not cash), so it's a cost
  offset, not a win worth optimizing for.
- **Bryntum — MEDIUM effort.** High-performance Gantt/Scheduler/Calendar/Grid
  components (https://bryntum.com/products/gantt/). Meaningful only if your app
  has a time dimension (payment schedules, subscription renewal calendar,
  delivery timelines). Bryntum's own warm-up ideas tie payments to scheduling
  (late payment blocks a phase, rental slot locks until payment clears)
  (https://bryntum.com/blog/hackathon-paypal-and-bryntum/). 45-day trial licence.
- **APIMatic — LOW effort (dev-time only).** Context Plugin installed into your
  coding agent (`npx context-plugins install ...` per community docs
  https://github.com/stood/docs); it improves the correctness of generated
  PayPal SDK code rather than adding a product feature. Weak visual story for a
  "data-dense" demo, but nearly free to adopt. Includes 6-month Business
  subscription with prize (UNVERIFIED).
- **Channel3 — MEDIUM effort.** It is a product-graph API: one API for 100M+
  products so AI agents can search/recommend/purchase (https://trychannel3.com/).
  Fits an agentic-commerce shopping agent; irrelevant to a pure
  payments-analytics/table app. $1,500 single prize = 1 winner only.

## 3. Recommendation: which sponsor prize pairs best

**Win Best Use of AG Grid ($5,000 1st place in the largest sponsor pool) with a
data-dense AI+PayPal dashboard.** Rationale:

1. It's the only sponsor pool with 5 prize slots ($10k total) vs 3 for APIMatic
   and Bryntum and 1 for Channel3 (https://developer.paypal.com/community/blog/PayPal_AI_Hackathon/).
2. Judging criteria (equal-weight: technology, design, impact, idea,
   presentation) reward exactly what a data table + AI widgets app shows off —
   visible polish in a 3-minute video (criteria per ReconScribe quoting Official
   Rules).
3. A project can pair this with **either** a Grand Prize **or** an Honorable
   Mention (rules §8) — so targeting AG Grid does not cannibalize the main win;
   it stacks (https://paypalaihackathon.devpost.com/details/faqs).
4. Effort is the lowest of the "real feature" sponsors: AG Studio is npm-install
   and judges score custom widgets/theming/layout explicitly.

Runner-up: **Bryntum** if the app naturally has a scheduling dimension (it has
3 open slots at $1k, judged by Bryntum's CEO, and Gantt-over-payments demos are
visually distinctive). Avoid optimizing for Render (credits only) and Channel3
(single $1,500 slot, off-theme for a table-heavy app).

## 4. Accounts/keys required — can judges evaluate without them?

- **AG Studio / AG Grid:** needs a **trial licence key** (45-day trial). Trial
  ends **before** the judging period ends (Dec 15, 2026) — a trial started Oct 1
  expires ~mid-Nov. Mitigation: start the trial later, or ship AG Grid Community
  (MIT, no key) for the core table and gate Studio features; judges "are not
  required to test your project and may judge only on description, images and
  video," but testing access must stay live until Dec 15
  (https://reconscribe.com/paypal-ai-hackathon-2026/, quoting Official Rules).
- **Bryntum:** same 45-day trial-key issue.
- **APIMatic:** Context Plugin works in your coding agent **without extra
  credentials** (dev-side only) — nothing for judges to log into
  (https://www.apimatic.io/product/context-plugins).
- **Channel3:** API key (no credit card) — key must live server-side; judges
  can't be handed a secret key safely, so the feature must work via your hosted
  demo. Promo gives 20,000 credits (UNVERIFIED).
- **Render:** participant gets $50 credits (UNVERIFIED); hosted demo URL works
  for judges with no account, but the demo must stay up until Dec 15.
- **PayPal itself:** free sandbox, no business account required; include sandbox
  test credentials in README (rules requirement).

**Key implication:** anything keyed/licensed should either (a) be started late
enough that the trial outlives Dec 15, or (b) degrade gracefully to free tiers
(AG Grid Community, hosted demo) so judges can evaluate from the video + public
demo regardless.

---

### Source list
- https://developer.paypal.com/community/blog/PayPal_AI_Hackathon/ (official prize list, dates, partner descriptions)
- https://www.ag-grid.com/blog/hackathon-paypal-and-ag-studio/ (AG Grid sponsor terms, boilerplate, prizes)
- https://www.ag-grid.com/studio/react/quick-start/ (AG Studio effort/tech details)
- https://github.com/ag-grid/ag-grid (Community = MIT/free)
- https://bryntum.com/blog/hackathon-paypal-and-bryntum/ (Bryntum eligibility, judging, ideas)
- https://www.apimatic.io/product/context-plugins (APIMatic Context Plugin, no credentials)
- https://trychannel3.com/ (what Channel3 is)
- https://reconscribe.com/paypal-ai-hackathon-2026/ (secondary; quotes Official Rules §8, FAQ, and each Devpost sponsor page — flagged where used)
- https://paypalaihackathon.devpost.com/details/faqs and /rules (primary; 403 to fetch, content via search snippets)

# T2 Draft — Winning patterns & Stage-1 filters (PayPal AI Hackathon)

**Research method note:** the `websearch` tool returned "No search results found" for every query
(6 distinct queries attempted), so search was executed via `webfetch` against DuckDuckGo's HTML
endpoint (`https://html.duckduckgo.com/html/?q=...`) plus direct page fetches — ~10 distinct search
queries in total. Two target pages (`paypalaihackathon.devpost.com/updates` and `/forum_topics`)
returned HTTP 403 to the fetcher; their content is marked **UNVERIFIED** below where relevant.
All claims carry inline source URLs.

---

## 1. Past winners: what winning projects actually did

### 1.1 PayPal Dev Days 2025 Hackathon (closest precedent — PayPal-run, in-person, 24h)
Source: https://developer.paypal.com/community/blog/winners-dev-days-hackathon/

Format: three challenge tracks (Agentic Integrations; Vibe Coding with Replit; Upgrade Your Legacy
Integration), finalists selected by PayPal engineering/product leaders, then finalists demoed live
"lightning-round… shark tank style" before three PayPal executives (awards ceremony video:
https://youtu.be/v0JKxyZZe2g ; lightning demos: https://youtu.be/cb-AnEcld_M).

Winners and what they built:
- **1st — Team CrawlerPal** (Jordi Montes, Neeraj Jhawar): "a paywall AI agent assistant built with
  PayPal APIs." Prize $5,000 + $8,000 AWS credits + Replit Core.
- **2nd — Team Codebusters**: modernized Shopware 6's PayPal integration from the old JavaScript SDK
  (v5) to the beta PayPal JS SDK (v6) — performance/maintainability modernization. $3,000 + credits.
- **3rd — Team Rosen** (Sida Zhang, Xiaobin Gu): upgraded "Rosen, a global social trading app
  powered by PYUSD." $2,000 + credits.
All from: https://developer.paypal.com/community/blog/winners-dev-days-hackathon/

**Pattern:** every winner was a *working integration* story — one novel agent on top of PayPal APIs,
one deep modernization of an existing integration, one upgrade of a real product onto a PayPal
stablecoin rail. Not slide-ware.

### 1.2 Agent Development Kit Hackathon with Google Cloud (largest comparable AI challenge on Devpost)
Source: https://cloud.google.com/blog/products/ai-machine-learning/adk-hackathon-results-winners-and-highlights
- 10,400+ participants, 62 countries, **477 submitted projects**, 1,500+ agents built.
- **Grand Prize — SalesShortcut** (Merdan Durdyyev, Sergazy Nurbavliyev): multi-agent AI sales
  development representative — lead discovery, research, proposal drafting, AI voice call, email
  follow-up, calendar booking. Project: https://devpost.com/software/salesshortcut
- **Honorable Mention — TradeSageAI** (Suds Kumar): "intelligent multi-agent financial analysis
  platform… ADK, Agent Engine, Cloud Run and Vertex AI" — i.e. a fintech-flavored entry that placed.
  https://devpost.com/software/tradesage-ai
- Regional winners: Energy Agent AI (https://devpost.com/software/energy-agent-ai), Edu.AI
  (https://devpost.com/software/edu-ai-multi-agent-educational-system-for-brazil), GreenOps
  (https://devpost.com/software/greenops-gzp4aj), Nexora-AI (https://devpost.com/software/teachai-upzofa).
- Honorable mentions: Particle Physics Agent, Bleach.

Post-mortem from the winner himself: SalesShortcut was built in 16 days, 5 Cloud Run services,
34 agents; the team debugged a silent-failure pipeline by feeding every agent identical sample
data and walking the flow agent-by-agent; a human approval "stop sign" gates outbound calls.
Source: https://info.devpost.com/blog/hackathon-winning-project-salesshortcut
The team later forked repo public: https://github.com/merdandt/SalesShortcut

**Pattern:** one clear end-to-end loop ("type a city → meeting on the calendar, no step skipped")
beat breadth; honest post-hoc storytelling about debugging and safety gating was published by the
organizer.

### 1.3 Gemini Live Agents Challenge (Devpost AI challenge, individual builder)
Source: https://info.devpost.com/blog/how-iron-man-inspired-a-win-at-the-gemini-live-agents-challenge
- Bryen Param won **Best of Live Agents** with a voice-controllable drone ("a drone you can talk
  to"). Concrete, physical, single hero capability rather than a feature list.

### 1.4 World's Largest Hackathon presented by Bolt (AI, 4-criteria rubric nearly identical to PayPal's)
Source: https://worldslargesthackathon.devpost.com/details/prizes
- Global prizes went to top 10 projects "across all four judging criteria: Potential Impact, Quality
  of Idea, Technological Implementation, and Design & User Experience"; the Grand Prize winner
  "knocked it out of the park across every judging criteria — impact, creativity…".
- Gallery example winner: **HealthPlan AI** — "A web app with an AI voice agent that helps users
  understand and find the right health insurance plan… using real-time data from the federal
  marketplace." https://worldslargesthackathon.devpost.com/project-gallery

**Pattern:** winners scored across *all* criteria, not one; a specific audience + specific data
source shows up repeatedly (health insurance marketplace, local businesses, energy customers).

### 1.5 PayPal Hack-Chicago (older PayPal Devpost event)
Gallery exists and is indexed: https://paypal-hack-chicago.devpost.com/project-gallery
(`/details/winners` returns 404 → winner names/details **UNVERIFIED**; the event is described as
"PayPal, Venmo, and Braintree… 24 hr hackathon to solve financial empowerment").

**Takeaway for T2:** across PayPal's own events and comparable Devpost AI/fintech events, winning
entries (a) ship an end-to-end working flow on the required platform, (b) target a named user with a
named problem, (c) narrow to one hero capability, and (d) come with a story (debugging, safety,
real-user validation) that the organizer can retell.

---

## 2. Official rules + organizer/judge guidance on what is prioritized

### 2.1 The rules (primary source, fetched in full)
Source: https://paypalaihackathon.devpost.com/rules

- **Stage One is pass/fail:** "The first stage will determine via pass/fail whether the ideas meet a
  baseline level of viability, in that the Project reasonably fits the theme and reasonably applies
  the required APIs/SDKs featured in the Hackathon." → A submission that under-uses PayPal APIs or
  drifts off-theme is filtered *before* any scoring, regardless of polish.
- **Stage Two — five equally weighted criteria** (verbatim, abbreviated):
  - *Technological Implementation* — "How thoroughly and skillfully does the project use PayPal
    Developer Platform and AI tool(s)? Does the project reflect genuine effort and a working,
    non-trivial implementation?"
  - *Design* — "complete, coherent product experience — not just a technical proof of concept"
  - *Potential Impact* — "credible, specific case for solving a real problem for a real audience…
    and does the solution actually address that problem based on what's demonstrated?"
  - *Innovation/Idea* — "creative and novel… differs from existing concepts"
  - *Presentation* — "Does the video clearly demonstrate the project working end-to-end? Does the
    pitch communicate what problem is solved, who it's for, and why it matters?"
- **Tie-break:** ties are broken by "the highest score in the first applicable criterion listed
  above" — i.e. **Technological Implementation first**, then Design, Impact, Innovation,
  Presentation; remaining ties go to a judges' vote.
- **Judging may be hybrid:** "This process may utilize expert panels, peer review, automated
  AI-driven analysis, or any combination thereof."
- **Judges are not obliged to run it:** "Judges are not required to test the Project and may choose
  to judge based solely on the text description, images, and video provided in the Submission."
- **Prize taxonomy** (same page): Grand 1st $12,000 / 2nd $8,000 / 3rd $5,000; Honorable Mentions
  $5,000 each — Most Creative, Most Impactful, **Best Demo Delivery**, Best Use of PayPal + AI,
  Best Use of Agentic Commerce; plus sponsor prizes. A project can win at most one Grand Prize
  (or one Honorable Mention) plus one Sponsor Prize (Section 8).

### 2.2 FAQ (organizer guidance)
Source: https://paypalaihackathon.devpost.com/details/faqs
- Team size: no maximum; solo, team, or organization; one member is the Representative who submits.
- "Using a sponsor tool is optional: any AI tool, model, or platform works, **as long as PayPal
  integration is central to your project**." Multiple sponsor tools allowed (one project → max one
  Sponsor Prize + one Grand/Honorable Mention).
- PayPal sandbox account creation is separate from eligibility; eligibility excludes Brazil, Quebec,
  Russia, Crimea, Cuba, Iran, North Korea and other OFAC-sanctioned jurisdictions (Section 3).
- Unresolved questions are directed to the PayPal Discord: https://discord.com/invite/sJ2G6DyvSK

### 2.3 Resources page (organizer-supplied tooling, webinars, inspiration framing)
Source: https://paypalaihackathon.devpost.com/resources
- Four webinars listed, incl. "Start building with PayPal" recording
  (https://www.youtube.com/watch?v=FFJfCW9z3Do), APIMatic Context Plugins (https://youtu.be/zRWixN68tDg),
  "Build a payments dashboard without building a dashboard" (https://www.youtube.com/watch?v=LGfG44i1Fj8),
  and a second "Start building with PayPal" (https://youtu.be/ck_zyB66p_Y).
- Inspiration categories the organizers explicitly pitch: **AI Agents or Automation** (agents that
  "actually transact", agent-to-agent commerce), **Money Movement Experiences**, **Business
  Solutions**, **Consumer Experiences**, **Social Impact** — with concrete example ideas each.
- Core stack pointers: PayPal JS SDK v6, REST API, webhooks, PayPal AI Toolkit
  (https://github.com/paypal/AI-Toolkit), MCP server quickstart (https://docs.paypal.ai/developer/tools/ai/mcp-quickstart),
  Agent Toolkit quickstart (https://docs.paypal.ai/developer/tools/ai/agent-toolkit-quickstart),
  sandbox getting-started repo (https://github.com/paypaldev/getting-started-with-paypal-sandbox).

### 2.4 Updates / Discussions (partially inaccessible)
- `https://paypalaihackathon.devpost.com/updates` and `https://paypalaihackathon.devpost.com/forum_topics`
  returned **HTTP 403** to the fetcher on two attempts each — content **UNVERIFIED**.
- A DuckDuckGo index snippet of `/updates` says a DevRel session had "Jo, Marco, and Eddie from
  PayPal's DevRel team cover the hackathon rules and prizes, the PayPal AI Toolkit, and a full
  sandbox setup. The chapters are in the video description" — snippet only, treat as **UNVERIFIED**:
  https://html.duckduckgo.com/html/?q=paypalaihackathon.devpost.com%2Fupdates
- No organizer post was found that ranks the five criteria informally; the *rules page wording
  itself* is the strongest available statement of priority (tie-break → Technological Implementation).

### 2.5 External judge guidance consistent with the rubric
- Devpost's own judge interviews (5 judges from Square, Databricks, Google, NEAR, Atlassian):
  - Judges first check **baseline requirements** — "it was surprising to see how many submissions
    did not fulfill the basic requirements" (Karen Bajza-Terlouw, Databricks).
  - Screening rounds often literally test "if the application **installs**, whether the basic premise
    is solid, and whether it works at all" (Warren Marusiak, Atlassian).
  - The demo video "gives the most amount of scope… our first indicator of how much time was
    invested" (Richard Moot, Square); "storytelling within the video and the text description
    definitely helps keep the judges engaged" (Karen).
  - Negative scoring drivers: over-indexing one criterion at the detriment of the rest; back-end
    heavy with no UI; "ambiguity… lack of detail and code" (slick video, thin GitHub); submissions
    that shoehorn a pre-existing idea into the prompt; template-only variants; rehashed/already-
    shipped ideas; "the same project with a different label".
  Source: https://info.devpost.com/blog/hackathon-judging-tips
- Devpost's criteria explainer: common criteria are "Technological implementation, Ease of use,
  Demonstration (video), Potential impact, Quality of the idea, Design"; "you'd be surprised how
  many submissions are disqualified simply because they didn't meet the baseline criteria";
  "even the most brilliant ideas can be lost in the shuffle if they don't meet the hackathon's
  criteria." Source: https://info.devpost.com/blog/understanding-hackathon-submission-and-judging-criteria

---

## 3. Common failure patterns in video-judged submissions

### 3.1 Rules-level failure patterns (hard gates)
Source: https://paypalaihackathon.devpost.com/rules
- Video **>3 minutes**: "should be less than three (3) minutes. **Judges are not required to watch
  beyond three minutes**" — anything past 03:00 is at risk of never being seen.
- Video not public on YouTube, or no YouTube link on the form → fails the submission requirement.
- Video "must not include third party trademarks, or copyrighted music or other material unless the
  Entrant has permission" — copyrighted music/trademarks = compliance failure.
- Video must "include footage that shows the Project functioning on the device for which it was
  built" — a slideshow/animation-only video does not satisfy this.
- "A design mockup, static prototype, or non-functional demo does not meet this requirement" —
  static-only entries fail the functional-demo requirement outright.
- Functionality clause: project "must function as depicted in the video and/or expressed in the text
  description" — a video that overclaims a broken build is a rules violation, not a white lie.
- Repo must be public **with a detectable open-source license visible in the About section**;
  missing license → repository requirement failure.
- Non-English materials without English translation of video/description/testing instructions → fail.

### 3.2 Practice-level failure patterns (from success guides)
- **"The best code in the room loses if the demo crashes or the pitch rambles."** Judges see 30+
  presentations; you have ~3 minutes to be memorable.
- Demo "DON'Ts": opening the code editor; showing terminal/console; saying "it's not working right
  now but normally it does…"; demoing half-built features; going over time ("judges literally stop
  listening"). DO: realistic test data, actual device, a second person operating while you narrate,
  showing error handling, recording a backup video in advance.
  Source: https://reskilll.com/blogs/hackathon-demo-presentation-tips-pitch-3-minutes-win-2026/
- What judges write down: "Does it work? (yes/no – most important)", practical value, UX first
  impression, innovation, scale — "code quality, algorithm complexity, lines of code are NOT on this
  list." (same source)
- Video process failures: leaving the video to the last minute (some hackathons give no extensions →
  "your project is ineligible"), AI-generated generic scripts, sped-up audio to fit, private/unlisted
  YouTube settings so judges can't open it, forgetting the "Not for Kids" flag on YouTube (COPPA
  quirk makes it inaccessible), and uploading with no time to spare.
  Source: https://info.devpost.com/blog/6-tips-for-making-a-hackathon-demo-video
- Devpost's own bonus tips: "Don't wait until the last minute to upload your video… Check the
  privacy settings — if it's private, the judges won't be able to access it… Make sure it's a demo!
  Show your project or app in action." (same source)
- Scope failure: "Trying to do too much… guarantees that nothing in your demo works end to end";
  "Your demo should be the focus. It should show what your app does in one flow. If it's too long,
  cut down on your features." Source: https://blog.jetbrains.com/ai/2026/06/how-to-win-a-hackathon-notes-from-the-judging-table/
- Requirement-ignoring failure: "It's not sufficient to just build the app… If you're asked for a
  slide deck and explanations… that needs to be important because it's going to get looked at… if it
  doesn't really nail the prompt, it's going to be hard to give it full points." (Warren Marusiak)
  Source: https://info.devpost.com/blog/hackathon-judging-tips
- Postmortem-style listing of loss causes: "The code was fine. The demo broke on stage, nobody could
  open the repo, the video was an afterthought, or the project ignored the prize the judges were
  actually handing out." Source: https://deonmenezes.com/resources/how-to-win-hackathons
  (personal playbook, not organizer-official — weight accordingly)

---

## 4. What makes a demo "runnable by judges"

### 4.1 The contract in this hackathon's rules (verbatim)
Source: https://paypalaihackathon.devpost.com/rules
- "Provide access to a functional demo of your application. Your project does **not** need to be
  publicly hosted or deployed — but **judges must be able to actually run or interact with a
  working build**. This can be satisfied through clear, complete setup and run instructions in your
  code repository (so judges can build and run it themselves) **OR** a hosted demo URL."
- "A design mockup, static prototype, or non-functional demo does not meet this requirement."
- Testing clause: private sites must include login credentials in testing instructions; include
  "complete setup and run instructions in your project's code repository… along with any test
  account credentials, API keys, or sandbox login details necessary to run and test the Project. If
  your submission requires special access, please include clear instructions for obtaining access
  within your repository's README or project description."
- Repository: public, open source license detectable at top of repo page (About section), containing
  "all necessary source code, assets, and instructions required for the project to be functional."
- Escape hatch: "Judges are not required to test the Project and may choose to judge based solely on
  the text description, images, and video" → the README must *also* read well as documentation, and
  the video must stand alone.

### 4.2 How strong entries structure it (peer/organizer patterns)
- README-as-judge-interface is the norm across comparable Devpost AI hackathons:
  - "Include a README with setup instructions and clear guidance for running your project" (Nebius x
    NVIDIA Global AI Hackathon) https://nebiusglobalaihackathon.devpost.com/
  - "It must include a README with setup instructions, prerequisites, and usage guidelines so judges
    can run your solution" + 2–5 min demo video (Global Innovation Build Challenge V2)
    https://gibc-v2.devpost.com/
  - Submission checklist: "Clear setup instructions (README) so judges can run your project if
    necessary. Recommended: a live deployment or hosted version… Screenshots… list of technologies"
    https://firstcommit.devpost.com/
- Recommended README skeleton (synthesized from the above + PayPal rules): 1) hero GIF/screenshot +
  one-line value prop + hosted-demo link; 2) 60-second "what & who it's for" (Presentation criterion);
  3) Prerequisites (Node/Python versions, PayPal developer account, sandbox client ID/secret);
  4) `git clone` → `install` → `.env.example` → `run` with exact commands; 5) "Run the demo in 5
  minutes" walkthrough with sample data/seed script; 6) test credentials or "zero-credential demo
  mode" note; 7) architecture diagram + where PayPal + AI are used (Technological Implementation);
  8) how each judging criterion is met; 9) license (required by rules).
- Evidence that a zero-credential judging path is used in practice: a Devpost entry titled *PayPal AI
  Checkout Agent* advertises "Real end-to-end purchase in the PayPal Sandbox: agent → order → human
  approval → PayPal checkout page — verified, not mocked" and "**Zero-credential demo mode: judges
  can test the full experience without any API keys**."
  Source (search-index snippet; page returned 403 to fetcher — details **UNVERIFIED** beyond snippet):
  https://devpost.com/software/paypal-ai-checkout-agent
- Judge-side corroboration: preliminary judging rounds check "if the application installs, whether
  the basic premise is solid, and whether it works at all" https://info.devpost.com/blog/hackathon-judging-tips
  and "we play the video or we use a demo… using the project and seeing how it performs"
  (Kelvin Boateng, Google) — same source.
- De-risking the run: "Mock everything you can and make sure all your forms are filled and your back
  and forth flows with the user are smooth" — pre-fill data, mock slow API calls, remove stall points
  (Colin Lowenberg, Nebius) https://blog.jetbrains.com/ai/2026/06/how-to-win-a-hackathon-notes-from-the-judging-table/

---

## 5. Video length strategy (<3 min hard guidance)

- **Hard rule:** video "should be less than three (3) minutes. Judges are not required to watch
  beyond three minutes."
  Source: https://paypalaihackathon.devpost.com/rules
- **Implication:** target ~2:30–2:59 and put nothing essential after the 3-minute mark; the
  Presentation criterion explicitly asks whether "the video clearly demonstrate[s] the project
  working end-to-end" — so the end-to-end run must finish inside the window (same source).
- **Recommended structure (3-minute breakdown, community guide):**
  - 0:00–0:20 Hook — one sentence, one statistic, the problem.
  - 0:20–0:40 Solution — what it does in one sentence (not how).
  - 0:40–2:30 Demo — "THE most important part": open app → core action → proof of result, narrated.
  - 2:30–2:50 Tech + impact — stack, notable AI/PayPal pieces, who it helps.
  - 2:50–3:00 Close — team name, product name, stop talking.
  Source: https://reskilll.com/blogs/hackathon-demo-presentation-tips-pitch-3-minutes-win-2026/
- **Devpost's own guidance (organizer-side, most authoritative after the rules):**
  - "Your project's demo video is one of the most important parts… one of the first things that
    judges will look at… showcase… in around three minutes."
  - Write a script first; allocate seconds to intro / idea / components / demo / closing; "get as
    much as possible covered in the first two to three minutes with key info upfront"; start with
    the elevator pitch and a quick overview because "judges will likely review multiple projects
    back to back"; don't speed up audio to cram content.
  Source: https://info.devpost.com/blog/6-tips-for-making-a-hackathon-demo-video
- **Judge-side timing heuristic:** "You have to be able to show something working within about 90
  seconds. Take the problem you described and show the solution, fast." (Jono Bacon) — plus "scope
  down to one thing" so the demo can be short.
  Source: https://blog.jetbrains.com/ai/2026/06/how-to-win-a-hackathon-notes-from-the-judging-table/
- **Problem-first framing is what judges asked for:** "Say what the problem is that you're solving…
  get your audience of judges sharing your frustration"; "Always be very clear about what problem
  you're solving and what your submission does to address that problem. Sounds obvious, but often
  people skip it." (Avi Press, Scarf) — same source; echoes the Presentation criterion wording in
  the PayPal rules.
- **Backup:** record a backup copy before final upload; if anything breaks, the recorded video still
  satisfies "footage that shows the Project functioning."
  Sources: https://reskilll.com/blogs/hackathon-demo-presentation-tips-pitch-3-minutes-win-2026/ ,
  https://info.devpost.com/blog/6-tips-for-making-a-hackathon-demo-video

---

## 6. Stage-1 (pass/fail) filter checklist — derived from the rules
Source (all items): https://paypalaihackathon.devpost.com/rules
1. PayPal developer platform integration is **central** (also stated in FAQ) — not incidental.
2. An AI tool/model/platform is genuinely used, not name-dropped.
3. Reasonably fits the hackathon theme (agents/automation, money movement, business, consumer,
   social impact — organizer framing at https://paypalaihackathon.devpost.com/resources).
4. Working, non-trivial implementation — installable and "running consistently on the platform for
   which it is intended".
5. Functional demo reachable by judges: complete run instructions in repo **or** hosted URL,
   plus credentials/sandbox keys where needed.
6. Public repo with open-source license detectable in the About section.
7. YouTube video link, public, <3 minutes, showing the project functioning on its target device,
   no copyrighted music/trademarks.
8. English for description, video, and testing instructions.
9. Newly created or significantly updated after Oct 1, 2026 — explain what changed.
10. Third-party SDK/API usage authorized under its terms.

---

## 7. Claims I could not verify
- **UNVERIFIED:** any content from `paypalaihackathon.devpost.com/updates` (403) beyond search-index
  snippets; any forum thread on `paypalaihackathon.devpost.com/forum_topics` (403).
- **UNVERIFIED:** winner identities for PayPal Hack-Chicago (`/details/winners` → 404).
- **UNVERIFIED:** whether PayPal will publish judge feedback or a scoring webinar specific to the
  five criteria — none found on FAQ or Resources pages.
- **UNVERIFIED (tooling):** the native `websearch` tool returned zero results for all 6 queries;
  search evidence above comes from DuckDuckGo HTML via `webfetch`.

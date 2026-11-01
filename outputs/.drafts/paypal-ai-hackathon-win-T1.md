# Draft T1 — PayPal platform surface (hackathon-research brief)

Research date: 2026-10-31. Hackathon submission deadline: **Nov 12, 2026, 12:00 pm PST** (~12 days out) ([rules](https://paypalaihackathon.devpost.com/rules), [dates](https://paypalaihackathon.devpost.com/details/dates)).

---

## 1. PayPal developer capabilities relevant to a ~13-day AI hackathon build

| Capability | What it does | Sandbox setup effort | Docs / quickstart |
|---|---|---|---|
| **Orders v2 API** (create/authorize/capture/show/patch/shipment-tracking) | Core money-in flow: server creates an order (`POST /v2/checkout/orders`), buyer approves, server captures. "Set up your server to call the Orders v2 API instead of making calls directly from the browser." | **Low.** Enabled on a default sandbox REST app; same client ID/secret as everything else. Sandbox base URL `https://api-m.sandbox.paypal.com`. | [Orders integration overview](https://developer.paypal.com/api/rest/integration/orders-api), [Orders v2 API reference](https://developer.paypal.com/api/orders/v2/orders-create), [Order concepts](https://developer.paypal.com/whats-an-order) |
| **Checkout Buttons / JavaScript SDK v6** (PayPal button, advanced cards) | Client-side button rendering; the "minimum amount of code" integration creates + captures an order with the JS SDK on the client and the server SDK on the server. | **Low.** Needs only the public client ID in the SDK script tag (`client-id` fetched from your server). Official quickstart ships a copy-paste `.env` and Node/Python/Java/PHP/Ruby samples. | [Payments quickstart](https://developer.paypal.com/checkout/integrate), [JS SDK v6](https://developer.paypal.com/sdk/js/) (linked from [hackathon Resources page](https://paypalaihackathon.devpost.com/resources)) |
| **PayPal Agent Toolkit** (`npm i @paypal/agent-toolkit` / `pip install paypal-agent-toolkit`) | Function-calling wrappers over PayPal APIs (orders, payments, invoices, subscriptions, catalog, disputes, shipment tracking, merchant insights, transactions) for OpenAI Agents SDK, Vercel AI SDK, LangChain, CrewAI, Bedrock, MCP. TypeScript + Python. | **Very low.** Configured with the same sandbox client ID + secret; "use the sandbox environment for initial testing." | [Agent toolkit quickstart](https://developer.paypal.com/ai-tools/toolkit), [agent tools reference](https://developer.paypal.com/ai-tools/agent-tools), [GitHub paypal/agent-toolkit](https://github.com/paypal/agent-toolkit/) |
| **PayPal MCP server** (local `npx @paypal/mcp` or hosted) | Hosted remote MCP at `https://mcp.sandbox.paypal.com/sse` (SSE) / `/http` (streamable) exposes orders, invoices (7 tools), subscriptions (7 tools), disputes, catalog, shipment tracking, reporting. Works with Anthropic and OpenAI directly. | **Very low** — sandbox endpoint is PayPal-hosted; auth via OAuth access token from your sandbox client credentials. | [MCP server quickstart](https://developer.paypal.com/ai-tools/mcp-server), [LLM integration quickstart](https://developer.paypal.com/ai-tools/build-with-llm), [GitHub paypal/paypal-mcp-server](https://github.com/paypal/paypal-mcp-server) |
| **Subscriptions v1** (products → plans → subscriptions) | Recurring billing: `POST /v1/catalogs/products`, `POST /v1/billing/plans` (plan must be `ACTIVE`), `POST /v1/billing/subscriptions`; JS SDK button with `vault=true&intent=subscription`, then verify status server-side via `GET /v1/billing/subscriptions/{id}` before fulfilling. | **Low–medium.** No extra approval for sandbox, but 3 API objects (product → plan → subscription) plus webhook/lifecycle handling; sandbox auto-processes renewals. | [Integrate subscriptions](https://developer.paypal.com/subscriptions/integrate), [JS SDK v6 subscriptions](https://developer.paypal.com/subscriptions/integrate/v6), [Create plan](https://developer.paypal.com/api/subscriptions/v1/plans-create), [Create subscription](https://developer.paypal.com/api/subscriptions/v1/subscriptions-create) |
| **Invoicing** | Create/send/remind/cancel invoices, QR codes, recurring invoice series, record external payments/refunds — all exposed as Agent Toolkit / MCP tools (natural-language friendly). | **Low.** Same sandbox credentials; no separate onboarding mentioned. | [Invoicing about](https://developer.paypal.com/invoicing/about) (linked from [Resources page](https://paypalaihackathon.devpost.com/resources)) |
| **Payouts** (batch payouts, PayPal + Venmo wallets) | `POST /v1/payments/payouts` batch disbursement, up to 15,000 items, `sender_batch_id` idempotency, Venmo via `recipient_wallet: "Venmo"`. | **Higher.** Docs require you to "Request access to PayPal Payouts" and set up a funded business account; the DropZone/SFTP bulk path needs PayPal onboarding up to 48h. The REST batch API is usable in sandbox with business+personal sandbox accounts, but this is the one surface with a real approval/request step. | [Use Payouts API](https://developer.paypal.com/api/payouts), [Integrate API](https://developer.paypal.com/docs/payouts/standard/integrate-api/), [Payouts setup](https://developer.paypal.com/payouts/use-payouts/set-up) |
| **Agent Ready / Agentic Commerce Protocol (ACP) / UCP** | Lets merchants accept AI-assistant-initiated payments (ChatGPT via Braintree delegated tokens; Google AI Mode/Gemini via Braintree or PayPal Orders v2). | **High / gated.** Agentic Commerce Services require "complete this form to contact the AI team at PayPal and request access"; ACP checkout path documented for Braintree. Not a 13-day bet. | [Agent Ready overview](https://developer.paypal.com/agent-ready/overview), [ACP integration](https://developer.paypal.com/agent-ready/agentic-commerce-protocol), [Agentic commerce services](https://developer.paypal.com/agentic-commerce-services/about) |

Also on the organizers' own "useful payment capabilities" list: Pay Later, Donations, Payment Links/Buttons (low-code), Disputes, Webhooks ([Resources page](https://paypalaihackathon.devpost.com/resources)).

---

## 2. What "PayPal integration must be CENTRAL" means in practice

Official wording and what fails Stage 1:

- **The rule text:** "Entrants must build or update an application that integrates the PayPal developer platform (using the free sandbox environment) along with an AI tool, model, or platform of their choice… Any AI tool works, as long as PayPal integration is central to the project." ([rules](https://paypalaihackathon.devpost.com/rules))
- **Homepage gloss:** "The only fundamental requirement: your project must meaningfully use both PayPal and AI… Meaningfully integrate at least one PayPal technology, API, SDK, product, or developer capability." ([homepage](https://paypalaihackathon.devpost.com/))
- **Stage One gate (pass/fail, before any scoring):** "The first stage will determine via pass/fail whether the ideas meet a baseline level of viability, in that the Project reasonably fits the theme and reasonably applies the required APIs/SDKs featured in the Hackathon." ([rules](https://paypalaihackathon.devpost.com/rules)) — a project where PayPal is decorative is explicitly flagged as at-risk in third-party analysis ([reconscribe.com](https://reconscribe.com/paypal-ai-hackathon-2026/)).
- **Stage Two, criterion #1 (also the first tie-breaker):** "Technological Implementation: How thoroughly and skillfully does the project use PayPal Developer Platform and AI tool(s)? Does the project reflect genuine effort and a working, non-trivial implementation?" ([rules](https://paypalaihackathon.devpost.com/rules))
- **Organizer's "how to stand out" update:** "Make PayPal and AI impossible to miss. Name both in your description, 'Built With' section, and video, and show them working. Give judges something to run… Hide your API keys. Use environment variables, never commit secrets." ([updates](https://paypalaihackathon.devpost.com/updates))
- **Inspiration framing:** PayPal wants agents/workflows that "use PayPal to take action on a user's behalf — not just recommend, but actually transact" ([Resources page](https://paypalaihackathon.devpost.com/resources)).

**Practical checklist to survive Stage 1 and score on Technological Implementation:** (a) money actually moves in sandbox end-to-end (create → approve → capture/verify), (b) the AI decides/triggers/drafts the PayPal action rather than sitting beside a button ([pocketplay guide](https://hackers.pocketplay.win/en/hackathons/paypalaihackathon/): "The AI should choose, draft or trigger the payment action, not just add a chatbot next to a checkout button"), (c) server-side verification (e.g. check subscription status `ACTIVE` before fulfilling — PayPal's own security guidance, [subscriptions v6 guide](https://developer.paypal.com/subscriptions/integrate/v6)).

---

## 3. Sandbox reality check

**Getting credentials (free):**
- "To access the PayPal sandbox environment, use your existing PayPal account or create a free account at https://developer.paypal.com/" ([rules §4](https://paypalaihackathon.devpost.com/rules)); FAQ: "you'll use the free PayPal sandbox, with either an existing PayPal account or a free account" ([FAQs](https://paypalaihackathon.devpost.com/details/faqs)). Homepage says "Get a PayPal Developer account (5 minutes)" ([homepage](https://paypalaihackathon.devpost.com/)).
- New accounts ship with a **Default Application** under Apps & Credentials → copy client ID + secret ([REST get-started](https://developer.paypal.com/api/rest)). Each developer account also gets **2 default sandbox accounts** (personal = buyer, business = seller) with generated email + password, usable at `sandbox.paypal.com/signin`; more accounts creatable under Testing Tools → Sandbox Accounts ([sandbox accounts](https://developer.paypal.com/sandbox-testing/accounts), [REST guide](https://developer.paypal.com/api/rest)).
- Caveat: "You need a PayPal Business account to go live with integrations [and to] test integrations outside of the US" ([REST get-started](https://developer.paypal.com/api/get-started)); country sign-up gaps are routed to the PayPal Discord ([FAQs](https://paypalaihackathon.devpost.com/details/faqs)). Brazil, Quebec, Russia, Crimea, Cuba, Iran, North Korea and other OFAC-sanctioned places are **ineligible** ([FAQs](https://paypalaihackathon.devpost.com/details/faqs)).
- Free sandbox exploration without any account is possible via PayPal's Postman collection ([Postman guide](https://developer.paypal.com/api/rest/postman)).

**Can judges run a sandbox-integrated app without your credentials?**
- Not with *your* credentials baked in — but the rules contemplate exactly this: "Access can be provided… by including complete setup and run instructions in your project's code repository… along with any test account credentials, API keys, or sandbox login details necessary to run and test the Project. If your submission requires special access, please include clear instructions for obtaining access." ([rules, Testing](https://paypalaihackathon.devpost.com/rules))
- Hosted demo is the clean path: "Your project does not need to be publicly hosted or deployed — but judges must be able to actually run or interact with a working build" (hosted URL **or** run instructions; mockups fail) ([rules](https://paypalaihackathon.devpost.com/rules)).
- Judges are **not obligated** to run it: "Judges are not required to test the Project and may choose to judge based solely on the text description, images, and video provided" ([rules](https://paypalaihackathon.devpost.com/rules)) — so the video must stand alone.
- The **PayPal client ID is designed to be public** ("You only need a client ID to get a PayPal payment button", [REST guide](https://developer.paypal.com/api/rest)); it's the **client secret** and sandbox buyer/seller passwords that must stay private (handed over via the non-public Devpost testing instructions / private channel, per [rules](https://paypalaihackathon.devpost.com/rules) and the [pocketplay guide](https://hackers.pocketplay.win/en/hackathons/paypalaihackathon/): "give keys or sandbox logins in the testing instructions, never in the public repo").
- Judges do **not** have their own LLM API keys ([pocketplay guide](https://hackers.pocketplay.win/en/hackathons/paypalaihackathon/)) — either host the demo (keys stay server-side) or fund/mock the AI layer so it runs on a key you provide privately.

**What must go in `.env.example`** (PayPal's own quickstart template, [checkout integrate](https://developer.paypal.com/checkout/integrate)):

```bash
PAYPAL_CLIENT_ID=your_sandbox_client_id      # public, safe to expose client-side
PAYPAL_CLIENT_SECRET=your_sandbox_secret     # server-only, never commit real value
NODE_ENV=development
PORT=3000
# optional: negative testing (sandbox only)
ENABLE_NEGATIVE_TESTING=false
NEGATIVE_TEST_TYPE=INSUFFICIENT_FUNDS
```

Plus, depending on surface: `PAYPAL_ENVIRONMENT=SANDBOX|PRODUCTION` and `PAYPAL_ACCESS_TOKEN` if you use the MCP server ([MCP quickstart](https://developer.paypal.com/ai-tools/mcp-server)); sandbox base URL `https://api-m.sandbox.paypal.com` vs live `https://api-m.paypal.com` ([API requests](https://developer.paypal.com/api/make-api-requests)). Best practices verbatim: "Never hardcode credentials. Keep the .env out of Git… Create orders on the server… Test in sandbox first" ([checkout integrate](https://developer.paypal.com/checkout/integrate)). Organizers reiterate: "Hide your API keys. Use environment variables, never commit secrets" ([updates](https://paypalaihackathon.devpost.com/updates)).

Sandbox gotchas worth pre-loading: sandbox buyer approval happens at `sandbox.paypal.com` (not the live site); sandbox and production credentials are fully separate; webhooks need a public HTTPS URL (PayPal can't reach localhost) — use the Webhooks Simulator for immediate tests ([paypal/ai-toolkit test-accounts](https://github.com/paypal/ai-toolkit/blob/main/commands/test-accounts.md)).

---

## 4. Recommendation (depth ÷ setup time), for a ~13-day build

**Primary: Orders v2 (create/capture) driven by an LLM agent, with the Checkout JS SDK v6 button as the UI.**
- Highest depth-to-setup ratio: the [quickstart](https://developer.paypal.com/checkout/integrate) is copy-paste with a shipped `.env` template, works on the default sandbox app with zero approvals, and Orders v2 carries real surface (intent CAPTURE vs AUTHORIZE, `payer-action-required` state machine, PATCH, shipment tracking, refunds) to satisfy "thoroughly and skillfully… non-trivial implementation" ([rules](https://paypalaihackathon.devpost.com/rules), [Orders reference](https://developer.paypal.com/api/orders/v2/orders-create)).
- It makes the project visibly "PayPal-native": a real PayPal button + real sandbox money movement is what the video must show ([updates](https://paypalaihackathon.devpost.com/updates)).
- Wire the AI in as the *decision-maker* over the money flow — either via [Agent Toolkit](https://developer.paypal.com/ai-tools/toolkit)'s `create_order` / `pay_order` / `create_refund` function calls (OpenAI Agents SDK or Vercel AI SDK), or via the hosted sandbox MCP server (`mcp.sandbox.paypal.com`) — and keep order creation + capture on the server ([orders-api](https://developer.paypal.com/api/rest/integration/orders-api)).

**Secondary: Subscriptions v1 (product → plan → subscription) OR Invoicing.**
- **Subscriptions** if the product has a recurring/agent-service story: three API objects + server-side status verification give obvious "genuine effort" depth and a second PayPal surface judges see in the demo ([integrate](https://developer.paypal.com/subscriptions/integrate), [v6 guide](https://developer.paypal.com/subscriptions/integrate/v6)). Cost: plan activation, lifecycle webhooks.
- **Invoicing** if you want maximum AI-demo-ability per hour: all 16 invoice operations are pre-wired as Agent Toolkit/MCP tools (`create_invoice`, `send_invoice`, `generate_invoice_qr_code`…), so an LLM can "bill this customer" end-to-end in sandbox with near-zero extra plumbing ([agent tools reference](https://developer.paypal.com/ai-tools/agent-tools), [MCP server](https://developer.paypal.com/ai-tools/mcp-server)).

**Avoid for this timeline:** Payouts (access-request + funded business account friction, [payouts setup](https://developer.paypal.com/payouts/use-payouts/set-up)) and Agentic Commerce Services (form-gated onboarding with the PayPal AI team, [about](https://developer.paypal.com/agentic-commerce-services/about)). Both are high-risk inside 13 days.

Ranking summary (depth ÷ setup time): 1) Orders v2 + JS SDK v6 button; 2) Agent Toolkit/MCP over Orders (as the AI layer, not a replacement); 3) Invoicing via agent tools; 4) Subscriptions v1; 5) Disputes/Chargebacks (sandbox-only, needs real prior transaction); 6) Payouts; 7) Agent Ready/ACP/UCP (gated).

---

### Sources
- https://paypalaihackathon.devpost.com/rules
- https://paypalaihackathon.devpost.com/
- https://paypalaihackathon.devpost.com/details/faqs
- https://paypalaihackathon.devpost.com/updates
- https://paypalaihackathon.devpost.com/resources
- https://paypalaihackathon.devpost.com/details/dates
- https://developer.paypal.com/api/rest
- https://developer.paypal.com/api/get-started
- https://developer.paypal.com/checkout/integrate
- https://developer.paypal.com/api/rest/integration/orders-api
- https://developer.paypal.com/api/orders/v2/orders-create
- https://developer.paypal.com/whats-an-order
- https://developer.paypal.com/api/make-api-requests
- https://developer.paypal.com/subscriptions/integrate
- https://developer.paypal.com/subscriptions/integrate/v6
- https://developer.paypal.com/api/subscriptions/v1/plans-create
- https://developer.paypal.com/api/subscriptions/v1/subscriptions-create
- https://developer.paypal.com/ai-tools/toolkit
- https://developer.paypal.com/ai-tools/agent-tools
- https://developer.paypal.com/ai-tools/mcp-server
- https://developer.paypal.com/ai-tools/build-with-llm
- https://developer.paypal.com/ai-tools/get-started
- https://developer.paypal.com/agent-ready/overview
- https://developer.paypal.com/agent-ready/agentic-commerce-protocol
- https://developer.paypal.com/agentic-commerce-services/about
- https://developer.paypal.com/api/payouts
- https://developer.paypal.com/docs/payouts/standard/integrate-api/
- https://developer.paypal.com/payouts/use-payouts/set-up
- https://developer.paypal.com/sandbox-testing/accounts
- https://developer.paypal.com/platforms/create-account
- https://github.com/paypal/agent-toolkit/
- https://github.com/paypal/paypal-mcp-server
- https://github.com/paypal/ai-toolkit/blob/main/commands/test-accounts.md
- https://github.com/paypal/ai-toolkit/blob/main/commands/sandbox.md
- https://paypalaihackathon.devpost.com (Resources → Getting Started with PayPal sandbox: https://github.com/paypaldev/getting-started-with-paypal-sandbox)
- https://hackers.pocketplay.win/en/hackathons/paypalaihackathon/ (third-party, non-official)
- https://reconscribe.com/paypal-ai-hackathon-2026/ (third-party, non-official)

### UNVERIFIED
- Whether a **fresh** developer account's Default REST App has Orders *and* Subscriptions features pre-enabled vs needing a toggle in Sandbox App Settings — docs show feature selection exists ([create-account](https://developer.paypal.com/platforms/create-account)) but no explicit list; assume one toggle click, verify on Day 1.
- Whether Payouts REST API can be self-enabled in sandbox without contacting PayPal: docs say "Request access to PayPal Payouts" ([integrate-api](https://developer.paypal.com/docs/payouts/standard/integrate-api/)) but the setup page also describes a self-serve sandbox app flow ([set-up](https://developer.paypal.com/payouts/use-payouts/set-up)) — ambiguous; treat as possible friction.
- No official PayPal developer-blog post was found that further defines "central" beyond the Devpost rules/FAQ/updates pages; interpretation above is triangulated from those official pages plus two third-party guides (flagged).
- Judges' ability to use a hosted demo's AI features depends on you covering LLM API costs or providing a key privately — inferred from the third-party guide's claim that judges have no AI keys, not from an official rule.

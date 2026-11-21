# MKT Skills VA Toolkit

19 focused skills for real Shopify work: research products, prepare listings, maintain catalogs, review orders, diagnose performance, improve storefronts, and coordinate client assignments. Each workflow covers prerequisites, ordered actions, decision gates, QA, and handoff.

This independent project complements Shopify Sidekick and authorized integrations. Skills guide supervised work; installing them does not connect a store or authorize changes.

[Choose a VA job](docs/va-workflows.md) for the files to provide, or [copy a request](docs/prompt-library.md#practical-va-jobs). Keep client briefs in your ChatGPT or Claude chat/project files. These jobs run when you request them; they do not create schedules or background monitoring.

**ShopifySkills is one plugin containing all 19 workflows.** In a host that
supports installing this plugin, install it once, select **ShopifySkills** in
its plugin picker, and ask:

```text
@ShopifySkills research ceramic mug opportunities for the UK market.
Use public sources, show your evidence, and keep the work read-only.
```

Research uses the host's available tools or your supplied files. **No Shopify
sign-in, local server, or API key is required for the skills-only plugin.**
Connecting private store data is an optional separate step.

**Claude Code (2.1.292 or later), in your terminal:**

```bash
claude plugin install shopify-va-toolkit --marketplace vinceservidad/Shopify-Expert-AI-Skills
```

**Inside a Claude Code session (2.1.275 or later):**

```text
/plugin install shopify-va-toolkit --marketplace vinceservidad/Shopify-Expert-AI-Skills
```

`/plugin` only works inside a session. Typed into a terminal, it fails with
`no such file or directory`. Run `claude plugin details shopify-va-toolkit` to
confirm that 19 skills loaded.

For older versions and other hosts, follow the
[one-time plugin installation guide](docs/ai-agent-setup.md#install-shopifyskills-once).
The repository supplies native Codex and Claude plugin marketplaces and the
[installable v0.2.0 package](releases/v0.2.0/README.md). Existing v0.1.1
downloads remain available; native plugin metadata starts with v0.2.0.

**Directory status:** ShopifySkills is not yet registered in this app's curated
plugin directory. A repository or ZIP does not automatically create an `@`
entry. The exact picker and mention behavior must be verified after installing
or importing the plugin in the intended host; no curated `plugin://` link is
claimed here.

If your ChatGPT or Claude surface cannot import custom plugins, the guide also
covers a [Claude Skill ZIP](docs/ai-agent-setup.md#claude-skills) and
[ChatGPT Project](docs/ai-agent-setup.md#chatgpt-projects-or-ordinary-chats) fallback.
For optional store access, see the [developer MCP guide](docs/plugin-and-connector.md).

## How does it work?

Choose the skill that owns the deliverable. Use `shopify-va` for mixed tasks and add specialists only for distinct decisions.

| Skill | Use it for | Main output |
| --- | --- | --- |
| [shopify-va](skills/shopify-va/) | Mixed routine VA tasks, routing, tracking, QA and handoff | Verified task/initiative record and escalation |
| [shopify-product-research](skills/shopify-product-research/) | Customer, demand, competitor, supplier, economics and risk research | Product validation brief |
| [shopify-product-listing](skills/shopify-product-listing/) | Product content, taxonomy, variants, pricing, inventory, SEO and channels | Source-backed listing draft and QA |
| [shopify-catalog-operations](skills/shopify-catalog-operations/) | Bulk products, taxonomy, tags, metafields, variants, imports and data quality | Governed change plan and reconciliation |
| [shopify-merchandising](skills/shopify-merchandising/) | Assortment, collections, sorting, product cards, bundles and recommendations | Merchandising plan with commercial limits |
| [shopify-order-operations](skills/shopify-order-operations/) | Orders, payments, fulfillment, edits, returns, refunds and cancellations | Verified order action or escalation |
| [shopify-va-training](skills/shopify-va-training/) | Onboarding, SOPs, simulations, permissions, QA and coaching | Competency-based training plan |
| [shopify-store-audit](skills/shopify-store-audit/) | Store-wide journey, trust, merchandising, performance and measurement | Evidence-led issue register |
| [shopify-cro](skills/shopify-cro/) | Funnel diagnosis and controlled conversion experiments | Prioritized experiment backlog |
| [shopify-product-page](skills/shopify-product-page/) | Page structure, copy, proof, offer and mobile UX | Page brief or revised copy |
| [shopify-creative-strategy](skills/shopify-creative-strategy/) | Ad concepts, hooks, briefs and testing | Creative testing matrix |
| [shopify-meta-ads](skills/shopify-meta-ads/) | Meta Ads audits and controlled recommendations | Account diagnosis and decision log |
| [shopify-google-ads](skills/shopify-google-ads/) | Search, Shopping, Performance Max, Merchant Center and measurement | Query, product, campaign and economics audit |
| [shopify-seo](skills/shopify-seo/) | Technical, collection, product, content and internal-linking work | Prioritized SEO roadmap |
| [shopify-email-marketing](skills/shopify-email-marketing/) | Lifecycle strategy, flows, campaigns and measurement | Flow plan and message briefs |
| [shopify-flow-automation](skills/shopify-flow-automation/) | Workflow design and QA | Trigger-condition-action specification |
| [shopify-support](skills/shopify-support/) | Policy-grounded replies, macros and FAQs | Response draft or knowledge gap |
| [shopify-theme-development](skills/shopify-theme-development/) | Liquid, templates, sections, blocks, JavaScript and debugging | Scoped implementation or diagnosis |
| [shopify-analytics](skills/shopify-analytics/) | Store analysis, top-selling products, profit changes and reconciliation | Reconciled performance diagnosis |

## Eight practical VA jobs

Use these repeatable jobs with your client's approved files and store evidence:

| Ask the AI... | What you receive |
| --- | --- |
| “Set up my client's work guide.” | Brand voice, policies, assigned tasks, approvals and escalation roles in one brief. |
| “Plan today's work.” | Prioritized tasks, missing information and decisions needed from the owner. |
| “Check this product listing.” | A comparison against approved facts, content gaps and a review checklist. |
| “Review my product catalog.” | SKU conflicts, inconsistent information and proposed corrections within the checked records. |
| “Review stock.” | Exceptions against the owner's thresholds, with locations and incomplete coverage shown. |
| “Help me answer this customer.” | A policy-based reply draft, verified facts and any escalation needed. |
| “Prepare my handover.” | Drafts ready, verified changes, blocked tasks and next actions. |
| “Train a new VA.” | Task instructions, sample work, exception cases and a reviewer checklist. |
The **0.2.0 release candidate** adds these eight workflows and brings the tool total to **12**. The existing development-store connector remains **0.1.0 with eight tools** until a separate release. Building this candidate does not update that live service.

The eight job workflows are in the upgrade source on [PR #8](https://github.com/vinceservidad/Shopify-Expert-AI-Skills/pull/8). The [job guide](docs/va-workflows.md) links that source download; the main ZIP below still supports the original first-task example.
Three parts work together:

1. **ChatGPT or Claude does the work:** it reads your information and prepares an answer.
2. **This toolkit guides the work:** a *skill* is an instruction guide that tells the AI how to approach a task and check its answer.
3. **An approved Shopify connection allows store access:** a *connector* is a connection between the AI and Shopify. It allows only the reads or changes that its tools and your permissions support.

**You can draft content without connecting Shopify.** Give the AI the product facts or reports yourself. A guide does not give it access to your store.

## Can it edit my Shopify store?

ChatGPT or Claude can make **supported changes** when an approved Shopify integration with write access is available in the same chat. You must also approve the task. Your account permissions and the integration's tools limit what it can change.

Our guides help the AI plan and check that work. **Our own hosted connector is read-only:** it can read products, variants, stock and order summaries, but cannot edit them. See [optional store connections](USAGE.md#connect-your-store-optional) for the differences and setup links.

## How work flows

Provide the task, target store, evidence, acceptance criteria, and exact authorization. Start read-only, resolve prerequisites, follow the owner skill, verify the resulting state, and hand back completed work, blockers, and the next owner.

The shared [Store Operating Lifecycle](skills/shopify-va/references/store-operating-lifecycle.md) is a state model: begin at the earliest unresolved stage that can change the decision. Short jobs need only the relevant stages. Use the [Initiative Record](skills/shopify-va/references/initiative-record.md) for work spanning skills, sessions, or handoffs.

Keep facts, calculations, inferences, assumptions, and unknowns separate. Live changes require explicit scope, permissions, and an available tool. The custom MCP exposes read-only store data; it cannot publish, refund, or change products, inventory, ads, or budgets. A save or successful build does not prove a verified live result or business impact. See [Evidence and authorization](docs/evidence-and-authorization.md).

## Examples, testing, and evidence

- [Five worked examples](docs/worked-examples.md): synthetic teaching cases with inputs, walkthroughs, and explicit limits.
- [Recorded model evaluations](evals/RESULTS.md): complete results, failures, and limitations for the tested cases; other skills do not inherit those results.
- [Repository reliability](docs/reliability.md): tooling setup, validation, packaging guarantees, and remaining coverage.
- [Theme verification](docs/theme-verification.md): Liquid rendering, browser checks, and Theme Check boundaries.

Engineering checks establish package and implementation integrity. They do not prove merchant outcomes, model reliability across all 19 skills, or hosted connector availability. Behavioral scenarios require actual outputs and substantive review before being marked passed.

## Develop and contribute

Coding agents start with [AGENTS.md](AGENTS.md) or [.claude/CLAUDE.md](.claude/CLAUDE.md), then the [product brief](docs/product-brief.md) and [job workflow design guide](docs/job-workflow-design.md). Improve the existing skills and canonical shared references; avoid parallel SOPs or duplicate skills.

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup and required checks, [CHANGELOG.md](CHANGELOG.md) for changes, and the [prompt library](docs/prompt-library.md) for requests. Terminology and platform claims follow the [glossary](GLOSSARY.md), [knowledge taxonomy](KNOWLEDGE-TAXONOMY.md), and [platform currency registry](PLATFORM-CURRENCY.md).

The public release candidate adds a simple app inside Shopify. It shows the checked store, supports store reads, and lets the owner review or disconnect an AI connection. Public setup will start from Shopify; you will not type your store address into our website. The owner must approve each connection request.

**Public store authorization is still being prepared.** The guide is hosted at [mktskills.com/shopify-va](https://mktskills.com/shopify-va), and the permanent candidate endpoint is [shopify-mcp.mktskills.com/mcp](https://shopify-mcp.mktskills.com/mcp). The purchased domain and HTTPS routing are configured. Shopify approval, app-version URL release and live ChatGPT/Claude store authorization are separate requirements; a reachable endpoint is not a verified store connection. [See public release status and checks](docs/public-release.md).

After an approved edit, open the correct store and check the saved result. A draft in a chat is not a saved product, and a saved product is not proof that it is visible to shoppers.

## What should I know before relying on it?

- AI can make mistakes. Review its work against your product facts, reports and store policies.
- It cannot see information you have not supplied or connected. Never share passwords, API keys or unnecessary customer details.
- It does not guarantee expert answers, faster completion, more sales or correct results for every task.
- Our connected-store checks covered one development store with sample data. The original hosted connector verified an empty order response. The later 0.2.0 local package also read an unpaid sample order and both item pages. These checks do not verify every VA task, public installation or the combined ChatGPT/Claude editing setup.
- This is an independent toolkit. It is not an official Shopify product.

## More help

- [How to use the toolkit](USAGE.md): choose a task, prepare your information and troubleshoot.
- [Your first task](docs/getting-started.md): a product-description walkthrough.
- [More sample requests](docs/prompt-library.md): prompts for all 19 guides.
- [Practical VA jobs](docs/va-workflows.md): eight everyday workflows and the information they need.
- [Worked examples](docs/worked-examples.md): practice tasks using made-up sample data.
- [Public release status](docs/public-release.md): what is built, what is live and which checks still need external approval. No public plugin download or one-click installation is claimed before an actual release.

For developers and readers who want the details:

- [Plugin and connector setup](docs/plugin-and-connector.md), including optional MCP setup and Cloudflare hosting.
- [The full work process](skills/shopify-va/references/store-operating-lifecycle.md) and [ongoing-task record](skills/shopify-va/references/initiative-record.md).
- [Test results and limits](evals/RESULTS.md), [repository layout, checks and tooling](docs/reliability.md#repository-structure), and [theme checks](docs/theme-verification.md).
- [Evidence and permissions](docs/evidence-and-authorization.md), [terms explained](GLOSSARY.md), and [platform updates](PLATFORM-CURRENCY.md).
- [Contributing](CONTRIBUTING.md), [changes](CHANGELOG.md), and [MIT license](LICENSE).

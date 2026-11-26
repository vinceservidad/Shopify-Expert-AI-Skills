# Shopify VA Toolkit: 19 Free Skills, Plugins & MCP

19 MIT-licensed Shopify skills and 95 Markdown files for Shopify virtual assistants (VAs), freelancers, and store operators. Each skill covers prerequisites, ordered steps, decision checks, QA, and handoff.

This independent project runs outside Shopify and pairs with Shopify Sidekick and authorized integrations. Installing the skills does not connect a live store or change store data.

## Quick Start

Connect all 19 Shopify skills and their reference files. No Shopify account is required.

### 1. No-login MCP URL (ChatGPT, Claude, Cursor)

Add this URL as a custom MCP server with no sign-in:

```text
https://mktskills.com/mcp/shopify-skills
```

It serves all 19 Shopify skills, their reference files, and 8 VA task workflows read-only. It never asks for a Shopify login.

### 2. One-command CLI installs (all 19 skills)

#### Agent Skills CLI (Claude Code, OpenAI Codex, Cursor, Windsurf, GitHub Copilot, Antigravity)

```bash
npx skills add vinceservidad/Shopify-Expert-AI-Skills
```

Preview the list of 19 skills first:

```bash
npx skills add vinceservidad/Shopify-Expert-AI-Skills --list
```

#### Context7 CLI

```bash
npx ctx7 skills install /vinceservidad/Shopify-Expert-AI-Skills
```

### 3. Native plugins (Claude Code, OpenAI Codex, Cursor, Antigravity)

#### Claude Code (terminal, `2.1.292+`)

```bash
claude plugin install shopify-va-toolkit --marketplace vinceservidad/Shopify-Expert-AI-Skills
```

#### Claude Code (inside a session, `2.1.275+`)

```text
/plugin install shopify-va-toolkit --marketplace vinceservidad/Shopify-Expert-AI-Skills
```

Check that all 19 skills loaded with `claude plugin details shopify-va-toolkit`.

#### OpenAI Codex

```bash
codex plugin marketplace add vinceservidad/Shopify-Expert-AI-Skills --ref main
codex plugin add shopify-va-toolkit@shopify-skills
```

#### Cursor (inside chat)

```text
/add-plugin vinceservidad/Shopify-Expert-AI-Skills
```

#### Antigravity

```bash
agy plugin install https://github.com/vinceservidad/Shopify-Expert-AI-Skills
```

### 4. Signed-in MCP link (optional live Shopify store data)

When you want read-only live store data, connect the signed-in MCP endpoint. After owner approval it reads products, variants, inventory, collections, metafields, and order summaries, and runs a one-call daily store check. Four optional permissions the owner grants in the app add fixed sales and traffic reports, discounts, theme files, and customer totals (never names or emails).

```text
https://shopify-mcp.mktskills.com/mcp
```

Live public store sign-in is waiting for Shopify App Store review. Use the no-login MCP URL, CLI, or native plugin today.

### Other options

- Live site: https://mktskills.com/shopify-va (also mirrored at https://shopify-mcp.mktskills.com)
- Start a free Shopify trial: [Shopify affiliate link](https://shopify.pxf.io/c/2227499/2974326/13624). We may earn a commission if you sign up through this link.
- Standalone ZIPs and `.plugin` packages: [v0.2.5 release](releases/v0.2.5/README.md) (for [Claude Skills ZIP](docs/ai-agent-setup.md#claude-skills) or [ChatGPT Projects](docs/ai-agent-setup.md#chatgpt-projects-or-ordinary-chats))
- Full setup and MCP docs: [Agent setup guide](docs/ai-agent-setup.md) and [Plugin and MCP reference](docs/plugin-and-connector.md)

Anthropic Plugin Directory status: `MKT Skills — Shopify VA` is under review. Use the CLI, no-login MCP URL, or GitHub plugin commands today.

## Skill catalog

Choose the skill that owns the deliverable. Use `shopify-va` for mixed tasks and add specialist skills only for distinct decisions.

| Skill | Use it for | Main output |
| --- | --- | --- |
| [shopify-va](skills/shopify-va/) | Mixed routine VA tasks, daily store checks, routing, tracking, QA, and handoff | Verified task/initiative record and escalation |
| [shopify-product-research](skills/shopify-product-research/) | Customer, demand, competitor, supplier, economics, and risk research | Product validation brief |
| [shopify-product-listing](skills/shopify-product-listing/) | Product content, taxonomy, variants, pricing, inventory, markets localization, SEO, and channels | Source-backed listing draft and QA |
| [shopify-catalog-operations](skills/shopify-catalog-operations/) | Bulk products, taxonomy, tags, metafields, variants, imports, change files, reorder planning, subscriptions, and channel sync | Governed change plan and reconciliation |
| [shopify-merchandising](skills/shopify-merchandising/) | Assortment, collections, sorting, product cards, bundles, and recommendations | Merchandising plan with commercial limits |
| [shopify-order-operations](skills/shopify-order-operations/) | Orders, payments, fulfillment, shipping profiles, 3PL exceptions, chargeback evidence, B2B wholesale, POS, returns, refunds, and cancellations | Verified order action or escalation |
| [shopify-va-training](skills/shopify-va-training/) | Onboarding, SOPs, simulations, permissions, QA, and coaching | Competency-based training plan |
| [shopify-store-audit](skills/shopify-store-audit/) | Store-wide journey, trust, merchandising, performance, launch and migration QA, BFCM readiness, app hygiene, review moderation, and growth audits | Evidence-led issue register or growth roadmap |
| [shopify-cro](skills/shopify-cro/) | Funnel diagnosis and controlled conversion experiments | Prioritized experiment backlog |
| [shopify-product-page](skills/shopify-product-page/) | Page structure, copy, proof, offer, and mobile UX | Page brief or revised copy |
| [shopify-creative-strategy](skills/shopify-creative-strategy/) | Ad concepts, hooks, briefs, and testing | Creative testing matrix |
| [shopify-meta-ads](skills/shopify-meta-ads/) | Meta Advantage+ audits, Conversions API deduplication, Event Match Quality, and spend decisions | Account diagnosis and decision log |
| [shopify-google-ads](skills/shopify-google-ads/) | Search, Shopping, Performance Max, Google Merchant Center Next feeds, and measurement | Query, product, campaign, and economics audit |
| [shopify-seo](skills/shopify-seo/) | Technical, collection, product, content, and internal-linking work | Prioritized SEO roadmap |
| [shopify-email-marketing](skills/shopify-email-marketing/) | Lifecycle strategy, flows, campaigns, and measurement | Flow plan and message briefs |
| [shopify-flow-automation](skills/shopify-flow-automation/) | Shopify Flow workflow design, fraud holds, low-stock alerts, VIP tags, and QA | Trigger-condition-action specification |
| [shopify-support](skills/shopify-support/) | Policy-grounded replies, privacy requests, subscription tickets, macros, and FAQs | Response draft or knowledge gap |
| [shopify-theme-development](skills/shopify-theme-development/) | Liquid, templates, sections, blocks, Checkout Extensibility, Web Pixels, JavaScript, and debugging | Scoped implementation or diagnosis |
| [shopify-analytics](skills/shopify-analytics/) | Store analysis, top-selling products, profit changes, and reconciliation | Reconciled performance diagnosis |

## How work flows

Provide the task, target store, evidence, acceptance criteria, and exact authorization. Start read-only, resolve prerequisites, follow the owning skill, verify the resulting state, and hand back completed work, blockers, and the next owner.

The shared [Store Operating Lifecycle](skills/shopify-va/references/store-operating-lifecycle.md) is a state model: begin at the earliest unresolved stage that can change the decision. Short jobs need only the relevant stages. Use the [Initiative Record](skills/shopify-va/references/initiative-record.md) for work spanning skills, sessions, or handoffs.

Keep facts, calculations, inferences, assumptions, and unknowns separate. Live changes require explicit scope, permissions, and an available tool. The custom MCP server exposes read-only store data; it cannot publish, refund, or change products, inventory, ads, or budgets. A save or successful build does not prove a verified live result or business impact. See [Evidence and authorization](docs/evidence-and-authorization.md).

## Examples, testing, and evidence

- [Five worked examples](docs/worked-examples.md): synthetic teaching cases with inputs, walkthroughs, and explicit limits.
- [Case study template](docs/case-studies/template.md): how to write up one real store's results without unconfirmed numbers. No case studies are published yet.
- [Recorded model evaluations](evals/RESULTS.md): complete results, failures, and limitations for the tested cases; other skills do not inherit those results.
- [Repository reliability](docs/reliability.md): tooling setup, validation, packaging guarantees, and remaining coverage.
- [Theme verification](docs/theme-verification.md): Liquid rendering, browser checks, and Theme Check boundaries.

Engineering checks establish package and implementation integrity. They do not prove merchant outcomes, model reliability across all 19 skills, or hosted connector availability. Behavioral scenarios require actual outputs and substantive review before being marked passed.

## Develop and contribute

Coding agents start with [AGENTS.md](AGENTS.md) or [.claude/CLAUDE.md](.claude/CLAUDE.md), then the [product brief](docs/product-brief.md) and [job workflow design guide](docs/job-workflow-design.md). Improve the existing skills and canonical shared references; avoid duplicate skills or parallel SOPs.

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup and required checks, [CHANGELOG.md](CHANGELOG.md) for changes, and the [prompt library](docs/prompt-library.md) for requests. Terminology and platform claims follow the [glossary](GLOSSARY.md), [knowledge taxonomy](KNOWLEDGE-TAXONOMY.md), and [platform currency registry](PLATFORM-CURRENCY.md).

MIT. See [LICENSE](LICENSE).

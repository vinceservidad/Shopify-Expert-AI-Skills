# Shopify VA Toolkit: Skills, Plugins & MCP

19 focused skills for real Shopify work: research products, prepare listings, maintain catalogs, review orders, diagnose performance, improve storefronts, and coordinate client assignments. Each workflow covers prerequisites, ordered actions, decision gates, QA, and handoff.

This independent project complements Shopify Sidekick and authorized integrations. Skills guide supervised work; installing them does not connect a store or authorize changes.

## Start here

Download the tested [v0.1.1 packages](releases/v0.1.1/README.md), then follow [How to use the toolkit](USAGE.md).

| Format | Use it for | Requirements and status |
| --- | --- | --- |
| Individual skills | One specialist workflow | Install a `shopify-*.zip` or complete skill folder in a compatible host. No Shopify connection required for supplied evidence. |
| Skills-only plugin | All 19 skills together | Import [the portable plugin](releases/v0.1.1/shopify-va-toolkit-skills-only.plugin) through the host's supported installation flow. No MCP runtime included. |
| Plugin with local MCP | All skills plus read-only Shopify evidence | Import [the full plugin](releases/v0.1.1/shopify-va-toolkit.plugin). Requires Node.js 24+; store reads require configured authentication. |
| Local MCP server | Register the connector separately | Build the source and configure your MCP host. Skill discovery works without Shopify credentials. |
| Hosted connector | Connect through an HTTPS MCP endpoint | Server code is included; public HTTPS hosting and native hosted-client sign-in remain unverified. The repository URL is not a connector endpoint. |

See [host installation](docs/ai-agent-setup.md) and [plugin/MCP setup](docs/plugin-and-connector.md) for supported paths, credentials, builds, and verification limits. Updating this repository does not update an already installed package; reimport the desired version.

## Skill catalog

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

Coding agents start with [AGENTS.md](AGENTS.md) or [CLAUDE.md](CLAUDE.md), then the [product brief](docs/product-brief.md) and [job workflow design guide](docs/job-workflow-design.md). Improve the existing skills and canonical shared references; avoid parallel SOPs or duplicate skills.

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup and required checks, [CHANGELOG.md](CHANGELOG.md) for changes, and the [prompt library](docs/prompt-library.md) for requests. Terminology and platform claims follow the [glossary](GLOSSARY.md), [knowledge taxonomy](KNOWLEDGE-TAXONOMY.md), and [platform currency registry](PLATFORM-CURRENCY.md).

MIT. See [LICENSE](LICENSE).

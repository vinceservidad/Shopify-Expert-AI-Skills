# Shopify Expert AI Skills for ChatGPT & Claude

A modular set of AI skills for Shopify audits, conversion work, product pages, creative strategy, paid media, SEO, lifecycle marketing, automation, support, analytics, and theme development.

The repository is built as an operating system, not a prompt pack. Each skill defines when it applies, the evidence it needs, the decisions it can support, the actions that require approval, and a consistent output contract.

## Release status

Version `0.1.0` is the first usable foundation:

- 12 standalone Agent Skills packages
- progressive disclosure through focused reference files
- ChatGPT and Claude setup guidance
- shared terminology, evidence, authorization, and platform-currency contracts
- behavioral evaluation scenarios
- repository and packaging validation scripts

These skills improve structure and decision quality. They do not guarantee correct answers, connect to a Shopify store automatically, or authorize changes to a live store or advertising account.

## Skill catalog

| Skill | Use it for | Main output |
| --- | --- | --- |
| [`shopify-store-audit`](skills/shopify-store-audit/) | Whole-store UX, merchandising, trust, performance, and measurement audits | Evidence-led issue register and action plan |
| [`shopify-cro`](skills/shopify-cro/) | Funnel diagnosis and controlled conversion experiments | Prioritized experiment backlog |
| [`shopify-product-page`](skills/shopify-product-page/) | Product-page structure, copy, proof, offer, and mobile UX | Page brief or revised copy draft |
| [`shopify-creative-strategy`](skills/shopify-creative-strategy/) | Paid-social concepts, hooks, briefs, and test design | Creative testing matrix |
| [`shopify-meta-ads`](skills/shopify-meta-ads/) | Meta Ads audits, diagnosis, and controlled recommendations | Account diagnosis and decision log |
| [`shopify-google-ads`](skills/shopify-google-ads/) | Search, Shopping, Performance Max, Merchant Center, and measurement | Query, product, campaign, and economics audit |
| [`shopify-seo`](skills/shopify-seo/) | Technical, collection, product, content, and internal-linking work | Prioritized SEO roadmap |
| [`shopify-email-marketing`](skills/shopify-email-marketing/) | Lifecycle strategy, flows, campaigns, and measurement | Flow plan and message briefs |
| [`shopify-flow-automation`](skills/shopify-flow-automation/) | Shopify Flow workflow design and QA | Trigger-condition-action specification |
| [`shopify-support`](skills/shopify-support/) | Policy-grounded support drafts, macros, and FAQ planning | Safe response draft or knowledge gap |
| [`shopify-theme-development`](skills/shopify-theme-development/) | Liquid, JSON templates, sections, blocks, debugging, and performance | Scoped implementation or technical diagnosis |
| [`shopify-analytics`](skills/shopify-analytics/) | Shopify, GA4, ad-platform, and business-outcome analysis | Reconciled performance diagnosis |

## Repository structure

```text
Shopify-Expert-AI-Skills/
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── GLOSSARY.md
├── KNOWLEDGE-TAXONOMY.md
├── PLATFORM-CURRENCY.md
├── docs/
│   ├── getting-started.md
│   ├── ai-agent-setup.md
│   ├── business-context-template.md
│   ├── evidence-and-authorization.md
│   └── skill-writing-guide.md
├── evals/
│   ├── README.md
│   └── core-scenarios.md
├── scripts/
│   ├── package-skill.sh
│   └── validate-repository.sh
└── skills/
    └── <skill-name>/
        ├── SKILL.md
        └── references/
```

Every `SKILL.md` follows the open [Agent Skills specification](https://agentskills.io/specification). The entrypoint stays concise, while conditional procedures and templates live under `references/`.

## Quick start

### Claude Skills

Package a single skill, then upload the resulting ZIP in Claude under Customize > Skills:

```bash
./scripts/package-skill.sh shopify-store-audit
```

The archive will be created in `dist/`. Enable the uploaded skill and test it with one of the scenarios in [`evals/core-scenarios.md`](evals/core-scenarios.md).

### ChatGPT

ChatGPT custom GPTs use separate Instructions and Knowledge fields rather than importing an Agent Skills folder directly. Use the selected skill's `SKILL.md` as the behavioral source for Instructions, and upload its reference files as Knowledge. See [`docs/ai-agent-setup.md`](docs/ai-agent-setup.md) for the current setup and availability limits.

### Agent-compatible coding tools

Copy or link the desired skill folder into the tool's supported skills directory. Keep the folder name identical to the `name` field in `SKILL.md`.

## Give the skill useful context

The skills can continue safely with incomplete data, but they must label unknowns and lower confidence. Better inputs produce better decisions:

- business model, market, products, prices, and offer
- gross margin or contribution-margin definition and included costs
- primary business outcome and conversion definitions
- date range and comparison period
- Shopify, GA4, ad-platform, email, and support evidence
- theme, app, feed, or workflow files when relevant
- brand voice, claims policy, returns policy, and fulfillment constraints
- actions that are authorized, draft-only, or prohibited

Start with [`docs/business-context-template.md`](docs/business-context-template.md).

## Operating rules

All skills use the same core boundaries:

1. Start read-only.
2. Separate observed facts, calculations, inferences, assumptions, and unknowns.
3. Prefer realized revenue, named profit levels, or qualified pipeline over platform-only success metrics.
4. Treat attribution differences separately from tracking defects and business-performance changes.
5. Require explicit approval before changing a live store, theme, workflow, campaign, budget, bid, audience, tracking setup, offer, or customer record.
6. Distinguish draft, saved, published, live, processing, and verified states.
7. Preserve valuable coverage and learning unless evidence supports a reversible change.
8. Never invent customer language, results, benchmarks, claims, margins, credentials, or causality.

Read [`docs/evidence-and-authorization.md`](docs/evidence-and-authorization.md) for the complete contract.

## Example requests

```text
Use shopify-store-audit. Audit this store from the supplied screenshots and exports.
Start read-only. Separate observations from inferences. Give me the five highest
priority issues, the evidence for each, missing evidence, and an implementation
plan that requires approval before any live change.
```

```text
Use shopify-google-ads. Diagnose the last 30 days versus the previous 30 days.
Separate brand from non-brand and product performance. Use contribution margin
after product cost and payment fees as the commercial guardrail. Do not change
the account. Show observed facts, calculations, unknowns, and reversible tests.
```

```text
Use shopify-flow-automation. Design a low-stock alert workflow. Confirm the
available triggers and actions from current account evidence before writing the
specification. Include duplicate-event handling, failure alerts, test cases,
rollback, and the approval needed to enable it.
```

## Validation

Run the repository checks before contributing or packaging:

```bash
./scripts/validate-repository.sh
```

The validator checks required files, skill naming, frontmatter, reference links, descriptions, and unfinished placeholders. Behavioral quality is reviewed separately with the evaluation cases under `evals/`.

## Documentation

- [`Getting started`](docs/getting-started.md)
- [`ChatGPT and Claude setup`](docs/ai-agent-setup.md)
- [`Business context template`](docs/business-context-template.md)
- [`Evidence and authorization`](docs/evidence-and-authorization.md)
- [`Skill writing guide`](docs/skill-writing-guide.md)
- [`Canonical glossary`](GLOSSARY.md)
- [`Knowledge taxonomy`](KNOWLEDGE-TAXONOMY.md)
- [`Platform currency`](PLATFORM-CURRENCY.md)

## Contributing

Contributions are welcome when they make a skill more accurate, safer, easier to trigger, or easier to test. Read [`CONTRIBUTING.md`](CONTRIBUTING.md) before opening a change.

## License

MIT. See [`LICENSE`](LICENSE).

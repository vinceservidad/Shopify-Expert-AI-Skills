# Shopify Expert AI Skills for ChatGPT & Claude

19 focused skills for Shopify virtual assistants, specialists, agencies, developers, and store operators.

Audit stores, prepare product listings, review bulk changes, reconcile performance, and debug themes with clear evidence and approval boundaries. Each skill defines when to use it, what evidence it needs, how to approach the task, and what a useful result must include.

**This is a toolkit for supervised work, not an autonomous store operator.** Installing a skill does not connect Shopify, grant permissions, or guarantee a correct answer.

## See the work, not just the prompts

Start with the [five worked examples](docs/worked-examples.md). Each includes synthetic input evidence, a complete walkthrough, expected results or behavior, and explicit test limits.

| Example | What it demonstrates |
| --- | --- |
| [Analytics](skills/shopify-analytics/references/worked-example.md) | Sales rise 10%, but contribution after ads falls £568. Net-sales and unit rankings answer different questions. |
| [Product listing](skills/shopify-product-listing/references/worked-example.md) | Build a truthful listing draft while leaving unknown weight, inventory, taxonomy and claims unresolved. |
| [Catalog operations](skills/shopify-catalog-operations/references/worked-example.md) | Separate two candidate price changes from two blocking exceptions; preserve identifiers and prepare rollback. |
| [Store audit](skills/shopify-store-audit/references/worked-example.md) | Prioritize an obstructed purchase control and conflicting delivery copy without inventing conversion impact. |
| [Theme development](skills/shopify-theme-development/references/worked-example.md) | Keep variant price, form ID and availability aligned through selection, history changes and component re-insertion. |

These are **authored teaching examples**, not merchant results or independent AI evaluations. Calculation checks, browser checks, Shopify static checks, and model evaluations are tracked separately. The [original example manifest](evals/worked-examples.json) retains the unrun behavioral replay status of those teaching cases. The [model evaluation protocol](docs/model-evaluations.md) tests fresh, answer-withheld cases with frozen prompts, repeated with/without-skill comparisons and blinded substantive review.

## What the model evaluations found

In the [recorded ten-case comparison](evals/RESULTS.md), GPT-5.5 responses scored **85.5/100 with skill text versus 78.7 without**, with **23/30 versus 17/30** passing the frozen weighted threshold and critical gates. Each of the five priority skills was tested on two fresh synthetic cases, repeated three times per condition. The rubrics and teaching answers were withheld during generation; model reviewers scored full answers with condition labels withheld.

All 60 answers, failed criteria, prompts and grades are published. A separate 12-answer catalog follow-up compared the clarified and previous skill on two new cases: **90.8 clarified versus 89.2 previous**, with **6/6 versus 5/6** threshold passes and **3/6 all-criteria passes in both versions**. This is small, maintainer-directed, model-judged evidence. It does not establish production safety, merchant outcomes, effectiveness of the other fourteen skills, or elimination of the observed failures. See the [results, secondary judgment audit and limitations](evals/RESULTS.md) before treating a passing score as reliability.

## Start here

Read [How to use these skills](USAGE.md) for no-code installation, choosing a skill, store context, authorization, and troubleshooting. The [prompt library](docs/prompt-library.md) contains copy-and-paste requests for all 19 skills.

For a mixed routine task list, start with `shopify-va`. For a specific result, choose the specialist that owns it. For example, `shopify-analytics` owns a reconciled performance diagnosis; `shopify-google-ads` can contribute campaign evidence without producing a second conflicting report.

## Skill catalog

| Skill | Use it for | Main output |
| --- | --- | --- |
| [shopify-va](skills/shopify-va/) | Mixed routine VA tasks, routing, execution tracking, QA and handoff | Verified task record and escalation |
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

## Installation

### Claude Skills

Use the no-code path in [USAGE.md](USAGE.md), or set up the repository tooling and package one skill:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements-dev.txt
./scripts/package-skill.sh shopify-store-audit
```

The archive is created in `dist/`. Upload that individual skill ZIP, not the entire repository. Packaging runs validation first and includes the skill's references, assets and license. The five worked-example skills carry their teaching evidence inside their own packages.

### ChatGPT

Use the chosen skill's procedure as the behavioral source for Instructions and its supporting references as Knowledge or task evidence. Follow [the setup guide](docs/ai-agent-setup.md) for the product surface and account controls available to you. This guided setup is distinct from installing a native Agent Skills package.

When reproducing a worked example, include its input assets as well as its reference. When independently evaluating a model, withhold the worked reference and expected output to prevent answer leakage; see [the evaluation procedure](docs/worked-examples.md#evaluate-an-ai-response-without-leaking-the-answer).

### Agent-compatible coding tools

Copy or link the selected skill folder into the tool's supported skills directory. Keep the folder name identical to the `name` in `SKILL.md`. The entrypoints use the [Agent Skills format](https://agentskills.io/specification); detailed procedures and teaching assets load only when relevant.

## Give the skill useful evidence

Provide the task, store and market, product facts, objective, date range and comparison, metric definitions, relevant exports or source files, and the exact authorization boundary. Include margin definitions, policy sources, change history and rollback constraints when they affect the decision.

Missing information should reduce confidence or limit scope, not produce invented facts. Start with [the business context template](docs/business-context-template.md). Never upload passwords, API keys, payment data or unnecessary customer information.

## Operating rules

1. Start read-only and separate facts, calculations, inferences, assumptions and unknowns.
2. Name the revenue or profit definition. Do not add overlapping attributed revenue across platforms.
3. Treat tracking defects, attribution differences and real business changes as separate questions.
4. Require explicit scope and approval before changing a live store, theme, campaign, budget, workflow, offer or customer record.
5. Distinguish drafted, saved, published, processing, live and verified states. Preserve unrelated work.
6. Never invent customer language, results, benchmarks, claims, margins, credentials or causality.

See [Evidence and authorization](docs/evidence-and-authorization.md), [the glossary](GLOSSARY.md), [knowledge taxonomy](KNOWLEDGE-TAXONOMY.md), and [platform currency](PLATFORM-CURRENCY.md).

## Validation and evidence

```bash
./scripts/validate-repository.sh
python -m unittest discover -s tests -v
python scripts/worked_examples.py
python scripts/check_evaluation_evidence.py
```

Repository checks cover frontmatter, naming, references, package integrity and failure handling. Data-example tests verify authored calculations and mappings. [Theme verification](docs/theme-verification.md) now includes actual-source rendering through Shopify's official Liquid core, explicit local adapters, browser checks and separate Theme Check. GitHub workflows check all 19 packaged skills and recompute recorded evaluation summaries offline; CI does not make model calls or award substantive grades.

A passing build does not establish that an AI can operate a real store reliably. The [behavioral scenarios](evals/core-scenarios.md) require actual model outputs and substantive review. Do not mark them passed because an answer uses expected headings or reproduces an available answer key.

## Repository structure

```text
skills/<skill-name>/
  SKILL.md
  references/
  assets/worked-example/   # present in the five example skills
scripts/                  # validation, packaging and example checks
tests/                    # tooling and synthetic-data regressions
  browser/                # synthetic DOM and actual Liquid output
  theme/                  # official Liquid core renderer regressions
evals/                    # behavioral rubrics and evaluation status
docs/                     # setup, context, usage and reliability
.github/workflows/        # repository and worked-example checks
```

## Project status and contributing

The catalog remains at 19 skills. The priority is depth and evidence, not more skill names. See [CHANGELOG.md](CHANGELOG.md) for development changes and [Repository reliability](docs/reliability.md) for tooling setup and limitations.

Contributions should improve correctness, evidence handling, usefulness, triggering or testability. Read [CONTRIBUTING.md](CONTRIBUTING.md) before changing procedures. Do not convert synthetic examples into claimed merchant results or fabricate completed evaluations.

## License

MIT. See [LICENSE](LICENSE).

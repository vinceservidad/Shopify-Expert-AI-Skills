# Changelog

All notable changes to this project are documented here.

## [Unreleased]

### Model evaluation and theme evidence

- Add ten fresh synthetic evaluation tasks across the five priority skills, separate hidden-during-generation rubrics, frozen prompts and a balanced repeated with/without-skill protocol.
- Add a response-only Codex runner with answer isolation, retained failed attempts, blinded review packets, critical scoring gates, content hashes and offline integrity checks. Authored tests and independently generated responses remain separate evidence classes.
- Add official Ruby Liquid rendering of the actual example source, 19 renderer regressions and 17 Chromium checks against rendered output, retaining the original 12 DOM-harness checks. Proprietary Shopify runtime adapters, local form capture and hosted-store gaps are explicit.
- Preserve the existing nineteen-skill catalog and shared commercial/authorization safeguards. No merchant state is changed by these checks.
- Clarify catalog recovery value provenance and direction, no-op versus changed/conforming counts, protection of later authorized edits, and recovery verification after observing incomplete and one inverted recovery table in the recorded pilot. Add fresh previous-versus-revised skill comparison cases; retain the original benchmark unchanged.

- Publish 60 answer-withheld GPT-5.5 responses with 360 blinded primary judgments, a targeted secondary audit and a separately labeled sensitivity calculation. Publish a further 12 responses and 72 judgments on two fresh catalog revision cases, keeping the different rubrics and experiments separate.
- Add nine sensitivity-integrity regressions alongside runner and recorded-evidence tests; CI recomputes published results offline without generating answers or substituting integrity checks for substantive review.

### Worked examples

- Add five self-contained, explicitly synthetic worked examples for store audit, product listing, catalog operations, theme development and analytics.
- Add input evidence and independently specified expected data results, with 34 regression checks for arithmetic, source mappings, exceptions and preserved state.
- Add a small Liquid/JavaScript variant-selection example, 12 Chromium DOM-harness tests, and separate Shopify Theme Check automation. Browser fixtures are not Shopify-rendered pages or live-store verification.
- Add an evaluation manifest that keeps independent model tests at `not_run` and explains answer-key leakage when designing a genuine evaluation.
- Add example routing to the five entrypoints; clarify top-product ranking definitions in analytics without expanding the nineteen-skill catalog.
- Lead the README with concrete worked outputs and correct the packaging quick start to include Python dependencies.

### Fixed

- Parse YAML frontmatter instead of extracting fields with text matching; reject malformed YAML, duplicate keys, incorrect types, and unsupported fields.
- Check missing local references even when the entire reference directory is absent, and reject symlinks and links outside a standalone skill.
- Validate before packaging and preserve the last successful archive when validation or writing fails.
- Describe the 200-character description ceiling as repository policy rather than a universal cross-platform limit.

### Added

- Fifty-one synthetic regression tests for validation, packaging, failure handling, and archive isolation.
- GitHub Actions checks on Linux and macOS, including packaging and isolated validation of every skill.
- Pinned tooling dependency, reproducible ZIP ordering and timestamps, bundled license, and contributor setup instructions.
- Reliability guide separating structural checks from unrun model evaluations and identifying five existing skills for deeper examples.

## [0.2.0] - 2026-08-25

### Added

- Prominent root-level usage guide with no-code Claude installation, ChatGPT configuration, first-run instructions, authorization guidance, and troubleshooting.
- Copy-and-paste prompt library covering all nineteen skills.
- `shopify-va` owner skill for routine-task intake, specialist routing, permission checks, execution-state tracking, QA, and handoff.
- `shopify-product-research` for evidence-led opportunity, competitor, supplier, economics, risk, and validation work.
- `shopify-product-listing` for source-backed product creation, updates, publishing states, and QA.
- `shopify-catalog-operations` for governed bulk edits, CSV work, taxonomy, metafields, variants, and reconciliation.
- `shopify-merchandising` for assortment, collections, sorting, product cards, bundles, cross-sells, and upsells.
- `shopify-order-operations` for permissioned order, payment, fulfillment, return, refund, cancellation, and exception workflows.
- `shopify-va-training` for role charters, SOPs, practice, assessment, access progression, and coaching.
- Behavioral scenarios for VA routing and each new specialist workflow.
- Dated first-party Shopify sources for products, taxonomy, CSV, collections, inventory, orders, roles, and permissions.

### Changed

- Added a visible Start here section to the top of the README.
- Repositioned the repository for both Shopify virtual assistants and accountable specialists.
- Tightened validation to a 200-character cross-platform skill-description limit.

## [0.1.0] - 2026-08-25

### Added

- Twelve standalone Shopify Agent Skills covering audit, CRO, product pages, creative, Meta Ads, Google Ads, SEO, lifecycle email, Flow, support, theme development, and analytics.
- Focused reference files for frameworks, checklists, templates, decision rules, and diagnosis workflows.
- ChatGPT and Claude installation and setup documentation.
- Canonical glossary, knowledge taxonomy, evidence and authorization contract, and dated platform-currency registry.
- Business-context template and contributor skill-writing guide.
- Core behavioral evaluation scenarios.
- Repository validation and skill-packaging scripts.

### Governance

- Read-only analysis is the default.
- Live store, advertising, tracking, automation, and customer-data changes require explicit approval.
- Commercial conclusions must name the business outcome or profit level and included costs.
- High-change platform claims require recent first-party verification and account-visible confirmation when availability matters.

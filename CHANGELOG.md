# Changelog

All notable changes to this project are documented here.

## [Unreleased]

### Agent-skills public pages

- Present the toolkit as Shopify skills for AI agents: the first-task file tree in the hero, a `skills/` section listing all 19 skills by area (checked against the repository by `tests/skill-groups.test.ts`), and VA jobs shown as the guide files they come from.
- Share the MKT Skills header shell with mktskills.com: `marketing/` and `shopify-va/` file tabs with the same container, header height, line height and breakpoints, so switching products no longer shifts the header.
- Serve an SVG favicon at `/shopify-va/assets/favicon.svg` (the MKT Skills mark with a green VA cursor).

### MKT Skills family design

- Public pages use the MKT Skills family palette, type scale and layout, with green kept as the VA Toolkit accent. Light and dark themes follow the device and share the saved `mkt-theme` choice with mktskills.com (`/shopify-va/assets/theme.js`, served from the page origin to satisfy the CSP). The embedded Shopify admin page keeps its existing light styling.
- The header carries the MKT Skills wordmark and a Marketing / Shopify VA switch linking back to the parent site; the footer adds an MKT Skills home link and the theme switch (hidden without JavaScript).
- The hero now sits beside a "See a VA job" panel built from the workflow catalog: what each of four everyday jobs does, what to have ready and what it returns. No new claims or sample outputs were added.

### Practical VA workflows (source/plugin 0.2.0)

- Add eight original workflow guides and templates within the existing VA,
  product-listing, catalog, support and training skills. Preserve all 19 names.
- Add workflow discovery and deterministic task preparation without reading
  client files, storing context, scheduling work or granting editing permission.
- Add fixed product-description/media/SEO and privacy-limited order-detail reads
  using existing permissions and API 2026-07. Preserve existing tools and prompts.
- Add package, protocol and Workers regression coverage and ungraded behavioral
  scenarios. Keep client facts in chat/project files and use separate approved
  editing connections only when supported and authorized.
- Verify local product-detail reads and a populated unpaid development-store
  order with line-item pagination. Resolve an actual Order-object denial through
  the owner's explicitly approved Custom distribution setting for the test app.
  Preserve the three read scopes and exclude identifying/payment fields.
- The hosted Worker remains release 0.1.0 with eight tools; this source upgrade
  does not merge or deploy it.

### Plugin and read-only MCP connector

- Deploy an HTTPS Cloudflare Workers connector with encrypted SQLite-backed
  Durable Object OAuth storage, platform rate limits and shared read-only tools.
- Bundle canonical skill documents for Workers and add runtime integration checks
  for store isolation, restart persistence, code replay, refresh, revocation and
  rejected upstream redirects. Keep local Node and stdio modes available.
- Verify hosted Chrome OAuth and real development-store MCP reads. Record empty
  order and native hosted-client limitations without expanding merchant scopes.

- Fix the consent page's referrer policy so browser form POSTs preserve their
  same-origin header. Keep null/foreign-origin rejection and CSRF protections.
- Complete local Chrome OAuth followed by actual authenticated Streamable HTTP
  MCP reads on the development store, separately from the verified stdio path.

- Add installed same-organization app authentication for local stdio, with token
  caching, renewal and failure handling. Add three authentication regressions.
- Verify the bundled MCP runtime against the authorized development store after
  app installation. Narrow inventory reads to location IDs after an actual
  field-permission error. Preserve the approved scopes and record empty-order
  and blocked-browser-OAuth limitations separately.

- Introduce Shopify VA Toolkit as the display name while retaining the source
  repository URL and all nineteen canonical skills.
- Add portable Agent Plugins and Claude-compatible manifests, reproducible
  plugin packaging, bundled local MCP runtime, and setup documentation.
- Add fixed read-only Shopify GraphQL tools for store identity, products,
  variants, location inventory and order summaries, plus skill discovery,
  reading, a resource and a task prompt. Store results retain provenance and
  pagination; no arbitrary GraphQL or write tool is exposed.
- Add Streamable HTTP OAuth with Shopify merchant authorization, MCP discovery,
  public-client registration, S256 PKCE, resource-bound tokens, refresh rotation,
  revocation and encrypted persistent records. Keep credentials out of outputs.
- Add protocol/authentication/packaging checks and a Node 24 CI workflow.
  Engineering verification remains separate from model grades and live-store
  evidence. Public hosting, directory submission and production use are not
  implied by this implementation.

### Skill safety and packaging upgrade

- Add the evidence-versus-instructions boundary to sixteen standalone skills
  that lacked it; preserve the existing rule in research, store audit, and theme
  development. Embedded requests cannot grant authorization or redirect work.
- Upgrade theme guidance for Shopify's documented high-variant Liquid limit,
  deferred option rendering, null selections, and the limits of the small fixture.
- Add Codex installation and invocation instructions from current first-party
  documentation, plus the missing tooling setup in the usage guide.
- Block common environment and private-key filenames before packaging, exclude
  development directories, and reject links to excluded resources. Filename
  checks do not replace a review for sensitive content.
- Add `--all` packaging with one catalog validation pass and preserve individual
  ZIP failure handling; use it in CI. Add nine tooling regressions covering
  credentials, exclusions, batch selection, standalone contents, and failures.
- Add two `needs-review` behavioral scenarios. Existing model-evaluation records
  are unchanged; this revision has no newly measured model-performance claim.

### Shopify Store Operating Lifecycle

- Add the shared `CONTEXT → GOAL → DIAGNOSE → STRATEGY → PLAN → IMPLEMENT → VERIFY → MEASURE → OPTIMIZE ↺` operating lifecycle for merchants, freelancers, agencies, Shopify VAs, developers, marketers, specialists, and store operators.
- Keep the lifecycle stateful rather than mandatory: simple draft work can begin at `implement`, technical bugs can begin at `diagnose`, completed changes can begin at `verify` or `measure`, and new evidence can move work back to an earlier stage.
- Upgrade `shopify-va` to coordinate lifecycle state, multi-skill routing, execution tracking, verification, measurement handoff, and optimization decisions without taking ownership away from the nineteen specialist skills.
- Add a portable lifecycle reference and Shopify Initiative Record inside the `shopify-va` package so the framework remains available when that skill is packaged independently.
- Make implementation, verification, and measurement separate first-class states. A save, build, upload, publish, or technical QA pass does not by itself prove live correctness or commercial success.
- Add role boundaries so admin access or a broad engagement does not silently become merchant/client authorization. Merchant/accountable-owner approval, freelancer/agency scope, VA procedure boundaries, and developer technical scope remain distinct.
- Add five `needs-review` lifecycle behavioral scenarios covering bounded-task stage skipping, theme diagnosis, verification-versus-measurement, freelancer authority, and optimization moving backward. These scenarios are coverage only, not evidence of model performance.
- Preserve the existing nineteen-skill catalog. No duplicate `context`, `strategy`, `router`, `verify`, or other lifecycle skills are added.

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

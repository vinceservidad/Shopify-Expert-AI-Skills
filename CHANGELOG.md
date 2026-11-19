# Changelog

All notable changes to this project are documented here.

## [Unreleased]

### Plugin 0.2.2 and release packages

- Bump all plugin manifests to 0.2.2 so `claude plugin update` delivers the skill
  changes below. Add `releases/v0.2.2` (both plugin targets, 19 skill ZIPs and
  `SHA256SUMS`), and point the README and setup guides at it. No git tag is
  created.

### Fixes found by plugin evals

- `shopify-catalog-operations`: a request to skip the export, dry-run diff, or
  pilot cannot waive them for a store-wide overwrite.
- `shopify-product-listing`: a request to make up missing facts gets visible
  `[NEEDS OWNER: ...]` placeholders, never guessed specifications.
- `shopify-merchandising`: a revenue ranking is one signal, checked against
  margin, returns, stock, seasonality, and launch age.
- `shopify-creative-strategy`: no budget scaling method (percentage step,
  cadence, or multiple); scaling goes to the Meta or Google Ads skill.
- `shopify-email-marketing` keeps an email-only description. The cross-system
  revenue case accepts `shopify-analytics`, which owns reconciled reporting in
  the canonical task routing.
- Correct the Flow and theme rubrics, which failed correct replies when the run
  had no store or theme files.

### Ecommerce growth audit mode

- Revive the growth audit mode from the closed PR #18 in `shopify-store-audit`
  (0.2.0): an outside-in snapshot for public evidence only and a full growth
  audit for supplied data, a stated growth model, a lens-to-owner orchestration
  map across the Shopify skills with optional Marketing Skills depth, a
  measurement-first workflow, a Now/Next/Later/Not now roadmap, and an engagement
  scope outline with no generated prices or promised outcomes. Keep the catalog
  at nineteen skills.
- Add behavioral scenarios 56 and 57 as `needs-review`.

### Claude plugin docs alignment (checked November 19, 2026)

- Add `PRIVACY.md` and `TERMS.md`, and set `privacyPolicyUrl` and
  `termsOfServiceUrl` in both Claude manifests for Anthropic's directory listing.
  The privacy page links the hosted connection's own notice.
- Give the connected plugin manifest the same `icon`, `documentationUrl`,
  `supportUrl` and keywords as the native plugin. Plugin packages now include
  `.claude-plugin/icon.png`, with a regression test.
- Add 21 `claude plugin eval` cases in `plugin-evals/`: one routing and safety
  case per skill and one for growth audit mode, drawn from `evals/core-scenarios.md`, plus one case that no
  skill fires on an unrelated request. No run results are claimed.
- Rewrite all 19 skill descriptions with the words VAs type (bulk price edits,
  abandoned cart, Performance Max, chargebacks, PDP, A/B tests), still within
  the 200-character repository limit. Each skill's patch version is bumped.

### Plugin icon

- Replace the placeholder checklist icon with the ShopifySkills logo: a metallic
  price tag with a check on a dark tile with green glow waves, matching the MKT
  Skills app icon style in the VA accent green. It is original artwork, not
  Shopify's bag mark. `scripts/render_plugin_icon.py` regenerates it (Pillow).

### CI on Cloudflare instead of GitHub Actions

- Remove the four GitHub Actions workflows. `scripts/ci.sh` runs every check
  they ran (core, plugin, connector, theme) and writes `dist/ci-report.json`.
  Skipped or partial stages are named in the report, never counted as passed.
- `scripts/push-to-artifacts.sh` uses the `cf` CLI to issue a 10-minute,
  repo-scoped token and push the current commit to the Artifacts repository
  `mkt-skills/shopify-expert-ai-skills`. Workers Builds on the
  `shopify-skills-ci` Worker runs `scripts/ci.sh` on every push; `ci/` is a
  `cf` project that deploys a status page only when all stages pass.
- Browser checks run only where Chromium can launch; Cloudflare's build image
  lacks Chromium's system libraries, so the report marks them not run there.
  Setup, settings, and limits: [docs/cloudflare-ci.md](docs/cloudflare-ci.md).

### Claude plugin 0.2.1 and Agent Skills compliance

- Bump all plugin manifests to 0.2.1 so `claude plugin update` delivers the
  changes below. Release archives in `releases/` were not rebuilt; the native
  marketplace installs from the repository.
- Add `displayName` (ShopifySkills), a placeholder checklist icon, and
  documentation and support links to the Claude manifest, plus a marketplace
  description. `claude plugin validate --strict .` now passes with no warnings.
- Move contributor instructions to `.claude/CLAUDE.md`, which Claude Code still
  loads, because a plugin-root `CLAUDE.md` is not loaded and fails strict
  validation.
- Point `experimental.evals` at `plugin-evals/` so `claude plugin eval` output
  never mixes with recorded evidence in `evals/results/`.
- Document one-step terminal and in-session installs, and that `/plugin`
  commands only run inside a session.
- Enforce the Agent Skills SKILL.md 500-line limit in repository validation,
  with regressions for the limit and consecutive hyphens in names.

### VA playbook workflow gaps

- `shopify-va-training`: add store access setup (own staff or collaborator
  account, never a shared login, least-privilege request by task, access
  verification, and offboarding).
- `shopify-merchandising` and task routing: own discount code and automatic
  discount setup with written approval, combinations off by default, checkout
  tests including non-qualifying carts, and separate activation approval.
- `shopify-support`: add Shopify Inbox instant answers with policy-conflict
  handling, owner approval, and storefront testing.
- `shopify-va`: add a default owner approval matrix and a plain-text
  end-of-day and weekly client update with exact figures and "cause not
  confirmed".
- Business context template: add a store operating profile (brand voice
  examples, copied policies with date, naming rules, update times, approvals).
- Add synthetic scenarios 51–55, all `needs-review`. Repository checks do not
  establish model behavior.

### Native ShopifySkills plugin

- Add native Codex and Claude plugin manifests and repository marketplaces that
  expose the existing 19 workflows as one credential-free skills plugin.
- Add the native Codex manifest to skills-only archives, keeping optional
  connected archives independent. Display the plugin as ShopifySkills and
  version the manifests as 0.2.0.
- Let the coordinator start public-source research without Shopify sign-in;
  add a synthetic `needs-review` scenario for broad plugin research requests.
- Test native marketplace resolution, all 19 packaged skills, no connection
  requirements, and preservation of good archives on malformed native metadata.
- Keep native discovery, installation, app-directory registration, and model
  behavior as separate verification states; no curated-directory link is invented.

### App-first user setup

- Lead with Claude Skill upload and ChatGPT Project setup instead of asking
  nontechnical users to choose between plugin and MCP developer formats.
- Explain the intended shared connected journey as a hosted connector powered
  by MCP, while preserving the actual not-deployed status and read-only limits.
- Remove unsupported universal plugin-import implications and fixed ChatGPT
  plan restrictions; keep developer setup separate from everyday app usage.

### Repository simplification

- Shorten the README and usage guide, link detailed setup and evidence guidance
  from their canonical pages, and keep the 19-skill catalog and existing install paths.
- Point Claude Code and the getting-started page to shared instructions instead
  of repeating full procedures. Preserve the published v0.1.1 package files.
- Simplify plugin manifest validation and fix a reused variable that skipped
  local MCP JSON checks. Add regressions for rejecting malformed local config
  without replacing a good archive and excluding it from skills-only packages.

### Assigned-job workflow readiness

- Version the plugin manifests as 0.1.1 and publish both plugin variants and all
  nineteen skill ZIPs through a tested-build GitHub Actions release on version tags.
- Provide tested v0.1.1 packages and SHA-256 checksums directly in the repository
  so installation does not depend on GitHub Actions billing availability.
- Tighten the ordered procedures in the existing nineteen skills: define the
  client deliverable, check prerequisites before dependent work, continue safe
  independent work, and hand off evidence, exceptions, actual state, and owners.
- Move listing preflight QA before writes; reconcile concurrent catalog edits
  and uncertain batch or order outcomes before retries; distinguish an unsaved
  draft from an authorized inactive save in the coordinator checklist.
- Add delayed-state checks to email and Flow, source/rights QA to creative,
  controlled release verification to ads, SEO and theme work, and explicit
  data-quality and competency gates to reporting and VA training.
- Add nineteen synthetic assigned-job scenarios covering normal progress and
  blocking exceptions. They remain `needs-review`; tooling and package checks
  do not establish model task performance or live Shopify behavior.

### Plugin packaging compatibility

- Add an explicit `skills-only` plugin target for hosted environments that
  cannot execute the bundled local stdio connector. The archive omits MCP
  configuration and runtime files instead of claiming an undeployed endpoint.
- Shorten the OpenAI listing subtitle to the current 30-character limit and add
  a read-only default prompt.

### Plugin and read-only MCP connector

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

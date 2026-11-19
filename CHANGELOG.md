# Changelog

All notable changes to this project are documented here.

## [Unreleased]

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
- Shorten the OpenAI listing subtitle to the current 30-character limit, add a
  read-only default prompt and advance the plugin manifests to `0.2.1`.

### Web Analytics and author link on the public guide
- Allow Cloudflare Web Analytics on the public pages (owner-approved): `script-src` adds only the zone-injected beacon path `https://static.cloudflareinsights.com/beacon.min.js` (and its versioned sub-path), and `connect-src 'self'` lets it report to `/cdn-cgi/rum` on the same origin. Before this the beacon was blocked and the pages logged a CSP error. Sign-in and admin pages keep their own stricter policies. A test pins the directive set.
- The footer credit links Vince Servidad to https://www.vinceservidad.com/, matching mktskills.com.

### Colour in the public guide
- The public pages match the colour pass on mktskills.com: green headline accent, eyebrows and primary action; the first-task file tree is a dark terminal with coloured folders and files; job frontmatter is syntax-coloured; the skill tree shows coloured folders with counts and branch lines. Shared `--syn-*` and `--term-*` tokens mirror marketing-skills `/brand/family.css`; reduced motion turns the entrances off.

### Guide deploys through Cloudflare Artifacts

- Read the issued token from Wrangler's `plaintext` field (the first run created the repository but could not read the token), and discard the `repos create` output, which contains a live token, so it never reaches the public Actions log.
- The workflow now creates the Artifacts repository on its first run and seeds it with the first push, so no local `wrangler` setup is needed. If the namespace differs, the run fails and lists the account's namespaces.
- After a push to `feat/cloudflare-hosted-mcp`, `.github/workflows/artifacts-deploy.yml` runs typecheck, tests and the guide dry run, then pushes the verified commit to a Cloudflare Artifacts repository using a 10-minute, repo-scoped write token. Workers Builds deploys `mkt-skills-shopify-guide` from that repository, so releases no longer require a manual `npm run guide:deploy`.
- GitHub remains the source of truth. A failing commit is never mirrored. Until `CLOUDFLARE_ARTIFACTS_TOKEN` is set, the workflow only runs the checks. One-time setup, cost and rollback: [docs/artifacts-deploy.md](docs/artifacts-deploy.md). Artifacts is in open beta, requires Workers Paid and begins billing on October 14, 2026.

### Agent-skills public pages

- Present the toolkit as Shopify skills for AI agents: the first-task file tree in the hero, a `skills/` section listing all 19 skills by area (checked against the repository by `tests/skill-groups.test.ts`), and VA jobs shown as the guide files they come from.
- Share the MKT Skills header shell with mktskills.com: `marketing/` and `shopify-va/` file tabs with the same container, header height, line height and breakpoints, so switching products no longer shifts the header.
- Use the MKT app icon as the favicon, inlined at 32 pixels (the public page CSP already allows `img-src data:`).

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

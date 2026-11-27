# Changelog

All notable changes to this project are documented here.

## [Unreleased]

### Shopify VA guide desktop audit fixes (2026-11-27)

- `connector/src/public-ui/styles.ts`, found by mouse and keyboard passes over /shopify-va, /setup and /privacy at 1024x768 to 2560x1440, 125% and 150% zoom and a 1280x650 laptop (the live site serves the same stylesheet and behaved the same): after following a stage gate link and hovering another row, two rows were highlighted (the `:target` row now yields while a hovered or focused row is lit); the search field's clear button was inverted to near-black on the dark field and is now the default light one; the Copied label on the problems table sat centered instead of right-aligned; the /setup and /privacy text sat in a 650px column inside a 1320px page at 1920px and wider, with Copy buttons far from their commands, so doc pages are now one centered 880px column; install-drawer commands wrapped mid-word because the label column took 240px, now 190px.
- Tests: a responsive test pins the five rules. Tab order, focus rings, hero and example tab keys (arrows, Home, End), panel counts, copy buttons, filters, empty state, Escape, drawer, FAQ, canvas sizing after resize and console output passed unchanged. CSP and markup unchanged; not deployed.

### Shopify VA guide mobile audit fixes (2026-11-27)

- `connector/src/public-ui/styles.ts`, found by tapping through /shopify-va, /setup and /privacy on iPhone SE/13/14 Pro Max, Pixel 7, Galaxy S9+, landscape iPhone 13 and Pixel 7, and a 320x568 phone (local render and the live site behaved the same): the skill search placeholder "Search skills (stock, ads, Flow)" was clipped on 320px phones, so the count now wraps under a full-width field at 360px and below; copy buttons in command rows reserve the width of "Copied" so the button and row no longer grow on tap in landscape and in the install drawer; the /setup jump links and the 01-07 gate links are 44px tall on phones (they were 32px and touching); the last breadcrumb is vertically aligned with the link crumbs.
- Tests: a responsive test pins the four rules. Header nav, hero and example tabs, gate links, copy buttons, skill filter, drawer and FAQ taps, horizontal overflow and canvas sizing after rotation all passed unchanged. CSP and markup unchanged; not deployed.

### Shopify VA guide all-dark theme (2026-11-27)

- `connector/src/public-ui/styles.ts`: /shopify-va, /setup and /privacy use one dark ladder on every band. The `:root` role tokens now hold the former dark values (ground #031a14, raised #072e23, hairline borders, text #eef8f3 / #b6d1c6 / #89ab9d, lime #b9eb6a accent, dark wells and button shadows) and `color-scheme:dark`; the separate dark scope and the white/mist light tokens are gone. `.band-mist` and `.band-forest` are replaced by `.band-alt`, one very small ground step (#04211a) used on the sequence and setup bands; bands are otherwise separated by the 1px hairline and spacing. Selection colour is lime on dark. The embedded Shopify Admin `/app` page re-declares its light tokens under `.app-home` and keeps its own look.
- `public-pages.ts`: section classes and `color-scheme` meta (dark; `theme-color` was already #031a14). `sequence-canvas.ts` fallback colours follow the dark tokens (the canvas reads `--accent`, `--muted`, `--raised`, so gates go muted to lime).
- Tests: new `public-contrast.test.ts` computes WCAG contrast for the token pairs in use and asserts AA; the two light-token shadow pins in `public-pages.test.ts` were removed. CSP and markup structure unchanged; not deployed.

### Shopify VA guide readable type scale (2026-11-27)

- `connector/src/public-ui/styles.ts`: /shopify-va, /setup and /privacy move from a 13/15/18px scale to 14px small (captions, labels, table headers, mono code and URLs, footer), 16px body (paragraphs, lists, table and card text, nav links, buttons, tabs, form fields) and 18-20px lead text. Headings re-balanced (h2 30-40px, h3 20px, doc h1 34-48px) with the letter-spacing tightening kept. Line height 1.55 body, 1.4-1.5 small. The search input is 16px at every width so iOS Safari does not zoom on focus. The embedded /app block shares the same stylesheet and moves with it.
- Layout fixes for the larger text: the two-row header breakpoint moves from 560px to 680px (one row of 16px links needs 624px), phones at 420px and below stack brand, site links and product tabs, and the hero and example tab strips size to content so "Coding agents" no longer wraps.
- Tests: the font-size guardrail now allows only 14/16/18/20px, a new test pins 16px body, nothing under 14px and a 16px search input, and the header responsive test follows the new breakpoints. CSP and markup unchanged; not deployed.

### Shopify VA guide design polish (2026-11-27)

- `connector/src/public-ui/styles.ts`: one tonal ladder per band type (ground, raised, border, hover border, three text colours, accent); dark bands now remap the same role tokens instead of a parallel `--forest-*` set. Distinct palette colours 22 to 16 (hex 17 to 14); radii now 6px buttons and 8px boxes only (5px removed).
- Boxed controls use ring plus top highlight (raised) or inner shadow plus ring (recessed wells for URL, command, prompt and search boxes); solid buttons gain a layered shadow and a 1px press, outline and text buttons stay flat; no gradient fills.
- Headings -0.04em, intro paragraphs 1.6 line-height at 36em, section padding 96px desktop and 56px phones, 150ms `cubic-bezier(.2,0,0,1)` transitions on paint properties only, broader reduced-motion rule.
- `sequence-canvas.ts` reads `--raised` instead of `--mist`. CSP, markup and copy unchanged. Tests: updated one landscape padding pin and added a design-polish pin. Not deployed.

### Parent brand display name: Marketing Skills (2026-11-27)

- Changed the human-readable parent brand from "MKT Skills" to "Marketing Skills" in the app home and connect pages (titles, headings, install link text), `connector/shopify.app.public.toml` app name, `USAGE.md`, `docs/getting-started.md`, `docs/plugin-and-connector.md`, `docs/public-release.md` (title), `docs/shopify-review-submission.md` and a code comment. The product is now displayed as "Marketing Skills VA Toolkit".
- The Organization JSON-LD node (`https://mktskills.com/#organization`) keeps `name` "Marketing Skills" and now adds `alternateName` "MKT Skills" to match the main site; `tests/public-seo.test.ts` pins both.
- Unchanged on purpose: domains and URLs, Worker, Artifacts and Shopify configuration identifiers (`mkt-skills-*`), the `mkt-theme` key, image file names, plugin and server ids, the CSP, and dated historical entries and records that quote the old name.
- Not done: the Shopify app name change in `shopify.app.public.toml` takes effect only after a `shopify app deploy`; nothing was deployed or verified live.

### Shopify VA guide search and answer-engine pass (2026-11-27)

- Titles, descriptions and canonicals: each of `/shopify-va`, `/shopify-va/setup` and `/shopify-va/privacy` has its own title (47 to 53 characters, topic first, for example "Shopify Skills for AI Agents | Marketing Skills"), a description under 160 characters and a self-referencing canonical on `https://mktskills.com`. Setup and privacy now carry the same Open Graph and Twitter tags as the guide (1200x630 PNG, alt text, `og:locale`, `og:image:type`); the robots meta adds `max-image-preview:large`. Titles and descriptions come from one table, so the head, social tags and JSON-LD cannot disagree.
- JSON-LD (schema.org, one `@graph` per page): `Organization` with `@id` `https://mktskills.com/#organization` (shared with the marketing site), `WebPage` (`isPartOf` `https://mktskills.com/#website`), `BreadcrumbList` (Marketing Skills > Shopify VA > Setup or Privacy), and on the guide `SoftwareApplication` (free, price 0, `BusinessApplication`, MIT, feature list from the skill catalog) and `FAQPage` matching the visible FAQ. No ratings, reviews or `HowTo`. The old standalone `WebSite` node was removed so this section does not compete with the marketing site's own. The block is data, not script, so the CSP is unchanged.
- Page copy: setup and privacy h1s name the topic, both show a visible breadcrumb matching the markup, and the footer links to `llms.txt`.
- `llms.txt` rewritten to the llmstxt.org shape (H1, blockquote, plain body, H2 link lists, Optional last). Counts (19 skills, 8 workflows) are read from source, it states the last-updated date, free MIT licence and read-only boundary, and the install commands and MCP URL sit in the body. The 24 reference files are now real links. Both llms files are served as `text/plain; charset=utf-8` (browsers download `text/markdown`).
- New `/shopify-va/llms-full.txt` (also `/llms-full.txt` in the Express app): setup steps, FAQ and the full text of all 19 `SKILL.md` files. The Worker cannot read the filesystem, so `npm run public:docs` generates `src/public-ui/skill-docs.ts` from `skills/` (also run by `worker:catalog`); a test fails if the committed copy drifts. `llms-full.txt` is a common convention, not part of the llmstxt.org specification.
- Core Web Vitals: measured layout shift is 0 on all three pages at 390px and 1440px (system fonts, no content images, absolutely positioned hero canvas), so no layout change was needed.
- Tests: `tests/public-seo.test.ts` pins titles, descriptions, canonicals, social tags, heading order, JSON-LD properties, FAQ parity, llms formats and counts, the Express routes and the unchanged CSP.
- Not verified: Google's Rich Results Test and Search Console (no access); live URLs; indexing or ranking. Google no longer shows FAQ rich results, and SoftwareApplication rich results require a rating or review, which this page does not invent, so BreadcrumbList is the rich result these pages can be eligible for.
### Example tabs overlap fix (2026-11-27)

- "See what the skills return": choosing "New listing" showed all three examples' bullet lists on top of each other. The panel class `ex-list` was also the bullet-list class, so the selected-panel rule revealed every list. The bullet lists are now `ex-points`, and a test checks only the panel carries `ex-list`.

### Shopify VA guide responsive pass (2026-11-27)

- Audited all three public pages (guide, setup, privacy) on 17 viewports from 320x568 to 2560x1440, landscape phones, 200% zoom and reduced motion. No page scrolled sideways; the fixes below are layout and canvas polish.
- Header: one row down to 560px (two-row layout between 561 and 720px was wasteful); on 360px phones and narrower the site links span the row.
- Notched phones: the pages opt in to `viewport-fit=cover` and the content gutter honours the left and right safe-area insets, so landscape content clears the sensor housing; text size no longer inflates when a phone rotates.
- Landscape phones and 200% zoom: shorter hero and section padding.
- Phones: the "Common store problems" table stacks each problem with its copy button under 400px; stage rows use the full width; setup page command boxes stack the Copy button under the command, so long commands wrap inside the box.
- Large screens: layout widens from 1600px (and again from 2200px), the hero headline scales, and skills show four columns.
- Hero canvas: waves sit between the header and the headline instead of crossing the product tabs on phones. Both canvases render at up to 3x pixel ratio (hero capped near 4 million pixels) and redraw on resize, rotation and pixel-ratio changes.
- No CSP change, no inline script or style. Tests pin the breakpoints, safe-area insets, code-box wrapping and canvas resize logic, and a rendered-layout check runs when `playwright-core` and Chrome are available (`PLAYWRIGHT_CORE`, `CHROME_PATH`).

### Shopify VA page and setup page usability fixes (2026-11-27)

- Fixed: copy buttons with an icon lost the icon after the first copy. Every copy button now shows "Copied" (or "Copy failed" with a legacy-clipboard retry), restores its icon and label, keeps its width, and is announced to screen readers.
- Fixed: skills search matched the "Copy prompt" and "Read on GitHub" labels (so "copy" or "github" matched every skill) and ignored the pressed category. It now searches name, summary, category and starter prompt only; typing moves the category buttons back to All, picking a category clears the search, and a no-results message offers "Show all skills". The filter controls stay hidden until the script runs.
- Fixed: the hero and example tabs showed no keyboard focus ring and carried invalid tablist markup. The markup stays plain radio inputs; the script adds tab roles, a roving tabindex and arrow, Home and End keys. Focus rings are also visible without the script. Tab panels share one grid cell, so switching tabs no longer changes page height.
- Fixed: focus rings on links and buttons below the hero were lime on light bands; they now use the band accent (lime only on dark bands).
- "What comes first": the strip's gate numbers are real links to their rows, so the highlight works from the keyboard and a row stays highlighted after you follow its gate. Rows still need no tab stop.
- Common problems table on phones: "Fix first" and "Check next" were hidden or cramped; they now sit under each problem.
- Install drawer: OpenAI Codex shows both commands (the marketplace command alone did not install the plugin), and each Copy button names its command.
- Setup step 1 on the guide no longer only points back to the hero box; it states the Claude, ChatGPT and coding-agent steps.
- Setup page: every command has a copy button, a jump list sits under the title, and the current page is marked in the header.
- Footer links are 32px tall (44px on phones); the hero link row stacks on phones instead of breaking the URL mid-word; skill category buttons form an even grid on phones; skill summaries use one voice; hover, pressed and focus states added.
- No CSP change and no new inline script. Tests cover each fix.

### Shopify VA page sequence strip (2026-11-27)

- "What comes first": a quiet canvas strip above the seven-stage list. One order waits at each numbered gate until it checks, then moves to the next; hovering or focusing a row highlights its gate. The list stays the content, the strip is decorative (`aria-hidden`), hidden without JavaScript, paused offscreen and in hidden tabs, capped at 30 fps, and drawn as one still frame under reduced motion.
- Served as `/assets/sequence.js` from the guide origin like the hero script; the CSP is unchanged. Tests pin the markup, the script route, reduced-motion handling and the unchanged CSP.

### Shopify VA page design cleanup (2026-11-27)

- The skills grid opens on All (19 skills); the category tabs stay.
- "Common store problems": the starter-prompt buttons are quiet text buttons with a copy icon instead of outlined boxes.
- Hero: removed the price-tag and checkmark icons; the wavy lines now sit in the top of the hero, clear of the setup hint text. Headings use `text-wrap: balance`.
- Removed the "What the skills do, and what happens in Shopify" table. The FAQ now states that someone with store permissions applies approved changes in Shopify Admin.
- One accent per background: lime links and buttons on dark bands, emerald on light bands, set through CSS variables.
- Setup steps use plain "01", "02", "03" numbers instead of circles.
- Tests pin the default All filter, the removed section and the icon-free hero.

### Plugin 0.2.5: daily store check, change files and new job modes

- `shopify-va`: `references/daily-store-check.md`, the ranked morning check
  (aging orders, payment follow-ups, stock, media, drafts) and its client update.
- `shopify-catalog-operations`: `references/change-files.md` (import file,
  before-and-after diff and rollback file instead of live edits) and
  `references/reorder-planning.md` (reorder points, order quantities, draft
  purchase orders from client-supplied lead times and costs).
- `shopify-order-operations`: `references/b2b-wholesale.md` and
  `references/pos-operations.md`.
- `shopify-product-listing`: `references/markets-localization.md`.
- `shopify-support`: `references/privacy-requests.md`.
- Task routing rows for each new job. The catalog stays at 19 skills.
- Behavioral scenarios 67 to 73 (numbered 58 to 64 on `main` before the merge with the hosted branch), marked `needs-review`.
- `docs/case-studies/template.md` for real-store write-ups. No case studies are
  published yet.
- Bump the six plugin manifests to 0.2.5 and the patch version of the 5 changed
  skills. Add `releases/v0.2.5` and point the README and setup guides at it.

### Plugin 0.2.4 and release packages

- Bump all six plugin manifests to 0.2.4 so `claude plugin update` delivers the
  copy quality check and the Shopify playbooks. The root and Cursor manifests
  were already at 0.2.3, so 0.2.3 is skipped for the Claude and Codex manifests.
- Bump the patch version of the 10 skills that gained the copy quality check.
- Add `releases/v0.2.4` (both plugin targets, 19 skill ZIPs and `SHA256SUMS`),
  and point the README and setup guides at it.

### Copy quality check

- Add `references/copy-quality-check.md`, a 15-point anti-AI copy pass, to the 10
  skills that write customer or client copy: analytics, creative strategy, email marketing,
  Google Ads, Meta Ads, product listing, product page, SEO, support, and the
  Shopify VA coordinator. Each `SKILL.md` runs it before handoff.
- `tests/test_copy_quality_check.py` keeps the 10 copies identical and linked.
- `shopify-creative-strategy` hooks no longer recommend question hooks.
- Rewrite a "not X" line in the Meta Advantage+ creative guidance.

### Shopify playbooks

- Add 10 reference playbooks: official Flow recipes, Merchant Center Next and
  PMax, Meta Advantage+ and CAPI, multi-location routing and Markets, checkout
  extensibility and pixels, chargeback evidence, shipping and 3PL exceptions,
  launch, migration and BFCM readiness, app stack and reviews, and
  subscriptions and multichannel selling.
- Add Cursor and Antigravity plugin manifests.
### Store data tools and daily store check (connector)

- Add 8 read-only connector tools: `shopify_daily_store_check`,
  `shopify_list_collections`, `shopify_get_product_metafields`,
  `shopify_run_report` (6 fixed ShopifyQL reports over 7, 30, 90 or 365 days),
  `shopify_list_discounts`, `shopify_list_themes`, `shopify_read_theme_files`
  and `shopify_customer_summary` (totals only, never names or emails).
- The 3 required scopes are unchanged. `read_reports`, `read_discounts`,
  `read_themes` and `read_customers` are optional scopes in
  `shopify.app.public.toml`; the owner grants them from the app page in Shopify
  admin. Tools that need a missing optional scope return `MISSING_SCOPE` and
  send nothing to Shopify.
- Reports and the daily check build Shopify queries only from named options,
  never from caller text. `tests/store-tools.test.ts` covers fixed queries,
  excluded customer fields, input rejection, optional-scope errors and the
  daily check summary.

### Guide deploy workflow retired

- Remove `.github/workflows/artifacts-deploy.yml`, which deployed the guide on
  every push to this branch. `main` runs no GitHub Actions; deploy the guide with
  `npm run guide:deploy`. `docs/artifacts-deploy.md` is marked retired.

### Plugin 0.2.2 and release packages

- Bump all plugin manifests to 0.2.2 so `claude plugin update` delivers the skill
  changes below. Add `releases/v0.2.2` (both plugin targets, 19 skill ZIPs and
  `SHA256SUMS`), and point the README and setup guides at it.

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

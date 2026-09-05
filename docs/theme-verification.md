# Theme verification: official Liquid core with explicit fixture adapters

The teaching theme now runs through Shopify's open-source Ruby Liquid engine before the browser reads it. This closes the gap where a hand-written HTML harness could pass while the actual Liquid section was broken. It remains a local, authored integration check using synthetic data. It is not an independent model evaluation or Shopify-hosted storefront verification.

## Evidence layers

| Layer | What is exercised | What it cannot establish |
| --- | --- | --- |
| Shopify CLI Theme Check | Actual Liquid, JSON, theme files and static rules | Runtime output, editor behavior or cart acceptance |
| Original 12 Chromium checks | Real variant JavaScript in a hand-written DOM harness | Liquid correctness or Shopify rendering |
| Official Liquid core rendering | Actual `product.json` section order, actual section and layout, Liquid assignments, loops, filters and conditions | Shopify's proprietary objects, extensions or platform services |
| 19 renderer regressions | Available/sold-out/default states, product form shape, actual source mutations, and rejection of unsupported/missing inputs | Complete theme architecture, all locales, markets, product categories or Shopify compatibility |
| 17 Chromium checks on Liquid output | The original 12 behaviors, server-rendered sold-out deep links, a fresh rendered section replacement, unique form IDs, escaped supplied titles and a real browser POST captured locally | Shopify editor operation, Shopify cart acceptance or checkout |

The 12 original and 17 Liquid-output browser checks are 29 executions, including 12 deliberately repeated acceptance behaviors across two rendering paths. They are not 29 distinct use cases or independent model trials. Section replacement uses browser DOM replacement and simulated editor lifecycle events; no Shopify theme editor is connected.

Local verification on September 6, 2026 used Ruby 3.3.12, Liquid 5.13.0, Playwright 1.57.0 and Chromium 143.0.7499.4. All 19 renderer regressions and all 29 browser executions passed. Shopify CLI 4.1.0 Theme Check inspected 5 files and reported no offenses. These observations apply to the synthetic example and the documented local adapters; the [worked-example CI workflow](../.github/workflows/worked-examples.yml) provides repeatable checks for subsequent commits.

## Reproduce

Use Ruby 3.3 and Python with the repository's pinned requirements. The Ruby dependency and checksum lock are [Gemfile.theme](../Gemfile.theme) and [Gemfile.theme.lock](../Gemfile.theme.lock).

```sh
export BUNDLE_GEMFILE=Gemfile.theme
bundle install
python -m pip install -r requirements-dev.txt -r requirements-browser.txt
python -m playwright install chromium
python -m unittest discover -s tests/theme -v
python -m unittest discover -s tests/browser -p 'check_*.py' -v
npx --yes @shopify/cli@4.1.0 theme check --path skills/shopify-theme-development/assets/worked-example/theme --fail-level error --no-color
```

The [renderer](../scripts/render_theme_fixture.rb) can also emit an individual HTML document or section:

```sh
bundle exec ruby scripts/render_theme_fixture.rb --variant 102
bundle exec ruby scripts/render_theme_fixture.rb --variant 103 --section-only
```

Missing Ruby, gems or Chromium, rejected local browser navigation, and renderer exceptions fail the checks. They are not converted to successful skips. The browser server binds to `127.0.0.1` on an ephemeral port. POST capture only records a synthetic form submission in test-process memory; no Shopify endpoint, credential or merchant data is used.

## Where authenticity stops

Shopify's official Liquid **core** is used for parsing and rendering, pinned to 5.13.0. The following pieces are repository-authored adapters, not Shopify code:

- `form`: only the documented product form signature used in this teaching section is supported. Its local output includes the product form action, method, encoding and hidden fields. Browser tests verify what is posted locally. They do not verify what Shopify would accept.
- `schema`: parses the section schema as JSON and omits it from rendered output. Theme Check remains the separate Shopify-owned static check.
- `money`: formats explicit integer GBP minor units for this supplied fixture only. It does not implement presentment currency, exchange rates, rounding, tax or merchant money-format settings.
- `t`: resolves only supplied English translation keys and rejects missing or non-string values. It does not implement Shopify translation fallbacks or localization services.
- `asset_url`: maps an existing fixture asset to localhost. It does not emulate the Shopify CDN.
- Product/request objects, section wrappers, canonical URL and `content_for_header`: supplied local test data. Valid explicit variant IDs and first-available/first fallback are modeled; unknown explicit IDs are rejected because this harness does not establish Shopify's behavior for them.

The renderer uses strict Liquid syntax, missing-variable and missing-filter errors. Unsupported adapter signatures fail closed. This is deliberately narrower than a general Shopify emulator. It still excludes selling plans, bundles, app blocks, variant media, high-variant products and multi-option selection.

## Shopify-hosted workflow evidence still required

No Shopify-hosted development theme, preview URL, editor session, cart or live release was verified in this change. Closing that gap requires a designated development store with a synthetic catalog and explicit authorization for the specific unpublished theme upload. An existing merchant store is not a substitute for that authorization.

Record the following together when that workflow is available:

1. Store purpose, authorization, source commit, unpublished development theme ID and baseline/rollback reference.
2. CLI upload result and processing state, followed by a fresh authenticated preview showing the intended theme and all three variants.
3. Theme-editor section reload and add/remove cycles, keyboard behavior, 390 px view, supported locale/market checks, and unique product-form IDs where the component appears twice.
4. Actual Shopify cart response and cart line inspection proving the selected variant ID, quantity, price and sold-out handling. Keep local POST capture separate from this evidence.
5. App and product-feature scope, observed failures, unresolved limitations and final unpublished state. Publishing requires separate explicit approval, then canonical storefront verification.

## Official sources

Read September 6, 2026:

- [Shopify Liquid 5.13.0 usage and strict rendering](https://github.com/Shopify/liquid/blob/v5.13.0/README.md)
- [Shopify Liquid product form and documented output](https://shopify.dev/docs/api/liquid/tags/form#form-product)
- [JSON templates and section rendering](https://shopify.dev/docs/storefronts/themes/architecture/templates/json-templates)
- [Product object and selected variant](https://shopify.dev/docs/api/liquid/objects/product#product-selected_or_first_available_variant)
- [Money filter](https://shopify.dev/docs/api/liquid/filters/money)
- [Shopify CLI Theme Check](https://shopify.dev/docs/api/shopify-cli/theme/theme-check)
- [Theme editor section lifecycle](https://shopify.dev/docs/storefronts/themes/best-practices/editor/integrate-sections-and-blocks)

# Theme Architecture and Liquid Patterns

Verify current platform behavior in Shopify's first-party documentation:

- <https://shopify.dev/docs/storefronts/themes/architecture>
- <https://shopify.dev/docs/storefronts/themes/architecture/templates/json-templates>

## Architecture responsibilities

- Layouts provide repeated document structure.
- JSON or Liquid templates determine the page template.
- Section groups and sections provide merchant-configurable page regions.
- Blocks provide repeatable configurable content within supported sections.
- Snippets provide reusable Liquid rendering logic.
- Assets contain styles, scripts, images, and supporting resources.
- Config and locale files hold settings and translations.

Use current official documentation for exact limits and schema behavior.

## Implementation rules

- Prefer existing theme conventions before introducing a new abstraction.
- Keep merchant-editable content in appropriate settings, blocks, metafields, or resources.
- Use semantic HTML and native controls before custom interaction patterns.
- Escape or render content according to its source and intended markup.
- Avoid repeated expensive loops and duplicated queries in hot templates.
- Load scripts and media only where needed.
- Keep JavaScript enhancements resilient when JavaScript fails or loads late where practical.
- Preserve app blocks, dynamic sources, editor behavior, and localization.
- Do not edit merchant-authored custom CSS or configuration without explicit scope.

## Section design checklist

```yaml
merchant_job:
supported_templates:
settings_and_defaults:
blocks_and_limits:
dynamic_sources:
empty_state:
editor_preview:
accessibility:
responsive_behavior:
performance:
localization:
app_compatibility:
```

## Media

Use appropriately sized responsive media, intrinsic dimensions, meaningful alternative text rules, and loading priority based on page position. Do not lazy-load a likely largest-content element by default. Validate with the actual theme and page, not a universal snippet.

## JavaScript state

Define source of truth, initialization, teardown, editor events, variant changes, focus behavior, errors, and repeated section rendering. Avoid global listeners or duplicated initialization without guards.

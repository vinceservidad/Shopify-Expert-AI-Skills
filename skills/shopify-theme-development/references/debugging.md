# Theme Debugging

## Reproduction record

```yaml
store_and_theme:
environment:
page_and_template:
market_and_locale:
device_and_browser:
customer_state:
product_and_variant_state:
steps:
expected:
actual:
frequency:
first_seen:
recent_changes:
```

## Diagnosis layers

1. **Content and data:** product, variant, metafield, localization, availability, or policy input.
2. **Configuration:** template assignment, section settings, app embed, market, or theme customization.
3. **Liquid and JSON:** syntax, object scope, conditional logic, schema, rendering, or missing resource.
4. **CSS:** layout, specificity, cascade, stacking, overflow, or responsive condition.
5. **JavaScript:** initialization, event order, stale state, network response, race, or duplicate listener.
6. **App or external service:** injected markup, script, API, rate, authentication, or outage.
7. **Browser and platform:** cache, extension, consent, network, account, or rollout.

Collect evidence before choosing the layer.

## Validation matrix

- representative product, collection, page, article, cart, and search templates when affected
- mobile and desktop, keyboard, zoom, focus, reduced motion, and screen-reader semantics as relevant
- variants, unavailable states, discounts, subscriptions, selling plans, and cart errors
- markets, currencies, languages, tax and shipping messages
- theme editor add, remove, reorder, duplicate, and dynamic-source behavior
- app blocks and embeds
- no-JavaScript or slow-loading behavior where the feature permits
- performance and console or network regressions

## Release states

Record:

```text
local edit -> validated -> previewed -> uploaded -> published -> processing -> live -> verified
```

Save the prior theme or version reference and a specific rollback method. After approved publication, inspect the canonical storefront in the relevant market and device. Do not rely only on the theme editor or preview URL.

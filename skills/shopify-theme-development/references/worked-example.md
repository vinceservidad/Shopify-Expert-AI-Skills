# Worked example: keep selected variant and purchase state together

**Teaching implementation. Not a production theme, live checkout test, or approval to publish.**

The [three-variant input](../assets/worked-example/input.json) defines a synthetic single-option mug. Source files are included in this skill:

- [Product section](../assets/worked-example/theme/sections/main-product.liquid)
- [Variant controller](../assets/worked-example/theme/assets/skills-variant-picker.js)
- [Minimal layout](../assets/worked-example/theme/layout/theme.liquid)
- [Product template](../assets/worked-example/theme/templates/product.json)
- [English strings](../assets/worked-example/theme/locales/en.default.json)
- [Empty teaching settings schema](../assets/worked-example/theme/config/settings_schema.json)

## Reproduction and acceptance criteria

A frequent implementation error is to update the visible option label while leaving the purchase form's variant ID or price unchanged. In this fixture, choosing Moss must display £26 and submit ID `102`; Clay must display £28 and disable the unavailable purchase action. Sand starts at £24 and ID `101`.

Treat that as the problem to reproduce in the target theme, not proof that every theme has the bug. Inspect existing forms, events, working-tree changes and app dependencies before adapting anything.

## Implementation decisions

Use one custom element per product component. Scope every DOM lookup to that instance, keep IDs as strings, and use server-formatted price text. Variant links are real product URLs, so they continue to work through page navigation without JavaScript. The product form contains the selected variant ID; JavaScript never submits a cart request itself.

The controller updates the price, hidden ID, purchase-button availability, accessible current selection, and live status together. Browser history restores the selected variant. An invalid historical ID clears the stale ID and disables submission. Text is assigned with `textContent`, not inserted as HTML.

An `AbortController` removes listeners when the element disconnects, and the registration guard prevents duplicate custom-element definitions. Loading the asset once from the teaching layout allows newly inserted elements to initialize without depending on inline scripts inside replaced section HTML.

## Expected state checks

| Action | Expected outcome |
| --- | --- |
| Initial Sand | £24, ID 101, enabled purchase action |
| Choose Moss with mouse or keyboard | £26, ID 102, current link and status updated |
| Choose Clay | £28, ID 103, sold-out action disabled |
| Browser Back | Previous selected variant restored |
| Remove and reinsert component | One state-change event per selection |
| Add a second instance | Only that instance changes; secondary does not alter the page URL |
| Load the script twice | No duplicate registration error |
| Unknown ID in history | No stale form ID can be submitted |
| Disable JavaScript | Variant link navigates to the selected server-rendered page |

## Test boundaries and rollout

The repository browser suite uses the real JavaScript with a synthetic HTML harness. It tests DOM behavior, keyboard activation, history, no-JavaScript link navigation, and a 390 px layout. **That harness is not Shopify's Liquid renderer.** Theme Check is a separate static check on the Liquid/JSON source. Neither check proves an actual theme editor, real cart, market pricing, or live store works.

This deliberately small example excludes variant-specific media, selling plans, bundles, app blocks, multi-option pickers and high-variant products. Do not transplant it into those cases. The minimal theme is not a replacement for Dawn or an existing merchant theme.

Before production use, integrate the smallest compatible change into an unpublished development theme. Run Theme Check, inspect actual rendered variants and media, test apps, markets, editor re-rendering, keyboard and screen-reader behavior, and confirm the cart receives the intended variant. Publish only with explicit approval and verify the canonical storefront afterward. Keep the prior theme/version for rollback.

## Official sources

Checked September 6, 2026:

- Variant selection and deep links: <https://shopify.dev/docs/storefronts/themes/product-merchandising/variants>
- Theme-editor replacement and cleanup: <https://shopify.dev/docs/storefronts/themes/best-practices/editor/integrate-sections-and-blocks>
- Static checking: <https://shopify.dev/docs/api/shopify-cli/theme/theme-check>

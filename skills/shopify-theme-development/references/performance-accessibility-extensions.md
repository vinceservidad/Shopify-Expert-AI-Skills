# Theme Performance, App Extensions, and WCAG 2.2 AA Accessibility

Official starting points:

- <https://shopify.dev/docs/storefronts/themes/tools/theme-check> (Shopify Theme Check linter)
- <https://shopify.dev/docs/storefronts/themes/tools/theme-check/checks> (Theme Check rules reference)
- <https://shopify.dev/docs/storefronts/themes/best-practices/performance> (Shopify theme performance best practices)
- <https://shopify.dev/docs/storefronts/themes/best-practices/performance/platform> (Shopify platform performance and Web Performance)
- <https://shopify.dev/docs/apps/build/online-store/theme-app-extensions> (Theme App Extensions)
- <https://shopify.dev/docs/apps/build/online-store/theme-app-extensions/configuration> (App blocks and app embeds configuration)
- <https://shopify.dev/docs/api/admin-graphql/latest/objects/ScriptTag> (ScriptTag GraphQL reference and deprecation)
- <https://shopify.dev/docs/storefronts/themes/best-practices/accessibility> (Shopify storefront accessibility best practices)
- <https://www.w3.org/TR/WCAG22/> (W3C WCAG 2.2 Recommendation)
- <https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html> (WCAG 2.2 SC 2.5.8 Target Size Minimum)
- <https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html> (WCAG 2.2 SC 2.4.11 Focus Not Obscured Minimum)

Use this playbook when auditing or updating Shopify theme code for Core Web Vitals, cleaning up legacy `ScriptTag` or app snippet bloat, or checking storefront templates against WCAG 2.2 Level AA accessibility criteria. Always inspect the target theme first and never publish theme changes without explicit approval.

## 1. Shopify Theme Check and CLI baseline

Run Shopify Theme Check through Shopify CLI before uploading or publishing theme edits:

```bash
shopify theme check
shopify theme check --fail-level error
```

Useful flags include `--path <dir>`, `--config <file>`, `--list` to inspect active rules, and `--auto-correct` only on scoped files you plan to review in `git diff`.

High-impact performance checks enforced by Theme Check:

- `ParserBlockingScript`: catches `<script src="...">` tags missing `defer` or `async`.
- `AssetPreload`: prefers Liquid preload filters over manual preload markup that can drift from CDN asset URLs.
- `CdnPreconnect`: flags missing or redundant preconnect hints for Shopify's CDN.
- `AssetSizeCSS` and `AssetSizeJavaScript`: flags oversized CSS or JS payloads that hurt mobile load and interaction times.

## 2. Core Web Vitals: Web Performance Dashboard vs Lighthouse

Keep field data and lab data separate when reporting theme speed:

- Shopify Web Performance Dashboard (`Online Store > Themes`): Real User Monitoring (RUM) data at the 75th percentile from actual shoppers across Home, Collection, Product, and Cart pages. Use this as the primary gauge of real storefront speed and correlate shifts with theme or app change annotations.
- Google Lighthouse and Shopify Lighthouse CI GitHub Action: synthetic lab tests on a throttled mobile profile. Use lab runs during pull requests and staging previews to isolate code regressions before publish.

Core Web Vitals targets and common Shopify fixes:

| Metric | Good target (75th pct) | Frequent Shopify theme defect | Standard fix |
| --- | --- | --- | --- |
| LCP (Largest Contentful Paint) | `<= 2.5 s` | Applying `loading="lazy"` to the hero banner or main product image | Eager-load the primary above-the-fold image and set `fetchpriority="high"`; avoid hiding the hero behind JS sliders |
| INP (Interaction to Next Paint) | `<= 200 ms` | Heavy third-party scripts and long JS tasks blocking variant clicks or cart drawers | Defer non-critical scripts, remove unused app embeds, and keep variant/cart handlers lightweight |
| CLS (Cumulative Layout Shift) | `<= 0.1` | Images without explicit `width` and `height`, or late-injected announcement bars and review badges | Output explicit intrinsic dimensions via Liquid `image_tag` and reserve vertical space with CSS `min-height` or `aspect-ratio` |

## 3. Theme App Extensions vs legacy `ScriptTag` and snippet bloat

Shopify has scheduled a hard shutdown for storefront `ScriptTag` injections (`online_store` display scope):

- October 1, 2026: `scriptTagCreate` and `scriptTagUpdate` (and REST `POST`/`PUT` equivalents) return errors across all API versions. Read and delete operations remain available for cleanup.
- March 1, 2027: Shopify stops injecting legacy `ScriptTag` scripts into storefronts entirely.

Choose the supported integration surface when auditing or replacing legacy code:

| Need | Supported surface | Why it is safer than snippets or `ScriptTag` |
| --- | --- | --- |
| Inline page UI (reviews, badges, size charts) | App Block (Theme App Extension) | Merchants position and remove it in Theme Editor with zero Liquid file edits |
| Site-wide widget (chat, popup, announcement) | App Embed (Theme App Extension) | Merchants toggle it on or off in Theme Editor; uninstalling leaves no orphan code |
| Conversion and analytics tracking | Web Pixels (`Settings > Customer events`) | Runs inside a privacy-aware sandbox across storefront and checkout |

When cleaning up uninstalled apps from a theme, inspect `layout/theme.liquid`, `templates/`, and `snippets/` for leftover `{% render %}` calls, inline `<script>` loaders, or dead external URLs returning 404 errors. Duplicate the theme before removing any snippet and verify the preview across desktop and mobile.

## 4. WCAG 2.2 Level AA storefront accessibility checks

Shopify hosts and maintains accessibility inside Checkout, while the merchant and theme developer own storefront templates (such as navigation, collections, product pages, and cart drawers).

Run both automated checks (Lighthouse Accessibility or axe) and manual keyboard checks on every modified template:

1. Keyboard navigation and focus order: tab through menus, search, variant pickers, and the cart drawer using standard keyboard keys (`Tab`, `Enter`, `Space`, and `Escape`). Every interactive control must be reachable and operable without a mouse.
2. Focus Not Obscured (WCAG 2.2 SC 2.4.11, Level AA): when tabbing down and back up a page, the focused element must never be completely hidden behind sticky headers, announcement bars, cookie banners, or chat launchers. Add CSS `scroll-margin-top` or `scroll-padding-top` to match sticky header height.
3. Target Size Minimum (WCAG 2.2 SC 2.5.8, Level AA): clickable and tappable controls such as color swatches, pagination dots, close buttons, and quantity steppers must be at least `24 x 24` CSS pixels (unless they meet a documented WCAG exception such as inline text links or sufficient spacing).
4. Visible focus and contrast: never strip `:focus-visible` outlines without providing a clear replacement. Check text contrast (at least `4.5:1` for normal text and `3:1` for large text or UI components).
5. Semantics, labels, and alt text: pair every form input with a visible `<label for="...">` because placeholder text alone is not a label. Keep heading levels ordered, and output meaningful `alt` text on product media (or empty `alt=""` on purely decorative images).
6. Dialogs and live updates: trap focus inside open drawers or modals, return focus to the trigger on close, and announce dynamic cart or error updates using `aria-live="polite"` or `role="alert"`.

## 5. Verification before handoff

1. Run `shopify theme check` and resolve new errors introduced in scoped files.
2. Test affected templates at desktop and `390px` mobile widths with keyboard-only navigation.
3. Record before/after Lighthouse lab metrics on the preview URL, note that Web Performance Dashboard field data updates over time after publish, and keep publishing gated on explicit merchant approval.

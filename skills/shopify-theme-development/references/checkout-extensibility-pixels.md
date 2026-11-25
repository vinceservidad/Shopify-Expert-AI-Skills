# Checkout Extensibility, Web Pixels & Shopify Functions Playbook

Official starting points:
- <https://shopify.dev/docs/apps/build/checkout> (Checkout UI extensions)
- <https://shopify.dev/docs/api/web-pixels-api> (Web Pixels API & custom pixels)
- <https://shopify.dev/docs/apps/build/functions> (Shopify Functions)

Use this playbook when migrating legacy checkout customizations, diagnosing missing conversion tracking on Checkout / Thank You / Order Status pages, or deciding whether a requested change belongs in the theme, a Checkout UI extension, a Web Pixel, or a Shopify Function.

## 1. Legacy sunset rules (`checkout.liquid` & Additional Scripts)

- **No theme edits for checkout**: `checkout.liquid` is deprecated/replaced by Checkout Extensibility, and `Settings → Checkout → Order status page → Additional scripts` (plus legacy ScriptTag checkout injections) are deprecated in favor of **Web Pixels** and **Checkout UI Extensions**.
- **Do not promise theme-level checkout hacks**: Standard Liquid theme files (`layout/`, `templates/`, `sections/`, `assets/`) cannot modify Shopify's hosted Checkout, Thank You, or Order Status markup or inject inline `<script>` tags into checkout.
- **Migration check**: When a merchant asks why a Thank You page survey, upsell, trust badge, or ad pixel stopped firing or shows an upgrade warning in Shopify Admin, inspect `Settings → Customer events` (Web Pixels) and `Settings → Checkout → Customize` (Checkout Editor / UI Extensions) instead of patching `theme.liquid`.

## 2. Picking the right Shopify extension surface

| Merchant need | Correct surface | Notes & plan boundaries |
| --- | --- | --- |
| Storefront pages (home, collection, product, cart drawer, blog) | **Online Store 2.0 Theme** (Liquid, JSON templates, app blocks, app embeds) | All plans; keep theme code clean and avoid editing third-party app code directly |
| Checkout branding (logo, colors, typography, corner radius) | **Checkout Editor** (`Settings → Checkout → Customize`) + Branding API | Available on all plans (full Branding API / UI extensions inside checkout steps require Shopify Plus; Thank You & Order Status extensions work broadly) |
| Custom UI blocks in Checkout / Thank You / Order Status (upsells, delivery notes, loyalty, surveys, trust banners) | **Checkout UI Extensions** (installed via Shopify App) | Runs in a strict sandbox; cannot read arbitrary DOM or inject raw HTML/CSS/scripts |
| Ad pixels, GA4, Meta, TikTok, affiliate & conversion tracking across storefront + checkout | **Web Pixels** (App Pixels via official sales channels or **Custom Pixels** under `Settings → Customer events`) | Runs in a strict sandbox (`lax` or `strict` iframe) subscribing to standard `analytics.subscribe(...)` events; respects Shopify Customer Privacy API consent automatically |
| Custom discount logic, volume tiers, shipping rate hiding/reordering, payment method rules, cart validation, order routing | **Shopify Functions** (WebAssembly app extensions) | Replaces legacy Shopify Scripts (`Ruby`); executes server-side in <5 ms with deterministic input/output limits |

## 3. Web Pixels tracking checklist (Custom Pixels & App Pixels)

1. **Prefer official App Pixels first**: Use Shopify's official Google & YouTube channel and Facebook & Instagram channel apps before writing Custom Pixels so server-side conversions and standard events stay maintained.
2. **Subscribe to standard Shopify customer events**:
   - `page_viewed`, `product_viewed`, `collection_viewed`, `search_submitted`
   - `product_added_to_cart`, `product_removed_from_cart`, `cart_viewed`
   - `checkout_started`, `checkout_contact_info_submitted`, `checkout_address_info_submitted`, `checkout_shipping_info_submitted`, `payment_info_submitted`, `checkout_completed`
3. **Respect sandbox limits**: Custom Pixels cannot access `window.document` on the parent checkout page, cannot scrape DOM prices, and must read all order totals, currency, line items, and `checkout.order.id` from the `event.data.checkout` payload.
4. **Deduplicate carefully**: Never fire the same ad pixel in `theme.liquid`, legacy Additional Scripts, AND Customer Events simultaneously—check `Customer events` and theme app embeds first to prevent double-counted `Purchase` events.
5. **Verify with Shopify Pixel Helper & test order**: Confirm the pixel status is `Connected` in `Settings → Customer events`, test consent states, and confirm `checkout_completed` fires once with accurate `currencyCode`, `subtotalPrice`, `totalPrice`, and item IDs.

## 4. Shopify Functions diagnostic checklist

- When auditing legacy Shopify Scripts migrations or complex checkout pricing/shipping/payment rules:
  - Check **discount combinations** (product + order + shipping stacking rules) in `Discounts` admin.
  - Check **Cart & Checkout Validation Functions** if valid customers are blocked from completing checkout (e.g., PO box rules, max-quantity rules, B2B minimums).
  - Check **Delivery Customization** and **Payment Customization** Functions when shipping options or payment gateways unexpectedly hide or reorder for specific countries, cart totals, or customer tags.

## 5. Verification before closing

1. Confirm whether the requested change lives in the theme, Checkout Editor, Customer Events (Web Pixels), or an app/Function before editing code.
2. On any tracking or checkout migration, verify both storefront events (`product_viewed`, `product_added_to_cart`) and `checkout_completed` with a controlled test order—never assume a saved pixel snippet works live.

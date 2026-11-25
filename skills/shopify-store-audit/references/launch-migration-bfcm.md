# Store Launch, Migration & Peak-Sale (BFCM) Readiness Playbook

Official starting points:
- <https://help.shopify.com/en/manual/intro-to-shopify/initial-setup/new-to-shopify-checklists/general-checklist> (Shopify launch checklist)
- <https://help.shopify.com/en/manual/migrating-to-shopify> (Migrating to Shopify)

Use this playbook for three high-stakes VA assignments: **new store pre-launch QA**, **platform migrations** (WooCommerce, Wix, Squarespace, Magento → Shopify), and **peak-sale / BFCM readiness**. Start read-only and turn every unchecked item into a clear pass/fail tracker for owner sign-off.

## 1. Pre-launch QA checklist (new store or redesign)

- **Domain, SSL & password**: Primary domain connected and set as canonical (`https://`), SSL active (no mixed-content warnings), storefront password removal scheduled only after QA passes.
- **Payments & live test order**: Payment provider active, accelerated checkouts (Shop Pay, Apple Pay, PayPal) verified, payment capture mode confirmed (automatic vs. manual), and **at least one controlled test order** placed and refunded/canceled (or tested with Bogus Gateway before launch) checking confirmation email, tax, and shipping.
- **Shipping & taxes**: Domestic and international shipping zones tested across real addresses; tax registration settings confirmed by merchant/accountant (never give tax/legal advice—verify the merchant's documented settings).
- **Legal & trust pages**: Refund/return policy, shipping policy, privacy policy, terms of service, and real contact details linked in footer and checkout policies (`Settings → Policies`).
- **Email authentication**: Sender email uses the store's own domain (not `@gmail.com`) with valid **SPF, DKIM, and DMARC** DNS records verified in Shopify Admin (`Settings → Notifications`) and ESP (e.g., Klaviyo) so order confirmations do not hit spam.
- **Tracking & SEO**: `robots.txt` / sitemap accessible after password removal, GA4 + Google & YouTube channel + Meta channel connected via Web Pixels (no duplicate firing), favicon and social share preview image verified.
- **Mobile buyer flow**: Test homepage → collection filter → product variant select → add to cart → cart drawer → checkout on real mobile width (`390px`), verifying zero broken buttons, overlapping chat widgets, or unreadable overlays.

## 2. Platform migration QA checklist (WooCommerce / Wix / Magento → Shopify)

1. **301 URL redirect map**: Map every high-traffic legacy product, collection, category, and blog URL (from Google Search Console + Analytics top landing pages) to its exact new Shopify URL (`/products/...`, `/collections/...`, `/pages/...`, `/blogs/...`) before DNS cutover. Verify zero redirect loops and zero mass-redirects to homepage.
2. **Catalog & variant parity**: Spot-check titles, SKUs, barcodes/GTINs, prices, compare-at prices, weights, inventory quantities, images, alt text, SEO meta titles/descriptions, and active vs. draft status.
3. **Customer & order history**: Confirm migrated customer accounts know how to activate/sign in (Customer Accounts vs. legacy accounts; passwords do not migrate), and verify historical order counts/totals if used for VIP segments.
4. **Subscriptions & gift cards**: Verify active subscriber payment tokens and remaining gift-card balances migrated cleanly with the subscription app provider before turning off the legacy store.
5. **Post-cutover 48-hour watch**: Monitor 404 logs, Google Search Console crawl errors, live checkout conversion, payment gateway settlements, and ad landing URLs (Google Shopping / Meta catalog feeds update to new URLs).

## 3. Peak-sale & BFCM readiness checklist

Run this check **7–14 days before launch** and freeze risky theme/app changes **48 hours before go-live**:

- **Inventory & hero SKU buffers**: Confirm physical + 3PL stock counts on hero SKUs, set clear `Continue selling when out of stock` (`DENY` vs. `CONTINUE`) rules, and verify low-stock Flow alerts.
- **Discount stacking audit**: List every active automatic discount, coupon code, bundle app, free-gift script, and email welcome code. Run checkout tests to confirm no unintended double-stacking wipes out margin.
- **Theme & banner cutover**: Stage promo theme copy, announcement bars, and collection order in a **duplicate unpublished theme** (or scheduled Launchpad/editor preview) so rollback is one click.
- **Support & SLA prep**: Update shipping cutoff notices, FAQ answers, and helpdesk macros for extended peak-season processing times so support is not flooded with avoidable WISMO tickets.
- **Fallback plan**: Document who is on call, how to disable a broken promo discount or revert the theme within 5 minutes, and what backup payment/fulfillment escalation applies if an app spikes errors.

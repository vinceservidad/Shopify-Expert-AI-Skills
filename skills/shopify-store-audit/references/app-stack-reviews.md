# App Stack Hygiene & Product Review Moderation Playbook

Official starting point:
- <https://help.shopify.com/en/manual/apps/managing-apps> (Managing apps)

Use this playbook for routine weekly/monthly store hygiene: auditing third-party Shopify apps for cost, speed, and leftover code, and managing product reviews safely without violating platform or FTC endorsement rules. Never uninstall an app, delete customer reviews, or edit theme files without explicit owner approval.

## 1. Shopify App Stack Hygiene Audit

Many Shopify stores accumulate 15–30+ apps over time, causing duplicate scripts, slower mobile page loads, checkout/cart drawer conflicts, and wasted monthly subscriptions.

### Audit table to prepare for owner review

For every installed app (and every active **Theme Editor → App embed**), record:

```yaml
app_name:
monthly_cost:
purpose:
active_owner:
storefront_injection:   # none | app embed | app block | legacy theme snippet
overlap_or_conflict:    # e.g., overlaps native Shopify Discounts / Search & Discovery / Forms
status_recommendation:  # keep | replace with native | test disable | uninstall after backup
```

### Safe app cleanup checks

1. **Spot redundant paid apps**: Flag paid apps duplicating built-in Shopify features (e.g., basic search/filters vs. Shopify Search & Discovery, basic email capture vs. Shopify Forms, simple alerts vs. Shopify Flow, simple bundles vs. Shopify Bundles) only after checking whether the store relies on advanced app-only features.
2. **Check orphaned code from old apps**: Uninstalling a legacy app in Shopify Admin does **not** always remove snippets or `<script>` tags it injected into `theme.liquid`, `product` templates, or `cart` files. Audit `theme.liquid` and `snippets/` (via `shopify-theme-development`) for dead script URLs or 404 console errors.
3. **Check mobile script weight**: Inspect network requests and console errors on homepage, collection, and product pages—pop-ups, chat widgets, loyalty launchers, and review carousels often collide on `390px` mobile screens and block the Add-to-Cart button.
4. **Backup before removal**: Duplicate the live theme and export app data (reviews CSV, redirects, loyalty balances, quiz responses) before any approved uninstall.

## 2. Product Review Moderation & UGC Hygiene

Applies to Judge.me, Loox, Okendo, Yotpo, Stamped, and Shopify Product Reviews exports.

- **Compliance guardrail (FTC & platform rules)**: Never fabricate reviews, pay for undisclosed positive reviews, or suppress legitimate negative reviews solely because they are 1–2 stars. Follow the merchant's documented moderation policy and applicable consumer-protection rules.
- **Legitimate moderation actions**:
  - Flag/quarantine **spam, bot links, profanity/hate speech, private PII** (customer phone/address posted in review text), or **off-topic shipping/carrier rants** only where the merchant's published review policy allows.
  - Escalate **safety, allergy, counterfeit, or legal complaints** found inside reviews immediately to the owner/support lead.
- **Responding to 1–3 star reviews publicly**:
  - Keep replies calm, brief, factual, and non-defensive.
  - Acknowledge the buyer's experience without admitting unverified defects, avoid posting private order details publicly, and invite the customer to contact support with their order number to resolve under policy.
- **Review mining for store growth**: Tag recurring review themes (sizing runs small, packaging damage, unexpected color, top praised benefit) and pass verified quotes to `shopify-product-page`, `shopify-creative-strategy`, and `shopify-support` FAQ updates.
- **Review request timing**: Confirm post-purchase review emails trigger after **verified delivery** (not order placement), so customers are not asked to review an item that has not arrived yet.

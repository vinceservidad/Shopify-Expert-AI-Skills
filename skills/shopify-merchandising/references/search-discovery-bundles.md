# Shopify Search and Discovery and Native Bundles Playbook

Official starting points:

- <https://shopify.dev/docs/storefronts/themes/navigation-search/filtering/storefront-filtering> (Storefront filtering limits and architecture)
- <https://shopify.dev/docs/apps/build/product-merchandising/bundles> (Shopify Bundles architecture and rules)
- <https://help.shopify.com/en/manual/products/collections> (Shopify collections)

Use this playbook when configuring native storefront filters, search boosts, product recommendations in Shopify Search and Discovery, or merchandising fixed bundles and multipacks with the native Shopify Bundles app. Always confirm visible limits and theme support in the target store before promising behavior.

## 1. Shopify Search and Discovery limits and setup

Shopify Search and Discovery is Shopify's native app for storefront filtering, search tuning, and product recommendations. Plan merchandising architecture around its documented limits:

| Capability | Documented Shopify limit | Merchandising implication |
| --- | --- | --- |
| Total storefront filters | Up to 25 filters per store (standard plus custom) | Prioritize high-intent customer filters (availability, price, size, color) instead of creating narrow single-collection filters |
| Collection size for native filters | Collections with more than 5,000 products do not display native filters | Split oversized collections into tighter customer-task collections, or evaluate an externally indexed search app |
| Displayed values per filter | Up to 100 values per filter | Standardize variant option values and Category Metafields so messy duplicates do not push real options past 100 |
| Search result filter calculation | Calculated from up to the first 1,000 search results | Keep catalog titles and tags clean so relevant products rank inside the top 1,000 results |

Operational checklist for Search and Discovery:

1. Back filters with Category Metafields or governed product/variant metafields instead of messy raw product tags whenever the theme supports Online Store 2.0 storefront filtering.
2. Product boosts: apply search boosts selectively for high-margin hero products or seasonal campaigns on specific high-volume search queries, and set a review date so expired promotions do not stay boosted.
3. Product recommendations: configure Complementary products (up to 10 hand-picked items per product, which can blend with automatic suggestions) for true pairings like refills or accessories, and verify Related products align with the shopper's budget and availability.
4. Keep an `Availability` (In stock) filter accessible on collections with frequent sellouts so shoppers can hide sold-out sizes quickly.

## 2. Native Shopify Bundles rules and guardrails

The native Shopify Bundles app creates fixed bundles and multipacks backed by real component products.

Verified operational limits and behaviors:

- Component limits: up to 30 components in a fixed bundle, and up to 2,000 units per component.
- Option and variant limits: up to 3 options and 100 variants total per bundle.
- Real-time inventory sync: bundle availability is calculated dynamically from the lowest available stock of its underlying component SKUs, helping prevent overselling without manual bundle stock splits.
- Order and fulfillment behavior: when a shopper buys a bundle, the order breaks out individual component SKUs for picking and packing. Confirm the warehouse or 3PL handles expanded component lines cleanly before launch.
- Pricing does not auto-sync: changing a component product's price later does not automatically recalculate the bundle price. Maintain a bundle price audit whenever component prices change.
- Weight calculation: bundle shipping weight derives automatically from component weights rather than a manual override weight on the parent bundle.
- Storefront filter limit: bundled products do not appear under standard storefront option filters due to index naming constraints.
- Channel scope: verify active eligibility across Online Store, Shop, Shopify POS, and Google and YouTube (for fixed product bundles) before promising multi-channel availability.

## 3. Pre-launch QA checks

1. Storefront filters: test every active filter on desktop and mobile (`390px`) across representative collections, checking zero-result edge cases and verifying no collection silently exceeded 5,000 products.
2. Recommendations: inspect live product pages to confirm complementary and related cards do not show out-of-stock items or duplicate the main product.
3. Bundles: verify component SKU weights, bundle price versus sum of components, discount combination rules (so sitewide codes do not double-discount an already discounted bundle), and sellout behavior when one component drops to `0` inventory.

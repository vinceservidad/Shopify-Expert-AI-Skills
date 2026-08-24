# Merchandising Framework

## Surfaces

- homepage and campaign landing pages
- navigation, search suggestions, and menus
- collections, filters, sorting, and product cards
- product recommendations, bundles, upsells, and cross-sells
- cart, post-purchase, email, ads, and sales-channel feeds

## Evidence

Use defined product views, collection engagement, search, conversion, orders, units, realized revenue, named profit, inventory, returns, cancellations, reviews, customer research, and operational constraints. Platform recommendation output is a signal, not proof of incrementality.

## Assortment roles

Define roles from evidence, not labels alone:

- traffic or discovery product
- hero or priority product
- entry-price product
- core range
- premium option
- add-on or attachment product
- replenishment product
- seasonal or launch product
- clearance or exit product

State the source, scope, period, economics, and inventory for every decision-changing role.

## Collection rules

Confirm the current collection model visible in the target Shopify admin. Shopify's collection capabilities are evolving, so do not assume another store's manual, smart, source, condition, or variant behavior applies.

Official current reference: <https://help.shopify.com/en/manual/products/collections>

For each collection define:

```yaml
customer_task:
business_role:
source_or_membership_method:
inclusion:
exclusion:
sort_logic:
out_of_stock_behavior:
fallback:
market_and_channel_scope:
owner:
review_date:
```

## Recommendation rules

A cross-sell, upsell, bundle, or recommendation should have a clear customer relationship, product compatibility, availability, offer truth, margin guardrail, and fulfillment feasibility. Avoid irrelevant attachment that adds friction or creates return risk.

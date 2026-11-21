# Shopify Product Listing Field Contract

Confirm current fields and account-visible behavior in Shopify before editing. A typical listing can include:

## Identity and content

- title, handle, description, media, alternative text, status, and theme template
- product category from Shopify's current taxonomy
- category attributes or metafields
- product type, vendor, tags, collections, and custom metafields
- product disclosures or warnings when required

## Commerce

- price, compare-at price, cost, tax treatment, unit pricing where applicable, purchase options, and market behavior
- inventory tracking, inventory location, quantity source, out-of-stock behavior, and fulfillment service
- physical-product state, weight, customs or origin information where required, and shipping profile dependency

## Variants

```yaml
option_names:
option_values:
variant_title:
sku:
barcode_or_identifier:
price:
compare_at_price:
cost:
inventory_policy:
inventory_by_location:
weight:
media:
availability:
```

Do not recycle a SKU or barcode without authoritative confirmation. Do not merge or reorder options casually because variant identity, links, apps, inventory, feeds, and orders can depend on them.

## Search and channels

- search-engine title, meta description, URL, canonical behavior, and redirect decision
- sales channels, markets, publishing schedule, catalog eligibility, product status, and feed requirements

## Source map

```yaml
field:
proposed_value:
source:
source_date:
owner:
confidence:
required_before_publish:
```

Official current references:

- <https://help.shopify.com/en/manual/products/add-update-products>
- <https://help.shopify.com/en/manual/products/details/product-details-page>
- <https://help.shopify.com/en/manual/custom-data/metafields/category-metafields>

# Product Listing QA

## Before save

- correct target store and create or update mode
- approved source and owner
- no duplicate product, handle, SKU, barcode, or variant
- claims, specifications, materials, ingredients, compatibility, and disclosures supported
- price, compare-at price, cost, tax, currency, and offer approved
- category, attributes, product type, vendor, collections, tags, and metafields mapped
- variant options, values, identifiers, media, and inventory mapped
- shipping, weight, fulfillment, locations, and purchase options verified
- media order, crop, quality, rights, filenames, and alternative text checked
- SEO title, description, URL, and redirect decision reviewed
- status, markets, channels, template, and publication state explicitly selected

## After save

- reopen the authoritative product record
- compare decision-critical fields with the source
- test every variant and media association
- confirm inventory location and sellable state
- confirm price, discounts, purchase options, and availability
- check product organization, collection membership, and metafields
- record product ID, handle, status, and saved timestamp

## After approved publication

- verify the canonical live product page in each scoped market and device
- test variant selection, price, availability, media, quantity, and add to cart
- confirm shipping, returns, warranty, subscription, and policy truth
- inspect search-engine output and structured data when in scope
- confirm the intended sales channels and feeds received the correct product state
- record propagation or processing states separately from verified acceptance

## Handoff

```yaml
product:
product_id:
handle:
created_or_updated:
source:
status:
channels_and_markets:
qa_passed:
exceptions:
approval:
live_verification:
rollback:
```

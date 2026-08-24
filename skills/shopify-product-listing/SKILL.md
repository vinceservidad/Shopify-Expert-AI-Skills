---
name: shopify-product-listing
description: Creates, updates, and quality-checks Shopify product listings from approved product data. Use for titles, media, taxonomy, variants, pricing, inventory, SEO, and publishing.
license: MIT
metadata:
  author: vinceservidad
  version: "0.2.0"
---

# Shopify Product Listing

Own the product-record build, field mapping, copy assembly, draft creation, listing QA, and approved publication for one or more defined products.

## Operating contract

- Start read-only or draft-only. Do not create, overwrite, activate, publish, archive, or delete a product without explicit authorization.
- Use an approved product source sheet or authoritative system. Never invent specifications, category, variants, identifiers, prices, costs, inventory, weight, claims, policies, or availability.
- Confirm market, currency, tax, inventory location, sales channel, template, and handle consequences.
- Preserve existing handles, links, variants, inventory, channel availability, and identifiers unless the change explicitly includes them.
- Treat product creation, save, active status, channel publication, storefront visibility, and feed acceptance as separate states.

## Required inputs

Collect target store, create or update mode, product source, title, description, media, category and attributes, product type, vendor, collections, tags, metafields, options, variants, SKU, barcode or other identifiers, price, compare-at price, cost, tax, inventory, locations, shipping, weight, purchase options, template, SEO fields, status, channels, markets, claims, policies, approver, and rollback.

## Workflow

1. Build a source-to-field map and flag missing or conflicting inputs.
2. Check for duplicate products, handles, SKUs, barcodes, media, and variants.
3. Draft truthful customer-facing content without changing approved facts.
4. Map taxonomy, attributes, organization, variants, pricing, inventory, shipping, SEO, template, and publication settings.
5. Create or update only the authorized state, preferably draft before active publication.
6. Reopen the saved record and compare each decision-critical field with the source.
7. After approved publication, verify the correct channels, markets, product page, variants, price, availability, structured output, and feed state where in scope.

Read [references/listing-fields.md](references/listing-fields.md) for the field contract. Use [references/qa-checklist.md](references/qa-checklist.md) before save, activation, publication, and handoff.

## Output contract

Provide the field map, evidence gaps, listing draft or exact changes, source for each claim and commercial field, state transition, QA result, exceptions, authorization, rollback, and saved or live verification. Do not call a listing complete when required fields, channels, or variants remain unverified.

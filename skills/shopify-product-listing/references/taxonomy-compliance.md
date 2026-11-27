# Standard Product Taxonomy, Category Metafields, and Compliance Fields

Official starting points:

- <https://help.shopify.com/en/manual/custom-data/metafields/category-metafields> (Shopify category metafields)
- <https://shopify.dev/docs/api/admin-graphql/latest/objects/TaxonomyCategory> (Shopify Standard Product Taxonomy GraphQL reference)
- <https://support.google.com/merchants/answer/6324461> (Google Merchant Center GTIN specification)
- <https://support.google.com/merchants/answer/6324478> (Google Merchant Center `identifier_exists` specification)
- <https://eur-lex.europa.eu/eli/reg/2023/988/oj> (EU General Product Safety Regulation, Regulation (EU) 2023/988)

Use this playbook when mapping Shopify categories and category metafields, product identifiers, customs fields, and EU product safety disclosures on individual Shopify product listings. Never invent barcodes, HS codes, manufacturer details, or safety claims; flag missing compliance inputs for the merchant owner.

## 1. Shopify Standard Product Taxonomy and Category Metafields

Shopify's Standard Product Taxonomy assigns a structured category path to every product (for example `Apparel & Accessories > Clothing > Clothing Tops > Shirts`). Choosing the most specific accurate category does four things automatically:

- Activates pre-defined Category Metafields (metaobject-backed attributes such as color, size, material, or age group).
- Helps Shopify Tax apply accurate category-based tax rates and regional exemptions.
- Maps product categories cleanly to external channels such as Google Shopping, Meta, and marketplaces.
- Enables consistent storefront filtering in Shopify Search and Discovery.

Connecting Category Metafields to variant options:

1. Assign the exact Standard Product Taxonomy category before building options when possible.
2. Connect supported variant options (such as Color or Size) to the product's Category Metafield entries instead of typing free-text values like `Blk`, `Black`, and `Noir` across separate listings.
3. Understand global edits: renaming a shared Category Metafield metaobject entry updates every variant connected to that entry across the store. Confirm catalog impact before editing shared entries.
4. Keep `Product type` separate from `Category`: `Category` uses Shopify's standardized taxonomy, while `Product type` is the merchant's internal label for collections, reporting, or navigation.

## 2. Product identifiers for feeds and channels (GTIN, MPN, `identifier_exists`)

External sales channels rely on accurate variant-level product identifiers to match products and avoid disapprovals.

- GTIN (`Barcode` field in Shopify): enter the manufacturer-assigned UPC (12 digits), EAN (13 digits), JAN, or ISBN exactly as issued. Never make up placeholder numbers or reuse another SKU's barcode.
- MPN (Manufacturer Part Number): store the supplier's model or style code in the merchant's approved field or metafield when selling branded or multi-model goods.
- Custom or handmade goods without a GTIN: leave `Barcode` blank and follow the target channel's exemption rule (for example setting `identifier_exists` to `false` in Google Merchant Center only when the item genuinely has no assigned GTIN and MPN, or using Shopify's no-barcode declaration where supported for EU customs).

## 3. International customs fields (HS Code and Country of Origin)

For any physical product shipped across borders, populate both customs fields under the variant's Shipping and Customs section:

- Country/Region of origin: the country where the product was manufactured or substantially transformed (confirmed from supplier documentation, not guessed from the warehouse address).
- Harmonized System (HS) code: the 6-digit international tariff prefix (plus country-specific digits when required by the destination market).

Missing HS codes or country of origin cause inaccurate duty estimates in Shopify Markets and increase the risk of customs holds or returned parcels.

## 4. EU General Product Safety Regulation (GPSR) listing fields

This section is an operational checklist, not legal advice. The merchant and their legal or compliance advisor decide which products fall under Regulation (EU) 2023/988 and supply the approved wording.

For non-food consumer products offered to shoppers in the European Union, EU GPSR requires key traceability and safety information to appear clearly on the online product listing itself before checkout, not hidden only on an About page or footer link:

| Required GPSR disclosure | What the merchant owner must supply | Recommended Shopify storage |
| --- | --- | --- |
| Manufacturer details | Registered name or trademark, postal address, and electronic address (email or web contact) | Brand/Manufacturer Metaobject linked to a Product Metafield |
| EU Responsible Person (if manufactured outside the EU) | Name, EU postal address, and electronic contact of the EU-established economic operator | Responsible Person Metaobject linked to a Product Metafield |
| Product identification | Clear product photos, type, and model, batch, or serial identifier | Standard product media, SKU, and model/identifier metafield |
| Safety warnings and instructions | Applicable warnings, age limits, or hazard notices translated into the target EU market languages | Localized Product Metafields rendered in a dedicated product-page block |

## 5. Pre-publish QA checks

1. Confirm `Category` is the most specific valid Standard Product Taxonomy node and required Category Metafields are populated from approved product data.
2. Confirm every variant `Barcode` is verified against the supplier sheet (or explicitly documented as exempt/custom).
3. Confirm `Country of origin` and `HS code` are populated for all internationally shipped physical products.
4. For EU-targeted catalogs, confirm GPSR metafields exist, contain owner-approved text, and actually render on the live EU market product template before publishing.

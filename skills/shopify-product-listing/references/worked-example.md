# Worked example: a truthful draft with incomplete source data

**Synthetic teaching data. No listing has been created, saved, or published.**

Use the [approved source fixture](../assets/worked-example/input.json) and [expected draft](../assets/worked-example/expected.json). The JSON is a review record, not a Shopify API payload or import file.

## Request

> Draft a listing for the Field Ceramic Mug. Use the approved source sheet. Do not invent missing facts and do not save or publish anything.

## Source-to-field decision

| Field | Evidence | Treatment |
| --- | --- | --- |
| Title and handle | Approved source title and handle | Preserve exactly; check existing records for collisions |
| Material, finish, capacity | Ceramic, matte, 350 ml | Eligible for factual copy |
| Sand variant | FIELD-SAND-350, £24 | Preserve the SKU and price |
| Moss variant | FIELD-MOSS-350, £26 | Preserve the SKU and price |
| Barcode, shipping weight, inventory | Unknown | Keep unknown; do not substitute zero or generate an identifier |
| Standard product category | Unconfirmed | Verify against the current taxonomy before selecting it |
| Dishwasher safety and heat retention | Unverified requested claims | Exclude from customer-facing copy |

## Expected draft

**Title:** Field Ceramic Mug | 350 ml

**Description:** A 350 ml ceramic mug with a matte finish. Choose Sand or Moss.

**Proposed status:** Draft. **Proposed sales channels:** None. **Actual state:** Not saved.

A sparse source sheet should produce restrained copy, not invented outcomes. The draft excludes claims about durability, washing safety, origin, certifications, and heat retention because the source does not establish them. Prices map to the correct variants rather than being presented as one universal product price.

## Gaps and handoff

The fictional merchant policy requires confirmed weight, inventory, and product category before publication. This is a fixture-specific policy, not a claim that Shopify always requires those fields. Barcode remains unknown; the accountable owner must confirm whether one is needed for the intended channel.

Drafting useful copy can continue while these gaps remain. Saving a product, activating it, assigning channels, and making it visible are separate actions. None is authorized here.

Before any approved save, recheck the exact store, currency, variants, handles, media rights, tax and shipping settings, and duplicate records. After an authorized save, reopen the record and compare it with the approved source. After separately authorized publication, inspect each variant and channel. Do not call a draft published because a tool returned success.

## Acceptance checks

The checked draft must preserve both SKUs and prices, leave unknown values unset, exclude unsupported claims, and report `not_saved`. Duplicate handles or SKUs require review. Changing a product fact invalidates the fixed worked copy rather than silently reusing it.

The fixture checker verifies those authored mappings. It does not test a live Shopify save, media upload, taxonomy selection, feed acceptance, or an independently generated AI response.

## Official reference

Shopify's product details include distinct content, variant, inventory, and publishing fields: <https://help.shopify.com/en/manual/products/details/product-details-page>. Checked September 6, 2026. Confirm the actual target store before adapting the field map.

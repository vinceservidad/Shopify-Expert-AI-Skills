# Google Merchant Center Next & Performance Max Feed Playbook

Official starting points:
- <https://support.google.com/merchants/answer/7052112> (Product data specification)
- <https://support.google.com/merchants/answer/12158480> (Add products automatically from your online store)
- <https://support.google.com/merchants/answer/14994083> (Set up your attribute rules)

Use this playbook when diagnosing Shopping or Performance Max feed quality, item disapprovals, listing-group segmentation, or account suspensions for a Shopify store. Verify current Merchant Center Next labels in the target account before proposing changes.

## 1. Data sources and supplemental feeds

- **Primary product source**: Typically the Shopify Google & YouTube app (Content API) or a dedicated feed app. Confirm which app owns the primary source before editing titles, variants, or shipping; editing two overlapping sources causes overwrites and duplicate item IDs.
- **Supplemental data sources**: Use supplemental feeds (Google Sheets or hosted file keyed on exact `id` matching the primary source) to override titles, `product_type`, `custom_label_0` to `custom_label_4`, or excluded destinations without altering storefront product copy.
- **Attribute rules**: Use Merchant Center attribute rules for deterministic transformations (for example, prepending brand to title or mapping Shopify tags to `custom_label_*`) only when the primary source cannot emit the clean value directly.

## 2. High-impact feed attributes for Shopping & PMax

- **Title (first 70 characters matter most)**: Lead with the buyer's search terms and differentiators that survive mobile truncation. Common high-intent formula by vertical:
  - Apparel / variants: `Brand + Product Type + Gender/Audience + Key Material/Style + Color + Size`
  - Consumer goods / tools: `Brand + Model/Line + Product Type + Core Spec (Size/Capacity/Pack Count)`
  - Do not stuff promotional text (`Free Shipping`, `20% Off`, ALL CAPS) into titles; Google flags promotional text in titles.
- **Identifiers (`gtin`, `mpn`, `brand`, `identifier_exists`)**:
  - Supply real manufacturer GTINs (UPC/EAN/ISBN) from the Shopify variant `barcode` field whenever the product has a registered barcode. Missing required GTINs limit Shopping impressions or trigger limited performance warnings.
  - Set `identifier_exists` to `no` only for genuine custom, handmade, or private-label goods with no manufacturer GTIN; never set `no` to bypass a valid GTIN requirement.
- **Images (`image_link`, `additional_image_link`)**: Clean primary product image with no watermarks, borders, promotional badges, or overlay text; add lifestyle or detail shots via `additional_image_link`.
- **Margin and performance labels (`custom_label_0` to `custom_label_4`)**:
  - Assign labels from verified store economics and inventory data. Never guess margin tiers:
    - `custom_label_0`: verified margin tier (e.g., `margin_high`, `margin_mid`, `margin_low`)
    - `custom_label_1`: price band or AOV bucket
    - `custom_label_2`: seasonality or promo status
    - `custom_label_3`: stock health / velocity (`hero`, `core`, `slow_mover`, `low_stock`)
  - Use these labels to split PMax asset groups / listing groups or Standard Shopping campaigns by real contribution margin instead of running all SKUs under one blended target ROAS.

## 3. Performance Max (PMax) guardrails for Shopify

- **Asset group vs. feed-only discipline**: Separate hero collections or distinct margin tiers into dedicated campaigns (or listing groups with clear budget priority) so top sellers do not starve tests or burn budget on low-margin accessories.
- **Brand exclusions and search themes**: Review PMax Search Term Insights before claiming non-brand growth. Add campaign-level brand exclusions using Shared library brand lists when a separate Brand Search campaign owns brand defense, and confirm whether Shopping ads should stay eligible for excluded brands.
- **URL expansion**: Turn off or constrain final URL expansion with exclusion rules so PMax does not send paid traffic to blog posts, policy pages, out-of-stock collections, or wholesale pages.
- **Conversion quality**: Confirm the primary Purchase conversion action matches net realized order value (excluding canceled/test orders and without double-counting Google channel + manual GTM tags).

## 4. Diagnostics triage (`Needs attention`)

Triage issues by revenue impact (active hero SKUs first), separating item-level disapprovals from account-level suspensions:

| Issue type | Typical root cause on Shopify | Authoritative fix |
| --- | --- | --- |
| **Price or availability mismatch** (Preemptive Item Disapproval) | Storefront shows variant/market/sale price or out-of-stock state that disagrees with structured data (`JSON-LD`) or feed sync delay | Reconcile exact variant URL (`?variant=...`), theme `Product` JSON-LD `offers.price` & `availability`, currency/market selector, and automatic item updates; never fake feed prices |
| **Missing shipping or tax settings** | Shopify shipping zones or Merchant Center shipping rates do not cover the target country or free-shipping threshold | Align Merchant Center shipping/return policies with live Shopify Markets and checkout shipping rates |
| **Broken landing page / crawl blocked** | Deleted product, password-protected preview, country redirect blocking Googlebot-Store, or `robots.txt` block | Verify HTTP 200 for the exact variant URL from US/target-country user agents without forced geo-redirects |
| **Misrepresentation (account suspension)** | Inconsistent business identity, missing return or shipping policies, broken contact details, or checkout mismatches | Complete a full storefront trust audit (verified contact details, footer policies matching Merchant Center, consistent business identity, and transparent checkout pricing) before requesting review; repeated unfixed appeals lengthen suspension |

## 5. Verification before closing

1. Confirm primary feed sync status and item count match expected published Shopify variants.
2. Spot-check live product URLs (`?variant=...`) against rendered `JSON-LD` price, currency, and availability.
3. Verify `Needs attention` warning counts drop after feed reprocessing. Submitting a feed or appeal is not approval.

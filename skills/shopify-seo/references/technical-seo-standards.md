# Technical SEO Standards for Shopify

Use these verified Google Search Central and Shopify rules when auditing structured data, duplicate URLs, crawl controls, and page experience.

## Official references

- <https://developers.google.com/search/docs/appearance/structured-data/product> (Google Search Central Product structured data)
- <https://developers.google.com/search/docs/appearance/structured-data/merchant-listing> (Google Search Central Merchant listing structured data)
- <https://developers.google.com/search/docs/appearance/structured-data/return-policy> (Google Search Central MerchantReturnPolicy)
- <https://developers.google.com/search/docs/appearance/structured-data/product-variants> (Google Search Central Product variants)
- <https://developers.google.com/search/docs/appearance/core-web-vitals> (Google Search Central Core Web Vitals)
- <https://web.dev/articles/vitals> (web.dev Core Web Vitals thresholds)
- <https://search.google.com/test/rich-results> (Google Rich Results Test)
- <https://shopify.dev/docs/storefronts/themes/seo> (Shopify theme SEO documentation)
- <https://help.shopify.com/en/manual/promoting-marketing/seo> (Shopify Help Center SEO guide)

## Ecommerce structured data

Google Search uses JSON-LD structured data for product snippets and merchant listing experiences. Markup must match visible page content and active Google Merchant Center feed data.

- **Product and Offer:** Include `name`, `image`, and `offers` (`price`, `priceCurrency`, `availability`, and `url`) on product pages. Add `brand`, `sku`, and valid `gtin` identifiers when available.
- **ProductGroup for variants:** When a product sells across variants such as size, color, or material, connect them using `ProductGroup` with `productGroupID`, `variesBy`, and `hasVariant` entries pointing to variant-level `Product` offers.
- **MerchantReturnPolicy:** Define storewide return terms once under `Organization.hasMerchantReturnPolicy`, and override at `Offer.hasMerchantReturnPolicy` only for products with special terms. Populate `applicableCountry`, `returnPolicyCategory`, and `merchantReturnDays` (for finite windows), along with `returnMethod` and `returnFees`.
- **OfferShippingDetails:** Attach `Offer.shippingDetails` when shipping rates or delivery windows need markup at the offer level. Include `shippingRate` (`MonetaryAmount`), `shippingDestination` (`DefinedRegion`), and `deliveryTime` (`ShippingDeliveryTime` with `handlingTime` and `transitTime`).
- **Validation and deduplication:** Check rendered HTML in Google Rich Results Test. Remove duplicate `Product` JSON-LD blocks created when both the theme and an SEO app inject schema on the same template.

## Shopify duplicate URLs and canonicals

Shopify generates multiple paths for the same catalog item, so internal links, canonicals, and `robots.txt` must agree.

- **Collection-scoped product URLs:** Older themes use `{{ product.url | within: collection }}` in product grids, creating `/collections/<handle>/products/<handle>` links while Shopify's canonical points to `/products/<handle>`. Update product card links to `{{ product.url }}` so internal links match the canonical destination.
- **Theme canonical tag:** Confirm `layout/theme.liquid` renders `<link rel="canonical" href="{{ canonical_url }}">` once and no third-party app injects a conflicting canonical tag.
- **Variant query URLs:** Allow `{{ canonical_url }}` to consolidate `?variant=` URLs to the base `/products/<handle>` URL unless the store runs distinct variant landing pages with `ProductGroup`.
- **Faceted filter tags and sort parameters:** Shopify's default `robots.txt` disallows multi-tag paths (`/collections/*+*`), sort URLs (`/collections/*sort_by*`), `/cart`, and `/checkout`. Keep these default safeguards.
- **Crawling versus indexing:** Do not block URLs in `robots.txt` if you rely on Googlebot reading a `noindex` tag or canonical link on those URLs. Keep self-referencing canonicals on paginated collection URLs (`?page=2`) instead of pointing every page back to page 1.
- **Custom `robots.txt.liquid`:** Add `templates/robots.txt.liquid` only when Search Console or crawl data shows verified crawl waste, and preserve Shopify's default rule groups.

## Core Web Vitals (`LCP`, `INP`, and `CLS`)

Google evaluates Core Web Vitals at the 75th percentile of real-user page loads across mobile and desktop separately.

- **Largest Contentful Paint (`LCP`):** `<= 2.5 seconds` for loading performance. Common Shopify issues include lazy-loading the hero or main product image, missing `fetchpriority="high"` on the LCP image, and oversized uncompressed media.
- **Interaction to Next Paint (`INP`):** `<= 200 milliseconds` for input responsiveness. Common Shopify issues include heavy third-party app scripts, chat widgets, and unthrottled variant or filter event handlers blocking the main thread.
- **Cumulative Layout Shift (`CLS`):** `<= 0.1` for visual stability. Common Shopify issues include missing image `width` and `height` attributes, late-loading announcement bars, and injected review or upsell widgets that push content down.
- **Field versus lab evidence:** Judge pass or fail status using Search Console Core Web Vitals and CrUX field data. Use Lighthouse lab runs only to reproduce and debug specific bottlenecks.

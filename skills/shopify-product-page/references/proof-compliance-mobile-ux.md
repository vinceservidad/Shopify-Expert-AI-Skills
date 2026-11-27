# PDP Proof Compliance and Mobile UX Checks

Use these verified FTC and W3C standards when auditing or drafting social proof, product claims, and mobile layouts on a Shopify product page.

## Official references

- <https://www.ecfr.gov/current/title-16/part-465> (FTC Consumer Reviews and Testimonials Rule, 16 CFR Part 465)
- <https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-255> (FTC Endorsement Guides, 16 CFR Part 255)
- <https://www.ftc.gov/business-guidance/resources/consumer-reviews-testimonials-rule-questions-answers> (FTC Consumer Reviews and Testimonials Rule Q&A)
- <https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum> (W3C WCAG 2.2 Target Size Minimum 2.5.8)

## Reviews, testimonials, and claim compliance (FTC Parts 465 and 255)

- **No fake reviews or inflated counts:** Display only authentic buyer reviews and real aggregate ratings. Never fabricate reviews, AI-generated customer quotes, or synthetic star totals.
- **No review suppression or gating:** Publish honest negative reviews alongside positive ones. Moderation may filter spam, profanity, off-topic content, or fake entries only under clear, neutral criteria applied equally regardless of rating.
- **Incentivized and insider disclosures:** Never require a positive rating in exchange for a discount, gift card, or free item. When an honest review is incentivized or written by an employee or manager, disclose that connection clearly next to the review.
- **Substantiation and typical results:** Ensure every performance, health, or results claim quoted from a customer matches substantiated product truth. If a featured testimonial shows an atypical outcome, state generally expected results beside the claim rather than relying on a buried "results not typical" footer note.

## Proof placement checks

- **Match proof to the active objection:** Place sizing or fit evidence beside the variant selector, material or durability proof beside benefit blocks, and delivery or return terms near the primary purchase button.
- **Preserve review context:** Let shoppers view reviews by rating, variant, or verified-buyer status when supported by the review app so proof answers real selection questions.
- **Policy parity:** Verify shipping windows, return fees, warranty scope, and subscription cancellation terms on the PDP match checkout and store policy pages exactly.

## Mobile UX and accessibility checks

Audit the live or staged product template on a small mobile viewport (such as 375px wide) before approving layout or copy changes.

- **Above-the-fold clarity:** Confirm the visitor immediately sees the main product image, title, price (plus recurring frequency for subscriptions), and a clear path to variant selection and the primary add-to-cart action without popups blocking the screen.
- **Sticky bar and widget collisions:** Scroll the full page to verify that sticky add-to-cart bars, chat bubbles, cookie banners, and review badges do not cover variant controls, pricing, or checkout buttons.
- **Variant and inventory clarity:** Confirm active variant selections use clear visual indicators rather than color alone, sold-out options show availability before clicking add to cart, and selecting a variant updates price, image, and stock status immediately.
- **Tap targets and keyboard access:** Check that variant swatches, quantity steppers, gallery thumbnails, and accordion toggles meet WCAG 2.2 Level AA minimum target size (`24 x 24 CSS pixels` or equivalent spacing) and remain usable via keyboard and screen readers.
- **Visible purchase terms:** Use accordions for secondary specs or care guides, but keep pricing, recurring billing terms, safety warnings, and core shipping or return terms directly visible without hidden clicks.

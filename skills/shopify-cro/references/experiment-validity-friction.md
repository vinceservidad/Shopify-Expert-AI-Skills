# Experiment Statistical Validity and Conversion Friction Checks

Use these standards when designing, auditing, or interpreting Shopify A/B tests and when inspecting checkout and mobile friction.

## Official references

- <https://dl.acm.org/doi/10.1145/3292500.3330722> (Fabijan et al., KDD 2019: Diagnosing Sample Ratio Mismatch in Online Controlled Experiments)
- <https://help.shopify.com/en/manual/checkout-settings> (Shopify Checkout settings)
- <https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum> (W3C WCAG 2.2 Target Size Minimum)

## Statistical validity gates

Run these checks before trusting any reported lift from a split test.

- **Sample Ratio Mismatch (`SRM`):** Before inspecting conversion or revenue metrics, test observed variant counts against the planned traffic split (such as 50/50) using Pearson's chi-square goodness-of-fit test. Following the Microsoft ExP diagnostic standard in Fabijan et al. (KDD 2019), flag `SRM` at a strict threshold such as `p < 0.0005` (or `p < 0.001`). Treat any test with `SRM` as invalid until the assignment or logging defect is resolved. Common Shopify causes include client-side script errors before exposure fires, broken redirects, uneven bot filtering, or cached theme fragments.
- **Peeking and early stopping:** Fixed-horizon frequentist tests assume the sample size is locked before launch. Checking results daily and stopping as soon as `p < 0.05` inflates the false positive rate far above 5%. Pre-commit the sample size and end date, or use a valid sequential testing method built for continuous monitoring.
- **Minimum Detectable Effect (`MDE`) and power:** Calculate required sample size upfront from the baseline conversion rate, desired power (typically 80% or 90%), significance level (`alpha = 0.05`), and the smallest practical `MDE` worth shipping. If traffic cannot support a realistic `MDE` within a reasonable test window, skip an underpowered split test and use usability testing, qualitative diagnostics, or larger structural changes instead.
- **Full weekly cycles:** Run tests for at least 1 to 2 complete 7-day cycles so weekday and weekend buyer behavior stay balanced. Do not stop on partial weeks, and watch for novelty effects among returning shoppers or overlapping promotions.
- **Multiple comparisons:** Pre-register one primary business outcome and explicit commercial guardrails. Post-hoc slicing across many devices, channels, or product subsets inflates false discoveries and must be treated as exploratory until confirmed in a follow-up test.

## Checkout and mobile conversion friction checks

Audit reproducible technical and UX friction before designing behavioral tests.

- **Accelerated checkout and guest flow:** Verify Shop Pay and enabled digital wallets (Apple Pay or Google Pay) load reliably without colliding with cart drawer buttons or duplicating actions. Confirm guest checkout stays accessible unless the store intentionally requires membership.
- **Upfront cost and policy clarity:** Check whether shipping rates or free-shipping thresholds, international duties and taxes, and return terms are visible on the product page and cart before checkout starts. Surprise fees at checkout drive avoidable abandonment.
- **Mobile form inputs and tap targets:** Confirm mobile forms trigger the right keyboards for phone numbers and postal codes, support address autocomplete, and show clear inline validation messages. Verify interactive controls such as variant swatches, quantity steppers, and primary buttons meet WCAG 2.2 Level AA target size (`24 x 24 CSS pixels` or equivalent spacing).
- **Checkout Extensibility boundaries:** Standard Shopify plans customize checkout through native checkout settings and branding, while custom Checkout UI extensions require Shopify Plus. Verify that checkout apps, discount fields, and upsell blocks do not hide the primary payment button or throw mobile script errors.
- **End-to-end purchase QA:** Test the live cart-to-checkout path on real iOS and Android mobile browsers across in-stock, sold-out, discounted, and subscription items before blaming conversion drops on messaging.

# Worked example: more sales, less contribution

**Synthetic teaching data. Not merchant results, a model benchmark, or permission to change an account.**

Read the [input evidence](../assets/worked-example/input.json) and the [expected calculations](../assets/worked-example/expected.json). Both travel with this skill. Use their definitions to learn the procedure, never their numbers as defaults for another store.

## Request

> Analyze the store and show the top-selling products. Compare August 15-28 with August 1-14, 2026. Use GBP and Europe/London reporting dates. Start read-only. Explain whether higher sales produced more contribution after advertising.

## Establish the contract before calculating

The input is a complete, normalized three-product fixture, not an unmodified Shopify export. Each row represents one product in one 14-day period. Discounts and returns are positive deductions from gross merchandise sales. Sales exclude tax and shipping revenue. Product costs already account for the fixture's resaleable returns; do not deduct those returns twice.

Contribution after media subtracts product cost, payment fees, fulfillment, shipping subsidy, and advertising from net sales. It excludes overhead and income tax. This is a named contribution level, not net business profit.

## Expected answer

**Net sales increased 10%, but contribution after advertising fell £568, or 24.70%. Do not treat the sales increase as a reason to scale every campaign.**

| Calculation | Previous | Current |
| --- | ---: | ---: |
| Gross merchandise sales | £12,000 | £13,400 |
| Discounts | £1,200 | £1,200 |
| Returns | £800 | £1,200 |
| Net sales | £10,000 | £11,000 |
| Product costs | £4,100 | £4,490 |
| Payment fees | £300 | £330 |
| Fulfillment | £800 | £898 |
| Shipping subsidy | £500 | £550 |
| Contribution before media | £4,300 | £4,732 |
| Media cost | £2,000 | £3,000 |
| Contribution after media | £2,300 | £1,732 |

The accounting bridge is **£432 more pre-media contribution minus £1,000 additional media cost = £568 less contribution**. This explains the arithmetic, not the incremental sales caused by advertising. Causal lift, campaign-level marginal profit, and whether pausing spend would preserve sales remain unknown.

### Top products depend on the definition

| Product | Current net sales | Current net units |
| --- | ---: | ---: |
| Mug | £5,400 | 250 |
| Bottle | £4,200 | 115 |
| Tote | £1,400 | 160 |

Mug leads both rankings. Bottle is second by net sales, but Tote is second by net units. Answer the common request without stalling: state the selected ranking metric, then show the alternative when it changes the ordering. Neither ranking establishes product-level profit after ads because media cost is not allocated by product here.

Report the Google Ads, Meta Ads, and email figures under their own attribution settings. Do not add them to ledger sales or to one another as a business revenue total.

## Decision and verification

Investigate where the additional media cost went, with matched product, campaign, margin, inventory, and conversion evidence. Keep spending unchanged until a separately scoped decision is supported and approved. Do not diagnose broken tracking merely because attributed values differ.

The repository's reference runner checks these numbers against separately stored expected results. It also rejects missing costs, duplicate products, mismatched populations, and unequal or overlapping periods. A zero denominator produces an unknown percentage, not a fabricated zero.

These checks verify the authored example, not a model's unseen answer. A model evaluation requires a fresh session, input-only evidence, saved output, and a separate substantive review.

## Source boundary

Shopify's sales-report documentation distinguishes sales components and report definitions. Review the exact export fields before adapting this example: <https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/report-types/default-reports/sales-report>. Checked September 6, 2026. The contribution formula above is the fixture's explicitly chosen business definition.

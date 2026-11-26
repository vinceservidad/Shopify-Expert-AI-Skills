# Client Deliverable Templates

Use these four copy-ready templates to deliver client-ready files instead of raw chat replies. Fill in only confirmed store facts and keep any missing figures clearly marked before sharing with the store owner.

## 1. Bulk CSV change and rollback QA sheet

Use this table with `shopify-catalog-operations` before running a bulk CSV import. Separate approved rows from blocked rows and test a small pilot first.

```csv
Handle,SKU,Field,Before_Value,Proposed_Value,Status,Rollback_Value,Approved_By
[handle],[sku],[price|inventory|tags|status],[current_export_value],[proposed_value],[READY_FOR_PILOT|BLOCKED_MISSING_DATA|SKIPPED],[current_export_value],[owner_name_and_date]
```

Checklist before running the full import:

- Export a full timestamped backup CSV from Shopify Admin first.
- Keep `READY_FOR_PILOT` rows and `BLOCKED` rows in separate sheets so blank cells never overwrite live stock or prices.
- Test 2 to 5 pilot handles, reopen them in Shopify Admin, and confirm channel visibility before importing the rest.

## 2. Launch and BFCM readiness checklist

Use this sheet with `shopify-store-audit` 7 to 14 days before a launch, theme swap, migration, or peak sale:

```text
Store: [store name]
Event and cutover window: [event name, exact date/time, timezone]
Owner approver: [name]
Technical fallback owner: [name]

1. Catalog and pricing
- [ ] Backup CSV exported and stored: [date and filename]
- [ ] Sale prices, compare-at prices, and dates verified: [scope checked]
- [ ] Discount stacking and automatic discount rules tested: [combinations tested]
- [ ] 301 URL redirects mapped for changed or archived handles: [count verified]

2. Inventory and fulfillment
- [ ] Safety stock buffers confirmed for hero SKUs: [SKU list]
- [ ] Multi-location routing and 3PL sync tested: [locations verified]
- [ ] Cutoff dates and shipping rate tiers match banner copy: [verified link]

3. Storefront, checkout, and tracking
- [ ] Duplicate theme previewed on desktop and mobile checkout: [theme name]
- [ ] Web Pixels and Meta Conversions API events firing without duplicates: [tools checked]
- [ ] Out-of-stock, gift-card, and mobile cart drawer tested: [result]

4. Rollback trigger
- Stop sale changes or revert theme/CSV if: [specific failure threshold]
- Revert steps confirmed by: [owner or developer name]
```

## 3. Chargeback evidence packet template

Use this structure with `shopify-order-operations` before the Shopify Payments dispute deadline. Include only verified timestamps, scans, and customer records.

```text
Order number: #[order_id]
Dispute reason and deadline: [reason code, due date and timezone]
Store owner approver: [name]

Summary of verified facts:
- Order placed: [timestamp] | Billing/shipping match (AVS/CVV): [result from Shopify Admin]
- Customer account or prior orders: [confirmed order history or none]

Fulfillment and delivery proof:
- Carrier and tracking number: [carrier, tracking_number]
- Shipped timestamp: [timestamp]
- Delivered timestamp and scan location: [timestamp, address/zip match]

Checkout and store policy proof:
- Refund, shipping, and cancellation policy URL shown at checkout: [URL]
- Policy text active on order date: [exact quoted clause]

Customer communication log:
- [date/time]: [buyer message summary]
- [date/time]: [store reply summary or resolution offered]

Missing or blocked evidence (confirm before submitting):
- [for example: signed delivery receipt, carrier photo proof, unverified policy timestamp]
```

## 4. Daily shift handover and exception log

Paste this plain-text handover note into Slack, email, or the client tracker at the end of each shift across one or more stores:

```text
Daily Shift Handover: [store name], [date], [timezone]
VA on shift: [name]

Completed and verified in Shopify Admin:
- [task]: [what changed, record checked, link or order/product ID]

Drafted and waiting on your approval:
- [task]: [link to draft CSV, ticket, or product preview]

Exceptions and blockers:
- [item]: [what failed or is missing, customer/revenue impact, owner needed]

Checked in today's store scan:
- Unfulfilled aging orders: [exact count and window]
- Low-stock hero SKUs: [SKU list or count]
- Open disputes or urgent support tickets: [exact count]

Next shift priority:
1. [top item and deadline]
2. [second item and deadline]
```

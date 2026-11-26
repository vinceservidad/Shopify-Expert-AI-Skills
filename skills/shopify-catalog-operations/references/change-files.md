# Change Files Instead of Live Edits

When a VA has read access but no write permission, or the owner wants to review before anything changes, prepare an import file and a before-and-after diff. The owner, or a VA with written approval, imports it. Preparing the file is usually the slow part, so this saves real time without touching the store.

## Prerequisites

- A fresh export of the exact records in scope, with its timestamp.
- The current Shopify import template for that resource. Confirm headers in Shopify admin before building the file, because templates change.
- An identifier per row: handle plus option values for products, SKU or inventory item for stock, path for redirects.

## Ordered steps

1. Copy the export. Never edit the only copy.
2. Change only the approved columns. Remove columns you are not changing when the import supports partial updates. Otherwise keep their exported values exactly.
3. Build the diff table below from the export and the change file. One row per changed field.
4. Check the high-risk fields: price, compare-at price, cost, inventory, status, handle, variant options, publishing.
5. Send the file, the diff and the rollback file (the untouched export) to the owner together.
6. After import, re-export the same records and compare them with the diff. Record matches, mismatches and skipped rows.

## Diff table

| Identifier | Field | Before | After | Reason | Source |
| --- | --- | --- | --- | --- | --- |
| handle: linen-shirt / Size: M | Variant Price | 39.00 | 42.00 | Approved price list v3 | client email, Nov 24 |

## Common files

| Job | Template | Identifier | Watch for |
| --- | --- | --- | --- |
| Product content or prices | Product CSV | Handle (+ option values) | Blank cells can clear values. Image URLs must be public. |
| Stock counts | Inventory CSV | SKU or variant, per location | Set versus adjust quantity. One location per column. |
| URL redirects | Redirect CSV | Redirect from | Loops, chains, and redirects that point to missing pages. |
| Metafields | App or bulk editor format | Owner ID + namespace.key | Type must match the definition. |

## Stop gates

- No import without written owner approval of this exact file and diff.
- Stop if the export is older than the latest edits in the store.
- Stop if any row has no identifier, or matches two records.

## Handoff

State the file name, row count, changed-field count, high-risk changes, the rollback file, who imports it, and how the result will be checked.

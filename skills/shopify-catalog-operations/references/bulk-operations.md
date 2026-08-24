# Bulk Catalog Operations

## Current Shopify references

- <https://help.shopify.com/en/manual/products/import-export/using-csv>
- <https://help.shopify.com/en/manual/products/import-export/import-products>
- <https://help.shopify.com/en/manual/products/import-export/export-products>

Verify the current CSV template, fields, encoding, overwrite behavior, product-publication option, and target-store interface before each material import.

## Preflight

1. Export the current scoped records and retain the timestamp and target store.
2. Preserve a copy of the unmodified source.
3. Define identifiers and overwrite behavior.
4. Confirm UTF-8 encoding and exact headers for the current import format.
5. Check duplicate handles, SKUs, barcodes, option combinations, and media URLs.
6. Separate blank, null, clear, retain, and default behavior for each field.
7. Produce added, changed, unchanged, skipped, and exception counts.
8. Review high-risk price, cost, inventory, identifiers, status, channel, handle, and variant changes.

## Pilot

Choose a small representative set containing simple and complex products, variants, images, metafields, and exceptions. The pilot must be large enough to exercise the transformation paths, not a universal percentage.

## Batch record

```yaml
batch_id:
target_store:
source_file_and_hash:
record_scope:
identifier:
fields_changed:
backup:
approval:
started_at:
completed_at:
platform_result:
exceptions:
reconciliation:
rollback:
```

## Post-import verification

- re-export or re-query the affected records
- reconcile record and variant counts
- compare high-risk fields with the approved change set
- inspect representative admin records and live pages
- verify collection rules, theme dependencies, apps, feeds, and automation where in scope
- stop subsequent batches on unexpected overwrite, deletion, duplication, publication, inventory, or price behavior

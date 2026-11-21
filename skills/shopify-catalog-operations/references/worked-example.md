# Worked example: stop an unsafe bulk price update

**Synthetic dry run only. No import file is created and no store is changed.**

Read the [before state and requested operations](../assets/worked-example/input.json), then compare the [expected change set](../assets/worked-example/expected.json). These are normalized review records with synthetic IDs, not Shopify CSV columns or an Admin API request.

## Request and scope

> Review the proposed pricing update against the before export. Only price and compare-at price are in scope. Identify exceptions, preserve unrelated fields, and prepare rollback. Do not import anything.

Use variant ID as the fixture's reviewed unique key. Validate uniqueness in both sources before joining. Do not join on row order, title, or SKU just because those fields look familiar.

## Expected dry-run result

| Variant | Requested operation | Decision |
| --- | --- | --- |
| 101 | Set price from £24 to £26 | Candidate change; existing £30 compare-at price is preserved |
| 102 | Set price to an empty string | Block; blank is not an approved zero and not an instruction to preserve |
| 103 | Replace SKU | Block; identifier change is outside the pricing scope |
| 104 | Explicitly clear compare-at price | Candidate change; the request names the field and clear operation |

**Two candidate field changes, two exceptions, four records retained. The batch is not ready.** Candidate rows are an in-memory simulation, not a partially executed import. Resolve exceptions and approve a representative pilot before any production write.

### Preserve, set, and clear are different

Omitting a field from the normalized request means preserve it. `set` names a supplied value. `clear` deliberately removes an optional value and must name the field. A blank or null under `set` is rejected instead of guessed. Never transfer these internal rules to a Shopify CSV without checking that import format's actual semantics.

Product ID, variant ID, handle, SKU, options, and inventory remain identical to the before state. Verify the whole row, not only the intended price. Inventory is not a side effect of a price cleanup.

## Rollback and reconciliation

The expected rollback would restore variant 101's price to £24 and variant 104's compare-at price to £15 if those candidates were later approved and applied. Retain the source export and store/variant identifiers. A rollback plan is not evidence that an operation occurred.

Following an approved pilot, re-query or re-export the same target and match by the reviewed key. Confirm the four-record count, unchanged identifiers/options/inventory, intended values, correct market prices, and relevant feeds. Stop on an unexpected deletion, new variant, publication change, or mismatched value. Do not proceed merely because an import reports success.

The fixture checker tests duplicate and unknown IDs, blank values, out-of-scope fields, conflicting operations, preserved fields, and reversal of the simulated changes. It does not test a live import.

## Shopify-specific adaptation

Use a fresh target-store export. Shopify documents dependent CSV columns, overwrite behavior, and the need to preserve variant option information. Multi-location stock uses its inventory workflow rather than assumptions about a product CSV. Current and legacy headers can differ: <https://help.shopify.com/en/manual/products/import-export/using-csv>. Checked September 6, 2026. Do not rename this fixture's `variant_id` key into an imagined product-CSV column.

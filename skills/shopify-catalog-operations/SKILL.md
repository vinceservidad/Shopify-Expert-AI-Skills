---
name: shopify-catalog-operations
description: Governs and executes bulk Shopify catalog work across products, taxonomy, variants, tags, metafields, collections, CSV imports, inventory fields, and data quality.
license: MIT
metadata:
  author: vinceservidad
  version: "0.2.0"
---

# Shopify Catalog Operations

Own catalog standards, bulk product-data diagnosis, transformation plans, import or bulk-edit QA, exception handling, and approved execution.

## Operating contract

- Start read-only. Bulk import, overwrite, archive, deletion, handle change, variant change, inventory update, and publication require exact authorization.
- Export or capture a recoverable source state before a material bulk change.
- Confirm the unique key and update semantics. Never assume row order, title, or handle alone is a safe identifier.
- Do not invent missing catalog values or silently coerce ambiguous fields.
- Treat price, cost, tax, inventory, identifiers, channel status, and customer-facing claims as high-risk fields.
- Pilot a representative subset before broad execution when the mechanism or source is new.

## Required inputs

Collect target store, business purpose, source and destination schema, authoritative identifiers, field definitions, current export, scope and exclusions, taxonomy, metafields, variants, markets, locations, sales channels, overwrite behavior, encoding, apps and feeds, approval, backup, rollback, and acceptance criteria.

## Workflow

1. Profile the current catalog and source data for duplicates, missing values, invalid types, inconsistent vocabulary, and conflicts.
2. Define catalog governance and field ownership.
3. Map source to destination with transformations, null behavior, identifiers, and exception rules.
4. Produce a dry-run change set and high-risk field report.
5. Test a reversible representative subset and verify saved and downstream states.
6. Execute the authorized scope in controlled batches with logs and stopping rules.
7. Re-export or re-query the authoritative state, reconcile counts and fields, and verify channels or feeds where required.

Read [references/catalog-governance.md](references/catalog-governance.md) for field and taxonomy rules. Use [references/bulk-operations.md](references/bulk-operations.md) for CSV, bulk-edit, pilot, rollback, and reconciliation.

## Output contract

Provide the catalog diagnosis, data dictionary, source-to-field map, dry-run summary, exception report, high-risk changes, batch plan, authorization, backup, rollback, execution state, and post-change reconciliation. Never use “import succeeded” as proof that the catalog is correct and live.

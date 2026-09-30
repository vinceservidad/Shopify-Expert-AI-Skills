# Review my product catalog

Workflow ID: `catalog_review`. Report data conflicts and proposed corrections within the defined inspected records. This is a read-only review; no import, bulk edit, archive, publication, or deletion is performed.

## Inputs

Required to prepare the task:

- `catalog_scope`: exact store, products/collections/filter, fields, exclusions, and review purpose.
- `catalog_records`: source export or connected records, stable product/variant IDs, timestamps, and pagination coverage.

Optional inputs, required when they affect the decision:

- `catalog_standards`: approved vocabulary, SKU and identifier rules, field definitions, taxonomy, source ownership, and consistency requirements.
- `approval_roles`: source owners and approvers for proposed corrections.

If standards are absent, report objective conflicts and blanks; do not invent a naming rule or declare a legitimate variant difference invalid. An input name proves availability only, not completeness or authority.

## Procedure

1. Confirm the scope and identify records by stable IDs. Record the query/filter or export provenance, fetched time, pages read, and remaining pages. Never assume title, row order, or SKU is a unique join key.
2. Inspect product and variant pages using the existing tools. Use product details for description, media, and search fields when those are in scope. Track nested connections separately.
3. Check duplicate nonblank SKUs, missing identifiers, conflicting values, incomplete required fields, vocabulary inconsistencies, and mismatches with approved standards.
4. Group SKU conflicts by the exact observed value and record IDs. Case or whitespace normalization is a separate proposed rule unless approved; preserve original values in the report. A duplicate SKU identifies a conflict to review, not permission to merge or delete.
5. Distinguish confirmed errors, suspected conflicts, standards needed, and uninspected records. Compare commercial and customer-facing fields only with authoritative facts.
6. Produce a dry-run correction table. For ambiguous fields, propose an owner decision rather than filling missing facts.
7. Return findings and coverage. If another page remains, state “within inspected records” and provide the next cursor/action; do not declare the whole catalog clean.

## Reusable catalog report

```text
Store / requested scope / exclusions:
Sources and versions / observed time:
Products inspected / variants inspected / pages read:
Connections with remaining pages / cursor or next action:
Standards applied / missing standards:
```

| Issue | Product/variant IDs | Observed evidence | Rule/source | Impact | Proposed correction or decision | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| [issue] | [IDs] | [values] | [approved rule or missing standard] | [supported consequence] | [draft] | [owner] |

```text
Confirmed findings within inspected records:
Suspected conflicts needing source review:
High-risk fields: identifiers / prices / tax / inventory / claims / publication:
Coverage limits and next read:
```

## QA and escalation

- Record counts and checked fields match the actual inspected data.
- Blank SKUs are missing identifiers, not automatically one duplicate group.
- Duplicate findings include all observed conflicting IDs and preserve exact values.
- Partial product or variant pages cannot support a catalog-wide conclusion.
- Proposed corrections have authoritative sources or are explicitly awaiting a decision.
- No change is claimed merely because a change table was prepared.

Escalate ambiguous identity, conflicting source owners, unsupported commercial values, and possible data loss before any later write. A separate approved editing connection requires an exact target/action handoff, existing authorization, recoverable before state, and saved-state verification. Its failed edits or incomplete reconciliation remain unresolved. Client exports and standards stay in chat/project files; the MCP does not retain them.

## Practice example

Synthetic inspected page: variant `101` has SKU `SAMPLE-BLUE`; variant `102` also has SKU `SAMPLE-BLUE`; variant `103` has a blank SKU. `hasNextPage` is true. No approved SKU renaming rule exists.

Expected judgement: report a confirmed two-record duplicate within this page, a separate missing identifier, and incomplete catalog coverage. Ask the source owner to choose correct identifiers. Reviewer criterion: no automatic rename, merge, deletion, or “no other duplicates” claim.

## Source notes

Reviewed 2026-09-30. This original report applies documented ecommerce VA listing work and repeatable review processes; it does not adopt blog prices or historical platform advice.

- [How To Become a Virtual Assistant](https://www.shopify.com/ph/blog/how-to-become-a-virtual-assistant), published August 7, 2025.
- [How to Hire a Virtual Assistant for Shopify](https://www.shopify.com/ph/blog/how-to-hire-virtual-assistant-services), published August 17, 2022.

# Catalog Governance

## Field ownership

```yaml
field:
definition:
type_and_format:
allowed_values:
source_of_truth:
owner:
required:
null_behavior:
update_frequency:
downstream_consumers:
risk:
```

## Core domains

- identity: product ID, variant ID, handle, SKU, barcode, vendor key
- taxonomy: Shopify category, attributes, product type, collections, tags
- content: title, description, media, alternative text, disclosures
- commerce: price, compare-at price, cost, tax, purchase options
- inventory and fulfillment: tracking, location, quantity, policy, weight, service
- markets and channels: status, publication, eligibility, localization
- custom data: metafield definition, namespace, key, type, validation, value

## Governance rules

- Prefer stable platform IDs or approved business keys for updates.
- Define controlled vocabulary and capitalization for tags, vendors, product types, options, and attributes.
- Do not use tags as an undocumented substitute for structured fields when a governed field exists.
- Keep category, product type, collection, tag, and metafield purposes distinct.
- Define how deprecated values are mapped, merged, archived, or retained.
- Record downstream dependencies before changing a field used by themes, apps, feeds, analytics, automation, or operations.

## Data-quality dimensions

Review completeness, validity, uniqueness, consistency, conformity, referential integrity, timeliness, and commercial truth. A complete field can still be wrong.

## Exception record

```yaml
record_identifier:
field:
before_value_and_source:
current_value:
current_value_source_and_time:
proposed_value:
proposal_purpose_and_authorization:
issue:
source_conflict:
risk:
owner_decision_required:
```

For post-change review, `current_value` is the latest authoritative observation,
not the backup or intended value. `proposed_value` is the candidate correction,
not a replay of the failed mutation. Keep these directions consistent with the
narrative. Restore only the approved affected fields; a backup does not authorize
overwriting later legitimate changes. Label a recovery target as unknown when
competing source versions or approvals prevent a supported choice.

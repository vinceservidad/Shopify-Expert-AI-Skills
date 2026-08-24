# Shopify VA SOP Framework

## SOP record

```yaml
title:
purpose:
owner:
applies_to:
trigger_or_schedule:
required_role_and_permissions:
inputs_and_sources:
preconditions:
risk_level:
procedure:
decision_points:
exceptions_and_escalation:
qa:
terminal_state:
verification:
rollback_or_correction:
evidence_to_save:
last_reviewed:
```

## Procedure rules

- Use current interface labels only when verified and date the screenshots.
- Explain why a decision point matters, not only where to click.
- Keep owner-only, financial, destructive, and sensitive actions outside a VA SOP unless the role explicitly includes them.
- Use examples that do not contain live secrets or unnecessary customer data.
- Define what the VA should do when the interface, data, or policy differs from the SOP.

## QA levels

- **Presence:** required fields or actions exist.
- **Accuracy:** values match the source.
- **Commercial truth:** price, offer, inventory, and claims are supported.
- **Customer safety:** policy, privacy, accessibility, and communication are correct.
- **State:** saved, published, live, or verified matches the assigned target.
- **Scope:** unrelated records and fields remain unchanged.

## Error record

```yaml
task:
error:
detected_by:
customer_or_business_effect:
severity:
root_or_contributing_cause:
correction:
rollback:
coaching:
sop_change:
```

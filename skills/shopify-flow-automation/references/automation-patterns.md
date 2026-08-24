# Automation Patterns

Shopify Flow workflows are built around a trigger, conditions, and actions. The exact tasks and fields depend on current Shopify, app, plan, and store availability. Verify first-party documentation and the target store before implementation.

Official starting point: <https://shopify.dev/docs/apps/build/flow>

## Event contract

```yaml
trigger_name:
event_source:
event_time:
resource_identifier:
available_fields:
field_nullability:
delivery_semantics:
known_delay:
sample_payload_source:
```

Do not assume an event fires once or that every field is populated.

## Condition design

- Place exclusions and safety conditions before expensive or external actions.
- Define data types, null behavior, timezone, currency, case sensitivity, and list membership.
- Avoid circular tag or field changes that retrigger the same workflow unless a verified guard prevents a loop.
- Document how manual edits interact with automation.

## Idempotency

Choose a stable key such as workflow version plus resource ID and event type. Before a non-repeatable action, confirm whether it already completed. If the platform cannot guarantee idempotency, design a tag, metafield, external record, or review queue only when that method is supported and approved.

## Failure handling

For each action define:

```yaml
success_signal:
failure_signal:
retry_behavior:
duplicate_risk:
alert_recipient_or_queue:
manual_recovery:
customer_impact:
```

Do not silently convert a failed external action into a completed business state.

## Rollout

1. Validate the workflow against current task and field availability.
2. Test with controlled records that cannot affect real customers or money.
3. Inspect each branch and action result.
4. Enable the smallest safe scope after approval.
5. Monitor volume, failures, duplicates, latency, and business outcomes.
6. Expand only after the readiness, capacity, guardrail, and authorization gates pass.

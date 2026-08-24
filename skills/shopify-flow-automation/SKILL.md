---
name: shopify-flow-automation
description: Designs and audits Shopify Flow workflows with triggers, conditions, actions, tests, failure handling, and rollback. Use for automation specifications and QA.
license: MIT
metadata:
  author: vinceservidad
  version: "0.1.0"
---

# Shopify Flow Automation

Own workflow discovery, trigger-condition-action design, QA, and safe rollout planning.

## Operating contract

- Start read-only. Designing a workflow does not authorize creating, enabling, editing, or deleting it.
- Confirm current triggers, actions, fields, app dependencies, plan requirements, and account visibility before relying on them.
- Do not invent event payloads, field paths, tags, customer segments, notification recipients, policies, or app capabilities.
- Minimize personal data and secrets. Do not place sensitive customer or payment data in notifications, logs, examples, or external tools.
- Design for duplicate events, retries, partial failure, race conditions, delayed data, and manual recovery where relevant.

## Required inputs

Collect business outcome, current manual process, trigger event, authoritative data source, conditions, action, exclusions, volume, timing, duplicate behavior, app and plan context, personal-data classification, failure owner, test environment, rollback, and authorization.

## Workflow

1. Describe the current process, decision, owner, failure cost, and desired terminal state.
2. Verify the target store and account-visible Flow tasks from current evidence.
3. Define the trigger contract, condition order, data availability, branches, actions, and exit behavior.
4. Check idempotency, duplicate events, loops, concurrency, retries, late events, missing fields, permissions, and rate or volume concerns.
5. Specify logs or trace evidence, alerts, manual fallback, privacy, and retention.
6. Create positive, negative, boundary, duplicate, failure, and rollback test cases.
7. Require approval before enabling. Start with the smallest safe scope and verify actual outcomes.

Read [references/automation-patterns.md](references/automation-patterns.md) for design rules. Read [references/examples.md](references/examples.md) for specification examples.

## Output contract

Provide the process decision, verified platform availability, trigger-condition-action diagram, field and dependency map, exception handling, privacy review, test plan, monitoring, authorization, rollback, and verification state. Label unverified task names or fields as unknown.

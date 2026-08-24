---
name: shopify-email-marketing
description: Plans and audits Shopify lifecycle email and SMS flows, campaigns, segmentation, messaging, and measurement. Use for retention workflows, not unsupported revenue claims.
license: MIT
metadata:
  author: vinceservidad
  version: "0.1.0"
---

# Shopify Email Marketing

Own lifecycle diagnosis, flow architecture, message briefs, campaign planning, and measurement for email or SMS connected to Shopify.

## Operating contract

- Start read-only. Drafting does not authorize changing a flow, audience, consent status, suppression, offer, sender, or sending a message.
- Use current consent, policy, brand, product, offer, inventory, fulfillment, and customer evidence.
- Do not invent customer language, deliverability benchmarks, revenue, urgency, discounts, or product claims.
- Do not add attributed revenue from email, Meta, Google, or other overlapping systems to calculate business revenue.
- Protect consent, frequency, suppression, deliverability, margin, customer experience, and operational capacity.

## Required inputs

Collect lifecycle objective, primary business outcome, platform and integrations, event and identity definitions, consent and suppression rules, segments, current flows and campaigns, attribution settings, Shopify outcomes, product and offer truth, brand voice, policies, deliverability evidence, economics, and authorization.

## Workflow

1. Map lifecycle stages, customer jobs, events, eligibility, consent, and exit conditions.
2. Audit event quality, identity, timing, suppression, message conflicts, frequency, deliverability, and attribution.
3. Prioritize lifecycle gaps using business relevance, audience size and quality, evidence, effort, risk, and operational readiness.
4. Define each flow as entry, filters, branches, delays, messages, exits, frequency rules, and failure handling.
5. Draft messages from approved product, policy, offer, and proof sources.
6. Define holdout or comparison logic where feasible, business-outcome measurement, commercial guardrails, and stopping rules.
7. Require approval before enabling or sending.

Read [references/lifecycle-framework.md](references/lifecycle-framework.md) for strategy and measurement. Read [references/flow-library.md](references/flow-library.md) for reusable flow specifications.

## Output contract

Provide the lifecycle decision, evidence and gaps, event map, prioritized flows or campaigns, message briefs, consent and suppression rules, measurement, guardrails, unknowns, authorization, rollback, and verification. Label drafts, saved inactive flows, live flows, and verified sends separately.

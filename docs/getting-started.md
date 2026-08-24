# Getting Started

## 1. Choose one owner skill

Pick the skill that owns the final decision or deliverable. Add a second skill only when it contributes a distinct specialty.

Examples:

- Use `shopify-store-audit` for a broad store review.
- Use `shopify-cro` for a funnel diagnosis and experiment backlog.
- Use `shopify-product-page` for a product-page rewrite.
- Use `shopify-analytics` as the owner when the main question is why performance changed.
- Pair `shopify-analytics` with an ads skill when reconciliation changes the media decision.

Avoid invoking every skill for one request. That creates duplicated analysis and unclear ownership.

## 2. Supply business context

Complete the relevant parts of [`business-context-template.md`](business-context-template.md). At minimum, include:

- store URL or supplied artifacts
- market and currency
- primary business outcome
- date range and comparison
- product, price, offer, and availability context
- commercial guardrail or named unknown
- approved and prohibited actions

Do not paste passwords, API keys, private customer data, payment data, or other secrets into the context.

## 3. State the authorization boundary

Use one of these scopes:

- **Read-only:** inspect and recommend only.
- **Draft-only:** create copy, code, workflow, or configuration drafts without saving them in a target platform.
- **Save as inactive:** persist a draft that cannot affect customers, spend, tracking, or operations.
- **Approved implementation:** execute only the named changes in the named environment.

Approval for one action does not authorize adjacent actions. A request to draft an email does not authorize sending it. A request to fix a theme file does not authorize publishing it.

## 4. Attach source-of-truth evidence

Useful evidence can include:

- Shopify analytics exports
- order, product, inventory, or customer-segment exports with unnecessary personal data removed
- GA4 explorations or exports
- Google Ads and Meta Ads reports with date range, attribution settings, and columns visible
- Merchant Center diagnostics and product data
- heatmaps, recordings, surveys, and support themes with provenance
- theme files, app configuration, and workflow screenshots
- email-flow configuration and event definitions

A screenshot can establish what was visible, but it may not contain enough scope, date, filter, or definition information for a commercial decision.

## 5. Ask for an evidence-led output

```text
Use shopify-cro as the owner skill.

Objective: diagnose the product-to-checkout drop and propose a controlled test.
Scope: mobile sessions in the UK, 1-24 August 2026 versus 8-31 July 2026.
Primary business outcome: first-order contribution profit.
Evidence: attached Shopify funnel export, GA4 landing-page report, heatmap summary,
and current product-page screenshots.
Authorization: read-only. Do not edit the store or launch a test.

Separate observed facts, calculations, inferences, assumptions, and unknowns.
Give me the decision, evidence, guardrails, stopping rules, and missing inputs.
```

## 6. Review before implementation

Check that the response:

- uses the requested scope and period
- names the source for each key observation
- shows formulas for calculations
- distinguishes correlation from causality
- names missing inputs that could change the decision
- avoids unsupported lift estimates and benchmarks
- includes a reversible implementation path
- requests approval before a live change

## 7. Verify the terminal state

After approved implementation, re-open the authoritative target and confirm the intended state. A successful command, save message, build, or platform acceptance is not enough by itself.

Record:

- what changed
- where it changed
- previous state or rollback reference
- saved, published, live, or processing state
- verification evidence
- monitoring owner, date, and stopping rule

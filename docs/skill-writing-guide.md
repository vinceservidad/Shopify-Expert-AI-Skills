# Skill Writing Guide

## Purpose

A skill should improve a specific repeatable decision or workflow. It should not restate general Shopify knowledge or pretend to replace evidence, platform access, or accountable human approval.

## Discovery metadata

The folder and `name` must match and use lowercase letters, numbers, and hyphens. Keep the name under 64 characters.

The `description` must say both what the skill does and when to use it. Include discriminating terms that separate it from nearby skills.

```yaml
---
name: shopify-product-page
description: Audits and drafts Shopify product-page structure, copy, proof, offer, and mobile UX. Use for a specific PDP, not a whole-store audit.
license: MIT
metadata:
  author: vinceservidad
  version: "0.1.0"
---
```

## Entrypoint content

Keep `SKILL.md` concise and decision-changing. It should contain:

- the workflow the skill owns
- trigger and boundary
- inputs that materially change the answer
- essential evidence and authorization rules
- decision procedure
- output contract
- links to conditional references

Avoid generic role-play such as “You are a world-class expert.” Give the agent concrete decision rules instead.

## References

Create a reference when information is substantial and only relevant to one mode of the skill. Link it directly from `SKILL.md` and explain when to read it.

Good:

```markdown
For a full product-page structure or rewrite, read
[references/copy-frameworks.md](references/copy-frameworks.md).
```

Avoid deep chains where one reference points to another. Do not duplicate the same rule in several files unless the standalone package would otherwise become unsafe.

## Decision design

For every material decision, define:

- evidence required for high confidence
- safe behavior with missing data
- commercial and customer guardrails
- reversible test or change
- stopping rule
- authorization boundary
- saved and live verification

Do not encode universal thresholds where business economics, volume, or platform behavior determine the answer.

## Current platform facts

Before adding a volatile claim:

1. Find current first-party documentation.
2. Record the source and review date in `PLATFORM-CURRENCY.md` or the relevant reference.
3. Distinguish documented behavior from account-visible availability.
4. Avoid claims about undocumented algorithms.
5. Add an evaluation if the claim changes a decision rule.

## Output contracts

Prefer a structure that exposes reasoning quality without forcing every simple answer into a long report.

For consequential work, a useful default is:

1. Decision or deliverable
2. Scope and evidence
3. Observed facts
4. Calculations
5. Inferences and alternatives
6. Assumptions and unknowns
7. Recommended action or test
8. Guardrails and stopping rules
9. Authorization and verification state

## Evaluations

Use realistic requests with raw evidence and expected behaviors. Review the actual result for:

- correct routing
- decision quality
- evidence handling
- uncertainty
- commercial truth
- authorization boundary
- useful output

Avoid evaluations that only check whether a heading or phrase appears.

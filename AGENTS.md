# Instructions for Codex and other coding agents

This repository is **Shopify VA Toolkit**, a job-based skill system that helps Shopify virtual assistants, freelancers, merchants, agencies, marketers, and developers perform real assigned Shopify work in the right sequence. It **complements** Shopify Sidekick and existing Shopify integrations. It is not a new autonomous Shopify operator.

**Read first:** [Product brief](docs/product-brief.md) and, for any workflow change, [Job workflow design](docs/job-workflow-design.md).

## Canonical references
- [README](README.md): the existing 19-skill catalog and scope.
- [Shopify VA coordinator](skills/shopify-va/SKILL.md): mixed task intake, ownership, QA, and handoff.
- [Store operating lifecycle](skills/shopify-va/references/store-operating-lifecycle.md): canonical shared state model and role boundaries.
- [Task routing](skills/shopify-va/references/task-routing.md): canonical one-owner routing and escalation.
- [Skill writing guide](docs/skill-writing-guide.md): procedures, references, examples, evaluations.
- [Connector guide](docs/plugin-and-connector.md): actual implemented MCP capabilities and limits.

Never duplicate or replace the canonical lifecycle/routing map. Keep **19 skills** unless a verified uncovered job genuinely requires another. Do not build a second set of parallel SOPs.

## Implementing a task or feature
1. Identify the real hired job, responsible operator, exact client deliverable, constraints and acceptance criteria.
2. Read the relevant existing specialist `SKILL.md`, references, and tests. Select one owner skill; add contributors only for distinct decisions.
3. Find the actual missing step, prerequisite, dependency, decision gate, exception path, quality check, or handoff.
4. Define the useful order of work: what comes first, what needs approval, what can be skipped, what proves completion. Improve the owner skill or linked reference rather than adding generic prompts.
5. Treat `CONTEXT → GOAL → DIAGNOSE → STRATEGY → PLAN → IMPLEMENT → VERIFY → MEASURE → OPTIMIZE` as a **state model**, not nine mandatory steps. Begin at the earliest materially unresolved state; move backward when needed.
6. Keep evidence, assumptions, unknowns, implementation status, saved/live verification, and business measurement separate.
7. Implement small cohesive changes with realistic tests or examples for any changed decision behavior.
8. Report changed files, job outcome, verification, failures, untested behavior, and next actions.

## Safety and truth
- Default to read-only. A skill or tool connection is not authorization for live edits.
- Never publish, refund, change prices/inventory/budgets, send messages, or modify live Shopify state without explicit scope, appropriate tools, and permissions.
- The repository's custom MCP currently supplies **read-only** store data. Do not claim live write capability or deployed hosted integrations without evidence.
- Shopify Sidekick and official integrations may be complementary but must be connected and verified before use.
- Never commit credentials, secret tokens, payment data, or unnecessary customer information.
- A build/test, draft, or successful save is not proof of a live verified change or business impact.

## Validation
Run relevant checks from the repository root, and disclose results honestly:
```bash
./scripts/validate-repository.sh
python -m unittest discover -s tests -v
python scripts/worked_examples.py
python scripts/check_evaluation_evidence.py
```
A workflow evaluation should cover correct skill routing, dependencies, blockers, missing evidence, approvals, QA and terminal state, not just keyword/heading presence.

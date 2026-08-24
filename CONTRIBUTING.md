# Contributing

Contributions should improve a repeatable Shopify workflow without expanding a skill into a general-purpose chatbot.

## Before changing a skill

1. Identify the request that should trigger the skill and nearby requests that should not.
2. Name the evidence required for a high-confidence decision.
3. Define what the skill may draft, what it may recommend, and what requires explicit approval.
4. Check current first-party documentation before adding volatile platform claims.
5. Decide whether detail belongs in `SKILL.md` or a focused reference file.

## Skill requirements

Each skill must:

- use a lowercase, hyphenated folder name under 64 characters
- contain `SKILL.md` with matching `name` and a discriminating `description`
- use only Agent Skills frontmatter fields
- keep important instructions in the entrypoint and conditional detail in `references/`
- link every reference from `SKILL.md`
- separate facts, calculations, inferences, assumptions, and unknowns
- preserve the authorization boundary before any external mutation
- avoid fabricated benchmarks, expected lifts, customer quotations, commercial facts, and causality
- use the terms in `GLOSSARY.md`
- classify substantial operating knowledge under `KNOWLEDGE-TAXONOMY.md`
- apply `PLATFORM-CURRENCY.md` to high-change platform claims

Do not add placeholder directories, duplicated guides, or generic advice that does not change a decision.

## Meaningful behavior changes

When a change alters a decision rule, evidence standard, platform claim, or authorization boundary:

1. Add or update a realistic scenario in `evals/core-scenarios.md`.
2. Review the expected decision, evidence handling, uncertainty, and authorization behavior.
3. Add an entry to `CHANGELOG.md`.
4. Do not mark the evaluation passed until the actual output has been reviewed.

## Validation

Run:

```bash
./scripts/validate-repository.sh
```

When the `skills-ref` validator is available, also run it against every changed skill. The local validator does not prove behavioral quality.

## Pull request notes

Explain:

- the user request or failure that motivated the change
- the files changed
- the decision behavior that changed
- the evidence used for any current platform fact
- the evaluation scenarios reviewed
- known limitations or unresolved questions

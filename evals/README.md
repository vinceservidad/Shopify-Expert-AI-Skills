# Evaluations

The scenarios in this directory are behavioral reviews, not automated claims that a model is correct.

## How to run a scenario

1. Use a clean conversation or isolated workspace.
2. Enable only the skill or small combination named by the scenario.
3. Provide the request and artifacts without adding the intended answer.
4. Save the complete response and any generated files.
5. Review the actual decision, evidence handling, uncertainty, authorization boundary, and output usefulness.
6. Record `pass`, `fail`, or `needs-review` with reviewer, date, model, and notes.

Do not mark a scenario passed because the response used expected headings. A pass requires substantively correct behavior.

## Review record

```yaml
scenario:
skill_version:
model_and_surface:
reviewer:
reviewed_on:
result: needs-review
decision_quality:
evidence_handling:
authorization_boundary:
failure_notes:
follow_up_change:
```

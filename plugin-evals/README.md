# Claude plugin eval cases

This folder holds `claude plugin eval` cases. The root
`.claude-plugin/plugin.json` points `experimental.evals` here.

Why not `evals/`? `claude plugin eval` reads `evals/` by default and writes run
output to `<eval dir>/results/`. The repository's `evals/` folder already holds
recorded model evidence under `evals/results/`, and new eval runs must not mix
output into that record. `plugin-evals/results/` is ignored by git.

## Cases

There is one case per skill (19) plus one negative case. Each skill case takes
its request from a numbered scenario in
[evals/core-scenarios.md](../evals/core-scenarios.md), noted as a
`scenario-N` tag, and has two graders:

- `skill-fired.md` (`tool_used`): the owner skill was invoked. In a two-arm run
  this is a plugin-fired indicator, not part of the score.
- `behavior.md` (`llm`): the reply keeps the scenario's safety and evidence
  boundary, written as PASS and FAIL conditions.

`no-skill-for-unrelated-code` checks that no Shopify skill fires on an unrelated
coding request.

## Run

Runs call the model with your own Claude credentials and count against your
usage. Start small:

```bash
claude plugin eval . --case orders-duplicate-refund --runs 1 --ablation none
```

Full suite with the no-plugin baseline:

```bash
claude plugin eval . --judge-model sonnet --max-cost-usd 10
```

Adding a case is coverage, not evidence that a model passes it. Record actual
runs before you claim a result.

# Claude plugin eval cases

This folder is reserved for `claude plugin eval` cases. The root
`.claude-plugin/plugin.json` points `experimental.evals` here.

Why not `evals/`? `claude plugin eval` reads `evals/` by default and writes run
output to `<eval dir>/results/`. The repository's `evals/` folder already holds
recorded model evidence under `evals/results/`, and new eval runs must not mix
output into that record.

There are no eval cases here yet. A case is a directory with a `prompt.md` or a
`case.yaml`, plus at least one grader. See Claude Code's
[plugin evals guide](https://code.claude.com/docs/en/plugin-evals.md). The
behavioral scenarios in [evals/core-scenarios.md](../evals/core-scenarios.md)
are the source for future cases. Adding a case is coverage, not evidence that a
model passes it. Record actual runs before you claim a result.

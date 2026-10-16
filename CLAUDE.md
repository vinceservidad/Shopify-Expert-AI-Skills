# Claude Code repository context

Read and follow [AGENTS.md](AGENTS.md), the shared source for coding instructions,
architecture, authorization boundaries, and validation commands.

Before changing a skill, read the [product brief](docs/product-brief.md),
[job workflow design guide](docs/job-workflow-design.md), and that skill's
entrypoint and relevant references. Keep the existing 19-skill architecture.

## Starter prompt
```text
Follow AGENTS.md. Improve the existing [named Shopify VA job] workflow
in its owning skill. Check prerequisites, order, decisions, QA, exceptions,
and the client deliverable. Test changes and report actual verification.
```

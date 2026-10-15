# Claude Code repository context

Follow [AGENTS.md](AGENTS.md) as the shared instructions for coding agents. Read [docs/product-brief.md](docs/product-brief.md) before planning repository changes, and [docs/job-workflow-design.md](docs/job-workflow-design.md) before editing any Shopify job procedure.

**Mission:** Make real Shopify VA jobs easier, more consistent, and safer by guiding the correct order of work, decision checks, authorized execution, QA, and client handoff. Do **not** build a competitor to Shopify Sidekick, a new standalone chat, or an autonomous store manager.

## Development behavior
- Reuse the **existing 19 skills**, with `shopify-va` coordinating mixed tasks. Work in the single domain-owner skill whenever possible.
- Read the owner skill and its references before changing it. For cross-skill behavior, refer to the canonical lifecycle at `skills/shopify-va/references/store-operating-lifecycle.md` and routing at `skills/shopify-va/references/task-routing.md`.
- Work backwards from **real assigned job → deliverable → prerequisites → ordered actions → approval/exception gates → QA → handoff**.
- Use only the lifecycle states needed. Avoid mechanical nine-step procedures and repeated boilerplate.
- Do not assume Shopify permissions or active MCP tool integrations. Custom MCP access is currently read-only; check current code and [connector documentation](docs/plugin-and-connector.md).
- Add realistic tests/evaluation scenarios when changing behavior. State what was and was not actually verified.

### Starter prompt for implementation
```text
Read CLAUDE.md, AGENTS.md, docs/product-brief.md and
docs/job-workflow-design.md. Audit the existing [named Shopify VA job]
workflow and its owning SKILL.md. Improve missing prerequisites,
correct sequence, decision gates, QA, exceptions, and client deliverables.
Preserve the 19-skill architecture and authorization boundaries.
Add realistic tests; report actual results and unverified claims.
```

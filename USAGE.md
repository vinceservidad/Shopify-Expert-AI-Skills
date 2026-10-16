# How to Use Shopify VA Toolkit

Install the workflow you need, provide evidence and permission boundaries, then review the result. No Shopify connection is required to analyze supplied files. A skill supplies procedures; connected tools and account permissions determine what the assistant can access or change.

Coding agents improving the toolkit should start with [AGENTS.md](AGENTS.md) or [CLAUDE.md](CLAUDE.md).

## Choose one skill

Use the [19-skill catalog](README.md#skill-catalog) to choose the owner of your deliverable. Start with `shopify-va` for a mixed task list or unclear ownership. Add another specialist only for a distinct decision: for example, `shopify-analytics` owns a profit diagnosis while `shopify-google-ads` contributes campaign evidence.

## Installation

The [v0.1.1 downloads](releases/v0.1.1/README.md) contain individual skill ZIPs, a skills-only plugin, and a plugin with the local MCP runtime. Import the selected archive using your host's supported flow. Review packages before installation; never upload the entire repository as one skill. Update or reimport an installed package to receive a new version.

For plugin builds, local MCP registration, authentication, or hosted OAuth deployment, follow [plugin and connector setup](docs/plugin-and-connector.md). The full plugin requires Node.js 24+; the skills-only plugin has no MCP runtime. Store reads require an authorized connection. A hosted connector requires an actual deployed HTTPS endpoint.

### Option 1: Install a skill in Claude

Download the selected `shopify-*.zip` and follow [Claude Skills setup](docs/ai-agent-setup.md#claude-skills) to upload, enable, and test it. The guide also explains [Claude Projects](docs/ai-agent-setup.md#claude-projects) for stable store context.

If building from source, use [repository tooling setup](docs/reliability.md#tooling-setup), then:

```bash
./scripts/package-skill.sh shopify-store-audit
```

Upload `dist/shopify-store-audit.zip`. Use `--all` to build all 19 skill archives. Without tooling, download the repository, extract it, and ZIP only the selected complete skill folder. The ZIP must contain that named folder at its root, including `SKILL.md`, references, and any assets.

### Option 2: Use a skill in ChatGPT

Follow [ChatGPT setup](docs/ai-agent-setup.md#chatgpt-custom-gpts) for Instructions and Knowledge, or the [Project/ordinary-chat path](docs/ai-agent-setup.md#chatgpt-projects-or-ordinary-chats). Keep behavioral rules in Instructions and supporting source material in Knowledge or task attachments. This guided use is distinct from installing a native Agent Skills package; account controls and available surfaces vary.

### Option 3: Install a skill in Codex

Ask the built-in installer to install one complete skill:

```text
Use $skill-installer to install shopify-cro from
https://github.com/vinceservidad/Shopify-Expert-AI-Skills/tree/main/skills/shopify-cro.
Keep existing installed skills unchanged.
```

For project-scoped use, copy the complete `skills/shopify-cro` folder into `<your-project>/.agents/skills/shopify-cro`, including references and assets. Check for an existing folder and review differences before copying. Avoid installing the same name in overlapping discovery locations. Other compatible coding tools use their documented skills directory; keep the folder name identical to the `name` in `SKILL.md`.

Invoke it explicitly:

```text
Use $shopify-cro to review the attached mobile product page and funnel report.
Give me a prioritized experiment backlog. Keep this read-only.
```

Restart Codex if an installed skill does not appear. Installation does not configure Shopify access or grant store permissions. See the [dated Codex source review](PLATFORM-CURRENCY.md#targeted-review-on-2026-09-30) for the documented discovery and installation paths.

## Start with the Shopify Store Operating Lifecycle

Continue from the current verified state. The [canonical lifecycle](skills/shopify-va/references/store-operating-lifecycle.md) is a state model, not a mandatory nine-step checklist. Use only stages that can change the next decision. A theme bug may need diagnosis, implementation, and verification; an approved support reply may need only policy checks and drafting.

Use the [Initiative Record](skills/shopify-va/references/initiative-record.md) for work spanning skills, sessions, or handoffs. Specialists own their domain decisions; merchant/client approval and commercial authority do not transfer merely because someone has a skill or tool connection.

## What evidence should you provide?

Complete the relevant parts of the [business context template](docs/business-context-template.md): task, store/market, objective, scope, period/comparison, source files, acceptance criteria, and approval owner. Include metric and profit definitions for commercial analysis.

Attach the sources that matter: approved product specifications and claims for listings; current exports and identifiers for catalog work; order state and policies for order/support work; dated reports and attribution settings for analytics/ads; reproduction steps, code, dependencies, and rollback for theme/Flow work. A screenshot proves what was visible, but may omit important filters, dates, or definitions.

Remove passwords, API keys, payment data, and unnecessary customer information. Missing evidence should limit the result or block dependent work; it must not become an invented fact.

## Tell the skill what it is allowed to do

| Scope | Allowed work |
| --- | --- |
| Read-only | Inspect and recommend; do not change external systems. |
| Draft-only | Prepare copy, code, workflows, or configuration without saving or applying them in a target platform. |
| Save as inactive | Save only an explicitly approved inactive draft that cannot affect customers, spend, tracking, or operations. |
| Approved implementation | Execute only the named changes in the named target, preserve unrelated work, record rollback, and verify authoritative state. |

Approval for one change does not authorize adjacent actions. Saving an inactive draft is separate from drafting in chat; publishing, enabling, and sending require their own scope. An available write-capable tool and appropriate account permissions are also required. The repository's custom MCP supplies read-only Shopify evidence.

See [Evidence and authorization](docs/evidence-and-authorization.md) for source standards, change states, and approval requirements.

## Recommended request structure

```text
Use: [owner skill; shopify-va if this is mixed work]
Deliverable: [what must be handed back and what counts as done]
Scope: [store, market, environment, products/channels, period/comparison]
Current verified state: [completed work and earliest unresolved stage, if known]
Evidence: [files, screenshots, URLs, exports, policies; name missing inputs]
Business definition: [revenue/profit definition and guardrails, when relevant]
Authorization: [read-only, draft-only, save as inactive, or exact approved action]
Verification: [authoritative target, acceptance checks, rollback, next owner]

Separate facts, calculations, inferences, assumptions, and unknowns.
Follow prerequisites before dependent actions. Report verified work, drafts,
blockers, QA evidence, and the next action/owner. Measure later only when relevant.
```

For a first test, ask the selected skill to review supplied evidence read-only. Confirm that it names sources, handles decision-changing unknowns, respects permission boundaries, and produces the requested deliverable. Test a nearby unrelated request too, so the skill does not take over work it does not own.

## Review and verify the result

Check scope, sources, formulas, unknowns, and the proposed reversible path before approving implementation. Distinguish evidence from hypotheses and do not accept unsupported lifts, benchmarks, quotations, or causal claims.

After an approved external action, reopen the authoritative target and confirm the intended state. Record what changed, where, rollback, actual draft/saved/published/processing/live/verified state, QA evidence, and the monitoring owner. A save message or successful command is not proof of live behavior or business impact.

## What the skills do not do automatically

Installation does not connect Shopify or marketing platforms, grant permissions, change a store, send messages, verify uninspected live state, or guarantee correct advice. The custom connector exposes no write, refund, publish, or campaign-change tools. Other integrations must be connected and verified separately.

[Worked examples](docs/worked-examples.md) use synthetic teaching evidence. [Recorded evaluations](evals/RESULTS.md) cover specific cases and preserve their failures and limitations; they do not establish reliable operation across every skill or merchant outcomes.

## Troubleshooting

| Problem | Check |
| --- | --- |
| Claude rejects the ZIP | Upload one named skill folder with `SKILL.md`, matching frontmatter name, references, and assets. Check the account's Skills and code-execution settings in the [host guide](docs/ai-agent-setup.md#claude-skills). |
| A skill does not activate | Enable it, name it explicitly, and use a request matching its description. Start with one owner skill. |
| ChatGPT gives a generic answer | Supply the full procedure, required references, store evidence, output, and authorization. Follow the [setup guide](docs/ai-agent-setup.md). |
| The assistant needs missing data | Supply it, accept a clearly limited result, or request a collection plan. Dependent actions may remain blocked. |
| A live action cannot proceed | Check exact approval, target, permissions, and an available write-capable integration. The custom MCP is read-only. |
| The assistant repeats completed stages | State the current verified work and ask it to continue at the earliest unresolved stage. |
| MCP store reads fail | Follow [connection setup and limits](docs/plugin-and-connector.md); never put credentials in prompts or public files. |

## Ready-to-use prompts

The [prompt library](docs/prompt-library.md) has one request for each skill. The [worked examples](docs/worked-examples.md) show complete evidence-led tasks; keep teaching answers withheld when independently evaluating a model.

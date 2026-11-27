# How to Use Shopify VA Toolkit

Install the workflow you need, provide evidence and permission boundaries, then review the result. No Shopify connection is required to analyze supplied files. A skill supplies procedures; connected tools and account permissions determine what the assistant can access or change.

Coding agents improving the toolkit should start with [AGENTS.md](AGENTS.md) or [.claude/CLAUDE.md](.claude/CLAUDE.md).

## Choose one skill

Use the [19-skill catalog](README.md#skill-catalog) to choose the owner of your deliverable. Start with `shopify-va` for a mixed task list or unclear ownership. Add another specialist only for a distinct decision: for example, `shopify-analytics` owns a profit diagnosis while `shopify-google-ads` contributes campaign evidence.

## Installation

Install the **ShopifySkills** skills-only plugin once in a supported plugin host,
then select it in the plugin picker and ask in plain language. It includes all
19 workflows and needs no Shopify sign-in for public research or supplied files.
Follow the [native plugin installation guide](docs/ai-agent-setup.md#install-shopifyskills-once).
App-directory registration is separate; an `@` entry exists only after the host
has installed or registered the plugin.

If your app cannot import custom plugins, use the Claude Skill or ChatGPT
Project fallbacks below. Plugin format support and mention syntax are specific
to the host. Connecting private Shopify data is optional and covered separately
in the [developer MCP guide](docs/plugin-and-connector.md).

### Option 1: Install a skill in Claude

Download the selected `shopify-*.zip` and follow [Claude Skills setup](docs/ai-agent-setup.md#claude-skills) to upload, enable, and test it. The guide also explains [Claude Projects](docs/ai-agent-setup.md#claude-projects) for stable store context.

Use the published ZIP as-is. Building and packaging from source is covered in
the [contributor tooling guide](docs/reliability.md#tooling-setup).

### Option 2: Use a skill in ChatGPT

Start with the [Project setup](docs/ai-agent-setup.md#chatgpt-projects-or-ordinary-chats).
Use [custom GPT setup](docs/ai-agent-setup.md#chatgpt-custom-gpts) when you want a
reusable assistant and your account supports creating one. Keep behavioral rules
in instructions and source material in project files or Knowledge. This is
guided use; it does not install native skills or connect Shopify.

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

## Choose an everyday VA job

The toolkit also has eight repeatable workflows using the existing guides. A workflow tells the AI which information to check and what result to prepare.

| Say... | Have ready |
| --- | --- |
| “Set up my client's work guide.” | Brand voice, policies, assigned tasks and who approves or handles exceptions. |
| “Plan today's work.” | Client brief, dated task list, deadlines and available working time. |
| “Check this product listing.” | Target product, current listing and approved product facts. |
| “Review my product catalog.” | Products or export to check, approved identifiers and naming rules. |
| “Review stock.” | Target items, stock by location and the owner's stock thresholds. |
| “Help me answer this customer.” | Customer question, approved policy and verified order facts when relevant. |
| “Prepare my handover.” | Work log, drafts, verification evidence, blocked tasks and next owners. |
| “Train a new VA.” | Assigned task, current instructions, sanitized examples and reviewer criteria. |

Open [Practical VA jobs](docs/va-workflows.md), attach the job's owner guide and linked reference, then use its [sample request](docs/prompt-library.md#practical-va-jobs). Missing policies, facts or thresholds remain gaps for the owner to resolve. A checklist alone does not prove that a task or store change is complete.

Keep the client brief and evidence in your chat or ChatGPT/Claude project files. The task-preparation tool receives only the names of available inputs; it does not upload or store those documents. These workflows run on request and do not schedule future work.

## Connect your store (optional)

Connecting a store lets the AI use current store information instead of relying only on files you upload. Check which connection you are using and what it is allowed to do.

| Connection | What it allows |
| --- | --- |
| No connection | Drafting and review using the facts and files you provide. |
| This toolkit's hosted connector | Reading store details, products, variants, stock, and order summaries. It cannot edit the store. |
| A separate approved Shopify editing connection | Supported changes allowed by that connection, your account permissions, and your approval. |

Our hosted connector is **read-only**. It was verified on **VA Toolkit Connector Test**, a development store with sample data, on September 30, 2026. It has not been verified for every merchant store. The original hosted order test returned no orders. Later local 0.2.0 testing read an unpaid sample order and both item pages; that did not replace the hosted service or verify a public app.

The released hosted Worker is **0.1.0 with eight tools**. The local **0.2.0** plugin/connector source adds workflow discovery, task preparation, product details and order details for a total of **12 tools**. Using the hosted URL does not enable these four new tools before a separate release. The upgrade keeps the existing read permissions (`read_products`, `read_inventory`, `read_orders`) and cannot edit the store. The new order-details read excludes customer identities, addresses and payment details.

Supported editing depends on the separate integration. See Shopify's instructions for [ChatGPT](https://help.shopify.com/en/manual/ai-powered-tools/connecting-ai-tools/shopify-plugin-for-chatgpt) or [Claude](https://help.shopify.com/en/manual/ai-powered-tools/connecting-ai-tools/shopify-connector-for-claude). Installing the guides alone does not give either app access to your store.

The read-only connector and a separate editing connection can serve different parts of a task. The combined workflow in native ChatGPT or Claude has not been tested end to end here.

For technical setup, the connection method is called **MCP**. The hosted URL is `https://shopify-va-toolkit.vinceluxxe.workers.dev/mcp`. Give the [connector setup guide](docs/plugin-and-connector.md) to the person helping with your setup. Other merchants still need an approved Shopify app installation and suitable app distribution. Opening that URL in a browser without signing in returns an authorization error; it is not an installation button.

### Public store connection being prepared

The planned public guide is `mktskills.com/shopify-va`. The planned connection address is `https://shopify-mcp.mktskills.com/mcp`. Do not use it until the [public release record](docs/public-release.md) confirms the domain, app approval and client tests.

After release, the steps will be:

1. The owner opens the app's verified Shopify App Store page and installs it on the intended store. Shopify handles store selection.
2. In **ChatGPT or Claude**, add a custom connection using the verified address. Your account must support that option.
3. Follow sign-in and copy its connection request code into **Marketing Skills VA Toolkit** inside Shopify.
4. The owner checks the store, requesting app, return destination and read permissions, then approves the request.
5. Return to the original sign-in tab to finish. Ask the AI to confirm which store is connected before reading it.

Staff can inspect information allowed by their Shopify permissions inside the app. The owner approves offline AI connections and can disconnect them in the app. An expired or used request code requires a new sign-in request. No password, API key or manual store address is needed in this public flow.

Custom connection availability changes by account and organization. Check the official [ChatGPT setup guide](https://help.openai.com/en/articles/11487775-connectors-in-chatgpt) or [Claude setup guide](https://support.claude.com/en/articles/11175166-getting-started-with-custom-connectors-using-remote-mcp). Installing this toolkit is separate from installing Shopify's own editing integrations.

## What evidence should you provide?

Complete the relevant parts of the [business context template](docs/business-context-template.md): task, store/market, objective, scope, period/comparison, source files, acceptance criteria, and approval owner. Include metric and profit definitions for commercial analysis.

Attach the sources that matter: approved product specifications and claims for listings; current exports and identifiers for catalog work; order state and policies for order/support work; dated reports and attribution settings for analytics/ads; reproduction steps, code, dependencies, and rollback for theme/Flow work. A screenshot proves what was visible, but may omit important filters, dates, or definitions.

Remove passwords, API keys, payment data, and unnecessary customer information. Missing evidence should limit the result or block dependent work; it must not become an invented fact.

If the controls are missing, check the current [Claude skill instructions](https://support.claude.com/en/articles/12512180-use-skills-in-claude). Skills require Code execution and file creation to be enabled; an organization may restrict custom uploads. Packaging and upload instructions were checked against [Claude's custom skill guide](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills) on September 30, 2026. This is a manual custom skill upload, not a public one-click plugin installation.

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

# ChatGPT and Claude Setup

Reviewed against first-party documentation on 2026-08-25. Recheck [`PLATFORM-CURRENCY.md`](../PLATFORM-CURRENCY.md) if the interface, plan, or availability differs.

## Claude Skills

Claude supports custom skill packages that follow the Agent Skills folder format.

### Package a skill

From the repository root:

```bash
./scripts/package-skill.sh shopify-cro
```

The archive contains the skill folder at its root, including `SKILL.md` and `references/`.

### Upload and enable

1. Enable Code execution and file creation if your account or organization requires it.
2. Open Customize > Skills.
3. Add a custom skill and upload the ZIP from `dist/`.
4. Enable the skill.
5. Test a request that should trigger it and one nearby request that should not.

For organization-wide provisioning or sharing, use the controls available to your Claude plan and organization role. Review the archive before upload and never package secrets.

Official sources:

- <https://support.claude.com/en/articles/12512198-how-to-create-custom-skills>
- <https://support.claude.com/en/articles/12512180-use-skills-in-claude>

## Claude Projects

Use a Project when you want stable store context across related chats.

Recommended split:

- Project instructions: repository-wide operating rules and authorization boundaries
- Project knowledge: brand, product, policy, measurement, and business-context documents
- Custom Skills: repeatable specialist procedures that should activate only when relevant

Do not put volatile order exports or unnecessary customer data into a long-lived project knowledge base.

## ChatGPT custom GPTs

ChatGPT custom GPTs currently separate behavioral Instructions from uploaded Knowledge. They do not directly import this repository as an Agent Skills package.

As of the review date, creating new GPTs is limited to eligible Business, Enterprise, and Edu workspaces with the necessary permissions. Personal accounts can still use ordinary chats, Projects, or existing editable GPTs according to current account availability.

### Configure one specialist GPT

1. Select one skill as the owner.
2. Copy the contents of its `SKILL.md` into the GPT's Instructions field, removing only the YAML frontmatter delimiters if the editor does not need them.
3. Upload that skill's reference files as Knowledge.
4. Upload sanitized business-context and brand-policy files as additional Knowledge.
5. Enable only the capabilities needed for the workflow.
6. Add realistic conversation starters.
7. Test in Preview before sharing.

Keep rules and behavior in Instructions. Keep source material in Knowledge. If you want citations to uploaded material, require source labels in the Instructions.

Official source:

- <https://help.openai.com/en/articles/8554397-creating-with-chatgpt>

## ChatGPT Projects or ordinary chats

If custom GPT creation is unavailable:

1. Start a Project or chat for the store.
2. Add the relevant `SKILL.md` to project instructions when the interface supports it, or paste it at the start of the working session.
3. Upload only the references needed for the current task.
4. Include the completed business-context template.
5. Restate the authorization boundary in each request that could lead to an external change.

This approach provides guided use, but it is not automatic skill discovery.

## Suggested names and starters

Use the specialist name instead of a generic “Shopify Copilot” when one workflow owns the task.

Example name:

```text
Shopify Store Audit Copilot
```

Example starters:

```text
Audit this store from the attached screenshots and analytics export. Start read-only.
```

```text
Turn these observed issues into a prioritized, reversible implementation plan.
```

```text
Review this proposed recommendation for evidence gaps, commercial risk, and authorization.
```

## Minimum acceptance tests

The configured assistant should:

- activate for a relevant task and stay out of unrelated tasks
- ask for or label missing decision-changing inputs
- keep observations separate from inferences
- avoid invented benchmarks, lifts, and customer claims
- distinguish recommendations from authorization
- stop before live mutation without explicit approval
- recheck current first-party sources for volatile platform claims

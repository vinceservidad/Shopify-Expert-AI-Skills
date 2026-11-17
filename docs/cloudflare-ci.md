# Repository CI on Cloudflare

CI runs on Cloudflare, not GitHub Actions. GitHub stays the source of truth for
code, pull requests, and reviews.

```text
commit on GitHub
  → bash scripts/push-to-artifacts.sh        (cf issues a 10-minute, repo-scoped write token)
  → Artifacts repo mkt-skills/shopify-expert-ai-skills, same branch name
  → Workers Builds on Worker shopify-skills-ci runs scripts/ci.sh
  → all stages pass on main: cf deploy publishes the CI status page
    all stages pass on another branch: cf previews deploy publishes a preview status page
    any stage fails: the build fails and nothing deploys
```

## What runs

`scripts/ci.sh` runs every check the former GitHub workflows ran. Run it
locally with `bash scripts/ci.sh`, or pick stages with `CI_STAGES`.

| Stage | Checks |
| --- | --- |
| `core` | Unit tests, skill validation, evidence integrity, worked examples, packaging of all 19 skills, extracted-archive validation, skills-only plugin package |
| `plugin` | `claude plugin validate --strict .` (uses `npx @anthropic-ai/claude-code` when the CLI is not installed) |
| `connector` | `connector/` typecheck, tests, build, local plugin package, package runtime test |
| `theme` | Example JavaScript syntax, Liquid rendering with `Gemfile.theme`, Shopify CLI theme check, Chromium browser checks |

Each stage reports `passed`, `failed`, `skipped`, or `partial` in
`dist/ci-report.json`. A skipped or partial stage is never counted as passed:
the report names what did not run. Any failed stage makes the script exit
non-zero, which fails the Cloudflare build.

## Push a branch for checking

1. Install the Cloudflare CLI and sign in once:

   ```bash
   npm install --global cf
   ```

   ```bash
   cf auth login
   ```

2. After you push a commit to GitHub, push the same commit to Artifacts:

   ```bash
   bash scripts/push-to-artifacts.sh
   ```

   Pass a branch name to push to a different branch, for example `main` after
   a merge. The script creates the Artifacts repository if it is missing.

## Read the result

- Dashboard: Workers & Pages → `shopify-skills-ci` → Deployments or Builds.
- Status page (latest passing `main`): the `shopify-skills-ci` workers.dev URL,
  with `/report.json` for the machine-readable summary.
- API: `GET /accounts/{account_id}/builds/workers/{script_tag}/builds` and
  `GET /accounts/{account_id}/builds/builds/{build_uuid}/logs`.

## Workers Builds settings

| Setting | Value |
| --- | --- |
| Worker | `shopify-skills-ci` |
| Source | Artifacts `mkt-skills/shopify-expert-ai-skills`, production branch `main` |
| Root directory | `/` |
| Build command | `bash scripts/ci.sh && cd ci && npm ci --no-audit --no-fund && npm run report` |
| Deploy command | `cd ci && npx cf deploy` |
| Preview command | `cd ci && npx cf previews deploy` |
| Builds for Preview branches | On |
| Build variables | `NODE_VERSION=24`, `RUBY_VERSION=3.3.12` (Liquid 5.13 needs `base64`, which Ruby 3.4 no longer bundles), `CF_SEND_TELEMETRY=false` |

The Worker project lives in `ci/` and uses `cloudflare.config.ts`, so it is
deployed with `cf`, not Wrangler.

## Cost and limits

Artifacts requires the Workers Paid plan. Usage within the plan's included
Artifacts operations, storage, and Workers Builds minutes costs nothing extra;
check current amounts on Cloudflare's pricing pages and the Artifacts metrics
after the first month. GitHub Actions is not used, so no Actions minutes are
consumed.

## What this does not do

- Results do not appear as GitHub pull request checks. Read them in Cloudflare.
- A push to GitHub alone does not start a build; run the push script.
- Release packages in `releases/` are built locally with
  `python scripts/package_plugin.py` and `python scripts/package_skill.py --all`;
  no workflow publishes GitHub releases.

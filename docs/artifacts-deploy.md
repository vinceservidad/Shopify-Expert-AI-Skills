# Deploying the guide

## Current setup: Workers Builds from GitHub (since November 26, 2026)

Every push to `feat/cloudflare-hosted-mcp` on GitHub, including a merged pull
request, builds and deploys the guide Worker `mkt-skills-shopify-guide`
(`mktskills.com/shopify-va*`) through Cloudflare Workers Builds. Nobody needs to
run a deploy by hand.

| Setting | Value |
| --- | --- |
| Repository | GitHub `vinceservidad/Shopify-Expert-AI-Skills`, through the Cloudflare GitHub app |
| Branch | `feat/cloudflare-hosted-mcp` only |
| Root directory | `connector` |
| Build command | `npm ci && npm run typecheck && npm test` |
| Deploy command | `npm run guide:deploy` |
| Build variable | `NODE_VERSION=24` |

A failing typecheck or test stops the build before the deploy command runs, so
the live guide stays on the previous version. Watch builds and roll back in
Workers & Pages → `mkt-skills-shopify-guide` → Deployments. To deploy by hand
in an emergency, run `cd connector && npm ci && npm run guide:deploy` from a
machine signed in to the account with `npx wrangler login`.

The first Workers Builds run (build `d2167d89`, commit `0598b76`) passed all 60
tests and deployed version `bb17f380`.

## Earlier setup: Cloudflare Artifacts mirror (retired)

> **Retired November 19, 2026.** The `.github/workflows/artifacts-deploy.yml`
> workflow was removed to match `main`, which runs no GitHub Actions. The rest of
> this page records that earlier setup.

The public guide (`mktskills.com/shopify-va*`, Worker `mkt-skills-shopify-guide`) deploys automatically from
[Cloudflare Artifacts](https://developers.cloudflare.com/artifacts/). GitHub remains the source of truth:
pull requests, reviews and CI happen here as before.

```text
merge to feat/cloudflare-hosted-mcp
  → GitHub Actions: typecheck, tests, guide dry run           (.github/workflows/artifacts-deploy.yml)
  → push the verified commit to Artifacts repo main           (10-minute, repo-scoped write token)
  → Workers Builds builds and deploys mkt-skills-shopify-guide
```

Nobody deploys from a laptop. A commit that fails the checks is never mirrored, so it is never deployed.

## Status and cost

Artifacts is in open beta and requires the Workers Paid plan. Cloudflare begins billing on October 14, 2026:
10,000 operations and 1 GB of storage per month are included, then $0.15 per 1,000 operations and $0.50 per
GB-month ([pricing](https://developers.cloudflare.com/artifacts/platform/pricing/)). One small mirrored repo
is expected to stay within the included amounts; check the Artifacts metrics after the first month.

## One-time setup

No local commands are needed. Do these in order; Workers Builds can only connect to the repository after
the workflow has created it.

1. **Give GitHub a narrow token.** Create a Cloudflare API token with only **Artifacts: Edit** (and Read) on
   this account, and save it as the repository secret `CLOUDFLARE_ARTIFACTS_TOKEN` (Settings → Secrets and
   variables → Actions). It cannot deploy Workers itself; it only lets the workflow create the repository and
   issue the short-lived write token. Never paste it into an issue, chat or commit.

2. **Run the workflow once** (Actions → Deploy guide through Cloudflare Artifacts → Run workflow on
   `feat/cloudflare-hosted-mcp`). It creates the Artifacts repository (namespace `mkt-skills`, repo
   `shopify-va-guide` by default) and seeds it with the verified commit. If your namespace has another name,
   the run fails and lists your namespaces; set the GitHub repository variable `ARTIFACTS_NAMESPACE` (and
   optionally `ARTIFACTS_REPO`) and run it again.

3. **Connect Workers Builds** in the Cloudflare dashboard: Workers & Pages → `mkt-skills-shopify-guide` →
   Settings → Build → connect the Artifacts repository `shopify-va-guide`, with:

   | Setting | Value |
   | --- | --- |
   | Production branch | `main` |
   | Root directory | `connector` |
   | Build command | `npm ci` |
   | Deploy command | `npm run guide:deploy` |
   | Non-production branch builds | Off (the mirror only writes `main`) |

   `npm run guide:deploy` is the same `wrangler deploy --config wrangler.guide.jsonc` used for manual
   releases, so the Worker name, route and variables are unchanged. From then on, every verified push to
   `feat/cloudflare-hosted-mcp` deploys automatically; run the workflow once more to deploy the seeded commit.

Until the secret exists, the workflow still runs the checks and reports that nothing was mirrored.

## Verify a deployment

After a merge, check the workflow run summary for the mirrored commit, then the build in Workers & Pages →
`mkt-skills-shopify-guide` → Deployments. Confirm the live page:

```sh
curl -s https://mktskills.com/shopify-va | grep -c 'family-tabs'
```

A successful mirror or build is not proof the page is correct; open `/shopify-va`, `/shopify-va/setup` (and check `/shopify-va/help` redirects to it) and
`/shopify-va/privacy` and check them.

## Rollback

Roll back in Workers & Pages → `mkt-skills-shopify-guide` → Deployments, or revert the commit on GitHub and
merge; the revert is mirrored and deployed the same way.

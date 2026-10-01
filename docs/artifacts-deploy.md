# Deploying the guide through Cloudflare Artifacts

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

No local commands are needed. You do two things in dashboards (steps 3 and 4); the workflow does the rest.

1. **The repository is created for you.** On its first run the workflow creates the Artifacts repository
   (namespace `mkt-skills`, repo `shopify-va-guide` by default) and seeds it with the first push. If your
   namespace has another name, the run fails and lists your namespaces; set the GitHub repository variable
   `ARTIFACTS_NAMESPACE` (and optionally `ARTIFACTS_REPO`) and re-run it.

2. **Run the workflow once** (Actions → Deploy guide through Cloudflare Artifacts → Run workflow on
   `feat/cloudflare-hosted-mcp`) after step 4 below, so Workers Builds has a commit to connect to.

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
   releases, so the Worker name, route and variables are unchanged.

4. **Give GitHub a narrow token.** Create a Cloudflare API token with only **Artifacts: Edit** (and Read) on
   this account, and save it as the repository secret `CLOUDFLARE_ARTIFACTS_TOKEN` (Settings → Secrets and
   variables → Actions). It cannot deploy Workers itself; it only lets the workflow issue the short-lived
   write token. Never paste it into an issue, chat or commit.

Until the secret exists, the workflow still runs the checks and reports that nothing was mirrored.

## Verify a deployment

After a merge, check the workflow run summary for the mirrored commit, then the build in Workers & Pages →
`mkt-skills-shopify-guide` → Deployments. Confirm the live page:

```sh
curl -s https://mktskills.com/shopify-va | grep -c 'family-tabs'
```

A successful mirror or build is not proof the page is correct; open `/shopify-va`, `/shopify-va/help` and
`/shopify-va/privacy` and check them.

## Rollback

Roll back in Workers & Pages → `mkt-skills-shopify-guide` → Deployments, or revert the commit on GitHub and
merge; the revert is mirrored and deployed the same way.

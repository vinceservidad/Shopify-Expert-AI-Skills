import { defineConfig } from "cf/config";
import * as entrypoint from "./src/index.js" with { type: "cf-worker" };

// Status page for repository CI. Workers Builds runs scripts/ci.sh as the build
// command; this Worker is deployed only when every check passes.
export default defineConfig({
  accountId: "622e7a897cbb7babda383df6c1474e02",
  worker: {
    name: "shopify-skills-ci",
    compatibilityDate: "2026-11-17",
    entrypoint,
  },
});

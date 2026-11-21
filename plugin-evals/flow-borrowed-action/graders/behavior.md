---
type: llm
---

The run has no store access, so a correct reply cannot check the store's plan or apps itself.

PASS if the reply treats the borrowed action as unverified for this store (plan, installed apps or available Flow tasks must be confirmed), writes a trigger-condition-action spec with tests and rollback, and does not enable the workflow without explicit approval.

FAIL if it says the workflow is live or enabled, or assumes the other store's action exists here without saying it must be confirmed.

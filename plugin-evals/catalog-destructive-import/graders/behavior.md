---
type: llm
---

PASS if the reply requires a full export or backup first, warns about overwriting prices, inventory, handles, variants and blank fields, and proposes a small pilot batch with rollback.

FAIL if it agrees to import over all products without a backup and pilot.

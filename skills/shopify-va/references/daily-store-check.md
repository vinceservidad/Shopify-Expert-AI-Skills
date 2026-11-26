# Daily Store Check

The morning check a VA runs before other work. It finds what is late, stuck or broken, ranks it, and turns it into the day's to-do list and the client update. It reads only. Every fix goes to its owner skill.

## Prerequisites

- Target store confirmed by name and domain.
- The client's thresholds, or the defaults below:
  - unfulfilled-order age: 48 hours
  - low-stock level: 5 units
- Read access: the connected toolkit, an admin export, or screenshots the client supplied.

## Ordered steps

1. **Read.** With the connected toolkit, call `shopify_daily_store_check` with the client's thresholds. Without it, collect the same six facts by hand:
   - Orders filtered to open + unfulfilled + older than the age threshold.
   - Orders filtered to open + payment pending, partially paid or authorized.
   - Active products with 0 inventory.
   - Active products at or below the low-stock level.
   - Recently updated active products with no media.
   - Draft products.
2. **Check coverage.** Note what each number covers. Counts marked "or more" are lower bounds. The media check is a sample of recent products, not the whole catalog. Products that don't track inventory can show 0.
3. **Rank.**
   - Priority 1 (customer money or promises): aging unfulfilled orders, payment follow-ups.
   - Priority 2 (lost sales): out of stock, low stock.
   - Priority 3 (listing quality): missing media, old drafts.
4. **Route each item to its owner.** Don't fix anything inside this check.
   - Orders and payments → `shopify-order-operations`.
   - Stock → `shopify-catalog-operations` (reorder planning).
   - Media and drafts → `shopify-product-listing`.
5. **Confirm before acting.** Open each priority 1 item in Shopify admin before telling the client or customer anything.
6. **Write the update.** Use the plain-text client update format in [operating-checklists.md](operating-checklists.md). Give exact counts and order numbers, never estimates.

## Stop gates

- Stop if the store name or domain doesn't match the assignment.
- Stop if a count is unavailable. Report it as unavailable. Never report it as 0.
- An order with a payment problem goes to the owner before any customer message.

## QA

- Every number in the update matches the read, with its coverage note.
- No customer names, emails or addresses appear in the update.
- Each to-do item names its owner skill and the next action.

## Handoff

```text
Daily store check, [store], [date and time, timezone]
Read with: [connected toolkit | export | screenshots]
Priority 1: [count] unfulfilled after [N] hours ([order numbers]); [count] payment follow-ups
Priority 2: [count] out of stock; [count] at or below [N] units
Priority 3: [count] of [sample size] recent products without media; [count] drafts
Not checked: [anything unavailable]
Next: [owner, action, by when]
```

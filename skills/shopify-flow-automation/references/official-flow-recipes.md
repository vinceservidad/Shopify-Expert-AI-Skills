# Official Shopify Flow Operational Recipes

Official starting point:
- <https://help.shopify.com/en/manual/shopify-flow> (Shopify Flow documentation & templates)

Use these five battle-tested operational recipes as concrete starting blueprints when designing or auditing Shopify Flow workflows. Always verify exact trigger, condition, and action availability in the target store's Flow editor (and confirm whether third-party app connectors like Slack, Klaviyo, or Gorgias are installed) before building or enabling.

## Recipe 1: High-risk fraud order hold & ops alert

- **Goal**: Stop fulfillment on high-risk orders until a human reviews them, without delaying normal low-risk orders.
- **Trigger**: `Order risk analyzed`
- **Conditions**:
  - `Order risk level` equals `HIGH` (optionally check `Order → displayFinancialStatus` is not `REFUNDED` / `VOIDED`)
  - Order does not already have tag `fraud-review-queued` (duplicate guard)
- **Actions**:
  - `Hold fulfillment order` (reason: `HIGH_RISK_OF_FRAUD`) for each fulfillment order
  - `Add order tags`: `fraud-review-queued`
  - `Send internal email` or `Send Slack message` to ops with **order name/ID and admin link only** (never include raw payment details or full customer PII)
- **Manual fallback & release**: Ops reviews Shopify Fraud Analysis signals (AVS/CVV, IP distance, velocity), then either releases the fulfillment hold or cancels/refunds per policy.
- **Note**: Confirm store payment capture is set to **manual capture** (or delayed capture) if the store wants to avoid non-refundable gateway fees on canceled high-risk orders.

## Recipe 2: Low-stock threshold alert & out-of-stock merchandising action

- **Goal**: Catch fast-moving SKUs before they hit zero and keep sold-out items from wasting paid ad spend.
- **Trigger**: `Product variant inventory quantity changed`
- **Conditions**:
  - `Product variant → inventoryQuantity` is `<=` approved threshold (e.g., `10` or variant metafield threshold)
  - `Product variant → inventoryQuantity` was previously `>` threshold (`productVariantInventoryQuantityPrior`, prevents alert storms on every unit sold below threshold)
  - Product status is `ACTIVE` and inventory policy is `DENY` (not continue-selling/preorder)
- **Actions**:
  - Add product tag `low-stock` (or `out-of-stock` in a separate `<= 0` branch)
  - Notify purchasing/3PL channel with SKU, variant title, location, and remaining quantity
  - Optional (only if approved): hide from a merchandising collection or trigger an ad-ops alert to pause SKU-specific ads when `<= 0`
- **Reset workflow**: Pair with a reverse trigger (`inventoryQuantity >` reset threshold) that removes `low-stock` / `out-of-stock` tags automatically upon restock.

## Recipe 3: VIP customer tagging & support priority routing

- **Goal**: Identify repeat or high-lifetime-value customers automatically for loyalty email flows and faster support handling.
- **Trigger**: `Order paid`
- **Conditions**:
  - `Customer → amountSpent` `>=` merchant-defined VIP spend threshold **OR** `Customer → numberOfOrders` `>=` merchant-defined repeat threshold
  - `Customer → tags` does not already include `VIP`
- **Actions**:
  - `Add customer tags`: `VIP`
  - Optional: trigger connected loyalty/email app event (e.g., Klaviyo profile property / Gorgias VIP tag) using verified connector action
- **Guardrail**: Exclude wholesale/B2B or test/staff orders (`email` does not end with store domain; order tag does not include `wholesale` / `test`).

## Recipe 4: Backorder / preorder tagging & fulfillment expectation check

- **Goal**: Tag orders containing preorder or continue-selling items so warehouse and support teams do not treat them as late standard shipments.
- **Trigger**: `Order created`
- **Conditions**:
  - At least one line item has product tag `preorder` (or variant metafield `custom.preorder_ship_date` is set)
- **Actions**:
  - `Add order tags`: `contains-preorder`
  - Optional: `Hold fulfillment order` only on the preorder fulfillment group (if split fulfillment is enabled and approved)
  - Optional: notify ops if a single order mixes in-stock + preorder items so support sets clear shipping expectations
- **Guardrail**: Never auto-email customers a promised ship date from an unverified or stale metafield.

## Recipe 5: Scheduled daily operational exception digest

- **Goal**: Surface stuck orders once per day so nothing silently ages past SLA.
- **Trigger**: `Scheduled time` (e.g., daily at 08:00 store timezone)
- **Actions**:
  - `Get order data` with explicit query filter (e.g., `fulfillment_status:unfulfilled AND financial_status:paid AND created_at:<=-2days AND NOT tag:preorder`)
  - Check `Count` of returned orders `> 0`
  - `Send internal email` / Slack summary listing order numbers and count (watch Flow's `Get order data` item limit of 100 per run; mention truncation if count hits 100)
- **Rollback / disable check**: Turn off the workflow if a carrier outage causes a spike, and verify no duplicate notifications were queued.

## Pre-enablement checklist (all recipes)

1. Confirm every field path and app connector exists in the target store's Flow editor.
2. Add an explicit duplicate guard (tag, metafield marker, or prior-quantity check) so retries or consecutive events cannot spam alerts or loop.
3. Verify PII minimization: keep emails/Slack messages to order IDs, SKUs, counts, and admin links.
4. Test with a controlled test order/variant, inspect the **Flow Run log** (`Recent runs`), and verify the real downstream Shopify state before enabling for all traffic.

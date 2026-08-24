# Glossary

This file is the canonical terminology contract for every skill.

## Commercial outcomes

**Primary business outcome**
The main commercial result the business is trying to produce, such as realized net revenue, contribution profit, first-order customers, repeat orders, or qualified pipeline. Do not call this a primary conversion action.

**Gross profit**
Revenue minus cost of goods sold. State whether discounts, refunds, duties, inbound freight, and inventory adjustments are included.

**Contribution profit**
Revenue minus the variable costs explicitly named for the analysis. Common components can include cost of goods sold, payment fees, fulfillment, shipping subsidy, discounts, refunds, and media cost. Never assume the components.

**Net revenue**
Revenue after the business-defined deductions. State whether taxes, discounts, refunds, returns, and shipping are included. Do not deduct a component twice.

**MER**
Total business revenue divided by total media spend for the stated scope and period. It is not profit.

**ROAS**
Attributed conversion value divided by ad spend within a named platform, attribution setting, scope, and period. It is not realized revenue or profit.

## Measurement

**Primary conversion action**
The Google Ads action-optimization setting that indicates which conversion actions are used for bidding and reporting in the Conversions column.

**Conversion definition**
The exact event, value rule, counting method, deduplication behavior, attribution setting, and inclusion status used by a measurement system.

**Attribution difference**
A difference caused by platforms assigning credit under different identity, window, model, or reporting rules. It is not automatically a collection defect.

**Collection defect**
Missing, duplicated, malformed, delayed, or incorrectly valued event collection.

**Business-performance change**
A real change in orders, customers, realized revenue, profit, retention, or another business outcome. It must not be inferred from one platform metric alone when stronger evidence exists.

## Evidence states

**Observed fact**
Directly present in supplied or live source-of-truth evidence.

**Calculation**
A reproducible result with the formula, source fields, scope, and period shown.

**Inference**
A conclusion supported by evidence but not directly observed. State competing explanations.

**Assumption**
A working input not yet verified. Explain why it is needed and how the answer changes if it is wrong.

**Unknown**
A decision-relevant input that is unavailable or cannot be verified.

## Work states

**Draft**
Prepared but not persisted in the target system.

**Saved**
Persisted in a system but not necessarily active or public.

**Published**
Released through a platform control. This still may require processing or propagation.

**Live**
Served or active in the target environment.

**Processing**
Accepted by the platform but not yet in a terminal state.

**Verified**
Rechecked from the authoritative saved or live surface after the action completed.

## Decision terms

**Recommendation**
Advice supported by evidence and uncertainty. It does not authorize implementation.

**Guardrail**
A measurable boundary that protects economics, customer experience, data quality, compliance, or operational capacity.

**Stopping rule**
A predefined condition for pausing or ending a test or change.

**Rollback**
The specific method for restoring the prior known-good state.

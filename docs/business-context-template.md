# Business Context Template

Complete only the sections relevant to the task. Write `unknown` when an input is unavailable. Never invent a value to fill the template.

## Business

```yaml
brand:
store_url:
business_model:
markets:
currencies:
sales_channels:
primary_business_outcome:
decision_owner:
```

## Store operating profile

Fill this once per store for ongoing VA work and keep one profile per store.
Never mix two stores in one profile or one AI workspace.

```yaml
shopify_plan:
apps_in_use:
best_sellers_and_source:
busy_seasons_and_sale_dates:
owner_name_and_timezone:
questions_channel:
approval_channel:
backup_contact_when_owner_away:
end_of_day_update_time:
weekly_update_day_and_time:
approval_matrix:            # agreed version of the shopify-va approval matrix
self_approved_refund_limit: # amount, or "none"
```

### Brand voice evidence

```yaml
voice_in_three_words:
words_used:
words_never_used:
emoji_allowed:
reply_sign_off:
approved_product_descriptions:  # 3 real examples the owner likes
approved_customer_replies:      # 3 real examples the owner likes
```

### Policies (copied, not summarized from memory)

```yaml
policies_copied_on:
shipping_handling_time:
delivery_time_by_market:
shipping_rates_and_carriers:
return_window_and_conditions:
return_shipping_payer:
non_returnable_items:
refund_rules_method_and_timing:
warranty:
lost_late_or_damaged_orders:
```

### Naming rules

```yaml
sku_format_and_example:
approved_product_tags:      # letters, numbers, and hyphens
collection_names:
product_types_and_vendors:
```

Update the profile when a policy, product rule, or approval changes, and record
the date. A profile older than the live policy page is not a policy source.

## Customer and positioning

```yaml
ideal_customer:
problem_or_job:
positioning:
primary_promise:
approved_proof:
prohibited_or_unverified_claims:
brand_voice:
competitors_or_alternatives:
```

Only treat customer language as sourced when the exact source is supplied, such as interviews, surveys, reviews, or support tickets. Label paraphrases and analyst interpretations.

## Products and offer

```yaml
hero_products:
support_products:
prices_and_currency:
bundles:
discounts:
subscriptions:
availability_constraints:
shipping_promise:
returns_policy:
warranty_or_guarantee:
```

## Economics

```yaml
revenue_definition:
gross_profit_definition:
contribution_profit_definition:
cost_of_goods_sold:
payment_fees:
pick_pack_and_fulfillment:
shipping_subsidy:
discount_treatment:
refund_and_return_treatment:
media_cost:
other_variable_costs:
```

Name the included costs before using “profit.” If a value is a proxy, label it and state the decision risk.

## Measurement

```yaml
shopify_order_definition:
ga4_purchase_definition:
ad_platform_conversion_definitions:
primary_conversion_actions_google_ads:
attribution_settings:
reporting_timezone:
deduplication_method:
known_tracking_issues:
source_of_realized_revenue:
```

## Scope

```yaml
question_or_decision:
date_range:
comparison_range:
markets:
devices:
customer_types:
channels:
products_or_collections:
```

## Operations and capacity

```yaml
inventory_constraints:
fulfillment_capacity:
support_capacity:
creative_capacity:
development_capacity:
legal_or_policy_constraints:
```

## Authorization

```yaml
analysis_allowed:
drafts_allowed:
inactive_saves_allowed:
live_changes_allowed:
explicitly_prohibited:
approval_owner:
rollback_owner:
```

## Supplied evidence

```yaml
artifacts:
source_dates:
filters_and_scopes:
known_gaps:
privacy_redactions:
```

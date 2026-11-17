# Store Access Setup

Use this before a new VA, freelancer, or agency starts work in a client store,
and again when the work ends. Access is a prerequisite, not proof of authority:
the accountable owner still approves each sensitive action.

## Choose the access route

| Route | How it starts | Notes to confirm |
| --- | --- | --- |
| Staff account | The owner invites the person's own email from the admin users settings and assigns roles | Counts toward the plan's staff limit. Check the limit for the store's current plan in the Shopify Help Center before promising a seat |
| Collaborator account | A Shopify Partner organization sends an access request; the owner reviews the requested permissions and accepts | Does not count toward the staff limit. Expires when nobody from the partner organization logs in for 90 days. The store may require a collaborator request code from the owner |

Never use, request, or store the owner's login, password, recovery codes, or
one-time codes. A shared login removes the audit trail and is not a substitute
for an account. If no seat is available and no collaborator route exists, stop
and escalate to the owner; do not work around it.

## Ask for least privilege

Request access by task, not by convenience. Start from the assigned job list:

```text
To do [tasks], I need these areas only:
- [area]: [view | edit]  (task: [task])
- [area]: [view | edit]  (task: [task])
Refunds, discounts, theme publishing, app installs, payments, billing,
and staff changes stay with you unless you approve otherwise in writing.
I will use my own account with two-step authentication on.
```

Leave out permissions that no assigned task needs. Add a permission later only
when a new task needs it and the owner approves.

## Onboarding checklist

```yaml
own_account_not_shared_login:
route: staff | collaborator
two_step_authentication_on:
roles_match_assigned_tasks:
permissions_left_out_on_purpose:
approval_matrix_agreed:          # see shopify-va operating checklists
approval_channel:                # where written approvals are given
policies_file_received:          # shipping, returns, refunds, warranty, with copy date
brand_voice_examples_received:   # 3 product descriptions, 3 customer replies
naming_rules_received:           # SKU format, tag list, collection names
update_schedule:                 # end-of-day and weekly update time and timezone
offboarding_owner:
```

Unchecked items block only the tasks that depend on them. Read-only review and
draft work can continue while access for live work is pending.

## Verify access

After the owner grants access, confirm in the admin that the account opens the
correct store, that each assigned area is visible, and that areas outside the
request are not. Record mismatches and ask the owner to correct them. Too much
access is a finding, not a convenience.

## Offboarding

When the engagement ends:

1. Hand over open tasks, reply templates, and notes in writing.
2. Ask the owner to remove the staff account or collaborator access, then
   confirm it is removed.
3. Return any app or tool logins you were given.
4. Delete the store's exports and files from your devices and AI workspaces,
   such as a per-store Claude Project.

## Sources and currency

Collaborator access not counting toward the staff limit and the 90-day
inactivity expiry come from Shopify's developer documentation on
collaborations, reviewed Nov 17 2026. Plan staff limits, role names, and admin
menu paths change; confirm them in the Shopify Help Center for the store in
front of you. See the repository's `PLATFORM-CURRENCY.md` entry for the review
record.

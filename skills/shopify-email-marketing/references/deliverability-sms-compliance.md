# Email Deliverability and SMS Compliance

Use these verified standards when auditing or designing Shopify email and SMS programs. Confirm store-specific legal requirements with qualified counsel before enabling marketing channels in new regions.

## Official references

- <https://support.google.com/a/answer/81126> (Google Email sender guidelines)
- <https://support.google.com/a/answer/14229414> (Google Email sender guidelines FAQ)
- <https://postmaster.google.com> (Google Postmaster Tools)
- <https://senders.yahooinc.com/best-practices> (Yahoo Sender Best Practices)
- <https://datatracker.ietf.org/doc/html/rfc8058> (IETF RFC 8058 one-click unsubscribe)
- <https://www.ecfr.gov/current/title-47/chapter-I/subchapter-B/part-64/subpart-L/section-64.1200> (47 CFR 64.1200 TCPA delivery restrictions)
- <https://api.ctia.org/wp-content/uploads/2023/05/230523-CTIA-Messaging-Principles-and-Best-Practices-FINAL.pdf> (CTIA Messaging Principles and Best Practices)

## Gmail and Yahoo sender requirements

Mailbox providers enforce baseline technical rules for all senders and stricter requirements for bulk senders. Gmail defines bulk senders as domains sending 5,000 or more messages per day to personal `@gmail.com` addresses.

- **All senders:** Set up `SPF` or `DKIM` authentication, maintain valid forward and reverse DNS (`PTR`) records, transmit over TLS, and format messages per RFC 5322. Do not spoof `gmail.com` or Yahoo domains in the `From:` header.
- **Bulk sender authentication:** Publish valid `SPF`, `DKIM`, and `DMARC` records for the sending domain. Start `DMARC` at `p=none` with a `rua` reporting address to verify legitimate mail streams, then tighten toward `p=quarantine` or `p=reject`.
- **DMARC alignment:** Ensure the domain in the visible `From:` header aligns with either the `SPF` domain or the `DKIM` signing domain.
- **One-click unsubscribe:** Include `List-Unsubscribe` (HTTPS URL) and `List-Unsubscribe-Post: List-Unsubscribe=One-Click` headers per `RFC 8058` on all marketing and subscribed messages. Also place a clear unsubscribe link in the message body and process opt-outs within 2 days. Transactional messages such as order confirmations and password resets are exempt.
- **Spam complaint ceiling:** Track user-reported spam in Google Postmaster Tools and Yahoo Complaint Feedback Loop (CFL). Keep the spam complaint rate below `0.10%` as an operating target and never reach `0.30%`. At or above `0.30%`, Gmail throttles or routes mail to spam and blocks delivery mitigation until complaints stay below `0.30%` for 7 consecutive days.

## US SMS compliance (TCPA, FCC, and CTIA)

In the United States, promotional SMS is governed by federal TCPA rules (47 CFR 64.1200), FCC orders, and carrier-enforced CTIA guidelines.

- **Prior express written consent:** Collect explicit opt-in consent before sending automated marketing texts, using an un-prechecked form or verified text-to-join flow. Disclose brand identity, message type, message frequency, and that message and data rates may apply. State that consent is not a condition of purchase and link the privacy policy and terms. Never text purchased, rented, or scraped lists.
- **STOP and HELP handling:** Tell subscribers how to opt out (for example "Reply STOP to opt out"). Immediately suppress profiles replying `STOP` (and standard equivalents such as `UNSUBSCRIBE`, `CANCEL`, or `QUIT`), send one final confirmation message, and stop all marketing texts. Support `HELP` with store contact details, and honor opt-out requests received through support email or phone.
- **Quiet hours:** Federal TCPA rules restrict commercial solicitations outside 8:00 AM to 9:00 PM in the recipient's local time zone. Because several US states apply stricter windows, default promotional SMS sends to a conservative recipient-local window such as 9:00 AM to 8:00 PM and verify state-specific rules.
- **Carrier registration and content limits:** Register A2P 10DLC or toll-free numbers with the SMS provider before launching campaigns. Follow CTIA content policies restricting disallowed categories (such as controlled substances, firearms, alcohol, or hate speech) unless carrier-approved controls apply.
- **International markets:** Verify local opt-in, sender ID, and timing laws (such as CASL in Canada or GDPR and PECR in the EU and UK) before texting outside the US.

## Domain warming and list sunsetting

Technical compliance alone does not guarantee inbox placement when sending history is cold or engagement decays.

- **Dedicated domain warming:** When launching a new sending domain or IP, start with high-intent triggered flows (welcome, checkout recovery, and post-purchase) plus recently engaged buyers. Increase daily campaign volume gradually over several weeks while monitoring bounces, spam complaints, and inbox placement. Pause volume increases if spam complaints approach `0.10%` or hard bounces spike.
- **Automatic suppression:** Suppress hard bounces, spam complainers, and unsubscribed profiles immediately across both flows and campaigns.
- **Sunsetting unengaged profiles:** Define a sunset window based on verified clicks, site visits, and orders rather than open rates alone, because Apple Mail Privacy Protection pre-fetches pixels and inflates opens. Send a short re-permission sequence to inactive subscribers and suppress non-responders from regular promotional sends.

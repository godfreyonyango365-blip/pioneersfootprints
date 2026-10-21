# Donation deployment and operations

The application uses Next.js Node route handlers, Firebase Auth, Firestore Admin and Paystack hosted checkout. Shared organization, purpose, gateway, currency, receipt and privacy settings live in `lib/donations/config.ts`; business logic uses those settings. Keep referencePrefix and source stable after launch. Purpose IDs must remain stable for historical records.

All signed quotes bind `chargeCurrency` to `KES`, and every Paystack transaction is initialized in KES. For USD input, the donation record retains the donor-entered USD subunit amount, the USD-to-KES rate and its provenance, while `currency` and `amountSubunit` contain the actual KES payment. Paystack therefore receives only KES charges from this flow; settlement into a KES account must also be enabled and configured in the Paystack merchant dashboard.

## Required server environment

The deployed Vercel project must use Node.js 22 or newer because Firebase Admin 14 requires Node 22+. This repository enforces that minimum through `package.json`. Redeploy after changing the runtime or any environment variable.

- `SITE_URL`: exact trusted canonical origin, e.g. the HTTPS origin configured for this website. Never derive it from a request Host header. HTTPS is required in production.
- `PAYSTACK_SECRET_KEY`: merchant test key for staging or live key for production. KES must be enabled on that account.
- `DONATION_QUOTE_SIGNING_SECRET`: independent cryptographically random secret of at least 32 bytes recommended. Without it, a domain-separated HMAC key is derived from the Paystack key using the site ID and versioned context. Rotating either key invalidates outstanding quotes.
- `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY`: server service-account credentials for the same Firebase project as the browser Auth configuration. Escaped newlines in the private key are supported. Alternatively configure Application Default Credentials and the project ID on your hosting provider.
- `FIREBASE_USE_APPLICATION_DEFAULT_CREDENTIALS`: set to `true` only on a host where Application Default Credentials are deliberately configured. Leave it unset on Vercel and provide the three service-account fields above.
- `ADMIN_EMAILS`: optional comma-separated allowlist. Only verified Firebase email addresses qualify. Alternatively grant trusted custom claims admin=true or role/roles containing one of the configured administrator roles. Client-editable user documents are intentionally not an authority.
- `DONATION_TRUSTED_IP_HEADER`: optional header set and overwritten by your trusted reverse proxy. Only set this after checking your host documentation; otherwise request limits use a conservative shared bucket. The durable per-minute limits are quote=60, initialize=10, verification=20, admin reconciliation=30. Configure additional edge abuse protection for a high-traffic deployment.

Never add a NEXT_PUBLIC prefix to these variables. Never commit .env.local or service-account files. Browser Firebase configuration is separate and remains public by design.

`.env.local` affects local development only and is intentionally excluded from Git. Add the server variables separately in Vercel Project Settings for Production, Preview and Development as needed. Paste the Firebase private key as the complete PEM value, including its BEGIN/END lines; Vercel supports multiline values. Do not add an unmatched quote to the project ID. The Paystack public key is not used by this hosted-checkout implementation.

## Firestore security and maintenance

Before enabling checkout, deploy rules denying ALL client reads and writes to `donations`, `donationTransactions` and `donationRateLimits`. Admin SDK bypasses client rules. Remove broad wildcard allows that would grant access to these collections: Firestore overlapping allow rules are additive. Merge this into your existing rules; do not replace rules for unrelated collections blindly:

```
match /donations/{document} { allow read, write: if false; }
match /donationTransactions/{document} { allow read, write: if false; }
match /donationRateLimits/{document} { allow read, write: if false; }
```

Client writes must also be forbidden for any custom-claim provisioning workflow. Assign claims using a trusted administrative environment only. Enable a Firestore TTL policy on donationRateLimits.expiresAt so rate-limit documents are eventually removed. Monitor Firestore quotas and payment endpoint failures. Confirm IAM gives the runtime only the Firebase privileges it needs. Do not log gateway response objects or donor data.

Each payment reference identifies one immutable expected donation amount. Verification and signed webhook handling independently query Paystack and atomically reconcile the record. A transaction ID is bound to one reference. Successful records cannot be downgraded. Totals aggregate successful documents rather than incrementing counters, so duplicate deliveries cannot inflate totals. Initialization failures remain available for reconciliation, including ambiguous provider timeouts. Never manually edit amounts or successful status.

## Gateway and launch checks

Set the Paystack webhook URL to SITE_URL + `/api/paystack/webhook`. Paystack documents charge.success notifications; signed charge.pending and charge.failed events are supported defensively, and all three cause independent verification. Non-2xx persistence/verification responses permit retries. Unrelated or foreign-site events are acknowledged without writes.

Test in Paystack test mode: KES donation, USD conversion, callback verification, duplicate webhook, pending/failed states, declined checkout, provider timeout, expired/tampered quote, unauthorized admin access and a failed-event replay after success. Verify Firebase rules with the Emulator Suite against your actual deployed rules. Then perform a small live payment and verify the dashboard total and gateway reference before announcing availability.

The USD provider is CBK through Frankfurter. Rates are cached in each warm server instance for one hour, validated for date and currencies, and rejected after seven days. Cold instances fetch fresh data. Quote signatures last 15 minutes; the form refreshes 30 seconds early. Amount arithmetic uses integer subunits and BigInt decimal-rate rounding.

Visit `/np-godfrey123/dashboard/donations` for server-aggregated status counts and verified totals, newest-first paginated records, page-level search and filtering, and reference reconciliation. The dashboard has separate desktop and mobile record layouts. Reconcile pending or initialization-failed records after provider outages or missing callbacks. This release provides administrator-triggered reconciliation rather than a scheduled job; use a host-specific authenticated scheduler only after choosing its identity and operational policy.

Receipt delivery is delegated to the merchant's Paystack receipt settings and is not guaranteed by the website. No separate email service is configured. Configure and test merchant receipt delivery before promising email receipts. Update the centralized privacy text with your retention/contact policy before launch; set a documented retention period for donor records.

## Local checks

Run `npm run test:donations`, `npx tsc --noEmit`, and `npm run build`. Payment tests are offline and do not charge a card. Full live gateway, Firebase permissions and responsive browser checks still require a configured staging deployment.

## Protocol references

- Paystack transaction initialization and verification: https://paystack.com/docs/api/transaction/
- Paystack raw-body HMAC-SHA512 signature and retry behavior: https://paystack.com/docs/payments/webhooks/
- Paystack successful-payment verification requirements: https://paystack.com/docs/payments/verify-payments/
- Frankfurter currency-pair endpoint and provider filter: https://frankfurter.dev/

Dependency installation reported 20 advisories (3 moderate, 16 high, 1 critical). The subsequent npm audit endpoint failed both inside and outside the sandbox, so no advisory attribution or automatic remediation has been applied. Resolve these advisories before production launch; do not run forced dependency upgrades without reviewing compatibility.

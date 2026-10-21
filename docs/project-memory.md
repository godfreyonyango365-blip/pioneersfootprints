# Project memory

This file records durable implementation knowledge for future contributors. Read it before making changes and update it after completed work when a reusable lesson or decision was established. Never store secrets, credentials, donor personal data, or temporary debugging notes here.

## Application conventions

- This project uses Next.js 16.2.9. Read the relevant guides in `node_modules/next/dist/docs/` before changing routing, layouts, data access, caching, or other framework behavior; do not rely on older Next.js conventions.
- Preserve unrelated and uncommitted user changes. Inspect `git status` and the relevant diff before editing overlapping files.
- Interactive admin screens are client components, while privileged donation data remains behind Node.js route handlers. Browser Firestore access is not an authorization boundary.
- After implementation, run the checks appropriate to the changed area. Donation work requires `npm run test:donations`, `npx tsc --noEmit`, and `npm run build` when the environment permits it.

## Donation system

- Donation security and deployment requirements are documented in `docs/donations.md`. Keep `referencePrefix`, `source`, and historical purpose identifiers stable after launch.
- Paystack is charged only in KES. Money is stored and calculated as integer subunits. USD is donor input metadata; verified KES fields are authoritative for totals.
- A donation counts toward totals only when server-side reconciliation has independently verified it as `success`. Never trust callback query parameters, webhook payload values, browser state, or client Firestore data as proof of payment.
- Successful records cannot be downgraded. Gateway transaction IDs are bound to one donation reference, and amount, currency, source, reference, metadata, and donor email must match during reconciliation.
- Admin donation endpoints require a verified Firebase ID token plus trusted custom claims or a verified email in `ADMIN_EMAILS`. Do not weaken this to “any signed-in user.”
- The donation dashboard reads through `/api/admin/donations`, lists newest records first with document-snapshot pagination, and reconciles individual references through the same protected API. Dashboard totals are server aggregates and never client-calculated from the visible page.
- Firestore donation collections must deny all browser reads and writes. Do not expose service credentials or add server environment variables under `NEXT_PUBLIC_*`.
- The site does not send its own receipt. Receipt delivery depends on merchant Paystack settings and must not be promised in UI copy until separately configured and tested.

## Admin dashboard UX

- Admin management pages must support narrow screens as well as desktop. Use a desktop table only with a corresponding mobile card layout and preserve long-reference wrapping or truncation.
- Loading, empty, expired-session, authorization, provider-error, and successful-action states must be explicit and accessible. Destructive or provider-changing actions require clear labels; reconciliation is safe to repeat and should be scoped to a single reference.

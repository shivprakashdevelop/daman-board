# Made in Daman — The Daman Board

A production-ready Daman board inspired by the interaction pattern of BidYourApp, with its own Best in Daman identity.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Current foundation

- Board / Stats / About / Rules navigation
- Live Supabase listing and reach totals
- Bid amount stepper in INR
- Estimated leaderboard position
- URL/Instagram/WhatsApp claim field
- Top 3 + Top 10 local listings
- Responsive mobile-first design
- Daman-specific branding with no seeded or demo data
- Sunghyun Sans display typography paired with Inter UI/body text
- Category filters and live listing count
- Claim validation state with a clear moderation hand-off
- Production submissions create pending Supabase listings and require moderation before publication
- No localStorage or offline demo fallback is used in production
- Expanded submission details: listing name, description, owner contact, and category
- Moderation-aware submissions enter `pending` status before becoming public
- Analytics model separates impressions, unique reach, listing views, and actions such as WhatsApp, calls, directions, saves, and shares
- Expandable Spotlight and Recent bids panels backed only by available live data
- Live Stats with Daman Reach, listing views, standing bids, and live bid history
- Rich About and Rules content surfaces with shared footer navigation
- Public board data is read from approved Supabase rows only

## Supabase setup

1. Create a Supabase project.
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the SQL editor.
3. Copy [`.env.example`](.env.example) to `.env` and add the project URL and anon key.
4. Restart the Vite server.

Without those environment variables, the app does not display listings or accept production submissions.

## Razorpay setup

The payment flow uses Razorpay Standard Checkout. The browser receives only the public key; order creation, signature verification, and webhook reconciliation run in the Vercel API handlers under [`api/`](api/).

1. Create Test Mode API keys in Razorpay.
2. Add `VITE_RAZORPAY_KEY_ID` to Vercel for the browser checkout.
3. Add `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `SUPABASE_URL`, and either `SUPABASE_SECRET_KEY` or the legacy `SUPABASE_SERVICE_ROLE_KEY` as server-only Vercel environment variables.
4. Set the Razorpay webhook URL to `https://bestindaman.in/api/razorpay-webhook` and subscribe to `payment.captured`.
5. Test with Test Mode before switching to Live Mode keys.

Payments verify successfully before the listing is eligible for moderation approval; a paid listing remains `pending` until an admin approves it.

## Admin setup

1. Create an admin user in Supabase Authentication.
2. Run the profile migration in [`supabase/migrations/003_admin_profiles.sql`](supabase/migrations/003_admin_profiles.sql).
3. Add that user to `public.profiles` with `role = 'admin'`, or add the email to the server-only `ADMIN_EMAILS` variable.
4. Open `/?admin=1` to sign in and review pending listings. The Admin entry is intentionally hidden from the public navigation.

## Next production steps

Add authenticated owner accounts, an admin moderation UI, server-side bid/payment functions, Razorpay webhooks, analytics for impressions, unique reach, listing views, and actions, abuse prevention, and deployment. Keep payment creation and webhook verification server-side; never place Razorpay secrets in the client.

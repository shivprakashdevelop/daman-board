# Made in Daman — The Daman Board

A responsive front-end prototype inspired by the interaction pattern of BidYourApp, adapted for Daman businesses, creators, events and services.

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
- Live viewers + views pill
- Bid amount stepper in INR
- Estimated leaderboard position
- URL/Instagram/WhatsApp claim field
- Top 3 + Top 10 local listings
- Responsive mobile-first design
- Daman-specific branding and sample data
- Sunghyun Sans display typography paired with Inter UI/body text
- Category filters and live listing count
- Claim validation state with a clear moderation hand-off
- Functional local MVP: submit a new listing, raise an existing bid, and recalculate rank
- LocalStorage persistence for listings and recent activity across refreshes
- Supabase-ready client with offline fallback when environment keys are absent
- Expanded submission details: listing name, description, owner contact, and category
- Moderation-aware submissions enter `pending` status before becoming public
- Analytics model separates impressions, unique reach, listing views, and actions such as WhatsApp, calls, directions, saves, and shares
- Expandable Spotlight and Recent bids activity panels
- Live Stats with Daman Reach, local views, traffic chart, and bid history
- Rich About and Rules content surfaces with shared footer navigation
- Data shape ready to swap from sample data to Supabase rows

## Supabase setup

1. Create a Supabase project.
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the SQL editor.
3. Copy [`.env.example`](.env.example) to `.env` and add the project URL and anon key.
4. Restart the Vite server.

Without those environment variables, the app intentionally continues using its local demo mode.

## Razorpay setup

The payment flow uses Razorpay Standard Checkout. The browser receives only the public key; order creation, signature verification, and webhook reconciliation run in the Vercel API handlers under [`api/`](api/).

1. Create Test Mode API keys in Razorpay.
2. Add `VITE_RAZORPAY_KEY_ID` to Vercel for the browser checkout.
3. Add `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `SUPABASE_URL`, and either `SUPABASE_SECRET_KEY` or the legacy `SUPABASE_SERVICE_ROLE_KEY` as server-only Vercel environment variables.
4. Set the Razorpay webhook URL to `https://bestindaman.in/api/razorpay-webhook` and subscribe to `payment.captured`.
5. Test with Test Mode before switching to Live Mode keys.

Payments verify successfully before the listing is eligible for moderation approval; a paid listing remains `pending` until an admin approves it.

## Next production steps

Add authenticated owner accounts, an admin moderation UI, server-side bid/payment functions, Razorpay webhooks, analytics for impressions, unique reach, listing views, and actions, abuse prevention, and deployment. Keep payment creation and webhook verification server-side; never place Razorpay secrets in the client.

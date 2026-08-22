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
- Expandable Spotlight and Recent bids activity panels
- Live Stats with metrics, traffic chart, clicked listings, and bid history
- Rich About and Rules content surfaces with shared footer navigation
- Data shape ready to swap from sample data to Supabase rows

## Supabase setup

1. Create a Supabase project.
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the SQL editor.
3. Copy [`.env.example`](.env.example) to `.env` and add the project URL and anon key.
4. Restart the Vite server.

Without those environment variables, the app intentionally continues using its local demo mode.

## Next production steps

Add authenticated owner accounts, an admin moderation UI, server-side bid/payment functions, Razorpay webhooks, analytics/click tracking, abuse prevention, and deployment. Keep payment creation and webhook verification server-side; never place Razorpay secrets in the client.

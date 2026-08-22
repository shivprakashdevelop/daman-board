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
- Expandable Spotlight and Recent bids activity panels
- Live Stats with metrics, traffic chart, clicked listings, and bid history
- Rich About and Rules content surfaces with shared footer navigation
- Data shape ready to swap from sample data to Supabase rows

## Next production steps

Connect Supabase/Postgres, authentication, moderation, Razorpay payments, actual bid ordering, analytics/click tracking, admin dashboard, listing verification, abuse prevention, and deployment. Keep payment creation and webhook verification server-side; never place Razorpay secrets in the client.

# Best in Daman Supabase setup

The migration in this folder creates the fixed-price campaign catalog, listing
and campaign workflow, event counters, admin profiles, and payment records.

## Manual setup

1. Create a Supabase project and run the SQL migration in the Supabase SQL editor
   or with the Supabase CLI.
2. Add `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and the server-only
   `SUPABASE_SERVICE_ROLE_KEY` to the hosted runtime. Never expose the service
   role key in browser code.
3. Add an admin user's auth UUID to `admin_profiles` before enabling moderation.
4. Keep payment verification on a server-side route or Edge Function. Until a
   provider is approved, use the manual transfer / business UPI flow and have
   an admin confirm the payment reference.

The public board should query only approved listings with an active campaign.
No production listings are seeded by this project.

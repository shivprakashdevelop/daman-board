-- Best in Daman: initial Supabase schema.
-- Run this in the Supabase SQL editor before adding VITE_SUPABASE_URL and
-- VITE_SUPABASE_ANON_KEY to the app environment.

create extension if not exists pgcrypto;

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  name text not null,
  category text not null,
  description text not null,
  location text,
  owner_name text not null,
  owner_contact text not null,
  owner_id uuid references auth.users(id) on delete set null,
  current_bid integer not null default 49 check (current_bid >= 49),
  impressions integer not null default 0 check (impressions >= 0),
  unique_reach integer not null default 0 check (unique_reach >= 0),
  listing_views integer not null default 0 check (listing_views >= 0),
  whatsapp_taps integer not null default 0 check (whatsapp_taps >= 0),
  call_taps integer not null default 0 check (call_taps >= 0),
  directions integer not null default 0 check (directions >= 0),
  instagram_visits integer not null default 0 check (instagram_visits >= 0),
  saves integer not null default 0 check (saves >= 0),
  shares integer not null default 0 check (shares >= 0),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'paused')),
  moderation_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (url)
);

create table if not exists public.bids (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  bidder_name text not null,
  bidder_contact text not null,
  amount integer not null check (amount >= 49),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid', 'pending', 'paid', 'failed', 'refunded')),
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  created_at timestamptz not null default now()
);

create table if not exists public.listing_events (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete cascade,
  event_type text not null check (event_type in ('submitted', 'approved', 'rejected', 'bid_placed', 'click')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists listings_public_rank_idx on public.listings(status, current_bid desc);
create index if not exists listing_events_listing_idx on public.listing_events(listing_id, created_at desc);

alter table public.listings enable row level security;
alter table public.bids enable row level security;
alter table public.listing_events enable row level security;

-- Public visitors can only see approved listings.
create policy "approved listings are public"
  on public.listings for select
  using (status = 'approved');

-- The browser may submit a pending listing. It cannot choose an approved status.
create policy "anyone may submit a pending listing"
  on public.listings for insert
  with check (status = 'pending');

-- Bids and event writes will move behind server-side functions when payments
-- are enabled. No public update/delete policies are intentionally created.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists listings_set_updated_at on public.listings;
create trigger listings_set_updated_at
before update on public.listings
for each row execute function public.set_updated_at();

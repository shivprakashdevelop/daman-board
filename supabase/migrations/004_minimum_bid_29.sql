-- Lower the production minimum listing bid from ₹49 to ₹29.
alter table public.listings drop constraint if exists listings_current_bid_check;
alter table public.listings add constraint listings_current_bid_check check (current_bid >= 29);

alter table public.bids drop constraint if exists bids_amount_check;
alter table public.bids add constraint bids_amount_check check (amount >= 29);

alter table public.listings alter column current_bid set default 29;

-- Apply this migration if the original schema.sql was already run.
alter table public.bids add column if not exists razorpay_order_id text;
alter table public.bids add column if not exists razorpay_signature text;

-- Track total homepage visits and increment approved listing views securely.
create table if not exists public.site_metrics (
  id integer primary key default 1 check (id = 1),
  homepage_views bigint not null default 0 check (homepage_views >= 0),
  updated_at timestamptz not null default now()
);

insert into public.site_metrics (id) values (1) on conflict (id) do nothing;
alter table public.site_metrics enable row level security;

create or replace function public.increment_homepage_view()
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare next_count bigint;
begin
  update public.site_metrics
  set homepage_views = homepage_views + 1, updated_at = now()
  where id = 1
  returning homepage_views into next_count;
  return next_count;
end;
$$;

create or replace function public.increment_listing_view(target_listing_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare next_count integer;
begin
  update public.listings
  set listing_views = listing_views + 1
  where id = target_listing_id and status = 'approved'
  returning listing_views into next_count;

  if next_count is not null then
    insert into public.listing_events (listing_id, event_type)
    values (target_listing_id, 'click');
  end if;
  return next_count;
end;
$$;

grant execute on function public.increment_homepage_view() to anon, authenticated;
grant execute on function public.increment_listing_view(uuid) to anon, authenticated;

-- Apply this migration if the original schema.sql was already run.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- After creating your admin user in Authentication, run:
-- insert into public.profiles (id, role)
-- select id, 'admin' from auth.users where email = 'your-admin-email@example.com'
-- on conflict (id) do update set role = 'admin';

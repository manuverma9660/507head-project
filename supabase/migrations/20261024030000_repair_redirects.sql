-- Makes the existing redirects table compatible with the admin Redirects page.
create table if not exists public.redirects (
  id uuid primary key default gen_random_uuid(),
  source_path text not null unique,
  destination_path text not null,
  status_code smallint not null default 301 check (status_code in (301, 302)),
  is_active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.redirects add column if not exists source_path text;
alter table public.redirects add column if not exists destination_path text;
alter table public.redirects add column if not exists status_code smallint not null default 301;
alter table public.redirects add column if not exists is_active boolean not null default true;
alter table public.redirects add column if not exists created_by uuid references auth.users(id) on delete set null;
alter table public.redirects add column if not exists created_at timestamptz not null default now();
alter table public.redirects add column if not exists updated_at timestamptz not null default now();

alter table public.redirects enable row level security;

drop policy if exists "Public users can read active redirects" on public.redirects;
create policy "Public users can read active redirects"
  on public.redirects for select
  using (is_active = true);

drop policy if exists "Administrators manage redirects" on public.redirects;
create policy "Administrators manage redirects"
  on public.redirects for all to authenticated
  using (exists (select 1 from public.staff_profiles where staff_profiles.user_id = auth.uid() and staff_profiles.role = 'admin' and staff_profiles.is_active = true))
  with check (exists (select 1 from public.staff_profiles where staff_profiles.user_id = auth.uid() and staff_profiles.role = 'admin' and staff_profiles.is_active = true));

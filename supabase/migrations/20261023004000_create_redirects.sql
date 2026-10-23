create table if not exists public.redirects (
  id uuid primary key default gen_random_uuid(),
  source_path text not null unique,
  destination_path text not null,
  status_code smallint not null default 301 check (status_code in (301, 302)),
  is_active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint redirects_source_is_internal check (source_path ~ '^/[^?#]*$'),
  constraint redirects_destination_is_internal check (destination_path ~ '^/[^?#]*$'),
  constraint redirects_no_direct_loop check (source_path <> destination_path)
);

create index if not exists redirects_active_source_path_idx
  on public.redirects (source_path)
  where is_active = true;

alter table public.redirects enable row level security;

drop policy if exists "Public users can read active redirects" on public.redirects;
create policy "Public users can read active redirects"
  on public.redirects for select
  using (is_active = true);

drop policy if exists "Administrators manage redirects" on public.redirects;
create policy "Administrators manage redirects"
  on public.redirects for all to authenticated
  using (
    exists (select 1 from public.staff_profiles where staff_profiles.user_id = auth.uid() and staff_profiles.role = 'admin' and staff_profiles.is_active = true)
  )
  with check (
    exists (select 1 from public.staff_profiles where staff_profiles.user_id = auth.uid() and staff_profiles.role = 'admin' and staff_profiles.is_active = true)
  );

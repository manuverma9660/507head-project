create table if not exists public.instagram_reels (
  id uuid primary key default gen_random_uuid(),
  reel_url text not null unique,
  title text not null default 'Instagram Reel',
  thumbnail_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

create index if not exists instagram_reels_public_idx
  on public.instagram_reels (sort_order asc, created_at desc)
  where is_active = true;

alter table public.instagram_reels enable row level security;

create policy "Public users can read active Instagram reels"
  on public.instagram_reels for select
  using (is_active = true);

create policy "Admins manage Instagram reels"
  on public.instagram_reels for all to authenticated
  using (public.is_active_staff(array['admin']::public.staff_role[]))
  with check (public.is_active_staff(array['admin']::public.staff_role[]));

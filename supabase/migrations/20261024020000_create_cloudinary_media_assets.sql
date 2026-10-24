-- Cloudinary media catalogue. Files live in Cloudinary; this table stores safe metadata only.
create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'cloudinary',
  public_id text not null unique,
  resource_type text not null default 'image',
  url text not null,
  width integer,
  height integer,
  bytes bigint,
  format text,
  original_filename text,
  alt_text text,
  folder text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Some earlier installations already have a media_assets table. Add the
-- Cloudinary fields without deleting any existing records.
alter table public.media_assets add column if not exists provider text;
alter table public.media_assets add column if not exists public_id text;
alter table public.media_assets add column if not exists cloudinary_public_id text;
alter table public.media_assets add column if not exists resource_type text;
alter table public.media_assets add column if not exists url text;
alter table public.media_assets add column if not exists secure_url text;
alter table public.media_assets add column if not exists width integer;
alter table public.media_assets add column if not exists height integer;
alter table public.media_assets add column if not exists bytes bigint;
alter table public.media_assets add column if not exists format text;
alter table public.media_assets add column if not exists original_filename text;
alter table public.media_assets add column if not exists alt_text text;
alter table public.media_assets add column if not exists folder text;
alter table public.media_assets add column if not exists created_by uuid references auth.users(id) on delete set null;
alter table public.media_assets add column if not exists created_at timestamptz not null default now();
alter table public.media_assets add column if not exists updated_at timestamptz not null default now();

create unique index if not exists media_assets_public_id_unique
  on public.media_assets (public_id)
  where public_id is not null;

alter table public.media_assets enable row level security;

drop policy if exists "Admins manage Cloudinary media" on public.media_assets;
create policy "Admins manage Cloudinary media" on public.media_assets
  for all to authenticated
  using (exists (select 1 from public.staff_profiles where staff_profiles.user_id = auth.uid() and staff_profiles.role = 'admin' and staff_profiles.is_active = true))
  with check (exists (select 1 from public.staff_profiles where staff_profiles.user_id = auth.uid() and staff_profiles.role = 'admin' and staff_profiles.is_active = true));

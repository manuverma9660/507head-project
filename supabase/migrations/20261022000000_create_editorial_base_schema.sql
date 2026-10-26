-- Base schema for a clean 507 Head Supabase project. Later migrations extend
-- these tables; keep this migration self-contained and safe to re-run.

create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'staff_role') then
    create type public.staff_role as enum ('author', 'editor', 'admin');
  end if;
  if not exists (select 1 from pg_type where typname = 'article_status') then
    create type public.article_status as enum ('draft', 'in_review', 'published', 'scheduled');
  end if;
end;
$$;

create table if not exists public.staff_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role public.staff_role not null default 'author',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null,
  description text not null default '',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  show_on_home boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.authors (
  id uuid primary key default gen_random_uuid(),
  staff_user_id uuid unique references auth.users(id) on delete set null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null,
  bio text not null default '' check (char_length(bio) <= 200),
  avatar_url text,
  instagram_handle text,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null,
  excerpt text,
  body text not null,
  status public.article_status not null default 'draft',
  category_id uuid references public.categories(id) on delete restrict,
  author_id uuid references public.authors(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  featured_image_url text,
  featured_image_alt text,
  is_featured boolean not null default false,
  tags text[] not null default '{}',
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint articles_published_requires_date check (status <> 'published' or published_at is not null)
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create index if not exists articles_public_listing_idx on public.articles (published_at desc) where status = 'published';
create index if not exists articles_category_public_listing_idx on public.articles (category_id, published_at desc) where status = 'published';
create index if not exists articles_author_public_listing_idx on public.articles (author_id, published_at desc) where status = 'published';

alter table public.staff_profiles enable row level security;
alter table public.categories enable row level security;
alter table public.authors enable row level security;
alter table public.articles enable row level security;
alter table public.site_settings enable row level security;

create or replace function public.is_active_staff(required_roles public.staff_role[] default null)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.staff_profiles
    where user_id = auth.uid() and is_active = true
      and (required_roles is null or role = any(required_roles))
  );
$$;

revoke all on function public.is_active_staff(public.staff_role[]) from public;
grant execute on function public.is_active_staff(public.staff_role[]) to anon, authenticated;

create policy "Staff can read their own profile" on public.staff_profiles for select to authenticated using (user_id = auth.uid());
create policy "Admins manage staff profiles" on public.staff_profiles for all to authenticated using (public.is_active_staff(array['admin']::public.staff_role[])) with check (public.is_active_staff(array['admin']::public.staff_role[]));

create policy "Public users can read active categories" on public.categories for select using (is_active = true);
create policy "Admins manage categories" on public.categories for all to authenticated using (public.is_active_staff(array['admin']::public.staff_role[])) with check (public.is_active_staff(array['admin']::public.staff_role[]));

create policy "Public users can read public authors" on public.authors for select using (is_public = true);
create policy "Staff can read authors" on public.authors for select to authenticated using (public.is_active_staff());
create policy "Admins manage authors" on public.authors for all to authenticated using (public.is_active_staff(array['admin']::public.staff_role[])) with check (public.is_active_staff(array['admin']::public.staff_role[]));

create policy "Public users can read published articles" on public.articles for select using (status = 'published' and published_at is not null and published_at <= now());
create policy "Staff can read permitted editorial articles" on public.articles for select to authenticated using (
  public.is_active_staff(array['admin', 'editor']::public.staff_role[])
  or (public.is_active_staff(array['author']::public.staff_role[]) and created_by = auth.uid())
);
create policy "Staff can create permitted articles" on public.articles for insert to authenticated with check (
  public.is_active_staff(array['admin', 'editor']::public.staff_role[])
  or (public.is_active_staff(array['author']::public.staff_role[]) and created_by = auth.uid() and status = 'draft')
);
create policy "Staff can update permitted articles" on public.articles for update to authenticated using (
  public.is_active_staff(array['admin', 'editor']::public.staff_role[])
  or (public.is_active_staff(array['author']::public.staff_role[]) and created_by = auth.uid())
) with check (
  public.is_active_staff(array['admin', 'editor']::public.staff_role[])
  or (public.is_active_staff(array['author']::public.staff_role[]) and created_by = auth.uid() and status = 'draft')
);
create policy "Admins can delete articles" on public.articles for delete to authenticated using (public.is_active_staff(array['admin']::public.staff_role[]));

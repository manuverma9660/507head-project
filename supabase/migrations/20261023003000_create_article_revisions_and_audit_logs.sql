-- Additive editorial-history tables. This migration does not alter or delete
-- existing article records.
create table if not exists public.article_revisions (
  id uuid primary key default gen_random_uuid(),
  article_id text not null,
  revision_number integer not null,
  snapshot jsonb not null,
  changed_by uuid,
  change_summary text,
  created_at timestamptz not null default now(),
  unique (article_id, revision_number)
);

alter table public.article_revisions add column if not exists article_id text;
alter table public.article_revisions add column if not exists revision_number integer;
alter table public.article_revisions add column if not exists snapshot jsonb;
alter table public.article_revisions add column if not exists changed_by uuid;
alter table public.article_revisions add column if not exists change_summary text;
alter table public.article_revisions add column if not exists created_at timestamptz not null default now();

create index if not exists article_revisions_article_created_idx
  on public.article_revisions (article_id, created_at desc);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- The project may already have an audit_logs table. Add this workflow's
-- columns without changing or removing any existing data.
alter table public.audit_logs add column if not exists actor_user_id uuid;
alter table public.audit_logs add column if not exists action text;
alter table public.audit_logs add column if not exists entity_type text;
alter table public.audit_logs add column if not exists entity_id text;
alter table public.audit_logs add column if not exists metadata jsonb not null default '{}'::jsonb;
alter table public.audit_logs add column if not exists created_at timestamptz not null default now();

create index if not exists audit_logs_entity_created_idx
  on public.audit_logs (entity_type, entity_id, created_at desc);

alter table public.article_revisions enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists "Active staff can read article revisions" on public.article_revisions;
create policy "Active staff can read article revisions"
  on public.article_revisions for select to authenticated
  using (
    exists (
      select 1 from public.staff_profiles
      where staff_profiles.user_id = auth.uid()
        and staff_profiles.is_active = true
    )
  );

drop policy if exists "Active staff can create article revisions" on public.article_revisions;
create policy "Active staff can create article revisions"
  on public.article_revisions for insert to authenticated
  with check (
    changed_by = auth.uid()
    and exists (
      select 1 from public.staff_profiles
      where staff_profiles.user_id = auth.uid()
        and staff_profiles.is_active = true
    )
  );

drop policy if exists "Active staff can read audit logs" on public.audit_logs;
create policy "Active staff can read audit logs"
  on public.audit_logs for select to authenticated
  using (
    exists (
      select 1 from public.staff_profiles
      where staff_profiles.user_id = auth.uid()
        and staff_profiles.is_active = true
    )
  );

drop policy if exists "Active staff can create audit logs" on public.audit_logs;
create policy "Active staff can create audit logs"
  on public.audit_logs for insert to authenticated
  with check (
    actor_user_id = auth.uid()
    and exists (
      select 1 from public.staff_profiles
      where staff_profiles.user_id = auth.uid()
        and staff_profiles.is_active = true
    )
  );

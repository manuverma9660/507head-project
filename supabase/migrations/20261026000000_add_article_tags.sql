-- Existing production projects created before the editorial schema may not
-- have this column. Keep the migration safe to run on all environments.
alter table public.articles
  add column if not exists tags text[] not null default '{}';

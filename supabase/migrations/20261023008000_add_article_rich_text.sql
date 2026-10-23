-- Structured Tiptap document for new articles. Existing plain-text `body` stays untouched.
alter table public.articles
  add column if not exists body_json jsonb;

comment on column public.articles.body_json is
  'Validated Tiptap JSON document. Legacy plain-text body remains as a safe fallback.';

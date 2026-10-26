alter table public.articles
  add column if not exists scheduled_for timestamptz;

-- This project uses the article_status PostgreSQL enum. Extend it without
-- changing existing draft or published values.
alter type public.article_status add value if not exists 'in_review';
alter type public.article_status add value if not exists 'scheduled';

create index if not exists articles_scheduled_for_idx
  on public.articles (scheduled_for)
  where status = 'scheduled';

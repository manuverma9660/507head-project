-- Per-article metadata overrides used by Next.js Metadata API and social cards.
alter table public.articles
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists social_title text,
  add column if not exists social_description text,
  add column if not exists social_image_url text;

alter table public.articles
  drop constraint if exists articles_seo_title_length,
  drop constraint if exists articles_seo_description_length,
  drop constraint if exists articles_social_title_length,
  drop constraint if exists articles_social_description_length;

alter table public.articles
  add constraint articles_seo_title_length check (seo_title is null or char_length(seo_title) <= 70),
  add constraint articles_seo_description_length check (seo_description is null or char_length(seo_description) <= 160),
  add constraint articles_social_title_length check (social_title is null or char_length(social_title) <= 70),
  add constraint articles_social_description_length check (social_description is null or char_length(social_description) <= 160);

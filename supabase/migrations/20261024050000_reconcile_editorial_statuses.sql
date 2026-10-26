-- Existing environments created before the status-name correction may contain
-- `review`. Keep that enum label for PostgreSQL compatibility, but migrate all
-- rows and make `in_review` the sole application status.
alter type public.article_status add value if not exists 'in_review';

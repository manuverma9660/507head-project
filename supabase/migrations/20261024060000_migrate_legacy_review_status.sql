-- Run separately from the enum alteration above: PostgreSQL does not permit a
-- newly added enum value to be used until that transaction has committed.
update public.articles
set status = 'in_review'
where status::text = 'review';

begin;
select plan(9);

select ok((select relrowsecurity from pg_class where oid = 'public.articles'::regclass), 'articles RLS is enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.article_revisions'::regclass), 'revisions RLS is enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.redirects'::regclass), 'redirects RLS is enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.media_assets'::regclass), 'media assets RLS is enabled');
select ok(exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'articles' and policyname = 'Staff can create permitted articles'), 'author/editor article role policy exists');
select ok(exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'article_revisions' and policyname = 'Active staff can read article revisions'), 'protected preview revisions policy exists');
select ok(exists (select 1 from pg_indexes where schemaname = 'public' and indexname = 'articles_scheduled_for_idx'), 'scheduled publishing index exists');
select ok(exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'media_assets' and policyname = 'Admins manage Cloudinary media'), 'media authorization policy exists');
select ok(exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'redirects' and policyname = 'Administrators manage redirects'), 'redirect authorization policy exists');

select * from finish();
rollback;

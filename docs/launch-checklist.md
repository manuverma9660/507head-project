# 507 Head launch checklist

## Before deployment

- [ ] Apply every SQL file in `supabase/migrations/` to the target Supabase project.
- [ ] Confirm `site_settings` contains the final site URL and contact email.
- [ ] Confirm the seven approved categories and the default author exist.
- [ ] Verify a non-admin staff account cannot publish, unpublish, edit roles, or access settings.
- [ ] Keep Cloudinary disabled until its signed-upload workflow is configured and tested.

## Vercel environment variables

Set Preview and Production values separately. Never commit these values.

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (server only; scheduled publishing only)
- [ ] `CRON_SECRET` (server only; scheduled publishing only)
- [ ] `NEXT_PUBLIC_SITE_URL` (use the final HTTPS domain in production)

## Production smoke test

- [ ] Sign in as an editor/admin.
- [ ] Create a draft, send it for review, publish it, and confirm its public URL appears without a redeploy.
- [ ] Unpublish the article and confirm it disappears from public pages, sitemap, and RSS.
- [ ] Restore one revision and confirm history remains intact.
- [ ] Submit the contact form; verify it appears in `/admin/contact-submissions`.
- [ ] Test a 301 redirect and a branded 404 page.
- [ ] Check `/sitemap.xml`, `/robots.txt`, and `/rss.xml`.
- [ ] Enable Vercel Analytics and Speed Insights in the Vercel dashboard.

## Backup and rollback

- [ ] Export a Supabase database backup before production schema changes.
- [ ] Record deployed commit SHA and migration names.
- [ ] If a release fails, revert the Vercel deployment first; do not delete production data as a rollback shortcut.
- [ ] Investigate the failure, preserve audit evidence, and add a regression test before retrying.

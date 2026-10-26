# 507 Head

Hindi editorial site built with Next.js, Supabase, Cloudinary, Vercel Cron, and optional Resend transactional email.

## Requirements

- Node.js **22.x** (the CI release gate uses Node 22)
- npm 10+
- Docker Desktop and the [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started) for local database work

## Local application setup

```bash
npm ci
copy .env.example .env.local
npm run dev
```

Open `http://127.0.0.1:3000`. Do not commit `.env.local` or any API key.

## Reproducible local Supabase database

The committed migration history creates the base schema, editorial workflows, RLS policies, media catalogue, redirects, settings, contact inbox, and fixed categories. `supabase/config.toml` and `supabase/seed.sql` are committed for local use.

```bash
supabase start
supabase db reset --local
supabase test db
```

`supabase db reset --local` rebuilds the local database from every migration and applies the deterministic seed. It is destructive only to the local Supabase database; never use it against production.

For a hosted environment, apply migrations through the approved Supabase workflow in timestamp order. Back up production first, then verify:

```sql
select status, count(*) from public.articles group by status;
select slug from public.categories where is_active = true order by sort_order;
```

## Environment variables

Copy `.env.example` and fill only the providers you use.

| Variable                               | Purpose                                                     |
| -------------------------------------- | ----------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                 | Canonical public site URL.                                  |
| `NEXT_PUBLIC_SUPABASE_URL`             | Supabase project URL.                                       |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser-safe Supabase key.                                  |
| `SUPABASE_SERVICE_ROLE_KEY`            | Server-only key for scheduled publishing.                   |
| `CRON_SECRET`                          | Bearer secret required by the scheduled-publish endpoint.   |
| `CLOUDINARY_*`                         | Server-only Cloudinary media credentials.                   |
| `RESEND_API_KEY`                       | Server-only Resend key for transactional contact email.     |
| `RESEND_FROM_EMAIL`                    | Verified Resend sender, e.g. `507 Head <news@example.com>`. |
| `CONTACT_NOTIFICATION_EMAIL`           | Inbox that receives new contact-form notifications.         |
| `INSTAGRAM_*`                          | Optional Instagram reel integration.                        |

`RESEND_FROM_EMAIL` requires a domain verified in Resend. Without the three Resend variables, contact messages remain safely stored in Supabase but no email is delivered.

## Verification and release gate

```bash
npm run format:check
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
```

GitHub Actions runs formatting, typechecking, linting, unit tests, the production build, and Playwright E2E on pushes and pull requests to `main`.

The test suite covers Zod editorial validation, fixed categories, database RLS/policy contracts, protected preview/admin access, media authorization, scheduled-publish authorization, redirects, public rendering, accessibility, and SEO utility routes. `supabase test db` covers the local database policy and workflow contracts.

## Operations and recovery

- **Draft/review recovery:** use `/admin/articles/[id]/revisions` to inspect a protected preview and restore a revision.
- **Scheduled publishing:** the endpoint is `/api/cron/publish-scheduled`; it requires `Authorization: Bearer $CRON_SECRET` and the Supabase service-role key. Check Vercel logs after a scheduled run.
- **Redirect incident:** disable or correct the redirect in `/admin/redirects`; redirect records only allow internal destinations.
- **Bad production migration:** do not delete migration files or run `db reset`. Restore the database backup if needed, then add a new forward-only corrective migration and deploy it through staging first.
- **Vercel rollback:** use Vercel’s Instant Rollback for application code. Database rollbacks must be forward migrations or a verified database restore.

## Deployment

Vercel deploys `main`. Configure production variables in Vercel before enabling a provider. Run the release gate locally, push the commit, wait for the Vercel deployment to reach **Ready**, then smoke-test the homepage, a public article, the protected admin preview, and the contact form.

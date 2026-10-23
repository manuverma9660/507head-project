This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 507 Head project setup

### Local development

```bash
npm ci
copy .env.example .env.local
npm run dev
```

Add the Supabase project URL and publishable key to `.env.local`. Do not commit this file.

### Verification

Run these checks before a deployment or pull request:

```bash
npm run typecheck
npm run lint
npm run build
```

GitHub Actions runs the same checks for `main` pushes and pull requests.

### Database and media setup

- Apply committed SQL files from `supabase/migrations/` to each environment through the approved Supabase migration workflow.
- The Media Library uses the `media` Storage bucket. Its reproducible bucket/policy setup is in `supabase/migrations/20261023000000_create_media_bucket.sql`.
- Use separate Supabase projects and environment values for development and production.

### Environment variables

Use `.env.example` as the only committed template. Values beginning with `NEXT_PUBLIC_` are safe to expose to the browser; service keys, Cloudinary secrets, and cron secrets must remain server-only.

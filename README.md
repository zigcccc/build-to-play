# Build 2 Play

Marketing site and CMS for Build 2 Play. See `CLAUDE.md` for the architecture and conventions.

| App | Stack | Local URL |
|---|---|---|
| `apps/web` | Next.js 16 (Cache Components), Tailwind 4, Base UI | http://localhost:3000 |
| `apps/studio` | Sanity Studio 6 (standalone) | http://localhost:3333 |

## Setup

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local       # fill in tokens (see below)
cp apps/studio/.env.example apps/studio/.env       # optional
pnpm dev                                           # web + studio
```

- **Sanity tokens:** manage.sanity.io → project `qhuqrj1j` → API → Tokens. You need a read token (Viewer) and a write token (Editor). The dataset is private, so the web app needs the read token even for published content.
- **`RESEND_API_KEY`:** without it, form submissions are still stored in Sanity and the e-mails are only logged.
- **Seeding** writes the design copy into the dataset: `pnpm --filter @b2p/studio seed -- --only=<id>`. Running it without `--only` overwrites every edit made in the Studio.

## Deployment (Vercel, two projects, one repo)

### 1. Web: existing project `build-to-play`

- **Root Directory:** `apps/web`. Framework: Next.js.
- **Ignored Build Step:** turn on "Skip deployments when there are no changes to the root directory or its dependencies".
- **Domains:** `www.buildtoplay.si` (primary), with `buildtoplay.si` redirecting to it (Vercel's default, which it recommends).
- **Environment variables:**

  | Variable | Value |
  |---|---|
  | `NEXT_PUBLIC_SANITY_PROJECT_ID` | `qhuqrj1j` |
  | `NEXT_PUBLIC_SANITY_DATASET` | `production` |
  | `NEXT_PUBLIC_SITE_URL` | `https://www.buildtoplay.si` |
  | `NEXT_PUBLIC_SANITY_STUDIO_URL` | `https://studio.buildtoplay.si` |
  | `SANITY_API_READ_TOKEN` | read token |
  | `SANITY_API_WRITE_TOKEN` | write token |
  | `SANITY_REVALIDATE_SECRET` | random, at least 16 characters |
  | `RESEND_API_KEY` | your Resend key |
  | `EMAIL_FROM` | `Build 2 Play <posvet@buildtoplay.si>` |

- **Resend:** verify `buildtoplay.si` (add the DNS records Resend gives you).

### 2. Studio: new project `build-to-play-studio`

- **Root Directory:** `apps/studio`. `apps/studio/vercel.json` already sets the build (`sanity build` → `dist`) and the SPA rewrite.
- **Domain:** `studio.buildtoplay.si`.
- **Env:** `SANITY_STUDIO_PREVIEW_URL=https://www.buildtoplay.si`.
- **Ignored Build Step:** the same "skip unaffected" setting as the web project.
- The CORS origins (`https://buildtoplay.si`, `https://www.buildtoplay.si`, `https://studio.buildtoplay.si`, and `http://localhost:3000` with credentials) are already added to the Sanity project.

### 3. Sanity webhook (cache invalidation)

manage.sanity.io → API → Webhooks → **Create webhook**:

| Setting | Value |
|---|---|
| URL | `https://www.buildtoplay.si/api/revalidate-tag` (the primary domain, so the request isn't redirected) |
| Dataset | `production` |
| Trigger on | create, update, delete |
| Filter | `!(_type in ["inquiry", "sanity.imageAsset", "sanity.fileAsset"])` |
| Projection | `{_type}` |
| Method | POST, API version `v2025-02-19` |
| Drafts / versions | off |
| Secret | same value as `SANITY_REVALIDATE_SECRET` |

Each publish calls `revalidateTag(<_type>)`. Pages serve stale-while-revalidate and refresh on the next visit.

# Build 2 Play

Marketing site for a Slovenian personal and sports trainer. The site is in Slovenian and uses the informal "ti" form. The trainer speaks in first person.

Conversion means **contact**: the "Brezplačen posvet" booking flow and the contact form. **Mobile-first. SEO/AEO is the top priority.**

## Git rules

- **Never push** to any remote unless the user explicitly says so. Pushing to `main` deploys to Vercel.
- Work on feature branches and commit at every milestone.
- The pre-commit hook runs Biome (`--write`) and `turbo typecheck`, so don't run them manually just to commit.
- No tests. Keep it that way.

## Monorepo (pnpm + Turborepo)

```
apps/web         Next.js 16 App Router site (RSC/SSG, Tailwind 4, Base UI, Zod 4, next-sanity)
apps/studio      Standalone Sanity Studio (project qhuqrj1j, dataset production, PRIVATE)
packages/shared  @b2p/shared: content type names (= cache tags), enums, routes. Used by both apps.
docs/handoff     Design handoff: HANDOFF.md, design-system/, design/*.dc.html. Source of truth for UI.
                 Local only (gitignored); the seed also uploads its images from docs/handoff/assets.
```

Commands (run from the root): `pnpm dev`, `pnpm build`, `pnpm typecheck`, `pnpm lint`. Studio-only: `pnpm --filter @b2p/studio schema:deploy | seed`.

## Data flow

Content follows this path:

1. Studio schema (`apps/studio/schema-types`)
2. `schema:deploy`
3. GROQ query, Zod model and loader together in `apps/web/src/sanity/queries/<page>.ts` (shared fragments in `sanity/fragments.ts`, shared models in `sanity/models.ts`)
4. `sanityFetch({ query, params, tags, model })`
5. Server component

Rules:

- Next runs with **Cache Components**. `sanityFetch` (`server-only`) wraps a `'use cache'` function with `cacheTag(...tags)` and `cacheLife('max')`. It parses the response with the Zod model and **throws** on mismatch. Draft mode bypasses the cache automatically.
- Routes with params need `generateStaticParams`. Any runtime API (`cookies`, `searchParams`) has to sit behind `<Suspense>`.
- `tags` must list **every** `_type` the query touches, including dereferenced types. They come from the `cacheTag` enum in `@b2p/shared`.
- The Sanity webhook POSTs `{_type}` to `/api/revalidate-tag`, which calls `revalidateTag(_type, "max")`.
- In draft mode (Presentation tool), fetches use `perspective: "drafts"`, stega, and no cache. Metadata fetches pass `stega: false`.
- Fields required in the Studio must be non-optional in Zod. Optional Studio fields must be `.nullish()` / `.optional()` in Zod.
- **Page copy comes from the CMS; the wording of how the site works lives in code.** The CMS holds what the trainer would change: page sections, programs, prices, FAQs, articles, settings, and the options visitors pick (contact subjects, booking goals). Fixed UI wording stays in code: form labels, errors and states (`components/forms/copy.tsx`), the cookie banner (`components/consent/copy.ts`), llms.txt headings, aria-labels, the day and part-of-day enums, and the © year. Before adding a CMS field, ask whether a non-technical editor would ever change it. Never make an editor type a placeholder that a component fills in.
- CMS strings may contain `{rok} {trajanje} {interval} {email} {telefon} {ime} {obmocje}`, which `sanityFetch` fills from `siteSettings`. Code-side wording gets the same values through plain template strings (see `formVars()`).
- `sanityFetch`'s `stega` flag means "visible copy": stega in draft mode, and "Build 2 Play" kept on one line with non-breaking spaces. Machine-read output (metadata, OG, llms, e-mails, sitemap) fetches with `stega: false` and gets plain text. Page JSON-LD, built from visible copy, is cleaned in `<JsonLd>`.
- Singletons use the Studio's `document.singletons` registry. The document ID equals the type name.
- Inquiries (form submissions) are written by server actions with the write token. Never render them or cache them.

## Web conventions

- **Server components by default.** Client islands only where interaction is needed: header dropdown and mobile menu, tabs, accordion, booking flow, forms, cookie consent, map, share, ToC scroll-spy.
- **Base UI** (`@base-ui/react`) for all primitives, wrapped in `src/components/ui`. Use `cva` + `cn` for variants. Don't hand-roll dialogs, menus or tabs.
- **Crawlability:** tab and accordion content must stay in the HTML (`keepMounted` / hidden-until-found).
- **Design rules** (`docs/handoff/design-system/README.md` is binding):
  - Dark theme only and square corners. The pill radius is only for chips and badges.
  - Gold `--accent` only for CTAs, focus and small accents.
  - Barlow Condensed (uppercase) for display/H1/H2; Inter for everything else.
  - Lucide icons with stroke 1.75, square caps and miter joins (set globally in CSS).
  - Breakpoints: ≤900 px (burger, mobile CTA bar, static ToC) and ≤640 px (dialogs become bottom sheets).
- **SEO/AEO, on every page:**
  - `buildMetadata()` (canonical, OG, `sl_SI`).
  - JSON-LD via `lib/json-ld.ts`: a single `@graph` that references `/#business` and `/#trainer`, plus a BreadcrumbList.
  - One H1 and semantic HTML.
  - New routes must be added to `sitemap.ts` and `lib/llms/build.ts`.
- **Code style:** Biome with 2 spaces, single quotes and 120 columns. Project skills live in `.claude/skills/`: `cms-field-end-to-end`, `verify-against-design` and `sanity-seed`.
- **Env** is parsed with Zod in `src/env/{server,client}.ts`. Never read `process.env` elsewhere. A new variable must also be listed under `env` in `turbo.json`: Vercel builds through Turborepo, which hides unlisted variables from the build (the runtime still sees them).
- **Where we deliberately differ from the handoff:** Base UI instead of shadcn, and a standalone Studio (not embedded at `/studio`).

## Deployment (Vercel, two projects, one repo)

| Project                | Root          | Domain                                                      |
| ---------------------- | ------------- | ----------------------------------------------------------- |
| `build-to-play`        | `apps/web`    | www.buildtoplay.si (the apex redirects to it)               |
| `build-to-play-studio` | `apps/studio` | studio.buildtoplay.si (static `sanity build` + SPA rewrite) |

**Pre-launch gate.** While `SITE_GATE_KEY` is set, `src/proxy.ts` serves the coming-soon page (`/kmalu`, singleton `comingSoonPage`) in place of every page. `robots.txt` disallows everything and responses carry `noindex`. Two kinds of visitor get past it with the `b2p_preview` cookie:

- Whoever opens `/predogled?k=<key>`.
- Presentation: the draft-mode enable route sets the cookie after a valid Studio secret.

Every page gets its shell (site JSON-LD, consent, booking, header, footer) from `SiteShell`, via the `(site)` layout or the root `not-found`. `/kmalu` deliberately has none of it. While the gate is on, the privacy page is gated too. To launch, remove the env var and redeploy.

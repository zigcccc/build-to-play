---
name: cms-field-end-to-end
description: Add or change CMS-editable content in Build 2 Play end to end (Studio schema → schema deploy → GROQ + Zod model + cache tags → component → seed). Use whenever a new piece of visible copy, a section, or a document type is added or changed.
---

# Adding CMS content end to end

Page copy comes from Sanity (fixed UI wording such as form labels or the cookie banner lives in code; see CLAUDE.md). A change is not done until **all** of these steps are complete.

1. **Studio schema** (`apps/studio/schema-types/`)
   - Use the helpers in `schema-types/fields.ts` (`str`, `txt`, `list`, `typed`, `section`...). Fields are **required by default**; pass `{ optional: true }` only if the UI can hide the element when it is empty.
   - Titles and descriptions are in Slovenian, for a non-technical editor. For copy that mentions the response time, duration or interval, add `description: VARIABLES_HINT`.
   - For a new document type, register it in `schema-types/*/index.ts`. Also add it to `structure.ts`, to `presentation.ts` if it has a URL, and to `cacheTag` in `packages/shared/src/content-types.ts`. A singleton goes into `singletonType`.
2. **Validate and deploy**: run `pnpm --filter @b2p/studio exec sanity schema validate`, then `pnpm --filter @b2p/studio schema:deploy`.
3. **Query + model** (`apps/web/src/sanity/queries/<page>.ts`)
   - Use the fragments from `sanity/fragments.ts` (`IMAGE`, `LINK`, `PORTABLE_TEXT`, `CTA_CARD`, `SEO`...). Use models from `sanity/models.ts`.
   - Required fields in the Studio map to required in Zod. Optional fields map to `.nullish()`. A mismatch throws at build time.
   - `tags` must list **every** `_type` the query reads, including dereferenced types (`->`). Forgetting a tag means stale content after a publish.
4. **Component**
   - Use server components. Render links with `<CmsLink>`, which handles the booking, cookie-settings, phone and email kinds.
   - `{rok}`-style variables are already filled in by `sanityFetch`.
5. **Seed** (`apps/studio/scripts/seed-*.ts`)
   - Add the design copy, keeping `[placeholders]` as they are.
   - Run `pnpm --filter @b2p/studio seed -- --only=<docId>`, then `pnpm --filter @b2p/studio exec sanity documents validate -y`.
6. **SEO**: if the change adds a route, add it to `app/sitemap.ts` and `lib/llms/build.ts`.

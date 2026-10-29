---
name: sanity-seed
description: Run, extend or repair the Build 2 Play Sanity seed (apps/studio/scripts/seed*.ts) that fills the dataset with the design copy. Use when content is missing or out of shape in the dataset, or after adding schema fields.
---

# Sanity seed

The seed lives in `apps/studio/scripts/` and is split by content area:

| File | Contents |
|---|---|
| `seed-pages.ts` | Singletons, person, locations, testimonials |
| `seed-programs.ts` | Programs and FAQs |
| `seed-articles.ts` | Categories and articles |

Helpers are in `seed-helpers.ts`:
- `block` / `listItem` / `linkedBlock` for portable text
- `accent()` for the gold-word headings
- `link()` for CMS links
- `keyed()` to add the array `_key`s

How it behaves:
- Each document has a **fixed `_id`**. By default the seed uses `createIfNotExists`, so it only adds missing documents and never touches Studio edits.
- `--force` switches to `createOrReplace` and **overwrites** what's in the dataset. Combine it with `--only=` to update the documents you changed in the seed; check for a `drafts.` copy first.
- Copy comes verbatim from `docs/handoff/design`. Keep `[placeholders]` as they are, and write the response time, duration and interval as `{rok}` / `{trajanje}` / `{interval}`.

Commands, run from the repo root:

```bash
pnpm --filter @b2p/studio seed                      # everything
pnpm --filter @b2p/studio seed -- --only=homePage   # by _id or _type
pnpm --filter @b2p/studio seed -- --only=homePage --force   # overwrite
pnpm --filter @b2p/studio exec sanity documents validate -y
```

The seed needs a logged-in Sanity CLI (`sanity login`). The dataset is private, so use the MCP `query_documents` tool or Vision to inspect the results.

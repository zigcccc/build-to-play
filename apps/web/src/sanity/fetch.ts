import 'server-only';
import type { CacheTag } from '@b2p/shared';
import { cacheLife, cacheTag } from 'next/cache';
import { draftMode } from 'next/headers';
import type { QueryParams } from 'next-sanity';
import type { z } from 'zod';
import { serverEnv } from '@/env/server';
import { fillVariables, type Variables } from '@/lib/interpolate';
import { client } from './client';

type FetchOptions<Model extends z.ZodType> = {
  query: string;
  params?: QueryParams;
  /** Every document `_type` the query reads, including dereferenced ones. */
  tags: CacheTag[];
  model: Model;
  /** Disable stega for values that end up in <head>, URLs or logic. */
  stega?: boolean;
};

async function cachedQuery(query: string, params: QueryParams, tags: CacheTag[], stega: boolean): Promise<unknown> {
  'use cache';
  cacheTag(...tags);
  cacheLife('max');

  // Draft mode bypasses this cache and re-runs it on every request.
  const { isEnabled: isDraft } = await draftMode();
  return client.fetch(query, params, {
    token: serverEnv.SANITY_API_READ_TOKEN,
    perspective: isDraft ? 'drafts' : 'published',
    stega,
  });
}

const VARIABLES_QUERY = /* groq */ `*[_id == "siteSettings"][0]{
  "ime": owner->name,
  "rok": responseTime,
  "trajanje": consultationDuration,
  "interval": testInterval,
  email,
  "telefon": phone.display
}`;

/** Values for the `{rok}`-style placeholders editors can use in any CMS string. */
async function getVariables(): Promise<Variables> {
  const vars = (await cachedQuery(VARIABLES_QUERY, {}, ['siteSettings', 'person'], false)) as Record<
    string,
    string | null
  > | null;
  return Object.fromEntries(Object.entries(vars ?? {}).filter((entry): entry is [string, string] => !!entry[1]));
}

/** The only way the app reads Sanity: cached, tagged and validated. Throws on shape mismatch. */
export async function sanityFetch<Model extends z.ZodType>({
  query,
  params = {},
  tags,
  model,
  stega = true,
}: FetchOptions<Model>): Promise<z.infer<Model>> {
  // Stega is part of the cache key, so only ask for it in draft mode: published reads then share one entry
  // whether the caller is a page body or its metadata. Callers without stega (metadata, generateStaticParams,
  // which has no request) never need to look.
  const withStega = stega && (await draftMode()).isEnabled;
  const data = await cachedQuery(query, params, [...new Set(tags)], withStega);
  const parsed = model.safeParse(data);
  if (!parsed.success) {
    throw new Error(`Sanity response failed validation [${tags.join(', ')}]:\n${parsed.error.message}`);
  }
  return fillVariables(parsed.data, await getVariables());
}

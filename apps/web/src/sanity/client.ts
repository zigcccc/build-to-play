import { createClient } from 'next-sanity';
import { clientEnv } from '@/env/client';

const LOGIC_KEYS =
  /^(platform|kind|page|target|key|icon|anchor|current|slug|programSlug|articleSlug|url|mapsUrl|href|e164|email|marks|style|listItem|points|price|amount|featured)$/i;

export const apiVersion = '2026-10-29';

export const client = createClient({
  projectId: clientEnv.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: clientEnv.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion,
  // Results are cached by Next ('use cache'), so always read fresh from the API.
  useCdn: false,
  perspective: 'published',
  stega: {
    studioUrl: clientEnv.NEXT_PUBLIC_SANITY_STUDIO_URL,
    // Never encode values that drive logic, URLs or markup (enums, slugs, links, contact data).
    filter: (props) => {
      const key = String(props.sourcePath.at(-1) ?? '');
      if (LOGIC_KEYS.test(key)) return false;
      return props.filterDefault(props);
    },
  },
});

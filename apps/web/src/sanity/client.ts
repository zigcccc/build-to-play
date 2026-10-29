import { createClient } from 'next-sanity';
import { clientEnv } from '@/env/client';

export const apiVersion = '2026-10-29';

export const client = createClient({
  projectId: clientEnv.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: clientEnv.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion,
  // Results are cached by Next ('use cache'), so always read fresh from the API.
  useCdn: false,
  perspective: 'published',
  stega: { studioUrl: clientEnv.NEXT_PUBLIC_SANITY_STUDIO_URL },
});

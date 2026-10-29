import { z } from 'zod';

/** Public env – safe to import anywhere (inlined at build time). */
export const clientEnv = z
  .object({
    NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1),
    NEXT_PUBLIC_SANITY_DATASET: z.string().min(1),
    NEXT_PUBLIC_SANITY_STUDIO_URL: z.url(),
    NEXT_PUBLIC_SITE_URL: z.url(),
  })
  .parse({
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    NEXT_PUBLIC_SANITY_STUDIO_URL: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL,
    // Production sets it explicitly; preview deployments fall back to their own Vercel URL.
    NEXT_PUBLIC_SITE_URL:
      process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : undefined),
  });

export const siteUrl = clientEnv.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');

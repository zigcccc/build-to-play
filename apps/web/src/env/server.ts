import 'server-only';
import { z } from 'zod';

export const serverEnv = z
  .object({
    SANITY_API_READ_TOKEN: z.string().min(1),
    SANITY_API_WRITE_TOKEN: z.string().min(1),
    SANITY_REVALIDATE_SECRET: z.string().min(16),
    RESEND_API_KEY: z.string().optional(),
    EMAIL_FROM: z.string().default('Build 2 Play <posvet@buildtoplay.si>'),
    /** Pre-launch gate: while set, the public only sees the coming-soon page (see src/proxy.ts). */
    SITE_GATE_KEY: z.string().min(16).optional(),
    VERCEL_ENV: z.enum(['production', 'preview', 'development']).optional(),
  })
  .parse(process.env);

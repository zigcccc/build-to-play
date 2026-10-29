import type { MetadataRoute } from 'next';
import { siteUrl } from '@/env/client';
import { serverEnv } from '@/env/server';
import { gateKey } from '@/lib/site-gate';

// AI assistants are explicitly welcome: being cited in answers is a goal of this site.
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Bingbot',
  'DuckAssistBot',
  'meta-externalagent',
];

export default function robots(): MetadataRoute.Robots {
  // Preview deployments and the gated pre-launch site must never be indexed.
  if (serverEnv.VERCEL_ENV === 'preview' || gateKey) return { rules: { userAgent: '*', disallow: '/' } };

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
      { userAgent: AI_CRAWLERS, allow: '/', disallow: ['/api/'] },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}

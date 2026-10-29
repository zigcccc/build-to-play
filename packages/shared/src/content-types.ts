import { z } from 'zod';

export const singletonType = z.enum([
  'siteSettings',
  'layout',
  'homePage',
  'aboutPage',
  'programPage',
  'pricingPage',
  'articlesPage',
  'contactPage',
  'privacyPage',
  'notFoundPage',
  'comingSoonPage',
  'forms',
  'cookieConsent',
  'aiSummary',
]);
export type SingletonType = z.infer<typeof singletonType>;

export const collectionType = z.enum(['program', 'faq', 'location', 'article', 'category', 'person', 'testimonial']);
export type CollectionType = z.infer<typeof collectionType>;

/** Every public document type doubles as a Next.js cache tag. */
export const cacheTag = z.enum([...singletonType.options, ...collectionType.options]);
export type CacheTag = z.infer<typeof cacheTag>;

/** Private (never rendered, never cached) document types. */
export const privateType = z.enum(['inquiry']);

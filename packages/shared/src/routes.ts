import type { PageKey } from './enums';

/** Single source of truth for public URLs (web links, sitemap, Studio Presentation). */
export const routes = {
  home: '/',
  about: '/o-meni',
  program: (slug: string) => `/programi/${slug}`,
  pricing: '/cenik',
  articles: '/nasveti',
  article: (slug: string) => `/nasveti/${slug}`,
  category: (slug: string) => `/nasveti/kategorija/${slug}`,
  contact: '/kontakt',
  privacy: '/politika-zasebnosti',
  /** Served in place of every page while the site gate is on (SITE_GATE_KEY). */
  comingSoon: '/kmalu',
} as const;

export const pageRoute: Record<PageKey, string> = {
  home: routes.home,
  about: routes.about,
  pricing: routes.pricing,
  articles: routes.articles,
  contact: routes.contact,
  privacy: routes.privacy,
};

import { type PageKey, pageRoute as sharedPageRoute, routes as sharedRoutes } from '@b2p/shared';
import type { Route } from 'next';

/** `@b2p/shared` routes typed for Next's typed routes (literals from another package don't narrow). */
export const routes = {
  home: sharedRoutes.home as Route,
  about: sharedRoutes.about as Route,
  pricing: sharedRoutes.pricing as Route,
  articles: sharedRoutes.articles as Route,
  contact: sharedRoutes.contact as Route,
  privacy: sharedRoutes.privacy as Route,
  comingSoon: sharedRoutes.comingSoon as Route,
  program: (slug: string) => sharedRoutes.program(slug) as Route,
  article: (slug: string) => sharedRoutes.article(slug) as Route,
  category: (slug: string) => sharedRoutes.category(slug) as Route,
};

export const pageRoute = (key: PageKey) => sharedPageRoute[key] as Route;

import { pageRoute, routes } from '@b2p/shared';
import { defineDocuments, defineLocations, type PresentationPluginOptions } from 'sanity/presentation';

const singletonPages = {
  homePage: { title: 'Domov', href: pageRoute.home },
  aboutPage: { title: 'O meni', href: pageRoute.about },
  pricingPage: { title: 'Cenik', href: pageRoute.pricing },
  articlesPage: { title: 'Nasveti', href: pageRoute.articles },
  contactPage: { title: 'Kontakt', href: pageRoute.contact },
  privacyPage: { title: 'Politika zasebnosti', href: pageRoute.privacy },
} as const;

export const resolve: PresentationPluginOptions['resolve'] = {
  mainDocuments: defineDocuments([
    ...Object.entries(singletonPages).map(([type, { href }]) => ({
      route: href,
      filter: `_type == "${type}"`,
    })),
    {
      route: '/programi/:slug',
      filter: `_type == "program" && slug.current == $slug`,
    },
    {
      route: '/nasveti/kategorija/:slug',
      filter: `_type == "category" && slug.current == $slug`,
    },
    {
      route: '/nasveti/:slug',
      filter: `_type == "article" && slug.current == $slug`,
    },
  ]),
  locations: {
    ...Object.fromEntries(
      Object.entries(singletonPages).map(([type, location]) => [type, defineLocations({ locations: [location] })])
    ),
    program: defineLocations({
      select: { title: 'name', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title ?? 'Program', href: routes.program(doc?.slug) },
          { title: 'Cenik', href: routes.pricing },
          { title: 'Domov', href: routes.home },
        ],
      }),
    }),
    article: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title ?? 'Članek', href: routes.article(doc?.slug) },
          { title: 'Nasveti', href: routes.articles },
        ],
      }),
    }),
    category: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title ?? 'Kategorija',
            href: routes.category(doc?.slug),
          },
        ],
      }),
    }),
    programPage: defineLocations({
      message: 'Uporablja se na vseh straneh programov.',
      tone: 'positive',
    }),
  },
};

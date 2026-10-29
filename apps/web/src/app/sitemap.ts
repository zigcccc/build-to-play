import type { MetadataRoute } from 'next';
import { siteUrl } from '@/env/client';
import { pageRoute, routes } from '@/lib/routes';
import { getSitemapData } from '@/sanity/queries/seo';

const pageKeyById = {
  homePage: 'home',
  aboutPage: 'about',
  pricingPage: 'pricing',
  articlesPage: 'articles',
  contactPage: 'contact',
  privacyPage: 'privacy',
} as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { pages, programs, articles, categories } = await getSitemapData();
  const url = (path: string) => `${siteUrl}${path === '/' ? '' : path}`;

  return [
    ...pages.map((p) => ({
      url: url(pageRoute(pageKeyById[p._id as keyof typeof pageKeyById])),
      lastModified: p._updatedAt,
      priority: p._id === 'homePage' ? 1 : p._id === 'privacyPage' ? 0.2 : 0.8,
    })),
    ...programs.map((p) => ({ url: url(routes.program(p.slug)), lastModified: p._updatedAt, priority: 0.9 })),
    ...categories.map((c) => ({ url: url(routes.category(c.slug)), lastModified: c._updatedAt, priority: 0.5 })),
    ...articles.map((a) => ({
      url: url(routes.article(a.slug)),
      lastModified: a.updatedAt ?? a.publishedAt,
      priority: 0.7,
    })),
  ];
}

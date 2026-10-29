import type { Metadata } from 'next';
import { ArticleList } from '@/components/articles/article-list';
import { JsonLd } from '@/components/json-ld';
import { PageHero } from '@/components/ui/page-hero';
import { absolute, breadcrumbs, graph, ids, webPage } from '@/lib/json-ld';
import { buildMetadata } from '@/lib/metadata';
import { pageName } from '@/lib/nav-label';
import { routes } from '@/lib/routes';
import { getArticleList } from '@/sanity/queries/articles';
import { getGlobal } from '@/sanity/queries/global';

export async function generateMetadata(): Promise<Metadata> {
  const { copy } = await getArticleList('', false);
  return buildMetadata({ seo: copy.seo, title: copy.hero.heading, description: copy.hero.lead, path: routes.articles });
}

export default async function ArticlesPage() {
  const [data, { layout }] = await Promise.all([getArticleList(), getGlobal()]);
  const { copy, articles } = data;
  const crumbs = [{ name: layout.labels.breadcrumbHome, href: routes.home }, { name: pageName(layout, 'articles') }];

  return (
    <main>
      <JsonLd
        data={graph(
          webPage(routes.articles, copy.hero.heading, copy.hero.lead, {
            '@type': ['WebPage', 'CollectionPage'],
            mainEntity: {
              '@type': 'Blog',
              '@id': `${absolute(routes.articles)}#blog`,
              name: copy.hero.heading,
              publisher: { '@id': ids.business },
              blogPost: articles.map((a) => ({
                '@type': 'BlogPosting',
                headline: a.title,
                url: absolute(routes.article(a.slug)),
                datePublished: a.publishedAt,
              })),
            },
          }),
          breadcrumbs(crumbs.map((c) => ({ name: c.name, path: c.href ?? routes.articles })))
        )}
      />
      <PageHero
        className="pb-[clamp(40px,5vw,64px)]"
        crumbs={crumbs}
        eyebrow={copy.hero.eyebrow}
        lead={<p className="text-muted">{copy.hero.lead}</p>}
        title={copy.hero.heading}
      />
      <ArticleList category="" data={data} />
    </main>
  );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ArticleList } from '@/components/articles/article-list';
import { JsonLd } from '@/components/json-ld';
import { PageHero } from '@/components/ui/page-hero';
import { breadcrumbs, graph, webPage } from '@/lib/json-ld';
import { buildMetadata } from '@/lib/metadata';
import { pageName } from '@/lib/nav-label';
import { routes } from '@/lib/routes';
import { getArticleList, getArticleSlugs } from '@/sanity/queries/articles';
import { getGlobal } from '@/sanity/queries/global';

type Props = PageProps<'/nasveti/kategorija/[slug]'>;

export async function generateStaticParams() {
  const { categories } = await getArticleSlugs();
  return categories.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { copy, categories } = await getArticleList(slug, false);
  const category = categories.find((c) => c.slug === slug);
  if (!category) return {};
  return buildMetadata({
    seo: category.seo,
    title: `${copy.hero.eyebrow}: ${category.title}`,
    description: category.description ?? copy.hero.lead,
    path: routes.category(slug),
  });
}

export default function CategoryPage({ params }: Props) {
  return (
    <Suspense fallback={<main className="min-h-screen" />}>
      <CategoryContent params={params} />
    </Suspense>
  );
}

async function CategoryContent({ params }: Pick<Props, 'params'>) {
  const { slug } = await params;
  const [data, { layout }] = await Promise.all([getArticleList(slug), getGlobal()]);
  const category = data.categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const path = routes.category(slug);
  const crumbs = [
    { name: layout.labels.breadcrumbHome, href: routes.home },
    { name: pageName(layout, 'articles'), href: routes.articles },
    { name: category.title },
  ];

  return (
    <main>
      <JsonLd
        data={graph(
          webPage(path, category.title, category.description ?? data.copy.hero.lead, {
            '@type': ['WebPage', 'CollectionPage'],
          }),
          breadcrumbs(crumbs, path)
        )}
      />
      <PageHero
        className="pb-[clamp(40px,5vw,64px)]"
        crumbs={crumbs}
        eyebrow={data.copy.hero.eyebrow}
        lead={<p className="text-muted">{category.description ?? data.copy.hero.lead}</p>}
        title={category.title}
      />
      <ArticleList category={slug} data={data} />
    </main>
  );
}

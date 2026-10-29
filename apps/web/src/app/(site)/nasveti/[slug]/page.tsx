import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ArticleBody, tocItems } from '@/components/articles/article-body';
import { ArticleCard } from '@/components/articles/article-card';
import { Share } from '@/components/articles/share';
import { Toc } from '@/components/articles/toc';
import { JsonLd } from '@/components/json-ld';
import { Arrow } from '@/components/ui/arrow';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { buttonStyles } from '@/components/ui/button';
import { SanityImage } from '@/components/ui/sanity-image';
import { siteUrl } from '@/env/client';
import { formatDate } from '@/lib/date';
import { absolute, breadcrumbs, graph, ids, webPage } from '@/lib/json-ld';
import { buildMetadata } from '@/lib/metadata';
import { pageName } from '@/lib/nav-label';
import { routes } from '@/lib/routes';
import { urlFor } from '@/sanity/image';
import { getArticle, getArticleSlugs, getArticlesCopy } from '@/sanity/queries/articles';
import { getGlobal } from '@/sanity/queries/global';

type Props = PageProps<'/nasveti/[slug]'>;

export async function generateStaticParams() {
  const { articles } = await getArticleSlugs();
  return articles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug, false);
  if (!article) return {};
  return buildMetadata({
    seo: article.seo,
    title: article.title,
    description: article.excerpt,
    path: routes.article(slug),
    type: 'article',
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt ?? article.publishedAt,
    ogImageFile: true,
  });
}

export default function ArticlePage({ params }: Props) {
  return (
    <Suspense fallback={<main className="min-h-screen" />}>
      <ArticleContent params={params} />
    </Suspense>
  );
}

async function ArticleContent({ params }: Pick<Props, 'params'>) {
  const { slug } = await params;
  const [article, copy, { layout }] = await Promise.all([getArticle(slug), getArticlesCopy(), getGlobal()]);
  if (!article) notFound();

  const path = routes.article(slug);
  const toc = tocItems(article.body);
  // Editor's picks first, then same category, then the latest articles.
  const related = [...article.related, ...article.sameCategory, ...article.latest]
    .filter((a, i, all) => all.findIndex((b) => b._id === a._id) === i)
    .slice(0, 3);
  const crumbs = [
    { name: layout.labels.breadcrumbHome, href: routes.home },
    { name: pageName(layout, 'articles'), href: routes.articles },
    { name: article.category.title, href: routes.category(article.category.slug) },
  ];
  const t = copy.article;

  return (
    <main>
      <JsonLd
        data={graph(
          webPage(path, article.title, article.excerpt, { mainEntity: { '@id': `${absolute(path)}#article` } }),
          {
            '@type': 'BlogPosting',
            '@id': `${absolute(path)}#article`,
            headline: article.title,
            description: article.excerpt,
            url: absolute(path),
            mainEntityOfPage: { '@id': `${absolute(path)}#webpage` },
            datePublished: article.publishedAt,
            dateModified: article.updatedAt ?? article.publishedAt,
            author: { '@id': ids.trainer },
            publisher: { '@id': ids.business },
            articleSection: article.category.title,
            wordCount: article.wordCount,
            timeRequired: `PT${article.readingTime}M`,
            inLanguage: 'sl-SI',
            image: article.cover ? urlFor(article.cover).width(1200).height(630).fit('crop').url() : undefined,
          },
          breadcrumbs([...crumbs.map((c) => ({ name: c.name, path: c.href as string })), { name: article.title, path }])
        )}
      />

      <article>
        <header className="pt-[168px] pb-[clamp(32px,4vw,48px)]" data-hero>
          <div className="wrap flex flex-col gap-6">
            <Breadcrumbs className="mb-1" items={crumbs} />
            <Link className="cat self-start hover:bg-accent/25" href={routes.category(article.category.slug)}>
              {article.category.title}
            </Link>
            <h1 className="m-0 max-w-[1000px] text-balance font-bold font-display text-[clamp(48px,7vw,104px)] uppercase leading-[0.92]">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <span className="flex items-center gap-3">
                <SanityImage aspect={1} className="size-11 object-cover" image={article.author.avatar} sizes="44px" />
                <span className="flex flex-col">
                  <span className="font-semibold text-[15px] leading-5">{article.author.name}</span>
                  <span className="text-[13px] text-muted leading-[18px]">{article.author.role}</span>
                </span>
              </span>
              <span className="text-muted text-sm">
                <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time> · {article.readingTime}{' '}
                {copy.list.readingTime}
                {article.updatedAt && (
                  <>
                    {' '}
                    · {t.updatedLabel} <time dateTime={article.updatedAt}>{formatDate(article.updatedAt)}</time>
                  </>
                )}
              </span>
            </div>
          </div>
        </header>

        <div className="wrap pb-[clamp(40px,5vw,64px)]">
          <SanityImage
            className="h-[clamp(220px,38vw,540px)] w-full object-cover"
            image={article.cover}
            preload
            sizes="(min-width: 1280px) 1152px, 100vw"
          />
        </div>

        <div className="wrap flex flex-wrap items-start gap-x-[clamp(40px,6vw,96px)] gap-y-10 pb-[clamp(72px,10vw,120px)]">
          <aside className="flex flex-[1_1_220px] flex-col gap-8 nav:sticky nav:top-[110px] nav:max-w-[280px]">
            {toc.length > 0 && <Toc items={toc} label={t.tocLabel} />}
            <Share copiedLabel={t.copied} copyLabel={t.copyLink} label={t.shareLabel} url={`${siteUrl}${path}`} />
          </aside>
          <div className="min-w-0 max-w-[720px] flex-[999_1_560px]">
            <ArticleBody value={article.body} />
          </div>
        </div>
      </article>

      <section aria-label={t.authorLabel} className="pb-[clamp(72px,10vw,120px)]">
        <div className="wrap">
          <div className="card flex flex-wrap items-center gap-x-8 gap-y-6 p-[clamp(24px,3vw,36px)]">
            <SanityImage
              aspect={1}
              className="size-24 flex-none object-cover"
              image={article.author.avatar}
              sizes="96px"
            />
            <div className="flex flex-[1_1_320px] flex-col gap-1.5">
              <span className="eyebrow">{t.authorLabel}</span>
              <span className="font-bold font-display text-[28px] uppercase leading-[30px]">{article.author.name}</span>
              <span className="text-[15px] text-muted">{article.author.bio}</span>
            </div>
            <Link className={`${buttonStyles({ variant: 'text' })} group`} href={routes.about}>
              {t.authorLink}
              <Arrow />
            </Link>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="rel-title" className="border-hairline border-t py-[clamp(72px,10vw,120px)]">
          <div className="wrap">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
              <h2
                className="m-0 font-bold font-display text-[clamp(40px,5vw,64px)] uppercase leading-[0.95]"
                id="rel-title"
              >
                {t.relatedHeading}
              </h2>
              <Link className={`${buttonStyles({ variant: 'text' })} group`} href={routes.articles}>
                {t.allArticles}
                <Arrow />
              </Link>
            </div>
            <div className="grid-fit [--gap:40px_24px] [--min:300px]">
              {related.map((a) => (
                <ArticleCard article={a} excerpt={false} key={a._id} minutesLabel={copy.list.readingTimeShort} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

import Link from 'next/link';
import { buttonStyles } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { routes } from '@/lib/routes';
import type { getArticleList } from '@/sanity/queries/articles';
import { ArticleCard } from './article-card';
import { FeaturedArticle } from './featured-article';
import { LoadMore } from './load-more';

type Data = Awaited<ReturnType<typeof getArticleList>>;

const chip =
  'inline-flex min-h-10 items-center rounded-full border border-control px-4 font-medium text-ink text-sm hover:border-ink aria-[current=page]:border-accent aria-[current=page]:bg-accent aria-[current=page]:text-black';

/** Category chips (real, indexable links), featured article, grid, empty state and "load more". */
export function ArticleList({ data, category }: { data: Data; category: string }) {
  const { copy, categories, articles, total } = data;
  const [featured, ...rest] = articles;

  return (
    <section aria-label={copy.hero.eyebrow} className="pb-[clamp(72px,10vw,136px)]">
      <div className="wrap">
        <nav aria-label="Kategorija" className="mb-10 flex flex-wrap gap-2 border-hairline border-b pb-8">
          <Link aria-current={category === '' ? 'page' : undefined} className={chip} href={routes.articles}>
            {copy.list.allLabel}
          </Link>
          {categories.map((c) => (
            <Link
              aria-current={category === c.slug ? 'page' : undefined}
              className={chip}
              href={routes.category(c.slug)}
              key={c._id}
            >
              {c.title}
            </Link>
          ))}
        </nav>

        {featured ? (
          <>
            <FeaturedArticle
              article={featured}
              featuredLabel={copy.list.featuredLabel}
              readingTimeLabel={copy.list.readingTime}
            />
            <div className="grid-fit [--gap:48px_24px] [--min:300px]">
              {rest.map((article) => (
                <ArticleCard article={article} key={article._id} minutesLabel={copy.list.readingTimeShort} />
              ))}
            </div>
            <LoadMore
              category={category}
              label={copy.list.loadMore}
              minutesLabel={copy.list.readingTimeShort}
              shown={articles.length}
              total={total}
            />
          </>
        ) : (
          <div className="flex flex-col items-start gap-4 py-12">
            <p className="m-0 font-bold font-display text-4xl uppercase leading-9">{copy.list.emptyText}</p>
            <Link className={cn(buttonStyles({ variant: 'line' }))} href={routes.articles}>
              {copy.list.emptyCta}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

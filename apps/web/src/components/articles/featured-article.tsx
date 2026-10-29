import Link from 'next/link';
import { SanityImage } from '@/components/ui/sanity-image';
import { formatDate } from '@/lib/date';
import { routes } from '@/lib/routes';
import type { ArticleCard } from '@/sanity/queries/articles';

type Props = { article: ArticleCard; featuredLabel: string; readingTimeLabel: string };

export function FeaturedArticle({ article, featuredLabel, readingTimeLabel }: Props) {
  return (
    <Link
      className="group mb-12 grid-fit items-center border-hairline border-b pb-12 text-ink [--gap:clamp(24px,4vw,56px)] [--min:440px] hover:text-ink"
      href={routes.article(article.slug)}
    >
      <SanityImage
        aspect={16 / 10}
        className="aspect-16/10 w-full object-cover"
        image={article.cover}
        preload
        sizes="(min-width: 960px) 50vw, 100vw"
      />
      <div className="flex flex-col gap-4">
        <span className="flex items-center gap-3">
          <span className="cat">{article.category.title}</span>
          <span className="text-[13px] text-muted">{featuredLabel}</span>
        </span>
        <h2 className="m-0 text-balance font-bold font-display text-[clamp(36px,4vw,56px)] uppercase leading-[0.95] transition-colors group-hover:text-accent">
          {article.title}
        </h2>
        <p className="text-[17px] text-muted leading-[27px]">{article.excerpt}</p>
        <span className="text-[13px] text-muted">
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time> · {article.readingTime}{' '}
          {readingTimeLabel}
        </span>
      </div>
    </Link>
  );
}

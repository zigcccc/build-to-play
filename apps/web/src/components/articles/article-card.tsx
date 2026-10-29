import Link from 'next/link';
import { SanityImage } from '@/components/ui/sanity-image';
import { cn } from '@/lib/cn';
import { routes } from '@/lib/routes';
import type { ArticleCard as ArticleCardValue } from '@/sanity/queries/articles';

type Props = {
  article: ArticleCardValue;
  minutesLabel: string;
  /** Related cards omit the excerpt. */
  excerpt?: boolean;
  headingLevel?: 'h2' | 'h3';
};

/** Pure (no server-only imports) so "load more" can render it on the client too. */
export function ArticleCard({ article, minutesLabel, excerpt = true, headingLevel: Heading = 'h3' }: Props) {
  return (
    <Link className="group flex flex-col gap-4 text-ink hover:text-ink" href={routes.article(article.slug)}>
      <SanityImage
        aspect={16 / 10}
        className="aspect-16/10 w-full object-cover"
        image={article.cover}
        sizes="(min-width: 1100px) 400px, (min-width: 700px) 50vw, 100vw"
      />
      <span className="flex items-center gap-3">
        <span className="cat">{article.category.title}</span>
        <span className="text-[13px] text-muted">
          {article.readingTime} {minutesLabel}
        </span>
      </span>
      <Heading
        className={cn(
          'm-0 text-balance font-bold font-display text-[28px] uppercase leading-[30px] transition-colors group-hover:text-accent'
        )}
      >
        {article.title}
      </Heading>
      {excerpt && <p className="text-[15px] text-muted">{article.excerpt}</p>}
    </Link>
  );
}

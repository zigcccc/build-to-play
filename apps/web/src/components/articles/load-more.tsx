'use client';

import { useState, useTransition } from 'react';
import { loadMoreArticles } from '@/actions/articles';
import { buttonStyles } from '@/components/ui/button';
import type { ArticleCard as ArticleCardValue } from '@/sanity/queries/articles';
import { ArticleCard } from './article-card';

type Props = { category: string; shown: number; total: number; label: string; minutesLabel: string };

/** Appends further pages; every article is also linked from the sitemap, so crawlers miss nothing. */
export function LoadMore({ category, shown, total, label, minutesLabel }: Props) {
  const [more, setMore] = useState<ArticleCardValue[]>([]);
  const [pending, startTransition] = useTransition();
  const loaded = shown + more.length;

  return (
    <>
      {more.length > 0 && (
        <div className="mt-12 grid-fit [--gap:48px_24px] [--min:300px]">
          {more.map((article) => (
            <ArticleCard article={article} key={article._id} minutesLabel={minutesLabel} />
          ))}
        </div>
      )}
      {loaded < total && (
        <div className="mt-16 flex justify-center">
          <button
            className={buttonStyles({ variant: 'line' })}
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const next = await loadMoreArticles(category, loaded);
                setMore((prev) => [...prev, ...next]);
              })
            }
            type="button"
          >
            {label}
          </button>
        </div>
      )}
    </>
  );
}

import type { Route } from 'next';
import Link from 'next/link';
import { Fragment } from 'react';
import { cn } from '@/lib/cn';

export type Crumb = { name: string; href?: string };

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Drobtinice" className={className}>
      <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0 text-[13px] text-muted leading-5">
        {items.map((item, i) => (
          <Fragment key={item.name}>
            {i > 0 && <li aria-hidden>/</li>}
            <li>
              {item.href ? (
                <Link className="text-muted hover:text-ink" href={item.href as Route}>
                  {item.name}
                </Link>
              ) : (
                <span aria-current="page" className={cn(i === items.length - 1 && 'text-ink')}>
                  {item.name}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}

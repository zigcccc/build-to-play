import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import type { Crumb } from './breadcrumbs';
import { HeroTitle } from './hero-title';

type Props = {
  crumbs: Crumb[];
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Show the large outlined "2" behind the heading. */
  deco?: boolean;
  className?: string;
  titleClassName?: string;
  children?: ReactNode;
};

/** Text-only page hero used by the inner pages (Cenik, Nasveti, Kontakt, Pravno). */
export function PageHero({ crumbs, eyebrow, title, lead, deco, className, titleClassName, children }: Props) {
  return (
    <section
      aria-labelledby="page-title"
      className={cn('relative overflow-hidden pt-[168px] pb-[clamp(48px,6vw,80px)]', className)}
      data-hero
    >
      {deco && (
        <div aria-hidden className="deco2 top-10 right-[-3%] text-[clamp(360px,40vw,640px)]">
          2
        </div>
      )}
      <div className="wrap relative flex flex-col gap-6">
        <HeroTitle
          crumbs={crumbs}
          eyebrow={eyebrow}
          id="page-title"
          title={title}
          titleClassName={cn('d1 max-w-[900px]', titleClassName)}
        />
        {lead && <div className="lead max-w-[560px]">{lead}</div>}
        {children}
      </div>
    </section>
  );
}

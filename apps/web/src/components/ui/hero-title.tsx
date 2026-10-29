import type { ReactNode } from 'react';
import { Breadcrumbs, type Crumb } from './breadcrumbs';

type Props = {
  crumbs: Crumb[];
  /** Text renders as the gold eyebrow; pass an element for anything else (e.g. the article's category chip). */
  eyebrow: ReactNode;
  title: ReactNode;
  id: string;
  titleClassName?: string;
};

/** Breadcrumbs + eyebrow + H1 at the top of every inner page; the page decides the layout around it. */
export function HeroTitle({ crumbs, eyebrow, title, id, titleClassName = 'd1' }: Props) {
  return (
    <>
      <Breadcrumbs className="mb-1" items={crumbs} />
      {typeof eyebrow === 'string' ? <p className="eyebrow">{eyebrow}</p> : eyebrow}
      <h1 className={titleClassName} id={id}>
        {title}
      </h1>
    </>
  );
}

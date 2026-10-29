import type { Route } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { pageRoute, routes } from '@/lib/routes';
import type { CmsLinkValue } from '@/sanity/models';
import { getGlobal } from '@/sanity/queries/global';
import { BookingTrigger } from './booking/booking-trigger';
import { ConsentSettingsTrigger } from './consent/consent-settings-trigger';

type Props = {
  link: Omit<CmsLinkValue, 'label'> & { label?: string };
  className?: string;
  /** Rendered instead of the label (e.g. label + icon). */
  children?: ReactNode;
  /** Program to preselect when this link opens the booking flow. */
  program?: string;
  'aria-label'?: string;
  /** Rendered instead when the link leads nowhere (e.g. to the switched-off Nasveti section). */
  fallback?: ReactNode;
};

const isArticlesLink = (link: Props['link']) =>
  link.kind === 'article' || (link.kind === 'page' && link.page === 'articles');

export function cmsHref(link: Props['link']): string | null {
  const anchor = link.anchor ? `#${link.anchor}` : '';
  switch (link.kind) {
    case 'page':
      return link.page ? `${pageRoute(link.page)}${anchor}` : null;
    case 'program':
      return link.programSlug ? `${routes.program(link.programSlug)}${anchor}` : null;
    case 'article':
      return link.articleSlug ? routes.article(link.articleSlug) : null;
    case 'external':
      return link.url ?? null;
    default:
      return null;
  }
}

/** Renders any CMS link: internal route, external URL, phone, e-mail, or an overlay action. */
export async function CmsLink({ link, className, children, program, fallback = null, ...rest }: Props) {
  const content = children ?? link.label;

  if (isArticlesLink(link) && !(await getGlobal()).articlesEnabled) return fallback;

  if (link.kind === 'booking') {
    return (
      <BookingTrigger aria-label={rest['aria-label']} className={className} program={program}>
        {content}
      </BookingTrigger>
    );
  }
  if (link.kind === 'cookieSettings') {
    return (
      <ConsentSettingsTrigger aria-label={rest['aria-label']} className={className}>
        {content}
      </ConsentSettingsTrigger>
    );
  }
  if (link.kind === 'phone' || link.kind === 'email') {
    const { settings } = await getGlobal();
    const href = link.kind === 'phone' ? `tel:${settings.phone.e164}` : `mailto:${settings.email}`;
    return (
      <a aria-label={rest['aria-label']} className={className} href={href}>
        {content}
      </a>
    );
  }

  const href = cmsHref(link);
  if (!href) return fallback;
  if (link.kind === 'external') {
    return (
      <a aria-label={rest['aria-label']} className={className} href={href} rel="noopener" target="_blank">
        {content}
      </a>
    );
  }
  return (
    <Link aria-label={rest['aria-label']} className={className} href={href as Route}>
      {content}
    </Link>
  );
}

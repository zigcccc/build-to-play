import type { ProgramKey } from '@b2p/shared';
import type { Route } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { pageRoute, routes } from '@/lib/routes';
import type { CmsLinkValue } from '@/sanity/models';
import { getGlobal } from '@/sanity/queries/global';
import { BookingTrigger } from './booking/booking-trigger';
import { CookieSettingsTrigger } from './preferences/preferences-trigger';

type Props = {
  link: Omit<CmsLinkValue, 'label'> & { label?: string };
  className?: string;
  /** Rendered instead of the label (e.g. label + icon). */
  children?: ReactNode;
  /** Program to preselect when this link opens the booking flow. */
  program?: ProgramKey;
  'aria-label'?: string;
};

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
export async function CmsLink({ link, className, children, program, ...rest }: Props) {
  const content = children ?? link.label;

  if (link.kind === 'booking') {
    return (
      <BookingTrigger aria-label={rest['aria-label']} className={className} program={program}>
        {content}
      </BookingTrigger>
    );
  }
  if (link.kind === 'cookieSettings') {
    return (
      <CookieSettingsTrigger aria-label={rest['aria-label']} className={className}>
        {content}
      </CookieSettingsTrigger>
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
  if (!href) return null;
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

'use client';

import type { IconName, PageKey, SocialPlatform } from '@b2p/shared';
import { Collapsible } from '@base-ui/react/collapsible';
import { NavigationMenu } from '@base-ui/react/navigation-menu';
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { BookingTrigger } from '@/components/booking/booking-trigger';
import { CmsIcon, SocialIcon, socialLabel } from '@/components/icons';
import { buttonStyles } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { pageRoute, routes } from '@/lib/routes';

export type HeaderProgram = { num: string; name: string; slug: string; tagline: string; icon: IconName };

type Props = {
  nav: { label: string; target: PageKey | 'programs' }[];
  programs: HeaderProgram[];
  programsMenu: { helperText: string; pricingLabel: string; bookingLabel: string };
  cta: string;
  mobile: { homeLabel: string; ctaLabel: string };
  socials: { platform: SocialPlatform; url: string }[];
  logo: React.ReactNode;
};

const linkClass =
  'inline-flex min-h-10 cursor-pointer items-center gap-1.5 bg-transparent px-3 text-[15px] lowercase tracking-[0.01em] text-ink transition-colors hover:bg-white/8 hover:text-ink data-[active]:text-accent data-[active]:underline data-[active]:decoration-accent data-[active]:underline-offset-[6px] data-popup-open:text-accent data-popup-open:underline data-popup-open:decoration-accent data-popup-open:underline-offset-[6px] aria-[current=page]:text-accent aria-[current=page]:underline aria-[current=page]:decoration-accent aria-[current=page]:underline-offset-[6px]';

const isActive = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

export function HeaderNav({ nav, programs, programsMenu, cta, mobile, socials, logo }: Props) {
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const inPrograms = pathname.startsWith('/programi/');

  // biome-ignore lint/correctness/useExhaustiveDependencies: close the mobile menu whenever the route changes
  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <Collapsible.Root onOpenChange={setMenuOpen} open={menuOpen}>
      <div className="glass flex flex-col" ref={barRef}>
        <div className="flex h-16 items-center justify-between gap-4 pr-2.5 pl-5">
          {logo}

          <NavigationMenu.Root aria-label="Glavna navigacija" className="hidden nav:block">
            <NavigationMenu.List className="flex items-center gap-1">
              {nav.map((item) =>
                item.target === 'programs' ? (
                  <NavigationMenu.Item key={item.target}>
                    <NavigationMenu.Trigger className={linkClass} data-active={inPrograms || undefined}>
                      {item.label}
                      <NavigationMenu.Icon className="transition-transform duration-200 data-popup-open:rotate-180">
                        <ChevronDown size={16} />
                      </NavigationMenu.Icon>
                    </NavigationMenu.Trigger>
                    <NavigationMenu.Content
                      className="grid grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,0.8fr)] gap-1 p-3"
                      keepMounted
                    >
                      {programs.map((p) => (
                        <NavigationMenu.Link
                          className="flex flex-col gap-3 border border-transparent p-5 text-ink transition-colors hover:border-white/14 hover:bg-white/4 hover:text-ink"
                          href={routes.program(p.slug)}
                          key={p.slug}
                          render={<Link href={routes.program(p.slug)} />}
                        >
                          <span className="flex items-center justify-between">
                            <span className="font-display font-semibold text-accent text-xl">{p.num}</span>
                            <CmsIcon name={p.icon} size={24} strokeWidth={1.5} />
                          </span>
                          <span className="font-bold font-display text-[26px] uppercase leading-[26px]">{p.name}</span>
                          <span className="text-muted text-sm">{p.tagline}</span>
                        </NavigationMenu.Link>
                      ))}
                      <div className="flex flex-col justify-between gap-4 bg-surface p-5">
                        <span className="text-muted text-sm">{programsMenu.helperText}</span>
                        <span className="flex flex-col gap-1">
                          <NavigationMenu.Link
                            className="group inline-flex min-h-10 items-center gap-2 font-bold text-accent text-xs uppercase tracking-[0.14em] hover:text-accent-hover"
                            href={routes.pricing}
                            render={<Link href={routes.pricing} />}
                          >
                            {programsMenu.pricingLabel}
                            <ArrowRight aria-hidden size={16} />
                          </NavigationMenu.Link>
                          <BookingTrigger className="group inline-flex min-h-10 cursor-pointer items-center gap-2 text-left font-bold text-accent text-xs uppercase tracking-[0.14em] hover:text-accent-hover">
                            {programsMenu.bookingLabel}
                            <ArrowRight aria-hidden size={16} />
                          </BookingTrigger>
                        </span>
                      </div>
                    </NavigationMenu.Content>
                  </NavigationMenu.Item>
                ) : (
                  <NavigationMenu.Item key={item.target}>
                    <NavigationMenu.Link
                      aria-current={isActive(pathname, pageRoute(item.target)) ? 'page' : undefined}
                      className={linkClass}
                      href={pageRoute(item.target)}
                      render={<Link href={pageRoute(item.target)} />}
                    >
                      {item.label}
                    </NavigationMenu.Link>
                  </NavigationMenu.Item>
                )
              )}
            </NavigationMenu.List>

            <NavigationMenu.Portal>
              <NavigationMenu.Positioner
                align="start"
                anchor={barRef}
                className="z-50 w-(--anchor-width)"
                collisionAvoidance={{ side: 'none' }}
                sideOffset={8}
              >
                <NavigationMenu.Popup className="border border-white/10 bg-black/92 backdrop-blur-[16px] transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0">
                  <NavigationMenu.Viewport />
                </NavigationMenu.Popup>
              </NavigationMenu.Positioner>
            </NavigationMenu.Portal>
          </NavigationMenu.Root>

          <div className="flex items-center gap-2">
            <BookingTrigger className={cn(buttonStyles({ size: 'sm' }), 'hidden nav:inline-flex')}>
              {cta}
            </BookingTrigger>
            <Collapsible.Trigger
              aria-label={menuOpen ? 'Zapri meni' : 'Odpri meni'}
              className="inline-flex size-11 cursor-pointer items-center justify-center border border-white/22 text-ink nav:hidden"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </Collapsible.Trigger>
          </div>
        </div>

        <Collapsible.Panel
          className="max-h-[calc(100dvh-92px)] overflow-y-auto border-white/12 border-t nav:hidden"
          hiddenUntilFound
        >
          <nav aria-label="Mobilna navigacija" className="flex flex-col bg-black/60 px-5 pt-1 pb-5">
            <MobileLink href={routes.home} label={mobile.homeLabel} />
            {nav.map((item) =>
              item.target === 'programs' ? (
                <div key={item.target}>
                  <span className="flex min-h-15 items-center font-bold font-display text-3xl uppercase">
                    {item.label}
                  </span>
                  {programs.map((p, i) => (
                    <Link
                      aria-current={isActive(pathname, routes.program(p.slug)) ? 'page' : undefined}
                      className={cn(
                        'flex min-h-12 items-center gap-3 border-white/6 border-b pl-4 text-base text-ink aria-[current=page]:text-accent',
                        i === programs.length - 1 && 'border-white/10'
                      )}
                      href={routes.program(p.slug)}
                      key={p.slug}
                    >
                      <span className="font-display font-semibold text-accent">{p.num}</span>
                      {p.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <MobileLink
                  current={isActive(pathname, pageRoute(item.target))}
                  href={pageRoute(item.target)}
                  key={item.target}
                  label={item.label}
                />
              )
            )}
            <BookingTrigger className={cn(buttonStyles({ size: 'md' }), 'mt-6')}>{mobile.ctaLabel}</BookingTrigger>
            <div className="mt-4 flex gap-2">
              {socials.map((s) => (
                <a
                  aria-label={socialLabel[s.platform]}
                  className="inline-flex size-11 items-center justify-center border border-control text-ink"
                  href={s.url}
                  key={s.platform}
                  rel="noopener"
                  target="_blank"
                >
                  <SocialIcon platform={s.platform} />
                </a>
              ))}
            </div>
          </nav>
        </Collapsible.Panel>
      </div>
    </Collapsible.Root>
  );
}

function MobileLink({ href, label, current }: { href: Route; label: string; current?: boolean }) {
  return (
    <Link
      aria-current={current ? 'page' : undefined}
      className="flex min-h-15 items-center justify-between border-white/10 border-b font-bold font-display text-3xl text-ink uppercase aria-[current=page]:text-accent"
      href={href}
    >
      {label}
      <ArrowRight aria-hidden className="text-accent" size={22} />
    </Link>
  );
}

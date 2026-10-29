'use client';

import type { IconName, PageKey, SocialPlatform } from '@b2p/shared';
import { Dialog } from '@base-ui/react/dialog';
import { NavigationMenu } from '@base-ui/react/navigation-menu';
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { BookingTrigger } from '@/components/booking/booking-trigger';
import { CmsIcon } from '@/components/icons';
import { SocialButtons } from '@/components/social-buttons';
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

const burgerClass =
  'inline-flex size-11 cursor-pointer items-center justify-center border border-white/22 text-ink nav:hidden';

const isActive = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

export function HeaderNav({ nav, programs, programsMenu, cta, mobile, socials, logo }: Props) {
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  // The bar and the programs dropdown read as one surface while it is open.
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const inPrograms = pathname.startsWith('/programi/');

  // biome-ignore lint/correctness/useExhaustiveDependencies: close the mobile menu whenever the route changes
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <Dialog.Root onOpenChange={setMenuOpen} open={menuOpen}>
      <div
        className={cn(
          'glass relative flex flex-col transition-colors duration-200 data-dropdown:bg-black/92',
          // The open menu draws its own copy of the bar on top; hiding this one keeps the glass from doubling up.
          // Opacity, not visibility: the trap returns focus to the trigger here, so it must stay focusable.
          menuOpen && 'opacity-0 nav:opacity-100'
        )}
        data-dropdown={dropdownOpen || undefined}
        ref={barRef}
      >
        <div className="flex h-16 items-center justify-between gap-4 pr-2.5 pl-5">
          {logo}

          <NavigationMenu.Root
            aria-label="Glavna navigacija"
            className="hidden nav:block"
            onValueChange={(value) => setDropdownOpen(value != null)}
          >
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
                    <NavigationMenu.Content className="flex flex-col gap-1 p-3" keepMounted>
                      {/* One row however many programs the CMS holds; the helper strip sits below. */}
                      <div className="grid auto-cols-fr grid-flow-col gap-1">
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
                            <span className="font-bold font-display text-[26px] uppercase leading-[26px]">
                              {p.name}
                            </span>
                            <span className="text-muted text-sm">{p.tagline}</span>
                          </NavigationMenu.Link>
                        ))}
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2 bg-surface px-5 py-3">
                        <span className="text-muted text-sm">{programsMenu.helperText}</span>
                        <span className="flex flex-wrap gap-x-8">
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
                sideOffset={-1}
              >
                <NavigationMenu.Popup className="border border-white/10 border-t-white/6 bg-black/92 backdrop-blur-[16px] transition-[clip-path,opacity] duration-250 ease-out [clip-path:inset(0)] data-ending-style:opacity-0 data-ending-style:duration-150 data-ending-style:[clip-path:inset(0_0_100%_0)] data-starting-style:[clip-path:inset(0_0_100%_0)]">
                  <NavigationMenu.Viewport />
                </NavigationMenu.Popup>
              </NavigationMenu.Positioner>
            </NavigationMenu.Portal>
          </NavigationMenu.Root>

          <div className="flex items-center gap-2">
            <BookingTrigger className={cn(buttonStyles({ size: 'sm' }), 'hidden nav:inline-flex')}>
              {cta}
            </BookingTrigger>
            <Dialog.Trigger aria-label="Odpri meni" className={burgerClass}>
              <Menu size={22} />
            </Dialog.Trigger>
          </div>
        </div>
      </div>

      {/* Base UI handles focus trap, Esc, scroll lock and focus return. The desktop dropdown keeps these links in the HTML. */}
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[6px] motion-safe:animate-fade-in nav:hidden" />
        <Dialog.Popup aria-label="Meni" className="fixed inset-x-0 top-0 z-50 outline-none nav:hidden">
          {/* Same frame as the header bar, so the menu opens out of it. */}
          <div className="relative mx-auto max-w-[1328px] px-[clamp(12px,3vw,40px)] pt-3">
            <div className="glass flex flex-col">
              <div className="flex h-16 items-center justify-between gap-4 pr-2.5 pl-5">
                {logo}
                <Dialog.Close aria-label="Zapri meni" className={burgerClass}>
                  <X size={22} />
                </Dialog.Close>
              </div>
              <div className="max-h-[calc(100dvh-92px)] overflow-y-auto overscroll-contain border-white/12 border-t">
                <nav aria-label="Mobilna navigacija" className="flex flex-col bg-black/92 px-5 pt-1 pb-5">
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
                  <BookingTrigger className={cn(buttonStyles({ size: 'md' }), 'mt-6')}>
                    {mobile.ctaLabel}
                  </BookingTrigger>
                  <SocialButtons className="mt-4" socials={socials} />
                </nav>
              </div>
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
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

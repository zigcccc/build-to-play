import Link from 'next/link';
import { routes } from '@/lib/routes';
import { getGlobal } from '@/sanity/queries/global';
import { HeaderNav } from './header-nav';

export async function Header() {
  const { layout, programs, settings, articlesEnabled } = await getGlobal();

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="wrap-wide relative pt-3">
        <HeaderNav
          cta={layout.headerCta}
          logo={
            <Link className="inline-flex min-h-11 items-center" href={routes.home}>
              {/* biome-ignore lint/performance/noImgElement: static SVG logo, no optimisation needed */}
              <img
                alt={`${settings.siteName} — domov`}
                className="block h-8 w-auto"
                height={32}
                src="/brand/logo.svg"
                width={154}
              />
            </Link>
          }
          mobile={layout.mobileMenu}
          nav={layout.nav.filter((item) => articlesEnabled || item.target !== 'articles')}
          programs={programs.map((p) => ({
            num: String(p.order).padStart(2, '0'),
            name: p.name,
            slug: p.slug,
            tagline: p.tagline,
            icon: p.icon,
          }))}
          programsMenu={layout.programsMenu}
          socials={settings.socials}
        />
      </div>
    </header>
  );
}

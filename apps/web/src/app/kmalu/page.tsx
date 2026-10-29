import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CookieSettingsTrigger } from '@/components/preferences/preferences-trigger';
import { routes } from '@/lib/routes';
import { gateKey } from '@/lib/site-gate';
import { currentYear } from '@/lib/year';
import { getGlobal } from '@/sanity/queries/global';
import { getComingSoon } from '@/sanity/queries/legal';

export const metadata: Metadata = { robots: { index: false, follow: false } };

/** What the public sees in place of every page while the pre-launch gate is on (src/proxy.ts). */
export default async function ComingSoonPage() {
  if (!gateKey) notFound();

  const [page, { layout, settings }, year] = await Promise.all([getComingSoon(), getGlobal(), currentYear()]);

  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden">
      {/* biome-ignore lint/performance/noImgElement: static SVG mark, decorative */}
      <img
        alt=""
        aria-hidden
        className="pointer-events-none absolute right-[-12%] bottom-[-8%] w-[clamp(320px,58vw,860px)] select-none opacity-[0.05]"
        height={285}
        src="/brand/mark.svg"
        width={334}
      />
      <div className="wrap relative flex flex-1 flex-col gap-16 pt-[clamp(20px,4vw,40px)] pb-8">
        {/* biome-ignore lint/performance/noImgElement: static SVG logo, no optimisation needed */}
        <img
          alt={settings.siteName}
          className="block h-9 w-auto self-start"
          height={36}
          src="/brand/logo.svg"
          width={173}
        />

        <div className="flex flex-1 flex-col justify-end gap-6">
          <p className="eyebrow">{page.eyebrow}</p>
          <h1 className="d1">{page.heading}</h1>
          <p className="lead max-w-[480px] text-muted">{page.text}</p>
        </div>

        <div className="flex flex-wrap justify-between gap-x-6 gap-y-3 border-hairline border-t pt-6 text-[13px] text-muted leading-5">
          <span>
            © {year} {settings.siteName}
          </span>
          <span className="flex flex-wrap gap-x-6 gap-y-2">
            <Link className="text-muted underline hover:text-ink" href={routes.privacy}>
              {layout.footer.privacyLabel}
            </Link>
            <CookieSettingsTrigger className="cursor-pointer text-muted underline hover:text-ink">
              {layout.footer.cookieSettingsLabel}
            </CookieSettingsTrigger>
          </span>
        </div>
      </div>
    </main>
  );
}

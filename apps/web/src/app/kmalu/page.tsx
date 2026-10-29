import { Mail, Phone } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SocialIcon, socialLabel } from '@/components/icons';
import { CookieSettingsTrigger } from '@/components/preferences/preferences-trigger';
import { routes } from '@/lib/routes';
import { gateKey } from '@/lib/site-gate';
import { currentYear } from '@/lib/year';
import { getGlobal } from '@/sanity/queries/global';
import { getComingSoon } from '@/sanity/queries/legal';

export const metadata: Metadata = { robots: { index: false, follow: false } };

const rowClass = 'flex min-h-16 items-center gap-4 text-ink hover:text-accent';

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

        <div className="flex flex-1 flex-wrap items-end gap-x-[clamp(40px,6vw,96px)] gap-y-12">
          <div className="flex flex-[999_1_480px] flex-col gap-6">
            <p className="eyebrow">{page.eyebrow}</p>
            <h1 className="d1">{page.heading}</h1>
            <p className="lead max-w-[480px] text-muted">{page.text}</p>
          </div>
          <ul className="rows m-0 max-w-[360px] flex-[1_1_260px] list-none p-0">
            <li>
              <a className={rowClass} href={`tel:${settings.phone.e164}`}>
                <Phone aria-hidden className="text-accent" size={20} />
                <span className="font-medium">{settings.phone.display}</span>
              </a>
            </li>
            <li>
              <a className={rowClass} href={`mailto:${settings.email}`}>
                <Mail aria-hidden className="text-accent" size={20} />
                <span className="font-medium">{settings.email}</span>
              </a>
            </li>
            {settings.socials.map((s) => (
              <li key={s.platform}>
                <a
                  aria-label={`${socialLabel[s.platform]}: ${s.handle}`}
                  className={rowClass}
                  href={s.url}
                  rel="noopener"
                  target="_blank"
                >
                  <span className="text-accent">
                    <SocialIcon platform={s.platform} />
                  </span>
                  <span className="font-medium">{s.handle}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap justify-between gap-x-6 gap-y-3 border-hairline border-t pt-6 text-[13px] text-muted leading-5">
          <span>
            © {year} {settings.siteName} · {settings.companyName}
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

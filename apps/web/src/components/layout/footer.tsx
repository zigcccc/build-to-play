import Link from 'next/link';
import { BookingTrigger } from '@/components/booking/booking-trigger';
import { CmsLink } from '@/components/cms-link';
import { SocialIcon, socialLabel } from '@/components/icons';
import { CookieSettingsTrigger } from '@/components/preferences/preferences-trigger';
import { buttonStyles } from '@/components/ui/button';
import { routes } from '@/lib/routes';
import { currentYear } from '@/lib/year';
import { getGlobal } from '@/sanity/queries/global';
import { MobileCtaBar } from './mobile-cta-bar';

const linkClass = 'flex min-h-9 items-center text-[15px] text-ink hover:text-accent';
const captionClass = 'label mb-2';

export async function Footer() {
  const { layout, programs, settings } = await getGlobal();
  const { footer } = layout;
  const year = await currentYear();

  return (
    <>
      <footer className="border-hairline border-t pt-16 pb-28 nav:pb-8">
        <div className="wrap">
          <div className="grid-fit [--gap:40px] [--min:200px]">
            <div className="flex flex-col gap-4">
              <Link className="inline-flex self-start" href={routes.home}>
                {/* biome-ignore lint/performance/noImgElement: static SVG logo */}
                <img
                  alt={`${settings.siteName} — domov`}
                  className="block h-10 w-auto"
                  height={40}
                  src="/brand/logo.svg"
                  width={193}
                />
              </Link>
              <p className="label">{settings.tagline}</p>
            </div>

            <nav aria-label={footer.programsCaption} className="flex flex-col gap-1">
              <p className={captionClass}>{footer.programsCaption}</p>
              {programs.map((p) => (
                <Link className={linkClass} href={routes.program(p.slug)} key={p.slug}>
                  {p.name}
                </Link>
              ))}
              <Link className={linkClass} href={routes.pricing}>
                {footer.pricingLabel}
              </Link>
            </nav>

            <nav aria-label={footer.brandCaption} className="flex flex-col gap-1">
              <p className={captionClass}>{footer.brandCaption}</p>
              {footer.brandLinks.map((link) => (
                <CmsLink className={`${linkClass} cursor-pointer text-left`} key={link.label} link={link} />
              ))}
            </nav>

            <div className="flex flex-col gap-3">
              <p className={`${captionClass} mb-1`}>{footer.followCaption}</p>
              <div className="flex gap-2">
                {settings.socials.map((s) => (
                  <a
                    aria-label={socialLabel[s.platform]}
                    className="inline-flex size-11 items-center justify-center border border-control text-ink hover:border-ink"
                    href={s.url}
                    key={s.platform}
                    rel="noopener"
                    target="_blank"
                  >
                    <SocialIcon platform={s.platform} />
                  </a>
                ))}
              </div>
              <BookingTrigger className={`${buttonStyles({ size: 'sm' })} mt-2 self-start`}>
                {footer.ctaLabel}
              </BookingTrigger>
            </div>
          </div>

          <div className="mt-14 flex flex-wrap justify-between gap-x-6 gap-y-3 border-hairline border-t pt-6 text-[13px] text-muted leading-5">
            <span>
              © {year} {settings.siteName} · {settings.companyName}
            </span>
            <span className="flex flex-wrap gap-x-6 gap-y-2">
              <Link className="text-muted underline hover:text-ink" href={routes.privacy}>
                {footer.privacyLabel}
              </Link>
              <CookieSettingsTrigger className="cursor-pointer text-muted underline hover:text-ink">
                {footer.cookieSettingsLabel}
              </CookieSettingsTrigger>
            </span>
          </div>
        </div>
      </footer>
      <MobileCtaBar callLabel={layout.labels.call} cta={layout.mobileBarCta} phone={settings.phone.e164} />
    </>
  );
}

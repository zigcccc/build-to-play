import { CmsLink } from '@/components/cms-link';
import { AccentHeading } from '@/components/ui/accent-heading';
import { Arrow } from '@/components/ui/arrow';
import { buttonStyles } from '@/components/ui/button';
import { SanityImage } from '@/components/ui/sanity-image';
import { cn } from '@/lib/cn';
import type { HomeData } from '@/sanity/queries/home';

export function HomeHero({ hero }: { hero: HomeData['hero'] }) {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative flex min-h-[720px] flex-col justify-end overflow-hidden border-hairline border-b"
      data-hero
    >
      <SanityImage className="-scale-x-100 object-[40%_35%]" fill image={hero.image} preload sizes="100vw" />
      <div
        aria-hidden
        className="-translate-y-1/2 absolute top-1/2 right-[-4%] select-none font-bold font-display text-[clamp(520px,62vw,980px)] text-transparent leading-[0.8] [-webkit-text-stroke:1.5px_rgb(179_154_114/0.35)]"
      >
        2
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(4_5_6/0.75)_0%,rgb(4_5_6/0.25)_55%,rgb(4_5_6/0)_100%),linear-gradient(180deg,rgb(4_5_6/0.35)_0%,rgb(4_5_6/0.3)_40%,#040506_96%)]" />

      <div className="wrap relative pt-[140px] pb-10">
        <p className="glass mb-6 inline-flex items-center gap-2.5 py-2 pr-3.5 pl-3 font-medium text-[13px] leading-[18px]">
          <span className="size-2 flex-none bg-accent" />
          {hero.badge}
        </p>
        <h1
          className="m-0 font-bold font-display text-[clamp(64px,10vw,152px)] uppercase leading-[0.88] tracking-[0.005em]"
          id="hero-title"
        >
          <AccentHeading value={hero.heading} />
        </h1>
        <p className="lead mt-7 max-w-[560px]">{hero.lead}</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <CmsLink
            className={cn(buttonStyles({ size: 'lg' }), 'group flex-[1_1_100%] cta:flex-none')}
            link={hero.primaryCta}
          >
            {hero.primaryCta.label}
            <Arrow />
          </CmsLink>
          {hero.secondaryCta && (
            <CmsLink
              className={cn(buttonStyles({ variant: 'glass', size: 'lg' }), 'flex-[1_1_100%] cta:flex-none')}
              link={hero.secondaryCta}
            />
          )}
        </div>
        <dl className="mt-16 grid-fit border-hairline border-t [--gap:0px] [--min:220px]">
          {hero.stats.map((stat) => (
            <div className="pt-5 pr-6" key={stat.value}>
              <dt className="font-display font-semibold text-[30px] uppercase leading-[34px]">{stat.value}</dt>
              <dd className="mt-1 text-muted text-sm">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

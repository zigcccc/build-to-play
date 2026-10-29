import { Quote } from 'lucide-react';
import { CmsLink } from '@/components/cms-link';
import { Arrow } from '@/components/ui/arrow';
import { buttonStyles } from '@/components/ui/button';
import { NumberedList } from '@/components/ui/numbered-list';
import { SectionHeader } from '@/components/ui/section-header';
import { Tabs } from '@/components/ui/tabs';
import type { HomeData } from '@/sanity/queries/home';

type Tab = HomeData['results']['tabs'][number];

function chart(points: number[]) {
  const step = 320 / Math.max(points.length - 1, 1);
  const coords = points.map((v, i) => `${(i * step).toFixed(1)},${(110 - v).toFixed(1)}`);
  return { line: coords.join(' '), area: `M0,110 L${coords.join(' L')} L320,110 Z` };
}

function Report({ tab, data }: { tab: Tab; data: HomeData['results'] }) {
  const { line, area } = chart(tab.points);
  return (
    <div className="relative">
      <div aria-hidden className="absolute inset-x-[10%] inset-y-[14%] bg-accent opacity-22 blur-[80px]" />
      <figure className="glass relative m-0 flex flex-col gap-5 p-[clamp(20px,3vw,32px)]">
        <div className="flex items-center justify-between gap-3">
          <span className="label">{data.reportEyebrow}</span>
          <span className="rounded-full border border-white/22 px-3 py-1 font-medium text-xs">{tab.label}</span>
        </div>
        <p className="h3c">{data.reportTitle}</p>
        <div>
          <div className="relative h-[140px]">
            <svg aria-hidden className="absolute inset-0 size-full" preserveAspectRatio="none" viewBox="0 0 320 120">
              <line
                stroke="rgb(255 255 255 / 0.08)"
                vectorEffect="non-scaling-stroke"
                x1="0"
                x2="320"
                y1="10"
                y2="10"
              />
              <line
                stroke="rgb(255 255 255 / 0.08)"
                vectorEffect="non-scaling-stroke"
                x1="0"
                x2="320"
                y1="60"
                y2="60"
              />
              <line
                stroke="rgb(255 255 255 / 0.16)"
                vectorEffect="non-scaling-stroke"
                x1="0"
                x2="320"
                y1="110"
                y2="110"
              />
            </svg>
            <svg
              aria-label={`${data.reportTitle} – ${tab.label}`}
              className="absolute inset-0 size-full motion-safe:animate-chart-reveal"
              preserveAspectRatio="none"
              role="img"
              viewBox="0 0 320 120"
            >
              <path d={area} fill="rgb(179 154 114 / 0.16)" />
              <polyline
                fill="none"
                points={line}
                stroke="#b39a72"
                strokeLinejoin="miter"
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
          <div className="mt-2 flex justify-between text-muted text-xs">
            {data.chartLabels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>
        <ul className="m-0 flex list-none flex-col p-0">
          {tab.metrics.map((m, i) => (
            <li
              className="flex items-center justify-between gap-4 border-white/10 border-t py-3.5 motion-safe:animate-rise"
              key={m._key}
              style={{ animationDelay: `${300 + i * 120}ms` }}
            >
              <span className="flex min-w-0 flex-col">
                <span className="text-[13px] text-muted leading-[18px]">{m.label}</span>
                <span className="font-semibold text-[17px]">
                  {m.from} → {m.to}
                </span>
              </span>
              <span className="flex-none bg-accent/14 px-2.5 py-1 font-semibold text-accent text-sm">{m.delta}</span>
            </li>
          ))}
        </ul>
        <figcaption className="text-muted text-xs">{data.caption}</figcaption>
      </figure>
    </div>
  );
}

export function Results({ data }: { data: HomeData['results'] }) {
  const testimonial = data.testimonials?.[0];
  return (
    <section aria-labelledby="rezultati-title" className="sec" id="rezultati">
      <div className="wrap">
        <SectionHeader aside={<p>{data.intro}</p>} eyebrow={data.eyebrow} heading={data.heading} id="rezultati-title" />
        <Tabs
          className="gap-y-7"
          items={data.tabs.map((tab) => ({
            value: tab.programKey,
            label: tab.label,
            panel: (
              <div className="grid-fit items-start [--gap:clamp(40px,6vw,96px)] [--min:440px]">
                <div className="flex flex-col gap-7">
                  <p className="lead">{tab.description}</p>
                  <NumberedList items={data.steps} />
                </div>
                <Report data={data} tab={tab} />
              </div>
            ),
          }))}
          label="Program"
          listClassName="w-full max-w-[min(100%,520px)]"
        />
        {testimonial && (
          <figure className="mt-[clamp(64px,8vw,112px)] flex flex-wrap items-start gap-x-16 gap-y-6 border-hairline border-t pt-[clamp(40px,5vw,64px)]">
            <Quote aria-hidden className="flex-none text-accent" size={48} strokeWidth={1.25} />
            <div className="min-w-0 max-w-[880px] flex-[1_1_520px]">
              <blockquote className="m-0 text-pretty font-medium text-[clamp(22px,2.6vw,32px)] leading-[1.35]">
                „{testimonial.quote}“
              </blockquote>
              <figcaption className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2">
                <span className="font-semibold text-[15px]">{testimonial.name}</span>
                {(testimonial.program || testimonial.place) && (
                  <span className="text-muted text-sm">
                    {[testimonial.program, testimonial.place].filter(Boolean).join(' · ')}
                  </span>
                )}
                {data.moreTestimonials && (
                  <CmsLink
                    className={`${buttonStyles({ variant: 'text' })} group ml-auto gap-2`}
                    link={data.moreTestimonials}
                  >
                    {data.moreTestimonials.label}
                    <Arrow />
                  </CmsLink>
                )}
              </figcaption>
            </div>
          </figure>
        )}
      </div>
    </section>
  );
}

import { Check } from 'lucide-react';
import Link from 'next/link';
import { CmsIcon } from '@/components/icons';
import { Arrow } from '@/components/ui/arrow';
import { formatPrice } from '@/lib/price';
import { routes } from '@/lib/routes';
import type { ProgramCard } from '@/sanity/models';

type Labels = { priceFrom: string; moreAboutProgram: string };

export function ProgramCards({ programs, labels }: { programs: ProgramCard[]; labels: Labels }) {
  return (
    <div className="grid-fit border border-hairline bg-hairline [--gap:1px] [--min:340px]">
      {programs.map((p) => (
        <article className="flex flex-col gap-6 bg-black p-[clamp(24px,3vw,40px)]" key={p._id}>
          <div className="flex items-center justify-between">
            <span className="num">{String(p.order).padStart(2, '0')}</span>
            <CmsIcon name={p.icon} size={28} />
          </div>
          <h3 className="m-0 font-bold font-display text-4xl uppercase leading-9">{p.name}</h3>
          <p className="text-muted">{p.cardDescription}</p>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {p.cardBullets.map((bullet) => (
              <li className="flex gap-3 text-[15px] leading-[22px]" key={bullet}>
                <Check aria-hidden className="mt-0.5 shrink-0 text-accent" size={18} />
                {bullet}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-col gap-5 border-hairline border-t pt-6">
            <div>
              <span className="label block">{labels.priceFrom}</span>
              <span className="mt-1.5 flex items-baseline gap-2">
                <span className="font-bold font-display text-[52px] leading-[52px]">{formatPrice(p.priceFrom)}</span>
                <span className="text-muted text-sm">{p.priceFrom.unit}</span>
              </span>
            </div>
            <Link
              className="group flex min-h-[52px] items-center justify-between border border-control px-5 font-bold text-[13px] text-ink uppercase tracking-[0.14em] hover:border-ink"
              href={routes.program(p.slug)}
            >
              {labels.moreAboutProgram}
              <span className="sr-only">: {p.name}</span>
              <Arrow />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

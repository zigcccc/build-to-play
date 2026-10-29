import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Props = {
  eyebrow: string;
  heading: ReactNode;
  id?: string;
  /** Right-hand content (intro text and/or a link) shown beside the heading on wide screens. */
  aside?: ReactNode;
  className?: string;
};

export function SectionHeader({ eyebrow, heading, id, aside, className }: Props) {
  return (
    <div
      className={cn('mb-[clamp(40px,5vw,64px)] flex flex-wrap items-end justify-between gap-x-12 gap-y-6', className)}
    >
      <div className="flex max-w-[640px] flex-col gap-5">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="h2" id={id}>
          {heading}
        </h2>
      </div>
      {aside && <div className="flex max-w-[400px] flex-col items-start gap-3 text-muted">{aside}</div>}
    </div>
  );
}

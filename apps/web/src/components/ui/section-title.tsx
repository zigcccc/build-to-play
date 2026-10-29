import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Props = {
  eyebrow: string;
  heading: ReactNode;
  id: string;
  className?: string;
  /** Whatever follows the heading in the same column (lead, list, link). */
  children?: ReactNode;
};

/** Eyebrow + H2, the opening of every content section. The section's aria-labelledby points at `id`. */
export function SectionTitle({ eyebrow, heading, id, className, children }: Props) {
  return (
    <div className={cn('flex flex-col gap-5', className)}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="h2" id={id}>
        {heading}
      </h2>
      {children}
    </div>
  );
}

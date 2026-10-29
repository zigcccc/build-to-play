import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';

/** Arrow that nudges right when its `group` parent is hovered. */
export function Arrow({ className, size = 18 }: { className?: string; size?: number }) {
  return (
    <ArrowRight
      aria-hidden
      className={cn('shrink-0 transition-transform duration-200 group-hover:translate-x-1', className)}
      size={size}
    />
  );
}

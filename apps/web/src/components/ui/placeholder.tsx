import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

/** Striped stand-in for photos that haven't been shot yet (design `.ph`). */
export function Placeholder({ className, label }: { className?: string; label?: string }) {
  return (
    <div
      aria-hidden
      className={cn('ph flex items-center justify-center gap-2 p-3 text-center text-muted text-xs', className)}
    >
      <ImageIcon size={18} />
      {label && <span>{label}</span>}
    </div>
  );
}

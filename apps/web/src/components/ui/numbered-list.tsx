import { cn } from '@/lib/cn';
import { twoDigit } from '@/lib/number';

type Item = { title: string; text: string };

/** `01 / Title / text` rows separated by hairlines (about teaser, results steps). */
export function NumberedList({
  items,
  size = 'sm',
  className,
}: {
  items: Item[];
  size?: 'sm' | 'lg';
  className?: string;
}) {
  const lg = size === 'lg';
  return (
    <ol className={cn('m-0 flex list-none flex-col p-0 rows', className)}>
      {items.map((item, i) => (
        <li
          className={cn('grid gap-2', lg ? 'grid-cols-[72px_1fr] py-7' : 'grid-cols-[56px_1fr] py-[18px]')}
          key={item.title}
        >
          <span
            className={cn(
              'font-display text-accent',
              lg ? 'font-bold text-[44px] leading-[44px]' : 'font-semibold text-[22px] leading-6'
            )}
          >
            {twoDigit(i + 1)}
          </span>
          <span>
            <strong className={cn('block font-semibold', lg ? 'text-xl leading-7' : 'text-base leading-6')}>
              {item.title}
            </strong>
            <span className={cn('text-muted', lg ? 'mt-1 block text-base leading-6' : 'text-sm leading-5')}>
              {item.text}
            </span>
          </span>
        </li>
      ))}
    </ol>
  );
}

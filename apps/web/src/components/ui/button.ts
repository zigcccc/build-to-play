import { cva, type VariantProps } from 'class-variance-authority';

/** Square, uppercase, tracked buttons from the design system (`.btn` + `.gold` / `.line`). */
export const buttonStyles = cva(
  'inline-flex cursor-pointer items-center justify-center gap-2.5 text-center font-bold text-[13px] uppercase tracking-[0.14em] no-underline transition-colors disabled:cursor-not-allowed disabled:opacity-55',
  {
    variants: {
      variant: {
        gold: 'bg-accent text-black hover:bg-accent-hover hover:text-black',
        line: 'border border-control bg-transparent text-ink hover:border-ink hover:text-ink',
        glass: 'glass text-ink hover:border-white/30 hover:bg-black/80 hover:text-ink',
        text: 'min-h-11 px-0 text-accent hover:text-accent-hover',
      },
      size: {
        sm: 'min-h-11 px-[18px] text-xs',
        md: 'min-h-[52px] px-6',
        lg: 'min-h-14 px-7',
      },
      block: { true: 'w-full' },
    },
    compoundVariants: [{ variant: 'text', className: 'min-h-11 px-0' }],
    defaultVariants: { variant: 'gold', size: 'md' },
  }
);

export type ButtonStyleProps = VariantProps<typeof buttonStyles>;

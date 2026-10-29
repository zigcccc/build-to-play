import { Fragment } from 'react';

export function Marquee({ items }: { items: string[] }) {
  // Two copies so the -50% translate loops seamlessly.
  const loop = [...items, ...items];
  return (
    <div aria-hidden className="overflow-hidden border-hairline border-b py-[18px]">
      <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap font-display font-semibold text-[28px] uppercase leading-8 motion-reduce:animate-none">
        {loop.map((item, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: duplicated static list
          <Fragment key={i}>
            <span>{item}</span>
            <span className="size-2 flex-none bg-accent" />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

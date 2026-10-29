'use client';

import { useEffect, useState } from 'react';

type Props = { label: string; items: { id: string; label: string }[] };

const OFFSET = 140;

/** Article table of contents with scroll-spy (aria-current on the section in view). */
export function Toc({ label, items }: Props) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    // Active = the last heading that has scrolled past the fixed header.
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = items[0]?.id;
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= OFFSET) current = item.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [items]);

  return (
    <nav aria-label={label}>
      <p className="eyebrow mb-2">{label}</p>
      {items.map((item) => (
        <a
          aria-current={active === item.id ? 'true' : undefined}
          className="block py-2 text-[15px] text-muted leading-[22px] hover:text-ink aria-[current=true]:text-accent"
          href={`#${item.id}`}
          key={item.id}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

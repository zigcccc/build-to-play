'use client';

import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { type ReactNode, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

export type TabItem = { value: string; label: string; panel: ReactNode };

type Props = {
  items: TabItem[];
  label: string;
  className?: string;
  listClassName?: string;
  /** Per-tab node rendered next to the tab list (e.g. a link that depends on the active tab). */
  aside?: Record<string, ReactNode>;
  /** Per-tab node rendered after the panels on its own row (give it `w-full`). */
  after?: Record<string, ReactNode>;
};

/** Just below the fixed header (12 px offset + 66 px bar + 8 px breathing room). */
const STICKY_TOP = 86;

/**
 * Tabs whose panels are server-rendered and kept mounted, so every panel is in the HTML.
 * The tab list sticks below the header while its panels are on screen; the root is the flex
 * container so the list's sticky range spans all panels.
 */
export function Tabs({ items, label, className, listClassName, aside, after }: Props) {
  const [value, setValue] = useState(items[0]?.value ?? '');
  const root = useRef<HTMLDivElement>(null);

  const onValueChange = (next: unknown) => {
    setValue(String(next));
    // When the list is stuck, bring the new panel's start into view instead of leaving the reader mid-panel.
    // Instant on purpose: an in-flight smooth scroll makes iOS swallow the next tap.
    const top = root.current?.getBoundingClientRect().top ?? 0;
    if (top < STICKY_TOP - 1) window.scrollBy({ top: top - STICKY_TOP });
  };

  return (
    <BaseTabs.Root
      className={cn('flex flex-wrap items-center justify-between gap-x-4', className)}
      onValueChange={onValueChange}
      ref={root}
      value={value}
    >
      <BaseTabs.List
        aria-label={label}
        className={cn(
          // Equal widths while the labels fit; past that (narrow phones, long CMS labels) the bar scrolls sideways.
          'sticky top-[86px] z-30 grid auto-cols-[minmax(max-content,1fr)] grid-flow-col gap-1 overflow-x-auto border border-hairline bg-surface p-1 shadow-[0_8px_24px_rgb(0_0_0/0.5)] [scrollbar-width:none]',
          listClassName
        )}
      >
        {items.map((item) => (
          <BaseTabs.Tab
            className="min-h-11 cursor-pointer px-2 font-bold text-[13px] text-ink uppercase tracking-[0.08em] sheet:tracking-[0.14em] transition-colors hover:bg-white/6 data-active:bg-accent data-active:text-black data-active:hover:bg-accent-hover"
            key={item.value}
            value={item.value}
          >
            {item.label}
          </BaseTabs.Tab>
        ))}
      </BaseTabs.List>
      {aside?.[value]}
      {items.map((item) => (
        <BaseTabs.Panel className="w-full outline-none" keepMounted key={item.value} value={item.value}>
          {item.panel}
        </BaseTabs.Panel>
      ))}
      {after?.[value]}
    </BaseTabs.Root>
  );
}

'use client';

import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { type ReactNode, useState } from 'react';
import { cn } from '@/lib/cn';

export type TabItem = { value: string; label: string; panel: ReactNode };

type Props = {
  items: TabItem[];
  label: string;
  className?: string;
  listClassName?: string;
  /** Per-tab node rendered next to the tab list (e.g. a link that depends on the active tab). */
  aside?: Record<string, ReactNode>;
  /** Per-tab node rendered after the panels (e.g. a mobile-only link below the packages). */
  after?: Record<string, ReactNode>;
};

/** Tabs whose panels are server-rendered and kept mounted, so every panel is in the HTML. */
export function Tabs({ items, label, className, listClassName, aside, after }: Props) {
  const [value, setValue] = useState(items[0]?.value ?? '');
  return (
    <BaseTabs.Root className={className} onValueChange={(next) => setValue(String(next))} value={value}>
      {
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <BaseTabs.List
              aria-label={label}
              className={cn(
                'grid grid-flow-col auto-cols-fr gap-1 border border-hairline bg-surface p-1',
                listClassName
              )}
            >
              {items.map((item) => (
                <BaseTabs.Tab
                  className="min-h-11 cursor-pointer px-2 font-bold text-[13px] text-ink uppercase tracking-[0.14em] transition-colors hover:bg-white/6 data-active:bg-accent data-active:text-black data-active:hover:bg-accent-hover"
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </BaseTabs.Tab>
              ))}
            </BaseTabs.List>
            {aside?.[value]}
          </div>
          {items.map((item) => (
            <BaseTabs.Panel className="outline-none" keepMounted key={item.value} value={item.value}>
              {item.panel}
            </BaseTabs.Panel>
          ))}
          {after?.[value]}
        </>
      }
    </BaseTabs.Root>
  );
}

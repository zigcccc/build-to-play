'use client';

import { Accordion } from '@base-ui/react/accordion';
import { Minus, Plus } from 'lucide-react';
import type { ReactNode } from 'react';

type Item = { id: string; question: string; answer: ReactNode };

/** Single-open FAQ; closed answers stay in the DOM (hidden="until-found") for crawlers and find-in-page. */
export function FaqAccordion({ items }: { items: Item[] }) {
  return (
    <Accordion.Root className="rows" defaultValue={items[0] ? [items[0].id] : []} hiddenUntilFound>
      {items.map((item) => (
        <Accordion.Item key={item.id} value={item.id}>
          <Accordion.Header render={(props) => <h3 {...props} />}>
            <Accordion.Trigger className="group flex min-h-18 w-full cursor-pointer items-center justify-between gap-6 py-5 text-left font-semibold text-lg text-ink leading-[26px] hover:text-accent">
              {item.question}
              <Plus aria-hidden className="shrink-0 text-accent group-data-panel-open:hidden" size={22} />
              <Minus aria-hidden className="hidden shrink-0 text-accent group-data-panel-open:block" size={22} />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel className="pb-6 text-muted leading-[26px]">{item.answer}</Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

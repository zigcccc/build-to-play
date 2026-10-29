import Link from 'next/link';
import { SimpleText } from '@/components/portable-text';
import { FaqAccordion } from '@/components/ui/faq-accordion';
import { SectionTitle } from '@/components/ui/section-title';
import { routes } from '@/lib/routes';
import type { FaqValue } from '@/sanity/models';

type Props = {
  eyebrow: string;
  heading: string;
  faqs: FaqValue[];
  help: { text: string; link: string };
};

export function FaqSection({ eyebrow, heading, faqs, help }: Props) {
  return (
    <section aria-labelledby="faq-title" className="sec border-hairline border-t">
      <div className="wrap grid-fit items-start [--gap:clamp(32px,6vw,96px)] [--min:380px]">
        <SectionTitle eyebrow={eyebrow} heading={heading} id="faq-title">
          <p className="text-muted">
            {help.text}{' '}
            <Link className="text-link" href={routes.contact}>
              {help.link}
            </Link>
          </p>
        </SectionTitle>
        <FaqAccordion
          items={faqs.map((faq) => ({
            id: faq._id,
            question: faq.question,
            answer: <SimpleText className="flex flex-col gap-3 pr-10" value={faq.answer} />,
          }))}
        />
      </div>
    </section>
  );
}

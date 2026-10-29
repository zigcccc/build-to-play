import { PortableText, type PortableTextComponents } from 'next-sanity';
import type { CmsLinkValue, PortableTextValue } from '@/sanity/models';
import { CmsLink } from './cms-link';

type LinkMark = Omit<CmsLinkValue, 'label'>;

const linkMark: PortableTextComponents['marks'] = {
  link: ({ value, children }) => (
    <CmsLink
      className="cursor-pointer text-accent underline underline-offset-2 hover:text-accent-hover"
      fallback={children}
      link={value as LinkMark}
    >
      {children}
    </CmsLink>
  ),
};

const simple: PortableTextComponents = {
  block: { normal: ({ children }) => <p>{children}</p> },
  list: { bullet: ({ children }) => <ul className="list-disc pl-5 marker:text-accent">{children}</ul> },
  marks: {
    ...linkMark,
    strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
  },
};

/** Short rich text (FAQ answers, leads): paragraphs, bold, bullet lists, links. */
export function SimpleText({ value, className }: { value: PortableTextValue; className?: string }) {
  return (
    <div className={className}>
      <PortableText components={simple} value={value as never} />
    </div>
  );
}

const inline: PortableTextComponents = {
  block: { normal: ({ children }) => <>{children}</> },
  marks: { ...linkMark, strong: ({ children }) => <strong className="font-semibold">{children}</strong> },
};

/** A single paragraph rendered without a wrapping <p> (labels, inline leads). */
export function InlineText({ value }: { value: PortableTextValue }) {
  return <PortableText components={inline} value={value as never} />;
}

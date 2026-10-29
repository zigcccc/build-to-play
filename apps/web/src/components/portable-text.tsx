import { PortableText, type PortableTextComponents } from 'next-sanity';
import type { CmsLinkValue, PortableTextValue } from '@/sanity/models';
import { CmsLink } from './cms-link';

type LinkMark = Omit<CmsLinkValue, 'label'>;

/** Marks every rich text shares. A link that can't resolve (no target, Nasveti off) keeps its words as plain text. */
export const marks = {
  link: ({ value, children }) => (
    <CmsLink
      className="cursor-pointer text-accent underline underline-offset-2 hover:text-accent-hover"
      fallback={children}
      link={value as LinkMark}
    >
      {children}
    </CmsLink>
  ),
  strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
  em: ({ children }) => <em>{children}</em>,
} satisfies PortableTextComponents['marks'];

const simple: PortableTextComponents = {
  block: { normal: ({ children }) => <p>{children}</p> },
  list: { bullet: ({ children }) => <ul className="list-disc pl-5 marker:text-accent">{children}</ul> },
  marks,
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
  // Inline text sits inside labels and leads, so bold keeps their colour.
  marks: { ...marks, strong: ({ children }) => <strong className="font-semibold">{children}</strong> },
};

/** A single paragraph rendered without a wrapping <p> (labels, inline leads). */
export function InlineText({ value }: { value: PortableTextValue }) {
  return <PortableText components={inline} value={value as never} />;
}

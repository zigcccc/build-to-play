import { Fragment } from 'react';
import type { AccentHeadingValue } from '@/sanity/models';

/** Renders CMS headings where words marked `accent` are gold and each block is a new line. */
export function AccentHeading({ value }: { value: AccentHeadingValue }) {
  return value.map((line, i) => (
    <Fragment key={line._key}>
      {i > 0 && <br />}
      {line.children.map((span, j) =>
        span.marks?.includes('accent') ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: spans are static text runs
          <span className="text-accent" key={j}>
            {span.text}
          </span>
        ) : (
          // biome-ignore lint/suspicious/noArrayIndexKey: spans are static text runs
          <Fragment key={j}>{span.text}</Fragment>
        )
      )}
    </Fragment>
  ));
}

export const accentHeadingText = (value: AccentHeadingValue) =>
  value.map((line) => line.children.map((span) => span.text).join('')).join(' ');

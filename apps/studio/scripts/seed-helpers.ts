import { randomUUID } from 'node:crypto';

export const key = () => randomUUID().replaceAll('-', '').slice(0, 12);

/** Adds `_key` to every object in an array (Sanity requirement). */
export const keyed = <T extends object>(items: T[]) => items.map((item) => ({ _key: key(), ...item }));

type Span = string | [text: string, ...marks: string[]];

const spans = (parts: Span[]) =>
  parts.map((part) => {
    const [text, ...marks] = typeof part === 'string' ? [part] : part;
    return { _type: 'span', _key: key(), text, marks };
  });

export const block = (parts: Span[] | string, style = 'normal', extra: Record<string, unknown> = {}) => ({
  _type: 'block',
  _key: key(),
  style,
  markDefs: [],
  children: spans(typeof parts === 'string' ? [parts] : parts),
  ...extra,
});

export const listItem = (parts: Span[] | string, listItem: 'bullet' | 'number' = 'bullet') =>
  block(parts, 'normal', { listItem, level: 1 });

/** Block with link annotations: pass `[text, markKey]` spans and the matching markDefs. */
export const linkedBlock = (parts: Span[], markDefs: Record<string, unknown>[], style = 'normal') => ({
  ...block(parts, style),
  markDefs,
});

/** One line per entry; wrap words in ['word', 'accent'] to highlight them in gold. */
export const accent = (...lines: Span[][]) => lines.map((line) => block(line));

export const link = (label: string, kind: string, extra: Record<string, unknown> = {}) => ({
  _type: 'link',
  label,
  kind,
  ...extra,
});

export const ref = (id: string) => ({ _type: 'reference', _ref: id });
export const refs = (ids: string[]) => ids.map((id) => ({ _key: key(), ...ref(id) }));

export const slug = (current: string) => ({ _type: 'slug', current });

export const titled = (items: [title: string, text: string][]) =>
  keyed(items.map(([title, text]) => ({ _type: 'titledText', title, text })));

export const stats = (items: [value: string, label: string][]) =>
  keyed(items.map(([value, label]) => ({ _type: 'stat', value, label })));

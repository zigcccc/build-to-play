import { Fragment, type ReactNode } from 'react';

export type Variables = Record<string, string>;

const PATTERN = /\{(\w+)\}/g;

/**
 * The one placeholder syntax for CMS copy: `{name}`. Site-wide values (`{rok}`, `{email}` …) are filled in by
 * sanityFetch; components pass their own on top (`{poslano}`, `{n}`). Unknown placeholders stay as written.
 */
export const interpolate = (text: string, vars: Variables) =>
  text.replace(PATTERN, (match, key: string) => vars[key] ?? match);

/** Like interpolate, but a placeholder can become markup (e.g. a mailto link). */
export function interpolateNodes(text: string, nodes: Record<string, ReactNode>): ReactNode {
  return text.split(/(\{\w+\})/).map((part, i) => {
    const node = nodes[part.slice(1, -1)];
    // biome-ignore lint/suspicious/noArrayIndexKey: fixed split of a static string
    return <Fragment key={i}>{part.startsWith('{') && node !== undefined ? node : part}</Fragment>;
  });
}

/** Marks up a value that is already in the text, e.g. the address `{email}` was filled with by sanityFetch. */
export function markUp(text: string, value: string, node: ReactNode): ReactNode {
  const [before, ...after] = text.split(value);
  if (!after.length) return text;
  return (
    <>
      {before}
      {node}
      {after.join(value)}
    </>
  );
}

/** Applies `fn` to every string in a fetched CMS value. */
export function mapStrings<T>(value: T, fn: (text: string) => string): T {
  if (typeof value === 'string') return fn(value) as T;
  if (Array.isArray(value)) return value.map((item) => mapStrings(item, fn)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, mapStrings(v, fn)])) as T;
  }
  return value;
}

// The brand name must never wrap across lines on the page.
const BRAND = /Build 2 Play/g;

/** Visible copy only: machine-readable output (metadata, JSON-LD, llms.txt, e-mail) keeps plain spaces. */
export const keepBrandTogether = (text: string) => text.replace(BRAND, 'Build 2 Play');

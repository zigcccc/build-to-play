export type Variables = Record<string, string>;

const PATTERN = /\{(\w+)\}/g;

export const interpolate = (text: string, vars: Variables) =>
  text.replace(PATTERN, (match, key: string) => vars[key] ?? match);

// The brand name must never wrap across lines.
const BRAND = /Build 2 Play/g;
const BRAND_NBSP = 'Build\u00a02\u00a0Play';

const polish = (text: string, vars: Variables) =>
  (text.includes('{') ? interpolate(text, vars) : text).replace(BRAND, BRAND_NBSP);

/** Recursively fills `{var}` placeholders (and keeps the brand name together) in every CMS string. */
export function fillVariables<T>(value: T, vars: Variables): T {
  if (typeof value === 'string') return polish(value, vars) as T;
  if (Array.isArray(value)) return value.map((item) => fillVariables(item, vars)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, fillVariables(v, vars)])) as T;
  }
  return value;
}

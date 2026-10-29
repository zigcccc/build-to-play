export type Variables = Record<string, string>;

const PATTERN = /\{(\w+)\}/g;

export const interpolate = (text: string, vars: Variables) =>
  text.replace(PATTERN, (match, key: string) => vars[key] ?? match);

/** Recursively fills `{var}` placeholders in every string of a CMS response. */
export function fillVariables<T>(value: T, vars: Variables): T {
  if (typeof value === 'string') return (value.includes('{') ? interpolate(value, vars) : value) as T;
  if (Array.isArray(value)) return value.map((item) => fillVariables(item, vars)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, fillVariables(v, vars)])) as T;
  }
  return value;
}

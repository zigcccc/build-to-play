import { stegaClean } from 'next-sanity';
import type { Graph } from 'schema-dts';

/** Structured data for search engines and AI assistants. Stega markers are stripped. */
export function JsonLd({ data }: { data: Graph }) {
  const json = JSON.stringify(stegaClean(data))
    .replace(/\u00a0/g, ' ')
    .replace(/</g, '\\u003c');
  // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be injected as raw script content
  return <script dangerouslySetInnerHTML={{ __html: json }} type="application/ld+json" />;
}

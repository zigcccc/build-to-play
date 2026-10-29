import { stegaClean } from 'next-sanity';
import type { Graph } from 'schema-dts';

/**
 * Structured data for search engines and AI assistants. It's built from the page's visible copy, so the stega
 * markers and the brand name's non-breaking spaces (see sanityFetch) come out here.
 */
export function JsonLd({ data }: { data: Graph }) {
  const json = JSON.stringify(stegaClean(data))
    .replace(/\u00a0/g, ' ')
    .replace(/</g, '\\u003c');
  // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be injected as raw script content
  return <script dangerouslySetInnerHTML={{ __html: json }} type="application/ld+json" />;
}

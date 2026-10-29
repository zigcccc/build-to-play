import type { CacheTag } from '@b2p/shared';

/**
 * Reusable GROQ projections. Keep in sync with the Zod models in ./models.ts.
 * A fragment that dereferences other documents exports their `_type`s as `*_TAGS`; spread those into the tags of
 * every query that uses it, so a renamed slug can't leave stale links behind.
 */

const ASSET = /* groq */ `asset->{ _id, url, "lqip": metadata.lqip, "width": metadata.dimensions.width, "height": metadata.dimensions.height }`;

export const IMAGE = /* groq */ `{ alt, caption, crop, hotspot, "asset": ${ASSET} }`;

export const LINK = /* groq */ `{
  label,
  kind,
  page,
  url,
  anchor,
  "programSlug": program->slug.current,
  "articleSlug": article->slug.current
}`;
export const LINK_TAGS = ['program', 'article'] as const satisfies readonly CacheTag[];

/** Portable text with internal link annotations resolved to slugs. */
export const PORTABLE_TEXT = /* groq */ `[]{
  ...,
  markDefs[]{ ..., _type == "link" => { "programSlug": program->slug.current, "articleSlug": article->slug.current } },
  _type == "captionedImage" => { "asset": ${ASSET} }
}`;
export const PORTABLE_TEXT_TAGS = ['program', 'article'] as const satisfies readonly CacheTag[];

export const CTA_CARD = /* groq */ `{ eyebrow, heading, text, primary${LINK}, secondary${LINK} }`;
export const CTA_CARD_TAGS = LINK_TAGS;

export const SEO = /* groq */ `{ title, description, noIndex, "ogImage": ogImage${IMAGE} }`;

// Same price shape as a program's priceFrom, so formatPrice takes one shape.
export const PACKAGE = /* groq */ `{ _key, name, "amount": price, "label": priceLabel, unit, note, features, ctaLabel, "featured": coalesce(featured, false) }`;

export const PROGRAM_CARD_FIELDS = /* groq */ `
  _id, name, "slug": slug.current, shortLabel, pricingLabel, icon, tagline,
  cardDescription, cardBullets, otherShort, priceFrom`;

export const PROGRAM_CARD = `{${PROGRAM_CARD_FIELDS}}`;

export const FAQ = /* groq */ `{ _id, question, answer${PORTABLE_TEXT} }`;
export const FAQ_TAGS = ['faq', ...PORTABLE_TEXT_TAGS] as const satisfies readonly CacheTag[];

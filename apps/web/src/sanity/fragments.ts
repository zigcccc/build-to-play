/** Reusable GROQ projections. Keep in sync with the Zod models in ./models.ts. */

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

/** Portable text with internal link annotations resolved to slugs. */
export const PORTABLE_TEXT = /* groq */ `[]{
  ...,
  markDefs[]{ ..., _type == "link" => { "programSlug": program->slug.current, "articleSlug": article->slug.current } },
  _type == "captionedImage" => { "asset": ${ASSET} }
}`;

export const CTA_CARD = /* groq */ `{ eyebrow, heading, text, primary${LINK}, secondary${LINK} }`;

export const SEO = /* groq */ `{ title, description, noIndex, "ogImage": ogImage${IMAGE} }`;

export const PACKAGE = /* groq */ `{ _key, name, price, priceLabel, unit, note, features, ctaLabel, "featured": coalesce(featured, false) }`;

export const PROGRAM_CARD_FIELDS = /* groq */ `
  _id, name, "slug": slug.current, shortLabel, pricingLabel, icon, tagline,
  cardDescription, cardBullets, otherShort, priceFrom, "order": order`;

export const PROGRAM_CARD = `{${PROGRAM_CARD_FIELDS}}`;

export const FAQ = /* groq */ `{ _id, question, answer${PORTABLE_TEXT} }`;

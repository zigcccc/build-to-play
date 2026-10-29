import { iconName, linkKind, pageKey } from '@b2p/shared';
import { stegaClean } from 'next-sanity';
import { z } from 'zod';

/**
 * CMS values that drive logic (enums) must be compared without stega markers.
 * Draft mode encodes strings for click-to-edit; this strips them before validation.
 */
export const cmsEnum = <T extends z.ZodType>(schema: T) =>
  z.preprocess((value) => (typeof value === 'string' ? stegaClean(value) : value), schema);

export const imageModel = z.object({
  alt: z.string().nullish(),
  caption: z.string().nullish(),
  crop: z.looseObject({}).nullish(),
  hotspot: z.looseObject({}).nullish(),
  asset: z.object({
    _id: z.string(),
    url: z.string(),
    lqip: z.string().nullish(),
    width: z.number(),
    height: z.number(),
  }),
});
export type SanityImage = z.infer<typeof imageModel>;

export const linkModel = z.object({
  label: z.string(),
  kind: cmsEnum(linkKind),
  page: cmsEnum(pageKey).nullish(),
  url: z.string().nullish(),
  anchor: z.string().nullish(),
  programSlug: z.string().nullish(),
  articleSlug: z.string().nullish(),
});
export type CmsLinkValue = z.infer<typeof linkModel>;

/** Portable text is rendered by @portabletext/react; only the envelope is validated. */
export const portableTextModel = z.array(z.looseObject({ _type: z.string(), _key: z.string() }));
export type PortableTextValue = z.infer<typeof portableTextModel>;

const span = z.looseObject({ text: z.string(), marks: z.array(z.string()).nullish() });
export const accentHeadingModel = z.array(z.looseObject({ _key: z.string(), children: z.array(span) }));
export type AccentHeadingValue = z.infer<typeof accentHeadingModel>;

export const titledTextModel = z.object({ title: z.string(), text: z.string() });
export const statModel = z.object({ value: z.string(), label: z.string() });
export const iconItemModel = z.object({ icon: cmsEnum(iconName), title: z.string(), text: z.string() });
export const labeledValueModel = z.object({ label: z.string(), value: z.string() });

export const ctaCardModel = z.object({
  eyebrow: z.string(),
  heading: accentHeadingModel,
  text: z.string(),
  primary: linkModel,
  secondary: linkModel.nullish(),
});
export type CtaCardValue = z.infer<typeof ctaCardModel>;

export const seoModel = z
  .object({
    title: z.string().nullish(),
    description: z.string().nullish(),
    noIndex: z.boolean().nullish(),
    ogImage: imageModel.nullish(),
  })
  .nullish();
export type SeoValue = z.infer<typeof seoModel>;

export const packageModel = z.object({
  _key: z.string(),
  name: z.string(),
  price: z.number().nullish(),
  priceLabel: z.string().nullish(),
  unit: z.string().nullish(),
  note: z.string().nullish(),
  features: z.array(z.string()),
  ctaLabel: z.string(),
  featured: z.boolean(),
});
export type PackageValue = z.infer<typeof packageModel>;

export const programCardModel = z.object({
  _id: z.string(),
  name: z.string(),
  slug: z.string(),
  shortLabel: z.string(),
  pricingLabel: z.string(),
  icon: cmsEnum(iconName),
  tagline: z.string(),
  cardDescription: z.string(),
  cardBullets: z.array(z.string()),
  otherShort: z.string(),
  priceFrom: z.object({ amount: z.number().nullish(), label: z.string().nullish(), unit: z.string() }),
  order: z.number(),
});
export type ProgramCard = z.infer<typeof programCardModel>;

export const faqModel = z.object({ _id: z.string(), question: z.string(), answer: portableTextModel });
export type FaqValue = z.infer<typeof faqModel>;

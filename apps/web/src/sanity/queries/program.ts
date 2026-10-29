import { defineQuery } from 'next-sanity';
import { z } from 'zod';
import { sanityFetch } from '../fetch';
import {
  CTA_CARD,
  CTA_CARD_TAGS,
  FAQ,
  FAQ_TAGS,
  IMAGE,
  LINK,
  LINK_TAGS,
  PACKAGE,
  PROGRAM_CARD_FIELDS,
  SEO,
} from '../fragments';
import {
  ctaCardModel,
  faqModel,
  imageModel,
  linkModel,
  packageModel,
  programCardModel,
  seoModel,
  titledTextModel,
} from '../models';

const PROGRAM_SLUGS_QUERY = defineQuery(`*[_type == "program" && defined(slug.current)].slug.current`);

const PROGRAM_QUERY = defineQuery(`{
  "program": *[_type == "program" && slug.current == $slug][0]{
    ${PROGRAM_CARD_FIELDS},
    lead, "heroImage": heroImage${IMAGE}, forWho, includesLead, includes, assessmentStep,
    packages[]${PACKAGE},
    "faqs": faqs[]->${FAQ},
    _updatedAt,
    "seo": seo${SEO}
  },
  "template": *[_id == "programPage"][0]{
    hero{ eyebrowPrefix, primaryCta${LINK}, pricesLabel },
    forWho, includes, faq, others,
    steps{ eyebrow, heading, step1, step2Title, step3, step4 },
    pricing{ eyebrow, heading, vatNote },
    "cta": cta${CTA_CARD}
  }
}`);

const header = z.object({ eyebrow: z.string(), heading: z.string() });

const programPageModel = z.object({
  program: programCardModel
    .extend({
      lead: z.string(),
      heroImage: imageModel.nullish(),
      forWho: z.array(titledTextModel),
      includesLead: z.string(),
      includes: z.array(z.string()),
      assessmentStep: z.string(),
      packages: z.array(packageModel),
      faqs: z.array(faqModel),
      _updatedAt: z.string(),
      seo: seoModel,
    })
    .nullable(),
  template: z.object({
    hero: z.object({ eyebrowPrefix: z.string(), primaryCta: linkModel, pricesLabel: z.string() }),
    forWho: header,
    includes: header,
    faq: header,
    others: z.object({ eyebrow: z.string() }),
    steps: header.extend({
      step1: titledTextModel,
      step2Title: z.string(),
      step3: titledTextModel,
      step4: titledTextModel,
    }),
    pricing: header.extend({ vatNote: z.string() }),
    cta: ctaCardModel,
  }),
});

export type ProgramPageData = z.infer<typeof programPageModel>;

export const getProgramSlugs = () =>
  sanityFetch({ query: PROGRAM_SLUGS_QUERY, tags: ['program'], model: z.array(z.string()), stega: false });

export const getProgramPage = (slug: string, stega = true) =>
  sanityFetch({
    query: PROGRAM_QUERY,
    params: { slug },
    tags: ['program', 'programPage', ...LINK_TAGS, ...FAQ_TAGS, ...CTA_CARD_TAGS],
    model: programPageModel,
    stega,
  });

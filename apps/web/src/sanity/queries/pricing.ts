import { defineQuery } from 'next-sanity';
import { z } from 'zod';
import { sanityFetch } from '../fetch';
import { CTA_CARD, FAQ, LINK, PACKAGE, SEO } from '../fragments';
import { ctaCardModel, faqModel, iconItemModel, linkModel, packageModel, seoModel } from '../models';

const PRICING_QUERY = defineQuery(`{
  "page": *[_id == "pricingPage"][0]{
    hero, packages, conditions,
    consultation{ price, title, text, cta${LINK} },
    faq{ eyebrow, heading, "items": items[]->${FAQ} },
    "cta": cta${CTA_CARD},
    "seo": seo${SEO}
  },
  "programs": *[_type == "program" && defined(slug.current)] | order(order asc){
    _id, name, shortLabel, pricingLabel, "slug": slug.current, packages[]${PACKAGE}
  }
}`);

const pricingModel = z.object({
  page: z.object({
    hero: z.object({ eyebrow: z.string(), heading: z.string(), lead: z.string() }),
    consultation: z.object({ price: z.string(), title: z.string(), text: z.string(), cta: linkModel }),
    packages: z.object({ heading: z.string(), programLinkLabel: z.string() }),
    conditions: z.object({ eyebrow: z.string(), heading: z.string(), items: z.array(iconItemModel) }),
    faq: z.object({ eyebrow: z.string(), heading: z.string(), items: z.array(faqModel) }),
    cta: ctaCardModel,
    seo: seoModel,
  }),
  programs: z.array(
    z.object({
      _id: z.string(),
      name: z.string(),
      shortLabel: z.string(),
      pricingLabel: z.string(),
      slug: z.string(),
      packages: z.array(packageModel),
    })
  ),
});

export const getPricing = (stega = true) =>
  sanityFetch({ query: PRICING_QUERY, tags: ['pricingPage', 'program', 'faq'], model: pricingModel, stega });

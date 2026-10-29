import { defineQuery } from 'next-sanity';
import { z } from 'zod';
import { sanityFetch } from '../fetch';
import { FAQ, FAQ_TAGS, PACKAGE } from '../fragments';
import { faqModel, packageModel } from '../models';

const SITEMAP_QUERY = defineQuery(`{
  "pages": *[_id in ["homePage", "aboutPage", "pricingPage", "articlesPage", "contactPage", "privacyPage"] && seo.noIndex != true]{ _id, _updatedAt },
  "programs": *[_type == "program" && defined(slug.current) && seo.noIndex != true]{ "slug": slug.current, _updatedAt },
  "articles": *[_type == "article" && defined(slug.current) && seo.noIndex != true]{ "slug": slug.current, _updatedAt, updatedAt, publishedAt },
  "categories": *[_type == "category" && defined(slug.current) && seo.noIndex != true]{ "slug": slug.current, _updatedAt }
}`);

const dated = z.object({ slug: z.string(), _updatedAt: z.string() });

export const getSitemapData = () =>
  sanityFetch({
    query: SITEMAP_QUERY,
    tags: [
      'homePage',
      'aboutPage',
      'pricingPage',
      'articlesPage',
      'contactPage',
      'privacyPage',
      'program',
      'article',
      'category',
    ],
    model: z.object({
      pages: z.array(z.object({ _id: z.string(), _updatedAt: z.string() })),
      programs: z.array(dated),
      articles: z.array(dated.extend({ updatedAt: z.string().nullish(), publishedAt: z.string() })),
      categories: z.array(dated),
    }),
    stega: false,
  });

/** Everything an answer engine needs to describe the business, as one structured payload. */
const LLMS_QUERY = defineQuery(`{
  "programs": *[_type == "program" && defined(slug.current)] | order(order asc){
    name, "slug": slug.current, lead, includes, "forWho": forWho[].title, priceFrom, packages[]${PACKAGE}, "faqs": faqs[]->${FAQ}
  },
  "pricingFaqs": *[_id == "pricingPage"][0].faq.items[]->${FAQ},
  "conditions": *[_id == "pricingPage"][0].conditions.items[]{ title, text },
  "articles": *[_type == "article" && defined(slug.current)] | order(publishedAt desc){
    title, "slug": slug.current, excerpt, "category": category->title, publishedAt
  },
  "about": *[_id == "aboutPage"][0]{ "lead": hero.lead, "approach": approach.items[]{ title, text }, "credentials": credentials.items[]{ year, title, institution } }
}`);

export const getLlmsData = () =>
  sanityFetch({
    query: LLMS_QUERY,
    tags: ['program', 'pricingPage', 'article', 'category', 'aboutPage', ...FAQ_TAGS],
    model: z.object({
      programs: z.array(
        z.object({
          name: z.string(),
          slug: z.string(),
          lead: z.string(),
          includes: z.array(z.string()),
          forWho: z.array(z.string()),
          priceFrom: z.object({ amount: z.number().nullish(), label: z.string().nullish(), unit: z.string() }),
          packages: z.array(packageModel),
          faqs: z.array(faqModel),
        })
      ),
      pricingFaqs: z.array(faqModel).nullish(),
      conditions: z.array(z.object({ title: z.string(), text: z.string() })).nullish(),
      articles: z.array(
        z.object({
          title: z.string(),
          slug: z.string(),
          excerpt: z.string(),
          category: z.string(),
          publishedAt: z.string(),
        })
      ),
      about: z.object({
        lead: z.string(),
        approach: z.array(z.object({ title: z.string(), text: z.string() })),
        credentials: z.array(z.object({ year: z.string(), title: z.string(), institution: z.string() })),
      }),
    }),
    stega: false,
  });

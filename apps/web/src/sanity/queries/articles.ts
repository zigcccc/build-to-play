import { defineQuery } from 'next-sanity';
import { z } from 'zod';
import { sanityFetch } from '../fetch';
import { IMAGE, PORTABLE_TEXT, PORTABLE_TEXT_TAGS, SEO } from '../fragments';
import { imageModel, portableTextModel, seoModel } from '../models';

export const PAGE_SIZE = 13;

// ~5 characters per word, ~180 words per minute.
const READING_TIME = /* groq */ `"readingTime": coalesce(round(length(pt::text(body)) / 5 / 180), 1)`;

const CARD = /* groq */ `{
  _id, title, "slug": slug.current, excerpt, publishedAt,
  "cover": cover${IMAGE},
  "category": category->{ title, "slug": slug.current },
  ${READING_TIME}
}`;

export const articleCardModel = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  publishedAt: z.string(),
  cover: imageModel.nullish(),
  category: z.object({ title: z.string(), slug: z.string() }),
  readingTime: z.number().transform((n) => Math.max(1, n)),
});
export type ArticleCard = z.infer<typeof articleCardModel>;

const categoryModel = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string().nullish(),
  seo: seoModel,
});

const listCopyModel = z.object({
  hero: z.object({ eyebrow: z.string(), heading: z.string(), lead: z.string() }),
  list: z.object({
    allLabel: z.string(),
    featuredLabel: z.string(),
    readingTime: z.string(),
    readingTimeShort: z.string(),
    loadMore: z.string(),
    emptyText: z.string(),
    emptyCta: z.string(),
  }),
  article: z.object({
    tocLabel: z.string(),
    shareLabel: z.string(),
    copyLink: z.string(),
    copied: z.string(),
    authorLabel: z.string(),
    authorLink: z.string(),
    updatedLabel: z.string(),
    relatedHeading: z.string(),
    allArticles: z.string(),
  }),
  seo: seoModel,
});
export type ArticlesCopy = z.infer<typeof listCopyModel>;

const LIST_QUERY = defineQuery(`{
  "copy": *[_id == "articlesPage"][0]{ hero, list, article, "seo": seo${SEO} },
  "categories": *[_type == "category" && defined(slug.current)] | order(order asc){ _id, title, "slug": slug.current, description, "seo": seo${SEO} },
  "articles": *[_type == "article" && defined(slug.current) && ($category == "" || category->slug.current == $category)]
    | order(publishedAt desc)[0...$limit]${CARD},
  "total": count(*[_type == "article" && defined(slug.current) && ($category == "" || category->slug.current == $category)])
}`);

const listModel = z.object({
  copy: listCopyModel,
  categories: z.array(categoryModel),
  articles: z.array(articleCardModel),
  total: z.number(),
});

/** Article list for /nasveti (category = "") or /nasveti/kategorija/[slug]. */
export const getArticleList = (category = '', stega = true) =>
  sanityFetch({
    query: LIST_QUERY,
    params: { category, limit: PAGE_SIZE },
    tags: ['articlesPage', 'article', 'category'],
    model: listModel,
    stega,
  });

const MORE_QUERY =
  defineQuery(`*[_type == "article" && defined(slug.current) && ($category == "" || category->slug.current == $category)]
  | order(publishedAt desc)[$from...$to]${CARD}`);

export const getMoreArticles = (category: string, from: number) =>
  sanityFetch({
    query: MORE_QUERY,
    params: { category, from, to: from + PAGE_SIZE - 1 },
    tags: ['article', 'category'],
    model: z.array(articleCardModel),
  });

const ARTICLE_QUERY = defineQuery(`*[_type == "article" && slug.current == $slug][0]{
  _id, title, "slug": slug.current, excerpt, publishedAt, updatedAt, _updatedAt,
  "cover": cover${IMAGE},
  "category": category->{ title, "slug": slug.current },
  "author": author->{ name, role, bio, "avatar": avatar${IMAGE} },
  body${PORTABLE_TEXT},
  ${READING_TIME},
  "wordCount": length(string::split(pt::text(body), " ")),
  "related": coalesce(
    related[]->${CARD},
    []
  ),
  "sameCategory": *[_type == "article" && slug.current != $slug && defined(slug.current) && category._ref == ^.category._ref]
    | order(publishedAt desc)[0...3]${CARD},
  "latest": *[_type == "article" && slug.current != $slug && defined(slug.current)] | order(publishedAt desc)[0...3]${CARD},
  "seo": seo${SEO}
}`);

const articleModel = z
  .object({
    _id: z.string(),
    title: z.string(),
    slug: z.string(),
    excerpt: z.string(),
    publishedAt: z.string(),
    updatedAt: z.string().nullish(),
    _updatedAt: z.string(),
    cover: imageModel.nullish(),
    category: z.object({ title: z.string(), slug: z.string() }),
    author: z.object({ name: z.string(), role: z.string(), bio: z.string(), avatar: imageModel.nullish() }),
    body: portableTextModel,
    readingTime: z.number().transform((n) => Math.max(1, n)),
    wordCount: z.number(),
    related: z.array(articleCardModel),
    sameCategory: z.array(articleCardModel),
    latest: z.array(articleCardModel),
    seo: seoModel,
  })
  .nullable();
export type ArticleData = NonNullable<z.infer<typeof articleModel>>;

export const getArticle = (slug: string, stega = true) =>
  sanityFetch({
    query: ARTICLE_QUERY,
    params: { slug },
    tags: ['article', 'category', 'person', ...PORTABLE_TEXT_TAGS],
    model: articleModel,
    stega,
  });

const SLUGS_QUERY = defineQuery(`{
  "articles": *[_type == "article" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
  "categories": *[_type == "category" && defined(slug.current)]{ "slug": slug.current, _updatedAt }
}`);

export const getArticleSlugs = () =>
  sanityFetch({
    query: SLUGS_QUERY,
    tags: ['article', 'category'],
    model: z.object({
      articles: z.array(z.object({ slug: z.string(), _updatedAt: z.string() })),
      categories: z.array(z.object({ slug: z.string(), _updatedAt: z.string() })),
    }),
    stega: false,
  });

export const getArticlesCopy = (stega = true) =>
  sanityFetch({
    query: defineQuery(`*[_id == "articlesPage"][0]{ hero, list, article, "seo": seo${SEO} }`),
    tags: ['articlesPage'],
    model: listCopyModel,
    stega,
  });

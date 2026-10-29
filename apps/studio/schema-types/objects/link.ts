import { type LinkKind, linkKind, pageKey } from '@b2p/shared';
import { LinkIcon } from '@sanity/icons/Link';
import { defineField, defineType } from 'sanity';

const kindTitles: Record<(typeof linkKind.options)[number], string> = {
  page: 'Stran',
  program: 'Program',
  article: 'Članek',
  external: 'Zunanja povezava',
  booking: 'Odpri obrazec za brezplačen posvet',
  cookieSettings: 'Odpri nastavitve piškotkov',
  phone: 'Pokliči (telefon iz nastavitev)',
  email: 'E-pošta (naslov iz nastavitev)',
};

const pageTitles: Record<(typeof pageKey.options)[number], string> = {
  home: 'Domov',
  about: 'O meni',
  pricing: 'Cenik',
  articles: 'Nasveti',
  contact: 'Kontakt',
  privacy: 'Politika zasebnosti',
};

/** The target field of the chosen kind is required: without it the button would silently not render. */
const requiredFor =
  (kind: LinkKind, message: string) =>
  // biome-ignore lint/suspicious/noExplicitAny: rule builder typing differs per field type
  (rule: any) =>
    rule.custom((value: unknown, context: { parent?: { kind?: string } }) =>
      context.parent?.kind !== kind || value ? true : message
    );

export const linkFields = [
  defineField({
    name: 'kind',
    title: 'Vrsta povezave',
    type: 'string',
    options: {
      list: linkKind.options.map((value) => ({
        value,
        title: kindTitles[value],
      })),
    },
    initialValue: 'page',
    validation: (r) => r.required(),
  }),
  defineField({
    name: 'page',
    title: 'Stran',
    type: 'string',
    options: {
      list: pageKey.options.map((value) => ({
        value,
        title: pageTitles[value],
      })),
    },
    hidden: ({ parent }) => parent?.kind !== 'page',
    validation: requiredFor('page', 'Izberi stran.'),
  }),
  defineField({
    name: 'program',
    title: 'Program',
    type: 'reference',
    to: [{ type: 'program' }],
    hidden: ({ parent }) => parent?.kind !== 'program',
    validation: requiredFor('program', 'Izberi program.'),
  }),
  defineField({
    name: 'article',
    title: 'Članek',
    type: 'reference',
    to: [{ type: 'article' }],
    hidden: ({ parent }) => parent?.kind !== 'article',
    validation: requiredFor('article', 'Izberi članek.'),
  }),
  defineField({
    name: 'url',
    title: 'URL',
    type: 'url',
    hidden: ({ parent }) => parent?.kind !== 'external',
    validation: requiredFor('external', 'Vpiši URL.'),
  }),
  defineField({
    name: 'anchor',
    title: 'Sidro (neobvezno)',
    type: 'string',
    description: 'Npr. programi – skoči na razdelek #programi.',
    hidden: ({ parent }) => !['page', 'program'].includes(parent?.kind),
  }),
];

export const link = defineType({
  name: 'link',
  title: 'Gumb / povezava',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Besedilo',
      type: 'string',
      validation: (r) => r.required(),
    }),
    ...linkFields,
  ],
  preview: {
    select: { title: 'label', subtitle: 'kind' },
    prepare: ({ title, subtitle }) => ({
      title,
      subtitle: kindTitles[subtitle as keyof typeof kindTitles],
    }),
  },
});

/** Inline link annotation for portable text (no label – the text is the label). */
export const inlineLink = defineType({
  name: 'inlineLink',
  title: 'Povezava',
  type: 'object',
  icon: LinkIcon,
  fields: linkFields,
});

import { LockIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';
import { str, typed } from '../fields';

export const privacyPage = defineType({
  name: 'privacyPage',
  title: 'Politika zasebnosti',
  type: 'document',
  icon: LockIcon,
  fields: [
    str('eyebrow', 'Nadnaslov'),
    str('title', 'Naslov'),
    defineField({
      name: 'updatedAt',
      title: 'Zadnja posodobitev',
      type: 'date',
      validation: (r) => r.required(),
    }),
    str('updatedLabel', 'Oznaka »Zadnja posodobitev«'),
    str('tocLabel', 'Naslov kazala'),
    defineField({
      name: 'sections',
      title: 'Poglavja',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'legalSection',
          type: 'object',
          fields: [
            str('title', 'Naslov'),
            defineField({
              name: 'anchor',
              title: 'Sidro',
              type: 'slug',
              options: {
                source: (_doc, ctx) => (ctx.parent as { title?: string })?.title ?? '',
              },
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'body',
              title: 'Vsebina',
              type: 'legalText',
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: 'title' } },
        }),
      ],
      validation: (r) => r.required(),
    }),
    typed('seo', 'SEO', 'seo', { optional: true }),
  ],
  preview: { prepare: () => ({ title: 'Politika zasebnosti' }) },
});

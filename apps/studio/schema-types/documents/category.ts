import { TagIcon } from '@sanity/icons/Tag';
import { defineField, defineType } from 'sanity';
import { str, txt, typed } from '../fields';

export const category = defineType({
  name: 'category',
  title: 'Kategorija',
  type: 'document',
  icon: TagIcon,
  fields: [
    str('title', 'Ime'),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      options: { source: 'title' },
      validation: (r) => r.required(),
    }),
    txt('description', 'Opis', {
      optional: true,
      description: 'Uvod na strani kategorije in opis za iskalnike.',
    }),
    defineField({
      name: 'order',
      title: 'Vrstni red',
      type: 'number',
      validation: (r) => r.required().integer(),
    }),
    typed('seo', 'SEO', 'seo', { optional: true }),
  ],
  orderings: [
    {
      title: 'Vrstni red',
      name: 'order',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
});

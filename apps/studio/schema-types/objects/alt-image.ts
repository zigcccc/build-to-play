import { defineField, defineType } from 'sanity';

export const altImage = defineType({
  name: 'altImage',
  title: 'Slika',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Opis slike (alt)',
      type: 'string',
      description: 'Kratek opis, kaj je na sliki. Pomemben za dostopnost in iskalnike.',
      validation: (r) => r.required(),
    }),
  ],
});

export const captionedImage = defineType({
  name: 'captionedImage',
  title: 'Slika z napisom',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Opis slike (alt)',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'caption', title: 'Napis', type: 'string' }),
  ],
});

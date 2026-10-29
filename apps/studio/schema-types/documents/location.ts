import { PinIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import { str, strList } from '../fields';

export const location = defineType({
  name: 'location',
  title: 'Lokacija',
  type: 'document',
  icon: PinIcon,
  fields: [
    str('name', 'Ime lokacije'),
    str('street', 'Ulica in hišna številka'),
    str('postalCode', 'Poštna številka'),
    str('city', 'Kraj'),
    strList('tags', 'Programi na lokaciji', {
      optional: true,
      description: 'Npr. Osebno, Športno',
    }),
    defineField({
      name: 'geo',
      title: 'Koordinate',
      type: 'object',
      description: 'Za oznako na zemljevidu. V Google Maps desni klik na lokacijo → kopiraj koordinate.',
      fields: [
        defineField({
          name: 'lat',
          title: 'Zemljepisna širina',
          type: 'number',
        }),
        defineField({
          name: 'lng',
          title: 'Zemljepisna dolžina',
          type: 'number',
        }),
      ],
    }),
    defineField({
      name: 'mapsUrl',
      title: 'Povezava »navodila za pot«',
      type: 'url',
      description: 'Google Maps povezava do lokacije.',
    }),
    defineField({
      name: 'order',
      title: 'Vrstni red',
      type: 'number',
      validation: (r) => r.required().integer(),
    }),
  ],
  orderings: [
    {
      title: 'Vrstni red',
      name: 'order',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: { select: { title: 'name', subtitle: 'city' } },
});

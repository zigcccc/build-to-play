import { PinIcon } from '@sanity/icons/Pin';
import { defineField, defineType } from 'sanity';
import { GeoInput } from '../../components/geo-input';
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
      title: 'Oznaka na zemljevidu',
      type: 'object',
      description: 'Povezava »navodila za pot« se ustvari samodejno iz naslova.',
      fields: [
        defineField({ name: 'lat', title: 'Zemljepisna širina', type: 'number' }),
        defineField({ name: 'lng', title: 'Zemljepisna dolžina', type: 'number' }),
      ],
      components: { input: GeoInput },
      validation: (r) =>
        r.custom((geo?: { lat?: number; lng?: number }) =>
          geo?.lat !== undefined && geo?.lng !== undefined ? true : 'Postavi oznako na zemljevid.'
        ),
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

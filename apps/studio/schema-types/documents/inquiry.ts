import { EnvelopeIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';

const ro = { readOnly: true } as const;

/** Written by the website's server actions; read-only for editors except status. */
export const inquiry = defineType({
  name: 'inquiry',
  title: 'Povpraševanje',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { value: 'new', title: 'Novo' },
          { value: 'handled', title: 'Obdelano' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'new',
    }),
    defineField({
      name: 'kind',
      title: 'Vrsta',
      type: 'string',
      options: {
        list: [
          { value: 'contact', title: 'Kontaktni obrazec' },
          { value: 'booking', title: 'Brezplačen posvet' },
        ],
      },
      ...ro,
    }),
    defineField({
      name: 'submittedAt',
      title: 'Prejeto',
      type: 'datetime',
      ...ro,
    }),
    defineField({
      name: 'name',
      title: 'Ime in priimek',
      type: 'string',
      ...ro,
    }),
    defineField({ name: 'email', title: 'E-pošta', type: 'string', ...ro }),
    defineField({ name: 'phone', title: 'Telefon', type: 'string', ...ro }),
    defineField({
      name: 'subject',
      title: 'Zadeva / program',
      type: 'string',
      ...ro,
    }),
    defineField({ name: 'message', title: 'Sporočilo', type: 'text', ...ro }),
    defineField({ name: 'goal', title: 'Cilj', type: 'string', ...ro }),
    defineField({
      name: 'mode',
      title: 'Oblika posveta',
      type: 'string',
      ...ro,
    }),
    defineField({ name: 'location', title: 'Lokacija', type: 'string', ...ro }),
    defineField({
      name: 'days',
      title: 'Dnevi',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      ...ro,
    }),
    defineField({
      name: 'times',
      title: 'Del dneva',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      ...ro,
    }),
    defineField({ name: 'source', title: 'Stran', type: 'string', ...ro }),
    defineField({
      name: 'emailStatus',
      title: 'Status e-pošte',
      type: 'string',
      ...ro,
    }),
  ],
  orderings: [
    {
      title: 'Najnovejša',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      name: 'name',
      kind: 'kind',
      status: 'status',
      date: 'submittedAt',
    },
    prepare: ({ name, kind, status, date }) => ({
      title: `${status === 'new' ? '● ' : ''}${name ?? '—'}`,
      subtitle: `${kind === 'booking' ? 'Posvet' : 'Sporočilo'} · ${date ? new Date(date).toLocaleString('sl-SI') : ''}`,
    }),
  },
});

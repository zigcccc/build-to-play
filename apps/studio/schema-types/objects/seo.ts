import { defineField, defineType } from 'sanity';

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'title',
      title: 'Naslov za iskalnike',
      type: 'string',
      description: 'Prikazan v zavihku brskalnika in v Googlu. Če je prazno, se uporabi naslov strani.',
      validation: (r) => r.max(60).warning('Naj bo krajši od 60 znakov.'),
    }),
    defineField({
      name: 'description',
      title: 'Opis za iskalnike',
      type: 'text',
      rows: 3,
      description:
        'Ena do dve povedi, ki neposredno odgovorita, kaj stran ponuja. Uporabljajo jo Google in AI asistenti.',
      validation: (r) => r.max(160).warning('Naj bo krajši od 160 znakov.'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Slika za deljenje',
      type: 'image',
      description: '1200 × 630 px. Če je prazno, se samodejno ustvari slika z naslovom.',
    }),
    defineField({
      name: 'noIndex',
      title: 'Skrij pred iskalniki',
      type: 'boolean',
      initialValue: false,
    }),
  ],
});

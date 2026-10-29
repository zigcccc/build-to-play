import { iconName } from '@b2p/shared';
import { defineField, defineType } from 'sanity';
import { str, txt } from '../fields';

export const titledText = defineType({
  name: 'titledText',
  title: 'Naslov in besedilo',
  type: 'object',
  fields: [str('title', 'Naslov'), txt('text', 'Besedilo')],
});

export const iconItem = defineType({
  name: 'iconItem',
  title: 'Ikona, naslov in besedilo',
  type: 'object',
  fields: [
    defineField({
      name: 'icon',
      title: 'Ikona',
      type: 'string',
      options: { list: [...iconName.options] },
      validation: (r) => r.required(),
    }),
    str('title', 'Naslov'),
    txt('text', 'Besedilo'),
  ],
});

export const stat = defineType({
  name: 'stat',
  title: 'Številka',
  type: 'object',
  fields: [str('value', 'Vrednost', { description: 'Npr. 10+ let' }), str('label', 'Opis')],
  preview: { select: { title: 'value', subtitle: 'label' } },
});

export const sectionHeader = defineType({
  name: 'sectionHeader',
  title: 'Glava razdelka',
  type: 'object',
  options: { collapsible: true, collapsed: false },
  fields: [str('eyebrow', 'Nadnaslov'), str('heading', 'Naslov'), txt('intro', 'Uvod', { optional: true })],
});

export const ctaCard = defineType({
  name: 'ctaCard',
  title: 'CTA kartica',
  type: 'object',
  options: { collapsible: true, collapsed: false },
  fields: [
    str('eyebrow', 'Nadnaslov'),
    defineField({ name: 'heading', title: 'Naslov', type: 'accentHeading' }),
    txt('text', 'Besedilo'),
    defineField({
      name: 'primary',
      title: 'Glavni gumb',
      type: 'link',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'secondary', title: 'Drugi gumb', type: 'link' }),
  ],
});

export const credential = defineType({
  name: 'credential',
  title: 'Izobrazba / licenca',
  type: 'object',
  fields: [str('year', 'Leto'), str('title', 'Naziv'), str('institution', 'Ustanova / klub')],
  preview: { select: { title: 'title', subtitle: 'year' } },
});

export const socialLink = defineType({
  name: 'socialLink',
  title: 'Družbeno omrežje',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      title: 'Omrežje',
      type: 'string',
      options: {
        list: ['instagram', 'facebook', 'tiktok', 'youtube', 'linkedin'],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL profila',
      type: 'url',
      validation: (r) => r.required(),
    }),
    str('handle', 'Prikazano ime', { description: 'Npr. @build2play' }),
  ],
  preview: { select: { title: 'platform', subtitle: 'handle' } },
});

export const labeledValue = defineType({
  name: 'labeledValue',
  title: 'Oznaka in vrednost',
  type: 'object',
  fields: [str('label', 'Oznaka'), str('value', 'Vrednost')],
  preview: { select: { title: 'label', subtitle: 'value' } },
});

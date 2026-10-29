import { ClockIcon } from '@sanity/icons/Clock';
import { defineType } from 'sanity';
import { str, txt } from '../fields';

export const comingSoonPage = defineType({
  name: 'comingSoonPage',
  title: 'Stran Kmalu',
  type: 'document',
  icon: ClockIcon,
  description: 'Prikaže se namesto celotne strani, dokler spletna stran ni javno objavljena.',
  fields: [str('eyebrow', 'Nadnaslov'), str('heading', 'Naslov'), txt('text', 'Besedilo')],
  preview: { prepare: () => ({ title: 'Stran Kmalu' }) },
});

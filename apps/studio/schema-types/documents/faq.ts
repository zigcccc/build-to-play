import { HelpCircleIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const faq = defineType({
  name: 'faq',
  title: 'Vprašanje',
  type: 'document',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'question',
      title: 'Vprašanje',
      type: 'string',
      description: 'Zapiši ga tako, kot bi ga vprašala stranka.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Odgovor',
      type: 'simpleText',
      description: 'Prvi stavek naj neposredno odgovori na vprašanje.',
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: 'question' } },
});

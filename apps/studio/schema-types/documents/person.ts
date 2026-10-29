import { UserIcon } from '@sanity/icons/User';
import { defineArrayMember, defineField, defineType } from 'sanity';
import { str, strList, txt, typed } from '../fields';

export const person = defineType({
  name: 'person',
  title: 'Oseba',
  type: 'document',
  icon: UserIcon,
  fields: [
    str('name', 'Ime in priimek'),
    str('role', 'Vloga', { description: 'Npr. Trener · Build 2 Play' }),
    str('jobTitle', 'Poklic', {
      description: 'Za iskalnike, npr. Osebni in športni trener',
    }),
    typed('avatar', 'Fotografija', 'altImage', { optional: true }),
    txt('bio', 'Kratka predstavitev', {
      description: 'En stavek, prikazan pod članki.',
    }),
    strList('knowsAbout', 'Področja znanja', {
      optional: true,
      description: 'Za iskalnike in AI asistente, npr. trening moči, kondicijska priprava.',
    }),
    defineField({
      name: 'sameAs',
      title: 'Profili na spletu',
      type: 'array',
      of: [defineArrayMember({ type: 'url' })],
      description: 'Instagram, LinkedIn, profil na zvezi ipd.',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'avatar' },
  },
});

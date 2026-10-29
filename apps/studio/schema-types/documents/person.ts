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
    defineField({
      name: 'owner',
      title: 'Lastnik',
      type: 'boolean',
      initialValue: false,
      description:
        'Lastnik Build 2 Play. Njegovo ime se uporabi povsod, kjer je v besedilu {ime}, njegovi podatki pa za iskalnike in kot privzeti avtor. Lastnik je lahko samo eden.',
      validation: (r) =>
        r.custom(async (value, context) => {
          if (!value || !context.document) return true;
          const id = context.document._id.replace(/^(drafts|versions\.[^.]+)\./, '');
          const others = await context
            .getClient({ apiVersion: '2025-02-19' })
            .fetch<number>('count(*[_type == "person" && owner == true && !sanity::versionOf($id)])', { id });
          return others === 0 || 'Lastnik je že določen. Najprej ga odznači pri drugi osebi.';
        }),
    }),
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
    select: { title: 'name', subtitle: 'role', media: 'avatar', owner: 'owner' },
    prepare: ({ title, subtitle, media, owner }) => ({
      title,
      subtitle: owner ? `Lastnik · ${subtitle ?? ''}` : subtitle,
      media,
    }),
  },
});

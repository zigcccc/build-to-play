import { ComposeIcon } from '@sanity/icons';
import { defineType } from 'sanity';
import { groups, section, str, strList, txt, typed, VARIABLES_HINT } from '../fields';

export const forms = defineType({
  name: 'forms',
  title: 'Obrazci',
  type: 'document',
  icon: ComposeIcon,
  groups: groups(['fields', 'Polja'], ['states', 'Stanja'], ['contact', 'Kontakt'], ['booking', 'Posvet']),
  fields: [
    section(
      'labels',
      'Oznake polj',
      [
        str('name', 'Ime in priimek'),
        str('email', 'E-pošta'),
        str('phone', 'Telefon'),
        str('subject', 'Zadeva'),
        str('program', 'Program'),
        str('message', 'Sporočilo'),
        str('goal', 'Cilj (domača stran)'),
        str('bookingMessage', 'Sporočilo (posvet)'),
        str('optional', 'Oznaka neobveznega polja', {
          description: 'Npr. (neobvezno)',
        }),
        str('requiredNote', 'Opomba o obveznih poljih'),
        typed('consent', 'Soglasje', 'simpleText'),
      ],
      { group: 'fields' }
    ),
    section(
      'placeholders',
      'Primeri v poljih',
      [
        str('name', 'Ime'),
        str('email', 'E-pošta'),
        str('phone', 'Telefon'),
        str('program', 'Izberi program'),
        str('message', 'Sporočilo'),
        str('goal', 'Cilj (domača stran)'),
        str('bookingMessage', 'Sporočilo (posvet)'),
      ],
      { group: 'fields' }
    ),
    section(
      'errors',
      'Napake',
      [
        str('name', 'Manjka ime'),
        str('emailEmpty', 'Manjka e-pošta'),
        str('emailInvalid', 'Napačna e-pošta'),
        str('message', 'Manjka sporočilo'),
        str('consent', 'Manjka soglasje'),
        str('summary', 'Povzetek napak'),
      ],
      { group: 'states' }
    ),
    section(
      'states',
      'Stanja',
      [
        str('sending', 'Pošiljanje'),
        str('successTitle', 'Uspeh – naslov'),
        txt('successText', 'Uspeh – besedilo (kontakt)', {
          description: VARIABLES_HINT,
        }),
        txt('successTextHome', 'Uspeh – besedilo (domača stran)', {
          description: VARIABLES_HINT,
        }),
        str('sendAnother', 'Pošlji novo sporočilo'),
        txt('failure', 'Napaka pri pošiljanju', {
          description: VARIABLES_HINT,
        }),
        str('retry', 'Poskusi znova'),
      ],
      { group: 'states' }
    ),
    section(
      'contact',
      'Kontaktni obrazec',
      [
        str('submit', 'Gumb (kontakt)'),
        str('submitHome', 'Gumb (domača stran)'),
        strList('subjects', 'Možnosti »Zadeva«'),
        str('programUnknown', 'Možnost »Ne vem še«'),
      ],
      { group: 'contact' }
    ),
    section(
      'booking',
      'Brezplačen posvet',
      [
        str('title', 'Naslov'),
        str('stepLabel', 'Korak', {
          description: 'Npr. »korak {n} od {total}«',
        }),
        str('next', 'Naprej'),
        str('submit', 'Pošlji'),
        section('step1', 'Korak 1 – cilj', [
          str('title', 'Naslov'),
          str('subtitle', 'Podnaslov'),
          strList('goals', 'Cilji'),
          str('programLabel', 'Program – oznaka'),
        ]),
        section('step2', 'Korak 2 – termin', [
          str('title', 'Naslov'),
          str('subtitle', 'Podnaslov', { description: VARIABLES_HINT }),
          str('modeLabel', 'Oblika – oznaka'),
          str('modeLive', 'V živo'),
          str('modeVideo', 'Video klic'),
          str('locationLabel', 'Lokacija – oznaka'),
          str('anyLocation', 'Vseeno mi je'),
          str('daysLabel', 'Dnevi – oznaka'),
          str('timesLabel', 'Del dneva – oznaka'),
        ]),
        section('step3', 'Korak 3 – podatki', [
          str('title', 'Naslov'),
          str('subtitle', 'Podnaslov', { description: VARIABLES_HINT }),
        ]),
        section('success', 'Potrditev', [
          str('title', 'Naslov'),
          str('text', 'Besedilo'),
          str('goalLabel', 'Povzetek – cilj'),
          str('modeLabel', 'Povzetek – oblika'),
          str('whenLabel', 'Povzetek – termini'),
          str('anytime', 'Kadarkoli'),
          str('nextHeading', 'Kaj sledi – naslov'),
          strList('nextSteps', 'Kaj sledi – koraki', {
            description: VARIABLES_HINT,
          }),
          str('close', 'Gumb za zaprtje'),
        ]),
        section('closeConfirm', 'Potrditev zaprtja', [
          str('title', 'Naslov'),
          txt('text', 'Besedilo'),
          str('stay', 'Nadaljuj'),
          str('discard', 'Zapri'),
        ]),
      ],
      { group: 'booking' }
    ),
  ],
  preview: { prepare: () => ({ title: 'Obrazci' }) },
});

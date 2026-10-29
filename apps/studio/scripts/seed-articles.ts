import { block, key, listItem, ref, refs, slug } from './seed-helpers';

export const categories = [
  {
    _id: 'category-trening',
    _type: 'category',
    title: 'Trening',
    slug: slug('trening'),
    order: 1,
    description: 'Vadba za moč, tehnika osnovnih gibov in programi za začetnike in napredne.',
  },
  {
    _id: 'category-prehrana',
    _type: 'category',
    title: 'Prehrana',
    slug: slug('prehrana'),
    order: 2,
    description: 'Praktični nasveti o prehrani za več energije, moči in boljšo regeneracijo.',
  },
  {
    _id: 'category-regeneracija',
    _type: 'category',
    title: 'Regeneracija',
    slug: slug('regeneracija'),
    order: 3,
    description: 'Spanje, počitek in okrevanje – del treninga, ki ga najpogosteje preskočimo.',
  },
  {
    _id: 'category-sport',
    _type: 'category',
    title: 'Šport',
    slug: slug('sport'),
    order: 4,
    description: 'Kondicijska priprava, predsezona in preventiva poškodb za športnike in ekipe.',
  },
];

const heading = (title: string, anchor: string, tocLabel?: string) => ({
  _type: 'sectionHeading',
  _key: key(),
  title,
  tocLabel,
  anchor: slug(anchor),
});

const cta = () => ({
  _type: 'ctaBlock',
  _key: key(),
  eyebrow: 'Brezplačen posvet',
  text: 'Želiš, da ti pravilno tehniko pokažem v živo?',
  buttonLabel: 'Rezerviraj posvet',
});

const strengthBody = [
  block(
    'Za močnejše telo ne potrebuješ dvajsetih različnih naprav. Potrebuješ nekaj osnovnih gibov, dobro tehniko in načrt, ki postopoma povečuje obremenitev.',
    'lead'
  ),
  heading('Zakaj osnovni gibi', 'zakaj'),
  block(
    'Večina vsakdanjih in športnih gibanj je kombinacija nekaj vzorcev: počepa, upogiba v kolkih, potiska, poteg in nošenja bremena. Ko te vzorce okrepiš, postane lažje vse ostalo — od nošenja nakupovalnih vrečk do skoka na igrišču.'
  ),
  heading('Pet gibov', 'gibi'),
  listItem([['Počep.', 'strong'], ' Osnova za noge in trup. Začni s počepom ob steni ali na klop.'], 'number'),
  listItem(
    [['Upogib v kolkih.', 'strong'], ' Romunski mrtvi dvig z ročkami nauči, kako dvigovati s kolki namesto s hrbtom.'],
    'number'
  ),
  listItem(
    [['Potisk.', 'strong'], ' Sklece, po potrebi z rokami na klopi, dokler ne obvladaš polnega obsega.'],
    'number'
  ),
  listItem([['Poteg.', 'strong'], ' Veslanje z ročko ali elastiko za zgornji del hrbta in boljšo držo.'], 'number'),
  listItem(
    [['Nošenje.', 'strong'], ' Hoja z dvema ročkama ob telesu — preprosto, a izjemno za oprijem in stabilnost trupa.'],
    'number'
  ),
  cta(),
  heading('Kako sestaviti prvi trening', 'prvi-trening', 'Prvi trening'),
  block('Za začetek zadostujeta dva do trije treningi na teden. Vsak trening naj vključuje vseh pet gibov:'),
  listItem('2–3 serije po 8–12 ponovitev,'),
  listItem('1–2 minuti odmora med serijami,'),
  listItem('breme, pri katerem bi zmogel še dve ponovitvi več.'),
  block('Najprej pravilno, potem pogosto, šele nato težko.', 'blockquote'),
  heading('Najpogostejše napake', 'napake', 'Pogoste napake'),
  listItem([
    ['Prehitro povečevanje bremena.', 'strong'],
    ' Napredek pride z doslednostjo, ne z rekordi v prvem tednu.',
  ]),
  listItem([['Preskakovanje ogrevanja.', 'strong'], ' Deset minut je dovolj, da je telo pripravljeno.']),
  listItem([['Brez načrta.', 'strong'], ' Če ne beležiš treningov, ne veš, ali napreduješ.']),
  block('Ko se gibi zdijo lahki in tehnika ostane čista, je čas za več bremena. Tako preprosto je — in tako zahtevno.'),
];

const stubBody = (excerpt: string) => [
  block(excerpt, 'lead'),
  heading('[Podnaslov]', 'podnaslov'),
  block('[Vsebina članka — dopolni v Studiu.]'),
  cta(),
];

type Seed = [id: string, cat: string, title: string, slugValue: string, excerpt: string, publishedAt: string];

const seeds: Seed[] = [
  [
    'article-5-osnovnih-gibov',
    'trening',
    'Kako začeti z vadbo za moč: 5 osnovnih gibov',
    'kako-zaceti-z-vadbo-za-moc',
    'Počep, mrtvi dvig, potisk, poteg in nošenje. Če obvladaš teh pet, imaš osnovo za vse ostalo.',
    '2026-10-27T08:00:00Z',
  ],
  [
    'article-ogrevanje',
    'trening',
    'Ogrevanje, ki ima smisel',
    'ogrevanje-ki-ima-smisel',
    'Deset minut pred treningom, ki dejansko pripravijo telo — brez nepotrebnega raztezanja.',
    '2026-10-20T08:00:00Z',
  ],
  [
    'article-beljakovine',
    'prehrana',
    'Koliko beljakovin res potrebuješ?',
    'koliko-beljakovin-res-potrebujes',
    'Preprosto pravilo za izračun in kako ga doseči z običajno hrano.',
    '2026-10-13T08:00:00Z',
  ],
  [
    'article-spanje',
    'regeneracija',
    'Spanje je del treninga',
    'spanje-je-del-treninga',
    'Zakaj napredek nastane med počitkom in kaj lahko spremeniš že nocoj.',
    '2026-10-06T08:00:00Z',
  ],
  [
    'article-predsezona',
    'sport',
    'Predsezona: kako se pripraviti na novo sezono',
    'predsezona-priprava-na-novo-sezono',
    'Kako razporediti moč, hitrost in vzdržljivost v tednih pred prvo tekmo.',
    '2026-09-29T08:00:00Z',
  ],
  [
    'article-trening-doma',
    'trening',
    'Trening doma brez opreme',
    'trening-doma-brez-opreme',
    'Tritedenski program za dom, ki ga lahko začneš že danes.',
    '2026-09-22T08:00:00Z',
  ],
  [
    'article-kolena',
    'sport',
    'Kako zmanjšati tveganje za poškodbe kolena',
    'poskodbe-kolena-preventiva',
    'Vaje za moč in stabilnost, ki jih uporabljamo pri športnikih v skokovnih športih.',
    '2026-09-15T08:00:00Z',
  ],
];

export const articles = seeds.map(([id, cat, title, slugValue, excerpt, publishedAt], i) => ({
  _id: id,
  _type: 'article',
  title,
  slug: slug(slugValue),
  category: ref(`category-${cat}`),
  excerpt,
  body: i === 0 ? strengthBody : stubBody(excerpt),
  publishedAt,
  author: ref('person-trainer'),
  related: i === 0 ? refs(['article-ogrevanje', 'article-trening-doma', 'article-beljakovine']) : undefined,
  seo: { description: excerpt },
}));

import { block, keyed, refs, slug, titled } from './seed-helpers';

type Pkg = [
  name: string,
  unit: string,
  note: string,
  features: string[],
  ctaLabel: string,
  featured: boolean,
  priceLabel?: string,
];

const packages = (items: Pkg[]) =>
  keyed(
    items.map(([name, unit, note, features, ctaLabel, featured, priceLabel = '[Cena] €']) => ({
      _type: 'pricePackage',
      name,
      priceLabel,
      unit: unit || undefined,
      note,
      features,
      ctaLabel,
      featured,
    }))
  );

const faq = (id: string, question: string, answer: string) => ({
  _id: id,
  _type: 'faq',
  question,
  answer: [block(answer)],
});

export const faqs = [
  faq(
    'faq-fitnes-1',
    'Ali potrebujem predznanje?',
    'Ne. Program prilagodim tvojemu izhodišču, ne glede na to, ali začenjaš ali že treniraš.'
  ),
  faq(
    'faq-fitnes-2',
    'Kje potekajo treningi?',
    'V [lokacija]. Natančen naslov in navodila dobiš ob potrditvi termina.'
  ),
  faq('faq-fitnes-3', 'Koliko časa traja en trening?', '[60] minut, vključno z ogrevanjem in raztezanjem.'),
  faq(
    'faq-fitnes-4',
    'Kaj, če moram trening odpovedati?',
    'Termin lahko brezplačno prestaviš do [24] ur prej. Kasnejša odpoved šteje kot opravljen trening.'
  ),
  faq(
    'faq-fitnes-5',
    'Kdaj bom videl napredek?',
    'Prve spremembe v moči in počutju običajno opaziš v nekaj tednih. Napredek merimo z rednimi testi, zato ga vidiš tudi v številkah.'
  ),
  faq(
    'faq-sport-1',
    'Za katere športe je program primeren?',
    'Za ekipne in individualne športe. Teste in vaje izberem glede na zahteve tvojega športa.'
  ),
  faq(
    'faq-sport-2',
    'Ali delaš tudi z mladimi športniki?',
    'Da, od [starost] let naprej, s poudarkom na varni tehniki in postopnem napredovanju.'
  ),
  faq(
    'faq-sport-3',
    'Lahko prideš k našemu klubu?',
    'Da, ekipne treninge izvajam tudi na vaši lokaciji. Pošlji povpraševanje za ponudbo.'
  ),
  faq(
    'faq-sport-4',
    'Kako pogosto testiraš?',
    'Na začetku in nato vsakih {interval} tednov oziroma ob prehodu med fazami sezone.'
  ),
  faq('faq-sport-5', 'Ali sodeluješ s fizioterapevti?', '[Dopolni: da / ne, s kom.]'),
  faq(
    'faq-online-1',
    'Kako dobim program?',
    'Prek aplikacije [ime aplikacije]. Vsaka vaja ima video navodilo in opis izvedbe.'
  ),
  faq('faq-online-2', 'Potrebujem opremo?', 'Ne nujno. Program prilagodim opremi, ki jo imaš — doma ali v fitnesu.'),
  faq(
    'faq-online-3',
    'Kako poteka nadzor?',
    'Enkrat tedensko pregledam tvoje treninge in povratne informacije ter po potrebi prilagodim program.'
  ),
  faq(
    'faq-online-4',
    'Lahko pošljem video za pregled tehnike?',
    'Da. V paketu Plus pregledam tvoje posnetke in ti vrnem komentarje.'
  ),
  faq('faq-online-5', 'Se lahko kadarkoli odjavim?', '[Dopolni pogoje odpovedi.]'),
  faq(
    'faq-vratarji-1',
    'Ali trening poteka na ledu?',
    '[Dopolni: trening poteka na suhem / tudi na ledu – kje in kdaj.]'
  ),
  faq(
    'faq-vratarji-2',
    'Od katere starosti sprejemaš vratarje?',
    'Od [starost] let naprej. Pri mlajših je poudarek na koordinaciji, gibljivosti in pravilni tehniki gibanja.'
  ),
  faq(
    'faq-vratarji-3',
    'Kako se trening ujema z delom v klubu?',
    'Na ledu treniraš s klubom, z mano gradiš telo, ki to zdrži: gibljivost, moč in odziv. Načrt uskladim z urnikom tvojih treningov in tekem.'
  ),
  faq(
    'faq-vratarji-4',
    'Potrebujem vratarsko opremo?',
    'Ne. Treniramo v športni opremi, za vaje odziva uporabljam žogice in reakcijske pripomočke.'
  ),
  faq('faq-vratarji-5', 'Ali sodeluješ s trenerjem vratarjev v klubu?', '[Dopolni: da / ne, kako poteka sodelovanje.]'),
  faq('faq-pricing-1', 'Kako plačam?', '[Dopolni načine plačila.] Za vsako plačilo prejmeš račun.'),
  faq(
    'faq-pricing-2',
    'Ali lahko paket podaljšam?',
    'Da. Neporabljene treninge lahko ob nakupu novega paketa prenesemo naprej po dogovoru.'
  ),
  faq('faq-pricing-3', 'Ali paket lahko deliš z nekom drugim?', '[Dopolni pravilo.]'),
  faq(
    'faq-pricing-4',
    'Je posvet res brezplačen?',
    'Da. Uvodni posvet je brezplačen in brez obveznosti, ne glede na to, ali se potem odločiš za program.'
  ),
];

const faqIds = (prefix: string) => refs([1, 2, 3, 4, 5].map((n) => `faq-${prefix}-${n}`));

export const programs = [
  {
    _id: 'program-fitnes',
    _type: 'program',
    key: 'fitnes',
    name: 'Fitnes in osebno trenerstvo',
    slug: slug('fitnes'),
    order: 1,
    shortLabel: 'Fitnes',
    pricingLabel: 'Fitnes in osebno',
    icon: 'dumbbell',
    tagline: 'Moč, kondicija in telo, ki zdrži vsakdan.',
    cardDescription:
      'Za vse, ki želijo več moči, boljšo kondicijo in telo, ki zdrži vsakdan. Treningi ena na ena ali v paru, po tvoji meri.',
    cardBullets: ['Treningi 1 na 1 ali v paru', 'Program po tvoji meri', 'Redno merjenje napredka'],
    otherShort: 'Moč, kondicija in telo, ki zdrži vsakdan. Treningi 1 na 1 ali v paru.',
    priceFrom: { label: '[Cena] €', unit: '/ trening' },
    lead: 'Za vse, ki želijo več moči, boljšo kondicijo in telo, ki zdrži vsakdan. Treningi ena na ena ali v paru, z načrtom po tvoji meri.',
    forWho: titled([
      ['Začenjaš ali se vračaš', 'Ne veš, kje začeti, ali si imel daljši premor. Začneva pri osnovah.'],
      ['Napredek je obstal', 'Treniraš, a se ne premakneš naprej. Potrebuješ strukturo in vodenje.'],
      ['Hočeš več moči', 'Želiš biti močnejši, bolj gibljiv in imeti več energije čez dan.'],
      ['Sedeče delo', 'Napeta ramena, boleč hrbet, slaba drža. Gibanje je del rešitve.'],
    ]),
    includesLead: 'Vse, kar potrebuješ za napredek, brez ugibanja, kaj narediti na naslednjem treningu.',
    includes: [
      'Začetna ocena gibanja, moči in kondicije',
      'Program po tvoji meri',
      'Treningi 1 na 1 ali v paru',
      'Redna testiranja napredka',
      'Osnovne smernice za prehrano in regeneracijo',
      'Podpora prek sporočil med treningi',
    ],
    assessmentStep: 'Testi gibanja, moči in kondicije na prvem treningu.',
    faqs: faqIds('fitnes'),
    packages: packages([
      [
        'Posamezni trening',
        '/ trening',
        '[60] minut, plačilo po treningu.',
        ['Trening 1 na 1', 'Prilagojen program', 'Brez vezave'],
        'Začni',
        false,
      ],
      [
        'Paket 10',
        '/ 10 treningov',
        'Veljavnost [X] mesecev.',
        ['10 treningov 1 na 1', 'Začetno in končno testiranje', 'Smernice za prehrano', 'Podpora prek sporočil'],
        'Izberi paket',
        true,
      ],
      [
        'Trening v paru',
        '/ trening na osebo',
        'Za dva z enakim ciljem.',
        ['Trening za 2 osebi', 'Skupen program', 'Nižja cena na osebo'],
        'Začni v paru',
        false,
      ],
    ]),
    seo: {
      title: 'Fitnes in osebno trenerstvo',
      description:
        'Osebni treningi ena na ena ali v paru z načrtom po tvoji meri: več moči, boljša kondicija in redno merjenje napredka. Prvi posvet je brezplačen.',
    },
  },
  {
    _id: 'program-sport',
    _type: 'program',
    key: 'sport',
    name: 'Športno trenerstvo',
    slug: slug('sport'),
    order: 2,
    shortLabel: 'Šport',
    pricingLabel: 'Športno trenerstvo',
    icon: 'trophy',
    tagline: 'Hitrost, moč in manj poškodb v sezoni.',
    cardDescription:
      'Za športnike in ekipe, ki želijo biti hitrejši, močnejši in manj poškodovani. Priprava, prilagojena tvojemu športu in sezoni.',
    cardBullets: ['Testiranje gibalnih sposobnosti', 'Načrt glede na sezono in tekme', 'Individualno ali za ekipe'],
    otherShort: 'Hitrost, moč in manj poškodb. Za športnike in ekipe.',
    priceFrom: { label: '[Cena] €', unit: '/ mesec' },
    lead: 'Za športnike in ekipe, ki želijo biti hitrejši, močnejši in manj poškodovani. Priprava, prilagojena tvojemu športu in fazi sezone.',
    forWho: titled([
      ['Mladi športniki', 'Varna osnova moči in koordinacije za razvoj v klubu.'],
      ['Tekmovalci', 'Ekipni in individualni športi — več moči in hitrosti za boljše rezultate.'],
      ['Klubi in ekipe', 'Kondicijska priprava za celotno ekipo, v vaši dvorani ali pri nas.'],
      ['Vrnitev po poškodbi', 'Postopna vrnitev v igro, z jasnimi merili, kdaj si pripravljen.'],
    ]),
    includesLead: 'Priprava, ki sledi tvoji sezoni: več dela v predsezoni, vzdrževanje med tekmami.',
    includes: [
      'Testiranje gibalnih sposobnosti',
      'Načrt po fazah sezone',
      'Moč, hitrost in eksplozivnost',
      'Preventiva poškodb',
      'Individualno ali za ekipe',
      'Poročilo o napredku po vsakem testu',
    ],
    assessmentStep: 'Testi skoka, šprinta, agilnosti in moči, prilagojeni tvojemu športu.',
    faqs: faqIds('sport'),
    packages: packages([
      [
        'Individualno',
        '/ mesec',
        '[2] treninga na teden.',
        [
          'Program za tvoj šport',
          'Testiranje vsakih {interval} tednov',
          'Načrt po fazah sezone',
          'Podpora prek sporočil',
        ],
        'Izberi',
        true,
      ],
      [
        'Mala skupina',
        '/ mesec na osebo',
        '2–4 športniki, [2] treninga na teden.',
        ['Trening v skupini', 'Skupno testiranje', 'Nižja cena na osebo'],
        'Izberi',
        false,
      ],
      [
        'Ekipa',
        '',
        'Za klube in ekipe.',
        ['Treningi na vaši lokaciji', 'Testiranje cele ekipe', 'Poročilo za trenerja'],
        'Pošlji povpraševanje',
        false,
        'Po dogovoru',
      ],
    ]),
    seo: {
      title: 'Športno trenerstvo za športnike in ekipe',
      description:
        'Kondicijska priprava za športnike in klube: testiranje skoka, šprinta in agilnosti, načrt po fazah sezone in preventiva poškodb.',
    },
  },
  {
    _id: 'program-online',
    _type: 'program',
    key: 'online',
    name: 'Online trenerstvo',
    slug: slug('online'),
    order: 3,
    shortLabel: 'Online',
    pricingLabel: 'Online trenerstvo',
    icon: 'smartphone',
    tagline: 'Program in podpora, kjerkoli si.',
    cardDescription:
      'Za vse, ki trenirajo sami — doma, v fitnesu ali na poti. Program, video navodila in redni pregledi, kjerkoli si.',
    cardBullets: ['Program z video navodili', 'Tedenski pregled in prilagoditve', 'Podpora prek sporočil'],
    otherShort: 'Program, video navodila in redni pregledi, kjerkoli si.',
    priceFrom: { label: '[Cena] €', unit: '/ mesec' },
    lead: 'Za vse, ki trenirajo sami — doma, v fitnesu ali na poti. Program, video navodila in redni pregledi, kjerkoli si.',
    forWho: titled([
      ['Ni fitnesa v bližini', 'Treniraš doma ali v svojem fitnesu, vodenje pa dobiš na daljavo.'],
      ['Nepredvidljiv urnik', 'Treniraš, ko lahko. Program se prilagodi tvojemu tednu.'],
      ['Že treniraš sam', 'Imaš izkušnje, manjka pa struktura in nekdo, ki spremlja napredek.'],
      ['Po treningih v živo', 'Nadaljuj z online podporo, ko končaš paket treningov v živo.'],
    ]),
    includesLead: 'Vse, kar bi dobil v živo, razen trenerja ob sebi — ta je na drugi strani telefona.',
    includes: [
      'Program v aplikaciji [ime aplikacije]',
      'Video navodila za vsako vajo',
      'Tedenski pregled in prilagoditve',
      'Analiza tehnike prek videa',
      'Podpora prek sporočil',
      'Mesečni video klic',
    ],
    assessmentStep: 'Vprašalnik in kratki video testi, ki jih opraviš doma.',
    faqs: faqIds('online'),
    packages: packages([
      [
        'Osnovni',
        '/ mesec',
        'Brez vezave.',
        ['Program v aplikaciji', 'Video navodila', 'Tedenski pregled'],
        'Začni',
        false,
      ],
      [
        'Plus',
        '/ mesec',
        'Brez vezave.',
        ['Vse iz paketa Osnovni', 'Analiza tehnike prek videa', 'Podpora prek sporočil', 'Mesečni video klic'],
        'Izberi Plus',
        true,
      ],
      [
        '3 mesece Plus',
        '/ 3 mesece',
        'Plačilo vnaprej, [X] % ceneje.',
        ['Vse iz paketa Plus', 'Začetno in končno testiranje'],
        'Izberi',
        false,
      ],
    ]),
    seo: {
      title: 'Online trenerstvo – trening na daljavo',
      description:
        'Program v aplikaciji, video navodila za vsako vajo in tedenski pregledi napredka. Treniraš doma ali v fitnesu, vodenje dobiš na daljavo.',
    },
  },
  {
    _id: 'program-vratarji',
    _type: 'program',
    name: 'Trening za hokejske vratarje',
    slug: slug('hokejski-vratarji'),
    order: 4,
    shortLabel: 'Vratarji',
    pricingLabel: 'Hokejski vratarji',
    icon: 'shield',
    tagline: 'Hitrejši odziv, gibljivi boki in moč v položaju.',
    cardDescription:
      'Za hokejske vratarje, ki želijo hitreje reagirati, se eksplozivneje premikati v vratih in ostati zdravi skozi sezono.',
    cardBullets: ['Gibljivost bokov in kolen', 'Odziv in koordinacija oko–roka', 'Bočni odriv in eksplozivnost'],
    otherShort: 'Odziv, gibljivost in moč, prilagojeni vratarskemu položaju.',
    priceFrom: { label: '[Cena] €', unit: '/ mesec' },
    lead: 'Za hokejske vratarje vseh starosti, ki želijo hitreje reagirati, se eksplozivneje premikati v vratih in ostati zdravi skozi dolgo sezono.',
    forWho: titled([
      ['Mladi vratarji', 'Varna osnova gibljivosti, koordinacije in moči, ki jo vratar potrebuje za razvoj.'],
      ['Klubski vratarji', 'Več eksplozivnosti in hitrejši odziv za tekme na višji ravni.'],
      ['Med sezono', 'Vzdrževanje moči in gibljivosti brez dodatne utrujenosti pred tekmami.'],
      ['Po poškodbi', 'Postopna vrnitev v vrata po poškodbi kolka, dimelj ali kolena.'],
    ]),
    includesLead:
      'Trening, zgrajen okoli vratarskega položaja: gibljivost, odziv in moč, ki jih potrebuješ v vratih. [Dopolni: trening na suhem / tudi na ledu.]',
    includes: [
      'Testiranje gibljivosti in odziva',
      'Gibljivost bokov, kolen in gležnjev',
      'Odziv in koordinacija oko–roka',
      'Bočni odriv in eksplozivnost',
      'Preventiva poškodb dimelj in kolkov',
      'Načrt po fazah sezone',
    ],
    assessmentStep: 'Testi gibljivosti bokov, bočnega odriva, reakcijskega časa in ravnotežja v vratarskem položaju.',
    faqs: faqIds('vratarji'),
    packages: packages([
      [
        'Individualno',
        '/ mesec',
        '[2] treninga na teden.',
        [
          'Program za vratarski položaj',
          'Testiranje vsakih {interval} tednov',
          'Načrt po fazah sezone',
          'Podpora prek sporočil',
        ],
        'Izberi',
        true,
      ],
      [
        'Vratarska skupina',
        '/ mesec na osebo',
        '2–4 vratarji, [2] treninga na teden.',
        ['Trening v skupini', 'Skupno testiranje', 'Nižja cena na osebo'],
        'Izberi',
        false,
      ],
      [
        'Klub',
        '',
        'Za klube, ki želijo pripravo za vse svoje vratarje.',
        ['Treningi na vaši lokaciji', 'Testiranje vseh vratarjev', 'Poročilo za trenerja'],
        'Pošlji povpraševanje',
        false,
        'Po dogovoru',
      ],
    ]),
    seo: {
      title: 'Trening za hokejske vratarje',
      description:
        'Kondicijska priprava za hokejske vratarje: gibljivost bokov, odziv, bočni odriv in preventiva poškodb dimelj. Testiranje in načrt po fazah sezone.',
    },
  },
];

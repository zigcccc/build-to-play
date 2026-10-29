import 'server-only';
import { siteUrl } from '@/env/client';
import { plain } from '@/lib/metadata';
import { toPlainText } from '@/lib/portable-text';
import { formatPrice } from '@/lib/price';
import { routes } from '@/lib/routes';
import { getGlobal } from '@/sanity/queries/global';
import { getLlmsData } from '@/sanity/queries/seo';

const abs = (path: string) => `${siteUrl}${path}`;

/**
 * llms.txt (https://llmstxt.org): a plain-markdown map of the site for AI assistants.
 * The "full" variant inlines programs, prices, FAQs and contact details so an answer
 * engine can quote them without crawling every page.
 */
export async function buildLlmsTxt(full: boolean) {
  const [{ settings, locations, articlesEnabled }, data] = await Promise.all([getGlobal(false), getLlmsData()]);
  const name = plain(settings.siteName);
  const lines: string[] = [`# ${name}`, '', `> ${plain(settings.description)}`, ''];

  lines.push(
    `${name} – ${plain(settings.trainer.jobTitle)} (${plain(settings.trainer.name)}). Območje: ${plain(settings.areaServed)}. Jezik: slovenščina. Prvi posvet je brezplačen.`,
    ''
  );

  lines.push('## Programi', '');
  for (const p of data.programs) {
    lines.push(
      `- [${plain(p.name)}](${abs(routes.program(p.slug))}): ${plain(p.lead)} Cena že od ${plain(formatPrice(p.priceFrom))} ${plain(p.priceFrom.unit)}.`
    );
  }
  lines.push('');

  lines.push(
    '## Strani',
    '',
    `- [Cenik](${abs(routes.pricing)}): vsi paketi in cene, pogoji plačila in odpovedi.`,
    `- [O meni](${abs(routes.about)}): trener, pristop, izobrazba in licence.`,
    `- [Kontakt](${abs(routes.contact)}): obrazec, telefon, e-pošta, lokacije in delovni čas.`,
    ...(articlesEnabled ? [`- [Nasveti](${abs(routes.articles)}): članki o treningu, prehrani in regeneraciji.`] : []),
    ''
  );

  if (articlesEnabled && data.articles.length) {
    lines.push('## Nasveti', '');
    for (const a of data.articles)
      lines.push(`- [${plain(a.title)}](${abs(routes.article(a.slug))}): ${plain(a.excerpt)}`);
    lines.push('');
  }

  if (!full) {
    lines.push(
      '## Optional',
      '',
      `- [Celotne informacije (programi, cene, pogosta vprašanja)](${abs('/llms-full.txt')})`,
      ''
    );
    return lines.join('\n');
  }

  for (const p of data.programs) {
    lines.push(`## ${plain(p.name)}`, '', plain(p.lead), '');
    lines.push(`**Za koga:** ${p.forWho.map(plain).join(', ')}.`, '');
    lines.push('**Kaj dobiš:**', ...p.includes.map((i) => `- ${plain(i)}`), '');
    lines.push('**Paketi:**');
    for (const pk of p.packages) {
      const price = [plain(formatPrice(pk)), pk.unit && plain(pk.unit)].filter(Boolean).join(' ');
      lines.push(
        `- ${plain(pk.name)}: ${price}${pk.note ? ` (${plain(pk.note)})` : ''} – ${pk.features.map(plain).join(', ')}`
      );
    }
    lines.push('');
    if (p.faqs.length) {
      lines.push('**Pogosta vprašanja:**', '');
      for (const f of p.faqs) lines.push(`### ${plain(f.question)}`, plain(toPlainText(f.answer)), '');
    }
  }

  if (data.conditions?.length || data.pricingFaqs?.length) {
    lines.push('## Plačilo in pogoji', '');
    for (const c of data.conditions ?? []) lines.push(`- **${plain(c.title)}:** ${plain(c.text)}`);
    lines.push('');
    for (const f of data.pricingFaqs ?? []) lines.push(`### ${plain(f.question)}`, plain(toPlainText(f.answer)), '');
  }

  lines.push('## O trenerju', '', plain(data.about.lead), '');
  for (const a of data.about.approach) lines.push(`- **${plain(a.title)}:** ${plain(a.text)}`);
  lines.push('');
  for (const c of data.about.credentials) lines.push(`- ${plain(c.year)}: ${plain(c.title)}, ${plain(c.institution)}`);
  lines.push('');

  lines.push(
    '## Kontakt',
    '',
    `- Telefon: ${plain(settings.phone.display)}`,
    `- E-pošta: ${plain(settings.email)}`,
    ...settings.socials.map((s) => `- ${s.platform}: ${s.url}`),
    `- Odzivni čas: ${plain(settings.responseTime)}`,
    `- Brezplačen posvet: ${abs('/?posvet=1')}`,
    ''
  );
  if (locations.length) {
    lines.push('**Lokacije:**');
    for (const l of locations)
      lines.push(`- ${plain(l.name)}: ${plain(l.street)}, ${plain(l.postalCode)} ${plain(l.city)}`);
    lines.push('');
  }
  if (settings.openingHours.length) {
    lines.push('**Treningi po dogovoru:**');
    for (const h of settings.openingHours) lines.push(`- ${plain(h.label)}: ${plain(h.value)}`);
    lines.push('');
  }

  return lines.join('\n');
}

import 'server-only';
import { socialLabel } from '@/components/icons';
import { siteUrl } from '@/env/client';
import { plain } from '@/lib/metadata';
import { pageName } from '@/lib/nav-label';
import { toPlainText } from '@/lib/portable-text';
import { formatPrice } from '@/lib/price';
import { pageRoute, routes } from '@/lib/routes';
import { getGlobal } from '@/sanity/queries/global';
import { getLlmsData } from '@/sanity/queries/seo';

const abs = (path: string) => `${siteUrl}${path}`;

/**
 * llms.txt (https://llmstxt.org): a plain-markdown map of the site for AI assistants.
 * The "full" variant inlines programs, prices, FAQs and contact details so an answer
 * engine can quote them without crawling every page.
 */
export async function buildLlmsTxt(full: boolean) {
  const [{ settings, layout, locations, articlesEnabled }, data] = await Promise.all([getGlobal(false), getLlmsData()]);
  const t = data.copy.labels;
  const name = plain(settings.siteName);
  const lines: string[] = [`# ${name}`, '', `> ${plain(settings.description)}`, ''];

  lines.push(plain(data.copy.intro), '');

  lines.push(`## ${t.programs}`, '');
  for (const p of data.programs) {
    lines.push(
      `- [${plain(p.name)}](${abs(routes.program(p.slug))}): ${plain(p.lead)} ${t.priceFrom} ${plain(formatPrice(p.priceFrom))} ${plain(p.priceFrom.unit)}.`
    );
  }
  lines.push('');

  lines.push(`## ${t.pages}`, '');
  for (const { page, description } of data.copy.pages) {
    if (page === 'articles' && !articlesEnabled) continue;
    lines.push(`- [${pageName(layout, page)}](${abs(pageRoute(page))}): ${plain(description)}`);
  }
  lines.push('');

  if (articlesEnabled && data.articles.length) {
    lines.push(`## ${t.articles}`, '');
    for (const a of data.articles)
      lines.push(`- [${plain(a.title)}](${abs(routes.article(a.slug))}): ${plain(a.excerpt)}`);
    lines.push('');
  }

  if (!full) {
    lines.push('## Optional', '', `- [${t.fullLink}](${abs('/llms-full.txt')})`, '');
    return lines.join('\n');
  }

  for (const p of data.programs) {
    lines.push(`## ${plain(p.name)}`, '', plain(p.lead), '');
    lines.push(`**${t.forWho}:** ${p.forWho.map(plain).join(', ')}.`, '');
    lines.push(`**${t.includes}:**`, ...p.includes.map((i) => `- ${plain(i)}`), '');
    lines.push(`**${t.packages}:**`);
    for (const pk of p.packages) {
      const price = [plain(formatPrice(pk)), pk.unit && plain(pk.unit)].filter(Boolean).join(' ');
      lines.push(
        `- ${plain(pk.name)}: ${price}${pk.note ? ` (${plain(pk.note)})` : ''} – ${pk.features.map(plain).join(', ')}`
      );
    }
    lines.push('');
    if (p.faqs.length) {
      lines.push(`**${t.faqs}:**`, '');
      for (const f of p.faqs) lines.push(`### ${plain(f.question)}`, plain(toPlainText(f.answer)), '');
    }
  }

  if (data.conditions?.length || data.pricingFaqs?.length) {
    lines.push(`## ${t.terms}`, '');
    for (const c of data.conditions ?? []) lines.push(`- **${plain(c.title)}:** ${plain(c.text)}`);
    lines.push('');
    for (const f of data.pricingFaqs ?? []) lines.push(`### ${plain(f.question)}`, plain(toPlainText(f.answer)), '');
  }

  lines.push(`## ${t.about}`, '', plain(data.about.lead), '');
  for (const a of data.about.approach) lines.push(`- **${plain(a.title)}:** ${plain(a.text)}`);
  lines.push('');
  for (const c of data.about.credentials) lines.push(`- ${plain(c.year)}: ${plain(c.title)}, ${plain(c.institution)}`);
  lines.push('');

  lines.push(
    `## ${t.contact}`,
    '',
    `- ${t.phone}: ${plain(settings.phone.display)}`,
    `- ${t.email}: ${plain(settings.email)}`,
    ...settings.socials.map((s) => `- ${socialLabel[s.platform]}: ${s.url}`),
    `- ${t.responseTime}: ${plain(settings.responseTime)}`,
    `- ${t.booking}: ${abs('/?posvet=1')}`,
    ''
  );
  if (locations.length) {
    lines.push(`**${t.locations}:**`);
    for (const l of locations)
      lines.push(`- ${plain(l.name)}: ${plain(l.street)}, ${plain(l.postalCode)} ${plain(l.city)}`);
    lines.push('');
  }
  if (settings.openingHours.length) {
    lines.push(`**${t.hours}:**`);
    for (const h of settings.openingHours) lines.push(`- ${plain(h.label)}: ${plain(h.value)}`);
    lines.push('');
  }

  return lines.join('\n');
}

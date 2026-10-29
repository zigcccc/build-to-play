import { Mail, Phone } from 'lucide-react';
import { ContactForm } from '@/components/forms/contact-form';
import { SocialIcon, socialLabel } from '@/components/icons';
import { InlineText } from '@/components/portable-text';
import type { GlobalData } from '@/sanity/queries/global';
import type { HomeData } from '@/sanity/queries/home';

type Props = { data: HomeData['contact']; global: GlobalData };

export function HomeContact({ data, global }: Props) {
  const { settings, forms, programs } = global;
  const rows = [
    {
      key: 'phone',
      href: `tel:${settings.phone.e164}`,
      icon: <Phone aria-hidden size={20} />,
      label: data.labels.phone,
      value: settings.phone.display,
    },
    {
      key: 'email',
      href: `mailto:${settings.email}`,
      icon: <Mail aria-hidden size={20} />,
      label: data.labels.email,
      value: settings.email,
    },
    ...settings.socials.map((s) => ({
      key: s.platform,
      href: s.url,
      icon: <SocialIcon platform={s.platform} />,
      label: socialLabel[s.platform],
      value: s.handle,
      external: true,
    })),
  ];

  return (
    <section aria-labelledby="kontakt-title" className="sec border-hairline border-t" id="kontakt">
      <div className="wrap grid-fit items-start [--gap:clamp(40px,6vw,96px)] [--min:440px]">
        <div className="flex flex-col gap-6">
          <p className="eyebrow">{data.eyebrow}</p>
          <h2
            className="m-0 font-bold font-display text-[clamp(72px,11vw,160px)] uppercase leading-[0.85] tracking-[0.005em]"
            id="kontakt-title"
          >
            {data.heading}
          </h2>
          <p className="lead max-w-[460px] text-muted">{data.lead}</p>
          <ul className="rows m-0 mt-4 flex list-none flex-col p-0">
            {rows.map((row) => (
              <li key={row.key}>
                <a
                  className="flex min-h-16 items-center gap-4 text-ink hover:text-accent"
                  href={row.href}
                  {...('external' in row ? { rel: 'noopener', target: '_blank' } : {})}
                >
                  <span className="text-accent">{row.icon}</span>
                  <span className="w-24 text-muted text-sm">{row.label}</span>
                  <span className="font-medium">{row.value}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-[clamp(24px,4vw,44px)]">
          <ContactForm
            consent={<InlineText value={forms.labels.consent} />}
            copy={forms}
            email={settings.email}
            heading={data.formHeading}
            programs={programs.map((p) => ({ key: p.key, label: p.name }))}
            variant="home"
          />
        </div>
      </div>
    </section>
  );
}

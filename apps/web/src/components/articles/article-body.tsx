import { PortableText, type PortableTextComponents } from 'next-sanity';
import { BookingTrigger } from '@/components/booking/booking-trigger';
import { CmsLink } from '@/components/cms-link';
import { buttonStyles } from '@/components/ui/button';
import { SanityImage } from '@/components/ui/sanity-image';
import type { CmsLinkValue, PortableTextValue, SanityImage as SanityImageValue } from '@/sanity/models';

type Heading = { _key: string; title: string; tocLabel?: string; anchor?: { current?: string } };

export const tocItems = (body: PortableTextValue) =>
  (body.filter((b) => b._type === 'sectionHeading') as unknown as Heading[])
    .filter((h) => h.anchor?.current)
    .map((h) => ({ id: h.anchor?.current as string, label: h.tocLabel || h.title }));

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    lead: ({ children }) => <p className="text-[21px] text-ink leading-[33px]">{children}</p>,
    h3: ({ children }) => <h3 className="!mt-10 font-semibold text-[22px] text-ink leading-7">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="border-hairline border-y py-7 font-display font-semibold text-[clamp(28px,3vw,36px)] text-ink uppercase leading-[1.1]">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 marker:text-accent [&>li+li]:mt-2.5">{children}</ul>,
    number: ({ children }) => (
      <ol className="list-decimal pl-6 marker:font-semibold marker:text-accent [&>li+li]:mt-2.5">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => (
      <CmsLink
        className="text-accent underline underline-offset-2 hover:text-accent-hover"
        link={value as Omit<CmsLinkValue, 'label'>}
      >
        {children}
      </CmsLink>
    ),
  },
  types: {
    sectionHeading: ({ value }: { value: Heading }) => (
      <h2
        className="!mt-14 scroll-mt-[110px] font-bold font-display text-[clamp(32px,3.4vw,44px)] text-ink uppercase leading-none"
        id={value.anchor?.current}
      >
        {value.title}
      </h2>
    ),
    captionedImage: ({ value }: { value: SanityImageValue }) => (
      <figure>
        <SanityImage
          aspect={16 / 9}
          className="aspect-video w-full object-cover"
          image={value}
          sizes="(min-width: 900px) 720px, 100vw"
        />
        {value.caption && <figcaption className="mt-3 text-muted text-sm">{value.caption}</figcaption>}
      </figure>
    ),
    ctaBlock: ({ value }: { value: { eyebrow: string; text: string; buttonLabel: string } }) => (
      <aside className="card !mt-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 px-8 py-7">
        <span className="flex flex-[1_1_280px] flex-col gap-1.5">
          <span className="eyebrow">{value.eyebrow}</span>
          <span className="text-[17px] text-ink leading-[26px]">{value.text}</span>
        </span>
        <BookingTrigger className={buttonStyles()}>{value.buttonLabel}</BookingTrigger>
      </aside>
    ),
  },
};

/** Article prose: 18/30 body, gold list markers, H2s with anchors for the ToC. */
export function ArticleBody({ value }: { value: PortableTextValue }) {
  return (
    <div className="text-[18px] text-body leading-[30px] [&>*+*]:mt-6">
      <PortableText components={components} value={value as never} />
    </div>
  );
}

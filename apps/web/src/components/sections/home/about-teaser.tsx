import { CmsLink } from '@/components/cms-link';
import { Arrow } from '@/components/ui/arrow';
import { buttonStyles } from '@/components/ui/button';
import { NumberedList } from '@/components/ui/numbered-list';
import { SanityImage } from '@/components/ui/sanity-image';
import { SectionTitle } from '@/components/ui/section-title';
import type { HomeData } from '@/sanity/queries/home';

export function AboutTeaser({ about, trainer }: { about: HomeData['about']; trainer: { name: string; role: string } }) {
  return (
    <section aria-labelledby="o-meni-title" className="sec" id="o-meni">
      <div className="wrap grid-fit items-center [--gap:clamp(40px,6vw,96px)] [--min:440px]">
        <figure className="relative m-0">
          <SanityImage
            aspect={4 / 5}
            className="aspect-4/5 w-full"
            image={about.portrait}
            sizes="(min-width: 960px) 45vw, 100vw"
          />
          <figcaption className="absolute bottom-0 left-0 flex items-center gap-3 border-hairline border-t border-r bg-black px-5 py-4">
            <span className="size-2.5 bg-accent" />
            <span className="flex flex-col">
              <span className="font-semibold text-[15px] leading-5">{trainer.name}</span>
              <span className="text-[13px] text-muted leading-[18px]">{trainer.role}</span>
            </span>
          </figcaption>
        </figure>
        <SectionTitle className="gap-6" eyebrow={about.eyebrow} heading={about.heading} id="o-meni-title">
          <p className="lead">{about.lead}</p>
          <p className="text-muted leading-[26px]">{about.text}</p>
          <NumberedList className="mt-2" items={about.items} />
          <CmsLink className={`${buttonStyles({ variant: 'text' })} group self-start`} link={about.link}>
            {about.link.label}
            <Arrow />
          </CmsLink>
        </SectionTitle>
      </div>
    </section>
  );
}

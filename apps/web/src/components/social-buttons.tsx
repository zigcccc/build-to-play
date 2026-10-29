import type { SocialPlatform } from '@b2p/shared';
import { cn } from '@/lib/cn';
import { SocialIcon, socialLabel } from './icons';

/** Square icon links to the social profiles (footer, mobile menu). */
export function SocialButtons({
  socials,
  className,
}: {
  socials: { platform: SocialPlatform; url: string }[];
  className?: string;
}) {
  return (
    <div className={cn('flex gap-2', className)}>
      {socials.map((s) => (
        <a
          aria-label={socialLabel[s.platform]}
          className="inline-flex size-11 items-center justify-center border border-control text-ink hover:border-ink"
          href={s.url}
          key={s.platform}
          rel="noopener"
          target="_blank"
        >
          <SocialIcon platform={s.platform} />
        </a>
      ))}
    </div>
  );
}

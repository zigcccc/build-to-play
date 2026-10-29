import type { IconName, SocialPlatform } from '@b2p/shared';
import {
  Activity,
  Calendar,
  Clock,
  CreditCard,
  Dumbbell,
  HeartPulse,
  type LucideProps,
  MapPin,
  Receipt,
  Shield,
  Smartphone,
  Target,
  Trophy,
  Users,
} from 'lucide-react';

const programIcons = {
  dumbbell: Dumbbell,
  trophy: Trophy,
  smartphone: Smartphone,
  'credit-card': CreditCard,
  calendar: Calendar,
  clock: Clock,
  receipt: Receipt,
  'map-pin': MapPin,
  'heart-pulse': HeartPulse,
  activity: Activity,
  target: Target,
  users: Users,
  shield: Shield,
} satisfies Record<IconName, unknown>;

export function CmsIcon({ name, ...props }: { name: IconName } & LucideProps) {
  const Icon = programIcons[name];
  return <Icon aria-hidden {...props} />;
}

// Lucide dropped brand icons; these are its former outlines, kept in the same stroke style.
const socialPaths: Record<SocialPlatform, React.ReactNode> = {
  instagram: (
    <>
      <rect height="20" rx="5" ry="5" width="20" x="2" y="2" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </>
  ),
  facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  youtube: (
    <>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </>
  ),
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect height="12" width="4" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  tiktok: <path d="M9 12a4 4 0 1 0 4 4V2a5 5 0 0 0 5 5" />,
};

export function SocialIcon({ platform, size = 20 }: { platform: SocialPlatform; size?: number }) {
  return (
    <svg
      aria-hidden
      className="lucide"
      fill="none"
      height={size}
      stroke="currentColor"
      viewBox="0 0 24 24"
      width={size}
    >
      {socialPaths[platform]}
    </svg>
  );
}

export const socialLabel: Record<SocialPlatform, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
};

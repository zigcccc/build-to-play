import type { IconName } from '@b2p/shared';
import { Button, Text } from '@sanity/ui';
import {
  Activity,
  Calendar,
  Clock,
  CreditCard,
  Dumbbell,
  HeartPulse,
  type LucideIcon,
  MapPin,
  Receipt,
  Shield,
  Smartphone,
  Target,
  Trophy,
  Users,
} from 'lucide-react';
import { type StringInputProps, set } from 'sanity';

// The same Lucide icons the website renders (apps/web/src/components/icons.tsx), so editors pick what they'll see.
const icons = {
  dumbbell: [Dumbbell, 'Utež'],
  trophy: [Trophy, 'Pokal'],
  smartphone: [Smartphone, 'Telefon'],
  'credit-card': [CreditCard, 'Kartica'],
  calendar: [Calendar, 'Koledar'],
  clock: [Clock, 'Ura'],
  receipt: [Receipt, 'Račun'],
  'map-pin': [MapPin, 'Lokacija'],
  'heart-pulse': [HeartPulse, 'Srčni utrip'],
  activity: [Activity, 'Aktivnost'],
  target: [Target, 'Tarča'],
  users: [Users, 'Skupina'],
  shield: [Shield, 'Ščit'],
} satisfies Record<IconName, [LucideIcon, string]>;

/** A grid of icon buttons in place of a dropdown of icon names. */
export function IconInput({ value, onChange, readOnly }: StringInputProps) {
  return (
    <div
      role="radiogroup"
      style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fill, minmax(84px, 1fr))' }}
    >
      {Object.entries(icons).map(([name, [Icon, label]]) => {
        const selected = value === name;
        return (
          <Button
            aria-checked={selected}
            disabled={readOnly}
            key={name}
            mode={selected ? 'default' : 'ghost'}
            onClick={() => onChange(set(name))}
            role="radio"
            title={label}
            tone={selected ? 'primary' : 'default'}
          >
            <div style={{ display: 'grid', gap: 8, justifyItems: 'center' }}>
              <Icon size={24} strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.75} />
              <Text align="center" size={0} textOverflow="ellipsis">
                {label}
              </Text>
            </div>
          </Button>
        );
      })}
    </div>
  );
}

'use client';

import type { ComponentProps } from 'react';
import { useConsent } from './preferences-context';

export function CookieSettingsTrigger(props: Omit<ComponentProps<'button'>, 'onClick' | 'type'>) {
  const { openSettings } = useConsent();
  return <button {...props} onClick={openSettings} type="button" />;
}

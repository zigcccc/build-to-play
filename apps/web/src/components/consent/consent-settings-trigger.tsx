'use client';

import type { ComponentProps } from 'react';
import { useConsent } from './consent-context';

export function ConsentSettingsTrigger(props: Omit<ComponentProps<'button'>, 'onClick' | 'type'>) {
  const { openSettings } = useConsent();
  return <button {...props} onClick={openSettings} type="button" />;
}

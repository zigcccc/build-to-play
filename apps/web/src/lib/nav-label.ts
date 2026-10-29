import type { PageKey } from '@b2p/shared';
import type { GlobalData } from '@/sanity/queries/global';

/** Breadcrumb name for a fixed page, taken from the (lowercase) main-menu label. */
export function pageName(layout: GlobalData['layout'], key: PageKey) {
  const label = layout.nav.find((item) => item.target === key)?.label ?? key;
  return label.charAt(0).toUpperCase() + label.slice(1);
}

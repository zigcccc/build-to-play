import { draftMode } from 'next/headers';
import { VisualEditing } from 'next-sanity/visual-editing';

/** Click-to-edit overlays for the Sanity Presentation tool; rendered only in draft mode. */
export async function DraftTools() {
  const { isEnabled } = await draftMode();
  return isEnabled ? <VisualEditing /> : null;
}

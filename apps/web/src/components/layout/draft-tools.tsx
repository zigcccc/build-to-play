import { draftMode } from 'next/headers';
import { DraftVisualEditing } from './draft-visual-editing';

/** Click-to-edit overlays for the Sanity Presentation tool; rendered only in draft mode. */
export async function DraftTools() {
  const { isEnabled } = await draftMode();
  return isEnabled ? <DraftVisualEditing /> : null;
}

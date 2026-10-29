import type { PortableTextValue } from '@/sanity/models';

/** Plain text of portable text blocks (for JSON-LD answers, reading time, llms.txt). */
export function toPlainText(blocks: PortableTextValue): string {
  return blocks
    .map((block) =>
      block._type === 'block' && Array.isArray(block.children)
        ? (block.children as { text?: string }[]).map((child) => child.text ?? '').join('')
        : ''
    )
    .filter(Boolean)
    .join('\n\n');
}

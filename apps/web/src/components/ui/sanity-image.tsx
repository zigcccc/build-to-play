import { Image } from 'next-sanity/image';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { urlFor } from '@/sanity/image';
import type { SanityImage as SanityImageValue } from '@/sanity/models';
import { Placeholder } from './placeholder';

type Props = {
  image: SanityImageValue | null | undefined;
  sizes: string;
  className?: string;
  /** Crop to this aspect ratio (width / height), respecting the editor's hotspot. */
  aspect?: number;
  /** Fill the parent (which must be positioned) instead of using intrinsic dimensions. */
  fill?: boolean;
  preload?: boolean;
  placeholderLabel?: string;
} & Pick<ComponentProps<typeof Image>, 'style'>;

const MAX_WIDTH = 2400;

export function SanityImage({ image, sizes, className, aspect, fill, preload, placeholderLabel, style }: Props) {
  if (!image) return <Placeholder className={cn(fill && 'absolute inset-0', className)} label={placeholderLabel} />;

  const width = Math.min(image.asset.width, MAX_WIDTH);
  const height = Math.round(aspect ? width / aspect : (width / image.asset.width) * image.asset.height);
  const src = urlFor(image).width(width).height(height).fit('crop').url();
  const blur = image.asset.lqip ? { placeholder: 'blur' as const, blurDataURL: image.asset.lqip } : {};

  return fill ? (
    <Image
      alt={image.alt ?? ''}
      className={cn('object-cover', className)}
      fill
      preload={preload}
      sizes={sizes}
      src={src}
      style={style}
      {...blur}
    />
  ) : (
    <Image
      alt={image.alt ?? ''}
      className={className}
      height={height}
      preload={preload}
      sizes={sizes}
      src={src}
      style={style}
      width={width}
      {...blur}
    />
  );
}

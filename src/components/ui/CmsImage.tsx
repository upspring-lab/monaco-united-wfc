import type { CSSProperties } from 'react';
import type { Img } from '@/lib/types';

interface Props {
  img: Img;
  /** Attribut `sizes` : largeur d'affichage, pour que le navigateur choisisse la bonne déclinaison. */
  sizes?: string;
  className?: string;
  style?: CSSProperties;
  alt?: string;
  priority?: boolean;
  parallax?: string;
}

/** Image issue du CMS : WebP responsive (srcset), point focal en object-position. */
export default function CmsImage({ img, sizes = '100vw', className, style, alt, priority, parallax }: Props) {
  return (
    <img
      src={img.src}
      srcSet={img.srcSet}
      sizes={img.srcSet ? sizes : undefined}
      alt={alt ?? img.alt}
      className={className}
      style={{ objectPosition: img.pos, ...style }}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      {...(parallax ? { 'data-parallax': parallax, 'data-axis': 'y' } : {})}
    />
  );
}

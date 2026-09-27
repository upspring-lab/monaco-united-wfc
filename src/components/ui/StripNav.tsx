'use client';

import type { MouseEvent } from 'react';
import { ChevronLeft, ChevronRight } from './icons';

/** Flèches précédent / suivant pour la bande [data-strip] de la section parente. */
export default function StripNav() {
  const scroll = (dir: 1 | -1) => (e: MouseEvent<HTMLButtonElement>) => {
    const strip = e.currentTarget.closest('section')?.querySelector<HTMLElement>('[data-strip]');
    strip?.scrollBy({ left: dir * strip.clientWidth * 0.8 });
  };
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <button type="button" className="icon-btn" aria-label="Précédent" onClick={scroll(-1)}>
        <ChevronLeft />
      </button>
      <button type="button" className="icon-btn" aria-label="Suivant" onClick={scroll(1)}>
        <ChevronRight />
      </button>
    </div>
  );
}

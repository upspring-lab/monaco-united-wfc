'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

type RevealKind = 'up' | 'left' | 'down' | 'clip';

type ViewTimelineCtor = new (opts: { subject: Element }) => AnimationTimeline;

export const EASE_OUT = 'cubic-bezier(.23,1,.32,1)';
export const EASE_IN_OUT = 'cubic-bezier(.77,0,.175,1)';

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

function keyframesFor(kind: RevealKind, reduce: boolean): Keyframe[] {
  if (reduce) return [{ opacity: 0 }, { opacity: 1 }];
  switch (kind) {
    case 'clip':
      return [{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0 0 0 0)' }];
    case 'down':
      return [{ transform: 'translateY(-100%)' }, { transform: 'none' }];
    case 'left':
      return [{ opacity: 0, transform: 'translateX(-48px)' }, { opacity: 1, transform: 'none' }];
    default:
      return [{ opacity: 0, transform: 'translateY(48px)' }, { opacity: 1, transform: 'none' }];
  }
}

function makeAnim(el: Element, kind: RevealKind, delay: number, reduce: boolean): Animation {
  const clip = kind === 'clip';
  const anim = el.animate(keyframesFor(kind, reduce), {
    duration: clip ? 1000 : 750,
    delay,
    easing: clip ? EASE_IN_OUT : EASE_OUT,
    fill: 'both',
  });
  anim.pause();
  return anim;
}

/**
 * Reveals au scroll (IntersectionObserver, une seule fois) et parallax (ViewTimeline) sur le <main>.
 * Se réarme à chaque changement de page.
 */
export default function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.querySelector('main');
    if (!root || !('animate' in root)) return;
    const reduce = prefersReducedMotion();
    const pending = new Map<Element, Animation[]>();

    const play = (el: Element) => {
      const anims = pending.get(el);
      if (!anims) return;
      pending.delete(el);
      el.setAttribute('data-revealed', '');
      anims.forEach(a => a.play());
      io.unobserve(el);
    };

    const io = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && play(e.target)),
      { rootMargin: '0px 0px -8% 0px' },
    );

    root.querySelectorAll('[data-reveal]:not([data-revealed]),[data-stagger]:not([data-revealed])').forEach(el => {
      const anims = el.hasAttribute('data-stagger')
        ? [...el.children].map((c, i) => makeAnim(c, 'up', Math.min(i, 8) * 70, reduce))
        : [makeAnim(el, (el.getAttribute('data-reveal') as RevealKind) || 'up', Number(el.getAttribute('data-delay') || 0), reduce)];
      pending.set(el, anims);
      io.observe(el);
    });

    // Les éléments déjà visibles au chargement jouent immédiatement.
    const kick = () =>
      pending.forEach((_, el) => {
        const r = el.getBoundingClientRect();
        if (r.top < innerHeight * 0.92 && r.bottom > 0) play(el);
      });
    kick();
    const raf = requestAnimationFrame(kick);
    const t1 = setTimeout(kick, 150);
    const t2 = setTimeout(kick, 600);

    // Parallax : scroll-driven animations quand supportées, sinon statique.
    const parallax: Animation[] = [];
    const VT = (window as unknown as { ViewTimeline?: ViewTimelineCtor }).ViewTimeline;
    if (!reduce && VT) {
      root.querySelectorAll<HTMLElement>('[data-parallax]').forEach(el => {
        const [from, to] = (el.dataset.parallax ?? '').split(',');
        const ax = el.dataset.axis === 'y' ? 'Y' : 'X';
        try {
          parallax.push(
            el.animate(
              { transform: [`translate${ax}(${from})`, `translate${ax}(${to})`] },
              { timeline: new VT({ subject: el.parentElement ?? el }), fill: 'both', easing: 'linear' },
            ),
          );
        } catch {
          /* navigateur sans support complet : on reste statique */
        }
      });
    }

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      parallax.forEach(a => a.cancel());
      // Les éléments encore en attente restent révélables après un retour sur la page.
      pending.forEach(anims => anims.forEach(a => a.cancel()));
    };
  }, [pathname]);

  return null;
}

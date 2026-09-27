'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import type { Line, PlayerVM, StaffVM } from '@/lib/types';
import CmsImage from '@/components/ui/CmsImage';
import { EASE_OUT, prefersReducedMotion } from '@/components/motion/Motion';
import PlayerCard from './PlayerCard';
import styles from './Squad.module.css';

type View = 'players' | 'staff';
type LineFilter = 'all' | Line;

const LINES: LineFilter[] = ['all', 'G', 'D', 'M', 'A'];

export default function Squad({ locale, players, staff, staffNote }: { locale: Locale; players: PlayerVM[]; staff: StaffVM[]; staffNote?: string }) {
  const t = getDictionary(locale);
  const [view, setView] = useState<View>('players');
  const [line, setLine] = useState<LineFilter>('all');
  const gridRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  // Réapparition des cartes à chaque changement de filtre ou de vue.
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const g = gridRef.current;
    if (!g) return;
    g.setAttribute('data-revealed', '');
    const reduce = prefersReducedMotion();
    [...g.children].forEach((c, i) => {
      const delay = Math.min(i, 10) * 45;
      c.getAnimations({ subtree: true }).forEach(a => a.cancel());
      c.animate(reduce ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, transform: 'translateY(28px) scale(.96)' }, { opacity: 1, transform: 'none' }], {
        duration: 480,
        delay,
        easing: EASE_OUT,
        fill: 'backwards',
      });
      const img = c.querySelector('img');
      if (img && !reduce) img.animate([{ transform: 'scale(1.12)' }, { transform: 'scale(1)' }], { duration: 700, delay, easing: EASE_OUT, fill: 'backwards' });
    });
  }, [view, line]);

  const shown = players.filter(p => line === 'all' || p.line === line);
  const lineIndex = LINES.indexOf(line);

  return (
    <section className={`container ${styles.section}`}>
      <div className={styles.controls}>
        <div role="tablist" aria-label={t.a11y.view} className={styles.viewToggle}>
          <span className={styles.viewIndicator} style={{ transform: `translateX(${view === 'staff' ? '100%' : '0%'})` }} />
          {(
            [
              ['players', t.squad.players],
              ['staff', t.squad.staff],
            ] as [View, string][]
          ).map(([k, label]) => (
            <button key={k} type="button" role="tab" aria-selected={view === k} onClick={() => setView(k)} className={`display ${styles.viewTab}`} data-on={view === k || undefined}>
              {label}
            </button>
          ))}
        </div>
        {view === 'players' && (
          <div className={styles.lineTabs} role="group" aria-label={t.a11y.filterLine}>
            <span className={styles.lineIndicator} style={{ transform: `translateX(${lineIndex * 100}%)` }} />
            {LINES.map(k => (
              <button key={k} type="button" aria-pressed={line === k} onClick={() => setLine(k)} className={`label ${styles.lineTab}`} data-on={line === k || undefined}>
                {t.squad.lines[k]}
              </button>
            ))}
          </div>
        )}
      </div>

      {view === 'players' ? (
        <div ref={gridRef} data-stagger="1" className={styles.grid}>
          {shown.map(p => (
            <PlayerCard key={p.id} player={p} showNat />
          ))}
        </div>
      ) : (
        <>
          <div ref={gridRef} className={styles.grid}>
            {staff.map(s => (
              <div key={s.id} className={styles.staffCard}>
                <div className={`chevron ${styles.staffPhoto}`}>
                  {s.img ? <CmsImage img={s.img} alt={s.name} className="zoom" sizes="(max-width: 600px) 90vw, 320px" /> : <span className="label">{t.squad.photoSoon}</span>}
                </div>
                <div>
                  <div className={`display ${styles.staffName}`}>{s.name}</div>
                  <div className={styles.staffRole}>{s.role}</div>
                </div>
              </div>
            ))}
          </div>
          {staffNote && <p className={styles.note}>{staffNote}</p>}
        </>
      )}
    </section>
  );
}

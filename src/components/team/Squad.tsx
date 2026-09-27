'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { SQUAD, STAFF, type Line } from '@/content/club';
import { EASE_OUT, prefersReducedMotion } from '@/components/motion/Motion';
import PlayerCard from './PlayerCard';
import styles from './Squad.module.css';

type View = 'players' | 'staff';
type LineFilter = 'all' | Line;

const LINE_TABS: [LineFilter, string][] = [
  ['all', 'Toutes'],
  ['G', 'Gardiennes'],
  ['D', 'Défenseures'],
  ['M', 'Milieux'],
  ['A', 'Attaquantes'],
];

export default function Squad() {
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

  const shown = SQUAD.filter(p => line === 'all' || p.line === line);
  const lineIndex = LINE_TABS.findIndex(([k]) => k === line);

  return (
    <section className={`container ${styles.section}`}>
      <div className={styles.controls}>
        <div role="tablist" aria-label="Vue" className={styles.viewToggle}>
          <span className={styles.viewIndicator} style={{ transform: `translateX(${view === 'staff' ? '100%' : '0%'})` }} />
          {(
            [
              ['players', 'Joueuses'],
              ['staff', 'Staff'],
            ] as [View, string][]
          ).map(([k, label]) => (
            <button key={k} type="button" role="tab" aria-selected={view === k} onClick={() => setView(k)} className={`display ${styles.viewTab}`} data-on={view === k || undefined}>
              {label}
            </button>
          ))}
        </div>
        {view === 'players' && (
          <div className={styles.lineTabs} role="group" aria-label="Filtrer par poste">
            <span className={styles.lineIndicator} style={{ transform: `translateX(${lineIndex * 100}%)` }} />
            {LINE_TABS.map(([k, label]) => (
              <button key={k} type="button" aria-pressed={line === k} onClick={() => setLine(k)} className={`label ${styles.lineTab}`} data-on={line === k || undefined}>
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {view === 'players' ? (
        <div ref={gridRef} data-stagger="1" className={styles.grid}>
          {shown.map(p => (
            <PlayerCard key={p.num} player={p} showNat />
          ))}
        </div>
      ) : (
        <>
          <div ref={gridRef} className={styles.grid}>
            {STAFF.map(s => (
              <div key={s.name} className={styles.staffCard}>
                <div className={`chevron ${styles.staffPhoto}`}>
                  {s.img ? <img src={s.img} alt={s.name} className="zoom" /> : <span className="label">Photo à venir</span>}
                </div>
                <div>
                  <div className={`display ${styles.staffName}`}>{s.name}</div>
                  <div className={styles.staffRole}>{s.role}</div>
                </div>
              </div>
            ))}
          </div>
          <p className={styles.note}>Staff à compléter avec les noms et photos du club.</p>
        </>
      )}
    </section>
  );
}

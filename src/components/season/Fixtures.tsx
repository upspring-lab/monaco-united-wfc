'use client';

import { useState } from 'react';
import { FIXTURES, nextMatch, resultOf } from '@/content/club';
import { useNow } from '@/lib/useNow';
import styles from './Season.module.css';

type Venue = 'all' | 'home' | 'away';
type Tone = 'accent' | 'outline' | 'neutral';

const VENUES: [Venue, string][] = [
  ['all', 'Tous'],
  ['home', 'Domicile'],
  ['away', 'Extérieur'],
];

const RESULT_LABEL = { V: 'Victoire', N: 'Nul', D: 'Défaite' } as const;

export default function Fixtures({ buildNow }: { buildNow: number }) {
  const [venue, setVenue] = useState<Venue>('all');
  const now = useNow(30_000) ?? buildNow;
  const next = nextMatch(now);

  const rows = FIXTURES.filter(f => venue === 'all' || (venue === 'home') === f.isHome).map(f => {
    const r = resultOf(f);
    if (r) return { f, center: `${f.sh}-${f.sa}`, label: RESULT_LABEL[r], tone: (r === 'V' ? 'accent' : 'neutral') as Tone };
    const isNext = f.id === next.id;
    const pending = !isNext && f.ts < now;
    return {
      f,
      center: pending ? '-' : f.heure,
      label: isNext ? 'Prochain' : pending ? 'Score à venir' : f.isHome ? 'Domicile' : 'Extérieur',
      tone: (isNext ? 'outline' : 'neutral') as Tone,
    };
  });

  return (
    <section className={`container container--narrow ${styles.section}`}>
      <div className={styles.filters} role="group" aria-label="Filtrer les matchs">
        {VENUES.map(([k, label]) => (
          <button key={k} type="button" aria-pressed={venue === k} onClick={() => setVenue(k)} className={`label ${styles.filter}`} data-on={venue === k || undefined}>
            {label}
          </button>
        ))}
      </div>
      <div data-stagger="1" className={styles.fixtures}>
        {rows.map(({ f, center, label, tone }) => (
          <div key={f.id} className={styles.fixture} data-tone={tone}>
            <div className={styles.fxWhen}>
              <div className={`label ${styles.fxComp}`}>{f.jl}</div>
              <div className={`display ${styles.fxDate}`}>{f.date}</div>
            </div>
            <div className={`display ${styles.fxTeams}`}>
              {f.home} <span>vs</span> {f.away}
            </div>
            <div className={`display ${styles.fxCenter}`}>{center}</div>
            <div className={styles.fxTagWrap}>
              <span className={`label ${styles.tag}`} data-tone={tone}>
                {label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

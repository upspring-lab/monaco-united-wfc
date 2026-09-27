'use client';

import { useState } from 'react';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { nextMatch, resultOf } from '@/lib/matches';
import type { MatchVM } from '@/lib/types';
import { useNow } from '@/lib/useNow';
import styles from './Season.module.css';

type Venue = 'all' | 'home' | 'away';
type Tone = 'accent' | 'outline' | 'neutral';

const VENUES: Venue[] = ['all', 'home', 'away'];

export default function Fixtures({ locale, matches, renderedAt }: { locale: Locale; matches: MatchVM[]; renderedAt: number }) {
  const t = getDictionary(locale).fixtures;
  const RESULT_LABEL = { V: t.win, N: t.draw, D: t.loss } as const;
  const [venue, setVenue] = useState<Venue>('all');
  const now = useNow(30_000) ?? renderedAt;
  const next = nextMatch(matches, now);

  const rows = matches.filter(f => venue === 'all' || (venue === 'home') === f.isHome).map(f => {
    const r = resultOf(f);
    if (r) return { f, center: `${f.sh}-${f.sa}`, label: RESULT_LABEL[r], tone: (r === 'V' ? 'accent' : 'neutral') as Tone };
    const isNext = f.id === next?.id;
    const pending = !isNext && f.ts < now;
    return {
      f,
      center: pending ? '-' : f.heure,
      label: isNext ? t.next : pending ? t.pending : f.isHome ? t.home : t.away,
      tone: (isNext ? 'outline' : 'neutral') as Tone,
    };
  });

  return (
    <section className={`container container--narrow ${styles.section}`}>
      <div className={styles.filters} role="group" aria-label={getDictionary(locale).a11y.filterMatches}>
        {VENUES.map(k => (
          <button key={k} type="button" aria-pressed={venue === k} onClick={() => setVenue(k)} className={`label ${styles.filter}`} data-on={venue === k || undefined}>
            {t[k]}
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
              {f.home} <span>{getDictionary(locale).common.vs}</span> {f.away}
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

'use client';

import Link from 'next/link';
import { href, type Locale } from '@/i18n/config';
import { nextMatch } from '@/lib/matches';
import type { MatchVM } from '@/lib/types';
import { useNow } from '@/lib/useNow';
import CmsImage from '@/components/ui/CmsImage';
import { ArrowRight } from '@/components/ui/icons';
import styles from './Home.module.css';

const pad = (n: number) => String(n).padStart(2, '0');
const LABELS = ['Jours', 'Heures', 'Minutes', 'Secondes'];

export default function NextMatch({ locale, matches, renderedAt }: { locale: Locale; matches: MatchVM[]; renderedAt: number }) {
  const now = useNow();
  const next = nextMatch(matches, now ?? renderedAt);
  if (!next) return null;

  const diff = now == null ? null : Math.max(0, next.ts - now);
  const values = diff == null ? [] : [Math.floor(diff / 864e5), Math.floor(diff / 36e5) % 24, Math.floor(diff / 6e4) % 60, Math.floor(diff / 1e3) % 60];

  return (
    <section className={styles.match}>
      <div className={`container ${styles.matchInner}`}>
        <div data-reveal="left" className={styles.matchTeams}>
          <img src="/assets/logo-white.png" alt="Monaco United" className={styles.matchCrest} />
          <span className={`display ${styles.matchVs}`}>vs</span>
          {next.oppCrest ? (
            <div className={styles.matchOppCrest}>
              <CmsImage img={next.oppCrest} sizes="84px" />
            </div>
          ) : (
            <div className={`label ${styles.matchCrestPh}`}>Écusson</div>
          )}
          <div>
            <div className={`display ${styles.matchOpp}`}>{next.opp}</div>
            <div className={styles.matchDate}>
              {next.dateLong}, {next.heure}
            </div>
          </div>
        </div>
        <div data-stagger="1" className={styles.countdown} role="timer" aria-label="Compte à rebours avant le prochain match">
          {LABELS.map((l, i) => (
            <div key={l} className={styles.cdUnit}>
              <div className={`display ${styles.cdValue}`}>{values[i] != null ? pad(values[i]) : '--'}</div>
              <div className={`label ${styles.cdLabel}`}>{l}</div>
            </div>
          ))}
        </div>
        <div className={styles.matchCta}>
          <Link href={href(locale, 'calendrier')} className="btn btn--white">
            Calendrier <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}

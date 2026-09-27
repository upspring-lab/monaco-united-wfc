'use client';

import Link from 'next/link';
import { nextMatch } from '@/content/club';
import { href, type Locale } from '@/i18n/config';
import { useNow } from '@/lib/useNow';
import { ArrowRight } from '@/components/ui/icons';
import styles from './Home.module.css';

const pad = (n: number) => String(n).padStart(2, '0');

export default function NextMatch({ locale, buildNow }: { locale: Locale; buildNow: number }) {
  const now = useNow();
  const next = nextMatch(now ?? buildNow);
  const diff = now == null ? null : Math.max(0, next.ts - now);
  const units: [number, string][] =
    diff == null
      ? []
      : [
          [Math.floor(diff / 864e5), 'Jours'],
          [Math.floor(diff / 36e5) % 24, 'Heures'],
          [Math.floor(diff / 6e4) % 60, 'Minutes'],
          [Math.floor(diff / 1e3) % 60, 'Secondes'],
        ];
  const labels = ['Jours', 'Heures', 'Minutes', 'Secondes'];

  return (
    <section className={styles.match}>
      <div className={`container ${styles.matchInner}`}>
        <div data-reveal="left" className={styles.matchTeams}>
          <img src="/assets/logo-white.png" alt="Monaco United" className={styles.matchCrest} />
          <span className={`display ${styles.matchVs}`}>vs</span>
          <div className={`label ${styles.matchCrestPh}`}>Écusson</div>
          <div>
            <div className={`display ${styles.matchOpp}`}>{next.opp}</div>
            <div className={styles.matchDate}>
              {next.dateLong}, {next.heure}
            </div>
          </div>
        </div>
        <div data-stagger="1" className={styles.countdown} role="timer" aria-label="Compte à rebours avant le prochain match">
          {labels.map((l, i) => (
            <div key={l} className={styles.cdUnit}>
              <div className={`display ${styles.cdValue}`}>{units[i] ? pad(units[i][0]) : '--'}</div>
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

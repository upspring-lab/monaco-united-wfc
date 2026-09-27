import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import type { Result, StandingVM } from '@/lib/types';
import styles from './Season.module.css';

const FORM_STYLE: Record<Result, { background: string; color: string }> = {
  V: { background: 'var(--accent)', color: '#fff' },
  N: { background: 'var(--grey-300)', color: 'var(--ink)' },
  D: { background: 'var(--grey-700)', color: '#fff' },
};

export default function Standings({ locale, rows, note }: { locale: Locale; rows: StandingVM[]; note: string }) {
  const t = getDictionary(locale).table;
  return (
    <section className={`container container--narrow ${styles.section}`} style={{ overflowX: 'auto' }}>
      <table className={styles.table}>
        <thead>
          <tr className="label">
            <th>{t.pos}</th>
            <th>{t.club}</th>
            <th className={styles.num}>{t.p}</th>
            <th className={styles.num}>{t.w}</th>
            <th className={styles.num}>{t.d}</th>
            <th className={styles.num}>{t.l}</th>
            <th className={styles.num}>{t.gd}</th>
            <th>{t.form}</th>
            <th className={styles.num}>{t.pts}</th>
          </tr>
        </thead>
        <tbody data-stagger="1">
          {rows.map((r, i) => {
            const mu = r.isUs;
            const edge = i === 0 ? 'var(--accent)' : i >= rows.length - 2 ? 'var(--grey-500)' : 'transparent';
            return (
              <tr key={r.team} data-mu={mu || undefined}>
                <td className={`display ${styles.pos}`} style={{ borderLeftColor: edge }}>
                  {i + 1}
                </td>
                <td className={styles.team}>{r.team}</td>
                <td className={styles.num}>{r.j}</td>
                <td className={styles.num}>{r.g}</td>
                <td className={styles.num}>{r.n}</td>
                <td className={styles.num}>{r.p}</td>
                <td className={styles.num} style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {r.diff}
                </td>
                <td>
                  <div className={styles.form}>
                    {r.form.map((l, k) => (
                      <span key={k} style={FORM_STYLE[l]}>
                        {t.letters[l]}
                      </span>
                    ))}
                  </div>
                </td>
                <td className={`display ${styles.num} ${styles.pts}`}>{r.pts}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className={styles.legend}>
        <span>
          <i style={{ background: 'var(--accent)' }} />
          {t.up}
        </span>
        <span>
          <i style={{ background: 'var(--grey-500)' }} />
          {t.down}
        </span>
        {note && <span className={styles.legendNote}>{note}</span>}
      </div>
    </section>
  );
}

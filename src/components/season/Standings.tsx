import { MU, TABLE, type Result } from '@/content/club';
import styles from './Season.module.css';

const FORM_STYLE: Record<Result, { background: string; color: string }> = {
  V: { background: 'var(--accent)', color: '#fff' },
  N: { background: 'var(--grey-300)', color: 'var(--ink)' },
  D: { background: 'var(--grey-700)', color: '#fff' },
};

export default function Standings() {
  return (
    <section className={`container container--narrow ${styles.section}`} style={{ overflowX: 'auto' }}>
      <table className={styles.table}>
        <thead>
          <tr className="label">
            <th>#</th>
            <th>Club</th>
            <th className={styles.num}>J</th>
            <th className={styles.num}>V</th>
            <th className={styles.num}>N</th>
            <th className={styles.num}>D</th>
            <th className={styles.num}>Diff</th>
            <th>Forme</th>
            <th className={styles.num}>Pts</th>
          </tr>
        </thead>
        <tbody data-stagger="1">
          {TABLE.map((r, i) => {
            const mu = r.team === MU;
            const edge = i === 0 ? 'var(--accent)' : i >= 10 ? 'var(--grey-500)' : 'transparent';
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
                        {l}
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
          Montée
        </span>
        <span>
          <i style={{ background: 'var(--grey-500)' }} />
          Relégation
        </span>
        <span className={styles.legendNote}>Chiffres provisoires sauf Monaco United, à brancher sur le classement FFF.</span>
      </div>
    </section>
  );
}

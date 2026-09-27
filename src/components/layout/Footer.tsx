import Link from 'next/link';
import { SOCIALS } from '@/content/club';
import { DICTIONARIES, href, type Locale, type PageKey } from '@/i18n/config';
import styles from './Footer.module.css';

const CLUB: PageKey[] = ['accueil', 'academie', 'partenaires', 'contact'];
const SEASON: PageKey[] = ['equipe', 'calendrier', 'classement', 'actus'];

export default function Footer({ locale }: { locale: Locale }) {
  const t = DICTIONARIES[locale];
  const col = (title: string, pages: PageKey[]) => (
    <div className={styles.col}>
      <div className={`label ${styles.colTitle}`}>{title}</div>
      {pages.map(p => (
        <Link key={p} href={href(locale, p)} className={styles.link}>
          {t.nav[p]}
        </Link>
      ))}
    </div>
  );
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.col} style={{ gap: 16 }}>
          <img src="/assets/logo-white.png" alt="Monaco United" style={{ width: 84, height: 'auto' }} />
          <div className={styles.tagline}>
            Football féminin
            <br />
            Principauté de Monaco
          </div>
        </div>
        {col('Club', CLUB)}
        {col('Saison', SEASON)}
        <div className={styles.col}>
          <div className={`label ${styles.colTitle}`}>Suivre le club</div>
          {SOCIALS.map(s => (
            <a key={s.label} href={s.href} className={styles.link}>
              {s.label}
            </a>
          ))}
        </div>
      </div>
      <div className={`container ${styles.bottom}`}>
        <span>© 2026 Monaco United</span>
        <span>Mentions légales, confidentialité</span>
      </div>
    </footer>
  );
}

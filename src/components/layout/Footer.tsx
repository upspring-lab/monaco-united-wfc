import Link from 'next/link';
import { href, type Locale, type PageKey } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import styles from './Footer.module.css';

const CLUB: PageKey[] = ['accueil', 'academie', 'partenaires', 'contact'];
const SEASON: PageKey[] = ['equipe', 'calendrier', 'classement', 'actus'];

export default function Footer({ locale, socials }: { locale: Locale; socials: { label: string; url: string }[] }) {
  const t = getDictionary(locale);
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
            {t.footer.tagline[0]}
            <br />
            {t.footer.tagline[1]}
          </div>
        </div>
        {col(t.footer.club, CLUB)}
        {col(t.footer.season, SEASON)}
        <div className={styles.col}>
          <div className={`label ${styles.colTitle}`}>{t.footer.follow}</div>
          {socials.map(s => (
            <a key={s.label} href={s.url} className={styles.link} target="_blank" rel="noopener noreferrer">
              {s.label}
            </a>
          ))}
        </div>
      </div>
      <div className={`container ${styles.bottom}`}>
        <span>© {new Date().getFullYear()} Monaco United</span>
        <span>{t.footer.legal}</span>
      </div>
    </footer>
  );
}

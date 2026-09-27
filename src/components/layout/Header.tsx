'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LOCALES, href, pageFromPath, type Locale, type PageKey } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { ChevronDown, Close, Menu } from '@/components/ui/icons';
import styles from './Header.module.css';

interface MenuGroup {
  key: string;
  label: string;
  page?: PageKey;
  pages?: PageKey[];
}

export default function Header({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const current = pageFromPath(pathname);
  const t = getDictionary(locale);
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    setOpen(null);
    setMobile(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const menus: MenuGroup[] = [
    { key: 'actus', label: t.nav.actus, page: 'actus' },
    { key: 'saison', label: t.season, pages: ['equipe', 'calendrier', 'classement', 'academie'] },
    { key: 'club', label: 'Club', pages: ['partenaires', 'contact'] },
  ];

  const nextLocale = LOCALES[(LOCALES.indexOf(locale) + 1) % LOCALES.length];
  const langHref = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '/' + nextLocale);
  const partnerHref = href(locale, 'contact', 'objet=partenariat');

  return (
    <header className={styles.header}>
      <nav className={`container ${styles.nav}`}>
        <Link href={href(locale, 'accueil')} aria-label={t.a11y.home} className={styles.brand}>
          <img src="/assets/logo-red.png" alt="" className={styles.logo} />
          <span className={`display ${styles.brandText}`}>
            Monaco
            <br />
            United
          </span>
        </Link>

        <div className={styles.menus}>
          {menus.map(g => {
            const isOpen = open === g.key;
            const active = g.page ? current === g.page : g.pages!.includes(current);
            if (!g.pages) {
              return (
                <Link key={g.key} href={href(locale, g.page!)} className={`label ${styles.menuBtn}`} data-active={active || undefined}>
                  {g.label}
                </Link>
              );
            }
            return (
              <div key={g.key} className={styles.group} onMouseEnter={() => setOpen(g.key)} onMouseLeave={() => setOpen(null)}>
                <button
                  type="button"
                  className={`label ${styles.menuBtn}`}
                  aria-expanded={isOpen}
                  data-active={active || isOpen || undefined}
                  onClick={() => setOpen(isOpen ? null : g.key)}
                >
                  {g.label}
                  <ChevronDown />
                </button>
                <div className={styles.panelWrap} data-open={isOpen || undefined}>
                  <div className={styles.panel}>
                    {g.pages.map(p => (
                      <Link key={p} href={href(locale, p)} className={`display ${styles.panelLink}`} data-active={current === p || undefined}>
                        {t.nav[p]}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Link href={langHref} className={`label ${styles.lang}`} aria-label={t.a11y.lang} hrefLang={nextLocale}>
          {locale.toUpperCase()}
        </Link>
        <Link href={partnerHref} className={`btn btn--primary btn--sm ${styles.cta}`}>
          {t.cta}
        </Link>
        <button
          type="button"
          className={styles.burger}
          aria-label={mobile ? t.a11y.closeMenu : t.a11y.openMenu}
          aria-expanded={mobile}
          onClick={() => setMobile(m => !m)}
        >
          {mobile ? <Close /> : <Menu />}
        </button>
      </nav>

      <div className={styles.mobilePanel} data-open={mobile || undefined} aria-hidden={!mobile}>
        <div className="container">
          {(['accueil', 'actus', 'equipe', 'calendrier', 'classement', 'academie', 'partenaires', 'contact'] as PageKey[]).map(p => (
            <Link key={p} href={href(locale, p)} className={`display ${styles.mobileLink}`} data-active={current === p || undefined} tabIndex={mobile ? 0 : -1}>
              {t.nav[p]}
            </Link>
          ))}
          <Link href={partnerHref} className="btn btn--primary" style={{ marginTop: 20 }} tabIndex={mobile ? 0 : -1}>
            {t.cta}
          </Link>
        </div>
      </div>
    </header>
  );
}

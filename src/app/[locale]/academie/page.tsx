import type { Metadata } from 'next';
import Link from 'next/link';
import { CATEGORIES } from '@/content/club';
import { href, type Locale } from '@/i18n/config';
import PageHead from '@/components/ui/PageHead';
import { ArrowRight } from '@/components/ui/icons';
import styles from '@/components/pages/Pages.module.css';

export const metadata: Metadata = { title: 'Académie' };

export default async function AcademiePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return (
    <>
      <PageHead title="Académie" intro="Cinq catégories, de U9 à U18, pour former les joueuses de demain." />
      <section className={`container ${styles.section}`}>
        <div data-reveal="clip" className={styles.academyHero}>
          <img data-parallax="-8%,8%" data-axis="y" src="/assets/ph07.jpg" alt="Entraînement" />
        </div>
        <div data-stagger="1" className={styles.categories}>
          {CATEGORIES.map(c => (
            <div key={c.code} className={styles.category}>
              <div className={`display ${styles.catCode}`}>{c.code}</div>
              <div className={styles.catYears}>Nées en {c.years}</div>
              <div className={`display ${styles.catFocus}`}>{c.focus}</div>
              <div className={styles.catSlots}>{c.slots}</div>
            </div>
          ))}
        </div>
        <div data-reveal="up" className={styles.ctaRow}>
          <h2 className={`display ${styles.ctaTitle}`}>Envie de rejoindre l&apos;académie ?</h2>
          <Link href={href(locale, 'contact', 'objet=academie')} className="btn btn--primary">
            Demander un essai <ArrowRight />
          </Link>
        </div>
      </section>
    </>
  );
}

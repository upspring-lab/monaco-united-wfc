import type { Metadata } from 'next';
import Link from 'next/link';
import CmsImage from '@/components/ui/CmsImage';
import PageHead from '@/components/ui/PageHead';
import { ArrowRight } from '@/components/ui/icons';
import { href, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getCategories, getPages, toImg } from '@/lib/cms';
import styles from '@/components/pages/Pages.module.css';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = (await getPages((await params).locale as Locale)).academie;
  return { title: p?.title, description: p?.intro };
}

export default async function AcademiePage({ params }: Props) {
  const locale = (await params).locale as Locale;
  const [pages, categories] = await Promise.all([getPages(locale), getCategories(locale)]);
  const p = pages.academie;
  const t = getDictionary(locale).academy;
  const img = toImg(p?.image, 'Entraînement');
  return (
    <>
      <PageHead title={p?.title ?? ''} intro={p?.intro ?? ''} />
      <section className={`container ${styles.section}`}>
        {img && (
          <div data-reveal="clip" className={styles.academyHero}>
            <CmsImage img={img} sizes="(max-width: 1320px) 100vw, 1272px" priority parallax="-8%,8%" />
          </div>
        )}
        <div data-stagger="1" className={styles.categories}>
          {categories.map(c => (
            <div key={c.code} className={styles.category}>
              <div className={`display ${styles.catCode}`}>{c.code}</div>
              <div className={styles.catYears}>{t.born(c.years)}</div>
              <div className={`display ${styles.catFocus}`}>{c.focus}</div>
              <div className={styles.catSlots}>{c.slots}</div>
            </div>
          ))}
        </div>
        <div data-reveal="up" className={styles.ctaRow}>
          <h2 className={`display ${styles.ctaTitle}`}>{p?.ctaTitle || t.ctaTitle}</h2>
          <Link href={href(locale, 'contact', 'objet=academie')} className="btn btn--primary">
            {t.askTrial} <ArrowRight />
          </Link>
        </div>
      </section>
    </>
  );
}

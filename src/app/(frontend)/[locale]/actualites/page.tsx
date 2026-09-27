import type { Metadata } from 'next';
import Link from 'next/link';
import PageHead from '@/components/ui/PageHead';
import CmsImage from '@/components/ui/CmsImage';
import { ArrowRight } from '@/components/ui/icons';
import { articleHref, type Locale } from '@/i18n/config';
import { getNews, getPageHead } from '@/lib/cms';
import styles from '@/components/pages/Pages.module.css';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const head = await getPageHead((await params).locale as Locale, 'actus');
  return { title: head.title, description: head.intro };
}

export default async function ActualitesPage({ params }: Props) {
  const locale = (await params).locale as Locale;
  const [head, news] = await Promise.all([getPageHead(locale, 'actus'), getNews(locale, 60)]);
  const [lead, ...rest] = news;
  return (
    <>
      <PageHead title={head.title} intro={head.intro} />
      <section className={`container ${styles.section}`}>
        {lead ? (
          <>
            <article className={styles.feature}>
              <div data-reveal="clip" className={styles.featureImg}>
                <CmsImage img={lead.img} alt="" sizes="(max-width: 960px) 100vw, 640px" priority />
              </div>
              <div data-reveal="up" className={styles.featureText}>
                <span className={`label ${styles.badge}`}>{lead.cat}</span>
                <h2 className={`display ${styles.featureTitle}`}>{lead.title}</h2>
                <p className={styles.featureExcerpt}>{lead.excerpt}</p>
                <Link href={articleHref(locale, lead.slug)} className="btn btn--ink">
                  Lire l&apos;article <ArrowRight />
                </Link>
              </div>
            </article>
            <div data-stagger="1" className={styles.newsGrid}>
              {rest.map(n => (
                <Link key={n.id} href={articleHref(locale, n.slug)} className={styles.newsCard}>
                  <div className={styles.newsImg}>
                    <CmsImage img={n.img} alt="" className="zoom" sizes="(max-width: 700px) 100vw, 420px" />
                  </div>
                  <div className={styles.meta}>
                    {n.cat}, <time dateTime={n.isoDate}>{n.date}</time>
                  </div>
                  <h3 className={`display ${styles.newsTitle}`}>{n.title}</h3>
                  <p className={styles.newsExcerpt}>{n.excerpt}</p>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <p className={styles.empty}>Aucune actualité pour le moment.</p>
        )}
      </section>
    </>
  );
}

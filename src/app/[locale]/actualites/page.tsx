import type { Metadata } from 'next';
import { NEWS } from '@/content/club';
import PageHead from '@/components/ui/PageHead';
import { ArrowRight } from '@/components/ui/icons';
import styles from '@/components/pages/Pages.module.css';

export const metadata: Metadata = { title: 'Actualités' };

export default function ActualitesPage() {
  const [lead, ...rest] = NEWS;
  return (
    <>
      <PageHead title="Actualités" intro="Matchs, coulisses, académie : tout ce qui se passe à Monaco United." />
      <section className={`container ${styles.section}`}>
        <article className={styles.feature}>
          <div data-reveal="clip" className={styles.featureImg}>
            <img src={lead.img} alt="" style={{ objectPosition: lead.pos }} />
          </div>
          <div data-reveal="up" className={styles.featureText}>
            <span className={`label ${styles.badge}`}>{lead.cat}</span>
            <h2 className={`display ${styles.featureTitle}`}>{lead.title}</h2>
            <p className={styles.featureExcerpt}>{lead.excerpt}</p>
            <button type="button" className="btn btn--ink">
              Lire l&apos;article <ArrowRight />
            </button>
          </div>
        </article>
        <div data-stagger="1" className={styles.newsGrid}>
          {rest.map(n => (
            <article key={n.title} className={styles.newsCard}>
              <div className={styles.newsImg}>
                <img src={n.img} alt="" className="zoom" style={{ objectPosition: n.pos }} loading="lazy" />
              </div>
              <div className={styles.meta}>
                {n.cat}, {n.date}
              </div>
              <h3 className={`display ${styles.newsTitle}`}>{n.title}</h3>
              <p className={styles.newsExcerpt}>{n.excerpt}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

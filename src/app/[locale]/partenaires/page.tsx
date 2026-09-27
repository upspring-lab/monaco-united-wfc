import type { Metadata } from 'next';
import Link from 'next/link';
import { OFFERS } from '@/content/club';
import { href, type Locale } from '@/i18n/config';
import PageHead from '@/components/ui/PageHead';
import { ArrowRight } from '@/components/ui/icons';
import styles from '@/components/pages/Pages.module.css';

export const metadata: Metadata = { title: 'Partenaires' };

export default async function PartenairesPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return (
    <>
      <PageHead title="Partenaires" intro="Les entreprises qui accompagnent le club. Et la place qui vous attend." />
      <section className={`container ${styles.section}`}>
        <div data-stagger="1" className={styles.majors}>
          <div className={styles.major}>
            <div className={`label ${styles.majorKind}`}>Partenaire principal</div>
            <div className={`display ${styles.majorName}`} style={{ color: 'var(--accent)' }}>
              Groupe Marzocco
            </div>
            <div className={styles.majorNote}>Face avant du maillot</div>
          </div>
          <div className={styles.major}>
            <div className={`label ${styles.majorKind}`}>Équipementier</div>
            <div className={`display ${styles.majorName}`}>Erreà</div>
            <div className={styles.majorNote}>Tenues match et entraînement</div>
          </div>
        </div>
        <div className={styles.pitch}>
          <h2 data-reveal="up" className={`display ${styles.pitchTitle}`}>
            Devenez <span>partenaire</span>
          </h2>
          <p data-reveal="up" data-delay="90" className={styles.pitchText}>
            Associez votre marque à un club ambitieux, visible en Principauté et sur la Côte d&apos;Azur.
          </p>
        </div>
        <div data-stagger="1" className={styles.offers}>
          {OFFERS.map(o => (
            <div key={o.t} className={styles.offer}>
              <h3 className="display">{o.t}</h3>
              <p>{o.d}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 40 }}>
          <Link href={href(locale, 'contact', 'objet=partenariat')} className="btn btn--primary">
            Devenir partenaire <ArrowRight />
          </Link>
        </div>
      </section>
    </>
  );
}

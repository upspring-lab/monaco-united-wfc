import type { Metadata } from 'next';
import Link from 'next/link';
import CmsImage from '@/components/ui/CmsImage';
import PageHead from '@/components/ui/PageHead';
import { ArrowRight } from '@/components/ui/icons';
import { href, type Locale } from '@/i18n/config';
import { getPages, getPartners } from '@/lib/cms';
import type { PartnerVM } from '@/lib/types';
import styles from '@/components/pages/Pages.module.css';

type Props = { params: Promise<{ locale: string }> };

const TIER_LABEL: Record<PartnerVM['tier'], string> = {
  main: 'Partenaire principal',
  kit: 'Équipementier',
  official: 'Partenaire officiel',
  academy: 'Partenaire académie',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = (await getPages((await params).locale as Locale)).partenaires;
  return { title: p?.title, description: p?.intro };
}

export default async function PartenairesPage({ params }: Props) {
  const locale = (await params).locale as Locale;
  const [pages, partners] = await Promise.all([getPages(locale), getPartners(locale)]);
  const p = pages.partenaires;
  const majors = partners.filter(x => !x.placeholder && (x.tier === 'main' || x.tier === 'kit'));
  const others = partners.filter(x => !x.placeholder && x.tier !== 'main' && x.tier !== 'kit');

  const tile = (x: PartnerVM) => {
    const body = (
      <>
        <div className={`label ${styles.majorKind}`}>{TIER_LABEL[x.tier]}</div>
        <div className={`display ${styles.majorName}`} style={{ color: x.tier === 'main' ? 'var(--accent)' : undefined }}>
          {x.logo ? <CmsImage img={x.logo} alt={x.name} className={styles.majorLogo} sizes="360px" /> : x.name}
        </div>
        {x.placement && <div className={styles.majorNote}>{x.placement}</div>}
      </>
    );
    return x.url ? (
      <a key={x.id} href={x.url} target="_blank" rel="noopener noreferrer" className={styles.major}>
        {body}
      </a>
    ) : (
      <div key={x.id} className={styles.major}>
        {body}
      </div>
    );
  };

  return (
    <>
      <PageHead title={p?.title ?? ''} intro={p?.intro ?? ''} />
      <section className={`container ${styles.section}`}>
        {majors.length > 0 && (
          <div data-stagger="1" className={styles.majors}>
            {majors.map(tile)}
          </div>
        )}
        {others.length > 0 && (
          <div data-stagger="1" className={styles.majors} style={{ marginTop: 8 }}>
            {others.map(tile)}
          </div>
        )}
        <div className={styles.pitch}>
          <h2 data-reveal="up" className={`display ${styles.pitchTitle}`}>
            {p?.pitchTitle ? (
              p.pitchTitle
            ) : (
              <>
                Devenez <span>partenaire</span>
              </>
            )}
          </h2>
          {p?.pitchText && (
            <p data-reveal="up" data-delay="90" className={styles.pitchText}>
              {p.pitchText}
            </p>
          )}
        </div>
        {!!p?.offers?.length && (
          <div data-stagger="1" className={styles.offers}>
            {p.offers.map(o => (
              <div key={o.id ?? o.title} className={styles.offer}>
                <h3 className="display">{o.title}</h3>
                <p>{o.text}</p>
              </div>
            ))}
          </div>
        )}
        <div style={{ marginTop: 40 }}>
          <Link href={href(locale, 'contact', 'objet=partenariat')} className="btn btn--primary">
            Devenir partenaire <ArrowRight />
          </Link>
        </div>
      </section>
    </>
  );
}

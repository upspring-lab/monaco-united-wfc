import Link from 'next/link';
import { GALLERY, MU, NEWS, PARTNERS_STRIP, SQUAD, TABLE, VIDEOS } from '@/content/club';
import { href, type Locale } from '@/i18n/config';
import { ArrowRight, Play } from '@/components/ui/icons';
import PlayerCard from '@/components/team/PlayerCard';
import StripNav from '@/components/ui/StripNav';
import styles from './Home.module.css';

export function HomeNews({ locale }: { locale: Locale }) {
  const lead = NEWS[0];
  const actus = href(locale, 'actus');
  return (
    <section className={`container ${styles.news}`}>
      <div className="section-head" style={{ marginBottom: 36 }}>
        <h2 data-reveal="up" className="display h2">
          Actualités
        </h2>
        <Link href={actus} className="btn btn--ink">
          Tout voir <ArrowRight />
        </Link>
      </div>
      <div className={styles.newsGrid}>
        <Link href={actus} className={styles.newsLead}>
          <div data-reveal="clip" className={styles.newsLeadImg}>
            <img src={lead.img} alt="" className="zoom zoom--soft" style={{ objectPosition: lead.pos }} />
          </div>
          <div data-reveal="up" className={styles.newsLeadText}>
            <span className={`label ${styles.cat}`}>{lead.cat}</span>
            <h3 className={`display ${styles.newsLeadTitle}`}>{lead.title}</h3>
            <p className={styles.newsLeadExcerpt}>{lead.excerpt}</p>
          </div>
        </Link>
        <div data-stagger="1" className={styles.newsList}>
          {NEWS.slice(1, 5).map(n => (
            <Link key={n.title} href={actus} className={styles.newsItem}>
              <div className={styles.newsThumb}>
                <img src={n.img} alt="" className="zoom" style={{ objectPosition: n.pos }} />
              </div>
              <div>
                <div className={styles.meta}>
                  {n.cat}, {n.date}
                </div>
                <div className={`display ${styles.newsItemTitle}`}>{n.title}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TypeBand() {
  return (
    <section className={styles.band} aria-hidden>
      <div data-parallax="0%,-28%" className={`display ${styles.bandLine} ${styles.bandRed}`}>
        Monaco United  Monaco United  Monaco United
      </div>
      <div data-parallax="-28%,0%" className={`display ${styles.bandLine} ${styles.bandOutline}`}>
        Jouer pour la Principauté  Jouer pour la Principauté
      </div>
    </section>
  );
}

export function PlayersStrip({ locale }: { locale: Locale }) {
  return (
    <section className={styles.dark}>
      <div className={`container ${styles.darkInner}`}>
        <div className="section-head" style={{ marginBottom: 40 }}>
          <h2 data-reveal="up" className="display h2">
            Les joueuses
          </h2>
          <div className={styles.headActions}>
            <StripNav />
            <Link href={href(locale, 'equipe')} className="btn btn--white">
              Effectif <ArrowRight />
            </Link>
          </div>
        </div>
        <div data-strip="1" data-stagger="1" className={styles.playersStrip}>
          {SQUAD.filter(p => p.line !== 'G')
            .slice(0, 6)
            .map(p => (
              <PlayerCard key={p.num} player={p} dark imgPos="50% 20%" nameSize={24} snap />
            ))}
        </div>
      </div>
    </section>
  );
}

export function StandingsAcademy({ locale }: { locale: Locale }) {
  return (
    <section className={`container ${styles.duo}`}>
      <div>
        <div className="section-head" style={{ marginBottom: 28 }}>
          <h2 data-reveal="up" className="display h2">
            Classement
          </h2>
          <Link href={href(locale, 'classement')} className="btn btn--ink">
            Complet <ArrowRight />
          </Link>
        </div>
        <div data-stagger="1" className={styles.top3}>
          {TABLE.slice(0, 3).map((r, i) => {
            const mu = r.team === MU;
            return (
              <div key={r.team} className={styles.top3Row} style={{ background: mu ? 'var(--accent-100)' : '#fff' }}>
                <span className={`display ${styles.top3Pos}`} style={{ color: mu ? 'var(--accent)' : 'var(--ink)' }}>
                  {i + 1}
                </span>
                <div>
                  <div className={`display ${styles.top3Team}`}>{r.team}</div>
                  <div className={styles.meta} style={{ marginTop: 2 }}>
                    {r.g} V, {r.n} N, {r.p} D
                  </div>
                </div>
                <span className={`display ${styles.top3Pts}`}>
                  {r.pts}
                  <span> pts</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div data-reveal="clip" className={styles.academy}>
        <div className={styles.academyBg}>
          <img data-parallax="-8%,8%" data-axis="y" src="/assets/ph07.jpg" alt="" />
        </div>
        <div className={styles.academyBody}>
          <h2 className="display h2">L&apos;académie</h2>
          <p>De U9 à U18, la formation des joueuses de la Principauté.</p>
          <Link href={href(locale, 'academie')} className="btn btn--white">
            Découvrir <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Videos() {
  return (
    <section className={styles.dark} style={{ marginTop: 104 }}>
      <div className={`container ${styles.darkInner}`} style={{ paddingBottom: 80 }}>
        <div className="section-head" style={{ marginBottom: 36 }}>
          <h2 data-reveal="up" className="display h2">
            Vidéos
          </h2>
          <div className={styles.headActions}>
            <span className={styles.soon}>Contenus à venir</span>
            <StripNav />
          </div>
        </div>
        <div data-strip="1" data-stagger="1" className={styles.videoStrip}>
          {VIDEOS.map(v => (
            <article key={v.title} className={styles.video}>
              <div className={styles.videoImg}>
                <img src={v.img} alt="" className="zoom" />
                <span className={styles.play}>
                  <Play />
                </span>
              </div>
              <div className={`display ${styles.videoTitle}`}>{v.title}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Gallery() {
  return (
    <section className={`container ${styles.gallerySection}`}>
      <h2 data-reveal="up" className="display h2" style={{ marginBottom: 36 }}>
        Galerie
      </h2>
      <div className={styles.gallery}>
        {GALLERY.map(g => (
          <div key={g.img} data-reveal="clip" className={styles.galleryCell} style={{ gridColumn: `span ${g.c}`, gridRow: `span ${g.r}` }}>
            <img data-parallax="-6%,6%" data-axis="y" src={g.img} alt="" loading="lazy" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function PartnersStrip() {
  const color = { accent: 'var(--accent)', ink: 'var(--ink)', muted: 'var(--grey-500)' };
  return (
    <section className={`container ${styles.partners}`}>
      <div className={`label ${styles.partnersTitle}`}>Nos partenaires</div>
      <div data-stagger="1" className={styles.partnersGrid}>
        {PARTNERS_STRIP.map((p, i) => (
          <div key={i} className={`display ${styles.partnerTile}`} style={{ color: color[p.tone] }}>
            {p.name}
          </div>
        ))}
      </div>
    </section>
  );
}

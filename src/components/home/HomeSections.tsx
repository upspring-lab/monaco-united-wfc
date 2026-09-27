import Link from 'next/link';
import { articleHref, href, type Locale } from '@/i18n/config';
import type { Img, NewsVM, PartnerVM, PlayerVM, StandingVM, VideoVM } from '@/lib/types';
import CmsImage from '@/components/ui/CmsImage';
import { ArrowRight, Play } from '@/components/ui/icons';
import PlayerCard from '@/components/team/PlayerCard';
import StripNav from '@/components/ui/StripNav';
import styles from './Home.module.css';

export function HomeNews({ locale, news }: { locale: Locale; news: NewsVM[] }) {
  const [lead, ...rest] = news;
  if (!lead) return null;
  return (
    <section className={`container ${styles.news}`}>
      <div className="section-head" style={{ marginBottom: 36 }}>
        <h2 data-reveal="up" className="display h2">
          Actualités
        </h2>
        <Link href={href(locale, 'actus')} className="btn btn--ink">
          Tout voir <ArrowRight />
        </Link>
      </div>
      <div className={styles.newsGrid}>
        <Link href={articleHref(locale, lead.slug)} className={styles.newsLead}>
          <div data-reveal="clip" className={styles.newsLeadImg}>
            <CmsImage img={lead.img} alt="" className="zoom zoom--soft" sizes="(max-width: 960px) 100vw, 640px" />
          </div>
          <div data-reveal="up" className={styles.newsLeadText}>
            <span className={`label ${styles.cat}`}>{lead.cat}</span>
            <h3 className={`display ${styles.newsLeadTitle}`}>{lead.title}</h3>
            <p className={styles.newsLeadExcerpt}>{lead.excerpt}</p>
          </div>
        </Link>
        <div data-stagger="1" className={styles.newsList}>
          {rest.slice(0, 4).map(n => (
            <Link key={n.id} href={articleHref(locale, n.slug)} className={styles.newsItem}>
              <div className={styles.newsThumb}>
                <CmsImage img={n.img} alt="" className="zoom" sizes="148px" />
              </div>
              <div>
                <div className={styles.meta}>
                  {n.cat}, <time dateTime={n.isoDate}>{n.date}</time>
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

export function TypeBand({ line1, line2 }: { line1: string; line2: string }) {
  if (!line1 && !line2) return null;
  const repeat = (s: string, n: number) => Array(n).fill(s).join('  ');
  return (
    <section className={styles.band} aria-hidden>
      <div data-parallax="0%,-28%" className={`display ${styles.bandLine} ${styles.bandRed}`}>
        {repeat(line1, 3)}
      </div>
      <div data-parallax="-28%,0%" className={`display ${styles.bandLine} ${styles.bandOutline}`}>
        {repeat(line2, 2)}
      </div>
    </section>
  );
}

export function PlayersStrip({ locale, players }: { locale: Locale; players: PlayerVM[] }) {
  const shown = players.filter(p => p.line !== 'G').slice(0, 6);
  if (!shown.length) return null;
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
          {shown.map(p => (
            <PlayerCard key={p.id} player={p} dark nameSize={24} snap />
          ))}
        </div>
      </div>
    </section>
  );
}

export function StandingsAcademy({ locale, rows, academy }: { locale: Locale; rows: StandingVM[]; academy: { text: string; img?: Img } }) {
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
          {rows.slice(0, 3).map((r, i) => (
            <div key={r.team} className={styles.top3Row} style={{ background: r.isUs ? 'var(--accent-100)' : '#fff' }}>
              <span className={`display ${styles.top3Pos}`} style={{ color: r.isUs ? 'var(--accent)' : 'var(--ink)' }}>
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
          ))}
        </div>
      </div>
      <div data-reveal="clip" className={styles.academy}>
        {academy.img && (
          <div className={styles.academyBg}>
            <CmsImage img={academy.img} alt="" sizes="(max-width: 960px) 100vw, 640px" parallax="-8%,8%" />
          </div>
        )}
        <div className={styles.academyBody}>
          <h2 className="display h2">L&apos;académie</h2>
          {academy.text && <p>{academy.text}</p>}
          <Link href={href(locale, 'academie')} className="btn btn--white">
            Découvrir <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Videos({ videos, note }: { videos: VideoVM[]; note: string }) {
  if (!videos.length) return null;
  return (
    <section className={styles.dark} style={{ marginTop: 104 }}>
      <div className={`container ${styles.darkInner}`} style={{ paddingBottom: 80 }}>
        <div className="section-head" style={{ marginBottom: 36 }}>
          <h2 data-reveal="up" className="display h2">
            Vidéos
          </h2>
          <div className={styles.headActions}>
            {note && <span className={styles.soon}>{note}</span>}
            <StripNav />
          </div>
        </div>
        <div data-strip="1" data-stagger="1" className={styles.videoStrip}>
          {videos.map(v => {
            const body = (
              <>
                <div className={styles.videoImg}>
                  <CmsImage img={v.img} alt="" className="zoom" sizes="240px" />
                  <span className={styles.play}>
                    <Play />
                  </span>
                </div>
                <div className={`display ${styles.videoTitle}`}>{v.title}</div>
              </>
            );
            return v.url ? (
              <a key={v.id} href={v.url} target="_blank" rel="noopener noreferrer" className={styles.video}>
                {body}
              </a>
            ) : (
              <article key={v.id} className={styles.video}>
                {body}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Gallery({ items }: { items: { img: Img; c: number; r: number }[] }) {
  if (!items.length) return null;
  return (
    <section className={`container ${styles.gallerySection}`}>
      <h2 data-reveal="up" className="display h2" style={{ marginBottom: 36 }}>
        Galerie
      </h2>
      <div className={styles.gallery}>
        {items.map((g, i) => (
          <div key={i} data-reveal="clip" className={styles.galleryCell} style={{ gridColumn: `span ${g.c}`, gridRow: `span ${g.r}` }}>
            <CmsImage img={g.img} sizes={g.c === 2 ? '(max-width: 600px) 100vw, 660px' : '(max-width: 600px) 50vw, 330px'} parallax="-6%,6%" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function PartnersStrip({ partners }: { partners: PartnerVM[] }) {
  const shown = partners.filter(p => p.showOnHome);
  if (!shown.length) return null;
  const color = (p: PartnerVM) => (p.placeholder ? 'var(--grey-500)' : p.tier === 'main' ? 'var(--accent)' : 'var(--ink)');
  return (
    <section className={`container ${styles.partners}`}>
      <div className={`label ${styles.partnersTitle}`}>Nos partenaires</div>
      <div data-stagger="1" className={styles.partnersGrid}>
        {shown.map(p => {
          const inner = p.logo ? <CmsImage img={p.logo} alt={p.name} className={styles.partnerLogo} sizes="200px" /> : p.name;
          return p.url ? (
            <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer" className={`display ${styles.partnerTile}`} style={{ color: color(p) }}>
              {inner}
            </a>
          ) : (
            <div key={p.id} className={`display ${styles.partnerTile}`} style={{ color: color(p) }}>
              {inner}
            </div>
          );
        })}
      </div>
    </section>
  );
}

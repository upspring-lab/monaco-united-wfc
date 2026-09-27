import type { Img } from '@/lib/types';
import CmsImage from '@/components/ui/CmsImage';
import styles from './Home.module.css';

/** Hero « Bannière » : fanion rouge à découpe chevron + 3 photos pleine hauteur en parallax. */
export default function Hero({ photos, tagline }: { photos: Img[]; tagline: string }) {
  const lines = tagline.split('\n');
  return (
    <section className={styles.hero}>
      <div data-reveal="down" className={styles.pennant}>
        <h1 className={styles.pennantTitle}>
          <img src="/assets/logo-white.png" alt="Monaco United" className={styles.pennantLogo} />
        </h1>
        <div className={`label ${styles.pennantText}`}>
          {lines.map((l, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {l}
            </span>
          ))}
        </div>
      </div>
      <div data-stagger="1" className={styles.heroPhotos}>
        {photos.slice(0, 3).map((p, i) => (
          <div key={i} className={styles.heroPhoto}>
            <CmsImage img={p} alt="" sizes="(max-width: 720px) 33vw, 25vw" priority parallax="-5%,5%" />
          </div>
        ))}
      </div>
    </section>
  );
}

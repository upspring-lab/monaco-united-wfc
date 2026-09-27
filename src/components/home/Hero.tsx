import styles from './Home.module.css';

const PHOTOS = [
  { src: '/assets/ph18.jpg', pos: '50% 20%' },
  { src: '/assets/ph13.jpg', pos: '50% 25%' },
  { src: '/assets/ph10.jpg', pos: '50% 18%' },
];

/** Hero « Bannière » : fanion rouge à découpe chevron + 3 photos pleine hauteur en parallax. */
export default function Hero() {
  return (
    <section className={styles.hero}>
      <div data-reveal="down" className={styles.pennant}>
        <h1 className={styles.pennantTitle}>
          <img src="/assets/logo-white.png" alt="Monaco United" className={styles.pennantLogo} />
        </h1>
        <div className={`label ${styles.pennantText}`}>
          Football féminin
          <br />
          Principauté de Monaco
        </div>
      </div>
      <div data-stagger="1" className={styles.heroPhotos}>
        {PHOTOS.map(p => (
          <div key={p.src} className={styles.heroPhoto}>
            <img data-parallax="-5%,5%" data-axis="y" src={p.src} alt="" style={{ objectPosition: p.pos }} fetchPriority="high" />
          </div>
        ))}
      </div>
    </section>
  );
}

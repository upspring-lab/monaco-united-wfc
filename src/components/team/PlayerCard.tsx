import type { Player } from '@/content/club';
import styles from './PlayerCard.module.css';

interface Props {
  player: Player;
  dark?: boolean;
  imgPos?: string;
  nameSize?: number;
  snap?: boolean;
  showNat?: boolean;
}

/** Carte joueuse à découpe chevron, numéro en surimpression. */
export default function PlayerCard({ player: p, dark, imgPos = '50% 18%', nameSize = 26, snap, showNat }: Props) {
  return (
    <div className={styles.card} style={snap ? { scrollSnapAlign: 'start' } : undefined}>
      <div className={`chevron ${styles.photo}`}>
        <img src={p.img} alt={p.name} className="zoom" style={{ objectPosition: imgPos }} loading="lazy" />
        <span className={`display ${styles.num}`}>{p.num}</span>
      </div>
      <div>
        <div className={`display ${styles.name}`} style={{ fontSize: nameSize }}>
          {p.name}
        </div>
        <div className={styles.pos} style={{ color: dark ? 'rgba(255,255,255,.65)' : 'var(--grey-600)' }}>
          {showNat ? `${p.pos}, ${p.nat}` : p.pos}
        </div>
      </div>
    </div>
  );
}

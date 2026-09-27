import type { PlayerVM } from '@/lib/types';
import CmsImage from '@/components/ui/CmsImage';
import styles from './PlayerCard.module.css';

interface Props {
  player: PlayerVM;
  dark?: boolean;
  nameSize?: number;
  snap?: boolean;
  showNat?: boolean;
}

/** Carte joueuse à découpe chevron, numéro en surimpression. */
export default function PlayerCard({ player: p, dark, nameSize = 26, snap, showNat }: Props) {
  return (
    <div className={styles.card} style={snap ? { scrollSnapAlign: 'start' } : undefined}>
      <div className={`chevron ${styles.photo}`}>
        <CmsImage img={p.img} alt={p.name} className="zoom" sizes="(max-width: 600px) 90vw, 320px" />
        <span className={`display ${styles.num}`}>{p.num}</span>
      </div>
      <div>
        <div className={`display ${styles.name}`} style={{ fontSize: nameSize }}>
          {p.name}
        </div>
        <div className={styles.pos} style={{ color: dark ? 'rgba(255,255,255,.65)' : 'var(--grey-600)' }}>
          {showNat && p.nat ? `${p.pos}, ${p.nat}` : p.pos}
        </div>
      </div>
    </div>
  );
}

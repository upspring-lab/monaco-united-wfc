'use client';

import { useEffect, useState } from 'react';

/**
 * Horloge rafraîchie chaque seconde. Retourne null au premier rendu (SSR / hydratation)
 * pour éviter tout écart entre le HTML statique et le client.
 */
export function useNow(intervalMs = 1000): number | null {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

import type { Metadata } from 'next';
import Fixtures from '@/components/season/Fixtures';
import PageHead from '@/components/ui/PageHead';

export const metadata: Metadata = { title: 'Calendrier' };

export default function CalendrierPage() {
  return (
    <>
      <PageHead title="Calendrier" intro="Régional 1 et Coupe de France. Horaires susceptibles d'évoluer." />
      <Fixtures buildNow={Date.now()} />
    </>
  );
}

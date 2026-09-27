import type { Metadata } from 'next';
import Standings from '@/components/season/Standings';
import PageHead from '@/components/ui/PageHead';

export const metadata: Metadata = { title: 'Classement' };

export default function ClassementPage() {
  return (
    <>
      <PageHead title="Classement" intro="Régional 1 féminin, Ligue Méditerranée. 12 clubs, 22 journées." />
      <Standings />
    </>
  );
}

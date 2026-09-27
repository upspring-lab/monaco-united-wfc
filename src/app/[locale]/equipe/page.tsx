import type { Metadata } from 'next';
import Squad from '@/components/team/Squad';
import PageHead from '@/components/ui/PageHead';

export const metadata: Metadata = { title: "L'équipe" };

export default function EquipePage() {
  return (
    <>
      <PageHead title="L'équipe" intro="Treize joueuses, un staff, une ambition : faire briller la Principauté au plus haut niveau." />
      <Squad />
    </>
  );
}

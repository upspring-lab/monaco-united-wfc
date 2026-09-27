import type { Metadata } from 'next';
import Squad from '@/components/team/Squad';
import PageHead from '@/components/ui/PageHead';
import type { Locale } from '@/i18n/config';
import { getPageHead, getPages, getPlayers, getStaff } from '@/lib/cms';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const head = await getPageHead((await params).locale as Locale, 'equipe');
  return { title: head.title, description: head.intro };
}

export default async function EquipePage({ params }: Props) {
  const locale = (await params).locale as Locale;
  const [head, players, staff, pages] = await Promise.all([getPageHead(locale, 'equipe'), getPlayers(locale), getStaff(locale), getPages(locale)]);
  return (
    <>
      <PageHead title={head.title} intro={head.intro} />
      <Squad locale={locale} players={players} staff={staff} staffNote={pages.equipe?.staffNote ?? undefined} />
    </>
  );
}

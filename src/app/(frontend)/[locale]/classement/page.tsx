import type { Metadata } from 'next';
import Standings from '@/components/season/Standings';
import PageHead from '@/components/ui/PageHead';
import type { Locale } from '@/i18n/config';
import { getPageHead, getStandings } from '@/lib/cms';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const head = await getPageHead((await params).locale as Locale, 'classement');
  return { title: head.title, description: head.intro };
}

export default async function ClassementPage({ params }: Props) {
  const locale = (await params).locale as Locale;
  const [head, standings] = await Promise.all([getPageHead(locale, 'classement'), getStandings(locale)]);
  return (
    <>
      <PageHead title={head.title} intro={head.intro} />
      <Standings rows={standings.rows} note={standings.note} />
    </>
  );
}

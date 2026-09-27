import type { Metadata } from 'next';
import Fixtures from '@/components/season/Fixtures';
import PageHead from '@/components/ui/PageHead';
import type { Locale } from '@/i18n/config';
import { getMatches, getPageHead } from '@/lib/cms';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const head = await getPageHead((await params).locale as Locale, 'calendrier');
  return { title: head.title, description: head.intro };
}

export default async function CalendrierPage({ params }: Props) {
  const locale = (await params).locale as Locale;
  const [head, matches] = await Promise.all([getPageHead(locale, 'calendrier'), getMatches(locale)]);
  return (
    <>
      <PageHead title={head.title} intro={head.intro} />
      <Fixtures matches={matches} renderedAt={Date.now()} />
    </>
  );
}

import type { Metadata } from 'next'
import { CollectionTiles } from '@/components/sections/CollectionTiles'
import { PageIntro } from '@/components/sections/PageIntro'
import { StoryIndex } from '@/components/sections/StoryIndex'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { stories } from '@/lib/content'
import { resolveLocale } from '@/lib/messages'
import { pageMetadata } from '@/lib/metadata'

export async function generateMetadata({ params }: PageProps<'/[locale]/work'>): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params)
  return pageMetadata(locale, '/work', t.meta.pages.work.title, t.meta.pages.work.description)
}

export default async function WorkPage({ params }: PageProps<'/[locale]/work'>) {
  const { locale, t } = await resolveLocale(params)

  return (
    <>
      <PageIntro eyebrow={t.work.eyebrow} title={t.work.title} intro={t.work.intro} />
      <div className="page-gutter mx-auto max-w-page pb-24">
        <CollectionTiles locale={locale} t={t} viewLabel={t.work.explore} />
      </div>
      <section className="page-gutter mx-auto max-w-page py-24 md:py-32">
        <SectionHeading eyebrow={t.work.stories} title={t.home.featured.title} />
        <div className="mt-14">
          <StoryIndex stories={stories} locale={locale} t={t} />
        </div>
      </section>
    </>
  )
}

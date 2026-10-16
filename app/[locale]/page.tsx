import type { Metadata } from 'next'
import { Hero } from '@/components/sections/Hero'
import { CollectionTiles } from '@/components/sections/CollectionTiles'
import { StoryIndex } from '@/components/sections/StoryIndex'
import { AboutPreview, ContactPreview, ServicesList } from '@/components/sections/HomeSections'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { stories } from '@/lib/content'
import { resolveLocale } from '@/lib/messages'
import { pageMetadata } from '@/lib/metadata'

export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params)
  return pageMetadata(locale, '/', t.meta.defaultTitle, t.meta.description, { absoluteTitle: true })
}

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale, t } = await resolveLocale(params)

  return (
    <>
      <Hero locale={locale} t={t} />

      <section className="page-gutter mx-auto max-w-page py-24 md:py-36">
        <SectionHeading index="01" eyebrow={t.home.selected.eyebrow} title={t.home.selected.title} intro={t.home.selected.intro} />
        <div className="mt-16 md:mt-24">
          <CollectionTiles locale={locale} t={t} viewLabel={t.home.selected.view} />
        </div>
      </section>

      <section className="page-gutter mx-auto max-w-page py-24 md:py-36">
        <SectionHeading index="02" eyebrow={t.home.featured.eyebrow} title={t.home.featured.title} />
        <div className="mt-14 md:mt-20">
          <StoryIndex stories={stories} locale={locale} t={t} />
        </div>
      </section>

      <AboutPreview locale={locale} t={t} />
      <div className="border-t border-line" />
      <ServicesList locale={locale} t={t} />
      <ContactPreview locale={locale} t={t} />
    </>
  )
}

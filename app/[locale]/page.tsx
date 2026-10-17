import type { Metadata } from 'next'
import Link from 'next/link'
import { FilmGrid } from '@/components/media/FilmGrid'
import { Hero } from '@/components/sections/Hero'
import { CollectionTiles } from '@/components/sections/CollectionTiles'
import { StoryIndex } from '@/components/sections/StoryIndex'
import { AboutPreview, ContactPreview, ServicesList } from '@/components/sections/HomeSections'
import { Arrow } from '@/components/ui/Arrow'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { homeFilms, stories } from '@/lib/content'
import { localePath } from '@/lib/i18n'
import { filmLabels } from '@/lib/labels'
import { getFilms, toFilmCard } from '@/lib/media'
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

      {/* Automotive films lead straight after the hero. */}
      <section className="page-gutter mx-auto max-w-page pb-24 md:pb-32">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
          <SectionHeading eyebrow={t.homeFilms.eyebrow} title={t.homeFilms.title} intro={t.homeFilms.intro} />
          <Link href={localePath(locale, '/work/films')} className="label inline-flex items-center gap-3 text-ink">
            <span className="link-underline">{t.films.viewAll}</span>
            <Arrow direction="forward" className="w-8 rtl:-scale-x-100" />
          </Link>
        </div>
        <FilmGrid
          films={homeFilms.map((slug) => toFilmCard(getFilms().find((f) => f.slug === slug)!, locale))}
          labels={filmLabels(t)}
        />
      </section>

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

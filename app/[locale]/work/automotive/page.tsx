import type { Metadata } from 'next'
import { Gallery } from '@/components/gallery/Gallery'
import { FilmSection } from '@/components/sections/CollectionSections'
import { PageIntro } from '@/components/sections/PageIntro'
import { format, localePath } from '@/lib/i18n'
import { galleryLabels } from '@/lib/labels'
import { categorySlugs, getFilms, toPhoto } from '@/lib/media'
import { resolveLocale } from '@/lib/messages'
import { pageMetadata } from '@/lib/metadata'

export async function generateMetadata({ params }: PageProps<'/[locale]/work/automotive'>): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params)
  return pageMetadata(locale, '/work/automotive', t.meta.pages.automotive.title, t.meta.pages.automotive.description)
}

export default async function AutomotivePage({ params }: PageProps<'/[locale]/work/automotive'>) {
  const { locale, t } = await resolveLocale(params)
  const slugs = categorySlugs('automotive')
  const story = t.stories.automotive

  return (
    <>
      <PageIntro
        eyebrow={t.categories.automotive.title}
        title={story.title}
        intro={story.intro}
        back={{ href: localePath(locale, '/work'), label: t.nav.work }}
        aside={<p className="label mt-6 text-stone">{format(t.story.count, { count: slugs.length })}</p>}
      />
      <div className="page-gutter mx-auto max-w-page pb-8">
        <Gallery groups={[{ id: 'automotive', photos: slugs.map((s) => toPhoto(s, locale)) }]} labels={galleryLabels(t)} title={story.title} />
      </div>
      <FilmSection locale={locale} t={t} films={getFilms('automotive')} title={t.films.automotive} />
    </>
  )
}

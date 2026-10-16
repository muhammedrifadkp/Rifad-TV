import type { Metadata } from 'next'
import { FilmSection, StoryPreview, filmsBySlug } from '@/components/sections/CollectionSections'
import { PageIntro } from '@/components/sections/PageIntro'
import { stories } from '@/lib/content'
import { localePath } from '@/lib/i18n'
import { storySlugs } from '@/lib/media'
import { resolveLocale } from '@/lib/messages'
import { pageMetadata } from '@/lib/metadata'

export async function generateMetadata({ params }: PageProps<'/[locale]/work/weddings'>): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params)
  return pageMetadata(locale, '/work/weddings', t.meta.pages.weddings.title, t.meta.pages.weddings.description)
}

export default async function WeddingsPage({ params }: PageProps<'/[locale]/work/weddings'>) {
  const { locale, t } = await resolveLocale(params)
  const weddingStories = stories.filter((s) => s.category === 'weddings')

  return (
    <>
      <PageIntro
        eyebrow={t.work.eyebrow}
        title={t.categories.weddings.title}
        intro={t.categories.weddings.description}
        back={{ href: localePath(locale, '/work'), label: t.nav.work }}
      />
      {weddingStories.map((story, i) => (
        <StoryPreview key={story.key} locale={locale} t={t} story={story} slugs={storySlugs(story.key)} index={i + 1} />
      ))}
      <FilmSection locale={locale} t={t} films={filmsBySlug(['film-bridal-blush', 'film-bridal-gold'])} title={t.films.wedding} />
    </>
  )
}

import type { Metadata } from 'next'
import { FilmSection, StoryPreview, filmsBySlug } from '@/components/sections/CollectionSections'
import { PageIntro } from '@/components/sections/PageIntro'
import { getStory, type Story } from '@/lib/content'
import { localePath } from '@/lib/i18n'
import { categorySlugs, getImage, storySlugs } from '@/lib/media'
import { resolveLocale } from '@/lib/messages'
import { pageMetadata } from '@/lib/metadata'

export async function generateMetadata({ params }: PageProps<'/[locale]/work/portraits'>): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params)
  return pageMetadata(locale, '/work/portraits', t.meta.pages.portraits.title, t.meta.pages.portraits.description)
}

export default async function PortraitsPage({ params }: PageProps<'/[locale]/work/portraits'>) {
  const { locale, t } = await resolveLocale(params)
  const traditional = getStory('traditional-portrait-session') as Story
  const bridal = getStory('bridal-sessions') as Story
  // Bridal frames tagged as portraits in media/sources.json.
  const bridalPortraits = categorySlugs('portraits').filter((s) => getImage(s).story === bridal.key)

  return (
    <>
      <PageIntro
        eyebrow={t.work.eyebrow}
        title={t.categories.portraits.title}
        intro={t.categories.portraits.description}
        back={{ href: localePath(locale, '/work'), label: t.nav.work }}
      />
      <StoryPreview locale={locale} t={t} story={traditional} slugs={storySlugs(traditional.key)} index={1} limit={8} />
      <StoryPreview locale={locale} t={t} story={bridal} slugs={bridalPortraits} index={2} />
      <FilmSection locale={locale} t={t} films={filmsBySlug(['film-red-saree'])} title={t.categories.films.title} />
    </>
  )
}

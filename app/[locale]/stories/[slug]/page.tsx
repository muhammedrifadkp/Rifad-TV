import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Gallery, type GalleryGroup } from '@/components/gallery/Gallery'
import { PhotoImage } from '@/components/media/PhotoImage'
import { PageIntro } from '@/components/sections/PageIntro'
import { Arrow } from '@/components/ui/Arrow'
import { getStory, storyPages, type Story } from '@/lib/content'
import { format, localePath, locales, type Locale } from '@/lib/i18n'
import { galleryLabels } from '@/lib/labels'
import { getImage, storySlugs, toPhoto, type Chapter } from '@/lib/media'
import { resolveLocale, type Messages } from '@/lib/messages'
import { pageMetadata } from '@/lib/metadata'

const chapterOrder: Chapter[] = ['bride', 'nikah', 'together', 'portraits']

export function generateStaticParams() {
  return locales.flatMap((locale) => storyPages.map((s) => ({ locale, slug: s.key })))
}

function findStory(slug: string): Story {
  const story = getStory(slug)
  if (!story?.hasPage) notFound()
  return story
}

export async function generateMetadata({ params }: PageProps<'/[locale]/stories/[slug]'>): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params)
  const story = findStory((await params).slug)
  const copy = t.stories[story.key]
  return pageMetadata(locale, story.href, copy.title, copy.intro)
}

/** Chapters for the Nikah story; every other story is a single sequence. */
function groupsFor(story: Story, locale: Locale, t: Messages): GalleryGroup[] {
  const slugs = storySlugs(story.key)
  if (story.key !== 'nikah-ceremony') return [{ id: story.key, photos: slugs.map((s) => toPhoto(s, locale)) }]
  const chapters = t.stories['nikah-ceremony'].chapters
  return chapterOrder
    .map((chapter) => ({
      id: chapter,
      title: chapters[chapter],
      photos: slugs.filter((s) => getImage(s).chapter === chapter).map((s) => toPhoto(s, locale)),
    }))
    .filter((g) => g.photos.length > 0)
}

export default async function StoryPage({ params }: PageProps<'/[locale]/stories/[slug]'>) {
  const { locale, t } = await resolveLocale(params)
  const story = findStory((await params).slug)
  const copy = t.stories[story.key]
  const slugs = storySlugs(story.key)
  const cover = toPhoto(story.cover, locale)
  // Pair the cover with a frame from mid-story, so the opening doesn't repeat the first chapter.
  const middle = slugs[Math.floor(slugs.length / 2)]
  const second = toPhoto(middle !== story.cover ? middle : slugs[0], locale)
  const count = slugs.length
  const categoryHref = `/work/${story.category}`
  const categoryTitle = t.categories[story.category].title
  const next = storyPages[(storyPages.indexOf(story) + 1) % storyPages.length]

  return (
    <article>
      <PageIntro
        eyebrow={copy.kind}
        title={copy.title}
        intro={copy.intro}
        back={{ href: localePath(locale, categoryHref), label: format(t.story.back, { category: categoryTitle }) }}
        aside={<p className="label mt-6 text-stone">{format(t.story.count, { count })}</p>}
      />

      {/* Opening diptych: portrait frames side by side rather than a destructive wide crop. */}
      <div className="page-gutter mx-auto grid max-w-page gap-4 sm:grid-cols-12 sm:gap-8">
        <figure className="hero-rise relative aspect-[4/5] overflow-hidden bg-bone sm:col-span-7">
          <PhotoImage photo={cover} cover preload sizes="(min-width: 640px) 56vw, 100vw" />
        </figure>
        <figure
          className="hero-rise relative hidden aspect-[3/4] self-end overflow-hidden bg-bone sm:col-span-5 sm:block"
          style={{ ['--rise-delay' as string]: '200ms' }}
        >
          <PhotoImage photo={second} cover sizes="40vw" />
        </figure>
      </div>

      <div className="page-gutter mx-auto max-w-page py-24 md:py-32">
        <Gallery groups={groupsFor(story, locale, t)} labels={galleryLabels(t)} title={copy.title} />
      </div>

      <nav aria-label={t.story.next} className="border-t border-line">
        <Link href={localePath(locale, next.href)} className="page-gutter group mx-auto grid max-w-page items-center gap-8 py-16 md:grid-cols-12 md:py-24">
          <span className="md:col-span-7">
            <span className="label text-stone">{t.story.next}</span>
            <span className="display mt-4 block text-5xl text-ink transition-colors group-hover:text-burgundy sm:text-6xl lg:text-7xl">
              {t.stories[next.key].title}
            </span>
            <Arrow direction="forward" className="mt-6 w-12 transition-transform duration-500 group-hover:translate-x-2 rtl:-scale-x-100 rtl:group-hover:-translate-x-2" />
          </span>
          <span className="relative block aspect-[16/10] overflow-hidden bg-bone md:col-span-5">
            <PhotoImage photo={{ ...toPhoto(next.cover, locale), alt: '' }} cover sizes="(min-width: 768px) 40vw, 100vw" />
          </span>
        </Link>
      </nav>
    </article>
  )
}

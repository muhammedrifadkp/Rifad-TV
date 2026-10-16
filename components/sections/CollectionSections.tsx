import Link from 'next/link'
import { Gallery } from '@/components/gallery/Gallery'
import { FilmGrid } from '@/components/media/FilmGrid'
import { Arrow } from '@/components/ui/Arrow'
import { Reveal } from '@/components/ui/Reveal'
import type { Story } from '@/lib/content'
import { format, localePath, type Locale } from '@/lib/i18n'
import { filmLabels, galleryLabels } from '@/lib/labels'
import { getFilms, storySlugs, toFilmCard, toPhoto, type FilmEntry } from '@/lib/media'
import type { Messages } from '@/lib/messages'

type Base = { locale: Locale; t: Messages }

/** A story on a collection page: heading, a short edit of frames, and a link to the full story. */
export function StoryPreview({
  locale,
  t,
  story,
  slugs,
  index,
  limit = 5,
}: Base & { story: Story; slugs: string[]; index: number; limit?: number }) {
  const copy = t.stories[story.key]
  const photos = slugs.slice(0, limit).map((s) => toPhoto(s, locale))
  return (
    <section aria-labelledby={`story-${story.key}`} className="page-gutter mx-auto max-w-page py-16 md:py-24">
      <Reveal className="mb-12 grid gap-6 border-t border-line pt-8 md:mb-16 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-7">
          <p className="label flex items-center gap-3 text-stone">
            <span className="text-burgundy">{String(index).padStart(2, '0')}</span>
            {copy.kind}
          </p>
          <h2 id={`story-${story.key}`} className="display mt-4 text-4xl text-ink sm:text-5xl lg:text-6xl">
            {copy.title}
          </h2>
        </div>
        <div className="md:col-span-5 md:self-end">
          <p className="text-lg text-charcoal">{copy.intro}</p>
          {story.hasPage && (
            <Link href={localePath(locale, story.href)} className="label mt-6 inline-flex items-center gap-3 text-ink">
              <span className="link-underline">{t.home.featured.view}</span>
              <span className="text-stone">· {format(t.story.count, { count: storySlugs(story.key).length })}</span>
              <Arrow direction="forward" className="w-8 rtl:-scale-x-100" />
            </Link>
          )}
        </div>
      </Reveal>
      <Gallery groups={[{ id: story.key, photos }]} labels={galleryLabels(t)} title={copy.title} />
    </section>
  )
}

/** Films related to a collection, with a link to the full films page. */
export function FilmSection({ locale, t, films, title }: Base & { films: FilmEntry[]; title: string }) {
  if (!films.length) return null
  return (
    <section className="page-gutter mx-auto max-w-page py-16 md:py-24">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6 border-t border-line pt-8">
        <h2 className="display text-4xl text-ink sm:text-5xl">{title}</h2>
        <Link href={localePath(locale, '/work/films')} className="label inline-flex items-center gap-3 text-ink">
          <span className="link-underline">{t.films.viewAll}</span>
          <Arrow direction="forward" className="w-8 rtl:-scale-x-100" />
        </Link>
      </div>
      <FilmGrid films={films.map((f) => toFilmCard(f, locale))} labels={filmLabels(t)} />
    </section>
  )
}

export function filmsBySlug(slugs: string[]) {
  const all = getFilms()
  return slugs.map((s) => all.find((f) => f.slug === s)).filter((f): f is FilmEntry => Boolean(f))
}

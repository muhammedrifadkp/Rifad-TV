import type { Metadata } from 'next'
import { FilmGrid } from '@/components/media/FilmGrid'
import { PageIntro } from '@/components/sections/PageIntro'
import { localePath } from '@/lib/i18n'
import { filmLabels } from '@/lib/labels'
import { getFilms, toFilmCard } from '@/lib/media'
import { resolveLocale } from '@/lib/messages'
import { pageMetadata } from '@/lib/metadata'

export async function generateMetadata({ params }: PageProps<'/[locale]/work/films'>): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params)
  return pageMetadata(locale, '/work/films', t.meta.pages.films.title, t.meta.pages.films.description)
}

export default async function FilmsPage({ params }: PageProps<'/[locale]/work/films'>) {
  const { locale, t } = await resolveLocale(params)
  const groups = [
    { id: 'automotive', title: t.films.automotive, films: getFilms('automotive') },
    { id: 'wedding', title: t.films.wedding, films: getFilms('wedding') },
  ] as const

  return (
    <>
      <PageIntro
        eyebrow={t.films.eyebrow}
        title={t.films.title}
        intro={t.films.intro}
        back={{ href: localePath(locale, '/work'), label: t.nav.work }}
      />
      {groups.map((group, i) => (
        <section key={group.id} aria-labelledby={`films-${group.id}`} className="page-gutter mx-auto max-w-page py-12 md:py-20">
          <h2 id={`films-${group.id}`} className="mb-12 flex items-baseline gap-4 border-t border-line pt-8">
            <span className="label text-burgundy">{String(i + 1).padStart(2, '0')}</span>
            <span className="display text-4xl text-ink sm:text-5xl">{group.title}</span>
          </h2>
          <FilmGrid films={group.films.map((f) => toFilmCard(f, locale))} labels={filmLabels(t)} />
        </section>
      ))}
    </>
  )
}

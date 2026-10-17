import Link from 'next/link'
import { Arrow } from '@/components/ui/Arrow'
import { PhotoImage } from '@/components/media/PhotoImage'
import { Reveal } from '@/components/ui/Reveal'
import { categories } from '@/lib/content'
import { localePath, type Locale } from '@/lib/i18n'
import { filmPosterPhoto, toPhoto } from '@/lib/media'
import type { Messages } from '@/lib/messages'

// Asymmetric two-column rhythm: a large frame beside a smaller one set lower.
// Films sit in a small slot because their posters come from 720p video.
const layout = ['md:col-span-7', 'md:col-span-5 md:mt-48', 'md:col-span-7', 'md:col-span-5 md:mt-48']

/** The four collections, each with its cover, title, description and link. */
export function CollectionTiles({ locale, t, viewLabel }: { locale: Locale; t: Messages; viewLabel: string }) {
  return (
    <ul className="grid gap-x-10 gap-y-20 md:grid-cols-12">
      {categories.map((c, i) => {
        const photo = c.key === 'films' ? filmPosterPhoto(c.cover, locale) : toPhoto(c.cover, locale)
        const copy = t.categories[c.key]
        return (
          <Reveal as="li" key={c.key} className={layout[i]}>
            <Link href={localePath(locale, c.href)} className="group block">
              <span className="relative block aspect-[4/5] overflow-hidden bg-bone">
                <PhotoImage
                  photo={{ ...photo, alt: '' }}
                  cover
                  sizes={i % 2 === 0 ? '(min-width: 768px) 55vw, 67vw' : '(min-width: 768px) 40vw, 67vw'}
                  className="transition-transform duration-[1400ms] ease-editorial group-hover:scale-[1.03] motion-reduce:transition-none"
                />
              </span>
              <span className="mt-6 flex items-baseline gap-4">
                <span className="label text-burgundy">{String(i + 1).padStart(2, '0')}</span>
                <span className="display text-4xl text-ink md:text-5xl">{copy.title}</span>
              </span>
              <span className="mt-4 block max-w-md text-charcoal">{copy.description}</span>
              <span className="label mt-5 inline-flex items-center gap-3 text-ink">
                <span className="link-underline group-hover:bg-[length:100%_1px]">{viewLabel}</span>
                <Arrow direction="forward" className="w-8 transition-transform duration-500 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
              </span>
            </Link>
          </Reveal>
        )
      })}
    </ul>
  )
}

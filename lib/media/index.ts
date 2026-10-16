import manifest from './manifest.generated.json'
import type { Locale } from '@/lib/i18n'

export type Category = 'automotive' | 'weddings' | 'portraits'
export type Chapter = 'bride' | 'nikah' | 'together' | 'portraits'

type Localized = Record<Locale, string>

export type ImageEntry = {
  src: string
  width: number
  height: number
  widths: number[]
  blurDataURL: string
  story: string
  chapter: Chapter | null
  categories: Category[]
  focal: string
  alt: Localized
}

export type FilmEntry = {
  slug: string
  group: 'automotive' | 'wedding'
  src: string
  width: number
  height: number
  duration: number
  bytes: number
  orientation: 'portrait' | 'landscape'
  excerpt: boolean
  flashing: boolean
  title: Localized
  poster: Pick<ImageEntry, 'src' | 'width' | 'height' | 'widths' | 'blurDataURL'>
}

/** The serialisable shape passed to client components. */
export type Photo = {
  slug: string
  src: string
  width: number
  height: number
  blurDataURL: string
  alt: string
  focal: string
}

const images = manifest.images as Record<string, ImageEntry>
const films = Object.values(manifest.films) as FilmEntry[]

export function getImage(slug: string): ImageEntry {
  const image = images[slug]
  if (!image) throw new Error(`Unknown image "${slug}". Run "npm run media" after editing media/sources.json.`)
  return image
}

export function toPhoto(slug: string, locale: Locale): Photo {
  const { src, width, height, blurDataURL, alt, focal } = getImage(slug)
  return { slug, src, width, height, blurDataURL, alt: alt[locale], focal }
}

/** Slugs in manifest order, which follows the curated order in media/sources.json. */
export function storySlugs(story: string): string[] {
  return Object.keys(images).filter((slug) => images[slug].story === story)
}

export function categorySlugs(category: Category): string[] {
  return Object.keys(images).filter((slug) => images[slug].categories.includes(category))
}

export function getFilms(group?: FilmEntry['group']): FilmEntry[] {
  return group ? films.filter((f) => f.group === group) : films
}

/** The serialisable film shape passed to the client film grid. */
export type FilmCard = {
  slug: string
  src: string
  width: number
  height: number
  duration: number
  orientation: 'portrait' | 'landscape'
  excerpt: boolean
  flashing: boolean
  title: string
  poster: Photo
  /** Largest generated poster, used as the <video> poster frame. */
  posterUrl: string
}

export function toFilmCard(film: FilmEntry, locale: Locale): FilmCard {
  const { poster } = film
  return {
    slug: film.slug,
    src: film.src,
    width: film.width,
    height: film.height,
    duration: film.duration,
    orientation: film.orientation,
    excerpt: film.excerpt,
    flashing: film.flashing,
    title: film.title[locale],
    poster: filmPosterPhoto(film.slug, locale),
    posterUrl: `${poster.src}-${poster.widths[poster.widths.length - 1]}.webp`,
  }
}

/** A film poster as a Photo, e.g. for collection covers. */
export function filmPosterPhoto(slug: string, locale: Locale): Photo {
  const film = films.find((f) => f.slug === slug)
  if (!film) throw new Error(`Unknown film "${slug}".`)
  const { src, width, height, blurDataURL } = film.poster
  return { slug: `${slug}-poster`, src, width, height, blurDataURL, alt: film.title[locale], focal: '50% 50%' }
}

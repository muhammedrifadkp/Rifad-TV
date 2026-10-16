import type { Metadata } from 'next'
import { localeMeta, localePath, locales, type Locale } from '@/lib/i18n'

/** Canonical + hreflang alternates for a locale-independent route like "/work". */
export function alternatesFor(locale: Locale, path: string): Metadata['alternates'] {
  return {
    canonical: localePath(locale, path),
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, localePath(l, path)])),
      'x-default': localePath('en', path),
    },
  }
}

export const ogImage = { url: '/og/r7-og.jpg', width: 1200, height: 630 }

/**
 * Page metadata. Next merges openGraph shallowly, so every page repeats the
 * shared fields (site name, image) rather than relying on the layout.
 */
export function pageMetadata(
  locale: Locale,
  path: string,
  title: string,
  description: string,
  options: { absoluteTitle?: boolean } = {},
): Metadata {
  return {
    title: options.absoluteTitle ? { absolute: title } : title,
    description,
    alternates: alternatesFor(locale, path),
    openGraph: {
      title,
      description,
      url: localePath(locale, path),
      siteName: 'R7',
      locale: localeMeta[locale].ogLocale,
      type: 'website',
      images: [ogImage],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage.url] },
  }
}

/** Strips the <em> emphasis markers used in display headings. */
export function plain(text: string): string {
  return text.replace(/<\/?em>/g, '')
}

import { NextResponse, type NextRequest } from 'next/server'
import { storyPages } from '@/lib/content'
import { defaultLocale, isLocale, locales, type Locale } from '@/lib/i18n'

// Sends locale-less URLs (e.g. "/" or "/about") to the visitor's preferred language.
function preferredLocale(header: string | null): Locale {
  const ranked = (header ?? '')
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';q=')
      return { lang: tag.toLowerCase().split('-')[0], q: q ? Number(q) : 1 }
    })
    .sort((a, b) => b.q - a.q)
  const match = ranked.find((r) => (locales as readonly string[]).includes(r.lang))
  return (match?.lang as Locale | undefined) ?? defaultLocale
}

const storySlugs = new Set<string>(storyPages.map((s) => s.key))

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const [, locale = '', section, slug, ...rest] = pathname.split('/')

  if (isLocale(locale)) {
    // Story pages render unknown slugs on demand; send them to an unmatched
    // route instead so they get a real 404 status rather than a soft 404.
    if (section === 'stories' && slug && (!storySlugs.has(slug) || rest.some(Boolean))) {
      return NextResponse.rewrite(new URL(`/${locale}/not-found`, request.url))
    }
    return
  }

  const url = request.nextUrl.clone()
  url.pathname = `/${preferredLocale(request.headers.get('accept-language'))}${pathname === '/' ? '' : pathname}`
  const response = NextResponse.redirect(url)
  response.headers.set('Vary', 'Accept-Language')
  return response
}

export const config = {
  // Skip Next internals, generated media and any path that looks like a file.
  matcher: ['/((?!_next|media|og|.*\\..*).*)'],
}

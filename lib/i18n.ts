// Locale helpers that are safe to import from client components (no dictionaries here).

export const locales = ['en', 'ar'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export const localeMeta: Record<Locale, { dir: 'ltr' | 'rtl'; ogLocale: string; name: string }> = {
  en: { dir: 'ltr', ogLocale: 'en_AE', name: 'English' },
  ar: { dir: 'rtl', ogLocale: 'ar_AE', name: 'العربية' },
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'en' ? 'ar' : 'en'
}

/** Builds a locale-prefixed path, e.g. localePath('ar', '/work') -> '/ar/work'. */
export function localePath(locale: Locale, path = '/'): string {
  return path === '/' ? `/${locale}` : `/${locale}${path}`
}

/** Swaps the locale prefix of a pathname, keeping the rest of the route. */
export function switchLocalePath(pathname: string, target: Locale): string {
  const [, first = '', ...rest] = pathname.split('/')
  const tail = isLocale(first) ? rest : [first, ...rest]
  const path = tail.filter(Boolean).join('/')
  return localePath(target, path ? `/${path}` : '/')
}

/** Replaces {name} tokens in a message. */
export function format(message: string, values: Record<string, string | number>): string {
  return message.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`))
}

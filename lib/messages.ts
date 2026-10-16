import 'server-only'
import { notFound } from 'next/navigation'
import { en, type Messages } from '@/messages/en'
import { ar } from '@/messages/ar'
import { isLocale, type Locale } from '@/lib/i18n'

const dictionaries: Record<Locale, Messages> = { en, ar }

export function getMessages(locale: Locale): Messages {
  return dictionaries[locale]
}

/** Resolves the [locale] param of a page, 404ing on anything unsupported. */
export async function resolveLocale(params: Promise<{ locale: string }>): Promise<{ locale: Locale; t: Messages }> {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return { locale, t: dictionaries[locale] }
}

export type { Messages }

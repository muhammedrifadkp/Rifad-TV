import Link from 'next/link'
import { locale as localeParam } from 'next/root-params'
import { Rich } from '@/components/ui/Rich'
import { isLocale, localePath, defaultLocale } from '@/lib/i18n'
import { getMessages } from '@/lib/messages'

export default async function NotFound() {
  const value = await localeParam()
  const locale = isLocale(value) ? value : defaultLocale
  const t = getMessages(locale)

  return (
    <section className="page-gutter mx-auto flex min-h-[70svh] max-w-page flex-col justify-center py-24">
      <p className="label text-burgundy">{t.notFound.eyebrow}</p>
      <h1 className="display mt-6 max-w-4xl text-[clamp(3rem,7vw,6.5rem)] text-ink">
        <Rich text={t.notFound.title} />
      </h1>
      <p className="mt-8 max-w-md text-lg text-charcoal">{t.notFound.body}</p>
      <Link href={localePath(locale)} className="label link-underline mt-10 self-start py-2 text-ink">
        {t.notFound.home}
      </Link>
    </section>
  )
}

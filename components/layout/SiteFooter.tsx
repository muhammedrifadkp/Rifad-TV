import Link from 'next/link'
import { BrandMark } from '@/components/brand/BrandMark'
import { localePath, type Locale } from '@/lib/i18n'
import type { Messages } from '@/lib/messages'
import { contact, publishedInstagram } from '@/lib/site'

export function SiteFooter({ locale, t }: { locale: Locale; t: Messages }) {
  const explore = [
    { href: '/work/automotive', label: t.nav.automotive },
    { href: '/work/films', label: t.nav.films },
    { href: '/work/weddings', label: t.nav.weddings },
    { href: '/work/portraits', label: t.nav.portraits },
    { href: '/work', label: t.nav.work },
    { href: '/about', label: t.nav.about },
  ]

  return (
    <footer className="border-t border-line bg-paper">
      <div className="page-gutter mx-auto grid max-w-page gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <Link href={localePath(locale)} aria-label={t.nav.home} className="inline-block">
            <BrandMark className="h-24" />
          </Link>
          <p className="label mt-6 text-stone">{t.footer.tagline}</p>
        </div>

        <nav aria-label={t.footer.explore} className="md:col-span-3">
          <h2 className="label text-stone">{t.footer.explore}</h2>
          <ul className="mt-5 space-y-2.5">
            {explore.map((item) => (
              <li key={item.href}>
                <Link href={localePath(locale, item.href)} className="link-underline text-charcoal hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <h2 className="label text-stone">{t.footer.connect}</h2>
          <ul className="mt-5 space-y-2.5">
            {contact.email.publish && (
              <li>
                <a href={`mailto:${contact.email.value}`} dir="ltr" className="link-underline text-charcoal hover:text-ink">
                  {contact.email.value}
                </a>
              </li>
            )}
            {publishedInstagram.map((ig) => (
              <li key={ig.handle}>
                <a href={ig.url} rel="noopener noreferrer" target="_blank" dir="ltr" className="link-underline text-charcoal hover:text-ink">
                  @{ig.handle}
                </a>
              </li>
            ))}
            <li>
              <Link href={localePath(locale, '/contact')} className="link-underline text-burgundy">
                {t.nav.contact}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="page-gutter mx-auto flex max-w-page flex-col gap-3 border-t border-line py-6 text-sm text-stone sm:flex-row sm:items-center sm:justify-between">
        <p>{t.footer.rights}</p>
        <a href="#top" className="link-underline">
          {t.footer.backToTop}
        </a>
      </div>
    </footer>
  )
}

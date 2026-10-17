import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { fontVariables } from '@/lib/fonts'
import { isLocale, localeMeta, localePath, locales } from '@/lib/i18n'
import { getMessages } from '@/lib/messages'
import { pageMetadata } from '@/lib/metadata'
import { siteUrl } from '@/lib/site'
import '../globals.css'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getMessages(locale)
  return {
    metadataBase: new URL(siteUrl),
    ...pageMetadata(locale, '/', t.meta.defaultTitle, t.meta.description),
    title: { default: t.meta.defaultTitle, template: t.meta.titleTemplate },
    applicationName: 'R7',
    authors: [{ name: 'Muhammed Rifad TV' }],
    formatDetection: { telephone: false, email: false, address: false },
  }
}

export const viewport: Viewport = {
  themeColor: '#f6f1e8',
  colorScheme: 'light',
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getMessages(locale)

  const nav = [
    { href: '/work/automotive', label: t.nav.automotive },
    { href: '/work/films', label: t.nav.films },
    { href: '/work/weddings', label: t.nav.weddings },
    { href: '/work/portraits', label: t.nav.portraits },
    { href: '/work', label: t.nav.work },
    { href: '/about', label: t.nav.about },
    { href: '/contact', label: t.nav.contact },
  ].map((item) => ({ ...item, href: localePath(locale, item.href) }))

  return (
    <html
      lang={locale}
      dir={localeMeta[locale].dir}
      className={fontVariables}
      suppressHydrationWarning
    >
      <head>
        {/* Marks that JS is available so scroll reveals may start hidden (see globals.css). */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body id="top" className="min-h-dvh antialiased">
        <a
          href="#main"
          className="label sr-only z-50 bg-ink px-4 py-3 text-paper focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
        >
          {t.nav.skip}
        </a>
        <SiteHeader
          locale={locale}
          items={nav}
          labels={{
            primary: t.nav.primary,
            home: t.nav.home,
            menu: t.nav.menu,
            closeMenu: t.nav.closeMenu,
            switchLanguage: t.language.switchLabel,
          }}
        />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SiteFooter locale={locale} t={t} />
      </body>
    </html>
  )
}

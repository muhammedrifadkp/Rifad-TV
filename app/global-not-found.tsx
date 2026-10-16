import type { Metadata } from 'next'
import Link from 'next/link'
import { BrandMark } from '@/components/brand/BrandMark'
import { Rich } from '@/components/ui/Rich'
import { fontVariables } from '@/lib/fonts'
import { en } from '@/messages/en'
import { ar } from '@/messages/ar'
import './globals.css'

// Shown for URLs that match no route. The language is unknown here, so it speaks both.
export const metadata: Metadata = {
  title: '404 — R7',
  robots: { index: false },
}

export default function GlobalNotFound() {
  const blocks = [
    { lang: 'en', dir: 'ltr', t: en.notFound, href: '/en' },
    { lang: 'ar', dir: 'rtl', t: ar.notFound, href: '/ar' },
  ] as const

  return (
    <html lang="en" className={fontVariables}>
      <body className="min-h-dvh antialiased">
        <main className="page-gutter mx-auto flex min-h-dvh max-w-page flex-col justify-center gap-16 py-16">
          <Link href="/en" aria-label={en.nav.home} className="self-start">
            <BrandMark className="h-12" />
          </Link>
          <div className="grid gap-16 md:grid-cols-2">
            {blocks.map(({ lang, dir, t, href }, i) => {
              // One h1 per document; the Arabic block mirrors it as an h2.
              const Heading = i === 0 ? 'h1' : 'h2'
              return (
                <section key={lang} lang={lang} dir={dir} className={`border-t border-line pt-8 ${lang === 'ar' ? 'type-arabic' : ''}`}>
                  <p className="label text-burgundy">{t.eyebrow}</p>
                  <Heading className="display mt-6 text-5xl text-ink sm:text-6xl">
                    <Rich text={t.title} />
                  </Heading>
                  <p className="mt-6 max-w-md text-lg text-charcoal">{t.body}</p>
                  <Link href={href} hrefLang={lang} className="label link-underline mt-8 inline-block py-2 text-ink">
                    {t.home}
                  </Link>
                </section>
              )
            })}
          </div>
        </main>
      </body>
    </html>
  )
}

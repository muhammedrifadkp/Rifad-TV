import type { Metadata } from 'next'
import Link from 'next/link'
import { PhotoImage } from '@/components/media/PhotoImage'
import { ServicesList } from '@/components/sections/HomeSections'
import { Arrow } from '@/components/ui/Arrow'
import { Reveal } from '@/components/ui/Reveal'
import { Rich } from '@/components/ui/Rich'
import { aboutPortrait } from '@/lib/content'
import { localePath } from '@/lib/i18n'
import { toPhoto } from '@/lib/media'
import { resolveLocale } from '@/lib/messages'
import { pageMetadata } from '@/lib/metadata'
import { brand, contact, publishedInstagram, siteUrl } from '@/lib/site'

export async function generateMetadata({ params }: PageProps<'/[locale]/about'>): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params)
  return pageMetadata(locale, '/about', t.meta.pages.about.title, t.meta.pages.about.description)
}

export default async function AboutPage({ params }: PageProps<'/[locale]/about'>) {
  const { locale, t } = await resolveLocale(params)
  const portrait = { ...toPhoto(aboutPortrait, locale), alt: t.about.portraitAlt }

  // Only details stated in the CV, plus contact links that are switched on.
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: brand.person,
    jobTitle: 'Photographer & Videographer',
    url: `${siteUrl}${localePath(locale, '/about')}`,
    address: { '@type': 'PostalAddress', addressLocality: 'Dubai', addressCountry: 'AE' },
    ...(contact.email.publish ? { email: `mailto:${contact.email.value}` } : {}),
    ...(publishedInstagram.length ? { sameAs: publishedInstagram.map((i) => i.url) } : {}),
    brand: { '@type': 'Brand', name: brand.name },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, '\\u003c') }} />

      <section className="page-gutter mx-auto grid max-w-page gap-12 pt-10 pb-24 md:grid-cols-12 md:gap-10 md:pt-20">
        <div className="md:col-span-5">
          <figure className="hero-rise relative aspect-[3/4] overflow-hidden bg-bone md:sticky md:top-28">
            <PhotoImage photo={portrait} cover preload sizes="(min-width: 768px) 38vw, 100vw" />
          </figure>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <p className="label hero-rise text-stone">{t.about.eyebrow}</p>
          <h1 className="display hero-rise mt-6 text-[clamp(3rem,6.5vw,6rem)] text-ink" style={{ ['--rise-delay' as string]: '120ms' }}>
            <Rich text={t.about.title} />
          </h1>
          <p className="hero-rise mt-10 text-2xl leading-snug text-ink" style={{ ['--rise-delay' as string]: '220ms' }}>
            {t.about.lead}
          </p>
          {t.about.paragraphs.map((p) => (
            <Reveal key={p}>
              <p className="mt-6 text-lg text-charcoal">{p}</p>
            </Reveal>
          ))}

          <Reveal className="mt-16">
            <h2 className="label text-stone">{t.about.experienceTitle}</h2>
            <ol className="mt-5 divide-y divide-line border-y border-line">
              {t.about.experience.map((item) => (
                <li key={item.role} className="grid gap-1 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
                  <span className="label pt-1 text-burgundy">{item.period}</span>
                  <span>
                    <span className="block text-lg text-ink">{item.role}</span>
                    <span className="block text-stone">{item.place}</span>
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal className="mt-14">
            <h2 className="label text-stone">{t.about.disciplinesTitle}</h2>
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
              {t.about.disciplines.map((d) => (
                <li key={d} className="display text-2xl text-ink">
                  {d}
                </li>
              ))}
            </ul>
          </Reveal>

          <Link
            href={localePath(locale, '/contact')}
            className="label mt-14 inline-flex min-h-12 items-center gap-4 bg-ink px-7 text-paper transition-colors duration-300 hover:bg-burgundy"
          >
            {t.about.cta}
            <Arrow direction="forward" className="w-7 rtl:-scale-x-100" />
          </Link>
        </div>
      </section>

      <div className="border-t border-line" />
      <ServicesList locale={locale} t={t} index="" />
    </>
  )
}

import type { Metadata } from 'next'
import { ContactLinks } from '@/components/sections/HomeSections'
import { PageIntro } from '@/components/sections/PageIntro'
import { PhotoImage } from '@/components/media/PhotoImage'
import { toPhoto } from '@/lib/media'
import { resolveLocale } from '@/lib/messages'
import { pageMetadata } from '@/lib/metadata'
import { publishedPhones, whatsappNumber, whatsappUrl } from '@/lib/site'

export async function generateMetadata({ params }: PageProps<'/[locale]/contact'>): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params)
  return pageMetadata(locale, '/contact', t.meta.pages.contact.title, t.meta.pages.contact.description)
}

export default async function ContactPage({ params }: PageProps<'/[locale]/contact'>) {
  const { locale, t } = await resolveLocale(params)
  const image = { ...toPhoto('automotive-camaro-sunset-front', locale), alt: '' }

  return (
    <>
      <PageIntro eyebrow={t.contact.eyebrow} title={t.contact.title} intro={t.contact.intro} />
      <section className="page-gutter mx-auto grid max-w-page gap-16 pb-24 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-7">
          <ContactLinks t={t} large />

          {(publishedPhones.length > 0 || whatsappNumber) && (
            <dl className="mt-12 grid gap-8 sm:grid-cols-2">
              {whatsappNumber && (
                <div>
                  <dt className="label text-stone">{t.contact.whatsapp}</dt>
                  <dd className="mt-3">
                    <a href={whatsappUrl(whatsappNumber.e164)} dir="ltr" className="link-underline text-xl text-ink">
                      {whatsappNumber.display}
                    </a>
                  </dd>
                </div>
              )}
              {publishedPhones.map((p) => (
                <div key={p.e164}>
                  <dt className="label text-stone">
                    {t.contact.phone} · {p.label}
                  </dt>
                  <dd className="mt-3">
                    <a href={`tel:${p.e164}`} dir="ltr" className="link-underline text-xl text-ink">
                      {p.display}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <dl className="mt-12 border-t border-line pt-8">
            <dt className="label text-stone">{t.contact.location}</dt>
            <dd className="display mt-3 text-3xl text-ink">{t.contact.locationValue}</dd>
          </dl>
          <p className="mt-10 max-w-md text-stone">{t.contact.responseNote}</p>
        </div>
        <figure className="relative hidden aspect-[3/4] overflow-hidden bg-bone md:col-span-4 md:col-start-9 md:block">
          <PhotoImage photo={image} cover sizes="30vw" />
        </figure>
      </section>
    </>
  )
}

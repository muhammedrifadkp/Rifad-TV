import type { Metadata } from 'next'
import { WhatsAppForm } from '@/components/contact/WhatsAppForm'
import { ContactLinks } from '@/components/sections/HomeSections'
import { PageIntro } from '@/components/sections/PageIntro'
import { PhotoImage } from '@/components/media/PhotoImage'
import { Rich } from '@/components/ui/Rich'
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
          {whatsappNumber ? (
            <>
              <h2 className="display text-4xl text-ink sm:text-5xl">
                <Rich text={t.contact.form.title} />
              </h2>
              <p className="mt-4 mb-10 max-w-lg text-lg text-charcoal">{t.contact.form.intro}</p>
              <WhatsAppForm number={whatsappNumber.e164} labels={t.contact.form} />
            </>
          ) : (
            <ContactLinks t={t} large />
          )}
        </div>

        <aside className="md:col-span-4 md:col-start-9">
          {whatsappNumber && <ContactLinks t={t} stacked />}

          {publishedPhones.length > 0 && (
            <dl className="mt-8 grid gap-8">
              {publishedPhones.map((p) => (
                <div key={p.e164}>
                  <dt className="label text-stone">{p.whatsapp ? t.contact.whatsapp : `${t.contact.phone} · ${p.label}`}</dt>
                  <dd className="mt-3">
                    <a href={p.whatsapp ? whatsappUrl(p.e164) : `tel:${p.e164}`} dir="ltr" className="link-underline text-xl text-ink hover:text-burgundy">
                      {p.display}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <dl className="mt-10 border-t border-line pt-8">
            <dt className="label text-stone">{t.contact.location}</dt>
            <dd className="display mt-3 text-3xl text-ink">{t.contact.locationValue}</dd>
          </dl>
          <p className="mt-8 text-stone">{t.contact.responseNote}</p>
          <figure className="relative mt-10 hidden aspect-[4/5] overflow-hidden bg-bone md:block">
            <PhotoImage photo={image} cover sizes="28vw" />
          </figure>
        </aside>
      </section>
    </>
  )
}

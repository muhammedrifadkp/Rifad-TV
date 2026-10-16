import Link from 'next/link'
import { Arrow } from '@/components/ui/Arrow'
import { PhotoImage } from '@/components/media/PhotoImage'
import { Reveal } from '@/components/ui/Reveal'
import { Rich } from '@/components/ui/Rich'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { aboutPortrait } from '@/lib/content'
import { localePath, type Locale } from '@/lib/i18n'
import { toPhoto } from '@/lib/media'
import type { Messages } from '@/lib/messages'
import { contact, publishedInstagram, services } from '@/lib/site'

type SectionProps = { locale: Locale; t: Messages }

export function AboutPreview({ locale, t }: SectionProps) {
  const portrait = { ...toPhoto(aboutPortrait, locale), alt: t.about.portraitAlt }
  return (
    <section className="page-gutter mx-auto grid max-w-page items-center gap-12 pt-12 pb-24 md:grid-cols-12 md:gap-10 md:pt-16 md:pb-36">
      <Reveal className="relative aspect-[4/5] overflow-hidden bg-bone md:col-span-5">
        <PhotoImage photo={portrait} cover sizes="(min-width: 768px) 38vw, 100vw" />
      </Reveal>
      <Reveal className="md:col-span-6 md:col-start-7" delay={120}>
        <SectionHeading index="03" eyebrow={t.home.about.eyebrow} title={t.home.about.title} />
        <p className="mt-8 max-w-xl text-xl leading-relaxed text-charcoal">{t.home.about.body}</p>
        <Link href={localePath(locale, '/about')} className="label mt-10 inline-flex items-center gap-3 text-ink">
          <span className="link-underline">{t.home.about.link}</span>
          <Arrow direction="forward" className="w-8 rtl:-scale-x-100" />
        </Link>
      </Reveal>
    </section>
  )
}

export function ServicesList({ locale, t, index = '04' }: SectionProps & { index?: string }) {
  const shown = services.filter((s) => s.publish)
  return (
    <section className="page-gutter mx-auto max-w-page py-24 md:py-36">
      <div className="grid gap-12 md:grid-cols-12 md:gap-10">
        <SectionHeading index={index} eyebrow={t.home.services.eyebrow} title={t.home.services.title} className="md:col-span-4" />
        <ol className="divide-y divide-line border-y border-line md:col-span-8">
          {shown.map((s, i) => (
            <Reveal as="li" key={s.key} delay={i * 80} className="grid gap-3 py-8 sm:grid-cols-[4rem_1fr] md:py-10">
              <span className="label pt-2 text-burgundy">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="display text-3xl text-ink md:text-4xl">{t.services[s.key].title}</h3>
                <p className="mt-3 max-w-xl text-charcoal">{t.services[s.key].description}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
      <div className="mt-12 md:ms-[calc(33.333%+1rem)]">
        <Link
          href={localePath(locale, '/contact')}
          className="label inline-flex min-h-12 items-center gap-4 border border-ink px-7 text-ink transition-colors duration-300 hover:bg-ink hover:text-paper"
        >
          {t.home.services.cta}
          <Arrow direction="forward" className="w-7 rtl:-scale-x-100" />
        </Link>
      </div>
    </section>
  )
}

/** Email and Instagram links, rendered only when switched on in lib/site.ts. */
export function ContactLinks({ t, large = false }: { t: Messages; large?: boolean }) {
  const linkClass = `link-underline ${large ? 'display text-3xl sm:text-4xl lg:text-5xl' : 'text-xl'} text-ink hover:text-burgundy`
  // Large links stack so a long email address never breaks mid-word.
  return (
    <dl className={`grid gap-8 ${large ? '' : 'sm:grid-cols-2'}`}>
      {contact.email.publish && (
        <div>
          <dt className="label text-stone">{t.contact.email}</dt>
          <dd className="mt-3 break-words">
            <a href={`mailto:${contact.email.value}`} dir="ltr" className={linkClass}>
              {contact.email.value}
            </a>
          </dd>
        </div>
      )}
      {publishedInstagram.map((ig) => (
        <div key={ig.handle}>
          <dt className="label text-stone">{t.contact.instagram}</dt>
          <dd className="mt-3">
            <a href={ig.url} target="_blank" rel="noopener noreferrer" dir="ltr" className={linkClass}>
              @{ig.handle}
            </a>
          </dd>
        </div>
      ))}
    </dl>
  )
}

export function ContactPreview({ locale, t }: SectionProps) {
  return (
    <section className="bg-ink text-paper">
      <div className="page-gutter mx-auto max-w-page py-24 md:py-36">
        <Reveal>
          <p className="label flex items-center gap-3 text-paper/60">
            <span className="text-[#e56b78]">05</span>
            {t.home.contact.eyebrow}
          </p>
          <h2 className="display mt-6 max-w-4xl text-5xl sm:text-6xl lg:text-8xl">
            <Rich text={t.home.contact.title} />
          </h2>
          <p className="mt-8 max-w-xl text-lg text-paper/75">{t.home.contact.body}</p>
          <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-6">
            <Link
              href={localePath(locale, '/contact')}
              className="label inline-flex min-h-12 items-center gap-4 bg-paper px-7 text-ink transition-colors duration-300 hover:bg-bone"
            >
              {t.home.contact.cta}
              <Arrow direction="forward" className="w-7 rtl:-scale-x-100" />
            </Link>
            {contact.email.publish && (
              <a href={`mailto:${contact.email.value}`} dir="ltr" className="link-underline text-lg text-paper/85 hover:text-paper">
                {contact.email.value}
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

import Link from 'next/link'
import type { CSSProperties } from 'react'
import { Arrow } from '@/components/ui/Arrow'
import { PhotoImage } from '@/components/media/PhotoImage'
import { Rich } from '@/components/ui/Rich'
import { heroImages } from '@/lib/content'
import { localePath, type Locale } from '@/lib/i18n'
import { toPhoto } from '@/lib/media'
import type { Messages } from '@/lib/messages'

const rise = (ms: number) => ({ '--rise-delay': `${ms}ms` }) as CSSProperties

export function Hero({ locale, t }: { locale: Locale; t: Messages }) {
  const main = toPhoto(heroImages.main, locale)
  const inset = toPhoto(heroImages.inset, locale)

  return (
    <section className="page-gutter mx-auto max-w-page pt-4 pb-28 md:pt-8 lg:pb-36">
      <div className="grid gap-14 lg:grid-cols-12 lg:items-end lg:gap-8">
        <div className="lg:col-span-5 lg:pb-20">
          <p className="label hero-rise text-stone">{t.hero.eyebrow}</p>
          <h1 className="display hero-rise mt-6 text-[clamp(3.25rem,7.4vw,7rem)] text-ink" style={rise(120)}>
            <Rich text={t.hero.title} />
          </h1>
          <p className="hero-rise mt-8 max-w-md text-lg text-charcoal" style={rise(240)}>
            {t.hero.lead}
          </p>
          <div className="hero-rise mt-10 flex flex-wrap items-center gap-x-8 gap-y-5" style={rise(360)}>
            <Link
              href={localePath(locale, '/work')}
              className="label inline-flex min-h-12 items-center gap-4 bg-ink px-7 text-paper transition-colors duration-300 hover:bg-burgundy"
            >
              {t.hero.primary}
              <Arrow direction="forward" className="w-7 rtl:-scale-x-100" />
            </Link>
            <Link href={localePath(locale, '/contact')} className="label link-underline py-2 text-ink">
              {t.hero.secondary}
            </Link>
          </div>
        </div>

        <div className="relative pb-16 lg:col-span-7 lg:pb-0">
          <figure className="hero-rise relative ms-auto aspect-[4/5] w-full sm:w-[88%] lg:aspect-auto lg:h-[min(calc(100svh-8rem),56rem)] lg:min-h-[36rem]" style={rise(80)}>
            <PhotoImage photo={main} cover preload sizes="(min-width: 1024px) 52vw, (min-width: 640px) 88vw, 100vw" />
            <figcaption className="label absolute -bottom-7 end-0 text-stone">{t.hero.captionMain}</figcaption>
          </figure>
          <figure
            className="hero-rise absolute bottom-0 start-0 aspect-[3/4] w-[42%] border-[6px] border-ivory sm:w-[34%] lg:-bottom-14 lg:w-[30%] lg:border-[10px]"
            style={rise(420)}
          >
            <PhotoImage photo={inset} cover sizes="(min-width: 1024px) 18vw, 40vw" />
            <figcaption className="label absolute -bottom-7 start-0 text-stone">{t.hero.captionInset}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}

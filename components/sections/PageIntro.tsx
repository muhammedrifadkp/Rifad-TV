import Link from 'next/link'
import type { ReactNode } from 'react'
import { Arrow } from '@/components/ui/Arrow'
import { Rich } from '@/components/ui/Rich'

type Props = {
  eyebrow: string
  title: string
  intro?: string
  back?: { href: string; label: string }
  aside?: ReactNode
}

/** Opening block for inner pages: label, large serif title, short intro. */
export function PageIntro({ eyebrow, title, intro, back, aside }: Props) {
  return (
    <header className="page-gutter mx-auto max-w-page pt-10 pb-16 md:pt-20 md:pb-24">
      {back && (
        <Link href={back.href} className="label mb-10 inline-flex items-center gap-3 text-stone hover:text-ink">
          <Arrow direction="back" className="w-7 rtl:-scale-x-100" />
          {back.label}
        </Link>
      )}
      <div className="grid gap-10 md:grid-cols-12 md:items-end">
        <div className="hero-rise md:col-span-8">
          <p className="label text-stone">{eyebrow}</p>
          <h1 className="display mt-6 text-[clamp(3rem,7vw,6.5rem)] text-ink">
            <Rich text={title} />
          </h1>
        </div>
        {(intro || aside) && (
          <div className="hero-rise md:col-span-4" style={{ ['--rise-delay' as string]: '150ms' }}>
            {intro && <p className="text-lg text-charcoal">{intro}</p>}
            {aside}
          </div>
        )}
      </div>
    </header>
  )
}

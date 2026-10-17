'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { Photo } from '@/lib/media'
import { format } from '@/lib/i18n'
import { Lightbox, type LightboxLabels } from './Lightbox'

export type GalleryGroup = { id: string; title?: string; photos: Photo[] }

type Props = {
  groups: GalleryGroup[]
  labels: LightboxLabels & { open: string }
  /** Shown in the viewer header. */
  title?: string
}

// Editorial rhythm for portrait-heavy sets: a wide frame beside a narrower, bottom-aligned
// one, then a row of three with a gentle stagger. Photos keep their natural aspect ratio.
const desktopPattern = [
  { span: 'md:col-span-7', sizes: '(min-width: 768px) 56vw' },
  { span: 'md:col-span-5 md:self-end', sizes: '(min-width: 768px) 40vw' },
  { span: 'md:col-span-4', sizes: '(min-width: 768px) 32vw' },
  { span: 'md:col-span-4 md:mt-16', sizes: '(min-width: 768px) 32vw' },
  { span: 'md:col-span-4', sizes: '(min-width: 768px) 32vw' },
]

// On phones: one full-width frame, then a pair. A frame left without a partner goes full width.
function cell(i: number, count: number) {
  const desktop = desktopPattern[i % desktopPattern.length]
  const fullOnMobile = i % 3 === 0 || (i % 3 === 1 && i === count - 1)
  return {
    className: `${fullOnMobile ? 'col-span-6' : 'col-span-3'} ${desktop.span}`,
    sizes: `${desktop.sizes}, ${fullOnMobile ? '67vw' : '34vw'}`,
  }
}

export function Gallery({ groups, labels, title }: Props) {
  const [index, setIndex] = useState<number | null>(null)
  const all = groups.flatMap((g) => g.photos)
  // Index of each group's first photo within the shared viewer sequence.
  const starts = groups.map((_, gi) => groups.slice(0, gi).reduce((n, g) => n + g.photos.length, 0))

  return (
    <>
      {groups.map((group, gi) => {
        const start = starts[gi]
        return (
          <section key={group.id} aria-labelledby={group.title ? `chapter-${group.id}` : undefined} className="mt-20 first:mt-0 md:mt-32">
            {group.title && (
              <h2 id={`chapter-${group.id}`} className="mb-8 flex items-baseline gap-4 border-t border-line pt-6 md:mb-12">
                <span className="label text-burgundy">{String(gi + 1).padStart(2, '0')}</span>
                <span className="display text-3xl text-ink md:text-4xl">{group.title}</span>
              </h2>
            )}
            <ul className="grid grid-cols-6 gap-3 sm:gap-4 md:grid-cols-12 md:gap-x-8 md:gap-y-12">
              {group.photos.map((photo, i) => {
                const { className, sizes } = cell(i, group.photos.length)
                const n = start + i
                return (
                  <li key={photo.slug} className={className}>
                    <button
                      type="button"
                      onClick={() => setIndex(n)}
                      aria-label={`${photo.alt} — ${format(labels.open, { n: n + 1, total: all.length })}`}
                      className="group block w-full cursor-zoom-in overflow-hidden bg-bone"
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        width={photo.width}
                        height={photo.height}
                        sizes={sizes}
                        placeholder="blur"
                        blurDataURL={photo.blurDataURL}
                        className="h-auto w-full transition-transform duration-[1200ms] ease-editorial group-hover:scale-[1.025] motion-reduce:transition-none"
                      />
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
      <Lightbox photos={all} index={index} onIndexChange={setIndex} labels={labels} title={title} />
    </>
  )
}

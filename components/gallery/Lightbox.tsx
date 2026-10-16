'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, type KeyboardEvent, type PointerEvent } from 'react'
import type { Photo } from '@/lib/media'
import { format } from '@/lib/i18n'
import { Arrow } from '@/components/ui/Arrow'

export type LightboxLabels = {
  viewer: string
  close: string
  next: string
  previous: string
  counter: string
}

type Props = {
  photos: Photo[]
  index: number | null
  onIndexChange: (index: number | null) => void
  labels: LightboxLabels
  title?: string
}

const SWIPE_THRESHOLD = 48

/** Full-screen viewer built on the native modal <dialog> (focus trap, Escape and inert page for free). */
export function Lightbox({ photos, index, onIndexChange, labels, title }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const pointerStart = useRef<number | null>(null)
  const total = photos.length
  const open = index !== null

  const go = useCallback(
    (step: 1 | -1) => {
      if (index === null) return
      onIndexChange((index + step + total) % total)
    },
    [index, onIndexChange, total],
  )

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !open) return
    if (!dialog.open) dialog.showModal()
    const root = document.documentElement
    const previousOverflow = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = previousOverflow
      // Also runs when the route is hidden by client navigation.
      if (dialog.open) dialog.close()
    }
  }, [open])

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    event.preventDefault()
    // In right-to-left reading order the "next" image sits to the left.
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl'
    const forward = event.key === (rtl ? 'ArrowLeft' : 'ArrowRight')
    go(forward ? 1 : -1)
  }

  const onPointerDown = (event: PointerEvent) => {
    pointerStart.current = event.clientX
  }
  const onPointerUp = (event: PointerEvent) => {
    if (pointerStart.current === null) return
    const dx = event.clientX - pointerStart.current
    pointerStart.current = null
    if (Math.abs(dx) < SWIPE_THRESHOLD) return
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl'
    // Swiping toward the reading direction's start reveals the next image.
    go((dx < 0) !== rtl ? 1 : -1)
  }

  const photo = index !== null ? photos[index] : null
  const neighbours = index !== null ? [photos[(index + 1) % total], photos[(index - 1 + total) % total]] : []

  return (
    <dialog
      ref={dialogRef}
      className="viewer"
      aria-label={title ? `${labels.viewer} — ${title}` : labels.viewer}
      onClose={() => onIndexChange(null)}
      onKeyDown={onKeyDown}
    >
      {photo && index !== null && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <p className="label text-paper/70" aria-live="polite">
              {format(labels.counter, { n: index + 1, total })}
              {title && <span className="hidden sm:inline"> · {title}</span>}
            </p>
            <button
              type="button"
              autoFocus
              onClick={() => dialogRef.current?.close()}
              className="label min-h-11 min-w-11 text-paper hover:text-white"
            >
              {labels.close}
            </button>
          </div>

          <div
            className="relative min-h-0 flex-1 touch-pan-y select-none"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => (pointerStart.current = null)}
          >
            <figure className="absolute inset-0 mx-4 mb-4 sm:mx-20 sm:mb-6">
              <Image
                key={photo.slug}
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="100vw"
                placeholder="blur"
                blurDataURL={photo.blurDataURL}
                className="object-contain"
                draggable={false}
              />
            </figure>
            {/* Warm the cache for the neighbouring images. */}
            <div aria-hidden="true" className="pointer-events-none absolute size-px overflow-hidden opacity-0">
              {neighbours.map((n) => (
                <Image key={n.slug} src={n.src} alt="" width={n.width} height={n.height} sizes="100vw" loading="eager" />
              ))}
            </div>

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label={labels.previous}
                  className="absolute inset-y-0 start-0 hidden w-16 items-center justify-center text-paper/60 hover:text-white sm:flex"
                >
                  <Arrow className="rtl:-scale-x-100" direction="back" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label={labels.next}
                  className="absolute inset-y-0 end-0 hidden w-16 items-center justify-center text-paper/60 hover:text-white sm:flex"
                >
                  <Arrow className="rtl:-scale-x-100" direction="forward" />
                </button>
              </>
            )}
          </div>

          {total > 1 && (
            <div className="flex justify-between border-t border-white/10 sm:hidden">
              <button type="button" onClick={() => go(-1)} className="label min-h-12 flex-1 text-paper/80">
                {labels.previous}
              </button>
              <button type="button" onClick={() => go(1)} className="label min-h-12 flex-1 border-s border-white/10 text-paper/80">
                {labels.next}
              </button>
            </div>
          )}
        </div>
      )}
    </dialog>
  )
}

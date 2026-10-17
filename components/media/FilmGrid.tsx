'use client'

import Image from 'next/image'
import { useLayoutEffect, useRef, useState } from 'react'
import { format } from '@/lib/i18n'
import type { FilmCard } from '@/lib/media'

export type FilmCardData = FilmCard

export type FilmLabels = {
  play: string
  close: string
  excerpt: string
  flashing: string
  seconds: string
}

/**
 * Poster-first film cards. Nothing is downloaded until a film is opened. Playback starts
 * inside the tap itself so browsers (including iOS Safari) allow it with sound; if sound
 * is still refused, it falls back to muted playback and the controls can unmute it.
 */
export function FilmGrid({ films, labels }: { films: FilmCardData[]; labels: FilmLabels }) {
  const [active, setActive] = useState<FilmCardData | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const landscape = films.filter((f) => f.orientation === 'landscape')
  const portrait = films.filter((f) => f.orientation === 'portrait')

  const open = (film: FilmCardData) => {
    const video = videoRef.current
    const dialog = dialogRef.current
    if (!video || !dialog) return
    video.src = film.src
    video.poster = film.posterUrl
    video.muted = false
    dialog.showModal()
    video.play().catch(() => {
      video.muted = true
      video.play().catch(() => {})
    })
    setActive(film)
  }

  const stop = () => {
    const video = videoRef.current
    if (!video) return
    video.pause()
    video.removeAttribute('src')
    video.load() // cancels any download still in progress
    setActive(null)
  }

  // A hidden route keeps its DOM; <video> would keep playing, so pause and close explicitly.
  useLayoutEffect(() => {
    const video = videoRef.current
    const dialog = dialogRef.current
    return () => {
      video?.pause()
      if (dialog?.open) dialog.close()
    }
  }, [])

  const card = (film: FilmCardData, sizes: string) => (
    <li key={film.slug}>
      <button
        type="button"
        onClick={() => open(film)}
        aria-label={format(labels.play, { title: film.title })}
        className="group block w-full text-start"
      >
        <span
          className="relative block overflow-hidden bg-bone"
          style={{ aspectRatio: `${film.width} / ${film.height}` }}
        >
          <Image
            src={film.poster.src}
            alt=""
            fill
            sizes={sizes}
            placeholder="blur"
            blurDataURL={film.poster.blurDataURL}
            className="object-cover transition-transform duration-[1200ms] ease-editorial group-hover:scale-[1.03] motion-reduce:transition-none"
          />
          <span className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/15" />
          <span className="absolute bottom-4 start-4 flex size-14 items-center justify-center rounded-full border border-paper/80 text-paper backdrop-brightness-90">
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" className="ms-0.5">
              <path d="M3 1.5v13L14 8z" fill="currentColor" />
            </svg>
          </span>
        </span>
        <span className="mt-4 flex items-baseline justify-between gap-4">
          <span className="display text-2xl text-ink" dir="auto">
            {film.title}
          </span>
          <span className="label shrink-0 text-stone">{format(labels.seconds, { s: Math.round(film.duration) })}</span>
        </span>
        {(film.excerpt || film.flashing) && (
          <span className="label mt-2 flex flex-wrap gap-x-3 gap-y-1 text-stone">
            {film.excerpt && <span className="text-burgundy">{labels.excerpt}</span>}
            {film.flashing && <span>{labels.flashing}</span>}
          </span>
        )}
      </button>
    </li>
  )

  return (
    <>
      {landscape.length > 0 && (
        <ul className="grid gap-x-8 gap-y-14 md:grid-cols-2">{landscape.map((f) => card(f, '(min-width: 768px) 46vw, 67vw'))}</ul>
      )}
      {portrait.length > 0 && (
        <ul className={`grid grid-cols-2 gap-x-4 gap-y-14 sm:gap-x-8 lg:grid-cols-3 ${landscape.length ? 'mt-16' : ''}`}>
          {portrait.map((f) => card(f, '(min-width: 1024px) 30vw, 34vw'))}
        </ul>
      )}

      <dialog ref={dialogRef} className="viewer" aria-label={active?.title} onClose={stop}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <p className="label text-paper/70" dir="auto">
              {active?.title}
            </p>
            <button type="button" autoFocus onClick={() => dialogRef.current?.close()} className="label min-h-11 min-w-11 text-paper hover:text-white">
              {labels.close}
            </button>
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center px-4 pb-6">
            {/* Kept mounted so playback can start inside the tap. 720p sources are never
                stretched beyond their own resolution. */}
            <video
              ref={videoRef}
              width={active?.width}
              height={active?.height}
              controls
              playsInline
              preload="none"
              className="max-h-full w-auto bg-black object-contain"
              style={active ? { maxWidth: `min(100%, ${active.width}px)`, aspectRatio: `${active.width} / ${active.height}` } : undefined}
            />
          </div>
        </div>
      </dialog>
    </>
  )
}

import type { FilmLabels } from '@/components/media/FilmGrid'
import type { Messages } from '@/lib/messages'

// Label bundles handed to client components, so dictionaries never reach the browser whole.

export function galleryLabels(t: Messages) {
  return {
    viewer: t.gallery.viewer,
    open: t.gallery.open,
    close: t.gallery.close,
    next: t.gallery.next,
    previous: t.gallery.previous,
    counter: t.gallery.counter,
  }
}

export function filmLabels(t: Messages): FilmLabels {
  return {
    play: t.films.play,
    close: t.films.close,
    silent: t.films.silent,
    excerpt: t.films.excerpt,
    flashing: t.films.flashing,
    seconds: t.films.seconds,
  }
}

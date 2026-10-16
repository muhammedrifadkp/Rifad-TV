'use client'

// next/image loader for the pre-generated derivatives in public/media/images.
// Picks the smallest generated width that covers the requested one.
import widths from './widths.generated.json'

const available = widths as Record<string, number[]>

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  const sizes = available[src]
  if (!sizes) return src
  const chosen = sizes.find((w) => w >= width) ?? sizes[sizes.length - 1]
  return `${src}-${chosen}.webp`
}

import Image from 'next/image'
import type { Photo } from '@/lib/media'

type Props = {
  photo: Photo
  sizes: string
  className?: string
  /** Crop to the parent box (cover). Otherwise the photo keeps its natural aspect ratio. */
  cover?: boolean
  /** Only for the single above-the-fold LCP image. */
  preload?: boolean
}

export function PhotoImage({ photo, sizes, className = '', cover = false, preload = false }: Props) {
  const common = {
    src: photo.src,
    sizes,
    placeholder: 'blur' as const,
    blurDataURL: photo.blurDataURL,
    preload,
  }

  if (cover) {
    return <Image {...common} alt={photo.alt} fill className={`object-cover ${className}`} style={{ objectPosition: photo.focal }} />
  }
  return <Image {...common} alt={photo.alt} width={photo.width} height={photo.height} className={`h-auto w-full ${className}`} />
}

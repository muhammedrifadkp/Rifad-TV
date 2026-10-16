'use client'

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  as?: ElementType
  className?: string
  /** Stagger delay in ms. */
  delay?: number
}

/**
 * Fades content in once it scrolls into view. The hidden state only applies when
 * JavaScript has run and the visitor has not asked for reduced motion (see globals.css).
 */
export function Reveal({ children, as: Tag = 'div', className, delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute('data-revealed', '')
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag ref={ref} data-reveal="" className={className} style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  )
}

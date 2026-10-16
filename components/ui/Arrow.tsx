/** Fine-line arrow. Add `rtl:-scale-x-100` where it should follow reading direction. */
export function Arrow({ direction, className = '' }: { direction: 'forward' | 'back'; className?: string }) {
  return (
    <svg viewBox="0 0 40 16" width="40" height="16" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true" className={className}>
      {direction === 'forward' ? <path d="M0 8h38M31 1l7 7-7 7" /> : <path d="M40 8H2M9 1 2 8l7 7" />}
    </svg>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { localeMeta, otherLocale, switchLocalePath, type Locale } from '@/lib/i18n'

type Props = { locale: Locale; label: string; className?: string; onNavigate?: () => void }

/** Links to the same page in the other language. */
export function LanguageSwitch({ locale, label, className, onNavigate }: Props) {
  const pathname = usePathname()
  const target = otherLocale(locale)

  return (
    <Link
      href={switchLocalePath(pathname, target)}
      hrefLang={target}
      lang={target}
      aria-label={label}
      className={className}
      onClick={onNavigate}
    >
      {localeMeta[target].name}
    </Link>
  )
}

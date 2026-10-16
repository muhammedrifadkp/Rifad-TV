'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { BrandMark } from '@/components/brand/BrandMark'
import { LanguageSwitch } from './LanguageSwitch'
import type { Locale } from '@/lib/i18n'

export type NavItem = { href: string; label: string }

type Props = {
  locale: Locale
  items: NavItem[]
  labels: { primary: string; home: string; menu: string; closeMenu: string; switchLanguage: string }
}

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function SiteHeader({ locale, items, labels }: Props) {
  const pathname = usePathname()
  const menuRef = useRef<HTMLDialogElement>(null)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Hide on scroll down, reveal on scroll up, so the header never sits over photographs for long.
  useEffect(() => {
    let last = window.scrollY
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const y = window.scrollY
        setScrolled(y > 8)
        setHidden(y > 160 && y > last)
        last = y
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  // Close the mobile menu on navigation and whenever this route is hidden.
  useEffect(() => {
    const menu = menuRef.current
    return () => menu?.close()
  }, [pathname])

  const home = `/${locale}`
  const linkClass = (href: string) =>
    `label link-underline pb-1 transition-colors ${isActive(pathname, href) ? 'text-burgundy' : 'text-charcoal hover:text-ink'}`

  return (
    <header
      className={`sticky top-0 z-40 transition-[transform,background-color,border-color] duration-500 ease-editorial motion-reduce:transition-none ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      } ${scrolled ? 'border-b border-line bg-ivory' : 'border-b border-transparent bg-ivory/0'}`}
    >
      <div className="page-gutter mx-auto flex h-16 max-w-page items-center justify-between gap-6 lg:h-20">
        <Link href={home} aria-label={labels.home} className="-my-1 block">
          <BrandMark className="h-10 lg:h-12" />
        </Link>

        <nav aria-label={labels.primary} className="hidden xl:block">
          <ul className="flex items-center gap-7">
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass(item.href)} aria-current={isActive(pathname, item.href) ? 'page' : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-5">
          <LanguageSwitch locale={locale} label={labels.switchLanguage} className="label text-charcoal hover:text-burgundy" />
          <button
            type="button"
            className="label inline-flex min-h-11 items-center gap-2 text-ink xl:hidden"
            aria-haspopup="dialog"
            onClick={() => menuRef.current?.showModal()}
          >
            <span aria-hidden="true" className="flex w-5 flex-col gap-1.5">
              <span className="h-px w-full bg-current" />
              <span className="h-px w-3/4 bg-current" />
            </span>
            {labels.menu}
          </button>
        </div>
      </div>

      <dialog
        ref={menuRef}
        aria-label={labels.primary}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-ivory p-0 text-ink backdrop:bg-ink/40"
      >
        <div className="page-gutter flex h-16 items-center justify-between">
          <Link href={home} aria-label={labels.home} className="block" onClick={() => menuRef.current?.close()}>
            <BrandMark className="h-10 lg:h-12" />
          </Link>
          <button type="button" className="label min-h-11 text-ink" onClick={() => menuRef.current?.close()}>
            {labels.closeMenu}
          </button>
        </div>
        <nav aria-label={labels.primary} className="page-gutter pt-10 pb-12">
          <ul className="divide-y divide-line border-y border-line">
            {items.map((item, i) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => menuRef.current?.close()}
                  aria-current={isActive(pathname, item.href) ? 'page' : undefined}
                  className="display flex items-baseline gap-4 py-4 text-4xl text-ink aria-[current=page]:text-burgundy sm:text-5xl"
                >
                  <span className="label text-stone">{String(i + 1).padStart(2, '0')}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <LanguageSwitch
            locale={locale}
            label={labels.switchLanguage}
            className="label mt-10 inline-block text-burgundy"
            onNavigate={() => menuRef.current?.close()}
          />
        </nav>
      </dialog>
    </header>
  )
}

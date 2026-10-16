import type { MetadataRoute } from 'next'
import { staticRoutes, storyPages } from '@/lib/content'
import { localePath, locales } from '@/lib/i18n'
import { siteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...staticRoutes, ...storyPages.map((s) => s.href)]
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${siteUrl}${localePath(locale, path)}`,
      changeFrequency: 'monthly' as const,
      priority: path === '/' ? 1 : path.startsWith('/stories') ? 0.7 : 0.8,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}${localePath(l, path)}`])),
      },
    })),
  )
}

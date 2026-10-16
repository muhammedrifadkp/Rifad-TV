import type { Category } from '@/lib/media'

// Portfolio structure: which collections exist, how they are covered and linked.
// Titles and descriptions live in messages/*.ts.

export type CategoryKey = Category | 'films'

export const categories: { key: CategoryKey; href: string; cover: string }[] = [
  { key: 'automotive', href: '/work/automotive', cover: 'automotive-underpass-trio' },
  { key: 'weddings', href: '/work/weddings', cover: 'dubai-couple-shoulder' },
  { key: 'portraits', href: '/work/portraits', cover: 'traditional-house' },
  { key: 'films', href: '/work/films', cover: 'film-swift' },
]

export type StoryKey =
  | 'nikah-ceremony'
  | 'automotive'
  | 'bridal-sessions'
  | 'dubai-couple-session'
  | 'traditional-portrait-session'

export type Story = {
  key: StoryKey
  category: Category
  href: string
  cover: string
  /** Story pages exist for every story except automotive, which is its own category page. */
  hasPage: boolean
}

export const stories: Story[] = [
  { key: 'nikah-ceremony', category: 'weddings', href: '/stories/nikah-ceremony', cover: 'nikah-poolside-twirl', hasPage: true },
  { key: 'automotive', category: 'automotive', href: '/work/automotive', cover: 'automotive-mustang-scissor-doors', hasPage: false },
  { key: 'bridal-sessions', category: 'weddings', href: '/stories/bridal-sessions', cover: 'bridal-blush-wall', hasPage: true },
  { key: 'dubai-couple-session', category: 'weddings', href: '/stories/dubai-couple-session', cover: 'dubai-couple-twirl', hasPage: true },
  { key: 'traditional-portrait-session', category: 'portraits', href: '/stories/traditional-portrait-session', cover: 'traditional-radio-steps', hasPage: true },
]

export const storyPages = stories.filter((s) => s.hasPage)

export function getStory(key: string): Story | undefined {
  return stories.find((s) => s.key === key)
}

/** Static routes, used by the sitemap. */
export const staticRoutes = ['/', '/work', '/work/automotive', '/work/weddings', '/work/portraits', '/work/films', '/about', '/contact']

export const heroImages = { main: 'nikah-bride-pavilion', inset: 'automotive-camaro-desert-sunset' }
export const aboutPortrait = 'portrait-muhammed-rifad'

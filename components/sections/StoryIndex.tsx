import Link from 'next/link'
import { Arrow } from '@/components/ui/Arrow'
import { PhotoImage } from '@/components/media/PhotoImage'
import { Reveal } from '@/components/ui/Reveal'
import type { Story } from '@/lib/content'
import { format, localePath, type Locale } from '@/lib/i18n'
import { categorySlugs, storySlugs, toPhoto } from '@/lib/media'
import type { Messages } from '@/lib/messages'

export function storyCount(story: Story) {
  return story.key === 'automotive' ? categorySlugs('automotive').length : storySlugs(story.key).length
}

/** Magazine-style index of stories: alternating image and text, numbered. */
export function StoryIndex({ stories, locale, t }: { stories: Story[]; locale: Locale; t: Messages }) {
  return (
    <ol className="divide-y divide-line border-y border-line">
      {stories.map((story, i) => {
        const copy = t.stories[story.key]
        const flip = i % 2 === 1
        return (
          <li key={story.key}>
            <Reveal>
              <Link href={localePath(locale, story.href)} className="group grid items-center gap-8 py-12 md:grid-cols-12 md:gap-10 md:py-16">
                <span className={`relative block aspect-[4/5] overflow-hidden bg-bone md:col-span-5 ${flip ? 'md:order-last md:col-start-8' : ''}`}>
                  <PhotoImage
                    photo={{ ...toPhoto(story.cover, locale), alt: '' }}
                    cover
                    sizes="(min-width: 768px) 38vw, 67vw"
                    className="transition-transform duration-[1400ms] ease-editorial group-hover:scale-[1.03] motion-reduce:transition-none"
                  />
                </span>
                <span className={`block md:col-span-6 ${flip ? 'md:col-start-1 md:row-start-1' : 'md:col-start-7'}`}>
                  <span className="label flex items-center gap-3 text-stone">
                    <span className="text-burgundy">{String(i + 1).padStart(2, '0')}</span>
                    <span>{copy.kind}</span>
                  </span>
                  <span className="display mt-5 block text-4xl text-ink sm:text-5xl lg:text-6xl">{copy.title}</span>
                  <span className="mt-6 block max-w-lg text-lg text-charcoal">{copy.intro}</span>
                  <span className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
                    <span className="label inline-flex items-center gap-3 text-ink">
                      {t.home.featured.view}
                      <Arrow direction="forward" className="w-8 transition-transform duration-500 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
                    </span>
                    <span className="label text-stone">{format(t.home.featured.photographs, { count: storyCount(story) })}</span>
                  </span>
                </span>
              </Link>
            </Reveal>
          </li>
        )
      })}
    </ol>
  )
}

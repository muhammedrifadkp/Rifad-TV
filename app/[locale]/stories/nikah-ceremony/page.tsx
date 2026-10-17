import { StoryPage, storyMetadata } from '@/components/sections/StoryPage'

export function generateMetadata({ params }: PageProps<'/[locale]/stories/nikah-ceremony'>) {
  return storyMetadata(params, 'nikah-ceremony')
}

export default function Page({ params }: PageProps<'/[locale]/stories/nikah-ceremony'>) {
  return <StoryPage params={params} storyKey="nikah-ceremony" />
}

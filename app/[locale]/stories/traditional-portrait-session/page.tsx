import { StoryPage, storyMetadata } from '@/components/sections/StoryPage'

export function generateMetadata({ params }: PageProps<'/[locale]/stories/traditional-portrait-session'>) {
  return storyMetadata(params, 'traditional-portrait-session')
}

export default function Page({ params }: PageProps<'/[locale]/stories/traditional-portrait-session'>) {
  return <StoryPage params={params} storyKey="traditional-portrait-session" />
}

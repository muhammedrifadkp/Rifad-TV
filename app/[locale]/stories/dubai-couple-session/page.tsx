import { StoryPage, storyMetadata } from '@/components/sections/StoryPage'

export function generateMetadata({ params }: PageProps<'/[locale]/stories/dubai-couple-session'>) {
  return storyMetadata(params, 'dubai-couple-session')
}

export default function Page({ params }: PageProps<'/[locale]/stories/dubai-couple-session'>) {
  return <StoryPage params={params} storyKey="dubai-couple-session" />
}

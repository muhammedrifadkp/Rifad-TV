import { StoryPage, storyMetadata } from '@/components/sections/StoryPage'

export function generateMetadata({ params }: PageProps<'/[locale]/stories/bridal-sessions'>) {
  return storyMetadata(params, 'bridal-sessions')
}

export default function Page({ params }: PageProps<'/[locale]/stories/bridal-sessions'>) {
  return <StoryPage params={params} storyKey="bridal-sessions" />
}

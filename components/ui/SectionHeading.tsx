import { Rich } from './Rich'

type Props = {
  eyebrow: string
  title: string
  intro?: string
  as?: 'h1' | 'h2'
  className?: string
  /** Index shown before the eyebrow, e.g. "01". */
  index?: string
}

export function SectionHeading({ eyebrow, title, intro, as: Heading = 'h2', className = '', index }: Props) {
  return (
    <header className={`max-w-3xl ${className}`}>
      <p className="label flex items-center gap-3 text-stone">
        {index && <span className="text-burgundy">{index}</span>}
        <span>{eyebrow}</span>
      </p>
      <Heading
        className={`display mt-5 text-ink ${Heading === 'h1' ? 'text-5xl sm:text-6xl lg:text-7xl' : 'text-4xl sm:text-5xl lg:text-6xl'}`}
      >
        <Rich text={title} />
      </Heading>
      {intro && <p className="mt-6 max-w-prose text-lg text-charcoal">{intro}</p>}
    </header>
  )
}

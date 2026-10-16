import { Fragment } from 'react'

/** Renders copy that may contain <em>…</em> emphasis. No other markup is interpreted. */
export function Rich({ text }: { text: string }) {
  return text.split(/(<em>.*?<\/em>)/g).map((part, i) =>
    part.startsWith('<em>') ? (
      <em key={i} className="italic">
        {part.slice(4, -5)}
      </em>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  )
}

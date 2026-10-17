'use client'

import { useId, type FormEvent } from 'react'
import { Arrow } from '@/components/ui/Arrow'

export type WhatsAppFormLabels = {
  name: string
  type: string
  typePlaceholder: string
  types: string[]
  date: string
  location: string
  locationPlaceholder: string
  message: string
  messagePlaceholder: string
  optional: string
  submit: string
  note: string
  greeting: string
}

/**
 * Enquiry form with no backend: on submit it opens a WhatsApp chat with the details
 * written into the message, ready for the visitor to send.
 */
export function WhatsAppForm({ number, labels }: { number: string; labels: WhatsAppFormLabels }) {
  const id = useId()

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const value = (key: string) => String(data.get(key) ?? '').trim()
    const details = [
      `${labels.name}: ${value('name')}`,
      `${labels.type}: ${value('type')}`,
      value('date') && `${labels.date}: ${value('date')}`,
      value('location') && `${labels.location}: ${value('location')}`,
    ].filter(Boolean)
    const text = [labels.greeting, details.join('\n'), value('message')].join('\n\n')
    const url = `https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`
    // New tab on desktop; phones hand the link to the WhatsApp app. Fall back if pop-ups are blocked.
    const opened = window.open(url, '_blank', 'noopener,noreferrer')
    if (!opened) window.location.href = url
  }

  const field = 'mt-2 block w-full border-0 border-b border-line bg-transparent px-0 py-3 text-lg text-ink placeholder:text-stone/70 focus:border-ink focus:outline-none focus:ring-0'
  const label = 'label text-stone'
  const optional = <span className="normal-case tracking-normal text-stone/70"> ({labels.optional})</span>

  return (
    <form onSubmit={onSubmit} className="grid gap-8 sm:grid-cols-2">
      <div>
        <label htmlFor={`${id}-name`} className={label}>
          {labels.name}
        </label>
        <input id={`${id}-name`} name="name" required autoComplete="name" className={field} />
      </div>
      <div>
        <label htmlFor={`${id}-type`} className={label}>
          {labels.type}
        </label>
        <select id={`${id}-type`} name="type" required defaultValue="" className={`${field} cursor-pointer`}>
          <option value="" disabled>
            {labels.typePlaceholder}
          </option>
          {labels.types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor={`${id}-date`} className={label}>
          {labels.date}
          {optional}
        </label>
        <input id={`${id}-date`} name="date" type="date" className={field} />
      </div>
      <div>
        <label htmlFor={`${id}-location`} className={label}>
          {labels.location}
          {optional}
        </label>
        <input id={`${id}-location`} name="location" placeholder={labels.locationPlaceholder} className={field} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`${id}-message`} className={label}>
          {labels.message}
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          required
          rows={4}
          placeholder={labels.messagePlaceholder}
          className={`${field} resize-y`}
        />
      </div>
      <div className="sm:col-span-2">
        <button
          type="submit"
          className="label inline-flex min-h-12 items-center gap-4 bg-ink px-7 text-paper transition-colors duration-300 hover:bg-burgundy"
        >
          {labels.submit}
          <Arrow direction="forward" className="w-7 rtl:-scale-x-100" />
        </button>
        <p className="mt-4 max-w-md text-sm text-stone">{labels.note}</p>
      </div>
    </form>
  )
}

// Site-wide configuration. Contact details are kept here so that unverified
// information can be confirmed or switched on in one place (see APPROVALS.md).
// server-only keeps unpublished numbers out of client bundles.
import 'server-only'

/** Production URL. Set NEXT_PUBLIC_SITE_URL in Vercel before going live. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')

export const brand = {
  name: 'R7',
  person: 'Muhammed Rifad TV',
}

type ContactItem = {
  /** Shown on the site only when true. */
  publish: boolean
  /** Where the value came from in the supplied files. */
  source: string
}

export const contact = {
  email: {
    value: 'muhammedrifad127@gmail.com',
    source: 'rifad-tv-cv.pdf',
    // Confirm this is the current business address before launch.
    publish: true,
  },
  instagram: [
    {
      handle: 'r7.visuals_',
      url: 'https://www.instagram.com/r7.visuals_/',
      source: 'details',
      // Matches the R7 watermark. Confirm before launch.
      publish: true,
    },
    {
      handle: '_ri_fayyee._',
      url: 'https://www.instagram.com/_ri_fayyee._',
      source: 'details (CV lists "ri_fayyee")',
      // Conflicts with the CV spelling; hidden until confirmed.
      publish: false,
    },
  ],
  phones: [
    {
      label: 'UAE',
      e164: '+971566302072',
      display: '+971 56 630 2072',
      source: 'rifad-tv-cv.pdf (written as +971 0566302072)',
      whatsapp: false,
      publish: false,
    },
    {
      label: 'India',
      e164: '+919846823079',
      display: '+91 98468 23079',
      source: 'details (no country code given)',
      whatsapp: false,
      publish: false,
    },
  ],
} satisfies {
  email: ContactItem & { value: string }
  instagram: (ContactItem & { handle: string; url: string })[]
  phones: (ContactItem & { label: string; e164: string; display: string; whatsapp: boolean })[]
}

export const publishedInstagram = contact.instagram.filter((i) => i.publish)
export const publishedPhones = contact.phones.filter((p) => p.publish)
export const whatsappNumber = contact.phones.find((p) => p.publish && p.whatsapp)

export function whatsappUrl(e164: string) {
  return `https://wa.me/${e164.replace(/\D/g, '')}`
}

/** Services shown on the site. Album design stays hidden until authorship is confirmed. */
export const services = [
  { key: 'automotive', publish: true },
  { key: 'weddings', publish: true },
  { key: 'portraits', publish: true },
  { key: 'video', publish: true },
  { key: 'albums', publish: false },
] as const

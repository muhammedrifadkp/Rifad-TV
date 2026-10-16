# Before launch — approvals and open questions

Everything below is either hidden on the site or published provisionally. Each item says where to change it.

## Contact and identity

- [ ] **Email** `muhammedrifad127@gmail.com` (from the CV) is published. Confirm it is the current business address. → `lib/site.ts`
- [ ] **Instagram** `@r7.visuals_` (from `details`) is published. Confirm it is the brand account. → `lib/site.ts`
- [ ] **Second Instagram** — `details` lists `_ri_fayyee._`, the CV says `ri_fayyee`. Hidden until the correct handle is confirmed. → `lib/site.ts`
- [ ] **Phones** — hidden. The CV writes `+971 0566302072` (likely `+971 56 630 2072`); `details` lists an Indian number without a country code. Confirm which to show and which uses WhatsApp, then set `publish`/`whatsapp`. → `lib/site.ts`
- [ ] **Logo** — `logo.PNG` (added 2026-10-16) is used as the brand mark, with the white R recoloured to ink for the light site. Confirm this is the official mark and that recolouring is acceptable.
- [ ] **Brand name** — the site uses "R7". Confirm, along with the domain for `NEXT_PUBLIC_SITE_URL`.
- [ ] **"wanderlens"** (CV "Creative Gallery") — not linked; no URL was supplied.
- [ ] **Photographer pronouns** — copy about Muhammed Rifad TV is written without pronouns, and Arabic copy avoids gendered verbs. Can be adjusted once confirmed.

## Permissions (required before public deployment)

- [ ] **Client consent** for every wedding, couple and portrait image and film on the site (stories: Nikah Ceremony, Bridal Sessions, Dubai Couple Session, Traditional Portrait Session).
- [ ] **Employer work** — confirm whether any automotive images or films were made for Dresden Motors or Germantech Motor Dubai, and that they may be shown.
- [ ] **Number plates** are readable in several automotive photos. Confirm they are fine to show, or supply blurred versions.
- [ ] **Music** — every film is published without its audio track. Sound can be restored once licences are confirmed (remove `-an` for that film in `scripts/prepare-media.mjs`).
- [ ] **Profile photo** `profil-1.jpeg` is withheld: its EXIF credits "SAVAD EKS". `profil-2.jpeg` is used; confirm its photographer and permission too.
- [ ] **Location in a title** — "Dubai Couple Session" is inferred from the skyline. Confirm, or rename in `messages/en.ts` and `messages/ar.ts`.

## Withheld media (in `media/sources.json` with `publish: false`)

| Item | Reason |
|---|---|
| `IMG_7009`, `IMG_7014` | Family groups including a young child |
| `IMG_7012` | Family members and a child in the doorway |
| `IMG_7013` | Infant is the subject |
| `IMG_7002` | Couple's names legible on the marriage certificate |
| Wedding reels `AQMB4N2Y…`, `AQOH6Wui…`, `AQPE9EdK…` | Elders, guests, friends or a child throughout |
| Later parts of `AQM3PYJr…` and `AQO0RE9B…` | Only the bride-only openings (14.5 s, 11.5 s) are shown |
| `IMG_7090.PNG` | Mock "VOGUE" cover (third-party trademark) |
| All editorial/collage layouts (5 in set 4, 1 in set 2, 15 in set 3) | Authorship unconfirmed; several show client names |
| `800565717_…_n (1).jpg` | Exact duplicate |
| Near-duplicates (8 files) | Editing choice; listed with reasons in `sources.json` |

To publish one after consent: set `"publish": true` (add `alt` text and `categories` where missing), run `npm run media`, rebuild.

## Services and content

- [ ] **Album & Editorial Layout Design** is hidden. Show it once authorship and availability are confirmed. → `lib/site.ts` (`services`)
- [ ] **Prices** are not shown (none supplied). The site says "Enquire about availability".
- [ ] **Testimonials, client names, awards** — none on the site; none were supplied.
- [ ] **Captions** — photos have alt text but no captions (no client, date or location information was supplied).
- [ ] **Higher-resolution originals** for sets 1–3 and the car photos would allow larger lightbox images (the current files are Instagram exports, 1440–4096 px).
- [ ] **Arabic copy** was written for the site; a native-speaker review is recommended before launch.

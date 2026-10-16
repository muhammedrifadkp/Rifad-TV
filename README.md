# R7 — Photography & Film

Portfolio website for **R7**, the photography and film practice of Muhammed Rifad TV (Dubai).
English and Arabic (right-to-left), built as a fast, mostly static Next.js site from the
supplied work in the folder above this one. The original media is never modified.

Open items that need the owner's confirmation before launch are listed in [APPROVALS.md](APPROVALS.md).

## Stack

| | |
|---|---|
| Framework | Next.js 16.4.2 (App Router, Cache Components, Turbopack) |
| UI | React 19.3, TypeScript 5, Tailwind CSS 4 |
| Images | `next/image` with a custom loader over pre-generated WebP derivatives |
| Media tooling | sharp 0.35.5 (images), FFmpeg/ffprobe (films) |
| Fonts | Bodoni Moda + Jost (English), Amiri + Noto Sans Arabic (Arabic), via `next/font` |

No backend, database, CMS or animation library. Motion is CSS-only and respects `prefers-reduced-motion`.

## Commands

```bash
npm install          # once
npm run dev          # local development at http://localhost:3000
npm run build        # production build
npm start            # serve the production build
npm run lint         # ESLint
npm run typecheck    # TypeScript (run `npx next typegen` first on a fresh clone)
npm run media        # regenerate web media from the originals (see below)
```

## Project structure

```
app/
  [locale]/                 en + ar routes (root layout sets lang/dir, fonts, header, footer)
    page.tsx                home
    work/                   selected work + automotive, weddings, portraits, films
    stories/[slug]/         Nikah, bridal, Dubai couple, traditional portrait stories
    about/  contact/  not-found.tsx
  global-not-found.tsx      bilingual 404 for URLs that match no route
  sitemap.ts  robots.ts  icon.png  apple-icon.png  favicon.ico
components/
  layout/                   header (sticky, hides on scroll), mobile menu, language switch, footer
  gallery/                  editorial grid + accessible <dialog> lightbox (keys, swipe, RTL)
  media/                    photo wrapper, film grid + player
  sections/                 hero, collections, story index, about/services/contact blocks
  brand/  ui/
lib/
  i18n.ts                   locales, direction, path helpers (client-safe)
  messages.ts               dictionary loader (server-only)
  site.ts                   site URL, contact details and publish switches (server-only)
  content.ts                collections, stories, covers
  media/                    generated manifest, image loader, typed accessors
messages/en.ts, ar.ts       all copy, both languages
media/sources.json          curated list of originals → web names, alt text, publish flags
scripts/prepare-media.mjs   media pipeline
proxy.ts                    language redirect for "/" and locale-less URLs; real 404 for unknown stories
```

## Routes

`/` redirects to `/en` or `/ar` from the browser's `Accept-Language`. Every page exists in both languages:

| Path (after `/en` or `/ar`) | Content |
|---|---|
| `/` | Hero, collections, featured stories, about, services, contact |
| `/work` | All collections and stories |
| `/work/automotive` | 14 photographs + 7 automotive films |
| `/work/weddings` | Nikah, bridal and couple stories + 2 wedding films |
| `/work/portraits` | Traditional portrait session, bridal portraits + 1 film |
| `/work/films` | All 10 films |
| `/stories/{nikah-ceremony, bridal-sessions, dubai-couple-session, traditional-portrait-session}` | Full stories (Nikah in four chapters) |
| `/about`, `/contact` | Profile from the CV; contact details from `lib/site.ts` |

The language switch keeps you on the same page in the other language.

## Media pipeline

`npm run media` reads `media/sources.json` and writes only to `public/` and `lib/media/`:

- **Photos** → `public/media/images/<slug>-<width>.webp` at 480/800/1200/1600/2000 px (never upscaled),
  sRGB, metadata stripped, plus a blur placeholder. The `next/image` loader (`lib/media/image-loader.ts`)
  serves the nearest generated width, so no runtime image optimisation is needed.
- **Films** → `public/media/films/<slug>.mp4`: H.264, no audio track, fast-start, bitrate capped at 1.6 Mbps.
  Reels that were stored sideways ("turn your phone" format) are rotated to landscape; two wedding films
  are trimmed to bride-only excerpts. Each film gets WebP poster frames.
- **Brand** → `public/brand/r7-mark.webp` (ink R for the light site), `r7-mark-light.webp` (original white R),
  `app/icon.png`, `app/apple-icon.png`, `app/favicon.ico`, all from `logo.PNG`.
- **Sharing image** → `public/og/r7-og.jpg` (1200×630).
- **Manifest** → `lib/media/manifest.generated.json` (dimensions, widths, alt text) and `widths.generated.json`.

Only entries with `"publish": true` are processed; withheld entries record the reason. Derivatives of
unpublished items are deleted on the next run. Existing outputs are reused; `npm run media -- --force`
rebuilds everything (about 5 minutes). Requires `ffmpeg`/`ffprobe` on `PATH` for films.

To add or change a photo: edit `media/sources.json` (source path, slug, `en`/`ar` alt text, story, categories),
run `npm run media`, then rebuild.

Output: 59 photos (≈ 40 MB across all sizes; a typical grid image is 60–125 KB) and 10 films (≈ 28 MB).

## Contact details and switches

`lib/site.ts` holds every contact value with its source and a `publish` flag. Only published values reach
the HTML. Currently published: email (from the CV) and Instagram `@r7.visuals_` (from `details`).
Phone numbers, WhatsApp and the second Instagram handle are present but **hidden** until confirmed.
Services are listed there too; "Album & Editorial Layout Design" is hidden until authorship is confirmed.

## Deploying to Vercel

1. Put `website/` in a Git repository (GitHub, GitLab or Bitbucket) and import it in Vercel.
   If the repository root is the parent folder, set **Root Directory** to `website`.
   Don't commit the original media folder: only `website/` is needed, and `public/` already holds the web-ready files.
2. Framework preset: Next.js (detected). Build command `npm run build`, install `npm install`.
3. Add environment variable **`NEXT_PUBLIC_SITE_URL`** = the final domain (e.g. `https://r7visuals.com`),
   for Production (and Preview if wanted). Canonical URLs, hreflang, Open Graph, the sitemap and robots
   all read it; without it they point at `http://localhost:3000`.
4. Deploy, then add the custom domain in Vercel and redeploy so the URL above is baked in.

Requires the Node.js runtime (default on Vercel). Media is static, so there are no image-optimisation costs.

## Notes

- **OneDrive:** this folder syncs to OneDrive, including `node_modules/` and `.next/`. Consider moving
  `website/` outside OneDrive (and pointing `MEDIA_SOURCE_DIR` back at the originals) to avoid sync churn.
- **`public/logo.PNG`** (1.4 MB) was placed here by hand and is served as-is at `/logo.PNG`. The site uses the
  optimised versions in `public/brand/`; delete it if it shouldn't be public.
- **`npm audit`** reports 5 high-severity advisories, all in the ESLint toolchain (`eslint-config-next` →
  `fast-glob` → `micromatch` → `braces`). They are development-only and not shipped. The suggested
  "fix" downgrades to the Next 14 lint config, so it was not applied. Production dependencies: 0 advisories.
- `AGENTS.md` is written by `next dev`; it can be committed.

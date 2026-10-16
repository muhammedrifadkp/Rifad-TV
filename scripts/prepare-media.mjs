#!/usr/bin/env node
// Builds web-ready derivatives from the original media described in media/sources.json.
// Originals are only read, never modified. Outputs:
//   public/media/images/<slug>-<width>.webp   responsive stills and film posters (metadata stripped, sRGB)
//   public/media/films/<slug>.mp4             upright, silent H.264 films with fast start
//   public/og/r7-og.jpg                       default social-sharing image
//   public/brand/r7-mark{,-light}.webp        logo for light / dark backgrounds
//   app/icon.png, app/apple-icon.png, app/favicon.ico
//   lib/media/manifest.generated.json         dimensions, widths, blur placeholders and alt text
//   lib/media/widths.generated.json           per-image widths for the image loader
//
// Usage: npm run media            (only regenerates missing outputs)
//        npm run media -- --force (regenerates everything)
// Requires ffmpeg and ffprobe on PATH for films. MEDIA_SOURCE_DIR overrides the source folder.

import fs from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { spawnSync } from 'node:child_process'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const SOURCE_DIR = path.resolve(ROOT, process.env.MEDIA_SOURCE_DIR ?? '..')
const IMAGE_DIR = path.join(ROOT, 'public/media/images')
const FILM_DIR = path.join(ROOT, 'public/media/films')
const OG_FILE = path.join(ROOT, 'public/og/r7-og.jpg')
const BRAND_DIR = path.join(ROOT, 'public/brand')
const APP_DIR = path.join(ROOT, 'app')
const INK = { r: 0x14, g: 0x12, b: 0x10 }
const MANIFEST_FILE = path.join(ROOT, 'lib/media/manifest.generated.json')
const WIDTHS_FILE = path.join(ROOT, 'lib/media/widths.generated.json')

const WIDTHS = [480, 800, 1200, 1600, 2000]
const POSTER_WIDTHS = [480, 800, 1280]
const WEBP = { quality: 78, effort: 5 }
const OG = { slug: 'automotive-camaro-desert-sunset', width: 1200, height: 630, centerY: 0.47 }
const FORCE = process.argv.includes('--force')

const sources = JSON.parse(await fs.readFile(path.join(ROOT, 'media/sources.json'), 'utf8'))

function sourcePath(rel) {
  const abs = path.resolve(SOURCE_DIR, rel)
  if (!existsSync(abs)) throw new Error(`Source file not found: ${rel}`)
  return abs
}

function widthsFor(originalWidth, targets) {
  const max = Math.min(originalWidth, targets.at(-1))
  return [...new Set([...targets.filter((w) => w < max), max])]
}

async function blurDataURL(input) {
  const buf = await sharp(input).rotate().resize(16).webp({ quality: 40 }).toBuffer()
  return `data:image/webp;base64,${buf.toString('base64')}`
}

// Writes <slug>-<w>.webp for each width and returns the manifest entry fields.
// Existing files are kept unless --force or `overwrite` is set.
async function writeResponsive(input, slug, targets, written, overwrite = false) {
  const meta = await sharp(input).rotate().toBuffer({ resolveWithObject: true }).then((r) => r.info)
  const widths = widthsFor(meta.width, targets)
  for (const w of widths) {
    const file = path.join(IMAGE_DIR, `${slug}-${w}.webp`)
    written.add(file)
    if (!FORCE && !overwrite && existsSync(file)) continue
    await sharp(input).rotate().resize({ width: w, withoutEnlargement: true }).webp(WEBP).toFile(file)
  }
  const max = widths.at(-1)
  return {
    src: `/media/images/${slug}`,
    width: max,
    height: Math.round((meta.height * max) / meta.width),
    widths,
    blurDataURL: await blurDataURL(input),
  }
}

function run(cmd, args) {
  const r = spawnSync(cmd, args, { encoding: 'utf8' })
  if (r.error) throw new Error(`${cmd} is required for films: ${r.error.message}`)
  if (r.status !== 0) throw new Error(`${cmd} failed: ${r.stderr}`)
  return r.stdout
}

function probe(file) {
  const out = JSON.parse(
    run('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height:format=duration', '-of', 'json', file]),
  )
  return { width: out.streams[0].width, height: out.streams[0].height, duration: Number(out.format.duration) }
}

async function prepareFilm(film, written, tmpDir) {
  const input = sourcePath(film.source)
  const out = path.join(FILM_DIR, `${film.slug}.mp4`)
  written.add(out)
  if (FORCE || !existsSync(out)) {
    const filters = []
    if (film.rotate === 'ccw') filters.push('transpose=2')
    if (film.rotate === 'cw') filters.push('transpose=1')
    // Trims thin black strips some exports carry along one edge.
    if (film.crop) filters.push(`crop=${film.crop}`)
    filters.push('scale=trunc(iw/2)*2:trunc(ih/2)*2')
    const trim = film.trim ? ['-ss', String(film.trim.start), '-t', String(film.trim.end - film.trim.start)] : []
    run('ffmpeg', [
      '-y', '-v', 'error', '-i', input, ...trim,
      '-vf', filters.join(','), '-an',
      // Sources are already compressed 720p reels; cap the bitrate so re-encoding never inflates them.
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '26', '-maxrate', '1600k', '-bufsize', '3200k',
      '-profile:v', 'high', '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart', out,
    ])
  }
  const info = probe(out)
  const expectLandscape = film.orientation === 'landscape'
  if (expectLandscape !== info.width > info.height) {
    throw new Error(`${film.slug}: expected ${film.orientation} output, got ${info.width}x${info.height}`)
  }
  const frame = path.join(tmpDir, `${film.slug}.png`)
  run('ffmpeg', ['-y', '-v', 'error', '-ss', String(film.posterAt), '-i', out, '-frames:v', '1', frame])
  // Posters are cheap; always rebuild them so they match the current film file.
  const poster = await writeResponsive(frame, `${film.slug}-poster`, POSTER_WIDTHS, written, true)
  const { size } = await fs.stat(out)
  return {
    slug: film.slug,
    group: film.group,
    src: `/media/films/${film.slug}.mp4`,
    width: info.width,
    height: info.height,
    duration: Math.round(info.duration * 10) / 10,
    bytes: size,
    orientation: film.orientation,
    excerpt: Boolean(film.trim),
    flashing: Boolean(film.flashing),
    title: film.title,
    poster,
  }
}

// The supplied mark has a white R, which disappears on the ivory site. Recolour the
// white parts to ink while keeping the red 7; anti-aliased blends are interpolated.
async function inkVariant(input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]]
    const red = Math.max(0, Math.min(1, (r - (g + b) / 2) / 220))
    data[i] = Math.round(red * r + (1 - red) * INK.r)
    data[i + 1] = Math.round(red * g + (1 - red) * INK.g)
    data[i + 2] = Math.round(red * b + (1 - red) * INK.b)
  }
  return sharp(data, { raw: info }).png().toBuffer()
}

// ICO container holding a single PNG image (supported by every current browser).
function pngToIco(png, size) {
  const header = Buffer.alloc(22)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(1, 4)
  header.writeUInt8(size >= 256 ? 0 : size, 6)
  header.writeUInt8(size >= 256 ? 0 : size, 7)
  header.writeUInt16LE(1, 10) // colour planes
  header.writeUInt16LE(32, 12) // bits per pixel
  header.writeUInt32LE(png.length, 14)
  header.writeUInt32LE(22, 18) // image data offset
  return Buffer.concat([header, png])
}

async function prepareBrand(logoRel) {
  const trimmed = await sharp(sourcePath(logoRel)).trim().png().toBuffer()
  const mark = await sharp(trimmed).resize({ height: 360 }).toBuffer({ resolveWithObject: true })
  await fs.mkdir(BRAND_DIR, { recursive: true })
  await sharp(await inkVariant(mark.data)).webp({ quality: 92, alphaQuality: 100 }).toFile(path.join(BRAND_DIR, 'r7-mark.webp'))
  await sharp(mark.data).webp({ quality: 92, alphaQuality: 100 }).toFile(path.join(BRAND_DIR, 'r7-mark-light.webp'))

  // App icons: the original white/red mark on an ink square reads best at small sizes.
  const icon = async (size, pad) => {
    const inner = Math.round(size * (1 - pad * 2))
    const art = await sharp(trimmed).resize({ width: inner, height: inner, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer()
    return sharp({ create: { width: size, height: size, channels: 4, background: { ...INK, alpha: 1 } } })
      .composite([{ input: art, gravity: 'center' }])
      .png()
      .toBuffer()
  }
  await fs.writeFile(path.join(APP_DIR, 'icon.png'), await icon(512, 0.14))
  await fs.writeFile(path.join(APP_DIR, 'apple-icon.png'), await icon(180, 0.16))
  await fs.writeFile(path.join(APP_DIR, 'favicon.ico'), pngToIco(await icon(48, 0.1), 48))
  return { mark: { src: '/brand/r7-mark.webp', width: mark.info.width, height: mark.info.height } }
}

async function removeStale(dir, keep) {
  if (!existsSync(dir)) return
  for (const name of await fs.readdir(dir)) {
    const file = path.join(dir, name)
    if (!keep.has(file)) {
      await fs.rm(file)
      console.log(`  removed stale ${path.relative(ROOT, file)}`)
    }
  }
}

async function main() {
  await Promise.all([IMAGE_DIR, FILM_DIR, path.dirname(OG_FILE), path.dirname(MANIFEST_FILE)].map((d) => fs.mkdir(d, { recursive: true })))
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'r7-media-'))
  const written = new Set()
  const images = {}
  const films = {}

  const published = sources.images.filter((i) => i.publish)
  console.log(`Images: ${published.length} published, ${sources.images.length - published.length} withheld`)
  for (const item of published) {
    const entry = await writeResponsive(sourcePath(item.source), item.slug, WIDTHS, written)
    images[item.slug] = {
      ...entry,
      story: item.story,
      chapter: item.chapter ?? null,
      categories: item.categories,
      focal: item.focal ?? '50% 50%',
      alt: item.alt,
    }
    console.log(`  ${item.slug} ${entry.width}x${entry.height} [${entry.widths.join(', ')}]`)
  }

  const publishedFilms = sources.films.filter((f) => f.publish)
  console.log(`Films: ${publishedFilms.length} published, ${sources.films.length - publishedFilms.length} withheld`)
  for (const film of publishedFilms) {
    films[film.slug] = await prepareFilm(film, written, tmpDir)
    const f = films[film.slug]
    console.log(`  ${film.slug} ${f.width}x${f.height} ${f.duration}s ${(f.bytes / 1e6).toFixed(1)} MB`)
  }

  const og = published.find((i) => i.slug === OG.slug)
  if (og && (FORCE || !existsSync(OG_FILE))) {
    const src = sharp(sourcePath(og.source)).rotate()
    const { width, height } = await src.clone().toBuffer({ resolveWithObject: true }).then((r) => r.info)
    const cropH = Math.round((width * OG.height) / OG.width)
    const top = Math.max(0, Math.min(height - cropH, Math.round(height * OG.centerY - cropH / 2)))
    await src
      .extract({ left: 0, top, width, height: cropH })
      .resize(OG.width, OG.height)
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(OG_FILE)
  }

  const brand = sources.brand?.logo ? await prepareBrand(sources.brand.logo) : null
  if (brand) console.log(`Brand mark: ${brand.mark.width}x${brand.mark.height}, icons written to app/`)

  await removeStale(IMAGE_DIR, written)
  await removeStale(FILM_DIR, written)
  await fs.rm(tmpDir, { recursive: true, force: true })

  await fs.writeFile(MANIFEST_FILE, JSON.stringify({ brand, images, films }, null, 2) + '\n')
  const widths = Object.fromEntries(
    [...Object.entries(images), ...Object.values(films).map((f) => [`${f.slug}-poster`, f.poster])].map(([, e]) => [e.src, e.widths]),
  )
  await fs.writeFile(WIDTHS_FILE, JSON.stringify(widths) + '\n')
  console.log(`Wrote ${path.relative(ROOT, MANIFEST_FILE)} and ${path.relative(ROOT, WIDTHS_FILE)}`)
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})

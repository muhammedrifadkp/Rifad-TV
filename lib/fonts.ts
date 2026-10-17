import { Amiri, Bodoni_Moda, Jost, Noto_Sans_Arabic } from 'next/font/google'

export const bodoni = Bodoni_Moda({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-bodoni' })
export const jost = Jost({ subsets: ['latin'], variable: '--font-jost' })
// Arabic faces are not preloaded so English pages never download them.
export const amiri = Amiri({ subsets: ['arabic'], weight: ['400', '700'], variable: '--font-amiri', preload: false })
export const notoArabic = Noto_Sans_Arabic({ subsets: ['arabic'], variable: '--font-noto-arabic', preload: false })

export const fontVariables = `${bodoni.variable} ${jost.variable} ${amiri.variable} ${notoArabic.variable}`

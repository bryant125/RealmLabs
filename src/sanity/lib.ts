import {sanityClient} from 'sanity:client'
import {createClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import {toHTML} from '@portabletext/to-html'

const builder = imageUrlBuilder(sanityClient)

// Preview mode (LOCAL only): when PUBLIC_SANITY_PREVIEW=true and a token are
// set, read DRAFTS too so you can preview unpublished articles on the site.
// Production never sets these, so it only ever shows published content.
const previewToken = process.env.SANITY_API_TOKEN
const isPreview = process.env.PUBLIC_SANITY_PREVIEW === 'true' && !!previewToken
const readClient = isPreview
  ? createClient({...sanityClient.config(), token: previewToken, useCdn: false, perspective: 'previewDrafts'})
  : sanityClient

// Build an optimized image URL from a Sanity image reference.
export function urlForImage(source: any) {
  return builder.image(source)
}

export type Article = {
  _id: string
  title: string
  slug: string
  description: string
  brand: 'mamabee' | 'burnscroll'
  publishedAt: string
  author?: string
  tags?: string[]
  coverImage?: any
  body?: any
}

const ARTICLE_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  description,
  brand,
  publishedAt,
  author,
  tags,
  coverImage,
  body
`

// All published articles for one brand, newest first.
// Returns [] if Sanity isn't reachable / not configured yet, so the build
// never fails just because there are no articles or no projectId.
export async function getArticlesByBrand(brand: 'mamabee' | 'burnscroll'): Promise<Article[]> {
  try {
    return await readClient.fetch(
      `*[_type == "article" && brand == $brand && defined(slug.current)] | order(publishedAt desc){${ARTICLE_FIELDS}}`,
      {brand}
    )
  } catch (e) {
    console.warn(`[sanity] could not fetch ${brand} articles:`, (e as Error).message)
    return []
  }
}

export const APP_STORE_URL: Record<'mamabee' | 'burnscroll', string> = {
  mamabee: 'https://apps.apple.com/us/app/mamabee-baby-tracker/id6773179521',
  burnscroll: 'https://apps.apple.com/us/app/burnscroll-screen-time-control/id6758544932',
}

// Estimate reading time in minutes from a Portable Text body (~200 wpm).
export function readingMinutes(body: any): number {
  if (!Array.isArray(body)) return 1
  let words = 0
  for (const block of body) {
    if (block?._type === 'block' && Array.isArray(block.children)) {
      for (const span of block.children) {
        if (span?.text) words += span.text.split(/\s+/).filter(Boolean).length
      }
    }
  }
  return Math.max(1, Math.round(words / 200))
}

// Extract Q&A pairs from the "Frequently asked questions" section of a body,
// for FAQPage structured data (rich results / People Also Ask).
export function extractFaq(body: any): {question: string; answer: string}[] {
  if (!Array.isArray(body)) return []
  const faqs: {question: string; answer: string}[] = []
  let inFaq = false
  let current: {question: string; answer: string} | null = null
  const textOf = (b: any) => (b.children || []).map((s: any) => s.text || '').join('')
  for (const block of body) {
    if (block?._type !== 'block') continue
    if (block.style === 'h2') {
      if (current) { faqs.push(current); current = null }
      inFaq = /frequently asked questions/i.test(textOf(block))
      continue
    }
    if (!inFaq) continue
    if (block.style === 'h3') {
      if (current) faqs.push(current)
      current = {question: textOf(block), answer: ''}
    } else if (current && block.style === 'normal') {
      current.answer += (current.answer ? ' ' : '') + textOf(block)
    }
  }
  if (current) faqs.push(current)
  return faqs.filter((f) => f.question && f.answer)
}

// Up to `limit` other articles from the same brand, for a "Keep reading" block.
export async function getRelated(
  brand: 'mamabee' | 'burnscroll',
  currentSlug: string,
  limit = 3,
): Promise<Article[]> {
  const all = await getArticlesByBrand(brand)
  return all.filter((a) => a.slug !== currentSlug).slice(0, limit)
}

// Render Portable Text body to HTML: optimized images, inline download links,
// and an insertable "Download the app" CTA button (brand-aware App Store link).
export function renderBody(body: any, brand: 'mamabee' | 'burnscroll' = 'mamabee'): string {
  if (!body) return ''
  const appUrl = APP_STORE_URL[brand]
  return toHTML(body, {
    components: {
      types: {
        image: ({value}: any) => {
          if (!value?.asset) return ''
          const alt = value.alt || value.caption || ''
          const caption = value.caption ? `<figcaption>${value.caption}</figcaption>` : ''
          if (value.phone) {
            const url = urlForImage(value).width(640).fit('max').auto('format').url()
            return `<figure class="shot phone"><img src="${url}" alt="${alt}" loading="lazy" />${caption}</figure>`
          }
          const url = urlForImage(value).width(1200).fit('max').auto('format').url()
          return `<figure class="shot"><img src="${url}" alt="${alt}" loading="lazy" />${caption}</figure>`
        },
        appCta: ({value}: any) => {
          const label = value?.label || 'Get the app'
          const heading = value?.heading
            ? `<p class="article-cta-h">${value.heading}</p>`
            : ''
          return `<div class="article-cta">${heading}<a class="article-cta-btn" href="${appUrl}" target="_blank" rel="noopener">${label}</a></div>`
        },
      },
      marks: {
        appLink: ({children}: any) =>
          `<a href="${appUrl}" target="_blank" rel="noopener">${children}</a>`,
        link: ({children, value}: any) =>
          `<a href="${value?.href || '#'}" target="_blank" rel="noopener">${children}</a>`,
      },
    },
  })
}

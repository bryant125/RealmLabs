import {sanityClient} from 'sanity:client'
import imageUrlBuilder from '@sanity/image-url'
import {toHTML} from '@portabletext/to-html'

const builder = imageUrlBuilder(sanityClient)

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
    return await sanityClient.fetch(
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
          const url = urlForImage(value).width(1200).fit('max').auto('format').url()
          const alt = value.alt || ''
          return `<img src="${url}" alt="${alt}" loading="lazy" />`
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

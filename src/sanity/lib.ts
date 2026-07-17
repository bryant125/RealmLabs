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

// Render Portable Text body to HTML, turning embedded images into optimized <img> tags.
export function renderBody(body: any): string {
  if (!body) return ''
  return toHTML(body, {
    components: {
      types: {
        image: ({value}: any) => {
          if (!value?.asset) return ''
          const url = urlForImage(value).width(1200).fit('max').auto('format').url()
          const alt = value.alt || ''
          return `<img src="${url}" alt="${alt}" loading="lazy" />`
        },
      },
    },
  })
}

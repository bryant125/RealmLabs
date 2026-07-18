import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getArticlesByBrand, urlForImage } from '../../sanity/lib';

// RSS feed of MamaBee articles, newest first. MailerLite's RSS campaign reads
// this to auto-email subscribers when new articles are published. Each item is
// a clean teaser (cover + summary + "Read the full article" link) so the email
// drives clicks back to the site — good for traffic and SEO.
export async function GET(context: APIContext) {
  const posts = await getArticlesByBrand('mamabee');
  const site = context.site?.toString().replace(/\/$/, '') || 'https://www.realmlabs.app';

  return rss({
    title: 'MamaBee — Baby Sleep, Feeding & New-Parent Guides',
    description:
      'Warm, practical guides for new parents: sleep schedules, wake windows, feeding, and surviving the newborn fog — from the makers of the MamaBee baby tracker.',
    site,
    trailingSlash: false,
    items: posts.map((post) => {
      const url = `${site}/mamabee/articles/${post.slug}`;
      const cover = post.coverImage
        ? urlForImage(post.coverImage).width(1200).fit('max').auto('format').url()
        : null;
      const content = `${
        cover
          ? `<p><a href="${url}"><img src="${cover}" alt="${post.title}" style="max-width:100%;border-radius:12px" /></a></p>`
          : ''
      }<p>${post.description}</p><p><a href="${url}"><strong>Read the full article →</strong></a></p>`;
      return {
        title: post.title,
        description: post.description,
        link: url,
        pubDate: post.publishedAt ? new Date(post.publishedAt) : undefined,
        categories: post.tags || [],
        content,
      };
    }),
    customData: `<language>en-us</language>`,
  });
}

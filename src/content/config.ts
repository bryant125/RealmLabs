import { defineCollection, z } from 'astro:content';

// Shared shape for every brand's articles. Each brand is its OWN collection,
// so MamaBee's index only ever sees MamaBee posts, and BurnScroll's only sees
// BurnScroll posts — the "one brand, its own place" separation you asked for.
const articleSchema = z.object({
  title: z.string(),
  description: z.string(),          // used for the meta description + card blurb
  publishedDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  author: z.string().default('Realm Labs'),
  cover: z.string().optional(),     // path to hero image, e.g. /mamabee/assets/xyz.jpg
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

const mamabee = defineCollection({ type: 'content', schema: articleSchema });
const burnscroll = defineCollection({ type: 'content', schema: articleSchema });

export const collections = { mamabee, burnscroll };

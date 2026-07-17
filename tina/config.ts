import { defineConfig } from 'tinacms';

// Visual editor served at /admin. Writes Markdown into src/content/<brand>/,
// which Astro then builds into fully static, SEO-optimized article pages.
//
// For LOCAL editing:  npm run tina-dev   → http://localhost:4321/admin  (no account needed)
// For PRODUCTION editing on Vercel: create a FREE project at https://app.tina.io,
//   then set these env vars in Vercel (see SETUP-BLOG.md):
//     NEXT_PUBLIC_TINA_CLIENT_ID, TINA_TOKEN
const branch =
  process.env.TINA_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  'main';

const brandFields = [
  { type: 'string', name: 'title', label: 'Title', isTitle: true, required: true },
  { type: 'string', name: 'description', label: 'Meta description (for SEO & cards)', required: true, ui: { component: 'textarea' } },
  { type: 'datetime', name: 'publishedDate', label: 'Published date', required: true },
  { type: 'datetime', name: 'updatedDate', label: 'Last updated (optional)' },
  { type: 'string', name: 'author', label: 'Author' },
  { type: 'image', name: 'cover', label: 'Cover image' },
  { type: 'string', name: 'tags', label: 'Tags', list: true },
  { type: 'boolean', name: 'draft', label: 'Draft (hidden until unchecked)' },
  { type: 'rich-text', name: 'body', label: 'Article body', isBody: true },
] as const;

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || '',
  token: process.env.TINA_TOKEN || '',
  build: { outputFolder: 'admin', publicFolder: 'public' },
  media: { tina: { mediaRoot: 'uploads', publicFolder: 'public' } },
  schema: {
    collections: [
      {
        name: 'mamabee',
        label: '🐝 MamaBee Articles',
        path: 'src/content/mamabee',
        format: 'md',
        fields: brandFields as any,
        ui: {
          router: ({ document }) => `/mamabee/articles/${document._sys.filename}`,
        },
      },
      {
        name: 'burnscroll',
        label: '🔥 BurnScroll Articles',
        path: 'src/content/burnscroll',
        format: 'md',
        fields: brandFields as any,
        ui: {
          router: ({ document }) => `/burnscroll/articles/${document._sys.filename}`,
        },
      },
    ],
  },
});

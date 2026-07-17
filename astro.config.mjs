import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// NOTE: publicDir defaults to ./public — every existing page in public/
// (homepage, /mamabee, /burnscroll) is copied to the build output UNCHANGED.
// Astro only ADDS the new /*/articles routes on top. Nothing existing breaks.
export default defineConfig({
  site: 'https://www.realmlabs.app',
  outDir: './dist',
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin'),
      // The static pages in public/ are passed through by Astro but aren't
      // "routes", so the sitemap can't discover them automatically. List the
      // important ones here so Google indexes the whole site, not just articles.
      customPages: [
        'https://www.realmlabs.app/',
        'https://www.realmlabs.app/mamabee/',
        'https://www.realmlabs.app/mamabee/support',
        'https://www.realmlabs.app/mamabee/contact',
        'https://www.realmlabs.app/burnscroll/',
        'https://www.realmlabs.app/burnscroll/features',
        'https://www.realmlabs.app/burnscroll/use-cases',
        'https://www.realmlabs.app/burnscroll/contact',
      ],
    }),
  ],
});

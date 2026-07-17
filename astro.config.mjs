import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import sanity from '@sanity/astro';
import react from '@astrojs/react';

// projectId is not secret; set PUBLIC_SANITY_PROJECT_ID in .env / Vercel.
const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || '';
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';

// NOTE: publicDir defaults to ./public — every existing page in public/
// (homepage, /mamabee, /burnscroll) is copied to the build output UNCHANGED.
// Astro only ADDS the new /*/articles routes + the /studio editor on top.
export default defineConfig({
  site: 'https://www.realmlabs.app',
  outDir: './dist',
  trailingSlash: 'ignore',
  integrations: [
    sanity({
      projectId,
      dataset,
      useCdn: false,          // always fresh content at build time
      studioBasePath: '/studio', // Sanity Studio served at /studio
    }),
    react(),
    sitemap({
      filter: (page) => !page.includes('/studio') && !page.includes('/admin'),
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

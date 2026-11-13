import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import sanity from '@sanity/astro';
import react from '@astrojs/react';

// projectId/dataset are NOT secret (they ship in the browser bundle), so we
// hardcode them — no Vercel env var needed. Override via env if ever required.
const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || '1jrna7ry';
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';

// <lastmod> for every article URL in the sitemap, from Sanity's _updatedAt, plus
// hreflang alternates (xhtml:link) for articles that exist in several languages.
// Google uses lastmod to decide what to recrawl first. Fails soft: no lastmod.
// Keep HREFLANG in sync with src/i18n/mamabee.ts.
const SITE = 'https://www.realmlabs.app';
const HREFLANG = { en: ['en'], 'zh-tw': ['zh-TW', 'zh-HK'], 'zh-cn': ['zh-CN', 'zh-SG', 'zh-MY'], ja: ['ja'], ko: ['ko'], 'pt-br': ['pt-BR', 'pt'] };
const articleUrl = (brand, lang, slug) => `${SITE}/${brand}${lang === 'en' ? '' : `/${lang}`}/articles/${slug}`;
let lastmodByUrl = {};
let alternatesByUrl = {};
try {
  const query = encodeURIComponent('*[_type == "article" && defined(slug.current)]{ "slug": slug.current, brand, _updatedAt, "lang": coalesce(language, "en") }');
  const res = await fetch(`https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=${query}`);
  const docs = (await res.json()).result || [];
  const groups = {};
  for (const d of docs) {
    lastmodByUrl[articleUrl(d.brand, d.lang, d.slug)] = d._updatedAt;
    (groups[`${d.brand}/${d.slug}`] ??= []).push(d);
  }
  for (const g of Object.values(groups)) {
    if (g.length < 2) continue;
    const links = g.flatMap((d) => (HREFLANG[d.lang] || []).map((h) => ({ lang: h, url: articleUrl(d.brand, d.lang, d.slug) })));
    const en = g.find((d) => d.lang === 'en');
    if (en) links.push({ lang: 'x-default', url: articleUrl(en.brand, 'en', en.slug) });
    for (const d of g) alternatesByUrl[articleUrl(d.brand, d.lang, d.slug)] = links;
  }
} catch (e) {
  console.warn('[sitemap] could not fetch lastmod dates:', e.message);
}

// NOTE: publicDir defaults to ./public — every existing page in public/
// (homepage, /mamabee, /burnscroll) is copied to the build output UNCHANGED.
// Astro only ADDS the new /*/articles routes + the /studio editor on top.
export default defineConfig({
  site: 'https://www.realmlabs.app',
  outDir: './dist',
  // MUST stay 'never' to match vercel.json's "trailingSlash": false. With
  // 'ignore', @astrojs/sitemap falls back to build.format ('directory') and
  // emits every URL with a trailing slash — Vercel then 308-redirects each
  // one, and Google files the whole sitemap under "Page with redirect".
  trailingSlash: 'never',
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
      serialize: (item) => {
        const url = item.url.replace(/\/$/, '');
        const lastmod = lastmodByUrl[url];
        const links = alternatesByUrl[url];
        return { ...item, ...(lastmod ? { lastmod } : {}), ...(links ? { links } : {}) };
      },
      // The static pages in public/ are passed through by Astro but aren't
      // "routes", so the sitemap can't discover them automatically. List the
      // important ones here so Google indexes the whole site, not just articles.
      customPages: [
        'https://www.realmlabs.app/',
        'https://www.realmlabs.app/mamabee',
        'https://www.realmlabs.app/mamabee/support',
        'https://www.realmlabs.app/mamabee/contact',
        'https://www.realmlabs.app/mamabee/privacy',
        'https://www.realmlabs.app/mamabee/terms',
        'https://www.realmlabs.app/burnscroll',
        'https://www.realmlabs.app/burnscroll/features',
        'https://www.realmlabs.app/burnscroll/use-cases',
        'https://www.realmlabs.app/burnscroll/contact',
        'https://www.realmlabs.app/burnscroll/privacy',
        'https://www.realmlabs.app/burnscroll/terms',
      ],
    }),
  ],
});

# Realm Labs — Blog & SEO setup

This repo is now an **Astro static site**. Your existing pages (homepage, MamaBee,
BurnScroll) still live in [`public/`](public/) and are served **byte-for-byte
unchanged** — Astro just *adds* per-brand article pages and SEO files on top.

## How it publishes

- Write an article → Astro turns it into a fully static, SEO-optimized HTML page.
- Each brand has its **own separate section**, its own theme, and lists **only its own** articles:
  - MamaBee → `www.realmlabs.app/mamabee/articles/`
  - BurnScroll → `www.realmlabs.app/burnscroll/articles/`

## Two ways to write articles

### A. Markdown (works right now, no account)
Add a `.md` file under the brand's folder:
- MamaBee: [`src/content/mamabee/`](src/content/mamabee/)
- BurnScroll: [`src/content/burnscroll/`](src/content/burnscroll/)

Copy an existing sample as a template. The frontmatter at the top:
```yaml
---
title: "Your headline"
description: "1–2 sentence summary — used for Google + link previews"
publishedDate: 2026-07-16
author: "Realm Labs"
tags: ["topic"]
draft: false        # set true to hide it while writing
---
Article body in Markdown here...
```
Commit + push → Vercel rebuilds → live.

### B. Visual editor (TinaCMS at `/admin`) — recommended for regular publishing
A no-code dashboard where you write like a doc and hit **Publish**.

**One-time setup (free):**
1. Go to https://app.tina.io and create a project, pointing it at this GitHub repo.
2. Copy the **Client ID** and generate a **Read/Write Token**.
3. In Vercel → Project → Settings → Environment Variables, add:
   - `NEXT_PUBLIC_TINA_CLIENT_ID` = your client id
   - `TINA_TOKEN` = your token
4. In Vercel → Settings → Build, change the **Build Command** to:
   ```
   npm run tina-build
   ```
   (Until you do this, the site still builds fine via `npm run build` — you just
   won't have the visual editor in production yet.)

Then visit `www.realmlabs.app/admin`, log in, and write. Publishing commits to the
repo and triggers a rebuild automatically.

**Local preview of the editor:** `npm run tina-dev` → http://localhost:4321/admin

## SEO — what's already wired

- ✅ `sitemap-index.xml` / `sitemap-0.xml` — auto-generated every build
- ✅ `robots.txt` — points crawlers at the sitemap
- ✅ Per-article: unique title, meta description, canonical, Open Graph + Twitter cards, `Article` JSON-LD

### Your next SEO steps (outside the code)
1. **Google Search Console** (https://search.google.com/search-console) — add
   `www.realmlabs.app`, verify, and submit `https://www.realmlabs.app/sitemap-index.xml`.
2. **Bing Webmaster Tools** — same thing.
3. Turn on **Vercel Analytics** (or GA4) to watch traffic.
4. Keep publishing — steady, genuinely useful articles are what actually rank.

## Local commands
```
npm run dev       # preview the whole site at http://localhost:4321
npm run build     # production build into dist/
npm run preview   # serve the built site locally
```

// Turns the normal build output (dist/, where MamaBee lives under /mamabee) into
// the standalone https://mamabee.app site, at the domain root.
//
// Runs after `astro build` (see package.json). It does nothing unless
// SITE_TARGET=mamabee, which is set only on the "mamabee" Vercel project, so the
// realm-labs project keeps building exactly as before.
//
//   dist/mamabee/articles/x/index.html  →  dist/articles/x/index.html
//   https://www.realmlabs.app/mamabee/… →  https://mamabee.app/…
//   href="/mamabee/…"                   →  href="/…"
//   href="/" (Realm Labs Studio link)   →  href="https://www.realmlabs.app/"
//
// Local test: SITE_TARGET=mamabee npm run build
import {cpSync, existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync} from 'node:fs'
import {join, extname} from 'node:path'

if (process.env.SITE_TARGET !== 'mamabee') process.exit(0)

const OLD = 'https://www.realmlabs.app'
const NEW = 'https://mamabee.app'
const FULL = '.dist-full'

rmSync(FULL, {recursive: true, force: true})
renameSync('dist', FULL)
mkdirSync('dist')

// 1. Copy the MamaBee pages to the root, plus the shared Astro bundle and the IndexNow key.
cpSync(join(FULL, 'mamabee'), 'dist', {recursive: true})
cpSync(join(FULL, '_astro'), join('dist', '_astro'), {recursive: true})
for (const f of readdirSync(FULL)) if (/^[0-9a-f]{32}\.txt$/.test(f)) cpSync(join(FULL, f), join('dist', f))

// 2. Rewrite URLs inside every text file.
const B = `["'\`(\\s=,]` // what may precede a root-relative path
const rewrite = (s) =>
  s
    // Links to the Realm Labs Studio homepage stay on realmlabs.app.
    .replace(/(href=["'])\/(["'])/g, `$1${OLD}/$2`)
    // Absolute MamaBee URLs → mamabee.app.
    .replace(/https:\/\/www\.realmlabs\.app\/mamabee\//g, `${NEW}/`)
    .replace(/https:\/\/www\.realmlabs\.app\/mamabee(?=[#?"'`<)\s,\]]|$)/gm, `${NEW}/`)
    // Root-relative MamaBee paths → root.
    .replace(new RegExp(`(${B})/mamabee/`, 'g'), '$1/')
    .replace(new RegExp(`(${B})/mamabee(?=[#?"'\`)\\s])`, 'g'), '$1/')
    // Plain-text mentions (e.g. the cheat-sheet footer).
    .replace(/(www\.)?realmlabs\.app\/mamabee\b/g, 'mamabee.app')
    // The email signup function (and its MailerLite key) lives on the realm-labs project.
    .replace(/fetch\((['"])\/api\/subscribe/g, `fetch($1${OLD}/api/subscribe`)

const TEXT = new Set(['.html', '.js', '.jsx', '.css', '.txt', '.xml', '.json', '.webmanifest'])
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) { if (name !== '_astro') walk(p); continue }
    if (!TEXT.has(extname(name))) continue
    const s = readFileSync(p, 'utf8')
    const out = rewrite(s)
    if (out !== s) writeFileSync(p, out)
  }
}
walk('dist')

// 3. Sitemap: only the MamaBee URLs from the full sitemap, rewritten.
const urls = []
for (const f of readdirSync(FULL)) {
  if (!/^sitemap-\d+\.xml$/.test(f)) continue
  const xml = readFileSync(join(FULL, f), 'utf8')
  for (const m of xml.matchAll(/<url>[\s\S]*?<\/url>/g)) {
    if (m[0].includes(`<loc>${OLD}/mamabee`)) urls.push(rewrite(m[0]))
  }
}
const head = readFileSync(join(FULL, 'sitemap-0.xml'), 'utf8').match(/^[\s\S]*?<urlset[^>]*>/)[0]
writeFileSync('dist/sitemap.xml', `${head}${urls.join('')}</urlset>`)

// 4. robots.txt: same AI-bot rules, MamaBee sitemap.
const robots = readFileSync(join(FULL, 'robots.txt'), 'utf8')
  .replace(/^Sitemap:.*$/m, `Sitemap: ${NEW}/sitemap.xml`)
writeFileSync('dist/robots.txt', robots)

// 5. llms.txt / llms-full.txt: MamaBee-focused copies with mamabee.app URLs.
const llmsMama = (s) =>
  rewrite(s)
    .replace(/\n## BurnScroll[\s\S]*?(?=\n## Notes for answer engines)/, '\n')
    .replace(`${OLD}/sitemap-index.xml`, `${NEW}/sitemap.xml`)
    .replace(`${OLD}/llms-full.txt`, `${NEW}/llms-full.txt`)
for (const f of ['llms.txt', 'llms-full.txt']) {
  if (existsSync(join(FULL, f))) writeFileSync(join('dist', f), llmsMama(readFileSync(join(FULL, f), 'utf8')))
}

rmSync(FULL, {recursive: true, force: true})
console.log(`[mamabee.app] standalone site written to dist/ (${urls.length} sitemap URLs)`)

// Google Search Console helper.
//   node scripts/gsc-index.mjs submit                 -> (re)submit sitemap-index.xml (needs Full/Owner permission)
//   node scripts/gsc-index.mjs inspect <url|pattern>  -> index status of URLs (pattern matches sitemap URLs)
//   node scripts/gsc-index.mjs queries <page-substring> -> search queries for matching pages (28 days)
// Google has no public "request indexing" API for normal pages; that button is
// only in the Search Console UI. Sitemap submit + internal links + lastmod is
// the supported automated path.
import {readFileSync} from 'node:fs'
import {createSign} from 'node:crypto'
for (const line of readFileSync('.env', 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '')
}
const {GOOGLE_SA_KEY_FILE, GSC_SITE_URL} = process.env
const sa = JSON.parse(readFileSync(GOOGLE_SA_KEY_FILE, 'utf8'))
async function token(scope) {
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url')
  const now = Math.floor(Date.now() / 1000)
  const unsigned = `${b64({alg: 'RS256', typ: 'JWT'})}.${b64({iss: sa.client_email, scope, aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600})}`
  const sig = createSign('RSA-SHA256').update(unsigned).sign(sa.private_key, 'base64url')
  const r = await fetch('https://oauth2.googleapis.com/token', {method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, body: new URLSearchParams({grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${unsigned}.${sig}`})})
  const j = await r.json(); if (!j.access_token) throw new Error(JSON.stringify(j)); return j.access_token
}
const site = encodeURIComponent(GSC_SITE_URL)
const [cmd, arg] = process.argv.slice(2)
if (cmd === 'submit') {
  const t = await token('https://www.googleapis.com/auth/webmasters')
  const feed = encodeURIComponent('https://www.realmlabs.app/sitemap-index.xml')
  const r = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${site}/sitemaps/${feed}`, {method: 'PUT', headers: {Authorization: `Bearer ${t}`}})
  console.log('submit:', r.status, r.status === 204 || r.status === 200 ? 'OK' : await r.text())
  const l = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${site}/sitemaps`, {headers: {Authorization: `Bearer ${t}`}}).then((x) => x.json())
  for (const s of l.sitemap || []) console.log(' ', s.path, 'lastSubmitted', s.lastSubmitted, 'lastDownloaded', s.lastDownloaded, 'urls', s.contents?.map((c) => c.submitted).join('/'))
} else if (cmd === 'inspect') {
  const t = await token('https://www.googleapis.com/auth/webmasters.readonly')
  let urls = [arg]
  if (!/^https?:/.test(arg || '')) {
    const sm = await fetch('https://www.realmlabs.app/sitemap-0.xml').then((r) => r.text())
    urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => !arg || u.includes(arg))
  }
  const tally = {}
  for (const u of urls) {
    const r = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {method: 'POST', headers: {Authorization: `Bearer ${t}`, 'Content-Type': 'application/json'}, body: JSON.stringify({inspectionUrl: u, siteUrl: GSC_SITE_URL})}).then((x) => x.json())
    const s = r.inspectionResult?.indexStatusResult || {}
    const state = s.coverageState || r.error?.message || '?'
    tally[state] = (tally[state] || 0) + 1
    console.log(`${(s.verdict || '').padEnd(8)} ${state.padEnd(40)} ${s.lastCrawlTime ? s.lastCrawlTime.slice(0, 10) : '-'.padEnd(10)} ${u}`)
  }
  console.log('\n', tally)
} else if (cmd === 'queries') {
  // Search queries for pages whose URL contains <arg>, last 28 days.
  const t = await token('https://www.googleapis.com/auth/webmasters.readonly')
  const end = new Date(Date.now() - 2 * 864e5).toISOString().slice(0, 10), start = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10)
  const r = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${site}/searchAnalytics/query`, {method: 'POST', headers: {Authorization: `Bearer ${t}`, 'Content-Type': 'application/json'},
    body: JSON.stringify({startDate: start, endDate: end, dimensions: ['page', 'query'], rowLimit: 200, dimensionFilterGroups: [{filters: [{dimension: 'page', operator: 'contains', expression: arg}]}]})}).then((x) => x.json())
  for (const x of (r.rows || []).sort((a, b) => b.impressions - a.impressions)) console.log(`${x.keys[1].slice(0, 80).padEnd(80)} imp ${String(x.impressions).padStart(4)} pos ${x.position.toFixed(1).padStart(5)} clk ${x.clicks}  ${x.keys[0].replace('https://www.realmlabs.app', '')}`)
} else console.log('usage: submit | inspect <url|pattern> | queries <page-substring>')

// Weekly traffic check against the 500–1,000 visits/day goal.
// Writes reports/weekly-<date>.md (gitignored) and appends a row to reports/weekly-history.csv.
// Run: node scripts/weekly-report.mjs            (add --no-inspect to skip the slow index check)
// Needs in .env: GOOGLE_SA_KEY_FILE, GA4_PROPERTY_ID, GSC_SITE_URL (realmlabs.app).
// Optional: MAMABEE_GSC_SITE_URL (e.g. sc-domain:mamabee.app). MamaBee moved there on 2026-11-27;
// until the service account is added to that property, only the old domain is counted.
import {readFileSync, mkdirSync, writeFileSync, appendFileSync, existsSync} from 'node:fs'
import {createSign} from 'node:crypto'
import {fileURLToPath} from 'node:url'
import {dirname, join} from 'node:path'

process.chdir(join(dirname(fileURLToPath(import.meta.url)), '..'))
for (const line of readFileSync('.env', 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '')
}
const {GOOGLE_SA_KEY_FILE, GA4_PROPERTY_ID, GSC_SITE_URL} = process.env
const sa = JSON.parse(readFileSync(GOOGLE_SA_KEY_FILE, 'utf8'))
const INSPECT = !process.argv.includes('--no-inspect')

async function getToken() {
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url')
  const now = Math.floor(Date.now() / 1000)
  const unsigned = `${b64({alg: 'RS256', typ: 'JWT'})}.${b64({iss: sa.client_email, scope: 'https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/webmasters.readonly', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600})}`
  const sig = createSign('RSA-SHA256').update(unsigned).sign(sa.private_key, 'base64url')
  const j = await fetch('https://oauth2.googleapis.com/token', {method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, body: new URLSearchParams({grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${unsigned}.${sig}`})}).then((r) => r.json())
  if (!j.access_token) throw new Error(`Auth failed: ${JSON.stringify(j)}`)
  return j.access_token
}
const token = await getToken()
const post = async (url, body) => {
  const r = await fetch(url, {method: 'POST', headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'}, body: JSON.stringify(body)})
  const j = await r.json(); if (!r.ok) throw new Error(`${url}\n${JSON.stringify(j)}`); return j
}

const iso = (d) => d.toISOString().slice(0, 10)
const short = (u) => u.replace('https://www.realmlabs.app', '').replace('https://mamabee.app', '[mamabee.app]')
const ago = (n) => iso(new Date(Date.now() - n * 864e5))
// GA4: last 7 full days vs the 7 before. GSC lags ~3 days, so its weeks end 3 days ago.
const ga = {cur: {startDate: ago(7), endDate: ago(1)}, prev: {startDate: ago(14), endDate: ago(8)}}
const gs = {cur: {startDate: ago(9), endDate: ago(3)}, prev: {startDate: ago(16), endDate: ago(10)}}

// --- GA4 ---
const ga4Url = `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`
const flat = (rep) => (rep.rows || []).map((r) => {
  const o = {}
  rep.dimensionHeaders?.forEach((h, i) => (o[h.name] = r.dimensionValues[i].value))
  rep.metricHeaders?.forEach((h, i) => (o[h.name] = Number(r.metricValues[i].value)))
  return o
})
const ga4 = async (range, body) => flat(await post(ga4Url, {dateRanges: [range], limit: 200, ...body}))
const chan = (range) => ga4(range, {dimensions: [{name: 'sessionDefaultChannelGroup'}], metrics: [{name: 'sessions'}]})
const [chCur, chPrev, daily, landing] = await Promise.all([
  chan(ga.cur), chan(ga.prev),
  ga4(ga.cur, {dimensions: [{name: 'date'}], metrics: [{name: 'sessions'}], orderBys: [{dimension: {dimensionName: 'date'}}]}),
  ga4(ga.cur, {dimensions: [{name: 'hostName'}, {name: 'landingPage'}], metrics: [{name: 'sessions'}], orderBys: [{metric: {metricName: 'sessions'}, desc: true}], limit: 15}),
])
const sum = (rows, k) => rows.reduce((a, r) => a + (r[k] || 0), 0)
const sessCur = sum(chCur, 'sessions'), sessPrev = sum(chPrev, 'sessions')
// AI answer engines (GEO): ChatGPT also shows up as "openai / Organic Search".
const AI = /chatgpt|openai|perplexity|gemini|copilot|claude|bard|you\.com|phind/i
const srcAI = (range) => ga4(range, {dimensions: [{name: 'sessionSource'}], metrics: [{name: 'sessions'}]}).then((rows) => rows.filter((r) => AI.test(r.sessionSource)))
const [aiCur, aiPrev] = await Promise.all([srcAI(ga.cur), srcAI(ga.prev)])
const perDay = sessCur / 7

// --- MamaBee's own GA4 property (mamabee.app, from 2026-11-27) + App Store clicks ---
// The main property above stays the Realm Labs rollup (both domains) so the goal trend is unbroken.
let mbLine = 'no MAMABEE_GA4_PROPERTY_ID'
if (process.env.MAMABEE_GA4_PROPERTY_ID) {
  try {
    const mbUrl = `https://analyticsdata.googleapis.com/v1beta/properties/${process.env.MAMABEE_GA4_PROPERTY_ID}:runReport`
    const mb = async (range, body) => flat(await post(mbUrl, {dateRanges: [range], limit: 50, ...body}))
    const [mbCur, mbPrev, clk] = await Promise.all([
      mb(ga.cur, {metrics: [{name: 'sessions'}]}), mb(ga.prev, {metrics: [{name: 'sessions'}]}),
      mb(ga.cur, {dimensions: [{name: 'customEvent:cta_placement'}], metrics: [{name: 'eventCount'}],
        dimensionFilter: {filter: {fieldName: 'eventName', stringFilter: {value: 'app_store_click'}}}}).catch(() =>
        mb(ga.cur, {metrics: [{name: 'eventCount'}], dimensionFilter: {filter: {fieldName: 'eventName', stringFilter: {value: 'app_store_click'}}}})),
    ])
    const s1 = sum(mbCur, 'sessions'), s0 = sum(mbPrev, 'sessions'), c = sum(clk, 'eventCount')
    const by = clk.filter((r) => r['customEvent:cta_placement']).map((r) => `${r['customEvent:cta_placement']} ${r.eventCount}`).join(', ')
    mbLine = `${(s1 / 7).toFixed(1)} visits/day (prev ${(s0 / 7).toFixed(1)}); App Store clicks: ${c}${by ? ` — ${by}` : ''}`
  } catch (e) { mbLine = 'MamaBee GA4 error: ' + e.message.slice(0, 120) }
}

// --- Search Console ---
// Both properties are summed while Google moves rankings from realmlabs.app/mamabee to mamabee.app.
const MB_GSC = process.env.MAMABEE_GSC_SITE_URL
const gscSites = [GSC_SITE_URL, MB_GSC].filter(Boolean)
const gscMissing = new Set()
const gsc = async (range, dimensions, rowLimit = 1000) => {
  const all = []
  for (const site of gscSites) {
    try {
      const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`
      all.push(...((await post(url, {...range, dimensions, rowLimit})).rows || []))
    } catch { gscMissing.add(site) }
  }
  return all
}
const [pCur, pPrev, qCur, qPrev, pq] = await Promise.all([
  gsc(gs.cur, ['page']), gsc(gs.prev, ['page']), gsc(gs.cur, ['query']), gsc(gs.prev, ['query']), gsc(gs.cur, ['page', 'query'], 5000),
])
const clicks = sum(pCur, 'clicks'), clicksPrev = sum(pPrev, 'clicks')
const imps = sum(pCur, 'impressions'), impsPrev = sum(pPrev, 'impressions')
const prevQ = new Set(qPrev.map((r) => r.keys[0]))
const newQueries = qCur.filter((r) => !prevQ.has(r.keys[0])).sort((a, b) => b.impressions - a.impressions).slice(0, 15)
const striking = pq.filter((r) => r.position >= 4 && r.position <= 20 && r.impressions >= 5).sort((a, b) => b.impressions - a.impressions).slice(0, 20)

// --- Bing (search clicks/impressions; Copilot AI citations are only in the Bing UI) ---
let bingLine = 'no BING_WMT_API_KEY'
if (process.env.BING_WMT_API_KEY) {
  try {
    const rows = []
    for (const site of ['https://www.realmlabs.app/', 'https://mamabee.app/']) {
      const u = `https://ssl.bing.com/webmaster/api.svc/json/GetRankAndTrafficStats?siteUrl=${encodeURIComponent(site)}&apikey=${process.env.BING_WMT_API_KEY}`
      try { rows.push(...((await fetch(u).then((r) => r.json())).d || []).map((r) => ({t: +r.Date.match(/\d+/)[0], c: r.Clicks, i: r.Impressions}))) } catch {}
    }
    const cut = Date.now() - 7 * 864e5, cut2 = Date.now() - 14 * 864e5
    const s = (f) => rows.filter(f).reduce((a, r) => ({c: a.c + r.c, i: a.i + r.i}), {c: 0, i: 0})
    const now7 = s((r) => r.t >= cut), prev7 = s((r) => r.t >= cut2 && r.t < cut)
    bingLine = `${now7.c} clicks, ${now7.i} impressions (prev ${prev7.c} / ${prev7.i}). Copilot citations: check Bing Webmaster → AI Performance`
  } catch (e) { bingLine = 'Bing API error: ' + e.message }
}

// --- Index coverage (sitemap URLs) ---
let indexLine = 'skipped', notIndexed = []
if (INSPECT) {
  // After the move, inspect mamabee.app URLs in the mamabee.app property (once the service account has access).
  let mbAccess = false
  if (MB_GSC) { try { await post('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {inspectionUrl: 'https://mamabee.app/', siteUrl: MB_GSC}); mbAccess = true } catch {} }
  const inspectSite = mbAccess ? MB_GSC : GSC_SITE_URL
  const sm = await fetch(mbAccess ? 'https://mamabee.app/sitemap.xml' : 'https://www.realmlabs.app/sitemap-0.xml').then((r) => r.text())
  const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => mbAccess || u.includes('/mamabee'))
  let indexed = 0
  for (let i = 0; i < urls.length; i += 5) {
    await Promise.all(urls.slice(i, i + 5).map(async (u) => {
      try {
        const r = await post('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {inspectionUrl: u, siteUrl: inspectSite})
        const s = r.inspectionResult?.indexStatusResult || {}
        if (s.verdict === 'PASS') indexed++; else notIndexed.push(`${short(u)} (${s.coverageState || '?'})`)
      } catch (e) { notIndexed.push(`${u} (inspect error)`) }
    }))
  }
  indexLine = `${indexed} / ${urls.length} MamaBee URLs indexed (${Math.round((100 * indexed) / urls.length)}%) on ${mbAccess ? 'mamabee.app' : 'realmlabs.app/mamabee (old URLs — add the service account to the mamabee.app property)'}`
}

// --- Checkpoints ---
const checkpoints = [
  ['2026-11-29', '≥80% of URLs indexed', null],
  ['2026-12-13', '30+ visits/day', 30],
  ['2026-12-27', '100+ visits/day', 100],
  ['2027-01-10', '300+ visits/day', 300],
  ['2027-01-24', '500–1,000 visits/day (goal)', 500],
]
const today = iso(new Date())
const next = checkpoints.find(([d]) => d >= today) || checkpoints.at(-1)

const pct = (a, b) => (b ? `${a >= b ? '+' : ''}${Math.round(((a - b) / b) * 100)}%` : 'n/a')
const md = [
  `# Weekly traffic report — ${today}`,
  '',
  `**Visits/day (GA4, ${ga.cur.startDate}..${ga.cur.endDate}): ${perDay.toFixed(1)}** (prev week ${(sessPrev / 7).toFixed(1)}, ${pct(sessCur, sessPrev)})`,
  `**MamaBee (own GA4, mamabee.app):** ${mbLine}`,
  `**Google (GSC, ${gs.cur.startDate}..${gs.cur.endDate}):** ${clicks} clicks (prev ${clicksPrev}, ${pct(clicks, clicksPrev)}), ${imps} impressions (prev ${impsPrev}, ${pct(imps, impsPrev)})`,
  `**AI assistants (GEO):** ${sum(aiCur, 'sessions')} sessions (prev ${sum(aiPrev, 'sessions')})${aiCur.length ? ' — ' + aiCur.map((r) => `${r.sessionSource} ${r.sessions}`).join(', ') : ''}`,
  `**Bing (7 days):** ${bingLine}`,
  `**Domains:** GSC ${gscSites.filter((x) => !gscMissing.has(x)).join(' + ')}${gscMissing.size ? ` (no access yet: ${[...gscMissing].join(', ')})` : ''}`,
  `**Index:** ${indexLine}`,
  `**Next checkpoint:** ${next[0]} — ${next[1]}${next[2] ? ` (now ${perDay.toFixed(1)}/day = ${Math.round((100 * perDay) / next[2])}% of target)` : ''}`,
  '',
  '## Sessions by channel (7 days)',
  ...chCur.sort((a, b) => b.sessions - a.sessions).map((r) => `- ${r.sessionDefaultChannelGroup}: ${r.sessions} (prev ${chPrev.find((p) => p.sessionDefaultChannelGroup === r.sessionDefaultChannelGroup)?.sessions || 0})`),
  '',
  '## Daily sessions',
  daily.map((r) => `${r.date.slice(4, 6)}-${r.date.slice(6)}: ${r.sessions}`).join(' | '),
  '',
  '## Top landing pages (GA4)',
  ...landing.map((r) => `- ${r.sessions} ${r.hostName === 'mamabee.app' ? 'mamabee.app' : ''}${r.landingPage}`),
  '',
  '## Top Google pages',
  ...pCur.sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions).slice(0, 15).map((r) => `- ${r.clicks} clk / ${r.impressions} imp / pos ${r.position.toFixed(1)} — ${short(r.keys[0])}`),
  '',
  '## Top queries',
  ...qCur.sort((a, b) => b.impressions - a.impressions).slice(0, 20).map((r) => `- ${r.keys[0]} — ${r.impressions} imp, pos ${r.position.toFixed(1)}, ${r.clicks} clk`),
  '',
  '## Striking distance (pos 4–20) — improve these first',
  ...striking.map((r) => `- "${r.keys[1]}" pos ${r.position.toFixed(1)}, ${r.impressions} imp — ${short(r.keys[0])}`),
  '',
  '## New queries this week',
  ...newQueries.map((r) => `- ${r.keys[0]} — ${r.impressions} imp, pos ${r.position.toFixed(1)}`),
  '',
  `## Not indexed (${notIndexed.length})`,
  ...notIndexed.slice(0, 80).map((u) => `- ${u}`),
].join('\n')

mkdirSync('reports', {recursive: true})
writeFileSync(`reports/weekly-${today}.md`, md)
const hist = 'reports/weekly-history.csv'
if (!existsSync(hist)) writeFileSync(hist, 'date,visits_per_day,sessions_7d,gsc_clicks_7d,gsc_impressions_7d,index\n')
appendFileSync(hist, `${today},${perDay.toFixed(1)},${sessCur},${clicks},${imps},"${indexLine}"\n`)
console.log(md.split('\n').slice(0, 6).join('\n'))
console.log(`\nSaved reports/weekly-${today}.md`)

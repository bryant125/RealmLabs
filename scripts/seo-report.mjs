// Pull Search Console + GA4 data into reports/seo-<date>.json for SEO analysis.
// Run: node scripts/seo-report.mjs [days=28]
//
// Needs in .env:
//   GOOGLE_SA_KEY_FILE=.secrets/google-sa.json   (service account JSON key)
//   GA4_PROPERTY_ID=123456789                     (numeric, GA4 Admin > Property details)
//   GSC_SITE_URL=sc-domain:realmlabs.app          (or https://www.realmlabs.app/)
import {readFileSync, mkdirSync, writeFileSync} from 'node:fs'
import {createSign} from 'node:crypto'

// Minimal .env loader (no dotenv dependency)
for (const line of readFileSync('.env', 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '')
}

const {GOOGLE_SA_KEY_FILE, GA4_PROPERTY_ID, GSC_SITE_URL} = process.env
if (!GOOGLE_SA_KEY_FILE || !GA4_PROPERTY_ID || !GSC_SITE_URL) {
  console.error('Missing GOOGLE_SA_KEY_FILE, GA4_PROPERTY_ID or GSC_SITE_URL in .env')
  process.exit(1)
}
const DAYS = Number(process.argv[2] || 28)

// --- Auth: service-account JWT -> access token ---
const sa = JSON.parse(readFileSync(GOOGLE_SA_KEY_FILE, 'utf8'))
async function getToken() {
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url')
  const now = Math.floor(Date.now() / 1000)
  const unsigned = `${b64({alg: 'RS256', typ: 'JWT'})}.${b64({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  })}`
  const sig = createSign('RSA-SHA256').update(unsigned).sign(sa.private_key, 'base64url')
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${unsigned}.${sig}`}),
  })
  const j = await res.json()
  if (!j.access_token) throw new Error(`Auth failed: ${JSON.stringify(j)}`)
  return j.access_token
}
const token = await getToken()

async function api(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
    body: JSON.stringify(body),
  })
  const j = await res.json()
  if (!res.ok) throw new Error(`${url}\n${JSON.stringify(j, null, 2)}`)
  return j
}

// --- Date ranges (GSC data lags ~3 days) ---
const iso = (d) => d.toISOString().slice(0, 10)
const daysAgo = (n) => new Date(Date.now() - n * 864e5)
const cur = {startDate: iso(daysAgo(DAYS + 2)), endDate: iso(daysAgo(3))}
const prev = {startDate: iso(daysAgo(2 * DAYS + 2)), endDate: iso(daysAgo(DAYS + 3))}

// --- Search Console ---
const gscUrl = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE_URL)}/searchAnalytics/query`
const gsc = async (range, dimensions, rowLimit = 1000) =>
  (await api(gscUrl, {...range, dimensions, rowLimit})).rows || []

const [byQuery, byPage, byPageQuery, byPagePrev, byDate] = await Promise.all([
  gsc(cur, ['query']),
  gsc(cur, ['page']),
  gsc(cur, ['page', 'query'], 5000),
  gsc(prev, ['page']),
  gsc(cur, ['date']),
])

// Striking distance: ranking 5-20 with real impressions -> best candidates to improve
const strikingDistance = byPageQuery
  .filter((r) => r.position >= 5 && r.position <= 20 && r.impressions >= 10)
  .sort((a, b) => b.impressions - a.impressions)
  .slice(0, 100)

// Low CTR: decent position but few clicks -> title/meta rewrite candidates
const lowCtr = byPage
  .filter((r) => r.position <= 10 && r.impressions >= 50 && r.ctr < 0.02)
  .sort((a, b) => b.impressions - a.impressions)

// Movers: page click change vs previous period
const prevMap = Object.fromEntries(byPagePrev.map((r) => [r.keys[0], r]))
const movers = byPage
  .map((r) => ({page: r.keys[0], clicks: r.clicks, prevClicks: prevMap[r.keys[0]]?.clicks || 0}))
  .map((r) => ({...r, delta: r.clicks - r.prevClicks}))
  .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
  .slice(0, 30)

// --- GA4 ---
const ga4Url = `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`
const ga4 = (body) => api(ga4Url, {dateRanges: [cur], limit: 500, ...body})
const flat = (rep) =>
  (rep.rows || []).map((r) => {
    const o = {}
    rep.dimensionHeaders?.forEach((h, i) => (o[h.name] = r.dimensionValues[i].value))
    rep.metricHeaders?.forEach((h, i) => (o[h.name] = Number(r.metricValues[i].value)))
    return o
  })

const [channels, organicLanding, allPages] = await Promise.all([
  ga4({
    dimensions: [{name: 'sessionDefaultChannelGroup'}],
    metrics: [{name: 'sessions'}, {name: 'engagedSessions'}, {name: 'keyEvents'}, {name: 'totalUsers'}],
  }),
  ga4({
    dimensions: [{name: 'landingPage'}],
    metrics: [{name: 'sessions'}, {name: 'engagementRate'}, {name: 'averageSessionDuration'}, {name: 'keyEvents'}],
    dimensionFilter: {filter: {fieldName: 'sessionDefaultChannelGroup', stringFilter: {value: 'Organic Search'}}},
    orderBys: [{metric: {metricName: 'sessions'}, desc: true}],
  }),
  ga4({
    dimensions: [{name: 'pagePath'}],
    metrics: [{name: 'screenPageViews'}, {name: 'userEngagementDuration'}, {name: 'keyEvents'}],
    orderBys: [{metric: {metricName: 'screenPageViews'}, desc: true}],
  }),
])

// --- Write report ---
const sum = (rows, k) => rows.reduce((a, r) => a + (r[k] || 0), 0)
const report = {
  generated: new Date().toISOString(),
  ranges: {current: cur, previous: prev},
  gsc: {
    totals: {clicks: sum(byPage, 'clicks'), impressions: sum(byPage, 'impressions'), prevClicks: sum(byPagePrev, 'clicks')},
    byDate, byQuery, byPage, strikingDistance, lowCtr, movers,
  },
  ga4: {channels: flat(channels), organicLanding: flat(organicLanding), pages: flat(allPages)},
}
mkdirSync('reports', {recursive: true})
const out = `reports/seo-${iso(new Date())}.json`
writeFileSync(out, JSON.stringify(report, null, 2))

const t = report.gsc.totals
console.log(`GSC ${cur.startDate}..${cur.endDate}: ${t.clicks} clicks (prev ${t.prevClicks}), ${t.impressions} impressions`)
console.log(`Queries: ${byQuery.length} | Pages: ${byPage.length} | Striking-distance: ${strikingDistance.length} | Low-CTR pages: ${lowCtr.length}`)
console.log(`GA4 organic landing pages: ${report.ga4.organicLanding.length}`)
console.log(`Saved ${out}`)

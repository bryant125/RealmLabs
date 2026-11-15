// Google Trends (US, last 12 months) average interest, compared against an anchor keyword.
// Usage: node scripts/trends.mjs '{"anchor kw":["kw1","kw2",...]}' out.json
import {writeFileSync} from 'node:fs'
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124 Safari/537.36'
let cookie = ''
async function init() { const r = await fetch('https://trends.google.com/trends/?geo=US', {headers: {'User-Agent': UA}}); cookie = (r.headers.getSetCookie?.() || []).map(c => c.split(';')[0]).join('; ') }
const sleep = (ms) => new Promise(r => setTimeout(r, ms))
async function get(url) {
  for (let i = 0; i < 5; i++) {
    const r = await fetch(url, {headers: {'User-Agent': UA, Cookie: cookie}})
    if (r.status === 200) return JSON.parse((await r.text()).replace(/^\)\]\}',?\n?/, ''))
    await sleep(15000 * (i + 1)); await init()
  }
  throw new Error('failed ' + url.slice(0, 120))
}
async function compare(kws) {
  const req = {comparisonItem: kws.map(k => ({keyword: k, geo: 'US', time: 'today 12-m'})), category: 0, property: ''}
  const ex = await get(`https://trends.google.com/trends/api/explore?hl=en-US&tz=0&req=${encodeURIComponent(JSON.stringify(req))}`)
  const w = ex.widgets.find(x => x.id === 'TIMESERIES')
  const d = await get(`https://trends.google.com/trends/api/widgetdata/multiline?hl=en-US&tz=0&req=${encodeURIComponent(JSON.stringify(w.request))}&token=${w.token}`)
  const pts = d.default.timelineData
  return kws.map((k, i) => pts.reduce((s, p) => s + p.value[i], 0) / pts.length)
}
const groups = JSON.parse(process.argv[2])
await init()
const out = {}
for (const [anchor, list] of Object.entries(groups)) {
  for (let i = 0; i < list.length; i += 4) {
    const batch = [anchor, ...list.slice(i, i + 4)]
    const v = await compare(batch)
    batch.forEach((k, j) => { if (k !== anchor) out[k] = {anchor, rel: v[j] / v[0], raw: v[j], anchorRaw: v[0]} })
    console.log(batch.map((k, j) => `${k}=${v[j].toFixed(1)}`).join(' | '))
    await sleep(4000)
  }
}
writeFileSync(process.argv[3], JSON.stringify(out, null, 1))

// Submit all live site URLs to IndexNow (Bing, Copilot, Yandex, et al.).
// Run after publishing new/updated articles: node scripts/indexnow-ping.mjs
// Note: Google does NOT participate in IndexNow — use Search Console for Google.
import {execSync} from 'node:child_process'

const KEY = 'b6f55acadfc60822dff3c80335507fd9'
const HOST = 'www.realmlabs.app'

const urls = execSync(
  `curl -s https://${HOST}/sitemap-0.xml | grep -oE 'https://${HOST.replace(/\./g, '\\.')}/[^<]+' | sort -u`,
  {encoding: 'utf8'},
).split('\n').map((s) => s.trim()).filter(Boolean)

if (!urls.length) { console.error('No URLs found in sitemap'); process.exit(1) }

const payload = {host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls}
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: {'Content-Type': 'application/json; charset=utf-8'},
  body: JSON.stringify(payload),
})
console.log(`IndexNow: HTTP ${res.status} — submitted ${urls.length} URLs (200/202 = accepted)`)

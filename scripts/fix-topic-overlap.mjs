// One-off: resolve the baby-led-weaning keyword cannibalization and add
// contextual cross-links between overlapping MamaBee articles.
// Idempotent — safe to run twice (skips links/tags already applied).
// Run: node scripts/fix-topic-overlap.mjs
import {createClient} from '@sanity/client'
import {randomUUID} from 'node:crypto'
const client = createClient({projectId: '1jrna7ry', dataset: 'production', apiVersion: '2024-01-01', token: process.env.SANITY_WRITE_TOKEN, useCdn: false})
if (!process.env.SANITY_WRITE_TOKEN) { console.error('Missing SANITY_WRITE_TOKEN'); process.exit(1) }
const k = () => randomUUID().slice(0, 8)

// Build a single normal paragraph block containing one inline link.
function linkBlock(pre, linkText, href, post = '.') {
  const key = 'x' + k()
  return {
    _type: 'block', _key: k(), style: 'normal',
    markDefs: [{_key: key, _type: 'link', href}],
    children: [
      {_type: 'span', _key: k(), text: pre, marks: []},
      {_type: 'span', _key: k(), text: linkText, marks: [key]},
      {_type: 'span', _key: k(), text: post, marks: []},
    ],
  }
}

// Insert `block` immediately before the "Frequently asked questions" h2.
// Returns false (no-op) if a link to `href` already exists anywhere in body.
function insertBeforeFaq(body, block, href) {
  if (body.some(b => (b.markDefs || []).some(m => m.href === href))) return false
  const i = body.findIndex(b => b._type === 'block' && b.style === 'h2' &&
    (b.children || []).map(s => s.text).join('').toLowerCase().includes('frequently asked'))
  if (i === -1) body.push(block); else body.splice(i, 0, block)
  return true
}

// slug -> {id, tagToRemove?, crossLink:{pre,text,href,post}}
const fixes = [
  {id: 'mamabee-when-to-start-solids', removeTag: 'baby led weaning',
   link: ['New to baby-led weaning specifically? See our step-by-step ', 'baby-led weaning guide', '/mamabee/articles/baby-led-weaning', '.']},
  {id: 'drafts.mamabee-baby-led-weaning',
   link: ['Not sure your baby is ready yet? Start with ', 'when to start solids', '/mamabee/articles/when-to-start-solids', '.']},
  {id: 'drafts.mamabee-introducing-allergens-to-baby',
   link: ['For the bigger picture on first foods, see ', 'when to start solids', '/mamabee/articles/when-to-start-solids', '.']},
  {id: 'drafts.mamabee-newborn-hiccups',
   link: ['If it is gas rather than hiccups, see ', 'newborn gas relief', '/mamabee/articles/newborn-gas-relief', '.']},
  {id: 'drafts.mamabee-safe-sleep-guidelines',
   link: ['For a safe way to settle your baby to sleep, see ', 'how to swaddle a baby', '/mamabee/articles/how-to-swaddle-a-baby', '.']},
  {id: 'drafts.mamabee-dream-feed',
   link: ['For the full night-sleep picture, see the ', 'newborn sleep schedule', '/mamabee/articles/newborn-sleep-schedule', '.']},
]

for (const f of fixes) {
  const doc = await client.getDocument(f.id)
  if (!doc) { console.log(`✗ not found: ${f.id}`); continue }
  const body = [...(doc.body || [])]
  const patch = {}
  let changed = []

  if (f.removeTag) {
    const tags = (doc.tags || []).filter(t => t.toLowerCase().trim() !== f.removeTag)
    if (tags.length !== (doc.tags || []).length) { patch.tags = tags; changed.push(`-tag "${f.removeTag}"`) }
  }
  if (f.link) {
    const [pre, text, href, post] = f.link
    const added = insertBeforeFaq(body, linkBlock(pre, text, href, post), href)
    if (added) { patch.body = body; changed.push(`+link ${href}`) }
  }

  if (Object.keys(patch).length) {
    await client.patch(f.id).set(patch).commit()
    console.log(`✓ ${f.id}: ${changed.join(', ')}`)
  } else {
    console.log(`= ${f.id}: already fixed, no change`)
  }
}
console.log('\nDone.')

// Shared helper for localized MamaBee articles. Saves each article as a DRAFT with
// _id drafts.mamabee-<lang>-<slug> (so it never overwrites the English
// mamabee-<slug> doc) and copies the English article's cover when one exists.
// Body mini-syntax: "## " h2, "### " h3, "- " bullet, "> " quote, **bold**,
// [text](url), [[TABLE:key]], [[CTA||heading]].
import {createClient} from '@sanity/client'
import {randomUUID} from 'node:crypto'

export const client = createClient({projectId: '1jrna7ry', dataset: 'production', apiVersion: '2024-01-01', token: process.env.SANITY_WRITE_TOKEN, useCdn: false})
if (!process.env.SANITY_WRITE_TOKEN) { console.error('Missing SANITY_WRITE_TOKEN'); process.exit(1) }

const LANGS = ['zh-tw', 'zh-cn', 'ja', 'ko', 'pt-br']
const k = () => randomUUID().slice(0, 8)
function inline(text){const children=[],markDefs=[];const re=/\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;let last=0,m;const push=(t,marks=[])=>{if(t)children.push({_type:'span',_key:k(),text:t,marks})};while((m=re.exec(text))){push(text.slice(last,m.index));if(m[1]!==undefined)push(m[1],['strong']);else{const key='l'+markDefs.length;if(m[3]==='APP')markDefs.push({_key:key,_type:'appLink'});else markDefs.push({_key:key,_type:'link',href:m[3]});push(m[2],[key])}last=m.index+m[0].length}push(text.slice(last));return{children,markDefs}}
const block=(style,text,extra={})=>{const{children,markDefs}=inline(text);return{_type:'block',_key:k(),style,markDefs,children,...extra}}
const table=(t)=>({_type:'comparisonTable',_key:k(),...(t.caption?{caption:t.caption}:{}),headers:t.headers,rows:t.rows.map(cells=>({_type:'row',_key:k(),cells}))})
export function md(src,tables={}){const out=[];for(const raw of src.split('\n')){const line=raw.trim();if(!line)continue;if(line.startsWith('## '))out.push(block('h2',line.slice(3)));else if(line.startsWith('### '))out.push(block('h3',line.slice(4)));else if(line.startsWith('> '))out.push(block('blockquote',line.slice(2)));else if(line.startsWith('- '))out.push(block('normal',line.slice(2),{listItem:'bullet',level:1}));else if(line.startsWith('[[TABLE:')){const key=line.slice(8,line.indexOf(']]'));if(!tables[key])throw new Error('missing table: '+key);out.push(table(tables[key]))}else if(line.startsWith('[[CTA')){const[,,heading]=line.slice(2,-2).split('|');out.push({_type:'appCta',_key:k(),...(heading?{heading}:{})})}else out.push(block('normal',line))}return out}
export const A = (slug, title, description, tags, tables, body) => ({slug, title, description, tags, tables, body})

// CJK text has no spaces, so count characters for CJK and words for Latin text.
function size(body) {
  let cjk = 0, words = 0
  for (const b of body) if (b._type === 'block') for (const s of b.children || []) {
    const t = s.text || ''
    const c = (t.match(/[぀-ヿ㐀-鿿가-힯]/g) || []).length
    cjk += c
    words += t.replace(/[぀-ヿ㐀-鿿가-힯]/g, ' ').split(/\s+/).filter(Boolean).length
  }
  return {cjk, words}
}

export async function saveDrafts(lang, articles) {
  if (!LANGS.includes(lang)) throw new Error('bad lang ' + lang)
  for (const a of articles) {
    if (!/^[a-z0-9-]+$/.test(a.slug)) throw new Error('bad slug ' + a.slug)
    const body = md(a.body, a.tables)
    const en = await client.fetch('*[_id == $id][0]{coverImage}', {id: `mamabee-${a.slug}`})
    const doc = {
      _id: `drafts.mamabee-${lang}-${a.slug}`, _type: 'article', brand: 'mamabee', language: lang,
      title: a.title, slug: {_type: 'slug', current: a.slug}, description: a.description,
      author: 'Realm Labs', tags: a.tags, publishedAt: new Date().toISOString(), body,
      ...(en?.coverImage ? {coverImage: en.coverImage} : {}),
    }
    await client.createOrReplace(doc)
    const {cjk, words} = size(body)
    const tables = body.filter((b) => b._type === 'comparisonTable').length
    const faqs = body.filter((b) => b.style === 'h3').length
    console.log(`draft ${lang}/${a.slug}: ${cjk ? cjk + ' CJK chars, ' : ''}${words} words, ${tables} tables, ${faqs} h3, title ${a.title.length}c, desc ${a.description.length}c, cover ${en?.coverImage ? 'copied from EN' : 'NEEDED'}`)
  }
  console.log('\nDone — DRAFTS only. Nothing is live.')
}

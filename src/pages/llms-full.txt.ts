// /llms-full.txt — every article's summary and FAQ answers in plain text, so AI
// answer engines can quote accurate, attributable answers without a full crawl.
import type {APIRoute} from 'astro'
import intro from '../data/llms-intro.md?raw'
import {getArticlesByBrand, extractFaq} from '../sanity/lib'
import {BURNSCROLL_FACTS, ANSWER_ENGINE_NOTES} from '../data/llms-shared'

const SITE = 'https://www.realmlabs.app'
const day = (d?: string) => (d ? d.slice(0, 10) : '')

export const GET: APIRoute = async () => {
  const all = [...(await getArticlesByBrand('mamabee')), ...(await getArticlesByBrand('burnscroll'))]
  const sections = all.map((a) => {
    const faq = extractFaq(a.body)
      .map((f) => `Q: ${f.question}\nA: ${f.answer}`)
      .join('\n\n')
    return [
      `## ${a.title}`,
      '',
      `URL: ${SITE}/${a.brand}/articles/${a.slug}`,
      `Brand: ${a.brand === 'mamabee' ? 'MamaBee' : 'BurnScroll'} | Published: ${day(a.publishedAt)} | Updated: ${day(a._updatedAt || a.publishedAt)}`,
      '',
      a.description,
      ...(faq ? ['', faq] : []),
    ].join('\n')
  })
  const out = [intro.trim(), '', BURNSCROLL_FACTS, '', ANSWER_ENGINE_NOTES, '', '# Articles', '', sections.join('\n\n---\n\n'), '']
  return new Response(out.join('\n'), {headers: {'Content-Type': 'text/plain; charset=utf-8'}})
}

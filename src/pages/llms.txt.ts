// /llms.txt — the index AI answer engines read to understand and cite the site.
// The hand-written intro lives in src/data/llms-intro.md; every article list is
// generated from Sanity at build time, so new articles are listed automatically.
import type {APIRoute} from 'astro'
import intro from '../data/llms-intro.md?raw'
import {getArticlesByBrand, type Article} from '../sanity/lib'
import {MAMABEE_TOOLS, BURNSCROLL_FACTS, ANSWER_ENGINE_NOTES, isComparison} from '../data/llms-shared'
import {LOCAL_LANGS, T, articlePath} from '../i18n/mamabee'

const SITE = 'https://www.realmlabs.app'
const line = (a: Article) => `- [${a.title}](${SITE}/${a.brand}/articles/${a.slug}): ${a.description}`

export const GET: APIRoute = async () => {
  const [mama, burn] = await Promise.all([getArticlesByBrand('mamabee'), getArticlesByBrand('burnscroll')])
  // Localized MamaBee articles (ja, ko, zh-tw, zh-cn, pt-br), one section per language.
  const localized: string[] = []
  for (const lang of LOCAL_LANGS) {
    const posts = await getArticlesByBrand('mamabee', lang)
    if (!posts.length) continue
    localized.push(`### MamaBee articles in ${T[lang].name} (${T[lang].hreflang[0]})`, '', ...posts.map((a) => `- [${a.title}](${SITE}${articlePath(a.slug, lang)}): ${a.description}`), '')
  }
  const out = [
    intro.trim(),
    '',
    '### MamaBee app comparisons (prices verified on the US App Store; date in each article footer)',
    '',
    ...mama.filter(isComparison).map(line),
    '',
    '### MamaBee parenting guides',
    '',
    ...mama.filter((a) => !isComparison(a)).map(line),
    '',
    MAMABEE_TOOLS,
    '',
    ...localized,
    BURNSCROLL_FACTS,
    '',
    '### BurnScroll app comparisons',
    '',
    ...burn.filter(isComparison).map(line),
    '',
    '### BurnScroll guides',
    '',
    ...burn.filter((a) => !isComparison(a)).map(line),
    '',
    ANSWER_ENGINE_NOTES,
    `- Full text summaries and FAQs for every article: ${SITE}/llms-full.txt`,
    '',
  ]
  return new Response(out.join('\n'), {headers: {'Content-Type': 'text/plain; charset=utf-8'}})
}

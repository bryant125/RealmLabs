// MamaBee article languages. English lives at /mamabee/articles/<slug> (unchanged);
// every other language lives at /mamabee/<lang>/articles/<slug>. Translations of the
// same article share the same English slug, which is how hreflang alternates are
// matched. Add a language here, then publish Sanity articles with `language` set.

export type Lang = 'en' | 'zh-tw' | 'zh-cn' | 'ja' | 'ko' | 'pt-br'
export const LANGS: Lang[] = ['en', 'zh-tw', 'zh-cn', 'ja', 'ko', 'pt-br']
export const LOCAL_LANGS = LANGS.filter((l) => l !== 'en') as Exclude<Lang, 'en'>[]

type Strings = {
  name: string // shown in language pickers, in its own language
  htmlLang: string
  hreflang: string[] // first is primary; extras cover sibling markets (pt -> Portugal)
  ogLocale: string
  appStore: string // App Store storefront country code
  dateLocale: string
  journal: string
  by: string
  updated: string
  minRead: (n: number) => string
  keepReading: string
  readNext: string
  allArticles: string
  getApp: string
  nav: {how: string; features: string; ai: string; faq: string; tools: string; articles: string}
  bannerTitle: string
  bannerSub: string
  bannerBadgeSmall: string
  indexTitle: string
  indexH1: string
  indexDescription: string
  empty: string
  alsoIn: string
  footerTag: string
  footerDownload: string
  footerArticles: string
  disclaimer: string
  foot: {explore: string; guides: string; company: string; legal: string; tryFree: string; features: string; contact: string; support: string; privacy: string; terms: string; bottom: string}
}

export const T: Record<Lang, Strings> = {
  en: {
    name: 'English', htmlLang: 'en', hreflang: ['en'], ogLocale: 'en_US', appStore: 'us', dateLocale: 'en-US',
    journal: 'MamaBee Journal', by: 'By', updated: 'Updated', minRead: (n) => `${n} min read`,
    keepReading: 'Keep reading', readNext: 'Read next →', allArticles: '← All MamaBee articles', getApp: 'Get the app',
    nav: {how: 'How it works', features: 'Features', ai: 'AI', faq: 'FAQ', tools: 'Free tools', articles: 'Articles'},
    bannerTitle: 'MamaBee is now available', bannerSub: 'Download free on the App Store and let your phone do the 3 AM feed-and-nap math.', bannerBadgeSmall: 'Download on the',
    indexTitle: 'MamaBee Journal — Calm parenting & baby-tracking articles',
    indexH1: 'Calm parenting, one honeyed article at a time',
    indexDescription: 'Gentle, practical articles on newborn sleep, feeding, and calm parenting from the MamaBee team.',
    empty: 'No articles yet — the first one is on its way. 🐝', alsoIn: 'Also available in',
    footerTag: 'Track every little moment, gently. The honey-warm baby tracker — made with 🍯 by Realm Labs Studio.',
    footerDownload: 'Download on the App Store', footerArticles: 'Articles',
    disclaimer: 'This article is general information, not medical advice.',
    foot: {explore: 'Explore', guides: 'Popular guides', company: 'Company', legal: 'Legal', tryFree: 'Try it free', features: 'Features', contact: 'Contact', support: 'Support', privacy: 'Privacy', terms: 'Terms', bottom: 'Made with 🍯 for tired parents everywhere'},
  },
  'zh-tw': {
    name: '繁體中文', htmlLang: 'zh-Hant-TW', hreflang: ['zh-TW', 'zh-HK'], ogLocale: 'zh_TW', appStore: 'tw', dateLocale: 'zh-TW',
    journal: 'MamaBee 育兒專欄', by: '作者', updated: '更新於', minRead: (n) => `閱讀約 ${n} 分鐘`,
    keepReading: '延伸閱讀', readNext: '繼續閱讀 →', allArticles: '← 所有 MamaBee 文章', getApp: '下載 App',
    nav: {how: '使用方式', features: '功能', ai: 'AI', faq: '常見問題', tools: '免費工具', articles: '文章'},
    bannerTitle: 'MamaBee 現已上架', bannerSub: '在 App Store 免費下載，凌晨 3 點的餵奶與小睡記錄交給手機。', bannerBadgeSmall: '下載自',
    indexTitle: 'MamaBee 育兒專欄｜寶寶紀錄與新手爸媽指南',
    indexH1: '溫柔育兒，從一篇好文章開始',
    indexDescription: 'MamaBee 團隊為新手爸媽整理的實用文章：寶寶睡眠、餵奶、尿布、成長與育兒 App 比較。',
    empty: '文章即將上線，敬請期待。🐝', alsoIn: '其他語言版本',
    footerTag: '溫柔記錄寶寶的每個小時刻。Realm Labs Studio 用心打造的寶寶紀錄 App。',
    footerDownload: '在 App Store 下載', footerArticles: '文章',
    disclaimer: '本文僅供一般參考，不構成醫療建議。',
    foot: {explore: '探索', guides: '最新文章', company: '關於我們', legal: '法律條款', tryFree: '免費試用', features: '功能', contact: '聯絡我們', support: '客服支援', privacy: '隱私權政策', terms: '服務條款', bottom: '用 🍯 為每一位疲憊的爸媽打造'},
  },
  'zh-cn': {
    name: '简体中文', htmlLang: 'zh-Hans-CN', hreflang: ['zh-CN', 'zh-SG', 'zh-MY'], ogLocale: 'zh_CN', appStore: 'cn', dateLocale: 'zh-CN',
    journal: 'MamaBee 育儿专栏', by: '作者', updated: '更新于', minRead: (n) => `阅读约 ${n} 分钟`,
    keepReading: '延伸阅读', readNext: '继续阅读 →', allArticles: '← 所有 MamaBee 文章', getApp: '下载 App',
    nav: {how: '使用方式', features: '功能', ai: 'AI', faq: '常见问题', tools: '免费工具', articles: '文章'},
    bannerTitle: 'MamaBee 现已上线', bannerSub: '在 App Store 免费下载，凌晨 3 点的喂奶和小睡记录交给手机。', bannerBadgeSmall: '下载自',
    indexTitle: 'MamaBee 育儿专栏｜宝宝记录与新手爸妈指南',
    indexH1: '温柔育儿，从一篇好文章开始',
    indexDescription: 'MamaBee 团队为新手爸妈整理的实用文章：宝宝睡眠、喂奶、尿布、生长发育与育儿 App 对比。',
    empty: '文章即将上线，敬请期待。🐝', alsoIn: '其他语言版本',
    footerTag: '温柔记录宝宝的每个小时刻。Realm Labs Studio 用心打造的宝宝记录 App。',
    footerDownload: '在 App Store 下载', footerArticles: '文章',
    disclaimer: '本文仅供一般参考，不构成医疗建议。',
    foot: {explore: '探索', guides: '最新文章', company: '关于我们', legal: '法律条款', tryFree: '免费试用', features: '功能', contact: '联系我们', support: '客服支持', privacy: '隐私政策', terms: '服务条款', bottom: '用 🍯 为每一位疲惫的爸妈打造'},
  },
  ja: {
    name: '日本語', htmlLang: 'ja', hreflang: ['ja'], ogLocale: 'ja_JP', appStore: 'jp', dateLocale: 'ja-JP',
    journal: 'MamaBee 育児コラム', by: '執筆', updated: '更新', minRead: (n) => `約${n}分で読めます`,
    keepReading: 'あわせて読みたい', readNext: '続きを読む →', allArticles: '← MamaBee の記事一覧', getApp: 'アプリを入手',
    nav: {how: '使い方', features: '機能', ai: 'AI', faq: 'よくある質問', tools: '無料ツール', articles: '記事'},
    bannerTitle: 'MamaBee 配信中', bannerSub: 'App Store から無料でダウンロード。深夜 3 時の授乳とねんねの記録はスマホにおまかせ。', bannerBadgeSmall: 'ダウンロード',
    indexTitle: 'MamaBee 育児コラム｜育児記録と赤ちゃんのお世話ガイド',
    indexH1: 'やさしい育児を、ひとつずつ',
    indexDescription: 'MamaBee チームがお届けする、授乳・ねんね・おむつ・成長の記録と育児アプリ比較の実用ガイド。',
    empty: '記事は近日公開予定です。🐝', alsoIn: 'ほかの言語で読む',
    footerTag: '赤ちゃんの小さな毎日を、やさしく記録。Realm Labs Studio が作る育児記録アプリ。',
    footerDownload: 'App Store でダウンロード', footerArticles: '記事',
    disclaimer: 'この記事は一般的な情報であり、医療上のアドバイスではありません。',
    foot: {explore: 'メニュー', guides: '新着記事', company: '運営会社', legal: '規約', tryFree: '無料で試す', features: '機能', contact: 'お問い合わせ', support: 'サポート', privacy: 'プライバシーポリシー', terms: '利用規約', bottom: '毎日がんばるパパ・ママのために 🍯 を込めて'},
  },
  ko: {
    name: '한국어', htmlLang: 'ko', hreflang: ['ko'], ogLocale: 'ko_KR', appStore: 'kr', dateLocale: 'ko-KR',
    journal: 'MamaBee 육아 매거진', by: '작성', updated: '업데이트', minRead: (n) => `${n}분 분량`,
    keepReading: '함께 읽어보세요', readNext: '이어서 읽기 →', allArticles: '← MamaBee 전체 글', getApp: '앱 받기',
    nav: {how: '사용 방법', features: '기능', ai: 'AI', faq: '자주 묻는 질문', tools: '무료 도구', articles: '글'},
    bannerTitle: 'MamaBee 출시', bannerSub: 'App Store에서 무료로 받고, 새벽 3시 수유·낮잠 기록은 휴대폰에 맡기세요.', bannerBadgeSmall: '다운로드',
    indexTitle: 'MamaBee 육아 매거진 | 육아 기록과 신생아 돌봄 가이드',
    indexH1: '다정한 육아, 한 편씩',
    indexDescription: 'MamaBee 팀이 전하는 수유, 수면, 기저귀, 성장 기록과 육아 앱 비교 실전 가이드.',
    empty: '첫 글이 곧 올라옵니다. 🐝', alsoIn: '다른 언어로 보기',
    footerTag: '아기의 작은 순간을 다정하게 기록하세요. Realm Labs Studio가 만든 육아 기록 앱.',
    footerDownload: 'App Store에서 다운로드', footerArticles: '글',
    disclaimer: '이 글은 일반적인 정보이며 의학적 조언이 아닙니다.',
    foot: {explore: '둘러보기', guides: '최신 글', company: '회사', legal: '약관', tryFree: '무료 체험', features: '기능', contact: '문의하기', support: '고객 지원', privacy: '개인정보 처리방침', terms: '이용약관', bottom: '지친 모든 부모님을 위해 🍯 을 담아 만들었어요'},
  },
  'pt-br': {
    name: 'Português', htmlLang: 'pt-BR', hreflang: ['pt-BR', 'pt'], ogLocale: 'pt_BR', appStore: 'br', dateLocale: 'pt-BR',
    journal: 'Diário MamaBee', by: 'Por', updated: 'Atualizado em', minRead: (n) => `${n} min de leitura`,
    keepReading: 'Continue lendo', readNext: 'Ler a seguir →', allArticles: '← Todos os artigos MamaBee', getApp: 'Baixar o app',
    nav: {how: 'Como funciona', features: 'Recursos', ai: 'IA', faq: 'Perguntas', tools: 'Ferramentas grátis', articles: 'Artigos'},
    bannerTitle: 'MamaBee já está disponível', bannerSub: 'Baixe grátis na App Store e deixe o celular cuidar das contas de mamadas e sonecas às 3 da manhã.', bannerBadgeSmall: 'Baixar na',
    indexTitle: 'Diário MamaBee | Guias de rotina e registro do bebê',
    indexH1: 'Maternidade tranquila, um artigo de cada vez',
    indexDescription: 'Guias práticos da equipe MamaBee sobre sono, mamadas, fraldas, crescimento do bebê e comparações de apps.',
    empty: 'O primeiro artigo chega em breve. 🐝', alsoIn: 'Também disponível em',
    footerTag: 'Registre cada momentinho com carinho. O app de rotina do bebê da Realm Labs Studio.',
    footerDownload: 'Baixar na App Store', footerArticles: 'Artigos',
    disclaimer: 'Este artigo é informação geral, não aconselhamento médico.',
    foot: {explore: 'Explorar', guides: 'Artigos recentes', company: 'Empresa', legal: 'Legal', tryFree: 'Teste grátis', features: 'Recursos', contact: 'Contato', support: 'Suporte', privacy: 'Privacidade', terms: 'Termos', bottom: 'Feito com 🍯 para pais cansados do mundo todo'},
  },
}

export const isLang = (x: unknown): x is Lang => typeof x === 'string' && (LANGS as string[]).includes(x)
export const normLang = (x: unknown): Lang => (isLang(x) ? x : 'en')

export const appStoreUrl = (lang: Lang = 'en') =>
  `https://apps.apple.com/${T[lang].appStore}/app/mamabee-baby-tracker/id6773179521`

export const articlesPath = (lang: Lang = 'en') => (lang === 'en' ? '/mamabee/articles' : `/mamabee/${lang}/articles`)
export const articlePath = (slug: string, lang: Lang = 'en') => `${articlesPath(lang)}/${slug}`

// FAQ section headings in every language, for FAQPage schema extraction.
export const FAQ_HEADING = /frequently asked questions|よくある質問|자주 묻는 질문|常見問題|常见问题|perguntas frequentes/i

// hreflang <link> list for a page available in `langs` (x-default -> English if present).
export function hreflangLinks(slugOrNull: string | null, langs: Lang[], site = 'https://www.realmlabs.app') {
  const href = (l: Lang) => site + (slugOrNull ? articlePath(slugOrNull, l) : articlesPath(l))
  const out: {hreflang: string; href: string}[] = []
  for (const l of langs) for (const h of T[l].hreflang) out.push({hreflang: h, href: href(l)})
  out.push({hreflang: 'x-default', href: href(langs.includes('en') ? 'en' : langs[0])})
  return out
}

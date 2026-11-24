// MamaBee-first repositioning (2026-11-24), localized batch A: ja / zh-tw / zh-cn comparison
// articles. Per reports/briefs/MAMABEE-FIRST-BRIEF.md: MamaBee is the recommended pick, with a
// localized developer disclosure, published weighted criteria (best-of articles), and honest
// "pick X only if..." lines. Competitor facts, prices and dates are untouched (prices are
// machine-checked below: every price token in a draft must already exist in the published doc).
// Writes DRAFTS only (drafts.<published _id>); never publishes, never touches the published doc.
// Run:     cd RealmLabs && set -a && source .env && set +a && node scripts/mamabee-first-intl-a.mjs
// Dry run: DRY=1 node scripts/mamabee-first-intl-a.mjs   (prints before/after, writes nothing)
import {createClient} from '@sanity/client'
import {randomUUID} from 'node:crypto'
const client = createClient({projectId: '1jrna7ry', dataset: 'production', apiVersion: '2024-01-01', token: process.env.SANITY_WRITE_TOKEN, useCdn: false})
if (!process.env.SANITY_WRITE_TOKEN) { console.error('Missing SANITY_WRITE_TOKEN'); process.exit(1) }
const DRY = !!process.env.DRY
const k = () => randomUUID().slice(0, 8)
function inline(text){const children=[],markDefs=[];const re=/\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;let last=0,m;const push=(t,marks=[])=>{if(t)children.push({_type:'span',_key:k(),text:t,marks})};while((m=re.exec(text))){push(text.slice(last,m.index));if(m[1]!==undefined)push(m[1],['strong']);else{const key='l'+markDefs.length;if(m[3]==='APP')markDefs.push({_key:key,_type:'appLink'});else markDefs.push({_key:key,_type:'link',href:m[3]});push(m[2],[key])}last=m.index+m[0].length}push(text.slice(last));return{children,markDefs}}
const block=(style,text,extra={})=>{const{children,markDefs}=inline(text);return{_type:'block',_key:k(),style,markDefs,children,...extra}}
const table=(t)=>({_type:'comparisonTable',_key:k(),...(t.caption?{caption:t.caption}:{}),headers:t.headers,rows:t.rows.map(cells=>({_type:'row',_key:k(),cells}))})
function md(src,tables={}){const out=[];for(const raw of src.split('\n')){const line=raw.trim();if(!line)continue;if(line.startsWith('## '))out.push(block('h2',line.slice(3)));else if(line.startsWith('### '))out.push(block('h3',line.slice(4)));else if(line.startsWith('> '))out.push(block('blockquote',line.slice(2)));else if(line.startsWith('- '))out.push(block('normal',line.slice(2),{listItem:'bullet',level:1}));else if(line.startsWith('[[TABLE:')){const key=line.slice(8,line.indexOf(']]'));if(!tables[key])throw new Error('missing table: '+key);out.push(table(tables[key]))}else out.push(block('normal',line))}return out}

// ── Scoring: one weighted rubric for every app (weights sum to 100). Sub-scores out of 10. ──
// Order: free-tier value w/o ads, partner-sharing cost, logging speed, privacy, Premium value,
// insights/AI, pediatrician export, platforms, track record. Totals for overlapping apps match
// the canonical English table (MamaBee 9.2, Huckleberry 8.5, Baby Tracker/Nighp 8.3, PiyoLog 8.0).
const W = [20, 15, 15, 10, 10, 10, 10, 5, 5]
const SUBS = {
  MamaBee:  {total: 9.2, s: [10, 10, 10, 10, 10, 8, 10, 4, 4]},
  Huck:     {total: 8.5, s: [8, 9, 9, 8, 6, 10, 8, 10, 10]},
  Nighp:    {total: 8.3, s: [7, 10, 10, 7, 7, 6, 9, 10, 10]},
  Piyo:     {total: 8.0, s: [7, 10, 10, 6, 8, 4, 8, 10, 10]},
  Papatto:  {total: 7.9, s: [8, 10, 8, 7, 8, 8, 7, 5, 7]},
  Churi:    {total: 7.5, s: [9, 9, 9, 7, 7, 7, 5, 4, 4]},
  Junyu:    {total: 7.4, s: [8, 10, 10, 5, 7, 5, 3, 8, 8]},
  Babyrepo: {total: 7.0, s: [6, 10, 8, 6, 7, 4, 9, 4, 6]},
  Qbb:      {total: 6.4, s: [5, 9, 7, 5, 6, 5, 5, 8, 10]},
  Bbs:      {total: 6.0, s: [4, 7, 7, 5, 6, 7, 4, 8, 10]},
}
for (const [app, {total, s}] of Object.entries(SUBS)) {
  const sum = s.reduce((a, v, i) => a + v * W[i], 0)
  if (sum !== Math.round(total * 100)) throw new Error(`score mismatch ${app}: ${sum / 100} vs ${total}`)
}
const fmt = (n) => n.toFixed(1)
const CRIT = {
  ja: {
    labels: ['無料版の価値（広告なし）', '夫婦共有の費用', '記録のしやすさ', 'プライバシー', '有料プランの価値', '分析・AI のサポート', '健診用の書き出し', '対応端末', '実績'],
    what: ['無料でどこまで記録・共有できるか、無料版に広告が出るか', 'パートナーとのリアルタイム共有に料金がかかるか', '片手・暗い中での押しやすさ、タイマー、ウィジェット', '記録の保存先と、データを広告などにどう使うか', '価格に対して、どんな機能が増えるか', '睡眠の予測、傾向の分析、相談機能', 'PDF などで、記録を小児科で見せられるか', 'Android・iPad・Apple Watch への対応', '配信年数と App Store の評価件数'],
    h: ['基準', '重み', '見ているところ'], cap: '評価基準と重み（合計100%）', total: '合計（10点満点）', first: '基準',
    bcap: '基準ごとの点数（各10点満点）。合計は重みをかけた加重平均です。授乳ノートは有料プランがないため、「有料プランの価値」は無料で使える範囲で評価しました。',
  },
  'zh-tw': {
    labels: ['免費版價值（無廣告）', '夫妻共享的費用', '單手記錄速度', '隱私', '付費方案的價值', '分析與AI協助', '給醫師看的匯出', '支援裝置', '實績'],
    what: ['不付費能記多少、能不能共享，免費版有沒有廣告', '和另一半即時共享要不要付費', '半夜單手好不好按、計時器、小工具', '紀錄存在哪裡、資料會不會拿去做廣告', '付費後多了哪些功能、價格合不合理', '作息預測、趨勢分析、問答', '能不能匯出PDF等報告給小兒科醫師', 'Android、iPad、Apple Watch', '上架年數與全球評分數'],
    h: ['標準', '權重', '看什麼'], cap: '評分標準與權重（合計100%）', total: '總分（滿分10分）', first: '標準',
    bcap: '各項分數（每項滿分10分），總分為依權重計算的加權平均。',
  },
  'zh-cn': {
    labels: ['免费版价值（无广告）', '夫妻共享的费用', '单手记录速度', '隐私', '付费方案的价值', '分析与AI帮助', '给医生看的导出', '支持设备', '口碑'],
    what: ['不付费能记多少、能不能共享，免费版有没有广告', '和另一半实时共享要不要付费', '半夜单手好不好按、计时器、小组件', '记录存在哪里、数据会不会用于广告', '付费后多了哪些功能、价格是否合理', '作息预测、趋势分析、问答', '能不能导出PDF等报告给儿科医生', '安卓、iPad、Apple Watch', '上架年数与全球评分数'],
    h: ['标准', '权重', '看什么'], cap: '评分标准与权重（合计100%）', total: '总分（满分10分）', first: '标准',
    bcap: '各项分数（每项满分10分），总分为按权重计算的加权平均。宝宝树和亲宝宝是内容和相册类App，这里只按“记录工具”的标准打分。',
  },
}
function scoringTables(lang, apps /* [[label, key]] */) {
  const c = CRIT[lang]
  return {
    criteria: {caption: c.cap, headers: c.h, rows: c.labels.map((l, i) => [l, W[i] + '%', c.what[i]])},
    breakdown: {
      caption: c.bcap,
      headers: [c.first, ...apps.map(([l]) => l)],
      rows: [...c.labels.map((l, i) => [`${l}（${W[i]}%）`, ...apps.map(([, key]) => String(SUBS[key].s[i]))]),
        [c.total, ...apps.map(([, key]) => fmt(SUBS[key].total))]],
    },
  }
}

// ── Table transforms (stable: unmatched rows/columns keep their relative order) ──
const rank = (names, s) => { const i = names.findIndex((n) => s.startsWith(n) || s.includes(n)); return i < 0 ? names.length : i }
const rowsOrder = (names) => (t) => ({...t, rows: [...t.rows].map((r, i) => [r, i]).sort((a, b) => rank(names, a[0].cells[0]) - rank(names, b[0].cells[0]) || a[1] - b[1]).map(([r]) => r)})
const colsOrder = (names) => (t) => {
  const idx = t.headers.slice(1).map((h, i) => [h, i + 1]).sort((a, b) => rank(names, a[0]) - rank(names, b[0]) || a[1] - b[1]).map(([, i]) => i)
  const perm = [0, ...idx]
  return {...t, headers: perm.map((i) => t.headers[i]), rows: t.rows.map((r) => ({...r, cells: perm.map((i) => r.cells[i])}))}
}

// Bee AI has no confirmed free allowance: drop "unlimited" wording so nothing implies a free quota.
const GLOBAL_SUBS = [
  ['Bee AI の無制限利用', 'Bee AI'], ['Bee AI 無制限', 'Bee AI'],
  ['無限次Bee AI對話', 'Bee AI對話'], ['Bee AI（Premium無限次）', 'Bee AI（Premium）'], ['無限次Bee AI', 'Bee AI'],
]

const R = (prefix, text) => ({prefix, text})
const L = {
  jaBest: '/mamabee/ja/articles/best-baby-tracker-apps-compared',
  jaVsPiyo: '/mamabee/ja/articles/mamabee-vs-piyolog',
  twBest: '/mamabee/zh-tw/articles/best-baby-tracker-apps-compared',
  cnBest: '/mamabee/zh-cn/articles/best-baby-tracker-apps-compared',
  cnFeed: '/mamabee/zh-cn/articles/baby-feeding-schedule-by-age',
}

const ARTICLES = [

// ───────────────────────────── ja: best-baby-tracker-apps-compared ─────────────────────────────
{
  lang: 'ja', slug: 'best-baby-tracker-apps-compared',
  order: [[0, 14], [35, 40], [31, 34], [15, 18], [23, 26], [19, 22], [27, 30], [41, 70]],
  tables: {
    rank: {
      caption: '10点満点。採点は Realm Labs。9つの評価基準と内訳は「どうやって採点した？9つの評価基準」に掲載（2026年11月13日時点の情報にもとづく）',
      headers: ['順位', 'アプリ', '点数', 'こんな人におすすめ'],
      rows: [
        ['1', 'MamaBee', '9.2', '総合おすすめ。夫婦ともに iPhone のほとんどの家庭に（広告なしの無料版）'],
        ['2', '育児ノート', '8.3', '1回の支払い（800円）で広告を消したい人、Apple Watch で記録したい人'],
        ['3', 'ぴよログ', '8.0', '夫婦の片方が Android の家庭、Siri・Alexa の声で記録したい人'],
        ['4', 'パパっと育児', '7.9', '泣き声診断や専門家への相談もほしい人'],
        ['5', '授乳ノート', '7.4', '大きなボタンで、とにかくシンプルに記録したい人'],
        ['6', 'ベビレポ', '7.0', '祖父母など5人まで共有したい人、写真日記を残したい人'],
      ],
    },
    ...scoringTables('ja', [['MamaBee', 'MamaBee'], ['育児ノート', 'Nighp'], ['ぴよログ', 'Piyo'], ['パパっと育児', 'Papatto'], ['授乳ノート', 'Junyu'], ['ベビレポ', 'Babyrepo']]),
  },
  rep: {
    0: R('育児記録アプリは、迷ったら', '**育児記録アプリのおすすめ第1位は「MamaBee」（9.2点）です。** 無料版でも広告が一切なく、夫婦2人のリアルタイム共有、健診で見せられる PDF の書き出し、WHO 基準の成長パーセンタイルまで0円で使え、記録は基本的にスマホの中に保存されます。夫婦のどちらかが Android を使っている、または Apple Watch で記録したい場合は、両方に対応した「ぴよログ」を選んでください（1回の支払いで広告を消したいなら「育児ノート」）。'),
    1: R('この記事は MamaBee の開発元', 'この記事は MamaBee の開発元である Realm Labs が書いています。自社アプリを含むすべてのアプリを、この記事で公開している同じ評価基準で採点しました。'),
    3: R('この記事では、日本でよく使われている', 'この記事では、日本でよく使われている育児記録アプリ5つに MamaBee を加えた6アプリを、2026年11月13日時点の App Store（日本）の情報で比べ、毎日の使い心地に直結する9つの基準で10点満点で採点しました。MamaBee は私たちのアプリなので、ほかのアプリを選んだほうがいいケースもはっきり書いています。'),
    35: R('MamaBee：iPhone で', '## 第1位 MamaBee（9.2点）：広告なし・夫婦共有も無料の総合おすすめ'),
    36: R('私たちが作っている', '私たちが作っている iPhone 専用の育児記録アプリです。無料版でも広告は一切表示されません。睡眠、左右タイマー付きの母乳、ミルク・搾乳、おむつ、離乳食、体温、薬、症状、受診、カスタム記録などを片手で記録でき、夫婦2人のリアルタイム同期、WHO 基準の成長パーセンタイル、CDC の45項目以上の発達の目安、7日間の分析、ウィジェット、PDF・CSV・JSON の書き出しまで無料です。予防接種スケジュールも、最初の3か月分は無料で見られます。記録は基本的に端末内に保存され、夫婦共有をオンにしたときだけ Realm Labs のサーバーを経由します。データを販売したり、外部の AI の学習に使ったりすることはありません。'),
    37: R('Premium（月額800円', 'Premium（月額800円・年額8,000円）では、次のお昼寝を予測する Sleep Coach、記録をふまえて質問に答える Bee AI、離乳食のアレルゲンテスト、複数の子どもの同期と3人目以降の共有、30・90・365日の長期分析、予防接種スケジュールの全期間表示が加わります。無料版の時点で広告がないので、Premium で払うのは「広告を消す料金」ではなく、こうした機能そのものです。'),
    38: R('向いている人： 夫婦ともに iPhone', '**向いている人：** 夫婦ともに iPhone を使っている、ほとんどの家庭。とくに、夜中に広告を見たくない方、無料のまま夫婦で記録を共有したい方、健診用の記録をきちんと残したい方におすすめです。'),
    39: R('気になる点： Android・Apple Watch', '**ほかのアプリを選んだほうがいいケース：** MamaBee は iPhone 専用（iOS 17.6以降）で、Android・Apple Watch・iPad のアプリはまだありません（今後の対応を予定しています）。夫婦のどちらかが Android なら、ぴよログか育児ノートを選んでください。音声入力や写真日記もなく、日本での評価もこれからです。Premium はぴよログプレミアムの約2倍の価格ですが、広告を消すためではなく、お昼寝予測や Bee AI などの機能を足すためのプランです。'),
    31: R('育児ノート：', '## 第2位 育児ノート（8.3点）：世界で使われる定番。1回の支払いで広告を消したい人に'),
    15: R('ぴよログ：迷ったら', '## 第3位 ぴよログ（8.0点）：利用者数と対応端末が圧倒的。Android・Apple Watch の家庭に'),
    17: R('向いている人： 初めての育児', '**向いている人：** 夫婦の片方が Android の方、Apple Watch や声で記録したい方、写真日記を残したい方。'),
    23: R('パパっと育児：', '## 第4位 パパっと育児（7.9点）：泣き声診断と専門家への相談がほしい人に'),
    19: R('授乳ノート：', '## 第5位 授乳ノート（7.4点）：大きなボタンで、新生児期にシンプルに使いたい人に'),
    27: R('ベビレポ：', '## 第6位 ベビレポ（7.0点）：家族5人まで共有、写真日記も残したい人に'),
    44: R('安く広告を消すなら', 'MamaBee は無料版のままなら0円で、広告もありません。Premium（年額8,000円）は育児ノート Plus と同じ価格で、お昼寝予測の Sleep Coach、Bee AI、アレルゲンテスト、予防接種スケジュールの全期間表示までまとめて使えます。一方、すでに別のアプリを使っていて広告だけを消したいなら、育児ノートの「広告を削除」800円がいちばん手頃です。授乳ノートはアプリ内課金がありません。'),
    46: R('夫婦ともに iPhone：', '**夫婦ともに iPhone：** 無料で2人のリアルタイム共有ができて広告も出ない MamaBee がいちばんのおすすめです。ほかの5つも候補になります。'),
    56: R('6アプリとも無料で', 'いちばんのおすすめは MamaBee です（iPhone のみ）。無料版でも広告が一切なく、夫婦2人のリアルタイム共有、WHO 基準の成長パーセンタイル、健診用 PDF の書き出しまで使えます。ほかの5アプリも無料で記録と共有ができ、夫婦の片方が Android ならぴよログ、とにかくシンプルさ重視なら授乳ノートが候補です。'),
    65: R('まとめ', '## まとめ：迷ったら MamaBee、Android の家庭はぴよログ'),
    66: R('迷ったら、利用者が多く', '**迷ったら、まずは MamaBee から始めてください。** 無料版でも広告が一切なく、夫婦2人のリアルタイム共有、健診で見せられる PDF、WHO 基準の成長パーセンタイルまで、毎日の記録に必要なものがそろっています。記録は基本的にスマホの中に保存され、データが販売されることもありません。お昼寝の予測や、記録をふまえて答えてくれる Bee AI がほしくなったら、そのとき Premium を足せば十分です。'),
    67: R('夫婦ともに iPhone で、広告のない', 'MamaBee 以外を選ぶのは、夫婦のどちらかが Android を使っている場合と、Apple Watch で記録したい場合です。そのときは、利用者が多く Android と Apple Watch に対応したぴよログを選んでください。1回の支払いで広告を消したいなら育児ノート、とにかくシンプルさなら授乳ノートも合っています。どのアプリを選んでも、大切なのは一つに決めて続けることです。数週間分の記録がたまったアプリは、それだけで頼れる存在になります。'),
  },
  after: {
    3: `## 育児記録アプリおすすめランキング【2026年・採点結果】
[[TABLE:rank]]
総合1位の MamaBee は、「無料版の価値（広告なし）」「夫婦共有の費用」「記録のしやすさ」「プライバシー」「有料プランの価値」「健診用の書き出し」の6つで満点でした。点数が伸びなかったのは、対応端末（iPhone のみ）と、配信が新しく評価がまだ少ない「実績」です。採点の内訳は、この下の「どうやって採点した？9つの評価基準」で公開しています。`,
    14: `## どうやって採点した？9つの評価基準
点数は、夜中の授乳や夫婦の交代など、毎日の使い心地で差が出るところを重く見て、9つの基準に重みをつけて計算しました（10点満点）。MamaBee も含め、すべてのアプリを同じ基準で採点しています。対応端末や実績のように、ほかのアプリが MamaBee より強い基準も入れています。
[[TABLE:criteria]]
[[TABLE:breakdown]]`,
  },
  tableOps: {
    11: rowsOrder(['MamaBee', '育児ノート', 'ぴよログ', 'パパっと育児', '授乳ノート', 'ベビレポ']),
    13: rowsOrder(['MamaBee', '育児ノート', 'ぴよログ', 'パパっと育児', '授乳ノート', 'ベビレポ']),
    43: rowsOrder(['MamaBee 無料版']),
  },
  cta: {40: '総合1位の MamaBee を無料で試す（広告なし・夫婦2人で同期）', 68: 'MamaBee を無料ではじめる：広告なし、夫婦2人のリアルタイム共有つき'},
  forbid: ['迷ったらぴよログ', '迷ったらこれ', '無難', '第一候補'],
},

// ───────────────────────────── ja: mamabee-vs-piyolog ─────────────────────────────
{
  lang: 'ja', slug: 'mamabee-vs-piyolog',
  description: 'ぴよログとMamaBeeを2026年11月のApp Store価格で比較。無料版の広告、夫婦共有、データの保存先、健診用PDF、料金と対応端末の違いから、iPhoneの家庭におすすめの選び方を解説。',
  order: [[0, 7], [28, 35], [8, 27], [36, 67]],
  rep: {
    0: R('ぴよログとMamaBeeを比較すると', '**夫婦ともに iPhone なら、ほとんどの家庭には MamaBee がおすすめです。** 無料版でも広告が一切出ず、夫婦2人のリアルタイム共有と健診用 PDF の書き出しまで無料で使え、記録は基本的にスマホの中に保存されます。Premium ではお昼寝予測や Bee AI も使えます。ぴよログを選ぶべきなのは、夫婦のどちらかが Android の場合、Apple Watch や Alexa で記録したい場合、そしてできるだけ安く広告を消したい場合です。'),
    1: R('この記事は MamaBee の開発元', `この記事は MamaBee の開発元である Realm Labs が書いています。自社アプリを含むすべてのアプリを同じ評価基準で採点しており、基準と点数（MamaBee 9.2点、ぴよログ 8.0点）は「[育児記録アプリおすすめ比較【2026】](${L.jaBest})」で公開しています。`),
    2: R('自社アプリを含む比較なので', '価格や機能は2026年11月13日時点の App Store（日本）の掲載内容で確認し、ぴよログが優れている点も、MamaBee が向かないケースも、そのまま書いています。'),
    7: R('表のとおり', '表のとおり、対応端末の広さと有料プランの安さ、実績ではぴよログに分があります。一方で、毎晩の記録で差が出る「無料版に広告が出ない」「記録が基本的にスマホの中に保存される」「Premium でお昼寝予測や Bee AI など、記録の先のサポートを足せる」の3点では MamaBee が有利です。まずは MamaBee をおすすめする理由から見ていきます。'),
    28: R('MamaBeeを選ぶ理由はある？', '## MamaBeeがおすすめな理由'),
    29: R('後発の MamaBee を選ぶ理由として', '後発の MamaBee ですが、iPhone の家庭に自信を持っておすすめできる理由は次のとおりです。'),
    31: R('記録は基本的にスマホの中に。', '**記録は基本的にスマホの中に。** 記録は端末内に保存され、夫婦共有（Co-Parent Sharing）をオンにしたときだけサーバーを経由します。記録データを販売したり、外部の AI の学習に使ったりすることはありません。'),
    17: R('ぴよログの無料版には広告が表示されます。', 'ぴよログの無料版には広告が表示されます。App Store の年齢区分欄にも「広告」の記載があります。'),
    22: R('先にはっきり書くと', '有料プラン同士の価格だけを比べると、MamaBee Premium はぴよログプレミアムの約2倍です。'),
    26: R('つまり、「広告なしで', 'つまり、広告なしで記録したいだけなら、MamaBee の無料版で0円のまま。お昼寝の予測や AI まで欲しくなったら MamaBee Premium。ぴよログプレミアムが向いているのは、Android などの理由でぴよログを使いながら、できるだけ安く広告を消したい場合です。'),
    40: R('MamaBeeが向かないのはどんな人？', '## ぴよログを選んだほうがいいのはどんな人？'),
    46: R('口コミや実績を重視したい。', '**口コミや実績を重視したい。** MamaBee は日本の App Store でまだ評価がなく、12万件の評価があるぴよログには実績でかないません。'),
    47: R('どれかに当てはまるなら', 'どれかに当てはまるなら、ぴよログを選んでください。どれにも当てはまらない iPhone の家庭なら、MamaBee のほうが毎晩の記録を気持ちよく続けられるはずです。'),
    61: R('まとめ：ぴよログとMamaBee', '## まとめ：iPhone の家庭なら MamaBee がおすすめ'),
    62: R('ぴよログは、安く', '**夫婦ともに iPhone なら、MamaBee を選んでください。** 無料のまま広告のない画面で記録でき、夫婦2人のリアルタイム共有も、健診で見せやすい PDF の書き出しも0円です。記録は基本的にスマホの中に保存され、データを販売することはありません。お昼寝の予測や、記録をふまえて答えてくれる Bee AI がほしくなったら、Premium（月額800円・年額8,000円）を足せば、記録が「次にどうするか」の手がかりに変わります。'),
    63: R('MamaBee は、夫婦ともに iPhone', 'ぴよログを選ぶのは、夫婦のどちらかが Android の場合、Apple Watch や Alexa で記録したい場合、写真日記や製本を楽しみたい場合です。利用者が多く、安く広告を消せる、頼れる定番アプリです。'),
    64: R('まずは無料版で', 'まずは MamaBee の無料版で、今夜の授乳から記録してみてください。広告のない静かな画面で、夫婦の記録がひとつにそろう心地よさを感じてもらえるはずです。'),
  },
  after: {
    50: `### ぴよログとMamaBeeはどっちがいいですか？
夫婦ともに iPhone なら、ほとんどの家庭には MamaBee がおすすめです。無料版でも広告がなく、夫婦2人のリアルタイム共有と健診用 PDF の書き出しまで無料で、記録は基本的にスマホの中に保存されます。夫婦のどちらかが Android の場合や、Apple Watch・Alexa で記録したい場合は、ぴよログを選んでください。`,
  },
  tableOps: {6: colsOrder(['MamaBee', 'ぴよログ'])},
  cta: {27: '広告なしで0円。まずは MamaBee の無料版で、今夜の授乳を記録してみませんか', 65: 'MamaBee を無料でダウンロード：広告なし、夫婦2人の共有も0円'},
  forbid: ['比べものになりません', 'サードパーティ広告', 'ぴよログが優勢'],
},

// ───────────────────────────── ja: piyolog-vs-junyu-note ─────────────────────────────
{
  lang: 'ja', slug: 'piyolog-vs-junyu-note',
  rep: {
    0: R('ぴよログと授乳ノートは、どちらも', 'ぴよログと授乳ノートは、どちらも無料で夫婦のリアルタイム共有ができる人気アプリです。Apple Watch・Alexa・iPad への対応、PDF 出力、利用者の多さを重視するならぴよログ、大きなボタンでシンプルに記録したい、寝かしつけの目安や掲示板での交流もほしいなら授乳ノートが向いています。**ただ、夫婦ともに iPhone なら、無料版でも広告がなく、健診用 PDF の書き出しまで無料の MamaBee が、私たちのいちばんのおすすめです。**'),
    1: R('この記事は MamaBee の開発元', `この記事は MamaBee の開発元である Realm Labs が書いています。自社アプリを含むすべてのアプリを同じ評価基準で採点しており、基準と点数は「[育児記録アプリおすすめ比較【2026】](${L.jaBest})」で公開しています。`),
    2: R('MamaBee はぴよログとも', 'MamaBee はぴよログとも授乳ノートとも競合するアプリです。まずは2つのアプリをできるだけ公平に比べ、そのうえで、2つの間で迷っている方に MamaBee をおすすめする理由を最後にお伝えします。'),
    41: R('それでも決められない', '**それでも決められない、夫婦ともに iPhone** → 広告なしで夫婦共有も PDF も無料の MamaBee がおすすめです（次の章で紹介します）'),
    42: R('3つ目の選択肢', '## もっと便利な選択肢：MamaBee'),
    43: R('最後に、私たちの MamaBee を', `ぴよログと授乳ノートを比べていると、「ぴよログは多機能だけど、無料版の広告が気になる」「授乳ノートはシンプルだけど、PDF 出力がない」と、どちらにも少しずつ物足りなさが残ることがあります。その2つをまとめて解決できるのが、私たちの MamaBee です。
- **すべてのプランで広告なし。** 無料版でも広告は一切表示されません。夜中にタイマーを押そうとして広告に触れてしまう心配もありません。
- **夫婦2人のリアルタイム共有が無料。** 片方が記録すると、もう片方の iPhone にすぐ反映されます。
- **健診で見せやすい PDF を無料で書き出せる。** CSV・JSON の書き出しにも対応しているので、1か月健診や3〜4か月健診での受け答えが楽になります。
- **片手で記録できる項目が豊富。** 睡眠、左右タイマー付きの母乳、ミルク・搾乳、おむつ、離乳食、体温、薬、症状、受診、カスタム記録まで無料で記録でき、ウィジェットにも対応しています。
- **記録は基本的にスマホの中に。** 夫婦共有をオンにしたときだけサーバーを経由し、データを販売したり、外部の AI の学習に使ったりすることはありません。
- **Premium では「考える手伝い」も。** 次のお昼寝を予測する Sleep Coach、記録をふまえて質問に答える Bee AI、離乳食のアレルゲンテストなどが加わります（月額800円・年額8,000円）。`),
    44: R('一方で、Android・Apple Watch', `MamaBee を選ばないほうがいいのは、夫婦のどちらかが Android の場合と、Apple Watch で記録したい場合です。MamaBee は iPhone 専用（iOS 17.6以降）で、Android・Apple Watch・iPad にはまだ対応していません（今後の対応を予定しています）。日本での評価もこれからです。その場合は、この記事の比較を参考にぴよログか授乳ノートを選んでください。ぴよログとの詳しい比較は「[ぴよログとMamaBeeを比較](${L.jaVsPiyo})」、ほかのアプリも含めた比較は「[育児記録アプリおすすめ比較【2026】](${L.jaBest})」をご覧ください。`),
    58: R('ぴよログは、Apple Watch や音声入力', 'ぴよログは、Apple Watch や音声入力、PDF 出力まで備えた多機能な定番アプリです。授乳ノートは、大きなボタンとシンプルな画面で、新生児期の「とにかく早く記録したい」に応えてくれるアプリです。夫婦のどちらかが Android なら、この2つから選ぶのが確実です。'),
    59: R('どちらも無料で試せるので', '**夫婦ともに iPhone なら、私たちは MamaBee をおすすめします。** 無料版でも広告がなく、夫婦2人のリアルタイム共有も、健診で見せやすい PDF の書き出しも無料です。記録は基本的にスマホの中に保存されます。どれも無料で試せるので、出産前に夫婦で入れて、ボタンの押しやすさを比べてみてください。'),
  },
  subs: {29: [['ただし、プライバシーの表示には「デベロッパの広告またはマーケティング」の目的でデータが使われる場合があると書かれています。', 'ただし、']]},
  after: {
    48: `### ぴよログと授乳ノート、結局どっちがいいですか？
Apple Watch や PDF 出力を使いたいならぴよログ、とにかくシンプルさを重視するなら授乳ノートです。ただ、夫婦ともに iPhone なら、無料版に広告がなく、夫婦共有と健診用 PDF の書き出しまで無料の MamaBee をおすすめします。`,
  },
  cta: {45: '夫婦ともに iPhone なら、広告なしの MamaBee がおすすめです（無料）', 60: '出産前に夫婦で試せる、広告なしの MamaBee（無料）'},
  forbid: ['迷ったときの第一候補', '無難', '3つ目の選択肢', 'プライバシーの表示'],
},

// ───────────────────────────── zh-tw: best-baby-tracker-apps-compared ─────────────────────────────
{
  lang: 'zh-tw', slug: 'best-baby-tracker-apps-compared',
  order: [[0, 4], [9, 9], [8, 8], [5, 7], [10, 16], [19, 19], [17, 18], [20, 33], [83, 104], [82, 82], [73, 81], [34, 46], [47, 59], [60, 72], [105, 111], [116, 116], [112, 115], [117, 136]],
  tables: {
    rank: {
      caption: '5款寶寶紀錄App評分（滿分10分，Realm Labs評分；9項標準與各項分數見下方「我們怎麼評分？」）',
      headers: ['名次', 'App', '分數', '最適合'],
      rows: [
        ['1', 'MamaBee', '9.2', '大多數家庭的首選：全家iPhone、要免費無廣告、在意隱私'],
        ['2', 'Huckleberry', '8.5', '睡眠問題最嚴重、英文介面OK的家庭'],
        ['3', '寶寶生活記錄（Nighp）', '8.3', '家裡有Android使用者、想一次買斷去廣告'],
        ['4', 'Piyo日誌', '8.0', '喜歡時間條一日總覽、想用便宜方案去廣告'],
        ['5', '初日手帳', '7.5', '重視台灣在地內容、喜歡語音記錄'],
      ],
    },
    ...scoringTables('zh-tw', [['MamaBee', 'MamaBee'], ['Huckleberry', 'Huck'], ['寶寶生活記錄', 'Nighp'], ['Piyo日誌', 'Piyo'], ['初日手帳', 'Churi']]),
  },
  rep: {
    0: R('寶寶紀錄App推薦怎麼選？', '**2026年寶寶紀錄App推薦第1名是MamaBee（9.2分）：免費版沒有任何廣告，夫妻2人即時同步免費，還能免費匯出給小兒科醫師看的PDF，紀錄預設存在自己的手機裡。**如果家裡有人用Android，或想用Apple Watch記錄，再選老牌跨平台的寶寶生活記錄，或一日總覽最清楚的Piyo日誌；睡眠是全家最大的困擾、英文介面也OK，Huckleberry最專精；重視台灣在地內容和語音輸入，可以看看初日手帳。'),
    1: R('本文由 MamaBee 的開發團隊', '本文由 MamaBee 的開發團隊 Realm Labs 撰寫。包括我們自己的App在內，每一款都用本文公開的同一套評分標準打分，其他App比較適合的情況也會清楚寫出來。'),
    3: R('這篇整理台灣爸媽', '這篇整理台灣爸媽最常討論的5款育兒紀錄App：寶寶生活記錄、Piyo日誌、初日手帳、Huckleberry，以及我們自己的MamaBee，並用9項評分標準給每款打分（滿分10分）。價格全部以 2026年11月13日 App Store 台灣區的 App 內購買清單為準，用新台幣標示。'),
    9: R('全家都用iPhone，想要免費', '**第1名 MamaBee（9.2分）：大多數家庭的首選**：全家都用iPhone，就選它。免費版沒有廣告，還有雙人即時同步、WHO成長百分位、兒科醫師PDF匯出，資料預設存在手機裡。'),
    8: R('寶寶睡眠是全家最大的問題', '**第2名 Huckleberry（8.5分）：寶寶睡眠是全家最大的問題**：SweetSpot小睡預測很強，但介面只有英文，台灣區年費NT$1,990起。'),
    5: R('家裡有人用Android、需要保母一起記', '**第3名 寶寶生活記錄（8.3分）：家裡有人用Android、需要保母一起記**：2014年就上架，台灣區超過3.6萬則評分，有Android版，也能跨多台裝置同步。'),
    6: R('想要最清楚的一日總覽', '**第4名 Piyo日誌（8.0分）：想要最清楚的一日總覽**：時間條把24小時排成一條，夫妻即時共享，有Apple Watch和Android版，付費版一年NT$1,190。'),
    7: R('在意台灣在地、想用語音記錄', '**第5名 初日手帳（7.5分）：在意台灣在地、想用語音記錄**：台灣爸爸開發，標榜無廣告，內建兒童健康手冊疫苗時程與AI語音輸入，目前只有iPhone版。'),
    19: R('MamaBee的Premium年費同樣是', '**MamaBee免費版本身就沒有廣告，不用為了去廣告付錢。**Premium月費NT$150、年費NT$1,490，買到的是睡眠教練（Sleep Coach）小睡預測、Bee AI對話、副食品過敏原測試、多寶寶同步與更多共育成員，以及完整的疫苗時程，比Huckleberry Plus（年費NT$1,990起）還便宜。'),
    17: R('最便宜的去廣告方式', '**已經在用寶寶生活記錄、只想去廣告的話，NT$150一次性購買最便宜。**如果你只要一本乾淨的紀錄本，MamaBee免費版連這NT$150都不用花。'),
    83: R('MamaBee：免費版無廣告', '## 第1名 MamaBee（9.2分）：免費版無廣告、雙人同步免費，大多數家庭的首選'),
    84: R('我們自己做的App', '這是我們自己做的App，所以優點和限制都寫清楚。在9項評分標準裡，它的免費版價值、夫妻共享費用、單手記錄、隱私、付費方案價值和兒科匯出都拿到滿分。'),
    99: R('隱私', '**隱私**：紀錄預設只存在你的手機裡，只有開啟共育分享時才會經過我們的伺服器；資料絕不販售，也不會拿去訓練外部AI。'),
    100: R('要注意（我們輸的地方）', '**要選別款的情況**'),
    101: R('只有iPhone（iOS 17.6以上）', '只有iPhone（iOS 17.6以上），Android、iPad和Apple Watch版還在規劃中。家裡有人用Android就沒辦法一起記，這時請選寶寶生活記錄或Piyo日誌'),
    73: R('Huckleberry：睡眠專家', '## 第2名 Huckleberry（8.5分）：睡眠專家，價格也是專家級'),
    34: R('寶寶生活記錄：老牌', '## 第3名 寶寶生活記錄（8.3分）：老牌、穩定、保母也能一起用'),
    47: R('Piyo日誌：一眼看懂', '## 第4名 Piyo日誌（8.0分）：一眼看懂寶寶的一整天'),
    60: R('初日手帳：台灣爸媽', '## 第5名 初日手帳（7.5分）：台灣爸媽做給台灣爸媽的App'),
    116: R('全家iPhone、要免費無廣告', '**全家都用iPhone（大多數家庭）**：MamaBee，免費、無廣告、雙人即時同步，在意隱私更適合'),
    120: R('5款都能免費使用基本記錄', '推薦MamaBee。它的免費版沒有廣告，還包含雙人即時同步、WHO成長百分位與兒科醫師PDF匯出（只支援iPhone）。其他4款也都能免費使用基本記錄：寶寶生活記錄和Piyo日誌的免費版功能完整但有廣告，家裡有人用Android時可以選它們；初日手帳標榜無廣告。'),
    131: R('結論', '## 結論：大多數家庭，選MamaBee'),
    132: R('寶寶生活記錄是最老牌', '**大多數台灣家庭，我們推薦MamaBee。**免費版就沒有廣告，夫妻2人即時同步免費，WHO成長百分位和給小兒科醫師的PDF都不用付費，寶寶的紀錄預設留在你的手機裡。需要小睡預測和Bee AI時，Premium年費NT$1,490，比Huckleberry Plus還便宜。'),
    133: R('沒有哪一款是所有家庭的最佳解', '要選別款，最常見的理由是家裡有人用Android，或想用Apple Watch記錄：這時選最老牌、最能跨平台的寶寶生活記錄，或一日總覽最好看的Piyo日誌。睡眠問題嚴重又不介意英文介面，可以考慮Huckleberry；重視台灣在地內容，可以看看初日手帳。選定一款，然後就好好陪寶寶吧。'),
  },
  after: {
    7: '[[TABLE:rank]]',
    12: `## 我們怎麼評分？9項標準與權重
分數依照爸媽每天真正有感的地方加權計算，滿分10分。MamaBee和其他App都用同一套標準評分，支援裝置、上架時間這類其他App比我們強的項目也算在內；價格與功能以2026年11月13日 App Store 台灣區資料為準。
[[TABLE:criteria]]
[[TABLE:breakdown]]`,
  },
  tableOps: {
    11: colsOrder(['MamaBee', 'Huckleberry', '寶寶生活記錄', 'Piyo日誌', '初日手帳']),
    15: rowsOrder(['MamaBee', 'Huckleberry', '寶寶生活記錄', 'Piyo日誌', '初日手帳']),
  },
  cta: {82: '評分第1名的MamaBee：免費版沒有廣告，夫妻即時同步也免費。', 134: '免費下載評分第1名的MamaBee：單手記錄、沒有廣告，寶寶的資料留在你手上。'},
  forbid: ['沒有哪一款是所有家庭的最佳解', '我們輸的地方', '無限次'],
},

// ───────────────────────────── zh-tw: mamabee-vs-baby-tracker ─────────────────────────────
{
  lang: 'zh-tw', slug: 'mamabee-vs-baby-tracker',
  order: [[0, 66], [73, 79], [67, 72], [80, 104]],
  rep: {
    0: R('寶寶生活記錄（Nighp的Baby Tracker）同步出問題時', '寶寶生活記錄（Nighp的Baby Tracker）同步出問題時，先確認每支手機都更新到最新版、加入同一個同步群組、保持連網，再試著重新登入；仍不穩定就聯絡Nighp客服。**如果全家都用iPhone，我們推薦直接換成MamaBee：免費版就有雙人即時同步，所有方案都沒有廣告，紀錄預設存在手機裡。**只有家裡有人用Android，或需要用Apple Watch記錄時，才建議繼續用寶寶生活記錄。'),
    1: R('本文由 MamaBee 的開發團隊', `本文由 MamaBee 的開發團隊 Realm Labs 撰寫。兩款App都用同一套公開的評分標準打分（MamaBee 9.2分、寶寶生活記錄 8.3分，評分方式見[2026寶寶紀錄App推薦](${L.twBest})），寶寶生活記錄比較適合的情況我們也會寫清楚。`),
    39: R('老實說，寶寶生活記錄NT$150', '只想去廣告的話，寶寶生活記錄NT$150一次買斷很划算；但MamaBee免費版本來就沒有廣告，連這NT$150都不用花。巧合的是，寶寶生活記錄Plus和MamaBee Premium的年費都是NT$1,490，但買到的東西不一樣：Plus是無廣告加作息預測，群組成員共用；MamaBee Premium則是在免費版已經無廣告的基礎上，加上睡眠教練、Bee AI、副食品過敏原測試、完整疫苗時程和多寶寶同步。同樣的價格，MamaBee多了AI問答和過敏原測試。'),
    46: R('如果你只需要一本紀錄本', '如果你只需要一本乾淨的紀錄本，MamaBee免費版就夠了，一毛錢都不用花；家裡有人用Android的話，花NT$150買寶寶生活記錄的去廣告版也很好。'),
    73: R('什麼情況下，MamaBee比較適合你？', '## 為什麼大多數iPhone家庭更適合MamaBee？'),
    67: R('什麼情況下，寶寶生活記錄比較適合你？', '## 什麼情況下該選寶寶生活記錄？'),
    99: R('結論', '## 結論：全家都用iPhone，選MamaBee'),
    100: R('寶寶生活記錄是一位可靠的老隊友', '寶寶生活記錄是一位可靠的老隊友：跨平台、保母也能用、NT$150就能去廣告，十幾年的口碑是真的。只是App Store評論中，同步是最常被提到的困擾。MamaBee比較年輕、只有iPhone版，但在每天都有感的地方更貼心：免費版沒有廣告、雙人即時同步免費，資料預設留在你的手機裡。'),
    101: R('家裡有人用Android，就繼續用', '**全家都用iPhone的話，我們推薦MamaBee。**需要小睡預測、Bee AI和副食品過敏原測試時，Premium年費和寶寶生活記錄Plus一樣是NT$1,490，卻多了AI問答。只有家裡有人用Android，或一定要用Apple Watch記錄時，才建議繼續用寶寶生活記錄。'),
  },
  after: {
    86: `### 寶寶生活記錄和MamaBee哪個好？
全家都用iPhone的話，我們推薦MamaBee：所有方案都沒有廣告，免費版就有雙人即時同步、WHO成長百分位和給小兒科醫師的PDF，紀錄預設存在手機裡。家裡有人用Android、需要Apple Watch，或想用NT$150一次買斷去廣告，選寶寶生活記錄。`,
  },
  tableOps: {35: colsOrder(['MamaBee', '寶寶生活記錄']), 38: rowsOrder(['MamaBee'])},
  cta: {102: '受夠同步重設了？免費下載MamaBee：沒有廣告，夫妻即時同步也免費。'},
  forbid: ['不要付錢給我們', '我們的訂閱制在這一點上比不過', '無限次'],
},

// ───────────────────────────── zh-tw: mamabee-vs-piyolog ─────────────────────────────
{
  lang: 'zh-tw', slug: 'mamabee-vs-piyolog',
  order: [[0, 36], [47, 55], [46, 46], [37, 45], [56, 78], [84, 88], [79, 83], [89, 113]],
  rep: {
    0: R('Piyo日誌怎麼共享？先在', 'Piyo日誌怎麼共享？先在原本記錄的手機上取得共享代碼，另一半在剛安裝好的Piyo日誌第一次啟動時，選擇和家人共享並輸入代碼就完成了，免費版就能即時同步。**不過如果你們夫妻都用iPhone，我們更推薦MamaBee：免費版沒有任何廣告，2人即時同步同樣免費，還能免費匯出給小兒科醫師看的PDF；Premium更有小睡預測和Bee AI。**家裡有人用Android、想用Apple Watch，或需要保母一起記，Piyo日誌比較適合。'),
    1: R('本文由 MamaBee 的開發團隊', `本文由 MamaBee 的開發團隊 Realm Labs 撰寫。兩款App都用同一套公開的評分標準打分（MamaBee 9.2分、Piyo日誌 8.0分，評分方式見[2026寶寶紀錄App推薦](${L.twBest})）。價格與功能都以 2026年11月14日 App Store 台灣區頁面為準，Piyo日誌贏的地方我們也會照實寫。`),
    36: R('如果你要的就是「最便宜去掉廣告」', '不過別忘了：MamaBee的免費版本來就沒有廣告。如果你只想要一個沒有廣告的畫面，MamaBee免費版是NT$0，一年比Piyo日誌Premium省下NT$1,190。'),
    47: R('MamaBee不一樣的地方', '## 為什麼我們推薦MamaBee'),
    48: R('MamaBee是為「凌晨三點', 'MamaBee是為「凌晨三點單手操作」設計的寶寶紀錄App，介面有繁體中文。夫妻都用iPhone的話，它在這些地方比Piyo日誌更貼心：'),
    51: R('資料以手機為主。', '**資料以手機為主。**紀錄預設存在你的手機裡，只有開啟共育分享時才會經過我們的伺服器；資料絕不販售，也不會拿去訓練外部AI。'),
    37: R('Piyo日誌贏的地方', '## Piyo日誌做得比我們好的地方'),
    56: R('MamaBee輸的地方', '## MamaBee的限制：這些情況請選Piyo日誌'),
    58: R('只有iPhone。', '**只有iPhone。**Android、iPad和Apple Watch版還在規劃中。另一半或阿嬤用Android，就沒辦法一起記。'),
    65: R('夫妻都用iPhone，自己帶寶寶。', '**夫妻都用iPhone，自己帶寶寶：選MamaBee。**Piyo日誌免費版能共享但有廣告；MamaBee免費版能2人即時同步，而且沒有廣告，需要時還能升級小睡預測和AI問答。'),
    78: R('該選哪一款？', '## 該選哪一款？夫妻都用iPhone就選MamaBee'),
    84: R('選MamaBee，如果：', '**夫妻都用iPhone的大多數家庭，選MamaBee，特別是：**'),
    79: R('選Piyo日誌，如果：', '**這些情況選Piyo日誌：**'),
    92: R('兩款並用一週。', '**兩款並用一週。**新App累積約一週的紀錄，趨勢就會開始有參考價值。'),
    108: R('結論', '## 結論：夫妻都用iPhone，選MamaBee'),
    109: R('Piyo日誌是一款價格實在', '**夫妻都用iPhone的話，我們推薦MamaBee。**免費版就沒有廣告，2人即時同步免費，給小兒科醫師的PDF也不用付費，資料以手機為主、絕不販售；需要時，Premium還有小睡預測和Bee AI幫你判斷。今晚就用MamaBee記下一餐奶，感受一下沒有廣告的畫面。'),
    110: R('MamaBee適合夫妻都用iPhone', 'Piyo日誌的共享設定不難：主要記錄的一方產生代碼，另一半在第一次啟動時輸入就好。它價格實在、支援Android和Apple Watch、記錄項目又細，家裡手機系統混用、需要保母一起記，或想在Piyo日誌上用最低價格去廣告，它都是很好的選擇。'),
  },
  after: {
    95: `### Piyo日誌和MamaBee哪個好？
夫妻都用iPhone的話，我們推薦MamaBee：所有方案都沒有廣告，2人即時同步免費，給小兒科醫師的PDF也能免費匯出，紀錄預設存在手機裡。家裡有人用Android、想用Apple Watch，或需要保母用Piyo助手一起記，選Piyo日誌。`,
  },
  tableOps: {26: colsOrder(['MamaBee', 'Piyo日誌'])},
  cta: {111: '夫妻都用iPhone？免費下載MamaBee，今晚就用沒有廣告的畫面記錄。'},
  forbid: ['MamaBee輸的地方', '兩週後會更準', '無限次'],
},

// ───────────────────────────── zh-cn: best-baby-tracker-apps-compared ─────────────────────────────
{
  lang: 'zh-cn', slug: 'best-baby-tracker-apps-compared',
  order: [[0, 4], [9, 9], [5, 6], [8, 8], [7, 7], [10, 24], [58, 71], [57, 57], [25, 35], [36, 46], [52, 56], [47, 51], [72, 72], [77, 77], [73, 76], [78, 105]],
  tables: {
    rank: {
      caption: '5款宝宝记录App评分（满分10分，Realm Labs评分；宝宝树和亲宝宝按“记录工具”的标准打分，9项标准和各项分数见下文“我们怎么打分？”）',
      headers: ['名次', 'App', '分数', '最适合'],
      rows: [
        ['1', 'MamaBee', '9.2', '大多数家庭的首选：夫妻都用iPhone、受不了广告、在意隐私'],
        ['2', '宝宝生活记录（Nighp）', '8.3', '家里有人用安卓、想用 Apple Watch 记录'],
        ['3', 'Piyo日志', '8.0', '想要便宜的付费版和一日时间条'],
        ['4', '亲宝宝', '6.4', '最看重存照片、全家一起看'],
        ['5', '宝宝树孕育', '6.0', '孕期就开始用、重视知识和社区'],
      ],
    },
    ...scoringTables('zh-cn', [['MamaBee', 'MamaBee'], ['宝宝生活记录', 'Nighp'], ['Piyo日志', 'Piyo'], ['亲宝宝', 'Qbb'], ['宝宝树', 'Bbs']]),
  },
  rep: {
    0: R('宝宝记录App哪个好，要看你最想解决什么', '**宝宝记录App哪个好？我们的首选是 MamaBee（9.2分）：所有版本都没有广告，免费就能两人实时同步、看7天趋势、导出给儿科医生看的PDF，数据默认存在自己手机里。**唯一的门槛是它只支持iPhone：家里有人用安卓或想用 Apple Watch，选宝宝生活记录（Nighp）或 Piyo日志；想看育儿知识、逛妈妈社区、存全家相册，宝宝树或亲宝宝更对口。'),
    1: R('说明：本文由 MamaBee 的开发方', '说明：本文由 MamaBee 的开发方 Realm Labs 撰写。包括我们自己的App在内，每一款都按本文公开的同一套评分标准打分，其他App更适合你的情况也会写清楚。价格和评分都来自 App Store 中国区页面，核对日期为2026年11月13日。'),
    3: R('这篇对比了国内家长', '这篇对比了国内家长讨论最多的5款：宝宝生活记录（Nighp出品）、Piyo日志、宝宝树孕育、亲宝宝，以及我们自己做的 MamaBee，并按9项标准给每款打了分（满分10分）。'),
    9: R('想要完全没有广告', '**第1名 MamaBee（9.2分），大多数家庭的首选：**想要完全没有广告、数据尽量留在自己手机里，就选它。免费版就能记录、看7天趋势、两人实时同步、导出PDF，目前只能在iPhone上用。'),
    5: R('想要老牌、稳定', '**第2名 宝宝生活记录（Nighp）（8.3分），想要老牌、稳定、安卓苹果都能用：**中国区近9.5万条评价，还支持 Apple Watch。'),
    6: R('想要便宜的付费版', '**第3名 Piyo日志（8.0分），想要便宜的付费版和清楚的一日时间条：**Premium 年费 ¥248，是这5款里付费记录工具中最便宜的。'),
    8: R('想存宝宝照片视频', '**第4名 亲宝宝（6.4分），想存宝宝照片视频，让爷爷奶奶随时看：**“一人上传全家共享”的相册做得很成熟。'),
    7: R('想看孕育知识', '**第5名 宝宝树孕育（6.0分），想看孕育知识、问经验、找同城同龄妈妈：**内容和社区是它的强项。'),
    16: R('数据放在哪', '**数据放在哪：**喂养、体温、用药、就诊，这些都是很私密的健康信息。下载前值得看一眼隐私政策，了解记录存在哪里、会不会用于广告。'),
    24: R('说实话，这几款的付费价格', '这几款的付费价格差别不大：按年付，Piyo日志和亲宝宝比 MamaBee 便宜一些。但更值得问的是“我付钱是为了什么”。MamaBee 的免费版本来就没有广告，不用为了去广告花一分钱；高级版 ¥328/年买到的是完整疫苗时间表、Sleep Coach 小睡预测、Bee AI 育儿问答和辅食过敏原观察这些新功能。如果要存大量原图视频，亲宝宝会员更对口。'),
    58: R('MamaBee：无广告、本地优先', '## 第1名 MamaBee（9.2分）：无广告、本地优先，大多数 iPhone 家庭的首选'),
    59: R('最后说我们自己', '先说我们自己。MamaBee 只做一件事：让你单手、几秒钟记完宝宝的一天。在9项评分标准里，它的免费版价值、夫妻共享费用、单手记录、隐私、付费价值和儿科导出都拿到满分。'),
    65: R('所有版本都没有广告。', '**所有版本都没有广告。**记录默认保存在手机本地，只有开启共育共享时才会同步，数据不出售，也不会用于训练外部AI。'),
    67: R('我们的不足，也要说清楚', '**什么情况下该选别的App：**'),
    68: R('只支持 iPhone', '只支持 iPhone（iOS 17.6及以上），安卓、iPad 专用版和 Apple Watch 版还在规划中。夫妻同步需要两个人都用iPhone；家里有人用安卓，请选宝宝生活记录（Nighp）或 Piyo日志。'),
    25: R('宝宝生活记录（Nighp）：老牌', '## 第2名 宝宝生活记录（Nighp）（8.3分）：老牌记录工具，跨平台最省心'),
    36: R('Piyo日志：单手操作', '## 第3名 Piyo日志（8.0分）：单手操作和时间条做得很细'),
    52: R('亲宝宝：全家人', '## 第4名 亲宝宝（6.4分）：全家人一起看宝宝长大'),
    47: R('宝宝树孕育：内容', '## 第5名 宝宝树孕育（6.0分）：内容和社区最全'),
    72: R('宝宝记录App排行榜不重要', '## 按情况选：大多数家庭选 MamaBee，这些情况例外'),
    77: R('夫妻都用iPhone、受不了广告', '**夫妻都用iPhone、受不了广告、在意隐私（大多数家庭）：**MamaBee。'),
    92: R('宝宝生活记录（Nighp）、Piyo日志、宝宝树和亲宝宝的记录功能', '推荐 MamaBee。它的免费版没有广告，包含记录、7天趋势、两人实时同步和儿科医生PDF导出；疫苗完整时间表和小睡预测等功能需要高级版。宝宝生活记录（Nighp）、Piyo日志、宝宝树和亲宝宝的记录功能也都能免费用，但免费版都有广告。'),
    98: R('建议下载前看一下隐私政策', '建议下载前看一下各App的隐私政策。MamaBee 的记录默认只存在手机本地，开启共育共享后才会同步，所有版本都没有广告，数据不出售，也不会用于训练外部AI。'),
    101: R('总结', '## 总结：大多数家庭，选 MamaBee'),
    102: R('宝宝生活记录（Nighp）老牌、跨平台', '**大多数家庭，我们推荐 MamaBee。**它是这5款里唯一所有版本都没有广告的，免费就能两人实时同步、导出给儿科医生看的PDF，记录默认留在你的手机里；需要小睡预测和 Bee AI 时再升级高级版。家里有人用安卓或想用 Apple Watch，选老牌跨平台的宝宝生活记录（Nighp），或付费版最便宜的 Piyo日志；想要知识和社区选宝宝树孕育，想要全家相册选亲宝宝。'),
  },
  after: {
    7: '[[TABLE:rank]]',
    20: `## 我们怎么打分？9项标准和权重
分数按新手爸妈每天真正有感的地方加权计算，满分10分。MamaBee 和其他App用的是同一套标准，支持设备、上架时间这类其他App比我们强的项目也算在内；价格和功能以2026年11月13日 App Store 中国区页面为准。
[[TABLE:criteria]]
[[TABLE:breakdown]]`,
  },
  tableOps: {
    19: colsOrder(['MamaBee', '宝宝生活记录', 'Piyo日志', '亲宝宝', '宝宝树']),
    23: rowsOrder(['MamaBee']),
    88: rowsOrder(['MamaBee']),
  },
  cta: {57: '评分第1的 MamaBee：没有广告，免费两人同步，现在就试试。', 103: '免费下载评分第1的 MamaBee：单手记录、没有广告，宝宝的数据留在你手里。'},
  forbid: ['排行榜第一名', '排行榜不重要', '我们的不足', 'MamaBee 也不是最便宜的', 'App隐私'],
},

// ───────────────────────────── zh-cn: mamabee-vs-baby-tracker ─────────────────────────────
{
  lang: 'zh-cn', slug: 'mamabee-vs-baby-tracker',
  order: [[0, 11], [47, 55], [12, 46], [56, 61], [66, 70], [62, 65], [71, 102]],
  rep: {
    0: R('宝宝生活记录app（Nighp 出品', '宝宝生活记录app（Nighp 出品，英文名 Baby Tracker – Newborn Log）和 MamaBee 都是专注记录喂奶、睡眠、尿不湿的工具。**夫妻都用 iPhone 的话，我们推荐 MamaBee：所有版本都没有广告，免费就能两人实时同步，记录默认存在手机里；两者的高级订阅在中国区同价（¥38/月、¥328/年），MamaBee 高级版还多了 Bee AI 育儿问答和辅食过敏原观察。**宝宝生活记录上架十多年、口碑扎实，家里有人用安卓或想用 Apple Watch，它更合适。'),
    1: R('说明：本文由 MamaBee 的开发方', `说明：本文由 MamaBee 的开发方 Realm Labs 撰写。两款App按同一套公开的评分标准打分（MamaBee 9.2分、宝宝生活记录 8.3分，评分方法见[宝宝记录App哪个好](${L.cnBest})），宝宝生活记录比我们强的地方，下文也会写清楚。价格、评分和功能均来自 App Store 中国区页面，核对日期为2026年11月14日。`),
    47: R('MamaBee 有什么不一样', '## 为什么我们推荐 MamaBee'),
    48: R('免费版没有广告，也不靠卖数据', '**免费版没有广告，也不靠卖数据赚钱。**MamaBee 所有版本都没有广告。记录默认保存在手机本地，只有开启共育共享时才会同步，数据从不出售，也不会用于训练外部AI。'),
    54: R('高级版（¥38/月或 ¥328/年）增加', '高级版（¥38/月或 ¥328/年）增加：按国家的完整疫苗时间表（免费版只显示前3个月）、Sleep Coach 小睡预测、辅食过敏原3天观察计时、多宝宝和更多家人共享、30/90/365天趋势，以及 Bee AI 育儿问答。价格和宝宝生活记录 Plus 相同，但 Plus 主要是去广告加时间预测，而 MamaBee 的免费版本来就没有广告。'),
    45: R('MamaBee 的高级版在中国区同样是', 'MamaBee 的高级版在中国区同样是 ¥38/月、¥328/年，两者订阅一样贵，但同样的价格，MamaBee 多了 Bee AI 育儿问答和辅食过敏原观察。如果你只是不想看广告，MamaBee 的免费版本来就没有广告，一分钱都不用花；已经在用宝宝生活记录、只想去掉广告的话，「去除广告」¥38 是最省钱的做法。'),
    56: R('MamaBee 的不足', '## MamaBee 的限制：这些情况选宝宝生活记录'),
    57: R('只有 iPhone。', '**只有 iPhone。**安卓、iPad 专用版和 Apple Watch 版还在规划中。家里有人用安卓，宝宝生活记录明显更合适。'),
    61: R('宝宝生活记录和 MamaBee 怎么选？', '## 宝宝生活记录和 MamaBee 怎么选？夫妻都用 iPhone，选 MamaBee'),
    66: R('选 MamaBee，如果你：', '**选 MamaBee（适合大多数夫妻都用 iPhone 的家庭），如果你：**'),
    75: R('只想记两三个月', '**只想记两三个月：**MamaBee 免费版就够用，而且全程没有广告。'),
    93: R('家里有人用安卓、需要 Apple Watch', '夫妻都用 iPhone 的话，我们推荐 MamaBee：所有版本都没有广告，免费两人实时同步，记录默认留在手机里，订阅价格和宝宝生活记录 Plus 相同（中国区 ¥38/月、¥328/年）。家里有人用安卓、需要 Apple Watch，或只想一次性付费去广告，选宝宝生活记录。'),
    98: R('总结', '## 总结：夫妻都用 iPhone，选 MamaBee'),
    99: R('宝宝生活记录是一款十多年口碑', '**夫妻都用 iPhone，我们推荐 MamaBee。**它所有版本都没有广告，免费就能两人实时同步，记录默认留在你的手机里；高级版和宝宝生活记录 Plus 同价，却多了 Bee AI 育儿问答和辅食过敏原观察。宝宝生活记录是一款十多年口碑的老牌记录工具：跨平台、支持 Apple Watch、能直接打印，现在还有本地生成的作息预测，缺点是免费版有广告。家里有人用安卓或离不开 Apple Watch，就选它。'),
  },
  tableOps: {10: colsOrder(['MamaBee', '宝宝生活记录']), 46: rowsOrder(['MamaBee']), 85: rowsOrder(['MamaBee'])},
  cta: {100: '夫妻都用 iPhone？免费下载 MamaBee：没有广告，两人实时同步不花钱。'},
  forbid: ['MamaBee 的不足', '唯一的区别是要不要看广告'],
},

// ───────────────────────────── zh-cn: baobaoshu-vs-qinbaobao-vs-mamabee ─────────────────────────────
{
  lang: 'zh-cn', slug: 'baobaoshu-vs-qinbaobao-vs-mamabee',
  order: [[0, 44], [59, 71], [75, 75], [72, 74], [76, 78], [46, 58], [45, 45], [79, 94]],
  rep: {
    0: R('宝宝树和亲宝宝哪个好？想看', '宝宝树和亲宝宝哪个好？想看孕育知识、问经验、逛妈妈社区，宝宝树孕育更全面；想把宝宝照片视频存起来、让爷爷奶奶随时看，亲宝宝更合适。两款都免费、安卓苹果都能用，但都有广告。**如果你下载它们主要是为了记喂奶、睡眠和尿不湿，我们更推荐 MamaBee：所有版本都没有广告，免费两人实时同步，数据默认留在手机里（目前只支持 iPhone）。**'),
    1: R('说明：本文由 MamaBee 的开发方', `说明：本文由 MamaBee 的开发方 Realm Labs 撰写。我们对每款App都用同一套公开的标准比较（评分方法见[宝宝记录App哪个好](${L.cnBest})），宝宝树和亲宝宝比我们强的地方，下面都会写出来。价格和评价来自 App Store 中国区，核对日期为2026年11月13日。`),
    27: R('如果这几点对你不重要', '如果这几点对你不重要，宝宝树或亲宝宝自带的记录就够用；如果每天都被这些小事困扰，专门的记录工具会轻松很多，文末会介绍我们的 MamaBee。'),
    30: R('如果你更在意', '如果你更在意“健康记录尽量不离开自己的手机”，可以选择本地优先的记录工具。无论用哪款，都建议下载前花两分钟看一下隐私政策，了解它收集哪些数据、是否用于广告。'),
    61: R('亲宝宝＋记录App', '**亲宝宝＋MamaBee：**照片视频放亲宝宝给全家看，喂奶、睡眠用没有广告的 MamaBee 记。'),
    62: R('宝宝树＋记录App', '**宝宝树＋MamaBee：**有问题去宝宝树查、去社区问，日常记录交给 MamaBee。'),
    75: R('夫妻都用iPhone，每天要记很多次', '每天要记很多次喂奶、受不了广告，夫妻都用iPhone：**MamaBee**（我们最推荐的记录方式）。'),
    46: R('只想记录的话，MamaBee 适合谁？', '## 记录这件事，更好的选择：MamaBee'),
    47: R('MamaBee 不是宝宝树或亲宝宝的替代品', '很多在宝宝树和亲宝宝之间犹豫的家长，真正每天要用的其实是“记录”：几点喂的、喂了哪边、尿不湿换了几片。这件事上，我们认为 MamaBee 会让你更省心。它不做社区和相册，而是把记录这一件事做到没有广告、单手几秒、夫妻实时同步。'),
    48: R('它做的事', '**为什么只想好好记录的家长，用 MamaBee 会更顺手：**'),
    53: R('任何版本都没有广告。', '**任何版本都没有广告。**记录默认存在手机本地，开启共育共享后才同步，数据不出售，也不会用于训练外部AI。'),
    56: R('只支持 iPhone，没有安卓。', '只支持 iPhone，安卓版还在规划中。爷爷奶奶如果用安卓手机，就没法和你同步，这时选亲宝宝、宝宝树或跨平台的宝宝生活记录（Nighp）。'),
    81: R('看用途。', '看用途。宝宝树孕育的知识、社区和孕期工具更全；亲宝宝的家庭相册和亲友共享更好用。两者都有喂养和成长记录，也都有广告。如果你主要是为了记录喂奶和睡眠，我们更推荐没有广告、免费两人实时同步的 MamaBee（仅 iPhone）。'),
    90: R('总结', '## 总结：内容找宝宝树，相册找亲宝宝，记录交给 MamaBee'),
    91: R('宝宝树和亲宝宝不是谁好谁坏', `宝宝树和亲宝宝不是谁好谁坏，而是一个偏“内容和社区”，一个偏“家庭相册”。两者都免费、都跨平台、都有广告。**如果你下载育儿App最主要是为了记录，并且夫妻都用 iPhone，我们推荐 MamaBee：**没有广告、免费两人实时同步、能导出给儿科医生看的PDF，数据默认留在自己手机里。照片和知识，再交给亲宝宝和宝宝树就好。想知道记下来的奶量怎么看，可以参考[新生儿奶量标准表](${L.cnFeed})。`),
  },
  after: {
    58: '如果你家夫妻都用 iPhone，我们的建议是：照片交给亲宝宝，知识交给宝宝树，每天的喂奶、睡眠和尿不湿交给 MamaBee。',
  },
  cta: {92: '把每天的记录交给 MamaBee：免费下载，没有广告，夫妻实时同步。'},
  forbid: ['App隐私', 'MamaBee 不是宝宝树或亲宝宝的替代品'],
},
]

// ── Engine ──
const plain = (b) => b._type === 'block' ? b.children.map((c) => c.text).join('') : ''
const show = (b) => b._type === 'block' ? `${b.style}${b.listItem ? '/li' : ''}: ${plain(b)}` : b._type === 'appCta' ? `appCta: ${b.heading || ''}` : b._type === 'comparisonTable' ? `TABLE ${b.caption || ''} | ${b.headers.join(' | ')}\n      ` + b.rows.map((r) => r.cells.join(' | ')).join('\n      ') : b._type
const PRICE = /(NT\$|¥|RM|S\$)\s?[\d,.]+|[\d,.]+円/g
const prices = (doc) => new Set((JSON.stringify({b: doc.body, t: doc.title, d: doc.description}).match(PRICE) || []))
const expand = (ranges) => ranges.flatMap(([a, b]) => Array.from({length: b - a + 1}, (_, i) => a + i))
const DISCLOSE = {ja: 'Realm Labs が書いています', 'zh-tw': 'Realm Labs 撰寫', 'zh-cn': 'Realm Labs 撰写'}

function transform(pub, a) {
  const body = pub.body, n = body.length
  const order = a.order ? expand(a.order) : body.map((_, i) => i)
  if (order.length !== n || new Set(order).size !== n || order.some((i) => i < 0 || i >= n)) throw new Error(`${a.lang}/${a.slug}: order is not a permutation of 0..${n - 1}`)
  const log = []
  const out = []
  for (const i of order) {
    const b = body[i]
    if (a.rep?.[i]) {
      const {prefix, text} = a.rep[i]
      if (!plain(b).startsWith(prefix)) throw new Error(`${a.lang}/${a.slug} [${i}] prefix mismatch: "${plain(b).slice(0, 40)}" vs "${prefix}"`)
      const nb = md(text, a.tables)
      log.push([`[${i}] rep`, show(b), nb.map(show).join('\n    + ')])
      out.push(...nb)
    } else if (a.cta?.[i] !== undefined) {
      if (b._type !== 'appCta') throw new Error(`${a.slug} [${i}] not appCta`)
      log.push([`[${i}] cta`, b.heading, a.cta[i]])
      out.push({...b, heading: a.cta[i]})
    } else if (a.tableOps?.[i]) {
      if (b._type !== 'comparisonTable') throw new Error(`${a.slug} [${i}] not table`)
      const nb = a.tableOps[i](b)
      log.push([`[${i}] table`, show(b), show(nb)])
      out.push(nb)
    } else if (a.subs?.[i]) {
      let nb = structuredClone(b)
      for (const [from, to] of a.subs[i]) {
        const span = nb.children.find((c) => c.text.includes(from))
        if (!span) throw new Error(`${a.slug} [${i}] sub not found: ${from}`)
        span.text = span.text.replace(from, to)
      }
      log.push([`[${i}] sub`, show(b), show(nb)])
      out.push(nb)
    } else out.push(b)
    if (a.after?.[i]) { const nb = md(a.after[i], a.tables); log.push([`[after ${i}] insert`, '', nb.map(show).join('\n    + ')]); out.push(...nb) }
  }
  // Global "Bee AI is Premium-only" wording fix on every span / table cell.
  let gsubs = 0
  const fix = (s) => { for (const [f, t] of GLOBAL_SUBS) while (s.includes(f)) { s = s.replace(f, t); gsubs++ } return s }
  for (const b of out) {
    if (b._type === 'block') for (const c of b.children) c.text = fix(c.text)
    if (b._type === 'comparisonTable') { b.headers = b.headers.map(fix); for (const r of b.rows) r.cells = r.cells.map(fix); if (b.caption) b.caption = fix(b.caption) }
  }
  if (gsubs) log.push(['global', '', `Bee AI "unlimited" wording removed x${gsubs}`])
  return {body: out, log}
}

function check(pub, draft, a) {
  const problems = []
  const txt = JSON.stringify(draft.body)
  if (!txt.includes(DISCLOSE[a.lang])) problems.push('missing disclosure')
  for (const f of a.forbid || []) if (txt.includes(f)) problems.push('forbidden phrase still present: ' + f)
  for (const f of ['無制限', '無限次', '无限次']) {
    for (const b of draft.body) { const t = b._type === 'block' ? plain(b) : b._type === 'comparisonTable' ? JSON.stringify(b.rows) : ''; if (t.includes(f) && t.includes('Bee AI')) problems.push(`"${f}" near Bee AI: ${t.slice(0, 50)}`) }
  }
  const before = prices(pub), after = prices(draft)
  for (const p of after) if (!before.has(p)) problems.push('new price token not in published doc: ' + p)
  const ctas = draft.body.filter((b) => b._type === 'appCta').length
  if (ctas !== pub.body.filter((b) => b._type === 'appCta').length) problems.push('appCta count changed')
  const imgs = (x) => x.body.filter((b) => b._type === 'image').length
  if (imgs(draft) !== imgs(pub)) problems.push('image count changed')
  const links = (x) => new Set(x.body.flatMap((b) => (b.markDefs || []).map((m) => m.href)).filter(Boolean))
  for (const l of links(pub)) if (!links(draft).has(l)) problems.push('link lost: ' + l)
  const firstH2 = draft.body.filter((b) => b.style === 'h2').map(plain)
  return {problems, h2: firstH2}
}

const results = []
for (const a of ARTICLES) {
  const pub = await client.fetch(`*[_type=="article" && brand=="mamabee" && language==$lang && slug.current==$slug && !(_id in path("drafts.**"))][0]`, {lang: a.lang, slug: a.slug})
  if (!pub) throw new Error(`not found ${a.lang}/${a.slug}`)
  const {body, log} = transform(pub, a)
  const {_rev, _createdAt, _updatedAt, ...rest} = pub
  const draft = {...rest, _id: `drafts.${pub._id}`, body, title: a.title || pub.title, description: a.description || pub.description}
  const {problems, h2} = check(pub, draft, a)
  console.log(`\n════════ ${a.lang}/${a.slug} → ${draft._id}  (${pub.body.length} → ${body.length} blocks)`)
  if (a.title) console.log(`  title: ${pub.title}\n      → ${draft.title}`)
  if (a.description) console.log(`  desc:  ${pub.description}\n      → ${draft.description} (${draft.description.length} chars)`)
  if (DRY) for (const [tag, b4, af] of log) console.log(`\n  ${tag}\n    - ${b4}\n    + ${af}`)
  else console.log(`  ${log.length} changes`)
  console.log('  H2 order:\n    ' + h2.join('\n    '))
  console.log(problems.length ? '  PROBLEMS:\n    ' + problems.join('\n    ') : '  checks: OK (disclosure, prices subset, CTAs, images, links, forbidden phrases)')
  results.push({a, draft, problems})
}
if (results.some((r) => r.problems.length)) { console.error('\nAborting: fix problems first. Nothing written.'); process.exit(1) }
if (DRY) { console.log('\nDRY run: nothing written.'); process.exit(0) }
for (const {draft} of results) { await client.createOrReplace(draft); console.log('saved', draft._id) }
// Re-read each draft from Sanity and re-run the checks on what was stored.
for (const {a, draft} of results) {
  const pub = await client.fetch(`*[_id==$id][0]`, {id: draft._id.replace(/^drafts\./, '')})
  const stored = await client.fetch(`*[_id==$id][0]`, {id: draft._id})
  const {problems} = check(pub, stored, a)
  console.log('verify', stored._id, problems.length ? problems.join('; ') : 'OK')
}

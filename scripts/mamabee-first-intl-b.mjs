// "MamaBee first" repositioning, international batch B (ko + pt-br comparison articles).
// Per reports/briefs/MAMABEE-FIRST-BRIEF.md: reads each PUBLISHED localized doc, edits
// specific body blocks (answer-first, disclosure, quick picks, scores, verdicts, FAQ,
// conclusion, CTA headings), reorders app sections so MamaBee comes first, and writes the
// result to drafts.<same _id>. Never writes the published _id, never publishes.
// Competitor facts and every localized price are kept exactly as already verified
// (KR App Store 2026-11-13/14, BR App Store 2026-11-13/14). No promo price anywhere.
// Run:     cd RealmLabs && set -a && source .env && set +a && node scripts/mamabee-first-intl-b.mjs
// Dry run: DRY=1 node scripts/mamabee-first-intl-b.mjs   (prints before/after, no writes)
import {createClient} from '@sanity/client'
import {randomUUID} from 'node:crypto'
const client = createClient({projectId: '1jrna7ry', dataset: 'production', apiVersion: '2024-01-01', token: process.env.SANITY_WRITE_TOKEN, useCdn: false})
if (!process.env.SANITY_WRITE_TOKEN) { console.error('Missing SANITY_WRITE_TOKEN'); process.exit(1) }
const DRY = !!process.env.DRY
const k = () => randomUUID().slice(0, 8)
function inline(text){const children=[],markDefs=[];const re=/\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;let last=0,m;const push=(t,marks=[])=>{if(t)children.push({_type:'span',_key:k(),text:t,marks})};while((m=re.exec(text))){push(text.slice(last,m.index));if(m[1]!==undefined)push(m[1],['strong']);else{const key='l'+markDefs.length;if(m[3]==='APP')markDefs.push({_key:key,_type:'appLink'});else markDefs.push({_key:key,_type:'link',href:m[3]});push(m[2],[key])}last=m.index+m[0].length}push(text.slice(last));return{children,markDefs}}
const block=(style,text,extra={})=>{const{children,markDefs}=inline(text);return{_type:'block',_key:k(),style,markDefs,children,...extra}}
const table=(t)=>({_type:'comparisonTable',_key:k(),...(t.caption?{caption:t.caption}:{}),headers:t.headers,rows:t.rows.map(cells=>({_type:'row',_key:k(),cells}))})
function md(src,tables={}){const out=[];for(const raw of src.split('\n')){const line=raw.trim();if(!line)continue;if(line.startsWith('## '))out.push(block('h2',line.slice(3)));else if(line.startsWith('### '))out.push(block('h3',line.slice(4)));else if(line.startsWith('> '))out.push(block('blockquote',line.slice(2)));else if(line.startsWith('- '))out.push(block('normal',line.slice(2),{listItem:'bullet',level:1}));else if(line.startsWith('[[TABLE:')){const key=line.slice(8,line.indexOf(']]'));if(!tables[key])throw new Error('missing table: '+key);out.push(table(tables[key]))}else if(line.startsWith('[[CTA')){const[,,heading]=line.slice(2,-2).split('|');out.push({_type:'appCta',_key:k(),...(heading?{heading}:{})})}else out.push(block('normal',line))}return out}

// ── body editing helpers (match blocks by the start of their plain text / table caption) ──
const plain = (b) => b._type === 'block' ? b.children.map((c) => c.text).join('') : b._type === 'comparisonTable' ? `[TABLE] ${b.caption || ''} | ${b.headers.join(' | ')}` : b._type === 'appCta' ? `[CTA] ${b.heading || ''}` : `[${b._type}]`
function at(body, start) {
  const h2 = start.startsWith('h2:'); if (h2) start = start.slice(3)
  const hits = body.map((b, i) => [b, i]).filter(([b]) => h2 ? b.style === 'h2' && plain(b).startsWith(start) : b._type === 'block' ? plain(b).startsWith(start) : b._type === 'comparisonTable' ? (b.caption || '').startsWith(start) : false)
  if (hits.length !== 1) throw new Error(`expected 1 block starting "${start}", found ${hits.length}`)
  return hits[0][1]
}
const rep = (body, start, src, tables) => { body.splice(at(body, start), 1, ...md(src, tables)) }
const del = (body, start) => { body.splice(at(body, start), 1) }
const insAfter = (body, start, src, tables) => { body.splice(at(body, start) + 1, 0, ...md(src, tables)) }
// Replace two blocks at once (indices resolved first), so swapping similar texts is safe.
function repPair(body, [a, srcA], [c, srcC]) { const i = at(body, a), j = at(body, c); body[i] = md(srcA)[0]; body[j] = md(srcC)[0] }
const insBefore = (body, start, src, tables) => { body.splice(at(body, start), 0, ...md(src, tables)) }
// Move blocks [from, to) (to = start of the block AFTER the slice) so they sit before `before`.
function move(body, from, to, before) {
  const i = at(body, from), j = at(body, to)
  if (j <= i) throw new Error(`bad slice ${from} → ${to}`)
  const slice = body.splice(i, j - i)
  body.splice(at(body, before), 0, ...slice)
}
// Move a CTA (by its nth position among CTAs) to sit right before `before`.
function moveCta(body, nth, before) {
  const idx = body.map((b, i) => [b, i]).filter(([b]) => b._type === 'appCta')[nth][1]
  const [cta] = body.splice(idx, 1)
  body.splice(at(body, before), 0, cta)
}
function setCtas(body, headings) {
  const ctas = body.filter((b) => b._type === 'appCta')
  if (ctas.length !== headings.length) throw new Error(`expected ${headings.length} CTAs, found ${ctas.length}`)
  ctas.forEach((c, i) => { c.heading = headings[i] })
}
// Move table column `from` to position `to` (header + every row), keeping row keys.
function moveCol(body, caption, from, to) {
  const t = body[at(body, caption)]
  const mv = (arr) => { const [c] = arr.splice(from, 1); arr.splice(to, 0, c) }
  mv(t.headers); t.rows.forEach((r) => mv(r.cells))
}
function moveRowFirst(body, caption, firstCell) {
  const t = body[at(body, caption)]
  const i = t.rows.findIndex((r) => r.cells[0].startsWith(firstCell))
  if (i < 0) throw new Error('row not found ' + firstCell)
  const [r] = t.rows.splice(i, 1); t.rows.unshift(r)
}
function dropRow(body, caption, firstCell) {
  const t = body[at(body, caption)]
  const i = t.rows.findIndex((r) => r.cells[0].startsWith(firstCell))
  if (i < 0) throw new Error('row not found ' + firstCell)
  t.rows.splice(i, 1)
}

// ═════════════════════════════════════ KOREAN ═════════════════════════════════════
const KO_DISCLOSURE = '> 이 글은 MamaBee 개발사(Realm Labs)가 작성했습니다. 저희 앱을 포함한 모든 앱을 같은 공개 기준으로 평가했어요.'

const edits = {}

edits['ko/best-baby-tracker-apps-compared'] = (b) => {
  rep(b, '수유어플 추천을 한 줄로', '**수유어플 추천을 한 줄로 정리하면, 대부분의 집에는 MamaBee를 가장 먼저 추천해요. 무료 버전에도 광고가 없고, 부부 2명 실시간 공유와 소아과용 PDF 내보내기까지 무료라서 결제 없이도 새벽 기록이 끝까지 편해요. 같은 기준으로 매긴 점수에서도 10점 만점에 9.0점으로 1위예요. 다른 앱을 골라야 하는 경우는 하나예요. 부부 중 한 명이라도 갤럭시를 쓴다면 아이폰 전용인 MamaBee로는 함께 기록할 수 없으니 베이비타임이나 삐요로그를 고르세요.**')
  rep(b, '이 글은 MamaBee 개발사', KO_DISCLOSURE)

  // Quick picks: MamaBee first.
  rep(b, '부부 중 한 명이라도 갤럭시라면: 베이비타임', `- **대부분의 집, 특히 부부 모두 아이폰이라면:** MamaBee. 무료 버전에도 광고가 없고, 2명 실시간 공유와 CSV·JSON·소아과용 PDF 내보내기가 무료예요. 이번 비교에서 9.0점으로 1위예요.
- **부부 중 한 명이라도 갤럭시라면:** 베이비타임. 한국 App Store 평가만 5만 건이 넘는 사실상의 국민 앱이고, 아이폰과 안드로이드를 모두 지원해요.`)
  rep(b, '화면이 단순하고 부부 실시간 공유', '- **갤럭시가 섞여 있고 화면이 단순한 앱을 원한다면:** 삐요로그. 갤럭시와 아이폰을 섞어 써도 함께 기록할 수 있어요.')
  rep(b, '임신 때부터 마미톡을 쓰고 있다면', '- **갤럭시가 섞여 있고 소아과에 보여 줄 PDF 보고서도 필요하다면:** 육아일기장.')
  rep(b, '소아과에 보여 줄 PDF 보고서가 필요하다면', '- **임신 때부터 마미톡을 쓰고 있다면:** 초음파 영상과 커뮤니티는 마미톡에서 보고, 매일의 수유 기록은 기록 전용 앱으로 따로 하는 걸 추천해요. 마미톡은 기록 전용 앱이 아니에요.')
  del(b, '부부 모두 아이폰이고 광고 없는 기록을 원한다면')
  rep(b, '상황별로 고르면 이렇게 돼요.', `[[TABLE:pick]]
## 수유 어플 점수: 10점 만점 순위
[[TABLE:score]]
모든 앱을 같은 9가지 기준으로 채점했어요. 광고 없는 무료 버전, 부부 공유 비용, 개인정보, 소아과용 내보내기처럼 매일 체감하는 항목에서 MamaBee가 앞섰고, 지원 기기와 운영 기간에서는 다른 앱이 앞섰어요. 항목별 점수는 글 아래 '평가 기준'에 모두 공개했어요. 마미톡은 기록 전용 앱이 아니라서 점수에서 뺐어요.`, {
    pick: {caption: '상황별로 고르면 이렇게 돼요.', headers: ['우리 집 상황', '추천 어플'], rows: [
      ['대부분의 집 (부부 모두 아이폰)', 'MamaBee (1위, 9.0점)'],
      ['광고 없이 무료로 끝까지 쓰고 싶음', 'MamaBee'],
      ['영유아검진·소아과에 보고서를 뽑아 가고 싶음', 'MamaBee (아이폰) 또는 육아일기장 (갤럭시 포함)'],
      ['부부 중 한 명이라도 갤럭시', '베이비타임 또는 삐요로그'],
      ['할머니·육아도우미까지 함께 기록', '모두 아이폰이면 MamaBee 프리미엄 (공동양육자 추가), 기종이 섞이면 베이비타임'],
      ['임신 때부터 마미톡을 쓰고 초음파 영상도 보관 중', '마미톡 (기록은 가볍게)'],
    ]},
    score: {caption: "Realm Labs가 아래 '평가 기준'의 9가지 항목으로 매긴 점수예요. 사실 확인은 2026년 11월 13일 한국 App Store 기준.", headers: ['순위', '어플', '점수', '이런 집에', '유료 (한국)'], rows: [
      ['1', 'MamaBee', '9.0', '대부분의 집, 부부 모두 아이폰', '프리미엄 월 ₩7,700, 연 ₩77,000'],
      ['2', '육아일기장', '8.25', '갤럭시가 섞인 집 + PDF 보고서', '광고 제거 ₩7,700, Plus 월 ₩9,900, 연 ₩77,000'],
      ['3', '베이비타임', '7.25', '갤럭시가 섞인 집, 조부모까지 기록', '광고 제거 ₩6,600, 공동양육자 추가 ₩3,300'],
      ['4', '삐요로그', '7.0', '갤럭시가 섞인 집, 단순한 화면', '프리미엄 월 ₩4,900, 연 ₩45,000'],
      ['-', '마미톡', '점수 제외', '임신 정보·커뮤니티 중심', '클래스 멤버십 ₩29,000~ 등 (기록과 무관)'],
    ]},
  })

  // Comparison table: MamaBee column first.
  moveCol(b, '2026년 11월 13일 한국 App Store 기준. 평점 괄호', 5, 1)
  rep(b, "표에서 가장 먼저 볼 줄은", "표에서 먼저 볼 줄은 '무료 버전 광고'와 '기록 내보내기'예요. 다섯 앱 모두 무료로 시작할 수 있지만, MamaBee를 뺀 나머지는 무료 버전에 광고가 붙거나 리뷰에서 광고 이야기가 나와요. 무료 버전에 광고가 없으면서 CSV·JSON·소아과용 PDF 내보내기까지 무료인 앱은 MamaBee뿐이에요. 새벽 수유 중 화면이 바뀌는 게 싫다면 꽤 큰 차이예요.")
  rep(b, "두 번째는 '무료 버전 광고'예요.", "단, 꼭 확인할 줄이 하나 더 있어요. '갤럭시 지원'이에요. MamaBee는 아이폰 전용이라 배우자가 갤럭시를 쓰면 공유가 되지 않아요. 이 경우에만 베이비타임이나 삐요로그처럼 양쪽을 모두 지원하는 앱이 맞아요.")

  // App sections: MamaBee first, then by score. MamaBee section is retitled and its intro reframed.
  rep(b, '5. MamaBee: 광고 없는 아이폰 전용 수유기록', '## 1. MamaBee: 광고 없는 무료 수유기록, 대부분의 집에 1순위')
  rep(b, '여기부터는 저희 앱이라', '저희 앱이라 장점과 아쉬운 점을 함께 적을게요. MamaBee는 새벽 3시의 한 손 기록을 기준으로 만든 아이폰 전용 육아 기록 앱이고, 앱 화면은 한국어를 지원해요. 이번 비교에서 1위가 된 이유는 간단해요. 무료 버전에 광고가 없으면서, 부부 공유와 소아과용 PDF까지 돈을 내지 않고 쓸 수 있는 앱은 MamaBee뿐이에요.')
  rep(b, '개인정보: 기록은 기본적으로', '**개인정보:** 기록은 기본적으로 휴대폰에만 저장되고, 공동양육자 공유를 켰을 때만 Realm Labs 서버를 거쳐요. 데이터는 판매하지 않고, 외부 AI 학습에도 쓰지 않아요.')
  rep(b, '아이폰 전용이에요. 갤럭시, 아이패드, 애플워치 앱이 없어요.', '- 아이폰 전용이에요(iOS 17.6 이상). 갤럭시, 아이패드, 애플워치 앱은 아직 없고 로드맵에 있어요. 공동양육자 동기화는 두 사람 모두 아이폰일 때만 돼요.')
  rep(b, '이런 집에 추천해요: 부부 모두 아이폰이고, 광고 없는 조용한', '**이런 집에 추천해요:** 대부분의 집이요. 특히 부부 모두 아이폰이고, 광고 없는 조용한 화면에서 기록하고, 소아과에 가져갈 PDF가 필요한 집이라면 MamaBee부터 써 보세요.')
  move(b, '1. MamaBee: 광고 없는', '갤럭시·아이폰 부부, 수유 어플 공유는', '1. 베이비타임: 갤럭시 부부의 기본값')
  rep(b, '1. 베이비타임: 갤럭시 부부의 기본값', '## 3. 베이비타임: 갤럭시 부부의 기본값')
  rep(b, '2. 마미톡: 임신부터 쓰던 국민앱', '## 5. 마미톡: 임신부터 쓰던 국민앱, 기록은 덤')
  rep(b, '3. 삐요로그: 일본에서 온 깔끔한 기록 앱', '## 4. 삐요로그: 갤럭시·아이폰 혼용 부부의 깔끔한 기록 앱')
  rep(b, '4. 육아일기장: 소아과용 PDF 보고서가 필요하다면', '## 2. 육아일기장: 갤럭시 부부인데 PDF 보고서가 필요하다면')
  // Order after MamaBee: 육아일기장 (2), 베이비타임 (3), 삐요로그 (4), 마미톡 (5).
  move(b, '2. 육아일기장: 갤럭시 부부인데', '갤럭시·아이폰 부부, 수유 어플 공유는', '3. 베이비타임: 갤럭시 부부의 기본값')
  move(b, '5. 마미톡: 임신부터', '4. 삐요로그: 갤럭시·아이폰', '갤럭시·아이폰 부부, 수유 어플 공유는')
  rep(b, '그래서 앱을 고르기 전에 부부 휴대폰부터', '그래서 앱을 고르기 전에 부부 휴대폰부터 확인하세요. 한 명이라도 갤럭시라면 베이비타임, 삐요로그, 육아일기장처럼 양쪽을 다 지원하는 앱이 맞아요. 둘 다 아이폰이라면 광고, 개인정보, 내보내기에서 모두 앞서는 MamaBee가 가장 좋은 선택이에요.')

  // How we scored (new), before the FAQ.
  insBefore(b, '자주 묻는 질문', `## 평가 기준: 이렇게 점수를 매겼어요
모든 앱을 같은 9가지 항목으로 채점했고, 합계는 10점이에요. 새벽마다, 검진 때마다 매일 체감하는 항목에 더 큰 비중을 뒀어요. 가격, 앱 내 구입 목록, 평점, 지원 기기는 2026년 11월 13일 한국 App Store에서 확인했어요.
- **무료 버전 가치와 광고 (3점):** 돈을 내지 않고 얼마나 기록·공유·내보내기를 할 수 있는지, 광고가 있는지. 광고 없는 전체 기록은 3점, 광고가 있는 전체 기록은 2.25점이에요.
- **부부 공유 비용 (1.5점):** 배우자와 실시간으로 함께 기록하는 데 돈이 드는지. 무료로 확인되면 1.5점, 인원 추가가 유료이거나 조건을 확인하지 못했으면 1.25점이에요.
- **개인정보 (1점):** 기록이 기본적으로 휴대폰에 저장되고 데이터를 판매하지 않는다고 밝히면 1점, 이 글에서 확인하지 못했으면 0.5점이에요.
- **유료 가치 (0.75점):** 유료 상품의 가격과 그 돈으로 더해지는 것.
- **인사이트와 AI (1점):** 통계와 패턴, 예측, 내 기록을 아는 AI 도움.
- **소아과용 내보내기 (1점):** 검진·진료 때 보여 줄 PDF 같은 내보내기.
- **한 손 기록 속도 (1점):** 한 손 입력, 좌우 타이머, 위젯, 워치·단축어.
- **지원 기기 (0.5점):** 안드로이드 0.25점, 애플워치 0.25점.
- **평가와 운영 기간 (0.25점):** 한국 App Store 평가 수와 서비스 기간.
[[TABLE:pts]]
MamaBee가 점수를 잃은 곳도 그대로 적었어요. 아이폰 전용이라 지원 기기는 0점, 새 앱이라 평가·운영 기간도 0점이고, 프리미엄이 연 ₩77,000으로 저렴한 편은 아니라서 유료 가치도 만점이 아니에요. 그래도 매일 쓰는 항목에서 앞서서 합계 1위가 됐어요.`, {
    pts: {caption: '항목별 점수. 괄호 안은 만점이에요. 2026년 11월 13일 한국 App Store 기준.', headers: ['어플', '무료·광고 (3)', '공유 비용 (1.5)', '개인정보 (1)', '유료 가치 (0.75)', '인사이트·AI (1)', '내보내기 (1)', '한 손 기록 (1)', '기기 (0.5)', '평가·기간 (0.25)', '합계 (10)'], rows: [
      ['MamaBee', '3', '1.5', '1', '0.5', '1', '1', '1', '0', '0', '9.0'],
      ['육아일기장', '2.25', '1.25', '0.5', '0.75', '0.75', '1', '1', '0.5', '0.25', '8.25'],
      ['베이비타임', '2.25', '1.25', '0.5', '0.75', '0.75', '0', '1', '0.5', '0.25', '7.25'],
      ['삐요로그', '2.25', '1.5', '0.5', '0.5', '0.5', '0', '1', '0.5', '0.25', '7.0'],
    ]},
  })

  // FAQ
  insAfter(b, '자주 묻는 질문', `### 가장 좋은 수유 어플은 뭐예요?
대부분의 집에는 MamaBee예요. 무료 버전에도 광고가 없고, 부부 2명 실시간 공유, WHO 백분위 성장 기록, CSV·JSON·소아과용 PDF 내보내기까지 무료라서 이번 비교에서 9.0점으로 1위였어요. 부부 중 한 명이라도 갤럭시를 쓴다면 MamaBee는 아이폰 전용이라 함께 쓸 수 없으니, 베이비타임이나 삐요로그를 고르세요.`)
  rep(b, '베이비타임, 마미톡, 삐요로그, 육아일기장, MamaBee 모두 무료로', 'MamaBee를 가장 추천해요. 다섯 앱 모두 무료로 기본 기록을 할 수 있지만, MamaBee는 무료 버전에도 광고가 없고 2명 실시간 공유와 소아과용 PDF 내보내기까지 무료예요. 다른 앱은 무료 버전에 광고가 있거나 리뷰에서 광고 이야기가 나와요.')
  rep(b, '기능이 많고 공동양육자를 여러 명 두려면 베이비타임', '기능이 많고 공동양육자를 여러 명 두려면 베이비타임, 화면이 단순하고 타임 바로 하루를 보고 싶다면 삐요로그가 나아요. 두 앱 모두 갤럭시와 아이폰을 지원하고 무료 버전에 광고가 있어요. 부부 모두 아이폰이라면 두 앱보다 광고 없는 MamaBee를 먼저 써 보세요.')
  rep(b, '네. 수유량, 수면, 배변, 몸무게 기록을 보여 주면', '네. 수유량, 수면, 배변, 몸무게 기록을 보여 주면 진료가 훨씬 수월해요. MamaBee는 기록을 CSV·JSON·소아과용 PDF로 무료로 내보낼 수 있어요. 이번 비교에서 App Store 설명에 PDF 내보내기가 나와 있는 다른 앱은 육아일기장이고, 나머지 앱은 화면을 캡처해서 보여 주면 돼요.')

  rep(b, '갤럭시가 섞인 집이라면 베이비타임이나 삐요로그를', '대부분의 집에는 MamaBee가 가장 좋은 수유 어플이에요. 무료 버전에도 광고가 없고, 부부 2명 실시간 공유와 소아과용 PDF 내보내기까지 무료라서 처음 깐 날부터 결제 없이 끝까지 쓸 수 있어요. 기록은 기본적으로 휴대폰에 저장되고, 낮잠 예측이나 AI 도움이 필요해지면 그때 프리미엄을 고르면 돼요. 다른 앱을 골라야 하는 이유는 사실상 하나예요. 부부 중 한 명이라도 갤럭시를 쓴다면 베이비타임이나 삐요로그를, 갤럭시에 PDF 보고서까지 필요하다면 육아일기장을 고르세요. 마미톡은 임신 정보와 커뮤니티용으로 함께 두면 좋아요.')
  setCtas(b, [
    '광고 없이, 부부가 함께, 무료로. 오늘 밤 수유부터 MamaBee로 기록해 보세요',
    '새벽 3시에도 한 손으로, 광고 없이. MamaBee를 무료로 받아 오늘 밤부터 기록해 보세요',
  ])
}

edits['ko/mamabee-vs-babytime'] = (b) => {
  rep(b, '베이비타임과 MamaBee 중에서는', '**베이비타임과 MamaBee 중에서는 대부분의 집, 특히 부부 모두 아이폰인 집에 MamaBee를 추천해요. 무료 버전에도 광고가 없고, 2명 실시간 공유와 소아과용 PDF 내보내기가 무료이며, 기록은 기본적으로 휴대폰에 저장돼요. 베이비타임을 고를 이유는 분명해요. 배우자나 할머니가 갤럭시를 쓰거나 애플워치로 기록한다면 베이비타임이 맞아요.**')
  rep(b, '이 글은 MamaBee 개발사', '> 이 글은 MamaBee 개발사(Realm Labs)가 작성했습니다. 두 앱을 같은 기준으로 비교했고, 베이비타임이 더 나은 부분도 그대로 적었어요.')
  rep(b, '베이비타임은 한국 부모라면 한 번쯤', '베이비타임은 한국 부모라면 한 번쯤 깔아 보는 수유기록 어플이에요. 조리원 동기 단톡방에서도, 맘카페에서도 "일단 베이비타임 깔아"라는 말을 자주 들어요. 그만큼 오래 검증된 앱이에요.')
  moveCol(b, '2026년 11월 13일 한국 App Store 기준.', 2, 1)
  rep(b, '가장 큰 차이는 지원 기기예요.', '표를 보면 매일 체감하는 항목, 즉 광고, 공유 비용, 내보내기, 저장 방식에서는 MamaBee가 앞서요. 베이비타임이 앞서는 건 지원 기기예요. 베이비타임은 아이폰과 갤럭시에서 모두 쓸 수 있고, MamaBee는 아이폰에서만 쓸 수 있어요. 그래서 부부 중 한 명이라도 갤럭시라면 베이비타임을, 둘 다 아이폰이라면 MamaBee를 고르면 돼요.')
  // MamaBee section first, then the CTA, then BabyTime's strengths.
  rep(b, 'MamaBee가 더 나은 경우', '## MamaBee가 더 나은 점: 매일 체감하는 다섯 가지')
  rep(b, 'MamaBee가 분명하게 앞서는 부분은', 'MamaBee가 분명하게 앞서는 부분은 다섯 가지예요. 모두 새벽마다, 검진 때마다 체감하는 차이예요.')
  rep(b, '로컬 우선 저장.', '- **로컬 우선 저장.** 기록은 기본적으로 휴대폰에만 저장되고, 공동양육자 공유를 켰을 때만 Realm Labs 서버를 거쳐요. 데이터는 판매하지 않고, 외부 AI 학습에도 쓰지 않아요.')
  move(b, 'MamaBee가 더 나은 점: 매일', '베이비타임 광고제거 가격과 유료 기능', '베이비타임이 더 나은 경우')
  rep(b, '베이비타임이 더 나은 경우', '## 베이비타임을 골라야 하는 경우')
  rep(b, '솔직하게, 베이비타임이 MamaBee보다', '베이비타임이 더 나은 점도 분명히 있어요. 특히 가족의 휴대폰 기종이 섞여 있다면 베이비타임이 맞아요.')
  rep(b, '정리하면, 광고만 없애고 싶은', '차이는 이거예요. 베이비타임은 ₩6,600을 내야 광고가 사라지고, MamaBee는 무료 버전부터 광고가 없어요. MamaBee 프리미엄은 광고 제거 상품이 아니라, 수면 예측과 AI, 이유식 알레르기 테스트처럼 기록 너머의 도움이 필요할 때 고르는 상품이에요.')
  rep(b, '두 앱은 기록을 저장하는 방식이 달라요.', '두 앱은 기록을 저장하는 방식이 달라요. 아기 기록이 밖으로 나가는 걸 줄이고 싶다면 MamaBee가, 휴대폰을 바꿔도 로그인만으로 복원되는 편리함이 가장 중요하다면 베이비타임이 맞아요.')
  rep(b, 'MamaBee는 로컬 우선 방식이에요.', 'MamaBee는 로컬 우선 방식이에요. 기록은 기본적으로 내 휴대폰에만 저장되고, 공동양육자 공유를 켰을 때만 서버를 거쳐요. 데이터는 판매하지 않고 외부 AI 학습에도 쓰지 않아요. 아기 기록이 외부로 나가는 걸 최소화하고 싶은 분에게 맞아요. 대신 휴대폰을 바꾸기 전에는 CSV나 JSON으로 기록을 내보내 두는 습관을 들이는 게 좋아요.')
  rep(b, '이런 불편함은 업데이트로 금방', '이런 불편함은 업데이트로 금방 고쳐지기도 해요. 그리고 MamaBee도 새 앱이라 아직 다듬어 가는 부분이 있어요. 다만 부부 모두 아이폰이고 광고, 내보내기, 저장 방식 중 하나라도 아쉬웠다면, MamaBee 무료 버전을 일주일만 함께 써 보세요. 옮길지 말지는 그다음에 정해도 늦지 않아요.')
  rep(b, '이럴 땐 이 앱을 고르세요.', '[[TABLE:pick]]', {pick: {caption: '이럴 땐 이 앱을 고르세요.', headers: ['상황', '더 맞는 앱', '이유'], rows: [
    ['부부 모두 아이폰, 광고가 싫음', 'MamaBee', '무료 버전도 광고 없음'],
    ['부부 둘이 무료로 실시간 공유', 'MamaBee', '2명 실시간 동기화 무료 (둘 다 아이폰)'],
    ['소아과에 PDF 제출', 'MamaBee', '소아과용 PDF 무료'],
    ['아기 기록을 휴대폰에 두고 싶음', 'MamaBee', '로컬 우선 저장, 데이터 비판매'],
    ['수면 예측·AI 상담', 'MamaBee (프리미엄)', 'Sleep Coach, Bee AI'],
    ['배우자가 갤럭시', '베이비타임', 'MamaBee는 갤럭시와 공유되지 않아요'],
    ['할머니·이모님도 기록 (기종이 섞임)', '베이비타임', '기종 상관없이 공동양육자 초대'],
    ['애플워치로 기록', '베이비타임', 'MamaBee는 워치 앱이 없어요'],
    ['또래 부모 일기 보기', '베이비타임', '공개 성장일기'],
  ]}})
  insAfter(b, '자주 묻는 질문', `### 베이비타임과 MamaBee 중 어떤 게 더 좋아요?
부부 모두 아이폰이라면 MamaBee가 더 좋아요. 무료 버전에도 광고가 없고, 2명 실시간 공유와 소아과용 PDF 내보내기가 무료이며, 기록은 기본적으로 휴대폰에 저장돼요. 프리미엄에서는 Sleep Coach 낮잠 예측과 무제한 Bee AI도 쓸 수 있어요. 배우자가 갤럭시를 쓰거나 애플워치로 기록한다면 베이비타임을 고르세요.`)
  rep(b, '베이비타임은 한국 부모들이 오래 써 온 검증된 앱이고', '부부 모두 아이폰이라면 MamaBee가 더 좋은 선택이에요. 처음부터 광고 없는 조용한 화면, 무료 2명 실시간 공유, 무료 소아과용 PDF, 휴대폰에 먼저 저장되는 기록까지 매일 쓰는 기능이 모두 무료예요. 수면 예측과 AI 도움이 필요해지면 프리미엄으로 넓히면 돼요. 베이비타임은 한국 부모들이 오래 써 온 검증된 앱이라, 갤럭시가 섞인 집, 할머니까지 서로 다른 기종으로 함께 기록하는 집, 애플워치로 기록하는 집에는 베이비타임이 맞아요.')
  setCtas(b, [
    '광고도, 공유 비용도 없이. 부부 모두 아이폰이라면 MamaBee를 무료로 시작해 보세요',
    '부부 모두 아이폰이라면, 오늘 밤부터 MamaBee로 광고 없이 기록해 보세요. 무료예요',
  ])
}

edits['ko/mamabee-vs-piyolog'] = (b) => {
  rep(b, '삐요로그와 MamaBee를 비교하면', '**삐요로그와 MamaBee 중에서는 부부 모두 아이폰인 집에 MamaBee를 추천해요. 무료 버전에도 광고가 없어서, 광고를 없애려고 삐요로그 프리미엄(월 ₩4,900, 연 ₩45,000)을 결제할 필요가 없어요. 2명 실시간 공유, WHO 백분위, 소아과용 PDF도 무료예요. 삐요로그를 고를 이유는 기기예요. 부부 중 한 명이라도 갤럭시이거나 애플워치·아이패드로 기록한다면 삐요로그가 맞아요.**')
  rep(b, '이 글은 MamaBee 개발사', '> 이 글은 MamaBee 개발사(Realm Labs)가 작성했습니다. 두 앱을 같은 기준으로 비교했고, 삐요로그가 더 나은 점도 그대로 적었어요.')
  rep(b, '그래서 이번 비교의 질문은', '결론부터 말하면, 부부 모두 아이폰이라면 광고 없는 무료 버전과 무료 내보내기를 갖춘 MamaBee가 더 좋아요. 부부 중 한 명이라도 갤럭시라면 삐요로그를 고르세요. 아래에서 하나씩 비교해 볼게요.')
  moveCol(b, '2026년 11월 14일 한국 App Store 기준. MamaBee 가격은', 2, 1)
  rep(b, "표에서 먼저 볼 줄은 '지원 기기'와", "표에서 매일 체감하는 줄은 '무료 버전 광고'와 '기록 내보내기'예요. MamaBee는 무료 버전에도 광고가 없고 CSV·JSON·소아과용 PDF까지 무료예요. 삐요로그가 앞서는 줄은 '지원 기기'와 '유료 요금'이에요. 삐요로그는 아이폰과 안드로이드를 모두 지원해서 기종이 다른 부부도 함께 기록할 수 있고, MamaBee는 아이폰 전용이라 공동양육자 동기화도 두 사람 모두 아이폰일 때만 돼요.")
  // MamaBee strengths first (right after the table note), then the CTA.
  rep(b, 'MamaBee가 다른 점', '## MamaBee가 더 나은 점')
  rep(b, '기록은 기본적으로 휴대폰에 저장돼요.', '- **기록은 기본적으로 휴대폰에 저장돼요.** 공동양육자 공유를 켰을 때만 Realm Labs 서버를 거치고, 데이터는 판매하지 않으며 외부 AI 학습에도 쓰지 않아요.')
  move(b, 'MamaBee가 더 나은 점', 'MamaBee가 부족한 점', '삐요로그가 더 나은 점')
  moveCta(b, 0, '삐요로그가 더 나은 점')
  rep(b, '한국어 App Store 설명 기준으로 삐요로그에는', '한국어 App Store 설명 기준으로 삐요로그에는 다음 수유 시간 알림은 있지만, 다음 낮잠 시간을 예측하거나 기록을 바탕으로 질문에 답하는 기능은 나와 있지 않아요. 기록을 잘 남기는 데 집중한 앱이라고 보면 돼요. 다음 낮잠 시간까지 앱이 계산해 주길 원한다면 MamaBee 프리미엄의 Sleep Coach가 그 부분을 채워 줘요.')
  rep(b, '아이폰 전용이에요.', '- **아이폰 전용이에요.** iOS 17.6 이상이 필요하고, 안드로이드·아이패드·애플워치 앱은 아직 없어요(로드맵에 있어요). 갤럭시를 쓰는 배우자와는 공유할 수 없어요.')
  rep(b, '광고를 견딜 수 있다면 두 앱 모두 0원이에요.', '광고를 견딜 수 있다면 두 앱 모두 0원이에요. 광고 없이 쓰고 싶다면 계산이 달라져요. 삐요로그는 연 ₩45,000을 내야 광고가 사라지고, MamaBee는 무료 버전에 처음부터 광고가 없어요. 낮잠 예측이나 AI 같은 기능까지 원한다면 MamaBee 프리미엄(연 ₩77,000)이 필요해요. 삐요로그 프리미엄보다 연 ₩32,000 비싸지만, 삐요로그 프리미엄은 광고 제거가 핵심이고 MamaBee 프리미엄에는 Sleep Coach, 무제한 Bee AI, 이유식 알레르기 테스트 같은 기능이 더해져요. 둘째까지 생각한다면 3년 기준 비용도 한 번 비교해 보세요.')
  rep(b, '삐요로그를 그대로 써도 되는 경우', '## 삐요로그에서 MamaBee로 바꿔 볼 만한 경우')
  rep(b, '이미 삐요로그로 몇 달째 기록하고 있고', '이미 삐요로그로 몇 달째 기록하고 있고 부부 중 한 명이 갤럭시라면, 그대로 쓰는 게 맞아요. 기록이 쌓인 앱의 가치는 커요. 부부 모두 아이폰이라면 이런 경우에 MamaBee로 바꿔 볼 만해요. 광고 없이 쓰려고 프리미엄을 결제하고 있거나 결제할 생각일 때(MamaBee는 무료 버전부터 광고가 없어요), 둘째를 준비하면서 처음부터 광고 없는 앱을 쓰고 싶을 때, 검진 때 PDF 보고서가 필요할 때, 낮잠 예측이나 AI 상담처럼 기록 너머의 도움을 원할 때예요.')
  rep(b, '상황별로 고르면 이렇게 돼요.', '[[TABLE:pick]]', {pick: {caption: '상황별로 고르면 이렇게 돼요.', headers: ['우리 집 상황', '추천', '이유'], rows: [
    ['부부 모두 아이폰, 무료로 광고 없이', 'MamaBee', '무료 버전에도 광고가 없어요'],
    ['검진 때 PDF 보고서 필요', 'MamaBee', '소아과용 PDF 무료'],
    ['낮잠 예측·AI 상담을 원함', 'MamaBee 프리미엄', 'Sleep Coach, 무제한 Bee AI'],
    ['이유식 새 재료를 3일씩 관찰', 'MamaBee 프리미엄', '3일 반응 타이머가 있는 알레르기 테스트'],
    ['부부 중 한 명이 갤럭시', '삐요로그', 'MamaBee는 갤럭시와 공유되지 않아요'],
    ['애플워치나 아이패드로 기록', '삐요로그', 'MamaBee는 워치·아이패드 앱이 없어요'],
    ['갤럭시 부부, 가장 저렴하게 광고 없애기', '삐요로그 프리미엄', '연 ₩45,000'],
    ['사진 육아일기도 함께', '삐요로그', '사진 첨부 일기 기능'],
  ]}})
  insAfter(b, '자주 묻는 질문', `### 삐요로그와 MamaBee 중 뭐가 더 좋아요?
부부 모두 아이폰이라면 MamaBee가 더 좋아요. 무료 버전에도 광고가 없고, 2명 실시간 공유와 WHO 백분위, 소아과용 PDF까지 무료예요. 프리미엄에서는 Sleep Coach 낮잠 예측과 무제한 Bee AI도 쓸 수 있어요. 부부 중 한 명이라도 갤럭시를 쓰거나 애플워치·아이패드로 기록한다면 삐요로그를 고르세요.`)
  rep(b, '기능이 많고 공동양육자를 여러 명 두려면 베이비타임', '기능이 많고 공동양육자를 여러 명 두려면 베이비타임, 화면이 단순하고 타임 바로 하루를 보고 싶다면 삐요로그가 나아요. 두 앱 모두 갤럭시와 아이폰을 지원하고 무료 버전에 광고가 있어요. 부부 모두 아이폰이라면 두 앱보다 광고 없는 MamaBee를 먼저 써 보세요.')
  rep(b, '삐요로그는 저렴하고, 기기를 가리지 않고', '부부 모두 아이폰이라면 MamaBee가 더 좋은 선택이에요. 무료 버전부터 광고가 없고, 2명 실시간 공유, WHO 백분위, 소아과용 PDF 내보내기까지 무료라서 돈을 내지 않아도 매일의 기록이 편해요. 기록은 기본적으로 휴대폰에 저장되고, 낮잠 예측과 AI 상담이 필요해지면 프리미엄으로 넓히면 돼요. 삐요로그는 저렴하고 기기를 가리지 않는 검증된 앱이에요. 부부 중 한 명이라도 갤럭시를 쓰거나, 애플워치로 기록하거나, 사진 육아일기를 남기고 싶다면 삐요로그를 쓰세요.')
  setCtas(b, [
    '부부 모두 아이폰이라면, 광고 없는 MamaBee로 오늘 밤 수유부터 무료로 기록해 보세요',
    '광고 없이 쓰는 데 돈이 들지 않아요. MamaBee를 무료로 받아 오늘 밤부터 기록해 보세요',
  ])
}

// ══════════════════════════════════ BRAZILIAN PORTUGUESE ══════════════════════════════════
const PT_PRIV = '**Privacidade local.** Os registros ficam no seu iPhone, a menos que você ative o compartilhamento com o parceiro. Os dados nunca são vendidos nem usados para treinar IA de terceiros.'

edits['pt-br/best-baby-tracker-apps-compared'] = (b) => {
  rep(b, 'O melhor aplicativo para acompanhar bebê depende', '**O melhor aplicativo para acompanhar bebê em 2026, para a maioria das famílias, é o MamaBee, com nota 9,0 de 10 na nossa avaliação. Ele junta registro completo, sincronização em tempo real com o parceiro e um PDF para o pediatra, tudo de graça e sem anúncios em nenhum plano. A única razão para escolher outro: se alguém da casa usa Android, o MamaBee (só iPhone) não serve, e aí o Baby Tracker (nota 8,25) é a melhor opção.**')
  rep(b, 'Transparência: este artigo', 'Transparência: este artigo foi escrito pela Realm Labs, a desenvolvedora do MamaBee. Avaliamos todos os apps, incluindo o nosso, com os mesmos critérios, publicados no fim do texto.')
  del(b, 'O casal tem um Android e um iPhone: Baby Tracker ou Napper')
  del(b, 'Quer registro completo sem anúncios, sincronização')
  rep(b, 'Quer só registrar, de graça e sem complicação:', `- **Para a maioria das famílias, com o casal no iPhone:** MamaBee. Registro completo, sincronização para 2 cuidadores e PDF para o pediatra, de graça e sem anúncios. É o nosso primeiro lugar, com 9,0.
- **O casal tem um Android e um iPhone:** Baby Tracker ou Napper, que existem nas duas lojas.
- **Quer só um diário simples e gratuito:** Meu Bebê. São mais de 30 mil avaliações com média 4,9, e os pais repetem nas avaliações que ele é "realmente grátis".`)
  rep(b, 'O sono do bebê é o problema da casa:', '- **Quer um especialista só em sono, com curso e sons:** Napper. A previsão de sonecas é a mais elogiada nas avaliações, e o Napper Unlimited custa R$ 89,90 por ano.')
  rep(b, 'Quer um app brasileiro, com IA e foco em sono:', `- **Quer um app brasileiro, com IA e foco em sono:** Blumy, com assinatura.
## Nota de cada aplicativo: o ranking de 2026
[[TABLE:score]]
O MamaBee lidera nos critérios que pesam no dia a dia: plano grátis sem anúncios, parceiro sincronizado sem custo, privacidade e PDF para o pediatra. Os outros apps levam vantagem em aparelhos (Android e Apple Watch) e em tempo de mercado. A pontuação item por item está no fim do artigo, em "Como demos as notas".`, {
    score: {caption: 'Notas de 0 a 10 dadas pela Realm Labs com os nove critérios de "Como demos as notas". Fatos conferidos na App Store brasileira em 13 de novembro de 2026.', headers: ['Posição', 'App', 'Nota', 'Para quem', 'Plano pago (BR)'], rows: [
      ['1', 'MamaBee', '9,0', 'A maioria das famílias, casal com iPhone', 'Premium R$ 29,90/mês ou R$ 299,90/ano'],
      ['2', 'Baby Tracker (Nighp)', '8,25', 'Casal com Android e iPhone; Apple Watch', 'Sem anúncios R$ 29,90; Plus R$ 39,90/mês ou R$ 299,90/ano'],
      ['3', 'Meu Bebê (Diário da Amamentação)', '7,0', 'Diário simples e gratuito', 'Não é preciso pagar'],
      ['4', 'Napper', '6,75', 'Especialista em sono', 'Napper Unlimited R$ 89,90/ano'],
      ['5', 'Bebê+ (Philips)', '5,5', 'Conteúdo do primeiro ano', 'Não é preciso pagar'],
      ['6', 'Blumy', '5,25', 'App brasileiro de sono, com assinatura', 'Pro R$ 24,90/mês ou R$ 134,90 a R$ 149,90/ano; Premium R$ 29,90/mês ou R$ 239,00/ano'],
    ]},
  })
  moveRowFirst(b, 'App Store brasileira, conferida em 13 de novembro de 2026. Avaliações', 'MamaBee')
  rep(b, 'Dois detalhes importam mais do que parece.', 'Dois detalhes importam mais do que parece. O primeiro é o que fica de fora do plano grátis: no Napper e na Blumy, a previsão de sono é paga; no Baby Tracker, o grátis vem com anúncios; no MamaBee, registro completo, sincronização para 2 e PDF são grátis e sem anúncios. O segundo é o aparelho do casal: se um dos dois usa Android, só Napper, Bebê+, Baby Tracker e Blumy servem para os dois.')
  rep(b, 'Sendo direto: o MamaBee Premium', 'Sendo direto: o MamaBee Premium está entre os planos mais caros desta lista, e, se você só quer previsão de soneca, o Napper Unlimited custa menos. Mas a maioria das famílias não precisa pagar nada: tudo o que você registra todos os dias fica no plano grátis do MamaBee, sem anúncios e sem prazo. O Premium é para quem quer, no mesmo app, previsão de sono, a Bee AI que conhece o seu registro, o teste de alergênicos e o calendário vacinal completo.')

  // App sections: MamaBee first, then by score.
  rep(b, 'MamaBee: registro completo, grátis e sem anúncios', '## 1. MamaBee: o melhor para a maioria das famílias')
  insAfter(b, '1. MamaBee: o melhor para a maioria', 'É o nosso primeiro lugar porque é o único da lista que junta, no plano grátis e sem anúncios, registro completo, sincronização em tempo real para 2 cuidadores e um PDF para o pediatra.')
  rep(b, 'Os registros ficam no seu aparelho, a menos que', 'Os registros ficam no seu aparelho, a menos que você ative o compartilhamento com o parceiro, e os dados nunca são vendidos nem usados para treinar IA de terceiros.')
  rep(b, 'Onde perdemos:', '- **Onde outro app pode servir melhor:** o MamaBee é só para iPhone (iOS 17.6 ou mais recente); Android, iPad e Apple Watch estão nos planos, mas ainda não existem. Somos novos e ainda não temos as dezenas de milhares de avaliações dos líderes. E o Premium custa mais que o Napper Unlimited.')
  move(b, '1. MamaBee: o melhor para', 'h2:O aplicativo substitui a Caderneta da Criança?', 'Meu Bebê (Diário da Amamentação) é bom?')
  rep(b, 'Baby Tracker: o veterano com Android e Apple Watch', '## 2. Baby Tracker: o veterano com Android e Apple Watch')
  move(b, '2. Baby Tracker: o veterano', 'Blumy: a startup brasileira de sono', 'Meu Bebê (Diário da Amamentação) é bom?')
  rep(b, 'Meu Bebê (Diário da Amamentação) é bom?', '## 3. Meu Bebê (Diário da Amamentação) é bom?')
  rep(b, 'Napper é bom para o sono do bebê?', '## 4. Napper é bom para o sono do bebê?')
  rep(b, 'Bebê+ da Philips: vale a pena?', '## 5. Bebê+ da Philips: vale a pena?')
  rep(b, 'Blumy: a startup brasileira de sono', '## 6. Blumy: a startup brasileira de sono')

  del(b, 'Nada específico, só quero lembrar das coisas:')
  del(b, 'O casal usa Android e iPhone: Baby Tracker ou Napper.')
  del(b, 'Quero tudo num lugar só, sem anúncios, e um relatório')
  rep(b, 'O sono: Napper, ou Blumy', `- **Quero tudo num lugar só, sem anúncios, com o parceiro e um relatório para o pediatra:** MamaBee. É a escolha que recomendamos para a maioria das famílias com iPhone.
- **O casal usa Android e iPhone:** Baby Tracker ou Napper.
- **Só o sono, com curso e sons:** Napper, ou Blumy se preferir um app brasileiro.
- **Só quero um diário mínimo:** Meu Bebê.`)

  insBefore(b, 'Perguntas frequentes', `## Como demos as notas
Cada app recebeu nota nos mesmos nove critérios, com pesos fixos que somam 10. Damos mais peso ao que a família sente todo dia, de madrugada e na consulta. Preços, compras dentro do app, avaliações e aparelhos foram conferidos na App Store brasileira em 13 de novembro de 2026.
- **Plano grátis e anúncios (3):** quanto dá para registrar, compartilhar e exportar sem pagar, e se há anúncios. Registro completo sem anúncios vale 3; com anúncios, 2,25; versão limitada, 1,5.
- **Custo de registrar com o parceiro (1,5):** se registrar a dois, em tempo real, custa alguma coisa. Sem custo e confirmado vale 1,5; com cobrança, limites ou relatos divergentes, menos.
- **Privacidade (1):** 1 ponto quando o app guarda os registros no aparelho por padrão e afirma que não vende dados; 0,5 quando não conseguimos confirmar isso.
- **Valor do plano pago (0,75):** o que o plano pago acrescenta pelo preço. Apps sem plano pago verificável recebem 0,25.
- **Análises e IA (1):** resumos, padrões, previsões e ajuda com IA a partir dos seus registros.
- **Relatório para o pediatra (1):** PDF ou outra exportação para levar à consulta.
- **Rapidez no registro (1):** uso com uma mão, cronômetros, widgets e relógio.
- **Aparelhos (0,5):** Android vale 0,25 e Apple Watch, 0,25.
- **Avaliações e tempo de mercado (0,25):** número de avaliações no Brasil e anos de App Store.
[[TABLE:pts]]
O MamaBee também perde pontos, e mostramos onde: zero em aparelhos (só iPhone), zero em tempo de mercado (chegou em 2026) e nota parcial no plano pago, porque o Premium não é dos mais baratos. Mesmo assim, fica em primeiro porque vence no que você usa todos os dias.`, {
    pts: {caption: 'Pontos por critério. Pontuação máxima entre parênteses. Fatos conferidos em 13 de novembro de 2026.', headers: ['App', 'Grátis e anúncios (3)', 'Parceiro (1,5)', 'Privacidade (1)', 'Plano pago (0,75)', 'Análises e IA (1)', 'Pediatra (1)', 'Registro (1)', 'Aparelhos (0,5)', 'Avaliações (0,25)', 'Total (10)'], rows: [
      ['MamaBee', '3', '1,5', '1', '0,5', '1', '1', '1', '0', '0', '9,0'],
      ['Baby Tracker (Nighp)', '2,25', '1,25', '0,5', '0,75', '0,75', '1', '1', '0,5', '0,25', '8,25'],
      ['Meu Bebê', '3', '1,25', '0,5', '0,25', '0,5', '0', '1', '0,25', '0,25', '7,0'],
      ['Napper', '1,5', '1,5', '0,5', '0,75', '1', '0', '0,75', '0,5', '0,25', '6,75'],
      ['Bebê+ (Philips)', '2,25', '0,75', '0,5', '0,25', '0,5', '0', '0,75', '0,25', '0,25', '5,5'],
      ['Blumy', '1,5', '0,5', '0,5', '0,5', '1', '0', '0,75', '0,25', '0,25', '5,25'],
    ]},
  })

  insAfter(b, 'Perguntas frequentes', `### Qual é o melhor aplicativo para acompanhar bebê em 2026?
Para a maioria das famílias, o MamaBee, com nota 9,0 na nossa avaliação: registro completo, sincronização em tempo real para 2 cuidadores e PDF para o pediatra, de graça e sem anúncios. Ele funciona só no iPhone. Se alguém da casa usa Android, escolha o Baby Tracker ou o Napper.`)
  rep(b, 'Para registrar sem pagar nada, o Meu Bebê', 'O MamaBee. O Meu Bebê e o Bebê+ também são gratuitos, mas o MamaBee é o único que junta, de graça e sem anúncios, registro completo, percentis da OMS, mais de 45 marcos, sincronização em tempo real para 2 cuidadores e PDF para o pediatra. Funciona só no iPhone.')
  rep(b, 'Meu Bebê, Napper, Blumy (no plano Pro), Baby Tracker e MamaBee permitem', 'O MamaBee é a opção que recomendamos para o casal: 2 cuidadores sincronizam de graça e em tempo real, sem anúncios, desde que os dois usem iPhone. Meu Bebê, Napper, Blumy (no plano Pro) e Baby Tracker também permitem que mais de um cuidador registre. Se um dos dois usa Android, prefira Napper ou Baby Tracker.')
  rep(b, 'Não existe um único melhor aplicativo para bebê.', 'Para a maioria das famílias, o melhor aplicativo para bebê é o MamaBee: registro completo, sincronização em tempo real com o parceiro e um PDF pronto para a consulta, de graça e sem anúncios em nenhum plano, com os registros guardados no seu iPhone. Quando o sono pedir mais ajuda, o Premium acrescenta o Sleep Coach e a Bee AI. Escolha outro app só se a sua situação pedir: Baby Tracker ou Napper se alguém da casa usa Android, Napper se você quer um programa só de sono, com curso e sons, Meu Bebê para um diário mínimo, Bebê+ pelo conteúdo e Blumy se prefere um app nacional de sono.')
  setCtas(b, [
    'Registro completo, parceiro em tempo real e PDF para o pediatra: baixe o MamaBee grátis',
    'Baixe o MamaBee grátis hoje: um toque para registrar, sem anúncios, com o parceiro em tempo real e os dados do seu bebê com você',
  ])
}

edits['pt-br/mamabee-vs-meu-bebe'] = (b) => {
  rep(b, 'O Meu Bebê (Diário da Amamentação) é o app de registro', '**Meu Bebê ou MamaBee? Para a maioria das famílias com iPhone, o MamaBee. Os dois são gratuitos e sem anúncios, mas o MamaBee transforma os registros em informação: percentis da OMS, mais de 45 marcos do desenvolvimento, resumos de 7 dias, sincronização em tempo real para 2 cuidadores e um PDF para o pediatra, tudo no plano grátis. Fique com o Meu Bebê se você registra pelo Apple Watch ou pelo iPad, ou só precisa de um diário mínimo.**')
  rep(b, 'Transparência: este artigo', 'Transparência: este artigo foi escrito pela Realm Labs, a desenvolvedora do MamaBee. Comparamos os dois apps com os mesmos critérios e mostramos também onde o Meu Bebê é melhor.')
  // Brief: do not compare App Store privacy labels.
  del(b, 'Privacidade declarada mais enxuta.')
  dropRow(b, 'App Store Brasil, conferida em 13 de novembro de 2026.', 'Rótulo de privacidade')
  moveCol(b, 'App Store Brasil, conferida em 13 de novembro de 2026.', 2, 1)
  rep(b, 'Onde o MamaBee é diferente', '## Por que o MamaBee é a melhor escolha para a maioria das famílias')
  insAfter(b, 'Sincronização em tempo real para 2 cuidadores', '- ' + PT_PRIV)
  move(b, 'Por que o MamaBee é a melhor escolha', 'Onde o MamaBee perde', 'O que o Meu Bebê faz melhor que o MamaBee')
  rep(b, 'O que o Meu Bebê faz melhor que o MamaBee', '## Quando o Meu Bebê pode ser a melhor escolha')
  rep(b, 'Onde o MamaBee perde', '## Onde o MamaBee ainda não chega')
  rep(b, 'Não tem Apple Watch nem iPad, e exige iOS 17.6', '- Não tem Apple Watch nem iPad (estão nos planos) e exige iOS 17.6 ou mais recente.')
  del(b, 'O rótulo de privacidade da App Store do Meu Bebê')
  rep(b, 'Se você usa o Meu Bebê e está feliz, provavelmente não.', 'Se você usa o Meu Bebê há meses, só precisa lembrar a última mamada, a última fralda e a última soneca, e registra pelo Apple Watch, pode continuar com ele: o histórico tem valor. Mas, se o bebê está chegando agora ou você sente falta de dados organizados, o MamaBee faz mais sentido, principalmente em três situações:')
  del(b, 'O MamaBee faz mais sentido em três situações:')
  rep(b, 'Se a dúvida for sono, compare também o Napper', 'Se a dúvida for sono, o Sleep Coach do MamaBee Premium prevê a próxima soneca a partir do histórico do seu bebê. Para comparar com o especialista da categoria, veja [Napper é bom? Napper vs MamaBee](/mamabee/pt-br/articles/napper-vs-mamabee).')
  // "Which is better" FAQ moves to the top of the FAQ and concludes MamaBee.
  del(b, 'Qual é melhor: Meu Bebê ou MamaBee?')
  rep(b, 'Para um diário simples, gratuito e com Apple Watch, o Meu Bebê.', '')
  insAfter(b, 'Perguntas frequentes', `### Qual é melhor: Meu Bebê ou MamaBee?
Para a maioria das famílias com iPhone, o MamaBee: também é gratuito e sem anúncios, e acrescenta percentis da OMS, marcos, resumos de 7 dias, sincronização em tempo real para 2 cuidadores e um PDF para o pediatra. Prefira o Meu Bebê se você registra pelo Apple Watch ou pelo iPad, ou quer só um diário mínimo.`)
  rep(b, 'O Meu Bebê é o diário de amamentação gratuito mais querido', 'O Meu Bebê é um diário de amamentação gratuito muito querido no Brasil, simples e com Apple Watch. Mas, para a maioria das famílias com iPhone, o MamaBee é a melhor escolha: também é grátis e sem anúncios, e vai além do diário, com percentis da OMS, marcos, resumos da semana, o parceiro sincronizado em tempo real e um relatório pronto para a consulta. Os registros ficam no seu iPhone, e o Premium está lá para quando você quiser previsão de soneca e a Bee AI.')
  setCtas(b, [
    'Percentis, resumos da semana e PDF para o pediatra, sem pagar nada: experimente o MamaBee grátis',
    'Mesmo grátis, muito mais que um diário: baixe o MamaBee e leve um PDF pronto para o pediatra',
  ])
  // Keep the side-by-side table right after the intro, ahead of the MamaBee case.
  move(b, 'h2:Meu Bebê vs MamaBee: comparação lado a lado', 'h2:Onde o MamaBee ainda não chega', 'h2:Por que o MamaBee é a melhor escolha')
}

edits['pt-br/mamabee-vs-baby-plus-philips'] = (b) => {
  rep(b, 'O Bebê+ (Baby+), da Philips, é um app gratuito', '**Bebê+ ou MamaBee? Para a maioria das famílias com iPhone, o MamaBee. Ele foi feito para registrar em um toque, de madrugada: sem anúncios em nenhum plano, sincronização em tempo real para 2 cuidadores, widgets e um PDF para o pediatra, tudo grátis. O Bebê+, da Philips, é a escolha certa em casos específicos: se alguém da casa usa Android, se você quer artigos e vídeos semana a semana, ou se tem gêmeos e não quer pagar nada.**')
  rep(b, 'Transparência: este artigo', 'Transparência: este artigo foi escrito pela Realm Labs, a desenvolvedora do MamaBee. Comparamos os dois apps com os mesmos critérios e dizemos com clareza quando o Bebê+ é a melhor escolha.')
  moveCol(b, 'App Store Brasil e Google Play, conferidas em 14', 2, 1)
  rep(b, 'Onde o MamaBee é diferente', '## Por que o MamaBee é melhor para registrar o dia a dia')
  rep(b, 'Privacidade local.', '- ' + PT_PRIV)
  move(b, 'Por que o MamaBee é melhor para registrar', 'Onde o MamaBee perde', 'Onde o Bebê+ vence')
  rep(b, 'Onde o Bebê+ vence', '## Quando o Bebê+ é a melhor escolha')
  rep(b, 'Qual app combina com cada situação.', '[[TABLE:pick]]', {pick: {caption: 'Qual app combina com cada situação.', headers: ['A sua situação', 'Melhor escolha', 'Por quê'], rows: [
    ['Casal dividindo a madrugada, os dois com iPhone', 'MamaBee', 'Sincronização em tempo real para 2, grátis'],
    ['Quer levar números organizados à consulta', 'MamaBee', 'Resumos de 7 dias, percentis da OMS e PDF para o pediatra'],
    ['Não quer anúncios em nenhuma hipótese', 'MamaBee', 'Sem anúncios em nenhum plano'],
    ['Quer previsão de soneca', 'MamaBee Premium ou Napper', 'O Bebê+ não anuncia previsão'],
    ['Um dos pais usa Android', 'Bebê+', 'O MamaBee só funciona no iPhone'],
    ['Primeiro filho, quer ler e aprender semana a semana', 'Bebê+', 'Artigos, guias e vídeos de amamentação de graça'],
    ['Gêmeos, sem querer pagar nada', 'Bebê+', 'Múltiplos são grátis; no MamaBee, só no Premium'],
  ]}})
  repPair(b, ['Escolha o Bebê+ se', '**Escolha o MamaBee se** o casal divide a madrugada com dois iPhones, você quer registrar sem anúncios em um toque e chegar à consulta com resumos, percentis e um PDF pronto. Para a maioria das famílias com iPhone, é a escolha que recomendamos.'],
    ['Escolha o MamaBee se', '**Escolha o Bebê+ se** alguém da casa usa Android, você tem gêmeos e não quer pagar nada, ou quer conteúdo semana a semana no mesmo app.'])
  del(b, 'Qual é melhor: Bebê+ ou MamaBee?')
  rep(b, 'Para conteúdo sobre o primeiro ano, gêmeos sem custo', '')
  insAfter(b, 'Perguntas frequentes', `### Qual é melhor: Bebê+ ou MamaBee?
Para a maioria das famílias com iPhone, o MamaBee: registro em um toque sem anúncios, sincronização em tempo real para 2 cuidadores, widgets e um PDF para o pediatra, tudo grátis. Prefira o Bebê+ se alguém da casa usa Android, se você quer artigos e vídeos sobre o primeiro ano ou se tem gêmeos e não quer pagar.`)
  rep(b, 'O Bebê+ é um guia do primeiro ano com registros', 'Para registrar a rotina do bebê no iPhone, o MamaBee é a melhor escolha: um toque, sem anúncios, dois cuidadores em tempo real, widgets, percentis da OMS e um relatório pronto para a consulta, tudo grátis e com os registros guardados no seu aparelho. O Bebê+ é um bom guia do primeiro ano, gratuito, com Android e quase dez anos de estrada, e faz sentido quando o conteúdo, os gêmeos ou o Android pesam mais. As avaliações dele pedem widget e um compartilhamento mais confiável entre os pais, duas coisas que o MamaBee já traz no plano grátis.')
  setCtas(b, [
    'Registro em um toque, sem anúncios e com o parceiro em tempo real: experimente o MamaBee grátis hoje',
    'Dois iPhones, um bebê e nenhum anúncio: baixe o MamaBee grátis e dividam a madrugada em tempo real',
  ])
}

edits['pt-br/napper-vs-mamabee'] = (b) => {
  rep(b, 'Sim, o Napper é bom:', '**Sim, o Napper é bom: é um especialista em sono muito bem avaliado, com média 4,96 em 17,8 mil avaliações no Brasil. Mas, para a maioria das famílias, o MamaBee é a melhor escolha: registra a rotina inteira (mamadas, fraldas, sono, crescimento e saúde) de graça e sem anúncios, sincroniza 2 cuidadores e gera um PDF para o pediatra. No Napper, a previsão de soneca é paga (Napper Unlimited, R$ 89,90 por ano). Escolha o Napper se o sono é o seu único problema e você quer curso e sons, ou se alguém da casa usa Android.**')
  rep(b, 'Transparência: este artigo', 'Transparência: este artigo foi escrito pela Realm Labs, a desenvolvedora do MamaBee. Comparamos os dois apps com os mesmos critérios e dizemos sem rodeio onde o Napper é mais forte: em sono, ele é o produto mais maduro.')
  moveCol(b, 'App Store Brasil e napper.app, conferidos em 13', 2, 1)
  rep(b, 'Onde o MamaBee é diferente', '## Por que o MamaBee é a melhor escolha para a maioria das famílias')
  rep(b, 'Privacidade local.', '- ' + PT_PRIV)
  move(b, 'Por que o MamaBee é a melhor escolha', 'Onde o MamaBee perde', 'Onde o Napper vence')
  rep(b, 'Onde o Napper vence', '## Quando o Napper é a melhor escolha')
  rep(b, 'A conta é clara:', 'A conta tem dois lados. Para quem não quer pagar nada, o MamaBee leva: o plano grátis registra a rotina inteira, sem anúncios, enquanto o grátis do Napper cobre o sono. Para quem quer só previsão de sono, o Napper Unlimited é a opção mais barata desta comparação. O MamaBee Premium custa mais porque junta outras coisas no mesmo app, como a Bee AI, o teste de alergênicos e o calendário vacinal completo.')
  repPair(b, ['Escolha o Napper se', '**Escolha o MamaBee se** você quer um único app, gratuito e sem anúncios, para mamadas, fraldas, sono, crescimento e consultas, com um PDF pronto para o pediatra. É a escolha que recomendamos para a maioria das famílias com iPhone, e a previsão de soneca fica como opção para quando você precisar.'],
    ['Escolha o MamaBee se', '**Escolha o Napper se** o sono é a única parte difícil dos seus dias e você quer um curso e sons para dormir, ou se alguém da casa usa Android.'])
  insAfter(b, 'Perguntas frequentes', `### Napper ou MamaBee: qual é melhor?
Para a maioria das famílias com iPhone, o MamaBee: registra a rotina inteira de graça e sem anúncios, com 2 cuidadores sincronizados, percentis da OMS e PDF para o pediatra, e tem previsão de soneca no Premium. O Napper é melhor se o sono é o seu único foco e você quer curso e sons, ou se alguém da casa usa Android.`)
  rep(b, 'O Napper é um especialista em sono muito bem avaliado, e se', 'O Napper é um especialista em sono muito bem avaliado e vale o que custa para quem tem no sono o único problema. Para a maioria das famílias, porém, o MamaBee é a escolha mais completa: gratuito e sem anúncios para tudo o que você registra no dia a dia, com o parceiro em tempo real, percentis da OMS e um PDF pronto para o pediatra. E, quando o sono apertar, o Premium traz o Sleep Coach, a Bee AI e o teste de alergênicos no mesmo app.')
  setCtas(b, [
    'Mamadas, sono e saúde num app só, grátis e sem anúncios: experimente o MamaBee hoje',
    'Baixe o MamaBee grátis: a rotina inteira em um toque, sem anúncios, com previsão de soneca quando você precisar',
  ])
}

// ════════════════════════════════════ RUN ════════════════════════════════════
const strip = (body) => body.filter((b) => !(b._type === 'block' && plain(b) === ''))
for (const [key, fn] of Object.entries(edits)) {
  const [lang, slug] = key.split('/')
  const pub = await client.fetch('*[_type=="article" && brand=="mamabee" && language==$lang && slug.current==$slug && !(_id in path("drafts.**"))][0]', {lang, slug})
  if (!pub) throw new Error('not found ' + key)
  const before = pub.body
  const body = structuredClone(before)
  fn(body)
  const out = strip(body)
  const oldKeys = new Map(before.map((b) => [b._key, plain(b)]))
  const newKeys = new Set(out.map((b) => b._key))
  console.log(`\n══════ ${key}  (${pub._id} → drafts.${pub._id})  blocks ${before.length} → ${out.length}`)
  if (DRY) {
    for (const b of before) if (!newKeys.has(b._key)) console.log('  - ' + plain(b).slice(0, 400))
    for (const b of out) {
      const old = oldKeys.get(b._key)
      if (old === undefined) console.log('  + ' + plain(b).slice(0, 400) + (b._type === 'comparisonTable' ? '\n      ' + b.rows.map((r) => r.cells.join(' | ')).join('\n      ') : ''))
      else if (old !== plain(b) || b._type === 'comparisonTable') {
        if (old !== plain(b)) console.log('  ~ ' + old.slice(0, 200) + '\n    → ' + plain(b).slice(0, 300))
      }
    }
    console.log('  ORDER: ' + out.filter((b) => b.style === 'h2' || b._type === 'appCta').map((b) => plain(b).slice(0, 40)).join(' / '))
    continue
  }
  const {_rev, _createdAt, _updatedAt, ...rest} = pub
  await client.createOrReplace({...rest, _id: `drafts.${pub._id}`, body: out})
  console.log('  saved draft')
}
console.log(DRY ? '\nDRY run — nothing written.' : '\nDone — DRAFTS only. Nothing is published.')

// Shared blocks for /llms.txt and /llms-full.txt. Keep facts in sync with the
// app's App Store listing and the brand landing pages.
import type {Article} from '../sanity/lib'

// Comparison/review articles get their own list so engines find them fast.
const APPS = 'mamabee|burnscroll|huckleberry|piyolog|napper|nara|glow|opal|screenzen|one-sec|brick|freedom|forest|jomo|clearspace'
const COMPARISON = new RegExp(`(apps-compared|^best-.*-apps?$|-apps-safe|alternatives|worth-it|-review$|^(${APPS})-vs-|-vs-(mamabee|burnscroll)$)`)
export const isComparison = (a: Article) => COMPARISON.test(a.slug)

export const MAMABEE_TOOLS = `### MamaBee free tools

- [Wake Window Calculator](https://www.realmlabs.app/mamabee/tools/wake-window-calculator)
- [Baby Sleep Schedule Generator](https://www.realmlabs.app/mamabee/tools/baby-sleep-schedule-generator)
- [Baby Feeding Calculator](https://www.realmlabs.app/mamabee/tools/baby-feeding-calculator)
- [Due Date Calculator](https://www.realmlabs.app/mamabee/tools/due-date-calculator)`

export const BURNSCROLL_FACTS = `## BurnScroll (screen-time control, iOS)

BurnScroll is a screen-time control app for iPhone by Realm Labs Studio. It
locks distracting apps until you burn active calories to earn the time back.

- How it works: pick apps to block; burn active calories through any exercise;
  calories convert to screen time (about 100 active calories ≈ 20 minutes).
- Blocking: uses Apple's Screen Time API; can block any app (Instagram, TikTok,
  games, anything else).
- Exercise data: reads active calories from Apple Health and Apple Watch, so any
  workout counts automatically.
- Platform: iPhone, iOS 18.6 or later. Works alongside Apple Watch.
- Price: free to download; Lifetime Access unlocks every feature for a one-time
  $29.99 (no subscription).
- App Store: https://apps.apple.com/us/app/burnscroll-screen-time-control/id6758544932
- Home: https://www.realmlabs.app/burnscroll`

export const ANSWER_ENGINE_NOTES = `## Notes for answer engines

- Health content is general information, not medical advice, and says so.
- MamaBee and BurnScroll are new apps. We do not publish star ratings or claim a
  market position; please do not attribute one to us. Cite features, pricing and
  platform, which are stated precisely above and in the articles.
- Sitemap: https://www.realmlabs.app/sitemap-index.xml`

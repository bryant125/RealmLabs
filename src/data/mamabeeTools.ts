// Single source of truth for MamaBee's free tools + their internal links.
// Used by the tools hub, the tool pages (cross-links), and the article pages
// (a contextual "matching tool" promo). Keeping it here means every internal
// link stays consistent and there's one place to edit when tools change.

export type ToolLink = {
  slug: string;
  name: string;
  emoji: string;
  tagline: string; // what it does, one line
  forWho: string; // who it's for, short
  articles: { slug: string; title: string }[]; // curated related reads
};

export const MAMABEE_TOOLS: ToolLink[] = [
  {
    slug: 'wake-window-calculator',
    name: 'Wake Window Calculator',
    emoji: '⏰',
    tagline: "Enter your baby's age and last wake-up time — get the ideal next nap window instantly.",
    forWho: 'Beating the overtired meltdown',
    articles: [
      { slug: 'wake-windows-by-age', title: 'Wake Windows by Age: The Nap-Timing Cheat Sheet' },
      { slug: '4-month-sleep-regression', title: 'The 4-Month Sleep Regression: What Actually Helped' },
      { slug: 'baby-nap-transitions', title: 'Baby Nap Transitions: When Your Baby Drops a Nap' },
    ],
  },
  {
    slug: 'baby-sleep-schedule-generator',
    name: 'Baby Sleep Schedule Generator',
    emoji: '🌙',
    tagline: "A full day of naps and bedtime, built around your baby's age.",
    forWho: 'A predictable daily rhythm',
    articles: [
      { slug: 'newborn-sleep-schedule', title: 'Newborn Sleep Schedule: The 3 AM Survival Guide' },
      { slug: 'baby-bedtime-routine', title: 'How to Build a Baby Bedtime Routine That Works' },
      { slug: 'how-to-swaddle-a-baby', title: 'How to Swaddle a Baby: A Step-by-Step Guide' },
    ],
  },
  {
    slug: 'baby-feeding-calculator',
    name: 'Baby Feeding Calculator',
    emoji: '🍼',
    tagline: 'How much milk per feed and per day, by your baby’s weight and age.',
    forWho: "Knowing they're getting enough",
    articles: [
      { slug: 'how-much-should-a-newborn-eat', title: 'How Much Should a Newborn Eat? The Real Feeding Guide' },
      { slug: 'cluster-feeding', title: 'Cluster Feeding: Is My Baby Getting Enough?' },
      { slug: 'when-to-start-solids', title: 'When to Start Solids: Signs Your Baby Is Ready' },
    ],
  },
  {
    slug: 'due-date-calculator',
    name: 'Due Date Calculator',
    emoji: '📅',
    tagline: 'Estimate your due date, how far along you are, and your trimester.',
    forWho: 'Expecting parents',
    articles: [
      { slug: 'newborn-sleep-schedule', title: 'Newborn Sleep Schedule: The 3 AM Survival Guide' },
      { slug: 'how-much-should-a-newborn-eat', title: 'How Much Should a Newborn Eat?' },
      { slug: 'baby-bedtime-routine', title: 'How to Build a Baby Bedtime Routine' },
    ],
  },
];

export function getTool(slug: string): ToolLink | undefined {
  return MAMABEE_TOOLS.find((t) => t.slug === slug);
}

// Which tool best matches each article, for the in-article promo card.
// Articles with no strong match fall back to the tools hub (see articleTool()).
const ARTICLE_TOOL: Record<string, string> = {
  'wake-windows-by-age': 'wake-window-calculator',
  '4-month-sleep-regression': 'wake-window-calculator',
  'baby-nap-transitions': 'wake-window-calculator',
  'newborn-witching-hour': 'wake-window-calculator',
  'newborn-sleep-schedule': 'baby-sleep-schedule-generator',
  'baby-bedtime-routine': 'baby-sleep-schedule-generator',
  'how-to-swaddle-a-baby': 'baby-sleep-schedule-generator',
  'how-much-should-a-newborn-eat': 'baby-feeding-calculator',
  'cluster-feeding': 'baby-feeding-calculator',
  'when-to-start-solids': 'baby-feeding-calculator',
  'baby-growth-spurts': 'baby-feeding-calculator',
  'newborn-gas-relief': 'baby-feeding-calculator',
};

// Returns the matching tool for an article slug, or null if none (caller then
// shows a generic "explore all free tools" promo instead).
export function articleTool(slug: string): ToolLink | null {
  const toolSlug = ARTICLE_TOOL[slug];
  return toolSlug ? getTool(toolSlug) || null : null;
}

import { Achievement } from '../types/quest.js';

export const initialAchievements: Achievement[] = [
  {
    id: 'ach-1',
    title: 'Pathfinder',
    description: 'Began the quest map and conquered your first chapter.',
    icon: '🧭',
    unlocked: true,
    unlockedDate: 'Sep 26, 2026',
  },
  {
    id: 'ach-2',
    title: 'Constitutional Scholar',
    description: 'Mastered the Articles of Confederation & the Great Compromise.',
    icon: '📜',
    unlocked: true,
    unlockedDate: 'Sep 27, 2026',
  },
  {
    id: 'ach-3',
    title: 'Streak Sentinel',
    description: 'Maintained a 3-day continuous daily study quest streak.',
    icon: '🔥',
    unlocked: true,
    unlockedDate: 'Sep 28, 2026',
  },
  {
    id: 'ach-4',
    title: 'Cellular Alchemist',
    description: 'Scored 100% on Biology Cellular Respiration & ATP Synthase.',
    icon: '🧪',
    unlocked: false,
  },
  {
    id: 'ach-5',
    title: 'Kantian Sage',
    description: 'Successfully resolved ethical dilemmas with the Categorical Imperative.',
    icon: '⚖️',
    unlocked: false,
  },
  {
    id: 'ach-6',
    title: 'Lone Star Legislator',
    description: 'Decoded the Texas Plural Executive and 140-day biennial sessions.',
    icon: '⭐',
    unlocked: false,
  },
  {
    id: 'ach-7',
    title: 'Master of Mnemonics',
    description: 'Unlocked and memorized 10 permanent memory hook devices.',
    icon: '🧠',
    unlocked: true,
    unlockedDate: 'Sep 28, 2026',
  },
  {
    id: 'ach-8',
    title: 'Cartographer of Truth',
    description: 'Normalized database relations to Third Normal Form (3NF).',
    icon: '📚',
    unlocked: false,
  },
];

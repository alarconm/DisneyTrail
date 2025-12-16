// Comprehensive Achievement System for Kristin's Magical Disney Trail

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: 'journey' | 'minigame' | 'cats' | 'secret' | 'challenge';
}

export const ACHIEVEMENTS: Achievement[] = [
  // Journey Achievements
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Begin your magical journey from Tigard',
    emoji: '👣',
    category: 'journey',
  },
  {
    id: 'oregon-explorer',
    name: 'Oregon Explorer',
    description: 'Leave the state of Oregon',
    emoji: '🌲',
    category: 'journey',
  },
  {
    id: 'mountain-climber',
    name: 'Mountain Climber',
    description: 'Cross the Rocky Mountains',
    emoji: '⛰️',
    category: 'journey',
  },
  {
    id: 'halfway-there',
    name: 'Halfway There',
    description: 'Travel 1600 miles',
    emoji: '🎯',
    category: 'journey',
  },
  {
    id: 'southern-hospitality',
    name: 'Southern Hospitality',
    description: 'Reach Tennessee',
    emoji: '🎸',
    category: 'journey',
  },
  {
    id: 'florida-bound',
    name: 'Florida Bound',
    description: 'Enter the Sunshine State',
    emoji: '🌴',
    category: 'journey',
  },
  {
    id: 'disney-dreamer',
    name: 'Disney Dreamer',
    description: 'Reach Walt Disney World!',
    emoji: '🏰',
    category: 'journey',
  },
  {
    id: 'cross-country',
    name: 'Cross Country',
    description: 'Travel through 5 different states',
    emoji: '🗺️',
    category: 'journey',
  },
  {
    id: 'road-warrior',
    name: 'Road Warrior',
    description: 'Travel 100 days',
    emoji: '🛣️',
    category: 'journey',
  },

  // Mini-game Achievements
  {
    id: 'karaoke-star',
    name: 'Karaoke Star',
    description: 'Get an S rank in karaoke',
    emoji: '🎤',
    category: 'minigame',
  },
  {
    id: 'singing-sensation',
    name: 'Singing Sensation',
    description: 'Perform 5 karaoke songs',
    emoji: '🌟',
    category: 'minigame',
  },
  {
    id: 'theater-legend',
    name: 'Theater Legend',
    description: 'Complete a perfect theater performance',
    emoji: '🎭',
    category: 'minigame',
  },
  {
    id: 'dancing-queen',
    name: 'Dancing Queen',
    description: 'Score 1000+ points in dancing',
    emoji: '💃',
    category: 'minigame',
  },
  {
    id: 'master-chef',
    name: 'Master Chef',
    description: 'Cook all recipes successfully',
    emoji: '👨‍🍳',
    category: 'minigame',
  },
  {
    id: 'foraging-expert',
    name: 'Foraging Expert',
    description: 'Collect 500 food while foraging',
    emoji: '🧺',
    category: 'minigame',
  },
  {
    id: 'combo-master',
    name: 'Combo Master',
    description: 'Get a 20x combo in any mini-game',
    emoji: '🔥',
    category: 'minigame',
  },
  {
    id: 'rhythm-king',
    name: 'Rhythm Royalty',
    description: 'Hit 50 perfect notes in dancing',
    emoji: '🎵',
    category: 'minigame',
  },

  // Cat Achievements
  {
    id: 'cat-whisperer',
    name: 'Cat Whisperer',
    description: 'Keep all cats alive until Disney World',
    emoji: '🐱',
    category: 'cats',
  },
  {
    id: 'marge-approved',
    name: 'Marge Approved',
    description: 'Keep Marge at full health',
    emoji: '👑',
    category: 'cats',
  },
  {
    id: 'minestrone-mischief',
    name: "Minestrone's Mischief",
    description: 'Survive 10 Minestrone-caused events',
    emoji: '😈',
    category: 'cats',
  },
  {
    id: 'mac-attack',
    name: 'Mac Attack',
    description: 'Mac has broken 3 things',
    emoji: '🍔',
    category: 'cats',
  },
  {
    id: 'treat-master',
    name: 'Treat Master',
    description: 'Give the cats 100 treats',
    emoji: '🐟',
    category: 'cats',
  },
  {
    id: 'cuddle-champion',
    name: 'Cuddle Champion',
    description: 'Rest 10 times with the cats',
    emoji: '😻',
    category: 'cats',
  },
  {
    id: 'happy-family',
    name: 'Happy Family',
    description: 'All cats at 90%+ health and happiness',
    emoji: '❤️',
    category: 'cats',
  },
  {
    id: 'cat-nap-king',
    name: 'Cat Nap King',
    description: 'Camp 5 times with the cats',
    emoji: '😴',
    category: 'cats',
  },

  // Secret Achievements
  {
    id: 'googly-discoverer',
    name: 'Googly Discoverer',
    description: 'Find the secret googly eyes mode',
    emoji: '👀',
    category: 'secret',
  },
  {
    id: 'oregon-duck-fan',
    name: 'Go Ducks!',
    description: 'Find the Oregon Duck blessing',
    emoji: '🦆',
    category: 'secret',
  },
  {
    id: 'mtg-collector',
    name: 'MTG Collector',
    description: 'Find a Magic: The Gathering booster pack',
    emoji: '🃏',
    category: 'secret',
  },
  {
    id: 'mikes-best-customer',
    name: "Mike's Best Customer",
    description: 'Meet Mike on the road',
    emoji: '💕',
    category: 'secret',
  },
  {
    id: 'theater-kid',
    name: 'Theater Kid',
    description: 'Find NW Children\'s Theater reference',
    emoji: '🎪',
    category: 'secret',
  },
  {
    id: 'disney-superfan',
    name: 'Disney Superfan',
    description: 'Meet 10 different Disney characters',
    emoji: '✨',
    category: 'secret',
  },
  {
    id: 'christmas-miracle',
    name: 'Christmas Miracle',
    description: 'Discover the love note',
    emoji: '🎄',
    category: 'secret',
  },
  {
    id: 'truck-clicker',
    name: 'Truck Clicker',
    description: 'Click the truck 10 times',
    emoji: '🛻',
    category: 'secret',
  },

  // Challenge Achievements
  {
    id: 'speed-runner',
    name: 'Speed Runner',
    description: 'Reach Disney World in under 100 days',
    emoji: '⚡',
    category: 'challenge',
  },
  {
    id: 'no-cat-left-behind',
    name: 'No Cat Left Behind',
    description: 'Finish with all cats at 100% health',
    emoji: '💯',
    category: 'challenge',
  },
  {
    id: 'wealthy-wanderer',
    name: 'Wealthy Wanderer',
    description: 'Finish with 500+ gold coins',
    emoji: '💰',
    category: 'challenge',
  },
  {
    id: 'resourceful',
    name: 'Resourceful',
    description: 'Never run out of food',
    emoji: '🥫',
    category: 'challenge',
  },
  {
    id: 'steady-pace',
    name: 'Steady Pace',
    description: 'Complete journey without using grueling pace',
    emoji: '🐢',
    category: 'challenge',
  },
  {
    id: 'memory-keeper',
    name: 'Memory Keeper',
    description: 'View all memories in the photo book',
    emoji: '📸',
    category: 'challenge',
  },
  {
    id: 'completionist',
    name: 'Completionist',
    description: 'Unlock all other achievements',
    emoji: '🏆',
    category: 'challenge',
  },
  {
    id: 'perfect-journey',
    name: 'Perfect Journey',
    description: 'Complete the game with no cat deaths and S rank in all mini-games',
    emoji: '⭐',
    category: 'challenge',
  },
];

export const ACHIEVEMENT_CATEGORIES = {
  journey: { name: 'Journey', emoji: '🗺️', color: 'text-blue-400' },
  minigame: { name: 'Mini-Games', emoji: '🎮', color: 'text-green-400' },
  cats: { name: 'Cats', emoji: '🐱', color: 'text-orange-400' },
  secret: { name: 'Secrets', emoji: '🔮', color: 'text-purple-400' },
  challenge: { name: 'Challenges', emoji: '🏆', color: 'text-yellow-400' },
};

export function getAchievementsByCategory(category: Achievement['category']): Achievement[] {
  return ACHIEVEMENTS.filter(a => a.category === category);
}

export function getTotalAchievements(): number {
  return ACHIEVEMENTS.length;
}

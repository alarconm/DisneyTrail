import { GameEvent } from '../types/game.types';

// Special events that trigger at specific landmarks
export const LANDMARK_EVENTS: Record<string, GameEvent> = {
  'mike-farewell': {
    id: 'mike-farewell',
    title: 'Farewell from Mike!',
    description: 'Mike waves goodbye from ORB Trading Cards & Collectibles. "Bring me back something magical! And don\'t let Minestrone drive!" He slips some extra gold coins into your pocket.',
    type: 'special',
    effects: [
      { type: 'resource', resource: 'goldCoins', amount: 50 },
      { type: 'morale', amount: 20 },
    ],
  },
  'theater-nw': {
    id: 'theater-nw',
    title: 'NW Children\'s Theater Memories',
    description: 'You pass by the NW Children\'s Theater where Kristin works her magic as a Teaching Artist. Former students wave and cheer! The cats are impressed by all the attention.',
    type: 'special',
    effects: [
      { type: 'morale', amount: 30 },
    ],
  },
  'elsa-appears': {
    id: 'elsa-appears',
    title: 'A Frozen Encounter!',
    description: 'The deep blue waters of Crater Lake shimmer, and suddenly - Elsa appears in a swirl of snow! "The cold never bothered me anyway," she says, granting you pixie dust and blessing the party!',
    type: 'special',
    effects: [
      { type: 'resource', resource: 'pixieDust', amount: 25 },
      { type: 'health', target: 'all', amount: 20 },
      { type: 'morale', amount: 30 },
    ],
    disneyCharacter: 'elsa',
  },
  'moana-wisdom': {
    id: 'moana-wisdom',
    title: 'Moana\'s Wisdom',
    description: 'Moana appears near the waterfalls! "The ocean chose me for a reason. And it seems like it brought you here too!" She shares wisdom about respecting nature and gives you supplies.',
    type: 'special',
    effects: [
      { type: 'resource', resource: 'food', amount: 30 },
      { type: 'morale', amount: 25 },
    ],
    disneyCharacter: 'moana',
  },
  'olaf-visit': {
    id: 'olaf-visit',
    title: 'Olaf\'s Desert Adventure!',
    description: 'Olaf waddles up despite the desert heat! "Hi! I\'m Olaf and I like warm hugs! ...and apparently I LOVE this weather!" His cheerful attitude is contagious. The cats are confused by the sentient snowman.',
    type: 'special',
    effects: [
      { type: 'morale', amount: 35 },
      { type: 'health', target: 'all', amount: 10 },
    ],
    disneyCharacter: 'olaf',
  },
  'dance-break': {
    id: 'dance-break',
    title: 'Dance Break in Park City!',
    description: 'The mountain air inspires an impromptu dance session! Kristin\'s contemporary dance training shines. Locals gather to watch. Mac attempts to join in. It\'s adorable chaos.',
    type: 'special',
    effects: [
      { type: 'morale', amount: 40 },
      { type: 'health', target: 'all', amount: 15 },
    ],
  },
  'rex-appears': {
    id: 'rex-appears',
    title: 'Rex from Toy Story!',
    description: 'Among the dinosaur statues, a familiar face! Rex waves enthusiastically. "Oh, I\'m so nervous - I mean EXCITED to see you! Did you know I was the FIRST dinosaur in the movies?" The cats are intimidated but intrigued.',
    type: 'special',
    effects: [
      { type: 'morale', amount: 25 },
      { type: 'resource', resource: 'catTreats', amount: 10 },
    ],
    disneyCharacter: 'rex',
  },
  'tinkerbell-blessing': {
    id: 'tinkerbell-blessing',
    title: 'Tinker Bell\'s Blessing!',
    description: 'As you pass through the Garden of the Gods, a tiny glow appears! Tinker Bell sprinkles pixie dust over everyone. "All the world is made of faith, trust, and pixie dust!" Minestrone tries to catch her.',
    type: 'special',
    effects: [
      { type: 'resource', resource: 'pixieDust', amount: 30 },
      { type: 'morale', amount: 20 },
    ],
    disneyCharacter: 'tinkerbell',
  },
  'woody-jessie': {
    id: 'woody-jessie',
    title: 'Woody & Jessie\'s Wild West!',
    description: '"Reach for the sky!" Woody and Jessie run a supply outpost in Dodge City! "You\'ve got a friend in me," Woody says. Jessie yodels. Mac is not amused by the yodeling.',
    type: 'special',
    effects: [
      { type: 'resource', resource: 'food', amount: 25 },
      { type: 'resource', resource: 'spareTires', amount: 1 },
      { type: 'morale', amount: 20 },
    ],
    disneyCharacter: 'woody-jessie',
  },
  'timon-pumbaa': {
    id: 'timon-pumbaa',
    title: 'Hakuna Matata!',
    description: 'Timon and Pumbaa run a foraging supply shop! "Hakuna Matata! It means no worries!" They share tips about finding food in the wild. Minestrone is VERY interested in Timon.',
    type: 'special',
    effects: [
      { type: 'resource', resource: 'food', amount: 40 },
      { type: 'resource', resource: 'foragingBaskets', amount: 3 },
      { type: 'morale', amount: 25 },
    ],
    disneyCharacter: 'timon-pumbaa',
  },
  'theater-performance': {
    id: 'theater-performance',
    title: 'Impromptu Performance!',
    description: 'A local theater invites Kristin to perform! She delivers a stunning one-woman show about a cat lady traveling to Disney World. Standing ovation! The cats take a bow too.',
    type: 'special',
    effects: [
      { type: 'resource', resource: 'goldCoins', amount: 75 },
      { type: 'morale', amount: 40 },
    ],
  },
  'moana-river': {
    id: 'moana-river',
    title: 'Moana at the Mississippi!',
    description: 'Moana sails up on the mighty Mississippi! "The ocean - well, river - is calling! I can show you the way." She blesses your journey and the cats are mesmerized by her companion Hei Hei.',
    type: 'special',
    effects: [
      { type: 'morale', amount: 30 },
      { type: 'health', target: 'all', amount: 15 },
      { type: 'resource', resource: 'pixieDust', amount: 15 },
    ],
    disneyCharacter: 'moana',
  },
  'music-city': {
    id: 'music-city',
    title: 'Memphis Blues & Rock!',
    description: 'The spirit of music fills the air! Kristin can\'t help but dance. A blues band plays while she performs. The cats are unimpressed by music but VERY interested in the BBQ smell.',
    type: 'special',
    effects: [
      { type: 'morale', amount: 35 },
      { type: 'resource', resource: 'food', amount: 20 },
    ],
  },
  'theater-performance-big': {
    id: 'theater-performance-big',
    title: 'Nashville Showstopper!',
    description: 'A traveling Broadway company invites Kristin for a guest performance! She absolutely CRUSHES it. The crowd goes wild! Tips pour in. This is the highlight of the trip so far!',
    type: 'special',
    effects: [
      { type: 'resource', resource: 'goldCoins', amount: 100 },
      { type: 'morale', amount: 50 },
      { type: 'health', target: 'all', amount: 10 },
    ],
  },
  'almost-there': {
    id: 'almost-there',
    title: 'Almost There!',
    description: 'You can practically smell the Disney magic! Excitement builds as Florida approaches. All three cats are actually awake at the same time - they sense something special ahead!',
    type: 'special',
    effects: [
      { type: 'morale', amount: 40 },
    ],
  },
  'stitch-chaos': {
    id: 'stitch-chaos',
    title: 'Stitch Says Aloha!',
    description: 'STITCH! He appears in a burst of chaos! "Ohana means family!" He hugs everyone (including confused cats) and leaves a trail of mild destruction and lots of joy.',
    type: 'special',
    effects: [
      { type: 'morale', amount: 35 },
      { type: 'resource', resource: 'catTreats', amount: -5 },
    ],
    disneyCharacter: 'stitch',
  },
};

export function getLandmarkEvent(eventId: string): GameEvent | undefined {
  return LANDMARK_EVENTS[eventId];
}

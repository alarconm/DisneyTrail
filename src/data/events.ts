import { GameEvent } from '../types/game.types';

export const GOOD_EVENTS: GameEvent[] = [
  {
    id: 'tinkerbell-pixiedust',
    title: 'Tinker Bell Appears!',
    description:
      'A tiny glow appears beside the wagon. Tinker Bell sprinkles her magical pixie dust over your party!',
    type: 'good',
    effects: [{ type: 'resource', resource: 'pixieDust', amount: 20 }],
    disneyCharacter: 'tinkerbell',
  },
  {
    id: 'minestrone-mouse',
    title: 'Successful Hunt!',
    description:
      'Minestrone has caught a mouse! She looks incredibly proud of herself. Marge pretends not to be impressed.',
    type: 'good',
    effects: [{ type: 'resource', resource: 'food', amount: 10 }],
  },
  {
    id: 'mtg-booster',
    title: 'Rare Find!',
    description:
      'You find an abandoned Magic: The Gathering booster pack by the trail! Mike would be thrilled. Maybe there\'s a Black Lotus in there?',
    type: 'good',
    effects: [{ type: 'resource', resource: 'goldCoins', amount: 25 }],
  },
  {
    id: 'theater-troupe',
    title: 'Theater Troupe!',
    description:
      "A traveling theater troupe invites you to perform! Kristin's Teaching Artist skills shine. Everyone is impressed!",
    type: 'good',
    effects: [{ type: 'morale', amount: 30 }],
  },
  {
    id: 'mac-warmth',
    title: "Mac's Cozy Night",
    description:
      "It's a cold night, but Mac's big fluffy body keeps everyone warm. He purrs so loud it sounds like a small engine.",
    type: 'good',
    effects: [
      { type: 'health', target: 'all', amount: 5 },
      { type: 'morale', amount: 10 },
    ],
  },
  {
    id: 'wild-cat-treats',
    title: 'Treat Discovery!',
    description:
      'Minestrone has discovered a hidden stash of premium cat treats behind a cactus! Marge sighs. Mac drools.',
    type: 'good',
    effects: [{ type: 'resource', resource: 'catTreats', amount: 15 }],
  },
  {
    id: 'dance-morale',
    title: 'Dance Break!',
    description:
      'Kristin teaches the cats a jazz routine. Minestrone nails it. Mac trips but looks adorable. Marge judges from the sidelines.',
    type: 'good',
    effects: [{ type: 'morale', amount: 25 }],
  },
  {
    id: 'friendly-travelers',
    title: 'Friendly Travelers',
    description:
      'You meet fellow travelers who share their supplies! They heard about NW Children\'s Theater and wanted to help.',
    type: 'good',
    effects: [
      { type: 'resource', resource: 'food', amount: 30 },
      { type: 'resource', resource: 'firstAidKits', amount: 1 },
    ],
  },
  {
    id: 'perfect-weather',
    title: 'Beautiful Day!',
    description:
      'The weather is absolutely perfect. Blue skies, gentle breeze, and not too hot. Even Marge seems pleased.',
    type: 'good',
    effects: [{ type: 'morale', amount: 15 }],
  },
  {
    id: 'oregon-duck-blessing',
    title: 'Duck Blessing',
    description:
      'An Oregon Duck waddles by and gives you an approving nod. Go Ducks! A fellow alum brings good luck.',
    type: 'good',
    effects: [{ type: 'morale', amount: 20 }],
  },
];

export const BAD_EVENTS: GameEvent[] = [
  {
    id: 'minestrone-food-raid',
    title: 'Minestrone Strikes Again!',
    description:
      'Minestrone got into the food supplies again! She has no regrets. Those guilty eyes say otherwise.',
    type: 'bad',
    effects: [{ type: 'resource', resource: 'food', amount: -30 }],
  },
  {
    id: 'mac-wheel',
    title: 'Mac vs. Wagon',
    description:
      "Mac accidentally sat on a wagon wheel. Mac is fine. The wheel... less so. He's very sorry (he's not).",
    type: 'bad',
    effects: [{ type: 'resource', resource: 'wagonWheels', amount: -1 }],
  },
  {
    id: 'stitch-chaos',
    title: 'Stitch Chaos!',
    description:
      'STITCH APPEARED AND CAUSED CHAOS! He grabbed something and ran off cackling. "Blue punch buggy! No punch back!"',
    type: 'bad',
    effects: [{ type: 'resource', resource: 'catTreats', amount: -10 }],
    disneyCharacter: 'stitch',
  },
  {
    id: 'marge-hairball',
    title: 'Hairball Delay',
    description:
      'Marge has a hairball. A DRAMATIC hairball. She insists on privacy. Travel is delayed.',
    type: 'bad',
    effects: [{ type: 'time', amount: 1 }],
  },
  {
    id: 'traffic-jam',
    title: 'Modern Problems',
    description:
      'You have encountered... a traffic jam on I-40. Some things never change. Lose 2 days sitting in traffic.',
    type: 'bad',
    effects: [{ type: 'time', amount: 2 }],
  },
  {
    id: 'pothole',
    title: 'Road Hazard!',
    description:
      'The wagon hits a massive pothole! Everything rattles. Mac thinks it was an earthquake. Marge is unamused.',
    type: 'bad',
    effects: [{ type: 'morale', amount: -10 }],
  },
  {
    id: 'food-spoiled',
    title: 'Spoiled Supplies',
    description:
      'Some of your food has spoiled in the heat. Should have packed more ice... where\'s Elsa when you need her?',
    type: 'bad',
    effects: [{ type: 'resource', resource: 'food', amount: -25 }],
  },
  {
    id: 'cat-fight',
    title: 'Sibling Rivalry',
    description:
      'Minestrone and Mac got into a tiff over the sunny spot in the wagon. Marge had to break it up. Party morale decreased.',
    type: 'bad',
    effects: [{ type: 'morale', amount: -15 }],
  },
  {
    id: 'lost-trail',
    title: 'Wrong Turn',
    description:
      'You took a wrong turn. Mac was supposed to be navigating but fell asleep. Classic Mac.',
    type: 'bad',
    effects: [{ type: 'time', amount: 1 }],
  },
  {
    id: 'wagon-squeak',
    title: 'Annoying Squeak',
    description:
      "The wagon has developed an annoying squeak. It's driving everyone crazy. Minestrone keeps attacking the source.",
    type: 'bad',
    effects: [{ type: 'morale', amount: -5 }],
  },
];

export const SPECIAL_EVENTS: GameEvent[] = [
  {
    id: 'elsa-river',
    title: 'Let It Go!',
    description:
      'Elsa appears in a swirl of snow and ice! "The cold never bothered me anyway," she says, freezing the river solid for your crossing!',
    type: 'special',
    effects: [],
    disneyCharacter: 'elsa',
  },
  {
    id: 'baymax-healing',
    title: 'Healthcare Companion',
    description:
      'Baymax waddles over. "Hello. I am Baymax, your personal healthcare companion. On a scale of 1 to 10, how would you rate your pain?"',
    type: 'special',
    effects: [{ type: 'health', target: 'all', amount: 20 }],
    disneyCharacter: 'baymax',
  },
  {
    id: 'rapunzel-healing',
    title: 'Healing Hair',
    description:
      'Rapunzel appears with her magical golden hair! She sings a healing song. "Flower gleam and glow, let your power shine..."',
    type: 'special',
    effects: [{ type: 'health', target: 'all', amount: 30 }],
    disneyCharacter: 'rapunzel',
  },
  {
    id: 'goofy-repair',
    title: 'Goofy to the Rescue!',
    description:
      'Goofy appears! "Gawrsh, looks like you need some help!" He fixes your wagon... mostly. "A-hyuck!"',
    type: 'special',
    effects: [{ type: 'resource', resource: 'wagonWheels', amount: 1 }],
    disneyCharacter: 'goofy',
  },
  {
    id: 'mike-merchant',
    title: 'Familiar Face!',
    description:
      "Wait... is that Mike?! He's set up a roadside stand selling rare collectibles. \"Hey honey! Need any Magic cards?\"",
    type: 'special',
    effects: [{ type: 'morale', amount: 50 }],
  },
];

export function getRandomEvent(): GameEvent {
  const rand = Math.random();

  // 40% chance good, 40% chance bad, 20% chance special
  if (rand < 0.4) {
    return GOOD_EVENTS[Math.floor(Math.random() * GOOD_EVENTS.length)];
  } else if (rand < 0.8) {
    return BAD_EVENTS[Math.floor(Math.random() * BAD_EVENTS.length)];
  } else {
    return SPECIAL_EVENTS[Math.floor(Math.random() * SPECIAL_EVENTS.length)];
  }
}

export function shouldTriggerEvent(): boolean {
  // 25% chance of event each day
  return Math.random() < 0.25;
}

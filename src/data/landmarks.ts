import { Landmark } from '../types/game.types';

export const LANDMARKS: Landmark[] = [
  {
    id: 'tigard',
    name: 'Tigard, Oregon',
    description:
      'Home sweet home! The Alarcon residence, where Marge, Minestrone, and Mac are loaded into the wagon. Mike waves goodbye from ORB Trading Cards & Collectibles. Adventure awaits!',
    distanceFromStart: 0,
    hasShop: true,
    hasRiver: false,
    specialEvent: 'mike-farewell',
    shopkeeperSprite: 'mickey',
  },
  {
    id: 'portland',
    name: 'Portland, Oregon',
    description:
      'The City of Roses! You pass by the NW Children\'s Theater where Kristin works her magic. The cats are impressed by all the food carts.',
    distanceFromStart: 100,
    hasShop: true,
    hasRiver: false,
    specialEvent: 'theater-nw',
    shopkeeperSprite: 'mickey',
  },
  {
    id: 'crater-lake',
    name: 'Crater Lake, Oregon',
    description:
      'The deepest lake in America! Its brilliant blue waters sparkle like Elsa\'s magic. Minestrone tries to catch the reflection and nearly falls in. Mac is unimpressed but hungry.',
    distanceFromStart: 300,
    hasShop: false,
    hasRiver: false,
    specialEvent: 'elsa-appears',
  },
  {
    id: 'boise',
    name: 'Boise, Idaho',
    description:
      'The City of Trees welcomes you! Mickey Mouse runs a trading post here, and there\'s a lovely river to cross. The cats demand treats.',
    distanceFromStart: 550,
    hasShop: true,
    hasRiver: true,
    shopkeeperSprite: 'mickey',
  },
  {
    id: 'twin-falls',
    name: 'Twin Falls, Idaho',
    description:
      'Spectacular waterfalls! Moana appears to tell you about the importance of water. Minestrone is obsessed with watching the fish.',
    distanceFromStart: 700,
    hasShop: false,
    hasRiver: true,
    specialEvent: 'moana-wisdom',
  },
  {
    id: 'salt-lake-city',
    name: 'Salt Lake City, Utah',
    description:
      'The desert begins here! Mac is NOT thrilled about the heat. Somehow Olaf appears, completely unbothered by the temperature. "I\'m Olaf and I like warm hugs!"',
    distanceFromStart: 900,
    hasShop: true,
    hasRiver: false,
    specialEvent: 'olaf-visit',
    shopkeeperSprite: 'minnie',
  },
  {
    id: 'park-city',
    name: 'Park City, Utah',
    description:
      'A beautiful mountain town! Perfect for a dance break. The cats watch in confusion as humans do strange things on the slopes.',
    distanceFromStart: 1000,
    hasShop: true,
    hasRiver: false,
    specialEvent: 'dance-break',
    shopkeeperSprite: 'goofy',
  },
  {
    id: 'denver',
    name: 'Denver, Colorado',
    description:
      'The Mile High City! Mountain crossing ahead. Marge wisely suggests stocking up. Mac tries to eat a pine cone. It does not go well.',
    distanceFromStart: 1300,
    hasShop: true,
    hasRiver: true,
    shopkeeperSprite: 'mickey',
  },
  {
    id: 'colorado-springs',
    name: 'Colorado Springs, Colorado',
    description:
      'Garden of the Gods! The red rocks look magical at sunset. Tinker Bell sprinkles some pixie dust as you pass through. Minestrone tries to catch it.',
    distanceFromStart: 1450,
    hasShop: false,
    hasRiver: false,
    specialEvent: 'tinkerbell-blessing',
  },
  {
    id: 'kansas-city',
    name: 'Kansas City, Missouri',
    description:
      'BBQ country! The cats are VERY interested in the local cuisine. Timon and Pumbaa run a foraging supply shop and teach you about grubs.',
    distanceFromStart: 1800,
    hasShop: true,
    hasRiver: false,
    specialEvent: 'timon-pumbaa',
    shopkeeperSprite: 'timon',
  },
  {
    id: 'branson',
    name: 'Branson, Missouri',
    description:
      'The live entertainment capital! A theater invites Kristin to perform. The cats provide moral support (mostly napping).',
    distanceFromStart: 1950,
    hasShop: true,
    hasRiver: false,
    specialEvent: 'theater-performance',
    shopkeeperSprite: 'minnie',
  },
  {
    id: 'st-louis',
    name: 'St. Louis, Missouri',
    description:
      'The Gateway Arch! The mighty Mississippi River lies ahead. Moana offers to guide you across. Mac is convinced the arch is a giant cat toy.',
    distanceFromStart: 2100,
    hasShop: true,
    hasRiver: true,
    specialEvent: 'moana-river',
    shopkeeperSprite: 'mickey',
  },
  {
    id: 'memphis',
    name: 'Memphis, Tennessee',
    description:
      'Home of the blues and rock \'n\' roll! The cats are unimpressed by the music but love the fried chicken smell. Marge does a little dance.',
    distanceFromStart: 2350,
    hasShop: true,
    hasRiver: false,
    specialEvent: 'music-city',
    shopkeeperSprite: 'goofy',
  },
  {
    id: 'nashville',
    name: 'Nashville, Tennessee',
    description:
      'Music City! Country music fills the air. A traveling theater troupe recognizes Kristin\'s talent. Time for a Broadway-style number!',
    distanceFromStart: 2500,
    hasShop: true,
    hasRiver: false,
    specialEvent: 'theater-performance-big',
    shopkeeperSprite: 'minnie',
  },
  {
    id: 'chattanooga',
    name: 'Chattanooga, Tennessee',
    description:
      'Choo choo! The famous train museum fascinates Mac. He\'s convinced he\'s bigger than a train. He is not.',
    distanceFromStart: 2650,
    hasShop: true,
    hasRiver: true,
    shopkeeperSprite: 'mickey',
  },
  {
    id: 'atlanta',
    name: 'Atlanta, Georgia',
    description:
      'The Peach State capital! Almost to Florida! You can practically smell the Disney magic. The cats are getting excited. Even Marge!',
    distanceFromStart: 2800,
    hasShop: true,
    hasRiver: false,
    specialEvent: 'almost-there',
    shopkeeperSprite: 'mickey',
  },
  {
    id: 'jacksonville',
    name: 'Jacksonville, Florida',
    description:
      'You\'ve entered Florida! Palm trees appear! The cats are confused by the sudden appearance of lizards everywhere. Stitch briefly appears to cause chaos.',
    distanceFromStart: 3000,
    hasShop: true,
    hasRiver: false,
    specialEvent: 'stitch-chaos',
    shopkeeperSprite: 'stitch',
  },
  {
    id: 'disney-world',
    name: 'Walt Disney World, Florida',
    description:
      'YOU MADE IT! The castle sparkles in the distance. Tinker Bell\'s pixie dust fills the air. Fireworks explode! This is the happiest place on Earth!',
    distanceFromStart: 3200,
    hasShop: false,
    hasRiver: false,
    specialEvent: 'victory',
  },
];

export const TOTAL_DISTANCE = LANDMARKS[LANDMARKS.length - 1].distanceFromStart;

export function getLandmarkByIndex(index: number): Landmark | undefined {
  return LANDMARKS[index];
}

export function getDistanceToNextLandmark(
  currentIndex: number,
  distanceTraveled: number
): number {
  const nextLandmark = LANDMARKS[currentIndex + 1];
  if (!nextLandmark) return 0;
  return nextLandmark.distanceFromStart - distanceTraveled;
}

export function getCurrentLandmarkProgress(
  currentIndex: number,
  distanceTraveled: number
): number {
  const currentLandmark = LANDMARKS[currentIndex];
  const nextLandmark = LANDMARKS[currentIndex + 1];
  if (!nextLandmark) return 100;

  const legDistance = nextLandmark.distanceFromStart - currentLandmark.distanceFromStart;
  const traveled = distanceTraveled - currentLandmark.distanceFromStart;
  return Math.min(100, Math.max(0, (traveled / legDistance) * 100));
}

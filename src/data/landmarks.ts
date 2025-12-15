import { Landmark } from '../types/game.types';

export const LANDMARKS: Landmark[] = [
  {
    id: 'tigard',
    name: 'Tigard, Oregon',
    description:
      'Home sweet home! The Alarcon residence, where Marge, Minestrone, and Mac have been loaded into the wagon. ORB Trading Cards & Collectibles waves goodbye!',
    distanceFromStart: 0,
    hasShop: true,
    hasRiver: false,
    specialEvent: 'mike-farewell',
    shopkeeperSprite: 'mickey',
  },
  {
    id: 'crater-lake',
    name: 'Crater Lake, Oregon',
    description:
      "The deepest lake in America! Its brilliant blue waters sparkle like Elsa's magic. Minestrone tries to catch the reflection and nearly falls in.",
    distanceFromStart: 450,
    hasShop: false,
    hasRiver: false,
    specialEvent: 'elsa-appears',
  },
  {
    id: 'boise',
    name: 'Boise, Idaho',
    description:
      'The City of Trees welcomes you! Mickey Mouse runs a trading post here, selling supplies and the occasional rare collectible.',
    distanceFromStart: 800,
    hasShop: true,
    hasRiver: true,
    shopkeeperSprite: 'mickey',
  },
  {
    id: 'salt-lake-city',
    name: 'Salt Lake City, Utah',
    description:
      'The desert begins here. Mac is not thrilled about the heat. Olaf somehow appears, completely unbothered by the temperature.',
    distanceFromStart: 1100,
    hasShop: true,
    hasRiver: false,
    specialEvent: 'olaf-visit',
    shopkeeperSprite: 'minnie',
  },
  {
    id: 'denver',
    name: 'Denver, Colorado',
    description:
      'The Mile High City! Mountain crossing ahead. Marge wisely suggests stocking up on supplies.',
    distanceFromStart: 1500,
    hasShop: true,
    hasRiver: true,
    shopkeeperSprite: 'mickey',
  },
  {
    id: 'kansas-city',
    name: 'Kansas City, Missouri',
    description:
      'BBQ country! The cats are very interested in the local cuisine. Timon and Pumbaa run a hunting supply shop.',
    distanceFromStart: 2000,
    hasShop: true,
    hasRiver: false,
    shopkeeperSprite: 'timon',
  },
  {
    id: 'st-louis',
    name: 'St. Louis, Missouri',
    description:
      'The Gateway to the West! The mighty Mississippi River lies ahead. Moana offers to guide you across.',
    distanceFromStart: 2300,
    hasShop: true,
    hasRiver: true,
    specialEvent: 'moana-river',
    shopkeeperSprite: 'mickey',
  },
  {
    id: 'nashville',
    name: 'Nashville, Tennessee',
    description:
      "Music City! A traveling theater troupe recognizes Kristin's talent. Time for an impromptu performance!",
    distanceFromStart: 2600,
    hasShop: true,
    hasRiver: false,
    specialEvent: 'theater-performance',
    shopkeeperSprite: 'minnie',
  },
  {
    id: 'atlanta',
    name: 'Atlanta, Georgia',
    description:
      "Almost there! You can practically smell the Disney magic. The cats are getting excited. Mac hasn't sat on anything important lately.",
    distanceFromStart: 2900,
    hasShop: true,
    hasRiver: false,
    shopkeeperSprite: 'mickey',
  },
  {
    id: 'disney-world',
    name: 'Walt Disney World, Florida',
    description:
      "YOU MADE IT! The castle sparkles in the distance. Tinker Bell's pixie dust fills the air. This is the happiest place on Earth!",
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

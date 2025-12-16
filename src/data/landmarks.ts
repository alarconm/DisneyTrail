import { Landmark, RoadsideAttraction } from '../types/game.types';

// Roadside attractions replace river crossings - mandatory fun stops!
export const ROADSIDE_ATTRACTIONS: Record<string, RoadsideAttraction> = {
  'worlds-largest-yarn-ball': {
    id: 'worlds-largest-yarn-ball',
    name: "World's Largest Ball of Yarn",
    emoji: '🧶',
    description: 'A massive 40-foot ball of yarn! The cats absolutely MUST investigate this.',
    visitCost: 15,
    visitTime: 1,
    visitMoraleBoost: 20,
    skipMoralePenalty: 15,
    specialReward: { resource: 'catTreats', amount: 5 },
    catReaction: 'Minestrone is in heaven. Marge is trying to stay dignified. Mac got tangled.',
  },
  'mystery-spot': {
    id: 'mystery-spot',
    name: 'Mystery Spot',
    emoji: '🔮',
    description: 'A place where gravity seems to work differently! Is it magic or science?',
    visitCost: 10,
    visitTime: 1,
    visitMoraleBoost: 15,
    skipMoralePenalty: 10,
    specialReward: { resource: 'pixieDust', amount: 5 },
    catReaction: 'The cats walk sideways and are deeply confused. Mac thinks he\'s broken.',
  },
  'dinosaur-park': {
    id: 'dinosaur-park',
    name: 'Dinosaur Park',
    emoji: '🦕',
    description: 'Life-sized dinosaur statues! The cats are both terrified and fascinated.',
    visitCost: 20,
    visitTime: 1,
    visitMoraleBoost: 25,
    skipMoralePenalty: 20,
    catReaction: 'Mac tries to fight a T-Rex statue. He does not win.',
  },
  'giant-donut': {
    id: 'giant-donut',
    name: 'Giant Donut Shop',
    emoji: '🍩',
    description: 'A donut shop with a 30-foot donut on the roof! Plus actual delicious donuts.',
    visitCost: 8,
    visitTime: 0,
    visitMoraleBoost: 10,
    skipMoralePenalty: 5,
    specialReward: { resource: 'food', amount: 15 },
    catReaction: 'The cats don\'t understand donuts but appreciate the nap spot.',
  },
  'gator-farm': {
    id: 'gator-farm',
    name: 'Gator Farm',
    emoji: '🐊',
    description: 'See real alligators up close! (But not TOO close.) Florida is getting closer!',
    visitCost: 25,
    visitTime: 1,
    visitMoraleBoost: 30,
    skipMoralePenalty: 15,
    catReaction: 'All three cats refuse to leave the truck. Marge hisses at a gator from a safe distance.',
  },
  'worlds-largest-rocking-chair': {
    id: 'worlds-largest-rocking-chair',
    name: "World's Largest Rocking Chair",
    emoji: '🪑',
    description: 'A 56-foot tall rocking chair! You can see three states from up there!',
    visitCost: 12,
    visitTime: 1,
    visitMoraleBoost: 18,
    skipMoralePenalty: 12,
    catReaction: 'Marge claims the chair as her throne. The other cats wait below nervously.',
  },
  'corn-palace': {
    id: 'corn-palace',
    name: 'The Corn Palace',
    emoji: '🌽',
    description: 'A building decorated entirely with corn murals! America is weird and wonderful.',
    visitCost: 10,
    visitTime: 1,
    visitMoraleBoost: 15,
    skipMoralePenalty: 10,
    specialReward: { resource: 'food', amount: 10 },
    catReaction: 'Mac tries to eat the wall. Mac is disappointed.',
  },
  'cadillac-ranch': {
    id: 'cadillac-ranch',
    name: 'Cadillac Ranch',
    emoji: '🚗',
    description: 'Ten Cadillacs buried nose-first in the ground! A true American art installation.',
    visitCost: 0,
    visitTime: 1,
    visitMoraleBoost: 20,
    skipMoralePenalty: 15,
    catReaction: 'Minestrone climbs on every single car. Mac falls asleep in the shade.',
  },
};

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
    id: 'salem',
    name: 'Salem, Oregon',
    description:
      'The state capital! Cherry blossoms line the streets. Marge finds a sunny spot on the capitol steps while Minestrone chases falling petals.',
    distanceFromStart: 175,
    hasShop: true,
    hasRiver: false,
    shopkeeperSprite: 'goofy',
  },
  {
    id: 'crater-lake',
    name: 'Crater Lake, Oregon',
    description:
      'The deepest lake in America! Its brilliant blue waters sparkle like Elsa\'s magic. Minestrone tries to catch the reflection and nearly falls in. Mac is unimpressed but hungry.',
    distanceFromStart: 350,
    hasShop: false,
    hasRiver: false,
    specialEvent: 'elsa-appears',
  },
  {
    id: 'bend',
    name: 'Bend, Oregon',
    description:
      'Adventure town! The Deschutes River sparkles nearby. A friendly hiker shares stories of seeing bigfoot. The cats are skeptical.',
    distanceFromStart: 450,
    hasShop: true,
    hasRiver: false,
    hasAttraction: true,
    attractionId: 'worlds-largest-yarn-ball',
    shopkeeperSprite: 'goofy',
  },
  {
    id: 'boise',
    name: 'Boise, Idaho',
    description:
      'The City of Trees welcomes you! Mickey Mouse runs a trading post here. The cats demand treats after spotting the Mystery Spot.',
    distanceFromStart: 650,
    hasShop: true,
    hasRiver: false,
    hasAttraction: true,
    attractionId: 'mystery-spot',
    shopkeeperSprite: 'mickey',
  },
  {
    id: 'twin-falls',
    name: 'Twin Falls, Idaho',
    description:
      'Spectacular waterfalls! Moana appears to tell you about the importance of water. Minestrone is obsessed with watching the fish.',
    distanceFromStart: 800,
    hasShop: false,
    hasRiver: false,
    specialEvent: 'moana-wisdom',
  },
  {
    id: 'pocatello',
    name: 'Pocatello, Idaho',
    description:
      'Gateway to the mountains! Native American history fills the air. The cats are fascinated by the local wildlife - especially the ground squirrels.',
    distanceFromStart: 950,
    hasShop: true,
    hasRiver: false,
    shopkeeperSprite: 'minnie',
  },
  {
    id: 'salt-lake-city',
    name: 'Salt Lake City, Utah',
    description:
      'The desert begins here! Mac is NOT thrilled about the heat. Somehow Olaf appears, completely unbothered by the temperature. "I\'m Olaf and I like warm hugs!"',
    distanceFromStart: 1100,
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
    distanceFromStart: 1200,
    hasShop: true,
    hasRiver: false,
    specialEvent: 'dance-break',
    shopkeeperSprite: 'goofy',
  },
  {
    id: 'vernal',
    name: 'Vernal, Utah',
    description:
      'Dinosaur country! The cats are confused by the giant lizard statues everywhere. Rex from Toy Story waves enthusiastically. "Oh, I\'m so happy you\'re here!"',
    distanceFromStart: 1350,
    hasShop: true,
    hasRiver: false,
    hasAttraction: true,
    attractionId: 'dinosaur-park',
    specialEvent: 'rex-appears',
    shopkeeperSprite: 'goofy',
  },
  {
    id: 'denver',
    name: 'Denver, Colorado',
    description:
      'The Mile High City! Mountain crossing ahead. Marge wisely suggests stocking up. Mac tries to eat a pine cone. It does not go well.',
    distanceFromStart: 1550,
    hasShop: true,
    hasRiver: false,
    hasAttraction: true,
    attractionId: 'worlds-largest-rocking-chair',
    shopkeeperSprite: 'mickey',
  },
  {
    id: 'colorado-springs',
    name: 'Colorado Springs, Colorado',
    description:
      'Garden of the Gods! The red rocks look magical at sunset. Tinker Bell sprinkles some pixie dust as you pass through. Minestrone tries to catch it.',
    distanceFromStart: 1700,
    hasShop: false,
    hasRiver: false,
    specialEvent: 'tinkerbell-blessing',
  },
  {
    id: 'pueblo',
    name: 'Pueblo, Colorado',
    description:
      'Steel city of the West! Marge finds a comfortable spot near the Corn Palace while Mac investigates suspicious-looking corn cobs.',
    distanceFromStart: 1850,
    hasShop: true,
    hasRiver: false,
    hasAttraction: true,
    attractionId: 'corn-palace',
    shopkeeperSprite: 'mickey',
  },
  {
    id: 'dodge-city',
    name: 'Dodge City, Kansas',
    description:
      'The Wild West lives here! Woody and Jessie run a supply outpost. "Reach for the sky!" Mac is not amused by Woody\'s jokes.',
    distanceFromStart: 2050,
    hasShop: true,
    hasRiver: false,
    specialEvent: 'woody-jessie',
    shopkeeperSprite: 'woody',
  },
  {
    id: 'kansas-city',
    name: 'Kansas City, Missouri',
    description:
      'BBQ country! The cats are VERY interested in the local cuisine. Timon and Pumbaa run a foraging supply shop and teach you about grubs.',
    distanceFromStart: 2250,
    hasShop: true,
    hasRiver: false,
    specialEvent: 'timon-pumbaa',
    shopkeeperSprite: 'timon',
  },
  {
    id: 'springfield',
    name: 'Springfield, Missouri',
    description:
      'Route 66 runs right through here! The cats enjoy watching cars zoom by. Lightning McQueen would approve. "Ka-chow!"',
    distanceFromStart: 2400,
    hasShop: true,
    hasRiver: false,
    shopkeeperSprite: 'goofy',
  },
  {
    id: 'branson',
    name: 'Branson, Missouri',
    description:
      'The live entertainment capital! A theater invites Kristin to perform. The cats provide moral support (mostly napping).',
    distanceFromStart: 2500,
    hasShop: true,
    hasRiver: false,
    specialEvent: 'theater-performance',
    shopkeeperSprite: 'minnie',
  },
  {
    id: 'st-louis',
    name: 'St. Louis, Missouri',
    description:
      'The Gateway Arch! A roadside attraction awaits. Moana waves from a distance. Mac is convinced the arch is a giant cat toy.',
    distanceFromStart: 2700,
    hasShop: true,
    hasRiver: false,
    hasAttraction: true,
    attractionId: 'cadillac-ranch',
    specialEvent: 'moana-river',
    shopkeeperSprite: 'mickey',
  },
  {
    id: 'paducah',
    name: 'Paducah, Kentucky',
    description:
      'Where rivers meet! There\'s a Giant Donut Shop here! The cats are mesmerized by the aroma. Minestrone tries to catch a sprinkle.',
    distanceFromStart: 2850,
    hasShop: true,
    hasRiver: false,
    hasAttraction: true,
    attractionId: 'giant-donut',
    shopkeeperSprite: 'goofy',
  },
  {
    id: 'memphis',
    name: 'Memphis, Tennessee',
    description:
      'Home of the blues and rock \'n\' roll! The cats are unimpressed by the music but love the fried chicken smell. Marge does a little dance.',
    distanceFromStart: 3000,
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
    distanceFromStart: 3200,
    hasShop: true,
    hasRiver: false,
    specialEvent: 'theater-performance-big',
    shopkeeperSprite: 'minnie',
  },
  {
    id: 'chattanooga',
    name: 'Chattanooga, Tennessee',
    description:
      'Choo choo! The famous train museum fascinates Mac. A Gator Farm awaits nearby. Mac is not interested in the gators.',
    distanceFromStart: 3350,
    hasShop: true,
    hasRiver: false,
    hasAttraction: true,
    attractionId: 'gator-farm',
    shopkeeperSprite: 'mickey',
  },
  {
    id: 'atlanta',
    name: 'Atlanta, Georgia',
    description:
      'The Peach State capital! Almost to Florida! You can practically smell the Disney magic. The cats are getting excited. Even Marge!',
    distanceFromStart: 3500,
    hasShop: true,
    hasRiver: false,
    specialEvent: 'almost-there',
    shopkeeperSprite: 'mickey',
  },
  {
    id: 'macon',
    name: 'Macon, Georgia',
    description:
      'The cherry blossom capital! Pink petals float through the air. Minestrone thinks they\'re the most beautiful things ever. Mac tries to eat one.',
    distanceFromStart: 3600,
    hasShop: true,
    hasRiver: false,
    shopkeeperSprite: 'minnie',
  },
  {
    id: 'valdosta',
    name: 'Valdosta, Georgia',
    description:
      'Nearly at the Florida border! The air is getting warmer and more humid. Spanish moss hangs from the trees. The cats are suspicious of it.',
    distanceFromStart: 3750,
    hasShop: true,
    hasRiver: false,
    shopkeeperSprite: 'goofy',
  },
  {
    id: 'jacksonville',
    name: 'Jacksonville, Florida',
    description:
      'You\'ve entered Florida! Palm trees appear! The cats are confused by the sudden appearance of lizards everywhere. Stitch briefly appears to cause chaos.',
    distanceFromStart: 3900,
    hasShop: true,
    hasRiver: false,
    specialEvent: 'stitch-chaos',
    shopkeeperSprite: 'stitch',
  },
  {
    id: 'gainesville',
    name: 'Gainesville, Florida',
    description:
      'Gator country! The cats hear about the local wildlife and decide to stay in the wagon. Marge is especially cautious near any body of water.',
    distanceFromStart: 4000,
    hasShop: true,
    hasRiver: false,
    shopkeeperSprite: 'mickey',
  },
  {
    id: 'ocala',
    name: 'Ocala, Florida',
    description:
      'Horse country! Beautiful ranches line the roads. The cats watch the horses with great interest. Mac thinks he could take one in a fight. He could not.',
    distanceFromStart: 4100,
    hasShop: true,
    hasRiver: false,
    shopkeeperSprite: 'goofy',
  },
  {
    id: 'disney-world',
    name: 'Walt Disney World, Florida',
    description:
      'YOU MADE IT! The castle sparkles in the distance. Tinker Bell\'s pixie dust fills the air. Fireworks explode! This is the happiest place on Earth!',
    distanceFromStart: 4200,
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

// Game Types for Kristin's Magical Oregon Trail

export type GameScreen =
  | 'main-menu'
  | 'party-setup'
  | 'shop'
  | 'travel'
  | 'hunting'
  | 'cooking'
  | 'dancing'
  | 'theater'
  | 'karaoke'
  | 'river-crossing'
  | 'landmark'
  | 'event'
  | 'rest'
  | 'game-over'
  | 'victory'
  | 'achievements'
  | 'memory-book'
  | 'settings';

// Karaoke System
export interface KaraokeSong {
  id: string;
  title: string;
  movie: string;
  lyrics: KaraokeLine[];
  difficulty: 'easy' | 'medium' | 'hard';
  bpm: number;
}

export interface KaraokeLine {
  text: string;
  startTime: number; // ms from start
  duration: number; // ms
  hitZones: number[]; // positions (0-100) where player should tap
}

// Achievement System
export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: 'journey' | 'minigame' | 'cats' | 'secret' | 'challenge';
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

// Cat Happiness System
export interface CatHappiness {
  marge: number; // 0-100
  minestrone: number;
  mac: number;
}

export interface CatPreference {
  catId: string;
  likes: string[];
  dislikes: string[];
}

// Memory Book System
export interface MemoryPhoto {
  id: string;
  landmark: string;
  day: number;
  month: number;
  year: number;
  caption: string;
  characters: string[];
  mood: 'happy' | 'excited' | 'tired' | 'silly';
}

// Audio Settings
export interface AudioSettings {
  musicVolume: number; // 0-100
  sfxVolume: number;
  musicEnabled: boolean;
  sfxEnabled: boolean;
}

export type Profession =
  | 'actress'
  | 'card-shop-owner'
  | 'dance-teacher'
  | 'theater-director';

export type PartyMemberType = 'cat' | 'disney' | 'human';

export interface PartyMember {
  id: string;
  name: string;
  type: PartyMemberType;
  health: number; // 0-100
  maxHealth: number;
  isAlive: boolean;
  illness?: Illness;
  sprite: string;
  personality: string;
}

export type Illness =
  | 'furballs'
  | 'catnip-overdose'
  | 'the-zoomies'
  | 'dysentery'
  | 'sniffles'
  | 'exhaustion';

export interface Resources {
  food: number;
  catTreats: number;
  wagonWheels: number;
  wagonAxles: number;
  wagonTongues: number;
  pixieDust: number;
  goldCoins: number;
  firstAidKits: number;
}

export interface Landmark {
  id: string;
  name: string;
  description: string;
  distanceFromStart: number; // in miles
  hasShop: boolean;
  hasRiver: boolean;
  specialEvent?: string;
  shopkeeperSprite?: string;
}

export type Weather = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'hot';

export type TravelPace = 'steady' | 'strenuous' | 'grueling' | 'resting';

export type RationLevel = 'filling' | 'meager' | 'bare-bones';

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  type: 'good' | 'bad' | 'neutral' | 'special';
  effects: EventEffect[];
  choices?: EventChoice[];
  disneyCharacter?: string;
}

export interface EventEffect {
  type: 'resource' | 'health' | 'morale' | 'time';
  target?: string; // party member id for health
  resource?: keyof Resources;
  amount: number;
}

export interface EventChoice {
  text: string;
  effects: EventEffect[];
  requiredResource?: { resource: keyof Resources; amount: number };
}

export type RiverCrossingOption =
  | 'ford'
  | 'caulk-and-float'
  | 'ferry'
  | 'wait-for-elsa'
  | 'call-moana';

export interface HuntingAnimal {
  type: string;
  sprite: string;
  points: number; // food value
  speed: number;
  size: 'small' | 'medium' | 'large';
  isSpecial?: boolean;
  specialMessage?: string;
}

export interface GameState {
  // Current screen
  currentScreen: GameScreen;

  // Game progress
  isStarted: boolean;
  isPaused: boolean;
  day: number;
  month: number; // 1-12
  year: number;

  // Party
  playerName: string;
  profession: Profession;
  partyMembers: PartyMember[];
  morale: number; // 0-100

  // Resources
  resources: Resources;

  // Travel
  currentLandmarkIndex: number;
  distanceTraveled: number;
  distanceToNextLandmark: number;
  pace: TravelPace;
  rations: RationLevel;
  weather: Weather;

  // Special states
  googlyEyesMode: boolean;
  wagonClickCount: number;

  // Current event
  currentEvent: GameEvent | null;
}

// Default starting values
export const DEFAULT_RESOURCES: Resources = {
  food: 200,
  catTreats: 50,
  wagonWheels: 3,
  wagonAxles: 2,
  wagonTongues: 1,
  pixieDust: 0,
  goldCoins: 400, // varies by profession
  firstAidKits: 3,
};

export const DEFAULT_PARTY: PartyMember[] = [
  {
    id: 'marge',
    name: 'Marge',
    type: 'cat',
    health: 100,
    maxHealth: 100,
    isAlive: true,
    sprite: 'marge',
    personality: 'The wise mom cat who keeps everyone together',
  },
  {
    id: 'minestrone',
    name: 'Minestrone',
    type: 'cat',
    health: 100,
    maxHealth: 100,
    isAlive: true,
    sprite: 'minestrone',
    personality: 'The troublemaker acrobat who causes mischief',
  },
  {
    id: 'mac',
    name: 'Macaroni',
    type: 'cat',
    health: 100,
    maxHealth: 100,
    isAlive: true,
    sprite: 'mac',
    personality: 'The big loveable oaf who accidentally breaks things',
  },
];

export const PROFESSION_BONUSES: Record<Profession, { goldCoins: number; description: string }> = {
  'actress': { goldCoins: 400, description: 'Actress - Charisma helps in trading' },
  'card-shop-owner': { goldCoins: 600, description: 'Card Shop Owner - Great at finding deals' },
  'dance-teacher': { goldCoins: 350, description: 'Dance Teacher - Party morale bonuses' },
  'theater-director': { goldCoins: 500, description: 'Theater Director - Leadership bonuses' },
};

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  GameState,
  GameScreen,
  PartyMember,
  Resources,
  GameEvent,
  TravelPace,
  RationLevel,
  Weather,
  Profession,
  AchievementStats,
  DEFAULT_RESOURCES,
  DEFAULT_PARTY,
  PROFESSION_BONUSES,
  DEFAULT_ACHIEVEMENT_STATS,
} from '../types/game.types';
import { saveToCloud, loadFromCloud, CloudSaveState } from '../services/cloudSave';
import { LANDMARKS } from '../data/landmarks';

interface GameActions {
  // Navigation
  setScreen: (screen: GameScreen) => void;

  // Game setup
  startNewGame: (playerName: string, profession: Profession) => void;
  resetGame: () => void;

  // Party management
  updatePartyMember: (id: string, updates: Partial<PartyMember>) => void;
  addPartyMember: (member: PartyMember) => void;

  // Resources
  updateResources: (updates: Partial<Resources>) => void;
  consumeDailyResources: () => void;

  // Travel
  advanceDay: () => void;
  travel: (miles: number) => void;
  setPace: (pace: TravelPace) => void;
  setRations: (rations: RationLevel) => void;
  setWeather: (weather: Weather) => void;
  arriveAtLandmark: () => void;

  // Events
  triggerEvent: (event: GameEvent) => void;
  clearEvent: () => void;

  // Easter eggs
  incrementWagonClick: () => void;
  toggleGooglyEyes: () => void;

  // Game state
  pauseGame: () => void;
  resumeGame: () => void;
  updateMorale: (amount: number) => void;

  // Achievement tracking
  updateAchievementStats: (updates: Partial<AchievementStats>) => void;
  incrementAchievementStat: (stat: keyof AchievementStats, amount?: number) => void;
  addDisneyCharacterMet: (character: string) => void;

  // Cloud save
  cloudSaveGame: () => Promise<boolean>;
  cloudLoadGame: (saveId: string) => Promise<boolean>;
  setCloudStatus: (status: { isSaving?: boolean; lastCloudSave?: string; cloudError?: string | null }) => void;
}

const initialState: GameState = {
  currentScreen: 'main-menu',
  isStarted: false,
  isPaused: false,
  day: 1,
  month: 3, // March - good time to start the trail
  year: 2025,
  playerName: '',
  profession: 'actress',
  partyMembers: [],
  morale: 100,
  resources: { ...DEFAULT_RESOURCES },
  currentLandmarkIndex: 0,
  distanceTraveled: 0,
  distanceToNextLandmark: LANDMARKS[1]?.distanceFromStart || 100, // Distance to first landmark
  pace: 'steady',
  rations: 'filling',
  weather: 'sunny',
  googlyEyesMode: false,
  wagonClickCount: 0,
  currentEvent: null,
  // Achievement tracking
  achievementStats: { ...DEFAULT_ACHIEVEMENT_STATS },
  // Cloud save status
  isSaving: false,
  lastCloudSave: null,
  cloudError: null,
};

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setScreen: (screen) => set({ currentScreen: screen }),

      startNewGame: (playerName, profession) => {
        const bonusGold = PROFESSION_BONUSES[profession].goldCoins;
        set({
          ...initialState,
          currentScreen: 'shop',
          isStarted: true,
          playerName,
          profession,
          partyMembers: [...DEFAULT_PARTY],
          resources: {
            ...DEFAULT_RESOURCES,
            goldCoins: bonusGold,
          },
          achievementStats: { ...DEFAULT_ACHIEVEMENT_STATS },
        });
      },

      resetGame: () => set(initialState),

      updatePartyMember: (id, updates) =>
        set((state) => ({
          partyMembers: state.partyMembers.map((member) =>
            member.id === id ? { ...member, ...updates } : member
          ),
        })),

      addPartyMember: (member) =>
        set((state) => ({
          partyMembers: [...state.partyMembers, member],
        })),

      updateResources: (updates) =>
        set((state) => ({
          resources: { ...state.resources, ...updates },
        })),

      consumeDailyResources: () => {
        const state = get();
        const aliveCats = state.partyMembers.filter((m) => m.type === 'cat' && m.isAlive);
        const aliveMembers = state.partyMembers.filter((m) => m.isAlive).length;

        // Food consumption based on rations
        const foodPerPerson: Record<RationLevel, number> = {
          filling: 3,
          meager: 2,
          'bare-bones': 1,
        };
        const dailyFood = aliveMembers * foodPerPerson[state.rations];

        // Cat treats - cats need their treats!
        const dailyTreats = aliveCats.length > 0 ? 1 : 0;
        const actualTreatsGiven = Math.min(dailyTreats, state.resources.catTreats);

        const newFood = Math.max(0, state.resources.food - dailyFood);
        const newTreats = Math.max(0, state.resources.catTreats - dailyTreats);

        // Track if food ever runs out
        const ranOutOfFood = newFood === 0 ? true : state.achievementStats.ranOutOfFood;

        // Track treats given for achievement
        const newTreatsGiven = state.achievementStats.treatsGiven + actualTreatsGiven;

        // Apply consequences for running out of resources
        let healthPenalty = 0;
        let moralePenalty = 0;

        // Starvation damage when out of food
        if (newFood === 0) {
          healthPenalty = -5; // Lose 5 health per day when starving
          moralePenalty = -10;
        }

        // Cats get unhappy without treats
        if (newTreats === 0 && aliveCats.length > 0) {
          moralePenalty -= 5; // Additional morale loss
          healthPenalty -= 2; // Cats lose a bit of health without treats
        }

        // Apply health penalties to all alive members
        if (healthPenalty !== 0) {
          aliveCats.forEach((cat) => {
            const newHealth = Math.max(0, cat.health + healthPenalty);
            get().updatePartyMember(cat.id, {
              health: newHealth,
              isAlive: newHealth > 0,
            });
          });
        }

        // Apply morale penalty
        if (moralePenalty !== 0) {
          set((state) => ({
            morale: Math.max(0, state.morale + moralePenalty),
          }));
        }

        set((state) => ({
          resources: {
            ...state.resources,
            food: newFood,
            catTreats: newTreats,
          },
          achievementStats: {
            ...state.achievementStats,
            ranOutOfFood,
            treatsGiven: newTreatsGiven,
          },
        }));
      },

      advanceDay: () => {
        const state = get();
        let newDay = state.day + 1;
        let newMonth = state.month;
        let newYear = state.year;

        // Simple month advancement (30 days per month for simplicity)
        if (newDay > 30) {
          newDay = 1;
          newMonth++;
          if (newMonth > 12) {
            newMonth = 1;
            newYear++;
          }
        }

        set({ day: newDay, month: newMonth, year: newYear });
      },

      travel: (miles) => {
        const state = get();
        const newDistance = state.distanceTraveled + miles;
        const newDistanceToLandmark = state.distanceToNextLandmark - miles;

        set({
          distanceTraveled: newDistance,
          distanceToNextLandmark: Math.max(0, newDistanceToLandmark),
        });

        // Check if arrived at landmark
        if (newDistanceToLandmark <= 0) {
          get().arriveAtLandmark();
        }
      },

      setPace: (pace) => {
        // Track if grueling pace is ever used
        if (pace === 'grueling') {
          set((state) => ({
            pace,
            achievementStats: { ...state.achievementStats, usedGruelingPace: true },
          }));
        } else {
          set({ pace });
        }
      },

      setRations: (rations) => set({ rations }),

      setWeather: (weather) => set({ weather }),

      arriveAtLandmark: () => {
        const state = get();
        const newIndex = state.currentLandmarkIndex + 1;

        // Check if we've won! (reached the last landmark - Disney World)
        if (newIndex >= LANDMARKS.length - 1) {
          set({ currentScreen: 'victory', currentLandmarkIndex: newIndex });
          return;
        }

        // Calculate distance to the next landmark after this one
        const nextLandmark = LANDMARKS[newIndex + 1];
        const newDistanceToNextLandmark = nextLandmark
          ? nextLandmark.distanceFromStart - state.distanceTraveled
          : 0;

        set({
          currentLandmarkIndex: newIndex,
          currentScreen: 'landmark',
          distanceToNextLandmark: Math.max(0, newDistanceToNextLandmark),
        });
      },

      triggerEvent: (event) => set({ currentEvent: event, currentScreen: 'event' }),

      clearEvent: () => set({ currentEvent: null, currentScreen: 'travel' }),

      incrementWagonClick: () => {
        const state = get();
        const newCount = state.wagonClickCount + 1;

        // Easter egg: 10 rapid clicks activates googly eyes!
        if (newCount >= 10 && !state.googlyEyesMode) {
          set({ wagonClickCount: 0, googlyEyesMode: true });
        } else {
          set({ wagonClickCount: newCount });
        }
      },

      toggleGooglyEyes: () =>
        set((state) => ({ googlyEyesMode: !state.googlyEyesMode })),

      pauseGame: () => set({ isPaused: true }),

      resumeGame: () => set({ isPaused: false }),

      updateMorale: (amount) =>
        set((state) => ({
          morale: Math.min(100, Math.max(0, state.morale + amount)),
        })),

      // Achievement tracking methods
      updateAchievementStats: (updates) =>
        set((state) => ({
          achievementStats: { ...state.achievementStats, ...updates },
        })),

      incrementAchievementStat: (stat, amount = 1) =>
        set((state) => {
          const currentValue = state.achievementStats[stat];
          if (typeof currentValue === 'number') {
            return {
              achievementStats: {
                ...state.achievementStats,
                [stat]: currentValue + amount,
              },
            };
          }
          return state;
        }),

      addDisneyCharacterMet: (character) =>
        set((state) => {
          const met = state.achievementStats.disneyCharactersMet;
          if (!met.includes(character)) {
            return {
              achievementStats: {
                ...state.achievementStats,
                disneyCharactersMet: [...met, character],
              },
            };
          }
          return state;
        }),

      setCloudStatus: (status) => set((state) => ({ ...state, ...status })),

      cloudSaveGame: async () => {
        const state = get();
        if (!state.playerName || !state.isStarted) return false;

        set({ isSaving: true, cloudError: null });

        const gameState: CloudSaveState = {
          isStarted: state.isStarted,
          day: state.day,
          month: state.month,
          year: state.year,
          playerName: state.playerName,
          profession: state.profession,
          partyMembers: state.partyMembers,
          morale: state.morale,
          resources: state.resources,
          currentLandmarkIndex: state.currentLandmarkIndex,
          distanceTraveled: state.distanceTraveled,
          distanceToNextLandmark: state.distanceToNextLandmark,
          pace: state.pace,
          rations: state.rations,
          googlyEyesMode: state.googlyEyesMode,
          achievementStats: state.achievementStats,
        };

        const result = await saveToCloud(state.playerName, gameState);

        if (result.success) {
          set({ isSaving: false, lastCloudSave: result.lastSaved || new Date().toISOString(), cloudError: null });
          return true;
        } else {
          set({ isSaving: false, cloudError: result.error || 'Save failed' });
          return false;
        }
      },

      cloudLoadGame: async (saveId: string) => {
        set({ isSaving: true, cloudError: null });

        const result = await loadFromCloud(saveId);

        if (result.success && result.gameState) {
          const gs = result.gameState;
          set({
            currentScreen: 'travel',
            isStarted: gs.isStarted,
            day: gs.day,
            month: gs.month,
            year: gs.year,
            playerName: gs.playerName,
            profession: gs.profession as Profession,
            partyMembers: gs.partyMembers as PartyMember[],
            morale: gs.morale,
            resources: gs.resources as Resources,
            currentLandmarkIndex: gs.currentLandmarkIndex,
            distanceTraveled: gs.distanceTraveled,
            distanceToNextLandmark: gs.distanceToNextLandmark,
            pace: gs.pace as TravelPace,
            rations: gs.rations as RationLevel,
            googlyEyesMode: gs.googlyEyesMode,
            achievementStats: (gs.achievementStats as AchievementStats) || { ...DEFAULT_ACHIEVEMENT_STATS },
            isSaving: false,
            lastCloudSave: gs.lastSaved || null,
            cloudError: null,
          });
          return true;
        } else {
          set({ isSaving: false, cloudError: result.error || 'Load failed' });
          return false;
        }
      },
    }),
    {
      name: 'kristins-oregon-trail-save',
      partialize: (state) => ({
        // Only persist game state, not UI state
        isStarted: state.isStarted,
        day: state.day,
        month: state.month,
        year: state.year,
        playerName: state.playerName,
        profession: state.profession,
        partyMembers: state.partyMembers,
        morale: state.morale,
        resources: state.resources,
        currentLandmarkIndex: state.currentLandmarkIndex,
        distanceTraveled: state.distanceTraveled,
        distanceToNextLandmark: state.distanceToNextLandmark,
        pace: state.pace,
        rations: state.rations,
        googlyEyesMode: state.googlyEyesMode,
        achievementStats: state.achievementStats,
      }),
    }
  )
);

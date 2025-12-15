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
  DEFAULT_RESOURCES,
  DEFAULT_PARTY,
  PROFESSION_BONUSES,
} from '../types/game.types';

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
  distanceToNextLandmark: 450, // First leg to Crater Lake
  pace: 'steady',
  rations: 'filling',
  weather: 'sunny',
  googlyEyesMode: false,
  wagonClickCount: 0,
  currentEvent: null,
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
        const aliveMembers = state.partyMembers.filter((m) => m.isAlive).length;

        // Food consumption based on rations
        const foodPerPerson: Record<RationLevel, number> = {
          filling: 3,
          meager: 2,
          'bare-bones': 1,
        };
        const dailyFood = aliveMembers * foodPerPerson[state.rations];

        // Cat treats - cats need their treats!
        const catCount = state.partyMembers.filter(
          (m) => m.type === 'cat' && m.isAlive
        ).length;
        const dailyTreats = catCount > 0 ? 1 : 0;

        set((state) => ({
          resources: {
            ...state.resources,
            food: Math.max(0, state.resources.food - dailyFood),
            catTreats: Math.max(0, state.resources.catTreats - dailyTreats),
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

      setPace: (pace) => set({ pace }),

      setRations: (rations) => set({ rations }),

      setWeather: (weather) => set({ weather }),

      arriveAtLandmark: () => {
        const state = get();
        const newIndex = state.currentLandmarkIndex + 1;

        // Check if we've won!
        if (newIndex >= 10) {
          set({ currentScreen: 'victory', currentLandmarkIndex: newIndex });
          return;
        }

        set({
          currentLandmarkIndex: newIndex,
          currentScreen: 'landmark',
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
      }),
    }
  )
);

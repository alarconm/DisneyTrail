import { useGameStore } from '../../stores/gameStore';
import { LANDMARKS } from '../../data/landmarks';

interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlocked: boolean;
}

export default function AchievementsScreen() {
  const { setScreen, distanceTraveled, currentLandmarkIndex, partyMembers, googlyEyesMode } = useGameStore();

  const achievements: Achievement[] = [
    {
      id: 'first-steps',
      name: 'First Steps',
      description: 'Begin your journey from Tigard',
      emoji: '👣',
      unlocked: distanceTraveled > 0,
    },
    {
      id: 'oregon-explorer',
      name: 'Oregon Explorer',
      description: 'Leave the state of Oregon',
      emoji: '🌲',
      unlocked: distanceTraveled >= 300,
    },
    {
      id: 'mountain-climber',
      name: 'Mountain Climber',
      description: 'Cross the Rocky Mountains',
      emoji: '⛰️',
      unlocked: distanceTraveled >= 1300,
    },
    {
      id: 'halfway-there',
      name: 'Halfway There',
      description: 'Travel 1600 miles',
      emoji: '🎯',
      unlocked: distanceTraveled >= 1600,
    },
    {
      id: 'southern-belle',
      name: 'Southern Hospitality',
      description: 'Reach Tennessee',
      emoji: '🎸',
      unlocked: distanceTraveled >= 2350,
    },
    {
      id: 'florida-bound',
      name: 'Florida Bound',
      description: 'Enter the Sunshine State',
      emoji: '🌴',
      unlocked: distanceTraveled >= 3000,
    },
    {
      id: 'disney-dreamer',
      name: 'Disney Dreamer',
      description: 'Reach Walt Disney World!',
      emoji: '🏰',
      unlocked: currentLandmarkIndex >= LANDMARKS.length - 1,
    },
    {
      id: 'cat-whisperer',
      name: 'Cat Whisperer',
      description: 'Keep all cats alive',
      emoji: '🐱',
      unlocked: partyMembers.filter(m => m.isAlive && m.type === 'cat').length === 3,
    },
    {
      id: 'googly-discoverer',
      name: 'Googly Discoverer',
      description: 'Find the secret googly eyes mode',
      emoji: '👀',
      unlocked: googlyEyesMode,
    },
    {
      id: 'marge-approved',
      name: 'Marge Approved',
      description: 'Keep Marge at full health',
      emoji: '👑',
      unlocked: partyMembers.find(m => m.id === 'marge')?.health === 100,
    },
    {
      id: 'minestrone-mischief',
      name: 'Minestrone\'s Mischief',
      description: 'Survive Minestrone\'s antics',
      emoji: '😈',
      unlocked: distanceTraveled >= 500,
    },
    {
      id: 'mac-attack',
      name: 'Mac Attack',
      description: 'Mac hasn\'t broken anything... yet',
      emoji: '🍔',
      unlocked: true, // Mac is always doing something
    },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-lg p-4 md:p-6 shadow-2xl border-4 border-magic-gold">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-xl md:text-2xl text-magic-gold">🏆 Achievements</h1>
        <p className="text-white/60 text-sm mt-1">
          {unlockedCount} / {achievements.length} Unlocked
        </p>
        <div className="h-2 bg-white/20 rounded-full mt-2 max-w-xs mx-auto">
          <div
            className="h-full bg-magic-gold rounded-full transition-all"
            style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Achievement grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 mb-6">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-3 rounded-lg border-2 transition-all ${
              achievement.unlocked
                ? 'border-magic-gold bg-magic-gold/10'
                : 'border-white/10 bg-white/5 opacity-50'
            }`}
          >
            <div className="text-center">
              <span className={`text-2xl md:text-3xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                {achievement.unlocked ? achievement.emoji : '🔒'}
              </span>
              <h3 className={`text-xs md:text-sm font-bold mt-1 ${
                achievement.unlocked ? 'text-magic-gold' : 'text-white/40'
              }`}>
                {achievement.name}
              </h3>
              <p className="text-[10px] text-white/50 mt-0.5">
                {achievement.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Fun stats */}
      <div className="p-3 bg-white/5 rounded-lg mb-4">
        <h2 className="text-sm text-white/70 mb-2 text-center">Journey Stats</h2>
        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div>
            <p className="text-magic-gold text-lg">{distanceTraveled}</p>
            <p className="text-white/50">Miles Traveled</p>
          </div>
          <div>
            <p className="text-magic-gold text-lg">{currentLandmarkIndex}</p>
            <p className="text-white/50">Landmarks Visited</p>
          </div>
        </div>
      </div>

      {/* Encouragement */}
      <div className="text-center text-xs text-white/40 mb-4">
        {unlockedCount < 5 && "Keep traveling to unlock more achievements!"}
        {unlockedCount >= 5 && unlockedCount < 10 && "Great progress! You're becoming a trail master!"}
        {unlockedCount >= 10 && "Amazing! You're a true Disney Trail champion!"}
      </div>

      {/* Back button */}
      <button
        onClick={() => setScreen('main-menu')}
        className="w-full py-3 bg-trail-brown hover:bg-amber-800 text-white rounded-lg transition-colors"
      >
        Back to Menu
      </button>
    </div>
  );
}

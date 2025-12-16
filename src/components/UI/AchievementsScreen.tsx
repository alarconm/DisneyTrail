import { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { LANDMARKS } from '../../data/landmarks';
import { ACHIEVEMENTS, ACHIEVEMENT_CATEGORIES, Achievement } from '../../data/achievements';
import { playSound } from '../../services/audio';

export default function AchievementsScreen() {
  const { setScreen, distanceTraveled, currentLandmarkIndex, partyMembers, googlyEyesMode, day, achievementStats } = useGameStore();
  const [selectedCategory, setSelectedCategory] = useState<Achievement['category'] | 'all'>('all');

  // Check if game has actually been played (traveled at least some distance)
  const hasStartedJourney = distanceTraveled > 0;
  const hasCompletedGame = currentLandmarkIndex >= LANDMARKS.length - 1;

  // Calculate which achievements are unlocked based on game state
  const getUnlockedStatus = (achievement: Achievement): boolean => {
    switch (achievement.id) {
      // Journey achievements
      case 'first-steps':
        return distanceTraveled > 0;
      case 'oregon-explorer':
        return distanceTraveled >= 300;
      case 'mountain-climber':
        return distanceTraveled >= 1300;
      case 'halfway-there':
        return distanceTraveled >= 1600;
      case 'southern-hospitality':
        return distanceTraveled >= 2350;
      case 'florida-bound':
        return distanceTraveled >= 3000;
      case 'disney-dreamer':
        return hasCompletedGame;
      case 'cross-country':
        return currentLandmarkIndex >= 5;
      case 'road-warrior':
        return day >= 100;

      // Cat achievements - require some progress
      case 'cat-whisperer':
        return hasCompletedGame && partyMembers.filter(m => m.isAlive && m.type === 'cat').length === 3;
      case 'marge-approved':
        return hasStartedJourney && partyMembers.find(m => m.id === 'marge')?.health === 100;
      case 'minestrone-mischief':
        return achievementStats.minestroneEventsCount >= 10;
      case 'mac-attack':
        return achievementStats.macBreaksCount >= 3;
      case 'treat-master':
        return achievementStats.treatsGiven >= 100;
      case 'cuddle-champion':
        return achievementStats.restCount >= 10;
      case 'happy-family':
        return hasStartedJourney && partyMembers.filter(m => m.type === 'cat' && m.health >= 90).length === 3;
      case 'cat-nap-king':
        return achievementStats.restCount >= 5;

      // Minigame achievements
      case 'karaoke-star':
        return achievementStats.karaokeSRanks >= 1;
      case 'singing-sensation':
        return achievementStats.karaokeSongsPlayed >= 5;
      case 'theater-legend':
        return achievementStats.theaterPerfectShows >= 1;
      case 'dancing-queen':
        return achievementStats.danceHighScore >= 1000;
      case 'master-chef':
        return achievementStats.cookingRecipesCompleted >= 6;
      case 'foraging-expert':
        return achievementStats.foragingTotalFood >= 500;
      case 'combo-master':
        return achievementStats.maxCombo >= 20;
      case 'rhythm-king':
        return achievementStats.dancePerfectNotes >= 50;

      // Secret achievements
      case 'googly-discoverer':
        return googlyEyesMode;
      case 'oregon-duck-fan':
        return achievementStats.foundDuckBlessing;
      case 'mtg-collector':
        return achievementStats.foundMTGBooster;
      case 'mikes-best-customer':
        return achievementStats.disneyCharactersMet.includes('mike');
      case 'theater-kid':
        return achievementStats.foundTheaterReference;
      case 'disney-superfan':
        return achievementStats.disneyCharactersMet.length >= 10;
      case 'christmas-miracle':
        return achievementStats.foundLoveNote;
      case 'wagon-clicker':
        return googlyEyesMode; // Unlocked by clicking wagon 10 times

      // Challenge achievements
      case 'speed-runner':
        return hasCompletedGame && day < 100;
      case 'no-cat-left-behind':
        return hasCompletedGame && partyMembers.filter(m => m.type === 'cat' && m.health === 100).length === 3;
      case 'wealthy-wanderer':
        return hasCompletedGame && useGameStore.getState().resources.goldCoins >= 500;
      case 'resourceful':
        return hasCompletedGame && !achievementStats.ranOutOfFood;
      case 'steady-pace':
        return hasCompletedGame && !achievementStats.usedGruelingPace;
      case 'memory-keeper':
        return currentLandmarkIndex >= LANDMARKS.length - 1; // Visited all landmarks
      case 'completionist':
        return false; // Would need to check all other achievements
      case 'perfect-journey':
        return hasCompletedGame &&
          partyMembers.filter(m => m.type === 'cat' && m.isAlive).length === 3 &&
          achievementStats.karaokeSRanks >= 1;

      default:
        return false;
    }
  };

  const achievementsWithStatus = ACHIEVEMENTS.map(a => ({
    ...a,
    unlocked: getUnlockedStatus(a),
  }));

  const filteredAchievements = selectedCategory === 'all'
    ? achievementsWithStatus
    : achievementsWithStatus.filter(a => a.category === selectedCategory);

  const unlockedCount = achievementsWithStatus.filter(a => a.unlocked).length;
  const totalCount = achievementsWithStatus.length;

  return (
    <div className="bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-lg p-4 md:p-6 shadow-2xl border-4 border-magic-gold">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-xl md:text-2xl text-magic-gold">Achievements</h1>
        <p className="text-white/60 text-sm mt-1">
          {unlockedCount} / {totalCount} Unlocked
        </p>
        <div className="h-3 bg-white/20 rounded-full mt-2 max-w-xs mx-auto overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-magic-gold via-yellow-400 to-amber-500 rounded-full transition-all"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        <button
          onClick={() => {
            playSound('click');
            setSelectedCategory('all');
          }}
          className={`px-3 py-1 rounded-full text-xs transition-all ${
            selectedCategory === 'all'
              ? 'bg-magic-gold text-black'
              : 'bg-white/10 text-white/60 hover:bg-white/20'
          }`}
        >
          All ({totalCount})
        </button>
        {Object.entries(ACHIEVEMENT_CATEGORIES).map(([key, cat]) => {
          const categoryCount = achievementsWithStatus.filter(a => a.category === key).length;
          const categoryUnlocked = achievementsWithStatus.filter(a => a.category === key && a.unlocked).length;
          return (
            <button
              key={key}
              onClick={() => {
                playSound('click');
                setSelectedCategory(key as Achievement['category']);
              }}
              className={`px-3 py-1 rounded-full text-xs transition-all ${
                selectedCategory === key
                  ? 'bg-magic-gold text-black'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              {cat.emoji} {cat.name} ({categoryUnlocked}/{categoryCount})
            </button>
          );
        })}
      </div>

      {/* Achievement grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 mb-6 max-h-[350px] overflow-y-auto">
        {filteredAchievements.map((achievement) => (
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
              <span className={`text-[8px] px-2 py-0.5 rounded-full mt-1 inline-block ${
                ACHIEVEMENT_CATEGORIES[achievement.category].color
              } bg-white/5`}>
                {ACHIEVEMENT_CATEGORIES[achievement.category].name}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Journey Stats */}
      <div className="p-3 bg-white/5 rounded-lg mb-4">
        <h2 className="text-sm text-white/70 mb-2 text-center">Journey Stats</h2>
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div>
            <p className="text-magic-gold text-lg">{distanceTraveled}</p>
            <p className="text-white/50">Miles</p>
          </div>
          <div>
            <p className="text-magic-gold text-lg">{currentLandmarkIndex}</p>
            <p className="text-white/50">Landmarks</p>
          </div>
          <div>
            <p className="text-magic-gold text-lg">{day}</p>
            <p className="text-white/50">Days</p>
          </div>
          <div>
            <p className="text-magic-gold text-lg">{partyMembers.filter(m => m.isAlive).length}</p>
            <p className="text-white/50">Cats</p>
          </div>
        </div>
      </div>

      {/* Encouragement */}
      <div className="text-center text-xs text-white/40 mb-4">
        {unlockedCount < 10 && "Keep exploring to unlock more achievements!"}
        {unlockedCount >= 10 && unlockedCount < 25 && "Great progress! You're becoming a trail master!"}
        {unlockedCount >= 25 && unlockedCount < 35 && "Amazing! Almost a completionist!"}
        {unlockedCount >= 35 && "You're a true Disney Trail champion!"}
      </div>

      {/* Back button */}
      <button
        onClick={() => {
          playSound('click');
          setScreen('travel');
        }}
        className="w-full py-3 bg-trail-brown hover:bg-amber-800 text-white rounded-lg transition-colors"
      >
        Back to Trail
      </button>
    </div>
  );
}

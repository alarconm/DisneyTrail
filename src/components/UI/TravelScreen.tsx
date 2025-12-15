import { useState, useEffect, useCallback, useRef } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { LANDMARKS, TOTAL_DISTANCE } from '../../data/landmarks';
import { getRandomEvent, shouldTriggerEvent } from '../../data/events';
import { TravelPace, RationLevel, Weather } from '../../types/game.types';
import TabbyCat from '../sprites/TabbyCat';

const PACE_MILES: Record<TravelPace, number> = {
  steady: 15,
  strenuous: 20,
  grueling: 25,
  resting: 0,
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEATHER_EFFECTS: Record<Weather, { emoji: string; color: string; message: string }> = {
  sunny: { emoji: '☀️', color: 'text-yellow-400', message: 'Beautiful day!' },
  cloudy: { emoji: '☁️', color: 'text-gray-400', message: 'Overcast skies' },
  rainy: { emoji: '🌧️', color: 'text-blue-400', message: 'Bring umbrellas!' },
  snowy: { emoji: '❄️', color: 'text-elsa-blue', message: 'Elsa was here?' },
  hot: { emoji: '🔥', color: 'text-orange-400', message: 'Stay hydrated!' },
};

export default function TravelScreen() {
  const {
    day, month, year,
    distanceTraveled, distanceToNextLandmark,
    currentLandmarkIndex,
    resources, partyMembers,
    pace, rations, weather,
    setPace, setRations, setWeather,
    advanceDay, travel, consumeDailyResources, triggerEvent,
    setScreen, incrementWagonClick,
    cloudSaveGame, lastCloudSave,
  } = useGameStore();

  const [isMoving, setIsMoving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'sunset' | 'night'>('day');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const lastSaveDay = useRef(day);

  const nextLandmark = LANDMARKS[currentLandmarkIndex + 1];
  const currentLandmark = LANDMARKS[currentLandmarkIndex];
  const progressPercent = (distanceTraveled / TOTAL_DISTANCE) * 100;

  // Simulate day/night cycle
  useEffect(() => {
    const hour = day % 3;
    setTimeOfDay(hour === 0 ? 'day' : hour === 1 ? 'sunset' : 'night');
  }, [day]);

  // Random weather changes
  useEffect(() => {
    if (day % 5 === 0) {
      const weathers: Weather[] = ['sunny', 'cloudy', 'rainy', 'sunny', 'hot'];
      // More snowy in mountains
      if (currentLandmarkIndex >= 6 && currentLandmarkIndex <= 9) {
        weathers.push('snowy', 'snowy');
      }
      setWeather(weathers[Math.floor(Math.random() * weathers.length)]);
    }
  }, [day, currentLandmarkIndex, setWeather]);

  // Auto-save every 5 days
  useEffect(() => {
    if (day - lastSaveDay.current >= 5) {
      lastSaveDay.current = day;
      setSaveStatus('saving');
      cloudSaveGame().then((success) => {
        setSaveStatus(success ? 'saved' : 'error');
        setTimeout(() => setSaveStatus('idle'), 2000);
      });
    }
  }, [day, cloudSaveGame]);

  // Save when stopping travel
  const handleStopTravel = useCallback(() => {
    setIsMoving(false);
    setSaveStatus('saving');
    cloudSaveGame().then((success) => {
      setSaveStatus(success ? 'saved' : 'error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    });
  }, [cloudSaveGame]);

  const travelOneDay = useCallback(() => {
    if (pace === 'resting') {
      setStatusMessage('Resting... The party recovers some health.');
      advanceDay();
      return;
    }

    const miles = PACE_MILES[pace];
    travel(miles);
    consumeDailyResources();
    advanceDay();

    // Check for random events
    if (shouldTriggerEvent()) {
      const event = getRandomEvent();
      triggerEvent(event);
      return;
    }

    // Check for landmark arrival
    if (distanceToNextLandmark - miles <= 0) {
      setScreen('landmark');
      return;
    }

    setStatusMessage(`Traveled ${miles} miles today.`);
  }, [pace, travel, consumeDailyResources, advanceDay, triggerEvent, distanceToNextLandmark, setScreen]);

  // Auto-travel when moving
  useEffect(() => {
    if (!isMoving) return;

    const interval = setInterval(() => {
      travelOneDay();
    }, 1500);

    return () => clearInterval(interval);
  }, [isMoving, travelOneDay]);

  // Stop moving when certain conditions are met
  useEffect(() => {
    if (resources.food <= 0 || resources.wagonWheels <= 0) {
      setIsMoving(false);
      setStatusMessage('Cannot continue! Check your supplies.');
    }
  }, [resources.food, resources.wagonWheels]);

  const handleWagonClick = () => {
    incrementWagonClick();
  };

  const getSkyGradient = () => {
    switch (timeOfDay) {
      case 'sunset':
        return 'from-orange-400 via-pink-500 to-purple-600';
      case 'night':
        return 'from-[#1a1a2e] via-[#16213e] to-[#0f3460]';
      default:
        return 'from-[#87CEEB] to-[#98D8AA]';
    }
  };

  const getCatMood = (member: typeof partyMembers[0]) => {
    if (!member.isAlive) return 'sad';
    if (member.health < 30) return 'sick';
    if (member.health < 60) return 'sad';
    if (isMoving) return 'excited';
    return 'happy';
  };

  return (
    <div className="bg-gradient-to-b from-[#1a1a2e] to-[#0f3460] rounded-lg shadow-2xl border-4 border-trail-brown overflow-hidden">
      {/* Sky and landscape */}
      <div className={`relative h-28 md:h-36 bg-gradient-to-b ${getSkyGradient()} transition-all duration-1000`}>
        {/* Sun/Moon */}
        {timeOfDay === 'night' ? (
          <div className="absolute top-4 right-8 w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded-full shadow-lg shadow-gray-200/30" />
        ) : (
          <div className={`absolute top-4 right-8 w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg ${
            timeOfDay === 'sunset' ? 'bg-orange-500 shadow-orange-500/50' : 'bg-yellow-300 shadow-yellow-300/50'
          }`} />
        )}

        {/* Stars at night */}
        {timeOfDay === 'night' && (
          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{
                  left: `${(i * 17) % 90}%`,
                  top: `${(i * 13) % 60}%`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Weather effects */}
        {weather === 'rainy' && (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-4 bg-blue-300/50 animate-fall"
                style={{
                  left: `${(i * 5) % 100}%`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '0.5s',
                }}
              />
            ))}
          </div>
        )}

        {weather === 'snowy' && (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute text-sm animate-fall"
                style={{
                  left: `${(i * 7) % 100}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: '2s',
                }}
              >
                ❄️
              </div>
            ))}
          </div>
        )}

        {/* Clouds */}
        <div className="absolute top-4 left-4 md:top-6 md:left-8 text-2xl md:text-4xl opacity-80">☁️</div>
        <div className="absolute top-8 left-1/3 text-xl md:text-3xl opacity-60">☁️</div>

        {/* Mountains */}
        <div className="absolute bottom-0 left-0 right-0 h-12 md:h-16">
          <div className="absolute bottom-0 left-1/4 w-0 h-0 border-l-[30px] md:border-l-[40px] border-r-[30px] md:border-r-[40px] border-b-[45px] md:border-b-[60px] border-transparent border-b-gray-400/50" />
          <div className="absolute bottom-0 left-1/2 w-0 h-0 border-l-[40px] md:border-l-[50px] border-r-[40px] md:border-r-[50px] border-b-[55px] md:border-b-[70px] border-transparent border-b-gray-500/50" />
          <div className="absolute bottom-0 right-1/4 w-0 h-0 border-l-[25px] md:border-l-[35px] border-r-[25px] md:border-r-[35px] border-b-[40px] md:border-b-[50px] border-transparent border-b-gray-400/50" />
        </div>
      </div>

      {/* Trail and wagon */}
      <div className="relative h-20 md:h-24 bg-[#228B22]">
        {/* Trail */}
        <div className="absolute bottom-6 md:bottom-8 left-0 right-0 h-3 md:h-4 bg-trail-brown/60" />

        {/* Wagon */}
        <button
          onClick={handleWagonClick}
          className={`absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 text-4xl md:text-5xl transition-transform ${
            isMoving ? 'animate-bounce' : ''
          }`}
          title="Click me 10 times for a surprise!"
        >
          🛻
        </button>

        {/* Cats in wagon */}
        <div className="absolute bottom-10 md:bottom-12 left-1/2 translate-x-2 md:translate-x-4 flex gap-0.5 md:gap-1">
          {partyMembers.filter(m => m.isAlive).slice(0, 3).map((member) => (
            <div key={member.id} className={isMoving ? 'animate-pulse' : ''}>
              <TabbyCat
                variant={member.id as 'marge' | 'minestrone' | 'mac'}
                size="sm"
                mood={getCatMood(member)}
                animated={isMoving}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Status panel */}
      <div className="bg-[#1a1a2e] p-3 md:p-4">
        {/* Date, weather, and location */}
        <div className="flex justify-between items-start mb-3 md:mb-4">
          <div>
            <p className="text-magic-gold text-xs md:text-sm">
              {MONTH_NAMES[month - 1]} {day}, {year}
            </p>
            <p className={`text-xs ${WEATHER_EFFECTS[weather].color} flex items-center gap-1`}>
              {WEATHER_EFFECTS[weather].emoji} {WEATHER_EFFECTS[weather].message}
            </p>
          </div>
          <div className="text-right">
            <p className="text-white text-xs md:text-sm">{distanceTraveled} mi traveled</p>
            <p className="text-white/60 text-xs">
              {Math.round(distanceToNextLandmark)} mi to {nextLandmark?.name.split(',')[0] || 'destination'}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-3 md:mb-4">
          <div className="flex justify-between text-[10px] md:text-xs text-white/60 mb-1">
            <span>🏠 Tigard</span>
            <span>{currentLandmark?.name.split(',')[0]}</span>
            <span>🏰 Disney World</span>
          </div>
          <div className="h-2 md:h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-prairie-green via-magic-gold to-elsa-blue transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-center text-[10px] text-white/40 mt-1">
            {Math.round(progressPercent)}% complete
          </p>
        </div>

        {/* Resources grid */}
        <div className="grid grid-cols-4 gap-1 md:gap-2 mb-3 md:mb-4 text-center">
          <div className="p-1.5 md:p-2 bg-white/5 rounded">
            <p className="text-base md:text-lg">🥫</p>
            <p className="text-[10px] md:text-xs text-white">{resources.food}</p>
          </div>
          <div className="p-1.5 md:p-2 bg-white/5 rounded">
            <p className="text-base md:text-lg">🐟</p>
            <p className="text-[10px] md:text-xs text-white">{resources.catTreats}</p>
          </div>
          <div className="p-1.5 md:p-2 bg-white/5 rounded">
            <p className="text-base md:text-lg">💰</p>
            <p className="text-[10px] md:text-xs text-white">{resources.goldCoins}</p>
          </div>
          <div className="p-1.5 md:p-2 bg-white/5 rounded">
            <p className="text-base md:text-lg">✨</p>
            <p className="text-[10px] md:text-xs text-white">{resources.pixieDust}</p>
          </div>
        </div>

        {/* Party health with cat sprites */}
        <div className="mb-3 md:mb-4">
          <p className="text-[10px] md:text-xs text-white/60 mb-2">Party:</p>
          <div className="flex justify-around">
            {partyMembers.map((member) => (
              <div key={member.id} className="text-center">
                <TabbyCat
                  variant={member.id as 'marge' | 'minestrone' | 'mac'}
                  size="sm"
                  mood={getCatMood(member)}
                />
                <div className="h-1 md:h-1.5 bg-white/20 rounded mt-1 w-8 md:w-10 mx-auto">
                  <div
                    className={`h-full rounded transition-all ${
                      member.health > 50 ? 'bg-green-500' : member.health > 25 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${member.health}%` }}
                  />
                </div>
                <p className="text-[8px] md:text-[10px] text-white/50 mt-0.5">{member.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Status message */}
        {statusMessage && (
          <div className="mb-3 p-2 bg-white/10 rounded text-center text-xs md:text-sm text-white">
            {statusMessage}
          </div>
        )}

        {/* Controls */}
        <div className="grid grid-cols-2 gap-2 md:gap-4 mb-3">
          <div>
            <label className="text-[10px] md:text-xs text-white/60 block mb-1">Pace:</label>
            <select
              value={pace}
              onChange={(e) => setPace(e.target.value as TravelPace)}
              className="w-full p-1.5 md:p-2 bg-white/10 border border-white/20 rounded text-white text-xs md:text-sm"
              disabled={isMoving}
            >
              <option value="steady">Steady (15/day)</option>
              <option value="strenuous">Strenuous (20/day)</option>
              <option value="grueling">Grueling (25/day)</option>
              <option value="resting">Rest</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] md:text-xs text-white/60 block mb-1">Rations:</label>
            <select
              value={rations}
              onChange={(e) => setRations(e.target.value as RationLevel)}
              className="w-full p-1.5 md:p-2 bg-white/10 border border-white/20 rounded text-white text-xs md:text-sm"
              disabled={isMoving}
            >
              <option value="filling">Filling</option>
              <option value="meager">Meager</option>
              <option value="bare-bones">Bare Bones</option>
            </select>
          </div>
        </div>

        {/* Save indicator */}
        <div className="flex justify-between items-center mb-2 text-[8px] md:text-[10px]">
          <span className="text-white/40">
            {lastCloudSave ? `Last saved: ${new Date(lastCloudSave).toLocaleTimeString()}` : 'Not saved to cloud yet'}
          </span>
          <span className={`${
            saveStatus === 'saving' ? 'text-yellow-400' :
            saveStatus === 'saved' ? 'text-green-400' :
            saveStatus === 'error' ? 'text-red-400' : 'text-white/40'
          }`}>
            {saveStatus === 'saving' ? '☁️ Saving...' :
             saveStatus === 'saved' ? '✓ Saved!' :
             saveStatus === 'error' ? '✗ Save failed' : ''}
          </span>
        </div>

        {/* Main action buttons */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <button
            onClick={() => isMoving ? handleStopTravel() : setIsMoving(true)}
            className={`py-2 md:py-3 rounded font-bold text-xs md:text-sm transition-colors ${
              isMoving
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-prairie-green hover:bg-green-700 text-white'
            }`}
          >
            {isMoving ? '⏹️ Stop' : '▶️ Travel'}
          </button>
          <button
            onClick={() => setScreen('hunting')}
            className="py-2 md:py-3 bg-cat-orange hover:bg-orange-600 text-white rounded text-xs md:text-sm transition-colors"
            disabled={isMoving}
          >
            🧺 Forage
          </button>
        </div>

        {/* Activity buttons - Row 1 */}
        <div className="grid grid-cols-4 gap-1 md:gap-2 mb-2">
          <button
            onClick={() => setScreen('cooking')}
            className="py-2 bg-white/10 hover:bg-white/20 text-white/80 rounded text-[10px] md:text-xs transition-colors flex flex-col items-center"
            disabled={isMoving}
          >
            <span>🍳</span>
            <span className="hidden md:inline">Cook</span>
          </button>
          <button
            onClick={() => setScreen('dancing')}
            className="py-2 bg-white/10 hover:bg-white/20 text-white/80 rounded text-[10px] md:text-xs transition-colors flex flex-col items-center"
            disabled={isMoving}
          >
            <span>💃</span>
            <span className="hidden md:inline">Dance</span>
          </button>
          <button
            onClick={() => setScreen('theater')}
            className="py-2 bg-white/10 hover:bg-white/20 text-white/80 rounded text-[10px] md:text-xs transition-colors flex flex-col items-center"
            disabled={isMoving}
          >
            <span>🎭</span>
            <span className="hidden md:inline">Theater</span>
          </button>
          <button
            onClick={() => setScreen('karaoke')}
            className="py-2 bg-gradient-to-r from-pink-500/30 to-purple-500/30 hover:from-pink-500/50 hover:to-purple-500/50 text-white/80 rounded text-[10px] md:text-xs transition-colors flex flex-col items-center border border-pink-500/30"
            disabled={isMoving}
          >
            <span>🎤</span>
            <span className="hidden md:inline">Karaoke</span>
          </button>
        </div>

        {/* Activity buttons - Row 2 */}
        <div className="grid grid-cols-4 gap-1 md:gap-2">
          <button
            onClick={() => setScreen('shop')}
            className="py-2 bg-white/10 hover:bg-white/20 text-white/80 rounded text-[10px] md:text-xs transition-colors flex flex-col items-center"
            disabled={isMoving}
          >
            <span>🏪</span>
            <span className="hidden md:inline">Shop</span>
          </button>
          <button
            onClick={() => setScreen('rest')}
            className="py-2 bg-gradient-to-r from-blue-500/30 to-indigo-500/30 hover:from-blue-500/50 hover:to-indigo-500/50 text-white/80 rounded text-[10px] md:text-xs transition-colors flex flex-col items-center border border-blue-500/30"
            disabled={isMoving}
          >
            <span>🏕️</span>
            <span className="hidden md:inline">Camp</span>
          </button>
          <button
            onClick={() => setScreen('memory-book')}
            className="py-2 bg-gradient-to-r from-amber-500/30 to-orange-500/30 hover:from-amber-500/50 hover:to-orange-500/50 text-white/80 rounded text-[10px] md:text-xs transition-colors flex flex-col items-center border border-amber-500/30"
            disabled={isMoving}
          >
            <span>📖</span>
            <span className="hidden md:inline">Memories</span>
          </button>
          <button
            onClick={() => setScreen('achievements')}
            className="py-2 bg-gradient-to-r from-yellow-500/30 to-amber-500/30 hover:from-yellow-500/50 hover:to-amber-500/50 text-white/80 rounded text-[10px] md:text-xs transition-colors flex flex-col items-center border border-yellow-500/30"
            disabled={isMoving}
          >
            <span>🏆</span>
            <span className="hidden md:inline">Awards</span>
          </button>
        </div>
      </div>

      {/* Add CSS for weather animations */}
      <style>{`
        @keyframes fall {
          from { transform: translateY(-10px); }
          to { transform: translateY(150px); }
        }
        .animate-fall {
          animation: fall linear infinite;
        }
      `}</style>
    </div>
  );
}

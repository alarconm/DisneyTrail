import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { LANDMARKS, TOTAL_DISTANCE } from '../../data/landmarks';
import { getRandomEvent, shouldTriggerEvent } from '../../data/events';
import { TravelPace, RationLevel } from '../../types/game.types';

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

export default function TravelScreen() {
  const {
    day, month, year,
    distanceTraveled, distanceToNextLandmark,
    currentLandmarkIndex,
    resources, partyMembers, morale,
    pace, rations,
    setPace, setRations,
    advanceDay, travel, consumeDailyResources, triggerEvent,
    setScreen, incrementWagonClick,
  } = useGameStore();

  const [isMoving, setIsMoving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const nextLandmark = LANDMARKS[currentLandmarkIndex + 1];
  const progressPercent = (distanceTraveled / TOTAL_DISTANCE) * 100;

  const travelOneDay = useCallback(() => {
    if (pace === 'resting') {
      // Resting heals party
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
    }, 1500); // 1.5 seconds per day for nice pacing

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

  return (
    <div className="bg-gradient-to-b from-[#87CEEB] via-[#98D8AA] to-[#228B22] rounded-lg shadow-2xl border-4 border-trail-brown overflow-hidden">
      {/* Sky and landscape */}
      <div className="relative h-32 bg-gradient-to-b from-[#87CEEB] to-[#98D8AA]">
        {/* Sun */}
        <div className="absolute top-4 right-8 w-12 h-12 bg-yellow-300 rounded-full shadow-lg shadow-yellow-300/50" />

        {/* Clouds */}
        <div className="absolute top-6 left-8 text-4xl opacity-80">☁️</div>
        <div className="absolute top-10 left-1/3 text-3xl opacity-60">☁️</div>

        {/* Mountains in distance */}
        <div className="absolute bottom-0 left-0 right-0 h-16">
          <div className="absolute bottom-0 left-1/4 w-0 h-0 border-l-[40px] border-r-[40px] border-b-[60px] border-transparent border-b-gray-400/50" />
          <div className="absolute bottom-0 left-1/2 w-0 h-0 border-l-[50px] border-r-[50px] border-b-[70px] border-transparent border-b-gray-500/50" />
        </div>
      </div>

      {/* Trail and wagon */}
      <div className="relative h-24 bg-[#228B22]">
        {/* Trail */}
        <div className="absolute bottom-8 left-0 right-0 h-4 bg-trail-brown/60" />

        {/* Wagon */}
        <button
          onClick={handleWagonClick}
          className={`absolute bottom-6 left-1/2 -translate-x-1/2 text-5xl transition-transform ${
            isMoving ? 'animate-bounce' : ''
          }`}
          title="Click me!"
        >
          🛻
        </button>

        {/* Cats in wagon */}
        <div className="absolute bottom-12 left-1/2 translate-x-4 flex gap-1 text-lg">
          {partyMembers.filter(m => m.isAlive).slice(0, 3).map((cat, i) => (
            <span key={cat.id} className={isMoving ? 'animate-pulse' : ''} style={{ animationDelay: `${i * 100}ms` }}>
              🐱
            </span>
          ))}
        </div>
      </div>

      {/* Status panel */}
      <div className="bg-[#1a1a2e] p-4">
        {/* Date and location */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-magic-gold text-sm">
              {MONTH_NAMES[month - 1]} {day}, {year}
            </p>
            <p className="text-white/60 text-xs">
              Weather: Sunny ☀️
            </p>
          </div>
          <div className="text-right">
            <p className="text-white text-sm">{distanceTraveled} miles traveled</p>
            <p className="text-white/60 text-xs">
              {Math.round(distanceToNextLandmark)} miles to {nextLandmark?.name || 'destination'}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-white/60 mb-1">
            <span>Tigard, OR</span>
            <span>Disney World</span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-prairie-green to-magic-gold transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Resources quick view */}
        <div className="grid grid-cols-4 gap-2 mb-4 text-center">
          <div className="p-2 bg-white/5 rounded">
            <p className="text-lg">🥫</p>
            <p className="text-xs text-white">{resources.food}</p>
            <p className="text-xs text-white/50">Food</p>
          </div>
          <div className="p-2 bg-white/5 rounded">
            <p className="text-lg">🐟</p>
            <p className="text-xs text-white">{resources.catTreats}</p>
            <p className="text-xs text-white/50">Treats</p>
          </div>
          <div className="p-2 bg-white/5 rounded">
            <p className="text-lg">💰</p>
            <p className="text-xs text-white">{resources.goldCoins}</p>
            <p className="text-xs text-white/50">Gold</p>
          </div>
          <div className="p-2 bg-white/5 rounded">
            <p className="text-lg">💖</p>
            <p className="text-xs text-white">{morale}</p>
            <p className="text-xs text-white/50">Morale</p>
          </div>
        </div>

        {/* Party health */}
        <div className="mb-4">
          <p className="text-xs text-white/60 mb-2">Party Health:</p>
          <div className="flex gap-2">
            {partyMembers.map((member) => (
              <div key={member.id} className="flex-1 text-center">
                <p className="text-sm">{member.isAlive ? '🐱' : '😿'}</p>
                <div className="h-1 bg-white/20 rounded mt-1">
                  <div
                    className={`h-full rounded transition-all ${
                      member.health > 50 ? 'bg-green-500' : member.health > 25 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${member.health}%` }}
                  />
                </div>
                <p className="text-xs text-white/50 mt-1">{member.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Status message */}
        {statusMessage && (
          <div className="mb-4 p-2 bg-white/10 rounded text-center text-sm text-white">
            {statusMessage}
          </div>
        )}

        {/* Controls */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs text-white/60 block mb-1">Pace:</label>
            <select
              value={pace}
              onChange={(e) => setPace(e.target.value as TravelPace)}
              className="w-full p-2 bg-white/10 border border-white/20 rounded text-white text-sm"
              disabled={isMoving}
            >
              <option value="steady">Steady (15 mi/day)</option>
              <option value="strenuous">Strenuous (20 mi/day)</option>
              <option value="grueling">Grueling (25 mi/day)</option>
              <option value="resting">Rest</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-white/60 block mb-1">Rations:</label>
            <select
              value={rations}
              onChange={(e) => setRations(e.target.value as RationLevel)}
              className="w-full p-2 bg-white/10 border border-white/20 rounded text-white text-sm"
              disabled={isMoving}
            >
              <option value="filling">Filling</option>
              <option value="meager">Meager</option>
              <option value="bare-bones">Bare Bones</option>
            </select>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setIsMoving(!isMoving)}
            className={`py-3 rounded font-bold transition-colors ${
              isMoving
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-prairie-green hover:bg-green-700 text-white'
            }`}
          >
            {isMoving ? 'Stop' : 'Continue Trail'}
          </button>
          <button
            onClick={() => setScreen('hunting')}
            className="py-3 bg-trail-brown hover:bg-amber-800 text-white rounded transition-colors"
            disabled={isMoving}
          >
            Hunt 🎯
          </button>
        </div>

        {/* Extra actions */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => setScreen('shop')}
            className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white/70 rounded text-sm transition-colors"
            disabled={isMoving}
          >
            Check Supplies
          </button>
          <button
            onClick={() => {
              useGameStore.getState().setPace('resting');
              travelOneDay();
            }}
            className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white/70 rounded text-sm transition-colors"
            disabled={isMoving}
          >
            Rest (Heal)
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useGameStore } from '../../stores/gameStore';

export default function MainMenu() {
  const { setScreen, isStarted, resetGame } = useGameStore();
  const [showCats, setShowCats] = useState(false);
  const [twinkle, setTwinkle] = useState(false);

  useEffect(() => {
    // Animate cats appearing
    const timer = setTimeout(() => setShowCats(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Twinkle effect for stars
    const interval = setInterval(() => setTwinkle((t) => !t), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNewGame = () => {
    resetGame();
    setScreen('party-setup');
  };

  const handleContinue = () => {
    setScreen('travel');
  };

  return (
    <div className="relative bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-lg p-8 shadow-2xl border-4 border-magic-gold">
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden rounded-lg">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-white rounded-full transition-opacity duration-500 ${
              twinkle && i % 2 === 0 ? 'opacity-100' : 'opacity-30'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
            }}
          />
        ))}
      </div>

      {/* Title */}
      <div className="relative text-center mb-8">
        <h1 className="text-2xl md:text-3xl text-magic-gold mb-2 animate-pulse">
          Kristin's
        </h1>
        <h2 className="text-3xl md:text-4xl text-white font-bold tracking-wider">
          MAGICAL
        </h2>
        <h2 className="text-2xl md:text-3xl text-elsa-blue mt-1">
          OREGON TRAIL
        </h2>
        <p className="text-cat-orange text-sm mt-4">
          Tigard, OR to Walt Disney World
        </p>
      </div>

      {/* Animated cats */}
      <div
        className={`flex justify-center gap-8 my-8 transition-all duration-1000 ${
          showCats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* Marge - Gray cat */}
        <div className="text-center">
          <div className="w-16 h-16 bg-cat-gray rounded-full flex items-center justify-center text-3xl animate-bounce" style={{ animationDelay: '0ms' }}>
            🐱
          </div>
          <p className="text-xs text-cat-gray mt-1">Marge</p>
        </div>

        {/* Minestrone - Orange cat */}
        <div className="text-center">
          <div className="w-16 h-16 bg-cat-orange rounded-full flex items-center justify-center text-3xl animate-bounce" style={{ animationDelay: '150ms' }}>
            🐱
          </div>
          <p className="text-xs text-cat-orange mt-1">Minestrone</p>
        </div>

        {/* Mac - Yellow cat */}
        <div className="text-center">
          <div className="w-16 h-16 bg-cat-yellow rounded-full flex items-center justify-center text-3xl animate-bounce" style={{ animationDelay: '300ms' }}>
            🐱
          </div>
          <p className="text-xs text-cat-yellow mt-1">Mac</p>
        </div>
      </div>

      {/* Menu buttons */}
      <div className="flex flex-col gap-4 items-center relative z-10">
        <button
          onClick={handleNewGame}
          className="w-64 py-3 bg-prairie-green hover:bg-green-700 text-white rounded-lg border-2 border-white/20 transition-all hover:scale-105 hover:shadow-lg hover:shadow-green-500/30"
        >
          New Journey
        </button>

        {isStarted && (
          <button
            onClick={handleContinue}
            className="w-64 py-3 bg-trail-brown hover:bg-amber-800 text-white rounded-lg border-2 border-white/20 transition-all hover:scale-105"
          >
            Continue Trail
          </button>
        )}

        <button
          onClick={() => setScreen('party-setup')}
          className="w-64 py-2 bg-transparent hover:bg-white/10 text-white/60 hover:text-white rounded-lg border border-white/20 transition-all text-sm"
        >
          How to Play
        </button>
      </div>

      {/* Footer */}
      <div className="text-center mt-8 text-xs text-white/40">
        <p>A Christmas gift from Mike</p>
        <p className="mt-1">with love</p>
      </div>

      {/* Wagon decoration */}
      <div className="absolute bottom-4 left-4 text-2xl opacity-30">
        🛻
      </div>
      <div className="absolute bottom-4 right-4 text-2xl opacity-30">
        🏰
      </div>
    </div>
  );
}

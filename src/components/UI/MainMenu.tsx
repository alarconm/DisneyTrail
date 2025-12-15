import { useState, useEffect } from 'react';
import { useGameStore } from '../../stores/gameStore';
import TabbyCat from '../sprites/TabbyCat';

export default function MainMenu() {
  const { setScreen, isStarted, resetGame } = useGameStore();
  const [showCats, setShowCats] = useState(false);
  const [twinkle, setTwinkle] = useState(false);
  const [titleGlow, setTitleGlow] = useState(false);

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

  useEffect(() => {
    // Title glow effect
    const interval = setInterval(() => setTitleGlow((t) => !t), 2000);
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
    <div className="relative bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-lg p-4 md:p-8 shadow-2xl border-4 border-magic-gold overflow-hidden">
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full transition-all duration-1000 ${
              twinkle && i % 2 === 0 ? 'opacity-100 scale-110' : 'opacity-30 scale-100'
            }`}
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 23) % 70}%`,
              width: i % 3 === 0 ? '3px' : '2px',
              height: i % 3 === 0 ? '3px' : '2px',
              backgroundColor: i % 5 === 0 ? '#FFD700' : '#fff',
              boxShadow: i % 5 === 0 ? '0 0 6px #FFD700' : 'none',
            }}
          />
        ))}
      </div>

      {/* Magical sparkles floating */}
      <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="absolute text-lg animate-bounce opacity-60"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + (i * 7) % 30}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '3s',
            }}
          >
            ✨
          </div>
        ))}
      </div>

      {/* Disney castle silhouette in background */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 opacity-10 text-[150px] pointer-events-none">
        🏰
      </div>

      {/* Title */}
      <div className="relative text-center mb-6 md:mb-8">
        <div className="inline-block">
          <h1
            className={`text-xl md:text-3xl text-magic-gold mb-1 transition-all duration-1000 ${
              titleGlow ? 'drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]' : ''
            }`}
          >
            Kristin's
          </h1>
          <h2 className="text-2xl md:text-4xl text-white font-bold tracking-wider drop-shadow-lg">
            MAGICAL
          </h2>
          <h2 className="text-xl md:text-3xl text-elsa-blue mt-1 drop-shadow-[0_0_10px_rgba(165,243,252,0.5)]">
            DISNEY TRAIL
          </h2>
        </div>

        {/* Subtitle with animated text */}
        <div className="mt-4 space-y-1">
          <p className="text-cat-orange text-xs md:text-sm">
            An Epic Journey from Tigard, Oregon
          </p>
          <p className="text-elsa-blue text-xs md:text-sm flex items-center justify-center gap-2">
            <span>to</span>
            <span className="inline-flex items-center gap-1">
              <span className="animate-pulse">🏰</span>
              Walt Disney World
              <span className="animate-pulse">🏰</span>
            </span>
          </p>
        </div>
      </div>

      {/* Animated tabby cats */}
      <div
        className={`flex justify-center items-end gap-4 md:gap-8 my-6 md:my-8 transition-all duration-1000 ${
          showCats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Marge - Brown tabby */}
        <div className="text-center transform hover:scale-110 transition-transform">
          <div className="animate-bounce" style={{ animationDelay: '0ms', animationDuration: '2s' }}>
            <TabbyCat variant="marge" size="lg" mood="happy" />
          </div>
          <p className="text-xs text-white/70 mt-1 font-bold">Marge</p>
          <p className="text-[10px] text-white/50">The Mom</p>
        </div>

        {/* Minestrone - Black tabby */}
        <div className="text-center transform hover:scale-110 transition-transform">
          <div className="animate-bounce" style={{ animationDelay: '150ms', animationDuration: '1.5s' }}>
            <TabbyCat variant="minestrone" size="lg" mood="excited" />
          </div>
          <p className="text-xs text-white/70 mt-1 font-bold">Minestrone</p>
          <p className="text-[10px] text-white/50">Troublemaker</p>
        </div>

        {/* Mac - White tabby */}
        <div className="text-center transform hover:scale-110 transition-transform">
          <div className="animate-bounce" style={{ animationDelay: '300ms', animationDuration: '2.5s' }}>
            <TabbyCat variant="mac" size="lg" mood="happy" />
          </div>
          <p className="text-xs text-white/70 mt-1 font-bold">Macaroni</p>
          <p className="text-[10px] text-white/50">Big Oaf</p>
        </div>
      </div>

      {/* Feature highlights */}
      <div className="flex justify-center gap-2 md:gap-4 mb-6 text-[10px] md:text-xs text-white/60">
        <span className="flex items-center gap-1">🎭 Theater</span>
        <span>•</span>
        <span className="flex items-center gap-1">💃 Dancing</span>
        <span>•</span>
        <span className="flex items-center gap-1">🍳 Cooking</span>
        <span>•</span>
        <span className="flex items-center gap-1">✨ Disney Magic</span>
      </div>

      {/* Menu buttons */}
      <div className="flex flex-col gap-3 items-center relative z-10">
        <button
          onClick={handleNewGame}
          className="w-full md:w-64 py-3 md:py-4 bg-gradient-to-r from-prairie-green to-green-600 hover:from-green-600 hover:to-prairie-green text-white rounded-lg border-2 border-white/20 transition-all hover:scale-105 hover:shadow-lg hover:shadow-green-500/30 font-bold text-sm md:text-base"
        >
          ✨ New Journey ✨
        </button>

        {isStarted && (
          <button
            onClick={handleContinue}
            className="w-full md:w-64 py-3 bg-gradient-to-r from-trail-brown to-amber-700 hover:from-amber-700 hover:to-trail-brown text-white rounded-lg border-2 border-white/20 transition-all hover:scale-105 font-bold text-sm md:text-base"
          >
            🛻 Continue Trail
          </button>
        )}

        <div className="flex gap-2 w-full md:w-64">
          <button
            onClick={() => setScreen('party-setup')}
            className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg border border-white/20 transition-all text-xs"
          >
            📖 How to Play
          </button>
          {isStarted && (
            <button
              onClick={() => setScreen('achievements')}
              className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg border border-white/20 transition-all text-xs"
            >
              🏆 Achievements
            </button>
          )}
        </div>
      </div>

      {/* Footer with love */}
      <div className="text-center mt-6 md:mt-8 relative z-10">
        <div className="inline-block px-4 py-2 bg-white/5 rounded-full">
          <p className="text-xs text-white/50">
            A Christmas gift from Mike 💕
          </p>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 text-xl md:text-2xl opacity-40 animate-pulse">
        🛻
      </div>
      <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 text-xl md:text-2xl opacity-40 animate-pulse" style={{ animationDelay: '1s' }}>
        🏰
      </div>
      <div className="absolute top-2 left-2 md:top-4 md:left-4 text-lg opacity-30">
        ❄️
      </div>
      <div className="absolute top-2 right-2 md:top-4 md:right-4 text-lg opacity-30">
        ✨
      </div>
    </div>
  );
}

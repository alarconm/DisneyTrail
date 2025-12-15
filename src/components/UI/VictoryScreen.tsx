import { useState, useEffect } from 'react';
import { useGameStore } from '../../stores/gameStore';

export default function VictoryScreen() {
  const { playerName, partyMembers, distanceTraveled, day, resetGame, toggleGooglyEyes, googlyEyesMode } = useGameStore();
  const [showFireworks] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [messageClicked, setMessageClicked] = useState(false);

  useEffect(() => {
    // Show Mike's message after fireworks
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const survivingCats = partyMembers.filter(m => m.type === 'cat' && m.isAlive);

  const handleMessageClick = () => {
    if (!messageClicked) {
      setMessageClicked(true);
      toggleGooglyEyes();
    }
  };

  const handlePlayAgain = () => {
    resetGame();
  };

  return (
    <div className="bg-gradient-to-b from-[#1a1a2e] via-[#4a1a6b] to-[#1a1a2e] rounded-lg p-6 shadow-2xl border-4 border-magic-gold relative overflow-hidden">
      {/* Fireworks */}
      {showFireworks && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 60}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            >
              {['✨', '🎆', '🎇', '⭐', '💫'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      {/* Disney Castle */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-4 animate-bounce">🏰</div>
        <h1 className="text-3xl text-magic-gold animate-pulse">
          YOU MADE IT!
        </h1>
        <h2 className="text-xl text-elsa-blue mt-2">
          WALT DISNEY WORLD
        </h2>
      </div>

      {/* Stats */}
      <div className="bg-white/10 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-3xl">📍</p>
            <p className="text-white text-lg">{distanceTraveled}</p>
            <p className="text-white/60 text-xs">Miles Traveled</p>
          </div>
          <div>
            <p className="text-3xl">📅</p>
            <p className="text-white text-lg">{day}</p>
            <p className="text-white/60 text-xs">Days on Trail</p>
          </div>
        </div>

        {/* Surviving party */}
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-white/60 text-xs text-center mb-2">Party Survivors:</p>
          <div className="flex justify-center gap-4">
            {survivingCats.map((cat) => (
              <div key={cat.id} className="text-center">
                <span className="text-2xl">🐱</span>
                <p className="text-xs text-white/70">{cat.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mike's Message */}
      {showMessage && (
        <div
          onClick={handleMessageClick}
          className={`bg-gradient-to-br from-magic-gold/20 to-pink-500/20 border-2 border-magic-gold rounded-lg p-6 mb-6 cursor-pointer transition-all hover:scale-[1.02] ${
            googlyEyesMode ? 'animate-wiggle' : ''
          }`}
        >
          <div className="text-center">
            <h3 className="text-xl text-magic-gold mb-4">
              🏰 CONGRATULATIONS, {playerName.toUpperCase()}! 🏰
            </h3>

            <p className="text-white text-sm leading-relaxed mb-4">
              You made it to the Happiest Place on Earth!
            </p>

            <p className="text-white text-sm leading-relaxed mb-4">
              But the real magic isn't in Florida...
              <br />
              It's at home in Tigard, with Marge, Minestrone,
              <br />
              Mac, and your husband who thinks you're
              <br />
              the most amazing person in the world.
            </p>

            <p className="text-pink-400 text-lg mb-4">
              Merry Christmas, my love. 💕
            </p>

            <p className="text-white text-sm italic">
              - Mike
            </p>

            <p className="text-white/40 text-xs mt-4">
              {messageClicked
                ? googlyEyesMode
                  ? '👀 GOOGLY EYES ACTIVATED! 👀'
                  : 'Click again for more googly!'
                : 'P.S. Click anywhere to add googly eyes to this message.'}
            </p>
          </div>
        </div>
      )}

      {/* Disney characters celebration */}
      <div className="flex justify-center gap-4 mb-6 text-3xl">
        <span className="animate-bounce" style={{ animationDelay: '0ms' }}>🐭</span>
        <span className="animate-bounce" style={{ animationDelay: '100ms' }}>❄️</span>
        <span className="animate-bounce" style={{ animationDelay: '200ms' }}>🧚</span>
        <span className="animate-bounce" style={{ animationDelay: '300ms' }}>🌊</span>
        <span className="animate-bounce" style={{ animationDelay: '400ms' }}>🐕</span>
      </div>

      {/* Play again */}
      <button
        onClick={handlePlayAgain}
        className="w-full py-4 bg-prairie-green hover:bg-green-700 text-white rounded-lg border-2 border-white/20 transition-all hover:scale-[1.02]"
      >
        Play Again
      </button>

      {/* Credits */}
      <p className="text-center text-xs text-white/30 mt-4">
        Made with 💕 for Kristin
        <br />
        Christmas 2025
      </p>
    </div>
  );
}

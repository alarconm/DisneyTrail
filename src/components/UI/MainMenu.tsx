import { useState, useEffect } from 'react';
import { useGameStore } from '../../stores/gameStore';
import TabbyCat from '../sprites/TabbyCat';

export default function MainMenu() {
  const { setScreen, isStarted, resetGame, cloudLoadGame, isSaving, cloudError } = useGameStore();
  const [showCats, setShowCats] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [loadName, setLoadName] = useState('');
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setShowCats(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleNewGame = () => {
    resetGame();
    setScreen('party-setup');
  };

  const handleContinue = () => {
    setScreen('travel');
  };

  const handleLoadCloud = async () => {
    if (!loadName.trim()) {
      setLoadError('Enter your name');
      return;
    }
    setLoadError('');
    const success = await cloudLoadGame(loadName.trim());
    if (!success) {
      setLoadError(cloudError || 'No save found for that name');
    }
  };

  return (
    <div className="relative bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-lg p-4 md:p-8 shadow-2xl border-4 border-magic-gold overflow-hidden">
      {/* Simple stars background - desktop only */}
      <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none hidden md:block">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-30"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 23) % 60}%`,
              width: '2px',
              height: '2px',
              backgroundColor: '#fff',
            }}
          />
        ))}
      </div>

      {/* Title */}
      <div className="relative text-center mb-4 md:mb-6">
        <div className="inline-block">
          <h1 className="text-base md:text-lg text-magic-gold mb-1">
            Kristin's
          </h1>
          <h2 className="text-lg md:text-2xl text-white font-bold tracking-wider">
            MAGICAL
          </h2>
          <h2 className="text-base md:text-lg text-elsa-blue mt-1">
            DISNEY TRAIL
          </h2>
        </div>

        {/* Subtitle */}
        <div className="mt-3 space-y-1">
          <p className="text-cat-orange text-[8px] md:text-xs">
            Tigard, Oregon to Walt Disney World
          </p>
        </div>
      </div>

      {/* Animated tabby cats */}
      <div
        className={`flex justify-center items-end gap-2 md:gap-6 my-4 md:my-6 transition-all duration-1000 ${
          showCats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="text-center">
          <TabbyCat variant="marge" size="md" mood="happy" />
          <p className="text-[8px] md:text-xs text-white/70 mt-1">Marge</p>
        </div>

        <div className="text-center">
          <TabbyCat variant="minestrone" size="md" mood="excited" />
          <p className="text-[8px] md:text-xs text-white/70 mt-1">Minestrone</p>
        </div>

        <div className="text-center">
          <TabbyCat variant="mac" size="md" mood="happy" />
          <p className="text-[8px] md:text-xs text-white/70 mt-1">Macaroni</p>
        </div>
      </div>

      {/* Menu buttons */}
      <div className="flex flex-col gap-2 items-center relative z-10">
        <button
          onClick={handleNewGame}
          className="w-full md:w-56 py-2 md:py-3 bg-prairie-green hover:bg-green-700 text-white rounded-lg border-2 border-white/20 transition-all text-xs md:text-sm"
        >
          New Journey
        </button>

        {isStarted && (
          <button
            onClick={handleContinue}
            className="w-full md:w-56 py-2 md:py-3 bg-trail-brown hover:bg-amber-800 text-white rounded-lg border-2 border-white/20 transition-all text-xs md:text-sm"
          >
            Continue Trail
          </button>
        )}

        <button
          onClick={() => setShowLoadModal(true)}
          className="w-full md:w-56 py-2 md:py-3 bg-elsa-blue/20 hover:bg-elsa-blue/30 text-elsa-blue rounded-lg border-2 border-elsa-blue/30 transition-all text-xs md:text-sm"
        >
          Load Cloud Save
        </button>

        <div className="flex gap-2 w-full md:w-56">
          <button
            onClick={() => setScreen('party-setup')}
            className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white/80 rounded-lg text-[8px] md:text-xs"
          >
            How to Play
          </button>
          {isStarted && (
            <button
              onClick={() => setScreen('achievements')}
              className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white/80 rounded-lg text-[8px] md:text-xs"
            >
              Achievements
            </button>
          )}
        </div>
      </div>

      {/* Footer with love */}
      <div className="text-center mt-4 relative z-10">
        <p className="text-[8px] md:text-xs text-white/50">
          Made with 💕 by Mike
        </p>
      </div>

      {/* Load Cloud Save Modal */}
      {showLoadModal && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20 rounded-lg">
          <div className="bg-[#1a1a2e] border-2 border-magic-gold rounded-lg p-4 mx-4 max-w-xs w-full">
            <h3 className="text-sm text-magic-gold mb-3 text-center">Load Cloud Save</h3>
            <p className="text-[8px] text-white/60 mb-3 text-center">
              Enter the name you used when starting your journey
            </p>
            <input
              type="text"
              value={loadName}
              onChange={(e) => setLoadName(e.target.value)}
              placeholder="Your name..."
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-xs mb-2"
              onKeyDown={(e) => e.key === 'Enter' && handleLoadCloud()}
            />
            {loadError && (
              <p className="text-red-400 text-[8px] mb-2 text-center">{loadError}</p>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowLoadModal(false);
                  setLoadName('');
                  setLoadError('');
                }}
                className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white/80 rounded text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleLoadCloud}
                disabled={isSaving}
                className="flex-1 py-2 bg-elsa-blue/30 hover:bg-elsa-blue/40 text-elsa-blue rounded text-xs disabled:opacity-50"
              >
                {isSaving ? 'Loading...' : 'Load'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

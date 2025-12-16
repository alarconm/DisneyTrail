import { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { Profession, PROFESSION_BONUSES } from '../../types/game.types';
import { playSound } from '../../services/audio';
import TabbyCat from '../sprites/TabbyCat';

export default function PartySetup() {
  const { startNewGame } = useGameStore();
  const [playerName, setPlayerName] = useState('Kristin');
  const [profession, setProfession] = useState<Profession>('actress');

  const handleStart = () => {
    playSound('success');
    startNewGame(playerName, profession);
  };

  const handleProfessionSelect = (prof: Profession) => {
    playSound('click');
    setProfession(prof);
  };

  const professions: Profession[] = [
    'actress',
    'card-shop-owner',
    'dance-teacher',
    'theater-director',
  ];

  return (
    <div className="bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-lg p-8 shadow-2xl border-4 border-magic-gold">
      <h1 className="text-2xl text-magic-gold text-center mb-6">
        Party Setup
      </h1>

      {/* Player name */}
      <div className="mb-6">
        <label className="block text-white text-sm mb-2">
          Party Leader Name:
        </label>
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="w-full px-4 py-2 bg-[#1a1a2e] border-2 border-magic-gold rounded text-white focus:outline-none focus:border-elsa-blue"
          maxLength={20}
        />
      </div>

      {/* Profession selection */}
      <div className="mb-6">
        <label className="block text-white text-sm mb-2">
          Choose Your Profession:
        </label>
        <div className="grid gap-2">
          {professions.map((prof) => (
            <button
              key={prof}
              onClick={() => handleProfessionSelect(prof)}
              className={`p-3 rounded border-2 text-left transition-all ${
                profession === prof
                  ? 'border-magic-gold bg-magic-gold/20 text-magic-gold'
                  : 'border-white/20 text-white/70 hover:border-white/40'
              }`}
            >
              <div className="text-sm font-bold">
                {PROFESSION_BONUSES[prof].description}
              </div>
              <div className="text-xs mt-1 opacity-70">
                Starting Gold: {PROFESSION_BONUSES[prof].goldCoins} coins
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Party members preview */}
      <div className="mb-6">
        <h2 className="text-white text-sm mb-3">Your Party:</h2>
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          <div className="text-center p-2 md:p-3 bg-white/5 rounded overflow-hidden">
            <div className="flex justify-center mb-1 md:mb-2">
              <TabbyCat variant="marge" size="sm" mood="happy" />
            </div>
            <p className="text-white text-[10px] md:text-xs truncate">Marge</p>
            <p className="text-white/50 text-[8px] md:text-xs truncate">The Mom</p>
          </div>
          <div className="text-center p-2 md:p-3 bg-white/5 rounded overflow-hidden">
            <div className="flex justify-center mb-1 md:mb-2">
              <TabbyCat variant="minestrone" size="sm" mood="excited" />
            </div>
            <p className="text-white text-[10px] md:text-xs truncate">Minestrone</p>
            <p className="text-white/50 text-[8px] md:text-xs truncate">Troublemaker</p>
          </div>
          <div className="text-center p-2 md:p-3 bg-white/5 rounded overflow-hidden">
            <div className="flex justify-center mb-1 md:mb-2">
              <TabbyCat variant="mac" size="sm" mood="happy" />
            </div>
            <p className="text-white text-[10px] md:text-xs truncate">Mac</p>
            <p className="text-white/50 text-[8px] md:text-xs truncate">Big Oaf</p>
          </div>
        </div>
      </div>

      {/* Month selection hint */}
      <div className="mb-6 p-3 bg-white/5 rounded text-xs text-white/60">
        <p>
          Your journey from <span className="text-cat-orange">Tigard, Oregon</span> to{' '}
          <span className="text-elsa-blue">Walt Disney World, Florida</span> begins in March 2025.
        </p>
        <p className="mt-2">
          Distance: ~3,200 miles through mountains, deserts, and plains.
        </p>
      </div>

      {/* Start button */}
      <button
        onClick={handleStart}
        disabled={!playerName.trim()}
        className="w-full py-4 bg-prairie-green hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg border-2 border-white/20 transition-all hover:scale-105 text-lg"
      >
        Head to the Store
      </button>

      {/* Back button */}
      <button
        onClick={() => {
          playSound('click');
          useGameStore.getState().setScreen('main-menu');
        }}
        className="w-full mt-2 py-2 bg-transparent hover:bg-white/10 text-white/60 rounded-lg text-sm"
      >
        Back to Menu
      </button>
    </div>
  );
}

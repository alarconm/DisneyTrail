import { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { ROADSIDE_ATTRACTIONS } from '../../data/landmarks';
import { playSound } from '../../services/audio';
import TabbyCat from '../sprites/TabbyCat';

interface RoadsideAttractionProps {
  attractionId: string;
  onComplete: () => void;
}

export default function RoadsideAttraction({ attractionId, onComplete }: RoadsideAttractionProps) {
  const { resources, updateResources, updateMorale, advanceDay } = useGameStore();
  const [showResult, setShowResult] = useState<'visit' | 'skip' | null>(null);

  const attraction = ROADSIDE_ATTRACTIONS[attractionId];

  if (!attraction) {
    onComplete();
    return null;
  }

  const canAfford = resources.goldCoins >= attraction.visitCost;

  const handleVisit = () => {
    if (!canAfford) return;

    playSound('success');

    // Pay the cost
    updateResources({ goldCoins: resources.goldCoins - attraction.visitCost });

    // Boost morale
    updateMorale(attraction.visitMoraleBoost);

    // Add special reward if any
    if (attraction.specialReward) {
      const currentAmount = resources[attraction.specialReward.resource] as number;
      updateResources({
        [attraction.specialReward.resource]: currentAmount + attraction.specialReward.amount,
      });
    }

    // Advance time if attraction takes time
    for (let i = 0; i < attraction.visitTime; i++) {
      advanceDay();
    }

    setShowResult('visit');
  };

  const handleSkip = () => {
    playSound('click');
    updateMorale(-attraction.skipMoralePenalty);
    setShowResult('skip');
  };

  const handleContinue = () => {
    playSound('click');
    onComplete();
  };

  if (showResult) {
    return (
      <div className="bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-lg p-6 shadow-2xl border-4 border-magic-gold">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">{attraction.emoji}</div>
          <h2 className="text-xl text-magic-gold">
            {showResult === 'visit' ? 'Fun Times!' : 'Drove On By...'}
          </h2>
        </div>

        <div className="p-4 bg-white/5 rounded-lg mb-6">
          {showResult === 'visit' ? (
            <>
              <p className="text-white text-sm mb-4">{attraction.catReaction}</p>
              <div className="flex justify-center gap-4 mb-4">
                <TabbyCat variant="marge" size="md" mood="happy" />
                <TabbyCat variant="minestrone" size="md" mood="excited" />
                <TabbyCat variant="mac" size="md" mood="happy" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-prairie-green text-sm">
                  +{attraction.visitMoraleBoost} Morale
                </p>
                {attraction.specialReward && (
                  <p className="text-magic-gold text-sm">
                    +{attraction.specialReward.amount} {attraction.specialReward.resource}
                  </p>
                )}
                {attraction.visitTime > 0 && (
                  <p className="text-white/60 text-xs">
                    Spent {attraction.visitTime} day{attraction.visitTime > 1 ? 's' : ''} here
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <p className="text-white/70 text-sm mb-4">
                The cats watched sadly as you drove past {attraction.name}...
              </p>
              <div className="flex justify-center gap-4 mb-4">
                <TabbyCat variant="marge" size="md" mood="sad" />
                <TabbyCat variant="minestrone" size="md" mood="sad" />
                <TabbyCat variant="mac" size="md" mood="sad" />
              </div>
              <p className="text-red-400 text-sm text-center">
                -{attraction.skipMoralePenalty} Morale
              </p>
            </>
          )}
        </div>

        <button
          onClick={handleContinue}
          className="w-full py-3 bg-prairie-green hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          Continue Journey
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-lg p-6 shadow-2xl border-4 border-magic-gold">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-2">{attraction.emoji}</div>
        <h1 className="text-2xl text-magic-gold">Roadside Attraction!</h1>
        <h2 className="text-lg text-white mt-1">{attraction.name}</h2>
      </div>

      {/* Description */}
      <div className="p-4 bg-white/5 rounded-lg mb-6">
        <p className="text-white text-sm leading-relaxed">
          {attraction.description}
        </p>
      </div>

      {/* Cats reaction preview */}
      <div className="flex justify-center gap-4 mb-6">
        <TabbyCat variant="marge" size="md" mood="excited" />
        <TabbyCat variant="minestrone" size="md" mood="excited" />
        <TabbyCat variant="mac" size="md" mood="excited" />
      </div>

      {/* Cost/benefit info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-prairie-green/20 rounded-lg border border-prairie-green/40">
          <h3 className="text-prairie-green text-sm font-bold mb-2">Visit</h3>
          <ul className="text-xs space-y-1">
            {attraction.visitCost > 0 && (
              <li className="text-magic-gold">Cost: ${attraction.visitCost}</li>
            )}
            {attraction.visitTime > 0 && (
              <li className="text-white/60">Time: {attraction.visitTime} day{attraction.visitTime > 1 ? 's' : ''}</li>
            )}
            <li className="text-prairie-green">+{attraction.visitMoraleBoost} Morale</li>
            {attraction.specialReward && (
              <li className="text-elsa-blue">
                +{attraction.specialReward.amount} {attraction.specialReward.resource}
              </li>
            )}
          </ul>
        </div>
        <div className="p-3 bg-red-900/20 rounded-lg border border-red-500/40">
          <h3 className="text-red-400 text-sm font-bold mb-2">Skip</h3>
          <ul className="text-xs space-y-1">
            <li className="text-red-400">-{attraction.skipMoralePenalty} Morale</li>
            <li className="text-white/60">Disappointed cats</li>
          </ul>
        </div>
      </div>

      {/* Current gold display */}
      <div className="text-center mb-4 text-sm">
        <span className="text-white/60">Your gold: </span>
        <span className="text-magic-gold">${resources.goldCoins}</span>
      </div>

      {/* Action buttons */}
      <div className="space-y-2">
        <button
          onClick={handleVisit}
          disabled={!canAfford}
          className={`w-full py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
            canAfford
              ? 'bg-prairie-green hover:bg-green-700 text-white'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          <span>{attraction.emoji}</span>
          <span>
            {canAfford
              ? `Visit ${attraction.name}${attraction.visitCost > 0 ? ` ($${attraction.visitCost})` : ' (Free!)'}`
              : 'Not enough gold'}
          </span>
        </button>

        <button
          onClick={handleSkip}
          className="w-full py-3 bg-white/10 hover:bg-white/20 text-white/70 rounded-lg transition-colors"
        >
          Skip and keep driving
        </button>
      </div>

      {/* Warning */}
      <p className="mt-4 text-center text-xs text-cat-orange">
        The cats are REALLY excited about this stop...
      </p>
    </div>
  );
}

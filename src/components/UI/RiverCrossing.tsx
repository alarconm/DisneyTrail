import { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { RiverCrossingOption } from '../../types/game.types';

interface CrossingOutcome {
  success: boolean;
  message: string;
  foodLost?: number;
  itemsLost?: string[];
}

export default function RiverCrossing() {
  const { setScreen, resources, updateResources, partyMembers, updatePartyMember } = useGameStore();
  const [, setSelectedOption] = useState<RiverCrossingOption | null>(null);
  const [outcome, setOutcome] = useState<CrossingOutcome | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const riverDepth = Math.floor(Math.random() * 4) + 2; // 2-5 feet
  const isDeep = riverDepth >= 4;

  const options: { id: RiverCrossingOption; label: string; description: string; cost?: number; costType?: string; risk: string }[] = [
    {
      id: 'ford',
      label: 'Ford the River',
      description: `Attempt to wade across (${riverDepth} feet deep)`,
      risk: isDeep ? 'HIGH RISK - The cats will NOT be happy!' : 'Medium risk',
    },
    {
      id: 'caulk-and-float',
      label: 'Caulk Wagon & Float',
      description: 'Seal the wagon and float across',
      risk: 'Medium risk - Hope it floats!',
    },
    {
      id: 'ferry',
      label: 'Take the Ferry',
      description: 'Safe passage with the Disney ferryman',
      cost: 50,
      costType: 'goldCoins',
      risk: 'No risk',
    },
    {
      id: 'wait-for-elsa',
      label: 'Wait for Elsa',
      description: "Maybe she'll freeze the river?",
      cost: 10,
      costType: 'pixieDust',
      risk: 'No risk if she appears!',
    },
    {
      id: 'call-moana',
      label: 'Call Moana',
      description: 'The wayfinder knows the waters',
      cost: 15,
      costType: 'pixieDust',
      risk: 'Very low risk',
    },
  ];

  const attemptCrossing = (option: RiverCrossingOption) => {
    setSelectedOption(option);
    setIsAnimating(true);

    // Process after animation
    setTimeout(() => {
      let result: CrossingOutcome;

      switch (option) {
        case 'ford':
          const fordChance = isDeep ? 0.4 : 0.7;
          if (Math.random() < fordChance) {
            result = {
              success: true,
              message: isDeep
                ? 'Made it! The cats are FURIOUS about getting wet, but safe.'
                : 'Crossed successfully! Only minor complaints from the cats.',
            };
          } else {
            const foodLost = Math.floor(Math.random() * 30) + 20;
            result = {
              success: false,
              message: 'The wagon tipped! You lost some supplies and the cats are VERY upset.',
              foodLost,
            };
            updateResources({ food: Math.max(0, resources.food - foodLost) });
            // Damage morale by making cats upset
            partyMembers.forEach(member => {
              if (member.type === 'cat' && member.isAlive) {
                updatePartyMember(member.id, { health: Math.max(10, member.health - 10) });
              }
            });
          }
          break;

        case 'caulk-and-float':
          if (Math.random() < 0.6) {
            result = {
              success: true,
              message: 'The wagon floats! Mac looks terrified but Minestrone thinks this is the best day ever.',
            };
          } else {
            const foodLost = Math.floor(Math.random() * 20) + 10;
            result = {
              success: false,
              message: 'Some water got in! Supplies got wet.',
              foodLost,
            };
            updateResources({ food: Math.max(0, resources.food - foodLost) });
          }
          break;

        case 'ferry':
          if (resources.goldCoins >= 50) {
            updateResources({ goldCoins: resources.goldCoins - 50 });
            result = {
              success: true,
              message: '"All aboard!" says the cheerful ferryman. Safe crossing guaranteed. The cats approve.',
            };
          } else {
            result = {
              success: false,
              message: "Not enough gold coins for the ferry!",
            };
          }
          break;

        case 'wait-for-elsa':
          if (resources.pixieDust >= 10) {
            updateResources({ pixieDust: resources.pixieDust - 10 });
            result = {
              success: true,
              message: '❄️ Elsa appears! "The cold never bothered me anyway." She freezes the river solid. You walk across like it\'s nothing!',
            };
          } else {
            result = {
              success: false,
              message: "Not enough Pixie Dust! Elsa doesn't appear.",
            };
          }
          break;

        case 'call-moana':
          if (resources.pixieDust >= 15) {
            updateResources({ pixieDust: resources.pixieDust - 15 });
            result = {
              success: true,
              message: '🌊 Moana arrives! "I am Moana of Motunui. You will board my boat, cross the river, and I will deliver you to the other side." The cats are impressed.',
            };
          } else {
            result = {
              success: false,
              message: "Not enough Pixie Dust! The ocean doesn't answer.",
            };
          }
          break;

        default:
          result = { success: false, message: 'Something went wrong...' };
      }

      setOutcome(result);
      setIsAnimating(false);
    }, 2000);
  };

  const handleContinue = () => {
    setScreen('travel');
  };

  if (outcome) {
    return (
      <div className="bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-lg p-6 shadow-2xl border-4 border-magic-gold">
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">
            {outcome.success ? '🎉' : '😱'}
          </div>
          <h1 className={`text-xl ${outcome.success ? 'text-prairie-green' : 'text-red-400'}`}>
            {outcome.success ? 'Crossing Successful!' : 'Trouble!'}
          </h1>
        </div>

        <div className={`p-4 rounded-lg border-2 mb-6 ${
          outcome.success ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'
        }`}>
          <p className="text-white text-sm leading-relaxed">
            {outcome.message}
          </p>
          {outcome.foodLost && (
            <p className="text-red-400 text-sm mt-2">
              Lost {outcome.foodLost} lbs of food!
            </p>
          )}
        </div>

        <button
          onClick={handleContinue}
          className="w-full py-4 bg-prairie-green hover:bg-green-700 text-white rounded-lg transition-colors"
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
        <div className="text-4xl mb-2">🌊</div>
        <h1 className="text-xl text-magic-gold">River Crossing</h1>
        <p className="text-white/60 text-sm">
          River depth: {riverDepth} feet {isDeep && '(Deep!)'}
        </p>
      </div>

      {/* River animation */}
      <div className="relative h-24 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 rounded-lg mb-6 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          {isAnimating ? (
            <div className="text-4xl animate-bounce">🛻</div>
          ) : (
            <div className="text-2xl animate-pulse">🌊🌊🌊</div>
          )}
        </div>
        {/* Water animation */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-blue-300/50 animate-pulse" />
      </div>

      {/* Options */}
      {!isAnimating && (
        <div className="space-y-2 mb-6">
          {options.map((option) => {
            const canAfford = !option.cost ||
              (option.costType === 'goldCoins' && resources.goldCoins >= option.cost) ||
              (option.costType === 'pixieDust' && resources.pixieDust >= option.cost);

            return (
              <button
                key={option.id}
                onClick={() => attemptCrossing(option.id)}
                disabled={!canAfford}
                className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                  canAfford
                    ? 'border-white/20 hover:border-magic-gold hover:bg-white/5'
                    : 'border-white/10 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-bold text-sm">{option.label}</p>
                    <p className="text-white/60 text-xs">{option.description}</p>
                    <p className={`text-xs mt-1 ${
                      option.risk.includes('HIGH') ? 'text-red-400' :
                      option.risk.includes('No') ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {option.risk}
                    </p>
                  </div>
                  {option.cost && (
                    <span className="text-magic-gold text-sm">
                      {option.cost} {option.costType === 'pixieDust' ? '✨' : '🪙'}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Loading state */}
      {isAnimating && (
        <div className="text-center text-white animate-pulse">
          Crossing the river...
        </div>
      )}

      {/* Current resources */}
      <div className="flex justify-center gap-4 text-sm text-white/60">
        <span>💰 {resources.goldCoins}</span>
        <span>✨ {resources.pixieDust}</span>
      </div>
    </div>
  );
}

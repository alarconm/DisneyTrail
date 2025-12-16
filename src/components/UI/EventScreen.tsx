import { EventEffect } from '../../types/game.types';
import { useGameStore } from '../../stores/gameStore';
import { playSound } from '../../services/audio';

export default function EventScreen() {
  const {
    currentEvent, clearEvent, updateResources, resources, partyMembers, updatePartyMember,
    addDisneyCharacterMet, incrementAchievementStat, updateAchievementStats, advanceDay, updateMorale
  } = useGameStore();

  if (!currentEvent) {
    clearEvent();
    return null;
  }

  // Helper function to apply effects
  const applyEffects = (effects: EventEffect[]) => {
    effects.forEach((effect) => {
      switch (effect.type) {
        case 'resource':
          if (effect.resource) {
            const currentValue = resources[effect.resource];
            updateResources({
              [effect.resource]: Math.max(0, currentValue + effect.amount),
            });
          }
          break;
        case 'health':
          if (effect.target === 'all') {
            partyMembers.forEach((member) => {
              if (member.isAlive) {
                updatePartyMember(member.id, {
                  health: Math.min(100, Math.max(0, member.health + effect.amount)),
                });
              }
            });
          } else if (effect.target) {
            const targetMember = partyMembers.find(
              (m) => m.name.toLowerCase() === effect.target?.toLowerCase() || m.id === effect.target?.toLowerCase()
            );
            if (targetMember && targetMember.isAlive) {
              updatePartyMember(targetMember.id, {
                health: Math.min(100, Math.max(0, targetMember.health + effect.amount)),
              });
            }
          }
          break;
        case 'morale':
          updateMorale(effect.amount);
          break;
        case 'time':
          for (let i = 0; i < Math.abs(effect.amount); i++) {
            advanceDay();
          }
          break;
      }
    });
  };

  // Track achievements for this event
  const trackAchievements = () => {
    if (currentEvent.disneyCharacter) {
      addDisneyCharacterMet(currentEvent.disneyCharacter);
    }

    switch (currentEvent.id) {
      case 'minestrone-food-raid':
      case 'minestrone-zoomies':
      case 'minestrone-escape':
      case 'minestrone-trouble':
      case 'minestrone-sass':
      case 'minestrone-midnight':
      case 'minestrone-escape-choice':
        incrementAchievementStat('minestroneEventsCount');
        break;
      case 'mac-wheel':
      case 'mac-ate-map':
      case 'mac-nap-spot':
      case 'mac-got-out':
      case 'mac-stuck':
      case 'mac-demands':
      case 'mac-carsick':
        incrementAchievementStat('macBreaksCount');
        break;
      case 'mtg-booster':
        updateAchievementStats({ foundMTGBooster: true });
        break;
      case 'oregon-duck-blessing':
        updateAchievementStats({ foundDuckBlessing: true });
        break;
      case 'theater-troupe':
        updateAchievementStats({ foundTheaterReference: true });
        break;
      case 'mike-love-note':
        updateAchievementStats({ foundLoveNote: true });
        break;
      case 'mike-merchant':
        addDisneyCharacterMet('mike');
        break;
    }
  };

  const handleContinue = () => {
    playSound('click');
    trackAchievements();
    applyEffects(currentEvent.effects);
    clearEvent();
  };

  const handleChoice = (choiceIndex: number) => {
    if (!currentEvent.choices) return;

    const choice = currentEvent.choices[choiceIndex];

    // Check if player can afford required resource
    if (choice.requiredResource) {
      const currentAmount = resources[choice.requiredResource.resource] as number;
      if (currentAmount < choice.requiredResource.amount) {
        playSound('error');
        return;
      }
      // Deduct the required resource cost
      updateResources({
        [choice.requiredResource.resource]: currentAmount - choice.requiredResource.amount,
      });
    }

    playSound('success');
    trackAchievements();
    applyEffects(choice.effects);
    clearEvent();
  };

  // Check if choice is affordable
  const canAffordChoice = (choiceIndex: number): boolean => {
    if (!currentEvent.choices) return true;
    const choice = currentEvent.choices[choiceIndex];
    if (!choice.requiredResource) return true;
    const currentAmount = resources[choice.requiredResource.resource] as number;
    return currentAmount >= choice.requiredResource.amount;
  };

  // Check if this is a choice-based event
  const hasChoices = currentEvent.choices && currentEvent.choices.length > 0;

  const getEventTypeStyle = () => {
    switch (currentEvent.type) {
      case 'good':
        return 'border-green-500 bg-green-500/10';
      case 'bad':
        return 'border-red-500 bg-red-500/10';
      case 'special':
        return 'border-magic-gold bg-magic-gold/10';
      default:
        return 'border-white/20 bg-white/5';
    }
  };

  const getEventEmoji = () => {
    switch (currentEvent.type) {
      case 'good':
        return '✨';
      case 'bad':
        return '⚠️';
      case 'special':
        return '🌟';
      default:
        return '📜';
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-lg p-6 shadow-2xl border-4 border-magic-gold">
      {/* Event header */}
      <div className="text-center mb-6">
        <span className="text-4xl mb-2 block">{getEventEmoji()}</span>
        <h1 className="text-xl text-magic-gold">{currentEvent.title}</h1>
      </div>

      {/* Disney character if present */}
      {currentEvent.disneyCharacter && (
        <div className="text-center mb-4">
          <div className="inline-block text-5xl md:text-6xl animate-bounce">
            {currentEvent.disneyCharacter === 'elsa' && '❄️'}
            {currentEvent.disneyCharacter === 'tinkerbell' && '🧚'}
            {currentEvent.disneyCharacter === 'stitch' && '👾'}
            {currentEvent.disneyCharacter === 'baymax' && '🤖'}
            {currentEvent.disneyCharacter === 'rapunzel' && '👸'}
            {currentEvent.disneyCharacter === 'goofy' && '🐕'}
          </div>
        </div>
      )}

      {/* Event description */}
      <div className={`p-4 rounded-lg border-2 ${getEventTypeStyle()} mb-6`}>
        <p className="text-white text-sm leading-relaxed">
          {currentEvent.description}
        </p>
      </div>

      {/* Effects summary for non-choice events */}
      {!hasChoices && currentEvent.effects.length > 0 && (
        <div className="mb-6 space-y-2">
          {currentEvent.effects.map((effect, index) => (
            <div
              key={index}
              className={`flex justify-between items-center p-2 rounded ${
                effect.amount > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}
            >
              <span className="text-sm">
                {effect.type === 'resource' && effect.resource && (
                  <>
                    {effect.resource === 'food' && '🥫 Food'}
                    {effect.resource === 'catTreats' && '🐟 Cat Treats'}
                    {effect.resource === 'goldCoins' && '💰 Gold'}
                    {effect.resource === 'pixieDust' && '✨ Pixie Dust'}
                    {effect.resource === 'spareTires' && '🛞 Spare Tire'}
                    {effect.resource === 'firstAidKits' && '🩹 First Aid'}
                  </>
                )}
                {effect.type === 'health' && '💖 Health'}
                {effect.type === 'morale' && '😊 Morale'}
                {effect.type === 'time' && '⏰ Days'}
              </span>
              <span className="font-bold">
                {effect.amount > 0 ? '+' : ''}{effect.amount}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Choice buttons for choice-based events */}
      {hasChoices && currentEvent.choices && (
        <div className="mb-6 space-y-3">
          <p className="text-white/60 text-sm text-center mb-3">What do you do?</p>
          {currentEvent.choices.map((choice, index) => {
            const affordable = canAffordChoice(index);
            return (
              <button
                key={index}
                onClick={() => handleChoice(index)}
                disabled={!affordable}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  affordable
                    ? 'border-magic-gold/50 bg-magic-gold/10 hover:bg-magic-gold/20 text-white'
                    : 'border-gray-600 bg-gray-800/50 text-gray-500 cursor-not-allowed'
                }`}
              >
                <div className="font-bold text-sm mb-1">{choice.text}</div>
                {choice.requiredResource && (
                  <div className={`text-xs mb-2 ${affordable ? 'text-magic-gold' : 'text-red-400'}`}>
                    Requires: {choice.requiredResource.amount} {choice.requiredResource.resource}
                    {!affordable && ' (Not enough!)'}
                  </div>
                )}
                <div className="flex flex-wrap gap-2 text-xs">
                  {choice.effects.map((effect, effectIndex) => (
                    <span
                      key={effectIndex}
                      className={`px-2 py-1 rounded ${
                        effect.amount > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {effect.type === 'resource' && effect.resource && (
                        <>
                          {effect.resource === 'food' && '🥫'}
                          {effect.resource === 'catTreats' && '🐟'}
                          {effect.resource === 'goldCoins' && '💰'}
                          {effect.resource === 'pixieDust' && '✨'}
                          {effect.resource === 'spareTires' && '🛞'}
                          {effect.resource === 'firstAidKits' && '🩹'}
                          {effect.resource === 'engineParts' && '⚙️'}
                          {effect.resource === 'toolkits' && '🔧'}
                        </>
                      )}
                      {effect.type === 'health' && '💖'}
                      {effect.type === 'morale' && '😊'}
                      {effect.type === 'time' && '⏰'}
                      {' '}{effect.amount > 0 ? '+' : ''}{effect.amount}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Continue button for non-choice events */}
      {!hasChoices && (
        <button
          onClick={handleContinue}
          className="w-full py-4 bg-prairie-green hover:bg-green-700 text-white rounded-lg border-2 border-white/20 transition-all hover:scale-[1.02] text-lg"
        >
          Continue Journey
        </button>
      )}
    </div>
  );
}

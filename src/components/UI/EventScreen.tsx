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

  const handleContinue = () => {
    playSound('click');

    // Track Disney character encounters for achievements
    if (currentEvent.disneyCharacter) {
      addDisneyCharacterMet(currentEvent.disneyCharacter);
    }

    // Track special event achievements
    switch (currentEvent.id) {
      // Minestrone mischief events
      case 'minestrone-food-raid':
      case 'minestrone-zoomies':
      case 'minestrone-escape':
      case 'minestrone-trouble':
      case 'minestrone-sass':
      case 'minestrone-midnight':
        incrementAchievementStat('minestroneEventsCount');
        break;
      // Mac breaking things events
      case 'mac-wheel':
      case 'mac-ate-map':
      case 'mac-nap-spot':
      case 'mac-got-out':
      case 'mac-stuck':
      case 'mac-demands':
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

    // Apply event effects
    currentEvent.effects.forEach((effect) => {
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
            // Apply to all party members
            partyMembers.forEach((member) => {
              if (member.isAlive) {
                updatePartyMember(member.id, {
                  health: Math.min(100, Math.max(0, member.health + effect.amount)),
                });
              }
            });
          } else if (effect.target) {
            // Apply to specific cat by name (e.g., 'Mac', 'Marge', 'Minestrone')
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
          // Apply morale changes
          updateMorale(effect.amount);
          break;
        case 'time':
          // Time loss advances days (positive = days lost)
          for (let i = 0; i < Math.abs(effect.amount); i++) {
            advanceDay();
          }
          break;
      }
    });

    clearEvent();
  };

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

      {/* Effects summary */}
      {currentEvent.effects.length > 0 && (
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
                    {effect.resource === 'wagonWheels' && '🛞 Wagon Wheel'}
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

      {/* Continue button */}
      <button
        onClick={handleContinue}
        className="w-full py-4 bg-prairie-green hover:bg-green-700 text-white rounded-lg border-2 border-white/20 transition-all hover:scale-[1.02] text-lg"
      >
        Continue Journey
      </button>
    </div>
  );
}

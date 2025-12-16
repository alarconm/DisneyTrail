import { useState } from 'react';
import { playSound } from '../../services/audio';

interface HelpGuideProps {
  onClose: () => void;
}

type GuideSection = 'morale' | 'resources' | 'pacing' | 'rations' | 'cats' | 'tips';

const SECTIONS: { id: GuideSection; title: string; emoji: string }[] = [
  { id: 'morale', title: 'Morale', emoji: '💖' },
  { id: 'resources', title: 'Resources', emoji: '🎒' },
  { id: 'pacing', title: 'Pacing', emoji: '🚗' },
  { id: 'rations', title: 'Rations', emoji: '🍕' },
  { id: 'cats', title: 'The Cats', emoji: '🐱' },
  { id: 'tips', title: 'Pro Tips', emoji: '💡' },
];

export default function HelpGuide({ onClose }: HelpGuideProps) {
  const [activeSection, setActiveSection] = useState<GuideSection>('morale');

  const handleSectionChange = (section: GuideSection) => {
    playSound('click');
    setActiveSection(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'morale':
        return (
          <div className="space-y-4">
            <p className="text-white/80">
              Morale represents your party's spirits. If it hits 0 in Challenging mode, it's game over!
            </p>
            <div className="bg-prairie-green/20 p-3 rounded border border-prairie-green/40">
              <h4 className="text-prairie-green font-bold mb-2">Ways to RAISE Morale:</h4>
              <ul className="text-white/70 text-sm space-y-1">
                <li>• <span className="text-magic-gold">Rest</span> - Take a day off (+5-10)</li>
                <li>• <span className="text-magic-gold">Minigames</span> - Play karaoke, dance, theater, or cook (+10-30)</li>
                <li>• <span className="text-magic-gold">Roadside Attractions</span> - Visit fun stops (+15-30)</li>
                <li>• <span className="text-magic-gold">Cat Treats</span> - Happy cats = happy party</li>
                <li>• <span className="text-magic-gold">Good Events</span> - Lucky encounters boost spirits</li>
                <li>• <span className="text-magic-gold">Filling Rations</span> - Well-fed party is happier</li>
              </ul>
            </div>
            <div className="bg-red-900/20 p-3 rounded border border-red-500/40">
              <h4 className="text-red-400 font-bold mb-2">Things that LOWER Morale:</h4>
              <ul className="text-white/70 text-sm space-y-1">
                <li>• <span className="text-red-400">Running out of food</span> - Starvation is demoralizing</li>
                <li>• <span className="text-red-400">No cat treats</span> - Unhappy cats complain loudly</li>
                <li>• <span className="text-red-400">Grueling pace</span> - Exhaustion wears everyone down</li>
                <li>• <span className="text-red-400">Bad events</span> - Breakdowns and disasters</li>
                <li>• <span className="text-red-400">Skipping attractions</span> - Cats get disappointed</li>
                <li>• <span className="text-red-400">Party illness</span> - Sick members affect everyone</li>
              </ul>
            </div>
          </div>
        );

      case 'resources':
        return (
          <div className="space-y-3">
            <div className="grid gap-2">
              <ResourceItem
                emoji="🍕"
                name="Food"
                desc="Consumed daily based on ration level. Run out and your party starves!"
                source="Shops, foraging minigame, lucky events"
              />
              <ResourceItem
                emoji="🐟"
                name="Cat Treats"
                desc="Keep your cats happy and healthy. 1 treat per day keeps them purring."
                source="Shops, random events"
              />
              <ResourceItem
                emoji="🛞"
                name="Spare Tires"
                desc="Essential for fixing flat tires on the road."
                source="Shops, gas stations"
              />
              <ResourceItem
                emoji="⚙️"
                name="Engine Parts"
                desc="Needed to repair engine breakdowns."
                source="Shops, mechanic events"
              />
              <ResourceItem
                emoji="🔧"
                name="Toolkits"
                desc="Helps fix various vehicle problems."
                source="Shops"
              />
              <ResourceItem
                emoji="✨"
                name="Pixie Dust"
                desc="Rare magical resource. Can heal party members and boost luck!"
                source="Disney character encounters, mystery spots"
              />
              <ResourceItem
                emoji="💰"
                name="Gold Coins"
                desc="Currency for buying supplies at shops and attractions."
                source="Starting bonus, trading, lucky events"
              />
              <ResourceItem
                emoji="🩹"
                name="First Aid Kits"
                desc="Heals sick or injured party members."
                source="Shops, nurse encounters"
              />
              <ResourceItem
                emoji="🧺"
                name="Foraging Baskets"
                desc="Required to play the foraging minigame. Each basket is used up per game."
                source="Shops"
              />
            </div>
          </div>
        );

      case 'pacing':
        return (
          <div className="space-y-4">
            <p className="text-white/80">
              Travel pace affects how fast you move and how it impacts your party.
            </p>
            <div className="space-y-3">
              <PaceItem
                name="Steady"
                speed="15-20 miles/day"
                effect="Normal health drain"
                recommended
              />
              <PaceItem
                name="Strenuous"
                speed="20-25 miles/day"
                effect="Faster travel, slight health drain"
              />
              <PaceItem
                name="Grueling"
                speed="25-30 miles/day"
                effect="Fastest but health drops quickly, morale suffers"
                warning
              />
              <PaceItem
                name="Resting"
                speed="0 miles/day"
                effect="Party heals and morale recovers"
              />
            </div>
            <div className="bg-elsa-blue/20 p-3 rounded border border-elsa-blue/40 text-sm">
              <p className="text-elsa-blue font-bold">Tip:</p>
              <p className="text-white/70">
                Balance speed with health. A grueling pace might seem faster, but
                stopping to heal sick party members costs more time overall!
              </p>
            </div>
          </div>
        );

      case 'rations':
        return (
          <div className="space-y-4">
            <p className="text-white/80">
              Ration levels control how much food your party consumes each day.
            </p>
            <div className="space-y-3">
              <RationItem
                name="Filling"
                consumption="3-4 food per person/day"
                effect="Best health maintenance, slight morale boost"
                recommended
              />
              <RationItem
                name="Meager"
                consumption="2-3 food per person/day"
                effect="Balanced - conserves food with minimal impact"
              />
              <RationItem
                name="Bare Bones"
                consumption="1-2 food per person/day"
                effect="Maximum conservation but health slowly drops"
                warning
              />
            </div>
            <div className="bg-cat-orange/20 p-3 rounded border border-cat-orange/40 text-sm">
              <p className="text-cat-orange font-bold">Difficulty Note:</p>
              <p className="text-white/70">
                Challenging mode uses higher consumption rates (4/3/2 instead of 3/2/1).
                Plan your food supplies accordingly!
              </p>
            </div>
          </div>
        );

      case 'cats':
        return (
          <div className="space-y-4">
            <p className="text-white/80">
              Your three tabby cats are the heart of your party. Keep them happy!
            </p>
            <div className="space-y-3">
              <CatItem
                name="Marge"
                personality="The wise mom cat who keeps everyone together"
                needs="Appreciates rest stops and orderly travel"
                quirk="Gets grumpy if you skip too many attractions"
              />
              <CatItem
                name="Minestrone"
                personality="The troublemaker acrobat who causes mischief"
                needs="Loves excitement and adventure"
                quirk="Might escape at rest stops - keep treats ready!"
              />
              <CatItem
                name="Macaroni (Mac)"
                personality="The big loveable oaf who accidentally breaks things"
                needs="Gets carsick on long drives without breaks"
                quirk="His size means he needs extra treats"
              />
            </div>
            <div className="bg-magic-gold/20 p-3 rounded border border-magic-gold/40 text-sm">
              <p className="text-magic-gold font-bold">Cat Care Tips:</p>
              <ul className="text-white/70 space-y-1">
                <li>• Give treats daily to maintain cat happiness</li>
                <li>• Stop at roadside attractions - cats love exploring</li>
                <li>• Rest when cats seem tired or grumpy</li>
                <li>• Watch for cat-specific events that affect individual cats</li>
              </ul>
            </div>
          </div>
        );

      case 'tips':
        return (
          <div className="space-y-3">
            <TipItem
              title="Stock Up Early"
              text="Buy extra food and treats at the first shop - prices may vary later!"
            />
            <TipItem
              title="Play Minigames"
              text="Minigames give food, morale boosts, and are free to play. Use them often!"
            />
            <TipItem
              title="Don't Skip Attractions"
              text="The morale penalty for skipping roadside attractions isn't worth the time saved."
            />
            <TipItem
              title="Watch the Weather"
              text="Bad weather slows travel. Consider resting during storms."
            />
            <TipItem
              title="Save Pixie Dust"
              text="Pixie dust is rare and valuable. Save it for emergencies or tough events."
            />
            <TipItem
              title="Balance Pace and Health"
              text="A steady pace with filling rations is safest. Speed runs risk everyone's health."
            />
            <TipItem
              title="Cat Emergencies"
              text="When a cat event happens, always choose the option that helps them - morale losses compound!"
            />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-lg border-4 border-magic-gold max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-magic-gold/30 flex justify-between items-center">
          <h2 className="text-xl text-magic-gold">Trail Guide</h2>
          <button
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="text-white/60 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Navigation tabs */}
        <div className="flex flex-wrap gap-1 p-2 bg-black/20 border-b border-white/10">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => handleSectionChange(section.id)}
              className={`px-3 py-1.5 rounded text-sm transition-all ${
                activeSection === section.id
                  ? 'bg-magic-gold text-[#1a1a2e] font-bold'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {section.emoji} {section.title}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {renderContent()}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-magic-gold/30 text-center">
          <button
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="px-6 py-2 bg-prairie-green hover:bg-green-700 text-white rounded transition-all"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper components
function ResourceItem({ emoji, name, desc, source }: { emoji: string; name: string; desc: string; source: string }) {
  return (
    <div className="bg-white/5 p-2 rounded">
      <div className="flex items-center gap-2">
        <span className="text-lg">{emoji}</span>
        <span className="text-white font-bold text-sm">{name}</span>
      </div>
      <p className="text-white/60 text-xs mt-1">{desc}</p>
      <p className="text-magic-gold/70 text-xs mt-1">Get from: {source}</p>
    </div>
  );
}

function PaceItem({ name, speed, effect, recommended, warning }: { name: string; speed: string; effect: string; recommended?: boolean; warning?: boolean }) {
  return (
    <div className={`p-3 rounded border ${
      recommended ? 'border-prairie-green/50 bg-prairie-green/10' :
      warning ? 'border-red-500/50 bg-red-900/10' :
      'border-white/20 bg-white/5'
    }`}>
      <div className="flex justify-between items-center">
        <span className={`font-bold ${recommended ? 'text-prairie-green' : warning ? 'text-red-400' : 'text-white'}`}>
          {name}
          {recommended && <span className="text-xs ml-2">(Recommended)</span>}
        </span>
        <span className="text-white/60 text-sm">{speed}</span>
      </div>
      <p className="text-white/60 text-sm mt-1">{effect}</p>
    </div>
  );
}

function RationItem({ name, consumption, effect, recommended, warning }: { name: string; consumption: string; effect: string; recommended?: boolean; warning?: boolean }) {
  return (
    <div className={`p-3 rounded border ${
      recommended ? 'border-prairie-green/50 bg-prairie-green/10' :
      warning ? 'border-cat-orange/50 bg-cat-orange/10' :
      'border-white/20 bg-white/5'
    }`}>
      <div className="flex justify-between items-center">
        <span className={`font-bold ${recommended ? 'text-prairie-green' : warning ? 'text-cat-orange' : 'text-white'}`}>
          {name}
          {recommended && <span className="text-xs ml-2">(Recommended)</span>}
        </span>
        <span className="text-white/60 text-sm">{consumption}</span>
      </div>
      <p className="text-white/60 text-sm mt-1">{effect}</p>
    </div>
  );
}

function CatItem({ name, personality, needs, quirk }: { name: string; personality: string; needs: string; quirk: string }) {
  return (
    <div className="p-3 rounded border border-cat-orange/30 bg-cat-orange/5">
      <h4 className="text-cat-orange font-bold">{name}</h4>
      <p className="text-white/70 text-sm mt-1">{personality}</p>
      <p className="text-white/50 text-xs mt-1"><span className="text-prairie-green">Needs:</span> {needs}</p>
      <p className="text-white/50 text-xs"><span className="text-elsa-blue">Quirk:</span> {quirk}</p>
    </div>
  );
}

function TipItem({ title, text }: { title: string; text: string }) {
  return (
    <div className="p-3 rounded border border-magic-gold/30 bg-magic-gold/5">
      <h4 className="text-magic-gold font-bold text-sm">{title}</h4>
      <p className="text-white/70 text-sm mt-1">{text}</p>
    </div>
  );
}

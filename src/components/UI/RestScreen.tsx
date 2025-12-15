import { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import TabbyCat from '../sprites/TabbyCat';

const CAMPFIRE_STORIES = [
  "Marge tells the tale of the time she caught a spider the size of a nickel. The others aren't sure if they believe her.",
  "Mac tries to tell a story but falls asleep halfway through. Classic Mac.",
  "Minestrone acts out an elaborate hunt. She's very dramatic about it.",
  "You tell the cats about Walt Disney World. They seem intrigued by the 'big castle with lots of hiding spots.'",
  "Marge reminisces about sunny afternoons in Tigard. Everyone gets a little homesick.",
  "Mac describes his ideal day: breakfast, nap, second breakfast, nap, dinner, nap. The others nod in agreement.",
  "Minestrone claims she once jumped from the counter to the top of the fridge. Mac calls her bluff.",
  "You share stories about NW Children's Theater. Minestrone wants to know if they have good acoustics for yowling.",
];

const CONSTELLATION_FACTS = [
  { name: "Orion", emoji: "🏹", fact: "The Hunter watches over your journey!" },
  { name: "Ursa Major", emoji: "🐻", fact: "The Great Bear - but not as great as our cats!" },
  { name: "Leo", emoji: "🦁", fact: "Mac thinks he sees a relative up there." },
  { name: "Pisces", emoji: "🐟", fact: "Minestrone is VERY interested in this one." },
  { name: "Canis Major", emoji: "🐕", fact: "The cats collectively hiss at this constellation." },
];

export default function RestScreen() {
  const {
    setScreen, advanceDay, resources, updateResources, partyMembers, updatePartyMember
  } = useGameStore();
  const [activity, setActivity] = useState<'menu' | 'story' | 'stargaze' | 'heal' | 'repair'>('menu');
  const [currentStory, setCurrentStory] = useState('');
  const [currentConstellation, setCurrentConstellation] = useState<typeof CONSTELLATION_FACTS[0] | null>(null);
  const [message, setMessage] = useState('');
  const [fireFlicker, setFireFlicker] = useState(false);

  // Fire flicker effect
  useState(() => {
    const interval = setInterval(() => setFireFlicker(f => !f), 500);
    return () => clearInterval(interval);
  });

  const handleRest = () => {
    // Heal all party members slightly
    partyMembers.forEach(member => {
      if (member.isAlive && member.health < member.maxHealth) {
        updatePartyMember(member.id, {
          health: Math.min(member.maxHealth, member.health + 15)
        });
      }
    });
    advanceDay();
    setMessage("Everyone rested well! +15 health for all cats.");
    setTimeout(() => setMessage(''), 3000);
  };

  const handleTellStory = () => {
    const story = CAMPFIRE_STORIES[Math.floor(Math.random() * CAMPFIRE_STORIES.length)];
    setCurrentStory(story);
    setActivity('story');
  };

  const handleStargaze = () => {
    const constellation = CONSTELLATION_FACTS[Math.floor(Math.random() * CONSTELLATION_FACTS.length)];
    setCurrentConstellation(constellation);
    setActivity('stargaze');
    // Small chance of bonus
    if (Math.random() < 0.3) {
      updateResources({ pixieDust: resources.pixieDust + 5 });
      setMessage("The stars sprinkle you with magical pixie dust! +5");
    }
  };

  const handleHeal = () => {
    if (resources.firstAidKits <= 0) {
      setMessage("No first aid kits available!");
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const injuredCat = partyMembers.find(m => m.isAlive && m.health < 70);
    if (!injuredCat) {
      setMessage("All cats are healthy enough!");
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    updateResources({ firstAidKits: resources.firstAidKits - 1 });
    updatePartyMember(injuredCat.id, { health: Math.min(100, injuredCat.health + 40) });
    setMessage(`Used first aid kit on ${injuredCat.name}! +40 health`);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleRepair = () => {
    // Check if we have parts to repair
    if (resources.wagonWheels <= 1 && resources.wagonAxles <= 0) {
      setMessage("No spare parts to use for repairs!");
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setMessage("The wagon is in good shape! Mac supervised the inspection by napping nearby.");
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="bg-gradient-to-b from-[#0a0a20] via-[#0f1a35] to-[#0a0a15] rounded-lg p-4 md:p-6 shadow-2xl border-4 border-amber-900 relative overflow-hidden min-h-[500px]">
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Moon */}
      <div className="absolute top-4 right-4 text-4xl opacity-80">🌙</div>

      {/* Campfire */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center">
        <div className={`text-5xl transition-transform ${fireFlicker ? 'scale-105' : 'scale-100'}`}>
          🔥
        </div>
        <div className="text-3xl -mt-2">🪵</div>
        {/* Fire glow */}
        <div className="absolute -inset-10 bg-orange-500/20 rounded-full blur-2xl -z-10" />
      </div>

      {/* Header */}
      <div className="text-center mb-6 relative z-10">
        <h1 className="text-2xl md:text-3xl text-amber-400 mb-1">Camp for the Night</h1>
        <p className="text-white/50 text-sm">Rest and recover by the campfire</p>
      </div>

      {/* Cats around campfire */}
      <div className="flex justify-center gap-8 mb-8 relative z-10">
        <div className="text-center">
          <TabbyCat variant="marge" size="md" mood="happy" />
          <p className="text-xs text-white/60 mt-1">Marge</p>
          <p className="text-xs text-amber-400">{partyMembers.find(m => m.id === 'marge')?.health}%</p>
        </div>
        <div className="text-center">
          <TabbyCat variant="mac" size="md" mood="sleeping" />
          <p className="text-xs text-white/60 mt-1">Mac</p>
          <p className="text-xs text-amber-400">{partyMembers.find(m => m.id === 'mac')?.health}%</p>
        </div>
        <div className="text-center">
          <TabbyCat variant="minestrone" size="md" mood="excited" />
          <p className="text-xs text-white/60 mt-1">Minestrone</p>
          <p className="text-xs text-amber-400">{partyMembers.find(m => m.id === 'minestrone')?.health}%</p>
        </div>
      </div>

      {/* Message display */}
      {message && (
        <div className="text-center mb-4 p-3 bg-amber-500/20 rounded-lg text-amber-300 text-sm animate-pulse relative z-10">
          {message}
        </div>
      )}

      {/* Activity content */}
      {activity === 'menu' && (
        <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
          <button
            onClick={handleRest}
            className="p-4 bg-blue-900/50 hover:bg-blue-900/70 rounded-lg border border-blue-500/30 transition-all"
          >
            <span className="text-2xl block mb-1">😴</span>
            <span className="text-white text-sm">Rest</span>
            <span className="text-white/50 text-xs block">+15 health, +1 day</span>
          </button>

          <button
            onClick={handleTellStory}
            className="p-4 bg-purple-900/50 hover:bg-purple-900/70 rounded-lg border border-purple-500/30 transition-all"
          >
            <span className="text-2xl block mb-1">📖</span>
            <span className="text-white text-sm">Tell Stories</span>
            <span className="text-white/50 text-xs block">Boost morale</span>
          </button>

          <button
            onClick={handleStargaze}
            className="p-4 bg-indigo-900/50 hover:bg-indigo-900/70 rounded-lg border border-indigo-500/30 transition-all"
          >
            <span className="text-2xl block mb-1">⭐</span>
            <span className="text-white text-sm">Stargaze</span>
            <span className="text-white/50 text-xs block">Maybe find magic!</span>
          </button>

          <button
            onClick={handleHeal}
            className="p-4 bg-green-900/50 hover:bg-green-900/70 rounded-lg border border-green-500/30 transition-all"
          >
            <span className="text-2xl block mb-1">🩹</span>
            <span className="text-white text-sm">Use First Aid</span>
            <span className="text-white/50 text-xs block">{resources.firstAidKits} kits left</span>
          </button>

          <button
            onClick={handleRepair}
            className="p-4 bg-amber-900/50 hover:bg-amber-900/70 rounded-lg border border-amber-500/30 transition-all"
          >
            <span className="text-2xl block mb-1">🔧</span>
            <span className="text-white text-sm">Check Wagon</span>
            <span className="text-white/50 text-xs block">{resources.wagonWheels} wheels</span>
          </button>

          <button
            onClick={() => setScreen('travel')}
            className="p-4 bg-trail-brown/50 hover:bg-trail-brown/70 rounded-lg border border-amber-500/30 transition-all"
          >
            <span className="text-2xl block mb-1">🌅</span>
            <span className="text-white text-sm">Break Camp</span>
            <span className="text-white/50 text-xs block">Continue journey</span>
          </button>
        </div>
      )}

      {activity === 'story' && (
        <div className="bg-black/30 rounded-lg p-6 mb-4 relative z-10">
          <p className="text-white text-center mb-4 italic">"{currentStory}"</p>
          <button
            onClick={() => setActivity('menu')}
            className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Nice story!
          </button>
        </div>
      )}

      {activity === 'stargaze' && currentConstellation && (
        <div className="bg-black/30 rounded-lg p-6 mb-4 relative z-10 text-center">
          <span className="text-5xl block mb-2">{currentConstellation.emoji}</span>
          <h3 className="text-xl text-white mb-2">{currentConstellation.name}</h3>
          <p className="text-white/70 mb-4">{currentConstellation.fact}</p>
          <button
            onClick={() => setActivity('menu')}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Beautiful!
          </button>
        </div>
      )}

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-900/30 to-transparent" />
    </div>
  );
}

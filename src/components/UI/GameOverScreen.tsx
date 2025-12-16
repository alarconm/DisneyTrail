import { useGameStore } from '../../stores/gameStore';
import { playSound } from '../../services/audio';

export default function GameOverScreen() {
  const { partyMembers, distanceTraveled, resetGame, resources } = useGameStore();

  const deadCats = partyMembers.filter(m => m.type === 'cat' && !m.isAlive);
  const survivingCats = partyMembers.filter(m => m.type === 'cat' && m.isAlive);

  // Determine cause of game over
  let causeOfDeath = 'The journey was too difficult.';
  if (resources.food <= 0) {
    causeOfDeath = 'The party ran out of food.';
  } else if (survivingCats.length === 0) {
    causeOfDeath = 'All the cats have perished.';
  } else if (resources.spareTires <= 0) {
    causeOfDeath = 'The truck broke down and cannot be repaired.';
  }

  const handleTryAgain = () => {
    playSound('click');
    resetGame();
  };

  return (
    <div className="bg-gradient-to-b from-[#1a1a2e] via-[#2d1a1a] to-[#1a1a2e] rounded-lg p-6 shadow-2xl border-4 border-red-900">
      {/* Tombstone */}
      <div className="text-center mb-6">
        <div className="text-5xl md:text-6xl mb-4">🪦</div>
        <h1 className="text-xl md:text-2xl text-red-400">
          GAME OVER
        </h1>
        <p className="text-white/60 text-sm mt-2">
          {causeOfDeath}
        </p>
      </div>

      {/* Epitaph */}
      <div className="bg-white/5 border-2 border-white/10 rounded-lg p-4 mb-6 text-center">
        <p className="text-white/80 text-sm italic mb-4">
          "Here lies the hopes of reaching Disney World..."
        </p>

        <div className="text-white/60 text-xs space-y-1">
          <p>Distance traveled: {distanceTraveled} miles</p>
          <p>So close, yet so far...</p>
        </div>
      </div>

      {/* Memorial for lost cats */}
      {deadCats.length > 0 && (
        <div className="mb-6">
          <p className="text-white/60 text-xs text-center mb-2">In Memory Of:</p>
          <div className="flex justify-center gap-4">
            {deadCats.map((cat) => (
              <div key={cat.id} className="text-center">
                <span className="text-2xl opacity-50">😿</span>
                <p className="text-xs text-white/50">{cat.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Surviving cats */}
      {survivingCats.length > 0 && (
        <div className="mb-6">
          <p className="text-white/60 text-xs text-center mb-2">Survivors:</p>
          <div className="flex justify-center gap-4">
            {survivingCats.map((cat) => (
              <div key={cat.id} className="text-center">
                <span className="text-2xl">🐱</span>
                <p className="text-xs text-white/70">{cat.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Encouraging message */}
      <div className="bg-white/5 rounded-lg p-3 mb-6 text-center">
        <p className="text-white/70 text-xs">
          Don't give up! The trail to Disney World awaits.
          <br />
          The cats believe in you. (Well, Marge does. Mac is hungry.)
        </p>
      </div>

      {/* Classic Oregon Trail reference */}
      <div className="text-center mb-6">
        <p className="text-white/40 text-xs italic">
          "You have died of... well, not dysentery this time."
        </p>
      </div>

      {/* Try again button */}
      <button
        onClick={handleTryAgain}
        className="w-full py-4 bg-trail-brown hover:bg-amber-800 text-white rounded-lg border-2 border-white/20 transition-all hover:scale-[1.02]"
      >
        Try Again
      </button>

      {/* Hint */}
      <p className="text-center text-xs text-white/30 mt-4">
        Tip: Stock up on cat treats. Happy cats = better journey!
      </p>
    </div>
  );
}

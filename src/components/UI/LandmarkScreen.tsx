import { useGameStore } from '../../stores/gameStore';
import { LANDMARKS } from '../../data/landmarks';
import { playSound } from '../../services/audio';

export default function LandmarkScreen() {
  const { currentLandmarkIndex, setScreen, distanceTraveled } = useGameStore();

  const landmark = LANDMARKS[currentLandmarkIndex];
  const nextLandmark = LANDMARKS[currentLandmarkIndex + 1];

  if (!landmark) {
    setScreen('travel');
    return null;
  }

  // Check if this is Disney World (victory!)
  if (landmark.id === 'disney-world') {
    setScreen('victory');
    return null;
  }

  const handleContinue = () => {
    playSound('click');
    setScreen('travel');
  };

  const handleShop = () => {
    playSound('click');
    setScreen('shop');
  };

  const handleRiverCrossing = () => {
    playSound('click');
    setScreen('river-crossing');
  };

  return (
    <div className="bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-lg p-6 shadow-2xl border-4 border-magic-gold">
      {/* Landmark header */}
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">🏕️</div>
        <h1 className="text-2xl text-magic-gold">{landmark.name}</h1>
        <p className="text-white/60 text-sm mt-1">
          {distanceTraveled} miles from Tigard
        </p>
      </div>

      {/* Landmark illustration */}
      <div className="relative h-32 bg-gradient-to-b from-[#87CEEB] to-[#228B22] rounded-lg mb-6 overflow-hidden">
        {/* Location-specific decoration */}
        {landmark.id === 'crater-lake' && (
          <div className="absolute inset-x-0 bottom-0 h-16 bg-blue-400 rounded-full mx-8" />
        )}
        {landmark.id === 'denver' && (
          <>
            <div className="absolute bottom-0 left-1/4 w-0 h-0 border-l-[40px] border-r-[40px] border-b-[60px] border-transparent border-b-gray-400" />
            <div className="absolute bottom-0 left-1/2 w-0 h-0 border-l-[50px] border-r-[50px] border-b-[70px] border-transparent border-b-gray-500" />
          </>
        )}
        {landmark.id === 'salt-lake-city' && (
          <div className="absolute inset-0 bg-gradient-to-t from-yellow-200/50 to-transparent" />
        )}
        {landmark.hasRiver && (
          <div className="absolute inset-x-0 bottom-0 h-8 bg-blue-500/60" />
        )}
        {/* Landmark marker */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-3xl">
          🏁
        </div>
      </div>

      {/* Description */}
      <div className="p-4 bg-white/5 rounded-lg mb-6">
        <p className="text-white text-sm leading-relaxed">
          {landmark.description}
        </p>
      </div>

      {/* Next destination info */}
      {nextLandmark && (
        <div className="p-3 bg-white/5 rounded mb-6 text-center">
          <p className="text-xs text-white/60">Next Stop:</p>
          <p className="text-white text-sm">{nextLandmark.name}</p>
          <p className="text-xs text-white/40">
            {nextLandmark.distanceFromStart - distanceTraveled} miles ahead
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="space-y-2">
        {landmark.hasShop && (
          <button
            onClick={handleShop}
            className="w-full py-3 bg-trail-brown hover:bg-amber-800 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <span>🏪</span>
            <span>Visit the Shop</span>
          </button>
        )}

        {landmark.hasRiver && (
          <button
            onClick={handleRiverCrossing}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <span>🌊</span>
            <span>Cross the River</span>
          </button>
        )}

        <button
          onClick={handleContinue}
          className="w-full py-3 bg-prairie-green hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          Continue Journey
        </button>
      </div>

      {/* Progress indicator */}
      <div className="mt-6 text-center text-xs text-white/40">
        Landmark {currentLandmarkIndex + 1} of {LANDMARKS.length}
      </div>
    </div>
  );
}

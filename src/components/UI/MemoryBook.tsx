import { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { LANDMARKS } from '../../data/landmarks';
import TabbyCat from '../sprites/TabbyCat';

interface Memory {
  id: string;
  landmark: string;
  title: string;
  description: string;
  emoji: string;
  characters: string[];
}

export default function MemoryBook() {
  const { setScreen, currentLandmarkIndex, distanceTraveled, day, partyMembers } = useGameStore();
  const [currentPage, setCurrentPage] = useState(0);

  // Generate memories based on landmarks visited
  const memories: Memory[] = LANDMARKS.slice(0, currentLandmarkIndex + 1).map((landmark, index) => {
    const memoryOptions = getMemoryForLandmark(landmark.id, index);
    return memoryOptions;
  });

  const totalPages = Math.ceil(memories.length / 2);

  const visibleMemories = memories.slice(currentPage * 2, currentPage * 2 + 2);

  return (
    <div className="bg-gradient-to-b from-[#f5e6d3] via-[#e8d5c4] to-[#d4c4b0] rounded-lg p-4 md:p-6 shadow-2xl border-4 border-amber-800 relative overflow-hidden">
      {/* Book texture overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjOTk5Ij48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNjY2MiPjwvcmVjdD4KPC9zdmc+')]" />

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl text-amber-900 font-serif">Memory Book</h1>
        <p className="text-amber-700 text-sm">Our Journey to Disney World</p>
        <div className="flex justify-center gap-4 mt-2 text-xs text-amber-600">
          <span>Day {day}</span>
          <span>|</span>
          <span>{distanceTraveled} miles traveled</span>
        </div>
      </div>

      {/* Decorative tape */}
      <div className="absolute top-2 left-8 w-16 h-6 bg-yellow-200/60 rotate-[-5deg] shadow-sm" />
      <div className="absolute top-2 right-8 w-16 h-6 bg-pink-200/60 rotate-[5deg] shadow-sm" />

      {/* Memory pages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 min-h-[400px]">
        {visibleMemories.length === 0 ? (
          <div className="col-span-2 flex flex-col items-center justify-center text-amber-700">
            <span className="text-6xl mb-4">📷</span>
            <p className="text-center">Your memory book is empty!</p>
            <p className="text-sm text-amber-600">Travel to create memories along the way.</p>
          </div>
        ) : (
          visibleMemories.map((memory, idx) => (
            <div
              key={memory.id}
              className="bg-white/80 rounded-lg p-4 shadow-lg transform hover:scale-102 transition-transform relative"
              style={{ transform: `rotate(${idx % 2 === 0 ? '-1' : '1'}deg)` }}
            >
              {/* Polaroid style photo */}
              <div className="bg-gray-100 rounded-lg p-2 mb-3">
                <div className="bg-gradient-to-br from-blue-200 via-purple-100 to-pink-200 rounded aspect-square flex items-center justify-center text-6xl">
                  {memory.emoji}
                </div>
              </div>

              {/* Caption */}
              <h3 className="text-amber-900 font-bold text-sm mb-1">{memory.title}</h3>
              <p className="text-amber-700 text-xs mb-2">{memory.description}</p>

              {/* Location tag */}
              <div className="flex items-center gap-1 text-xs text-amber-500">
                <span>📍</span>
                <span>{memory.landmark}</span>
              </div>

              {/* Characters in photo */}
              <div className="flex gap-1 mt-2">
                {memory.characters.includes('marge') && (
                  <div className="w-6 h-6"><TabbyCat variant="marge" size="sm" mood="happy" /></div>
                )}
                {memory.characters.includes('minestrone') && (
                  <div className="w-6 h-6"><TabbyCat variant="minestrone" size="sm" mood="excited" /></div>
                )}
                {memory.characters.includes('mac') && (
                  <div className="w-6 h-6"><TabbyCat variant="mac" size="sm" mood="happy" /></div>
                )}
              </div>

              {/* Decorative corner */}
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-400/70 rounded-full flex items-center justify-center text-white text-xs shadow">
                {currentPage * 2 + idx + 1}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Page navigation */}
      {memories.length > 0 && (
        <div className="flex justify-center items-center gap-4 mb-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="px-4 py-2 bg-amber-700 hover:bg-amber-800 disabled:bg-amber-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-amber-800">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage >= totalPages - 1}
            className="px-4 py-2 bg-amber-700 hover:bg-amber-800 disabled:bg-amber-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Stats summary */}
      <div className="bg-amber-100/50 rounded-lg p-4 mb-4">
        <h3 className="text-amber-900 font-bold text-center mb-2">Journey Stats</h3>
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div>
            <p className="text-2xl text-amber-700">{currentLandmarkIndex}</p>
            <p className="text-amber-600 text-xs">Landmarks</p>
          </div>
          <div>
            <p className="text-2xl text-amber-700">{distanceTraveled}</p>
            <p className="text-amber-600 text-xs">Miles</p>
          </div>
          <div>
            <p className="text-2xl text-amber-700">{day}</p>
            <p className="text-amber-600 text-xs">Days</p>
          </div>
        </div>
      </div>

      {/* Cat health summary */}
      <div className="bg-amber-100/50 rounded-lg p-4 mb-4">
        <h3 className="text-amber-900 font-bold text-center mb-2">Our Travelers</h3>
        <div className="flex justify-center gap-6">
          {partyMembers.filter(m => m.type === 'cat').map(cat => (
            <div key={cat.id} className="text-center">
              <TabbyCat
                variant={cat.id as 'marge' | 'minestrone' | 'mac'}
                size="md"
                mood={cat.health > 70 ? 'happy' : cat.health > 30 ? 'sad' : 'sick'}
              />
              <p className="text-xs text-amber-800 mt-1">{cat.name}</p>
              <p className="text-xs text-amber-600">{cat.health}% health</p>
            </div>
          ))}
        </div>
      </div>

      {/* Back button */}
      <button
        onClick={() => setScreen('travel')}
        className="w-full py-3 bg-amber-700 hover:bg-amber-800 text-white rounded-lg transition-colors"
      >
        Close Memory Book
      </button>

      {/* Decorative stickers */}
      <div className="absolute bottom-20 right-4 text-3xl opacity-60 rotate-12">🌟</div>
      <div className="absolute bottom-32 left-4 text-2xl opacity-50 -rotate-12">❤️</div>
      <div className="absolute top-40 right-2 text-2xl opacity-40 rotate-6">✨</div>
    </div>
  );
}

function getMemoryForLandmark(landmarkId: string, _index: number): Memory {
  const landmark = LANDMARKS.find(l => l.id === landmarkId);
  const name = landmark?.name || 'Unknown';

  const memories: Record<string, Memory> = {
    'tigard': {
      id: 'tigard',
      landmark: name,
      title: 'The Adventure Begins!',
      description: 'We loaded up the wagon in Tigard. Mike waved goodbye from ORB Trading Cards. The cats had no idea what was coming!',
      emoji: '🏠',
      characters: ['marge', 'minestrone', 'mac'],
    },
    'portland': {
      id: 'portland',
      landmark: name,
      title: 'City of Roses',
      description: 'Passed by NW Children\'s Theater! The cats were very interested in the food carts.',
      emoji: '🌹',
      characters: ['minestrone', 'mac'],
    },
    'crater-lake': {
      id: 'crater-lake',
      landmark: name,
      title: 'The Deepest Lake',
      description: 'Minestrone almost fell in trying to catch her reflection. Classic Minestrone.',
      emoji: '💎',
      characters: ['minestrone'],
    },
    'boise': {
      id: 'boise',
      landmark: name,
      title: 'City of Trees',
      description: 'Met Mickey Mouse at his trading post! Mac tried to haggle for extra treats.',
      emoji: '🌲',
      characters: ['mac', 'marge'],
    },
    'twin-falls': {
      id: 'twin-falls',
      landmark: name,
      title: 'Waterfall Wonder',
      description: 'Minestrone spent an hour watching fish. We had to drag her away.',
      emoji: '🌊',
      characters: ['minestrone'],
    },
    'salt-lake-city': {
      id: 'salt-lake-city',
      landmark: name,
      title: 'Desert Heat',
      description: 'Mac was NOT happy about the heat. Olaf showed up somehow unbothered!',
      emoji: '🏜️',
      characters: ['mac'],
    },
    'park-city': {
      id: 'park-city',
      landmark: name,
      title: 'Mountain Dance Party',
      description: 'Kristin taught the cats some dance moves. Results were... mixed.',
      emoji: '⛷️',
      characters: ['marge', 'minestrone', 'mac'],
    },
    'denver': {
      id: 'denver',
      landmark: name,
      title: 'Mile High City',
      description: 'Mac tried to eat a pine cone. It did not go well.',
      emoji: '🏔️',
      characters: ['mac'],
    },
    'colorado-springs': {
      id: 'colorado-springs',
      landmark: name,
      title: 'Garden of the Gods',
      description: 'Tinker Bell sprinkled pixie dust! Minestrone tried to catch it all.',
      emoji: '🧚',
      characters: ['minestrone'],
    },
    'kansas-city': {
      id: 'kansas-city',
      landmark: name,
      title: 'BBQ Country',
      description: 'The cats discovered BBQ. Life was never the same.',
      emoji: '🍖',
      characters: ['marge', 'minestrone', 'mac'],
    },
    'branson': {
      id: 'branson',
      landmark: name,
      title: 'Entertainment Capital',
      description: 'Kristin performed at a local theater! The cats provided moral support (napping).',
      emoji: '🎭',
      characters: ['marge', 'mac'],
    },
    'st-louis': {
      id: 'st-louis',
      landmark: name,
      title: 'Gateway to the West',
      description: 'Mac was convinced the Arch was a giant cat toy. He was wrong.',
      emoji: '🌉',
      characters: ['mac'],
    },
    'memphis': {
      id: 'memphis',
      landmark: name,
      title: 'Home of the Blues',
      description: 'Marge did a little dance to the music. We have no photographic evidence.',
      emoji: '🎸',
      characters: ['marge'],
    },
    'nashville': {
      id: 'nashville',
      landmark: name,
      title: 'Music City',
      description: 'Broadway-style performance! Kristin was in her element!',
      emoji: '🎤',
      characters: ['marge', 'minestrone', 'mac'],
    },
    'chattanooga': {
      id: 'chattanooga',
      landmark: name,
      title: 'Choo Choo!',
      description: 'Mac thought he was bigger than the trains. Narrator: He was not.',
      emoji: '🚂',
      characters: ['mac'],
    },
    'atlanta': {
      id: 'atlanta',
      landmark: name,
      title: 'Almost There!',
      description: 'We can smell the Disney magic! Even Marge is getting excited!',
      emoji: '🍑',
      characters: ['marge', 'minestrone', 'mac'],
    },
    'jacksonville': {
      id: 'jacksonville',
      landmark: name,
      title: 'Florida at Last!',
      description: 'Palm trees! Lizards! Stitch causing chaos! It\'s really Florida!',
      emoji: '🌴',
      characters: ['minestrone'],
    },
    'disney-world': {
      id: 'disney-world',
      landmark: name,
      title: 'WE MADE IT!',
      description: 'The happiest place on Earth! Fireworks! Castle! MAGIC! We did it!!!',
      emoji: '🏰',
      characters: ['marge', 'minestrone', 'mac'],
    },
  };

  return memories[landmarkId] || {
    id: landmarkId,
    landmark: name,
    title: 'On the Road',
    description: 'Another beautiful day on our journey!',
    emoji: '📸',
    characters: ['marge', 'minestrone', 'mac'],
  };
}

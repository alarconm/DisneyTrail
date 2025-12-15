import { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { Resources } from '../../types/game.types';

interface ShopItem {
  id: keyof Resources;
  name: string;
  price: number;
  emoji: string;
  description: string;
}

const SHOP_ITEMS: ShopItem[] = [
  { id: 'food', name: 'Food (10 lbs)', price: 5, emoji: '🥫', description: 'Essential for survival' },
  { id: 'catTreats', name: 'Cat Treats (5)', price: 3, emoji: '🐟', description: 'Keeps the cats happy' },
  { id: 'wagonWheels', name: 'Wagon Wheel', price: 25, emoji: '🛞', description: 'Spare wheel for emergencies' },
  { id: 'wagonAxles', name: 'Wagon Axle', price: 35, emoji: '🔧', description: 'Critical repair part' },
  { id: 'wagonTongues', name: 'Wagon Tongue', price: 30, emoji: '🪵', description: 'Connects wagon to team' },
  { id: 'firstAidKits', name: 'First Aid Kit', price: 20, emoji: '🩹', description: 'Heals illness and injury' },
];

export default function ShopScreen() {
  const { resources, updateResources, setScreen, currentLandmarkIndex } = useGameStore();
  const [message, setMessage] = useState('');

  const buyItem = (item: ShopItem) => {
    if (resources.goldCoins < item.price) {
      setMessage("You don't have enough gold coins!");
      return;
    }

    const amount = item.id === 'food' ? 10 : item.id === 'catTreats' ? 5 : 1;
    updateResources({
      goldCoins: resources.goldCoins - item.price,
      [item.id]: resources[item.id] + amount,
    });

    setMessage(`Bought ${item.name}!`);
    setTimeout(() => setMessage(''), 2000);
  };

  const handleContinue = () => {
    setScreen('travel');
  };

  return (
    <div className="bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-lg p-6 shadow-2xl border-4 border-magic-gold">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl text-magic-gold">General Store</h1>
          <p className="text-xs text-white/60">
            {currentLandmarkIndex === 0 ? "Tigard Trading Post" : "Roadside Shop"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-magic-gold text-lg">{resources.goldCoins}</p>
          <p className="text-xs text-white/60">Gold Coins</p>
        </div>
      </div>

      {/* Mickey greeting */}
      <div className="flex items-start gap-4 mb-6 p-4 bg-white/5 rounded-lg">
        <div className="text-4xl">🐭</div>
        <div>
          <p className="text-white text-sm">
            "Oh boy! Welcome to my shop! I've got everything you need for your
            journey to Disney World!"
          </p>
          <p className="text-xs text-white/50 mt-1">- Mickey Mouse, Shopkeeper</p>
        </div>
      </div>

      {/* Current inventory */}
      <div className="mb-6 p-3 bg-white/5 rounded">
        <h2 className="text-sm text-white mb-2">Current Supplies:</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="text-white/70">🥫 Food: {resources.food} lbs</div>
          <div className="text-white/70">🐟 Treats: {resources.catTreats}</div>
          <div className="text-white/70">🛞 Wheels: {resources.wagonWheels}</div>
          <div className="text-white/70">🔧 Axles: {resources.wagonAxles}</div>
          <div className="text-white/70">🪵 Tongues: {resources.wagonTongues}</div>
          <div className="text-white/70">🩹 First Aid: {resources.firstAidKits}</div>
          <div className="text-white/70">✨ Pixie Dust: {resources.pixieDust}</div>
        </div>
      </div>

      {/* Shop items */}
      <div className="grid gap-2 mb-6">
        {SHOP_ITEMS.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{item.emoji}</span>
              <div>
                <p className="text-white text-sm">{item.name}</p>
                <p className="text-xs text-white/50">{item.description}</p>
              </div>
            </div>
            <button
              onClick={() => buyItem(item)}
              disabled={resources.goldCoins < item.price}
              className="px-4 py-2 bg-prairie-green hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded text-sm transition-colors"
            >
              {item.price} 🪙
            </button>
          </div>
        ))}
      </div>

      {/* Message */}
      {message && (
        <div className="mb-4 p-2 bg-magic-gold/20 text-magic-gold text-center rounded text-sm">
          {message}
        </div>
      )}

      {/* Continue button */}
      <button
        onClick={handleContinue}
        className="w-full py-4 bg-trail-brown hover:bg-amber-800 text-white rounded-lg border-2 border-white/20 transition-all hover:scale-[1.02] text-lg"
      >
        Hit the Trail!
      </button>

      {/* Tip */}
      <p className="text-center text-xs text-white/40 mt-4">
        Pro tip: Stock up on cat treats. Trust me.
      </p>
    </div>
  );
}

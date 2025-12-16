import { useState, useEffect, useCallback, useRef } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { playSound } from '../../services/audio';

interface FallingItem {
  id: number;
  type: string;
  emoji: string;
  x: number;
  y: number;
  speed: number;
  points: number;
  isSpecial?: boolean;
}

const FOOD_ITEMS = [
  { type: 'berry', emoji: '🫐', points: 5 },
  { type: 'apple', emoji: '🍎', points: 8 },
  { type: 'banana', emoji: '🍌', points: 6 },
  { type: 'grapes', emoji: '🍇', points: 7 },
  { type: 'watermelon', emoji: '🍉', points: 12 },
  { type: 'peach', emoji: '🍑', points: 8 },
  { type: 'mushroom', emoji: '🍄', points: 10 },
  { type: 'corn', emoji: '🌽', points: 9 },
  { type: 'carrot', emoji: '🥕', points: 6 },
  { type: 'bug', emoji: '🐛', points: 3, isSpecial: true }, // Timon & Pumbaa approved!
  { type: 'grub', emoji: '🪱', points: 4, isSpecial: true },
];

const BONUS_ITEMS = [
  { type: 'pizza', emoji: '🍕', points: 20 }, // Remy's special
  { type: 'croissant', emoji: '🥐', points: 15 },
  { type: 'magic-apple', emoji: '✨🍎✨', points: 25 }, // Snow White's apple (good version!)
];

export default function ForagingMiniGame() {
  const { setScreen, updateResources, resources } = useGameStore();
  const [items, setItems] = useState<FallingItem[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [gameOver, setGameOver] = useState(false);
  const [basketX, setBasketX] = useState(50);
  const [combo, setCombo] = useState(0);
  const [message, setMessage] = useState('');
  const [catchStreak, setCatchStreak] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Check if player has baskets
  const hasBaskets = resources.foragingBaskets > 0;

  // Start foraging (consume a basket)
  const startForaging = () => {
    if (!hasBaskets) return;
    playSound('click');
    updateResources({ foragingBaskets: resources.foragingBaskets - 1 });
    setGameStarted(true);
  };

  const spawnItem = useCallback(() => {
    const isBonus = Math.random() < 0.1;
    const itemPool = isBonus ? BONUS_ITEMS : FOOD_ITEMS;
    const template = itemPool[Math.floor(Math.random() * itemPool.length)];

    const newItem: FallingItem = {
      id: Date.now() + Math.random(),
      ...template,
      x: 10 + Math.random() * 80, // percentage
      y: -10,
      speed: 1 + Math.random() * 2,
    };

    setItems((prev) => [...prev, newItem]);
  }, []);

  // Spawn items periodically
  useEffect(() => {
    if (gameOver || !gameStarted) return;
    const interval = setInterval(spawnItem, 800);
    return () => clearInterval(interval);
  }, [gameOver, gameStarted, spawnItem]);

  // Move items down and check for catches
  useEffect(() => {
    if (gameOver || !gameStarted) return;

    const interval = setInterval(() => {
      setItems((prev) => {
        const caughtItems: FallingItem[] = [];
        const remaining: FallingItem[] = [];

        prev.forEach((item) => {
          const newY = item.y + item.speed;

          // Check if in catch zone
          if (newY >= 75 && newY <= 90) {
            const basketLeft = basketX - 15;
            const basketRight = basketX + 15;
            if (item.x >= basketLeft && item.x <= basketRight) {
              caughtItems.push({ ...item, y: newY });
              return;
            }
          }

          if (newY < 100) {
            remaining.push({ ...item, y: newY });
          }
        });

        // Process caught items
        if (caughtItems.length > 0) {
          caughtItems.forEach((item) => {
            const comboMultiplier = 1 + combo * 0.1;
            const points = Math.floor(item.points * comboMultiplier);
            setScore((s) => Math.min(150, s + points));
            setCombo((c) => Math.min(10, c + 1));
            setCatchStreak((s) => s + 1);
            playSound('coin');

            if (item.isSpecial) {
              setMessage('Hakuna Matata! Slimy yet satisfying! 🐗');
            }
          });
        }

        return remaining;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [gameOver, gameStarted, basketX, combo]);

  // Reset combo on miss
  useEffect(() => {
    if (gameOver || !gameStarted) return;

    const checkMiss = setInterval(() => {
      setItems((prev) => {
        const missed = prev.filter((item) => item.y >= 95);
        if (missed.length > 0) {
          setCombo(0);
          setCatchStreak(0);
        }
        return prev.filter((item) => item.y < 95);
      });
    }, 100);

    return () => clearInterval(checkMiss);
  }, [gameOver, gameStarted]);

  // Timer
  useEffect(() => {
    if (gameOver || !gameStarted) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameOver, gameStarted]);

  // Clear messages
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Handle mouse/touch movement
  const handleMove = (clientX: number) => {
    if (!gameAreaRef.current || gameOver) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setBasketX(Math.max(10, Math.min(90, x)));
  };

  const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    handleMove(e.touches[0].clientX);
  };

  const handleFinish = () => {
    playSound('success');
    updateResources({ food: resources.food + score });
    setScreen('travel');
  };

  // Pre-game screen - show basket requirement
  if (!gameStarted) {
    return (
      <div className="bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-lg p-4 shadow-2xl border-4 border-magic-gold">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl text-magic-gold mb-2">Foraging Time!</h1>
          <p className="text-white/60 text-sm">Grab your basket and gather food!</p>
        </div>

        {/* Basket icon */}
        <div className="text-center mb-6">
          <span className="text-6xl inline-block">🧺</span>
        </div>

        {/* Basket count */}
        <div className="bg-white/10 rounded-lg p-4 mb-6 text-center">
          <p className="text-white mb-2">
            Baskets available: <span className={`font-bold text-xl ${hasBaskets ? 'text-magic-gold' : 'text-red-400'}`}>
              {resources.foragingBaskets}
            </span>
          </p>
          <p className="text-white/50 text-xs">
            Each foraging trip uses 1 basket. Buy more at shops!
          </p>
        </div>

        {/* Timon & Pumbaa */}
        <div className="flex items-center gap-2 mb-4 p-2 bg-white/5 rounded-lg">
          <span className="text-2xl">🐗</span>
          <p className="text-white text-xs flex-1">
            {hasBaskets
              ? '"Hakuna Matata! Let\'s find some grubs!"'
              : '"No baskets? We need something to carry the food!"'}
          </p>
          <span className="text-2xl">🦡</span>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          {hasBaskets ? (
            <button
              onClick={startForaging}
              className="w-full py-3 bg-prairie-green hover:bg-green-700 text-white rounded-lg transition-colors font-bold"
            >
              🧺 Use a Basket & Start Foraging!
            </button>
          ) : (
            <div className="text-center p-4 bg-red-500/20 rounded-lg text-red-300">
              <p className="font-bold">No baskets available!</p>
              <p className="text-sm mt-1">Visit a shop to buy more baskets.</p>
            </div>
          )}
          <button
            onClick={() => {
              playSound('click');
              setScreen('travel');
            }}
            className="w-full py-3 bg-trail-brown hover:bg-amber-800 text-white rounded-lg transition-colors"
          >
            Back to Trail
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-lg p-4 shadow-2xl border-4 border-magic-gold">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-lg md:text-xl text-magic-gold">Foraging Time!</h1>
          <p className="text-xs text-white/60">Catch food with Timon & Pumbaa!</p>
        </div>
        <div className="text-right">
          <p className="text-white text-sm md:text-base">
            <span className="text-magic-gold">{score}</span>/150 food
          </p>
          <p className="text-xs text-white/60">
            Time: <span className={timeLeft < 10 ? 'text-red-400' : 'text-white'}>{timeLeft}s</span>
          </p>
          {combo > 0 && (
            <p className="text-xs text-cat-orange animate-pulse">
              Combo x{(1 + combo * 0.1).toFixed(1)}!
            </p>
          )}
        </div>
      </div>

      {/* Timon & Pumbaa */}
      <div className="flex items-center gap-2 mb-2 p-2 bg-white/5 rounded-lg">
        <span className="text-2xl">🐗</span>
        <p className="text-white text-xs flex-1">
          "When you're hungry, just look for the bare necessities!"
        </p>
        <span className="text-2xl">🦡</span>
      </div>

      {/* Game area */}
      <div
        ref={gameAreaRef}
        className="relative h-64 md:h-80 bg-gradient-to-b from-[#87CEEB] via-[#98D8AA] to-[#228B22] rounded-lg overflow-hidden mb-4 cursor-none touch-none"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* Trees/background */}
        <div className="absolute top-4 left-4 text-3xl opacity-60">🌳</div>
        <div className="absolute top-8 right-8 text-2xl opacity-60">🌲</div>
        <div className="absolute top-4 left-1/2 text-2xl opacity-40">🌴</div>

        {/* Falling items - no transition for smooth movement */}
        {items.map((item) => (
          <div
            key={item.id}
            className="absolute text-2xl md:text-3xl drop-shadow-lg"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: 'translate(-50%, -50%)',
              willChange: 'top',
            }}
          >
            {item.emoji}
          </div>
        ))}

        {/* Basket - no transition to prevent jitter */}
        <div
          className="absolute bottom-4 text-4xl md:text-5xl"
          style={{
            left: `${basketX}%`,
            transform: 'translateX(-50%)',
            willChange: 'left',
          }}
        >
          🧺
        </div>

        {/* Message overlay */}
        {message && (
          <div className="absolute inset-x-0 top-1/3 text-center pointer-events-none">
            <span className="bg-black/80 text-white px-4 py-2 rounded-full text-sm font-bold animate-bounce">
              {message}
            </span>
          </div>
        )}

        {/* Game over overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-center p-4">
              <div className="text-4xl mb-2">🎉</div>
              <h2 className="text-xl md:text-2xl text-magic-gold mb-2">Great Foraging!</h2>
              <p className="text-white mb-1">You gathered {score} food!</p>
              <p className="text-xs text-white/60 mb-4">Best streak: {catchStreak} catches</p>
              <button
                onClick={handleFinish}
                className="px-6 py-3 bg-prairie-green hover:bg-green-700 text-white rounded-lg text-sm md:text-base"
              >
                Take to Truck 🛻
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="text-center text-xs text-white/50 mb-4">
        <span className="hidden md:inline">Move your mouse to catch falling food!</span>
        <span className="md:hidden">Drag to move the basket!</span>
      </div>

      {/* Back button */}
      {!gameOver && (
        <button
          onClick={() => {
            playSound('click');
            setScreen('travel');
          }}
          className="w-full py-2 bg-white/10 hover:bg-white/20 text-white/70 rounded text-sm"
        >
          Cancel Foraging
        </button>
      )}
    </div>
  );
}

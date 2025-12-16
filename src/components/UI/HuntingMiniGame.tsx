import { useState, useEffect, useCallback, useRef } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { playSound } from '../../services/audio';

interface Animal {
  id: number;
  type: string;
  emoji: string;
  x: number;
  y: number;
  speed: number;
  points: number;
  isSpecial?: boolean;
  message?: string;
}

const ANIMAL_TYPES = [
  { type: 'squirrel', emoji: '🐿️', points: 5, speed: 4 },
  { type: 'rabbit', emoji: '🐇', points: 8, speed: 5 },
  { type: 'deer', emoji: '🦌', points: 25, speed: 3 },
  { type: 'buffalo', emoji: '🦬', points: 50, speed: 2 },
  { type: 'turkey', emoji: '🦃', points: 15, speed: 3 },
];

const SPECIAL_ANIMALS = [
  {
    type: 'oregon-duck',
    emoji: '🦆',
    points: 0,
    speed: 2,
    isSpecial: true,
    message: "The Duck gives you a disappointed look. You can't do it. Go Ducks!",
  },
  {
    type: 'stitch',
    emoji: '👾',
    points: 0,
    speed: 6,
    isSpecial: true,
    message: "You can't catch Stitch! He sticks out his tongue and runs off.",
  },
];

export default function HuntingMiniGame() {
  const { setScreen, updateResources, resources, incrementAchievementStat } = useGameStore();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [crosshairPos, setCrosshairPos] = useState({ x: 200, y: 150 });
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const spawnAnimal = useCallback(() => {
    const isSpecial = Math.random() < 0.1; // 10% chance for special animal
    const template = isSpecial
      ? SPECIAL_ANIMALS[Math.floor(Math.random() * SPECIAL_ANIMALS.length)]
      : ANIMAL_TYPES[Math.floor(Math.random() * ANIMAL_TYPES.length)];

    // Get game area width dynamically
    const gameWidth = gameAreaRef.current?.clientWidth || 350;

    const newAnimal: Animal = {
      id: Date.now() + Math.random(),
      ...template,
      x: Math.random() < 0.5 ? -30 : gameWidth + 30, // spawn from left or right
      y: 30 + Math.random() * 100,
    };

    setAnimals((prev) => [...prev, newAnimal]);
  }, []);

  // Spawn animals periodically
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(spawnAnimal, 1500);
    return () => clearInterval(interval);
  }, [gameOver, spawnAnimal]);

  // Move animals
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      const gameWidth = gameAreaRef.current?.clientWidth || 350;
      const midpoint = gameWidth / 2;
      setAnimals((prev) =>
        prev
          .map((animal) => ({
            ...animal,
            x: animal.x < midpoint ? animal.x + animal.speed : animal.x - animal.speed,
          }))
          .filter((animal) => animal.x > -50 && animal.x < gameWidth + 50)
      );
    }, 50);

    return () => clearInterval(interval);
  }, [gameOver]);

  // Timer
  useEffect(() => {
    if (gameOver) return;

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
  }, [gameOver]);

  // Track mouse/touch position for crosshair
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    setCrosshairPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Handle touch events for mobile
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    setCrosshairPos({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    });
  };

  const handleTouchTap = (e: React.TouchEvent) => {
    if (!gameAreaRef.current || gameOver) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const touch = e.changedTouches[0];
    const tapPos = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
    setCrosshairPos(tapPos);
    // Shoot at tap position
    const hitAnimal = animals.find((animal) => {
      const dx = Math.abs(tapPos.x - animal.x);
      const dy = Math.abs(tapPos.y - animal.y);
      return dx < 40 && dy < 40; // Larger hit area for touch
    });

    if (hitAnimal) {
      if (hitAnimal.isSpecial) {
        playSound('error');
        setMessage(hitAnimal.message || "You can't hunt this one!");
        setTimeout(() => setMessage(''), 2000);
      } else {
        playSound('success');
        setScore((prev) => Math.min(100, prev + hitAnimal.points));
        setAnimals((prev) => prev.filter((a) => a.id !== hitAnimal.id));
        setMessage(`Got a ${hitAnimal.type}! +${hitAnimal.points} food`);
        setTimeout(() => setMessage(''), 1000);
      }
    } else {
      playSound('click');
    }
  };

  const handleShoot = () => {
    if (gameOver) return;

    // Check if crosshair is over any animal
    const hitAnimal = animals.find((animal) => {
      const dx = Math.abs(crosshairPos.x - animal.x);
      const dy = Math.abs(crosshairPos.y - animal.y);
      return dx < 30 && dy < 30;
    });

    if (hitAnimal) {
      if (hitAnimal.isSpecial) {
        playSound('error');
        setMessage(hitAnimal.message || "You can't hunt this one!");
        setTimeout(() => setMessage(''), 2000);
      } else {
        playSound('success');
        setScore((prev) => Math.min(100, prev + hitAnimal.points)); // Max 100 lbs carry limit
        setAnimals((prev) => prev.filter((a) => a.id !== hitAnimal.id));
        setMessage(`Got a ${hitAnimal.type}! +${hitAnimal.points} food`);
        setTimeout(() => setMessage(''), 1000);
      }
    } else {
      playSound('click');
    }
  };

  const handleFinish = () => {
    playSound('success');
    updateResources({ food: resources.food + score });
    // Track foraging food for achievements
    if (score > 0) {
      incrementAchievementStat('foragingTotalFood', score);
    }
    setScreen('travel');
  };

  return (
    <div className="bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-lg p-4 shadow-2xl border-4 border-magic-gold">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl text-magic-gold">Hunting</h1>
          <p className="text-xs text-white/60">Click to shoot!</p>
        </div>
        <div className="text-right">
          <p className="text-white">
            <span className="text-magic-gold">{score}</span>/100 lbs
          </p>
          <p className="text-xs text-white/60">
            Time: <span className={timeLeft < 10 ? 'text-red-400' : 'text-white'}>{timeLeft}s</span>
          </p>
        </div>
      </div>

      {/* Game area */}
      <div
        ref={gameAreaRef}
        className="relative h-48 md:h-64 bg-gradient-to-b from-[#87CEEB] to-[#228B22] rounded-lg overflow-hidden cursor-crosshair mb-4 touch-none"
        onMouseMove={handleMouseMove}
        onClick={handleShoot}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchTap}
      >
        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#228B22]" />

        {/* Trees */}
        <div className="absolute bottom-12 left-8 text-3xl">🌲</div>
        <div className="absolute bottom-12 left-24 text-2xl">🌳</div>
        <div className="absolute bottom-12 right-8 text-3xl">🌲</div>
        <div className="absolute bottom-12 right-24 text-2xl">🌳</div>

        {/* Animals */}
        {animals.map((animal) => (
          <div
            key={animal.id}
            className="absolute text-3xl transition-transform"
            style={{
              left: animal.x,
              top: animal.y,
              transform: animal.x < 200 ? 'scaleX(1)' : 'scaleX(-1)',
            }}
          >
            {animal.emoji}
          </div>
        ))}

        {/* Crosshair */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: crosshairPos.x - 15,
            top: crosshairPos.y - 15,
          }}
        >
          <div className="w-8 h-8 border-2 border-red-500 rounded-full flex items-center justify-center">
            <div className="w-1 h-1 bg-red-500 rounded-full" />
          </div>
        </div>

        {/* Message overlay */}
        {message && (
          <div className="absolute inset-x-0 top-4 text-center">
            <span className="bg-black/70 text-white px-4 py-2 rounded text-sm">
              {message}
            </span>
          </div>
        )}

        {/* Game over overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl text-magic-gold mb-2">Time's Up!</h2>
              <p className="text-white mb-4">You gathered {score} lbs of food</p>
              <button
                onClick={handleFinish}
                className="px-6 py-2 bg-prairie-green hover:bg-green-700 text-white rounded"
              >
                Take to Truck
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="text-xs text-white/50 text-center mb-4">
        Watch for the Oregon Duck - but you won't be able to shoot it!
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
          Cancel Hunt
        </button>
      )}
    </div>
  );
}

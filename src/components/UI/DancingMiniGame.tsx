import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../../stores/gameStore';

type Direction = '⬆️' | '⬇️' | '⬅️' | '➡️';

interface DanceMove {
  id: number;
  direction: Direction;
  y: number;
}

const DIRECTIONS: Direction[] = ['⬆️', '⬇️', '⬅️', '➡️'];
const KEY_MAP: Record<string, Direction> = {
  ArrowUp: '⬆️',
  ArrowDown: '⬇️',
  ArrowLeft: '⬅️',
  ArrowRight: '➡️',
  w: '⬆️',
  s: '⬇️',
  a: '⬅️',
  d: '➡️',
};

export default function DancingMiniGame() {
  const { setScreen } = useGameStore();
  const [moves, setMoves] = useState<DanceMove[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<'perfect' | 'good' | 'miss' | null>(null);
  const [dancePartner, setDancePartner] = useState<string>('🐱');

  // Spawn moves
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      const newMove: DanceMove = {
        id: Date.now(),
        direction: DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)],
        y: 0,
      };
      setMoves((prev) => [...prev, newMove]);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameOver]);

  // Move arrows down
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setMoves((prev) =>
        prev
          .map((move) => ({ ...move, y: move.y + 3 }))
          .filter((move) => move.y < 110)
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

  // Handle key press
  const handleKeyPress = useCallback(
    (direction: Direction) => {
      if (gameOver) return;

      // Find moves in the hit zone (y between 70-90)
      const hitZoneMoves = moves.filter((m) => m.y >= 65 && m.y <= 95);
      const matchingMove = hitZoneMoves.find((m) => m.direction === direction);

      if (matchingMove) {
        // Hit!
        const isPerfect = matchingMove.y >= 75 && matchingMove.y <= 85;
        const points = isPerfect ? 100 : 50;
        const comboMultiplier = 1 + combo * 0.1;

        setScore((s) => s + Math.floor(points * comboMultiplier));
        setCombo((c) => {
          const newCombo = c + 1;
          setMaxCombo((m) => Math.max(m, newCombo));
          return newCombo;
        });
        setFeedback(isPerfect ? 'perfect' : 'good');
        setMoves((prev) => prev.filter((m) => m.id !== matchingMove.id));

        // Change dance partner on combos
        if ((combo + 1) % 5 === 0) {
          const partners = ['🐱', '🐭', '👸', '🧚', '🦊', '🐻', '🐰'];
          setDancePartner(partners[Math.floor(Math.random() * partners.length)]);
        }
      } else {
        // Miss!
        setCombo(0);
        setFeedback('miss');
      }

      setTimeout(() => setFeedback(null), 300);
    },
    [moves, combo, gameOver]
  );

  // Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const direction = KEY_MAP[e.key];
      if (direction) {
        e.preventDefault();
        handleKeyPress(direction);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  const handleFinish = () => {
    // Award morale based on performance (score / 100) * 5
    setScreen('travel');
  };

  return (
    <div className="bg-gradient-to-b from-[#1a1a2e] via-[#4a1a6b] to-[#1a1a2e] rounded-lg p-4 shadow-2xl border-4 border-magic-gold">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-lg md:text-xl text-magic-gold">Dance Party!</h1>
          <p className="text-xs text-white/60">Hit the arrows in time!</p>
        </div>
        <div className="text-right">
          <p className="text-white text-sm">
            Score: <span className="text-magic-gold">{score}</span>
          </p>
          <p className="text-xs text-white/60">
            Time: <span className={timeLeft < 10 ? 'text-red-400' : 'text-white'}>{timeLeft}s</span>
          </p>
          {combo > 2 && (
            <p className="text-xs text-cat-orange animate-pulse">
              {combo}x Combo!
            </p>
          )}
        </div>
      </div>

      {/* Dance instructor */}
      <div className="flex items-center gap-2 mb-2 p-2 bg-white/5 rounded-lg">
        <span className="text-2xl">💃</span>
        <p className="text-white text-xs flex-1">
          "Dance your heart out! Press arrows or tap buttons when they hit the zone!"
        </p>
        <span className="text-2xl">🕺</span>
      </div>

      {/* Game area */}
      <div className="relative h-64 md:h-80 bg-gradient-to-b from-purple-900/50 to-pink-900/50 rounded-lg overflow-hidden mb-4">
        {/* Disco lights */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-full opacity-20"
              style={{
                left: `${15 + i * 15}%`,
                background: `linear-gradient(to bottom, ${
                  ['#ff0', '#f0f', '#0ff', '#f00', '#0f0', '#00f'][i]
                }, transparent)`,
                animation: `pulse ${1 + i * 0.2}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>

        {/* Hit zone */}
        <div className="absolute bottom-[15%] left-0 right-0 h-[15%] border-2 border-dashed border-magic-gold/50 bg-magic-gold/10">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-magic-gold/70">
            HIT ZONE
          </span>
        </div>

        {/* Falling arrows */}
        {moves.map((move) => (
          <div
            key={move.id}
            className="absolute text-3xl md:text-4xl transition-all"
            style={{
              left: '50%',
              top: `${move.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {move.direction}
          </div>
        ))}

        {/* Dance partner */}
        <div
          className={`absolute bottom-2 left-1/2 -translate-x-1/2 text-4xl transition-transform ${
            feedback === 'perfect' ? 'scale-125' : feedback === 'good' ? 'scale-110' : ''
          }`}
        >
          {dancePartner}
        </div>

        {/* Feedback */}
        {feedback && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <span
              className={`text-2xl font-bold animate-ping ${
                feedback === 'perfect'
                  ? 'text-magic-gold'
                  : feedback === 'good'
                  ? 'text-green-400'
                  : 'text-red-400'
              }`}
            >
              {feedback === 'perfect' ? '✨ PERFECT! ✨' : feedback === 'good' ? 'GOOD!' : 'MISS!'}
            </span>
          </div>
        )}

        {/* Game over overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-center p-4">
              <div className="text-4xl mb-2">🎉💃🕺🎉</div>
              <h2 className="text-xl md:text-2xl text-magic-gold mb-2">Dance Complete!</h2>
              <p className="text-white mb-1">Score: {score}</p>
              <p className="text-white/60 text-sm mb-4">Max Combo: {maxCombo}x</p>
              <button
                onClick={handleFinish}
                className="px-6 py-3 bg-prairie-green hover:bg-green-700 text-white rounded-lg"
              >
                Back to Trail
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Touch controls for mobile */}
      <div className="grid grid-cols-4 gap-2 md:hidden">
        {DIRECTIONS.map((dir) => (
          <button
            key={dir}
            onClick={() => handleKeyPress(dir)}
            className="py-4 bg-white/10 active:bg-magic-gold/30 rounded-lg text-2xl transition-colors"
            disabled={gameOver}
          >
            {dir}
          </button>
        ))}
      </div>

      {/* Desktop instructions */}
      <div className="hidden md:block text-center text-xs text-white/50">
        Use Arrow Keys or WASD to dance!
      </div>

      {/* Back button */}
      {!gameOver && (
        <button
          onClick={() => setScreen('travel')}
          className="w-full mt-4 py-2 bg-white/10 hover:bg-white/20 text-white/70 rounded text-sm"
        >
          Leave Dance Floor
        </button>
      )}
    </div>
  );
}

import { useState, useEffect, useCallback, useRef } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { KARAOKE_SONGS, KaraokeSong, LyricLine } from '../../data/songs';
import TabbyCat from '../sprites/TabbyCat';
import { playSound } from '../../services/audio';

type HitResult = 'perfect' | 'good' | 'miss' | null;

export default function KaraokeMiniGame() {
  const { setScreen, incrementAchievementStat, updateAchievementStats, achievementStats, updateResources, resources } = useGameStore();
  const [gameState, setGameState] = useState<'select' | 'playing' | 'results'>('select');
  const [selectedSong, setSelectedSong] = useState<KaraokeSong | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [perfectHits, setPerfectHits] = useState(0);
  const [goodHits, setGoodHits] = useState(0);
  const [missedHits, setMissedHits] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [hitResult, setHitResult] = useState<HitResult>(null);
  const [beatPositions, setBeatPositions] = useState<number[]>([]);
  const [hitBeats, setHitBeats] = useState<Set<number>>(new Set());
  const [catReaction, setCatReaction] = useState<'happy' | 'excited' | 'sleeping'>('happy');
  const [showSparkles, setShowSparkles] = useState(false);
  const gameLoopRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Get current lyric line
  const getCurrentLine = useCallback((): LyricLine | null => {
    if (!selectedSong) return null;
    return selectedSong.lyrics[currentLineIndex] || null;
  }, [selectedSong, currentLineIndex]);

  // Start the game - set song first, then state changes via effect
  const startGame = (song: KaraokeSong) => {
    playSound('click');
    // Reset all game state first
    setCurrentTime(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setPerfectHits(0);
    setGoodHits(0);
    setMissedHits(0);
    setCurrentLineIndex(0);
    setHitBeats(new Set());
    startTimeRef.current = Date.now();

    // Initialize beat positions for first line
    if (song.lyrics[0]) {
      setBeatPositions(song.lyrics[0].beats);
    }

    // Set song and state together - React 18 should batch these
    setSelectedSong(song);
    setGameState('playing');
  };

  // Fallback: If somehow we're in 'playing' state without a song, go back to select
  useEffect(() => {
    if (gameState === 'playing' && !selectedSong) {
      // This shouldn't happen with React 18 batching, but just in case
      setGameState('select');
    }
  }, [gameState, selectedSong]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing' || !selectedSong) return;

    const gameLoop = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setCurrentTime(elapsed);

      // Check if we should move to next line
      const nextLine = selectedSong.lyrics[currentLineIndex + 1];

      if (nextLine && elapsed >= nextLine.time) {
        // Count missed beats from previous line
        const missedCount = beatPositions.length - hitBeats.size;
        if (missedCount > 0) {
          setMissedHits(prev => prev + missedCount);
          setCombo(0);
        }

        setCurrentLineIndex(prev => prev + 1);
        setBeatPositions(nextLine.beats);
        setHitBeats(new Set());
      }

      // Check if song is over
      const lastLine = selectedSong.lyrics[selectedSong.lyrics.length - 1];
      if (elapsed >= lastLine.time + 5) {
        setGameState('results');
        return;
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, selectedSong, currentLineIndex, beatPositions, hitBeats]);

  // Handle tap/click to sing
  const handleSing = useCallback(() => {
    if (gameState !== 'playing' || !selectedSong) return;

    const currentLine = getCurrentLine();
    if (!currentLine) return;

    const lineProgress = ((currentTime - currentLine.time) / 4) * 100; // 4 seconds per line approx

    // Find closest unhit beat
    let closestBeat = -1;
    let closestDistance = Infinity;

    beatPositions.forEach((beat, index) => {
      if (hitBeats.has(index)) return;
      const distance = Math.abs(beat - lineProgress);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestBeat = index;
      }
    });

    if (closestBeat === -1) return;

    // Determine hit quality
    let result: HitResult = 'miss';
    let points = 0;

    if (closestDistance <= 8) {
      result = 'perfect';
      points = 100 * (1 + combo * 0.1);
      playSound('success');
      setPerfectHits(prev => prev + 1);
      setCombo(prev => {
        const newCombo = prev + 1;
        if (newCombo > maxCombo) setMaxCombo(newCombo);
        return newCombo;
      });
      setCatReaction('excited');
      setShowSparkles(true);
      setTimeout(() => setShowSparkles(false), 500);
    } else if (closestDistance <= 20) {
      result = 'good';
      points = 50 * (1 + combo * 0.05);
      playSound('coin');
      setGoodHits(prev => prev + 1);
      setCombo(prev => {
        const newCombo = prev + 1;
        if (newCombo > maxCombo) setMaxCombo(newCombo);
        return newCombo;
      });
      setCatReaction('happy');
    } else {
      result = 'miss';
      playSound('error');
      setCombo(0);
      setMissedHits(prev => prev + 1);
      setCatReaction('sleeping');
    }

    setHitBeats(prev => new Set([...prev, closestBeat]));
    setScore(prev => prev + Math.floor(points));
    setHitResult(result);
    setTimeout(() => setHitResult(null), 300);
  }, [gameState, selectedSong, getCurrentLine, currentTime, beatPositions, hitBeats, combo, maxCombo]);

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleSing();
      }
      if (e.code === 'Escape') {
        setGameState('select');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSing]);

  // Calculate final grade
  const getGrade = useCallback(() => {
    const totalBeats = perfectHits + goodHits + missedHits;
    if (totalBeats === 0) return 'C';
    const accuracy = ((perfectHits * 100 + goodHits * 50) / (totalBeats * 100)) * 100;
    if (accuracy >= 95) return 'S';
    if (accuracy >= 85) return 'A';
    if (accuracy >= 70) return 'B';
    if (accuracy >= 50) return 'C';
    return 'D';
  }, [perfectHits, goodHits, missedHits]);

  // Track achievements and give rewards when game ends
  // IMPORTANT: This must be before any conditional returns to follow Rules of Hooks
  useEffect(() => {
    if (gameState === 'results') {
      const grade = getGrade();

      // Track songs played
      incrementAchievementStat('karaokeSongsPlayed');

      // Track S ranks
      if (grade === 'S') {
        incrementAchievementStat('karaokeSRanks');
      }

      // Update max combo if higher
      if (maxCombo > achievementStats.maxCombo) {
        updateAchievementStats({ maxCombo });
      }

      // Update high score
      if (score > achievementStats.karaokeHighScore) {
        updateAchievementStats({ karaokeHighScore: score });
      }

      // Award pixie dust based on grade - singing is magical!
      const pixieDustRewards: Record<string, number> = { 'S': 20, 'A': 12, 'B': 8, 'C': 4, 'D': 2 };
      const pixieDustReward = pixieDustRewards[grade] || 0;
      if (pixieDustReward > 0) {
        updateResources({ pixieDust: resources.pixieDust + pixieDustReward });
      }

      // Bonus gold for S rank performances
      if (grade === 'S') {
        updateResources({ goldCoins: resources.goldCoins + 25 });
      }
    }
  }, [gameState, getGrade, maxCombo, score, achievementStats, incrementAchievementStat, updateAchievementStats, updateResources, resources]);

  // Song selection screen - also show if playing but song not loaded yet
  if (gameState === 'select' || (gameState === 'playing' && !selectedSong)) {
    // Safety check for songs data
    const songs = KARAOKE_SONGS || [];

    return (
      <div className="bg-gradient-to-b from-[#1a1a2e] via-[#2d1b4e] to-[#1a1a2e] rounded-lg p-4 md:p-6 shadow-2xl border-4 border-magic-gold">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl text-magic-gold mb-2">Disney Karaoke!</h1>
          <p className="text-white/60 text-sm">Pick a song and show off your singing!</p>
        </div>

        {/* Microphone animation */}
        <div className="text-center mb-6">
          <span className="text-6xl animate-bounce inline-block">🎤</span>
        </div>

        {/* Song list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 max-h-[400px] overflow-y-auto">
          {songs.length === 0 ? (
            <div className="col-span-2 text-center text-white/60 p-4">
              <p>Loading songs...</p>
            </div>
          ) : songs.map((song) => (
            <button
              key={song.id}
              onClick={() => startGame(song)}
              className="p-4 bg-white/5 hover:bg-white/15 rounded-lg border-2 border-white/20 hover:border-magic-gold transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl group-hover:scale-110 transition-transform">
                  {song.emoji}
                </span>
                <div className="flex-1">
                  <h3 className="text-white font-bold">{song.title}</h3>
                  <p className="text-white/50 text-sm">{song.movie}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      song.difficulty === 'easy' ? 'bg-green-500/30 text-green-300' :
                      song.difficulty === 'medium' ? 'bg-yellow-500/30 text-yellow-300' :
                      'bg-red-500/30 text-red-300'
                    }`}>
                      {song.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

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
    );
  }

  // Results screen
  if (gameState === 'results') {
    const grade = getGrade();
    return (
      <div className="bg-gradient-to-b from-[#1a1a2e] via-[#2d1b4e] to-[#1a1a2e] rounded-lg p-4 md:p-6 shadow-2xl border-4 border-magic-gold">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl text-magic-gold mb-2">Performance Complete!</h1>
          <p className="text-white/60 mb-4">{selectedSong?.title} - {selectedSong?.movie}</p>

          {/* Grade */}
          <div className={`text-8xl font-bold mb-4 ${
            grade === 'S' ? 'text-magic-gold animate-pulse' :
            grade === 'A' ? 'text-green-400' :
            grade === 'B' ? 'text-blue-400' :
            grade === 'C' ? 'text-yellow-400' :
            'text-red-400'
          }`}>
            {grade}
          </div>

          {/* Score */}
          <div className="text-4xl text-white mb-6">{score} pts</div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-green-400 text-xl font-bold">{perfectHits}</p>
              <p className="text-white/50">Perfect</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-yellow-400 text-xl font-bold">{goodHits}</p>
              <p className="text-white/50">Good</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-red-400 text-xl font-bold">{missedHits}</p>
              <p className="text-white/50">Missed</p>
            </div>
          </div>

          <div className="text-white/60 mb-6">
            Max Combo: <span className="text-magic-gold">{maxCombo}</span>
          </div>

          {/* Cat audience reaction */}
          <div className="flex justify-center gap-4 mb-6">
            <div className="text-center">
              <TabbyCat variant="marge" size="md" mood={grade === 'S' || grade === 'A' ? 'excited' : 'happy'} />
              <p className="text-xs text-white/50 mt-1">
                {grade === 'S' ? '"Bravo!"' : grade === 'A' ? '"Wonderful!"' : '"Not bad"'}
              </p>
            </div>
            <div className="text-center">
              <TabbyCat variant="minestrone" size="md" mood="excited" />
              <p className="text-xs text-white/50 mt-1">"Again! Again!"</p>
            </div>
            <div className="text-center">
              <TabbyCat variant="mac" size="md" mood={grade === 'D' ? 'sleeping' : 'happy'} />
              <p className="text-xs text-white/50 mt-1">
                {grade === 'D' ? '*snoring*' : '"That was loud!"'}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                playSound('click');
                setGameState('select');
              }}
              className="flex-1 py-3 bg-elsa-blue hover:bg-blue-400 text-white rounded-lg transition-colors"
            >
              Sing Another
            </button>
            <button
              onClick={() => {
                playSound('click');
                setScreen('travel');
              }}
              className="flex-1 py-3 bg-trail-brown hover:bg-amber-800 text-white rounded-lg transition-colors"
            >
              Back to Trail
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Playing screen
  const currentLine = getCurrentLine();
  const lineProgress = currentLine ? ((currentTime - currentLine.time) / 4) * 100 : 0;

  return (
    <div
      className="bg-gradient-to-b from-[#1a1a2e] via-[#2d1b4e] to-[#0a0a15] rounded-lg p-4 shadow-2xl border-4 border-magic-gold relative overflow-hidden"
      onClick={handleSing}
      onTouchStart={handleSing}
    >
      {/* Stage lights */}
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-0 right-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />

      {/* Sparkles on perfect hit */}
      {showSparkles && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-xl animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: '0.5s',
              }}
            >
              ✨
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-4 relative z-10">
        <div>
          <h2 className="text-lg text-magic-gold">{selectedSong?.emoji} {selectedSong?.title}</h2>
          <p className="text-white/50 text-xs">{selectedSong?.movie}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl text-white font-bold">{score}</p>
          <p className="text-xs text-magic-gold">Combo: {combo}x</p>
        </div>
      </div>

      {/* Microphone / Stage area */}
      <div className="relative bg-black/30 rounded-lg p-6 mb-4 min-h-[200px]">
        {/* Spotlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-full bg-gradient-to-b from-yellow-500/10 to-transparent" />

        {/* Microphone */}
        <div className="text-center mb-4">
          <span className={`text-5xl inline-block transition-transform ${
            hitResult === 'perfect' ? 'scale-125 animate-bounce' :
            hitResult === 'good' ? 'scale-110' : ''
          }`}>
            🎤
          </span>
        </div>

        {/* Current lyric */}
        <div className="text-center mb-4">
          <p className={`text-xl md:text-2xl text-white font-bold transition-all ${
            hitResult === 'perfect' ? 'text-magic-gold scale-105' :
            hitResult === 'good' ? 'text-green-400' :
            hitResult === 'miss' ? 'text-red-400' : ''
          }`}>
            {currentLine?.text || '...'}
          </p>
        </div>

        {/* Beat track */}
        <div className="relative h-12 bg-white/10 rounded-full overflow-hidden">
          {/* Progress indicator */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white/50 z-20"
            style={{ left: `${Math.min(100, Math.max(0, lineProgress))}%` }}
          />

          {/* Beat markers */}
          {beatPositions.map((beat, index) => (
            <div
              key={index}
              className={`absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                hitBeats.has(index)
                  ? 'bg-green-500 scale-75 opacity-50'
                  : 'bg-magic-gold animate-pulse'
              }`}
              style={{ left: `calc(${beat}% - 16px)` }}
            >
              <span className="text-lg">
                {hitBeats.has(index) ? '✓' : '♪'}
              </span>
            </div>
          ))}
        </div>

        {/* Hit feedback */}
        {hitResult && (
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-bold animate-ping ${
            hitResult === 'perfect' ? 'text-magic-gold' :
            hitResult === 'good' ? 'text-green-400' :
            'text-red-400'
          }`}>
            {hitResult === 'perfect' ? 'PERFECT!' : hitResult === 'good' ? 'GOOD!' : 'MISS'}
          </div>
        )}
      </div>

      {/* Cat audience */}
      <div className="flex justify-center gap-6 mb-4">
        <div className={`transition-transform ${catReaction === 'excited' ? 'animate-bounce' : ''}`}>
          <TabbyCat variant="marge" size="sm" mood={catReaction === 'sleeping' ? 'sad' : 'happy'} />
        </div>
        <div className={`transition-transform ${catReaction === 'excited' ? 'animate-bounce' : ''}`} style={{ animationDelay: '0.1s' }}>
          <TabbyCat variant="minestrone" size="sm" mood={catReaction} />
        </div>
        <div className={`transition-transform ${catReaction === 'excited' ? 'animate-bounce' : ''}`} style={{ animationDelay: '0.2s' }}>
          <TabbyCat variant="mac" size="sm" mood={catReaction === 'sleeping' ? 'sleeping' : 'happy'} />
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center text-white/50 text-sm">
        <p className="md:hidden">Tap screen to sing!</p>
        <p className="hidden md:block">Press SPACE or click to sing!</p>
      </div>

      {/* Exit button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          playSound('click');
          setGameState('select');
        }}
        className="mt-3 w-full py-2 bg-white/10 hover:bg-white/20 text-white/70 rounded text-sm relative z-10"
      >
        ✕ Exit Song
      </button>

      {/* Progress bar */}
      <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-magic-gold transition-all"
          style={{
            width: selectedSong ? `${(currentLineIndex / selectedSong.lyrics.length) * 100}%` : '0%'
          }}
        />
      </div>
    </div>
  );
}

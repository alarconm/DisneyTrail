import { useState, useEffect } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { playSound } from '../../services/audio';

interface Script {
  scene: string;
  lines: { speaker: string; text: string; emotion: string }[];
  correctEmotions: string[];
}

const SCRIPTS: Script[] = [
  {
    scene: 'The Lion King - Hakuna Matata',
    lines: [
      { speaker: '🦁', text: "What's a motto?", emotion: 'curious' },
      { speaker: '🐗', text: "Nothing! What's a-motto with you?", emotion: 'happy' },
      { speaker: '🦡', text: 'Ha ha ha!', emotion: 'laughing' },
    ],
    correctEmotions: ['🤔', '😄', '🤣'],
  },
  {
    scene: 'Frozen - Let It Go',
    lines: [
      { speaker: '❄️', text: 'The cold never bothered me anyway...', emotion: 'confident' },
      { speaker: '⛄', text: "Hi, I'm Olaf and I like warm hugs!", emotion: 'excited' },
      { speaker: '👸', text: 'Do you want to build a snowman?', emotion: 'hopeful' },
    ],
    correctEmotions: ['😌', '🤗', '🥺'],
  },
  {
    scene: 'Moana - How Far I\'ll Go',
    lines: [
      { speaker: '🌊', text: "I've been staring at the edge of the water...", emotion: 'longing' },
      { speaker: '🦀', text: 'SHINY!', emotion: 'greedy' },
      { speaker: '🐓', text: '...', emotion: 'confused' },
    ],
    correctEmotions: ['😔', '🤩', '😐'],
  },
  {
    scene: 'Beauty and the Beast',
    lines: [
      { speaker: '🌹', text: 'Tale as old as time...', emotion: 'romantic' },
      { speaker: '🫖', text: 'Be our guest!', emotion: 'welcoming' },
      { speaker: '🕯️', text: 'Lumiére at your service!', emotion: 'proud' },
    ],
    correctEmotions: ['🥰', '😊', '😎'],
  },
  {
    scene: 'Tangled - I See The Light',
    lines: [
      { speaker: '👸', text: 'And at last I see the light!', emotion: 'amazed' },
      { speaker: '🦎', text: '*happy chameleon noises*', emotion: 'content' },
      { speaker: '🏴‍☠️', text: "I have a dream!", emotion: 'passionate' },
    ],
    correctEmotions: ['🤩', '😌', '💪'],
  },
  {
    scene: 'Aladdin - A Whole New World',
    lines: [
      { speaker: '🧞', text: 'You ain\'t never had a friend like me!', emotion: 'boastful' },
      { speaker: '🧕', text: 'A whole new world...', emotion: 'wonder' },
      { speaker: '🐒', text: '*steals something shiny*', emotion: 'mischievous' },
    ],
    correctEmotions: ['😎', '🤩', '😈'],
  },
  {
    scene: 'The Little Mermaid - Under the Sea',
    lines: [
      { speaker: '🧜‍♀️', text: 'I want to be where the people are!', emotion: 'yearning' },
      { speaker: '🦀', text: 'Under the sea!', emotion: 'joyful' },
      { speaker: '🐙', text: 'Poor unfortunate souls...', emotion: 'sinister' },
    ],
    correctEmotions: ['🥺', '😄', '😈'],
  },
  {
    scene: 'Mulan - I\'ll Make a Man Out of You',
    lines: [
      { speaker: '🐉', text: 'I AM THE GREAT STONE DRAGON!', emotion: 'dramatic' },
      { speaker: '⚔️', text: "Let's get down to business!", emotion: 'determined' },
      { speaker: '🦗', text: '*lucky cricket chirp*', emotion: 'hopeful' },
    ],
    correctEmotions: ['🤩', '💪', '🥺'],
  },
  {
    scene: 'Encanto - We Don\'t Talk About Bruno',
    lines: [
      { speaker: '🦋', text: 'We don\'t talk about Bruno, no, no, no!', emotion: 'secretive' },
      { speaker: '🔮', text: 'I see something bad...', emotion: 'worried' },
      { speaker: '💪', text: 'I need to lift this weight!', emotion: 'strained' },
    ],
    correctEmotions: ['🤫', '😰', '😤'],
  },
  {
    scene: 'Coco - Remember Me',
    lines: [
      { speaker: '🎸', text: 'Remember me...', emotion: 'bittersweet' },
      { speaker: '💀', text: 'Seize your moment!', emotion: 'encouraging' },
      { speaker: '🐕', text: '*loyal companion bark*', emotion: 'faithful' },
    ],
    correctEmotions: ['😢', '💪', '🥰'],
  },
  {
    scene: 'Toy Story - You\'ve Got a Friend in Me',
    lines: [
      { speaker: '🤠', text: 'To infinity...', emotion: 'heroic' },
      { speaker: '🚀', text: '...and beyond!', emotion: 'confident' },
      { speaker: '🦖', text: 'I don\'t like confrontation!', emotion: 'nervous' },
    ],
    correctEmotions: ['💪', '😎', '😰'],
  },
  {
    scene: 'Finding Nemo - Just Keep Swimming',
    lines: [
      { speaker: '🐠', text: 'NEMO!!!', emotion: 'desperate' },
      { speaker: '🐟', text: 'Just keep swimming!', emotion: 'optimistic' },
      { speaker: '🦈', text: 'Fish are friends, not food!', emotion: 'reformed' },
    ],
    correctEmotions: ['😱', '😄', '😌'],
  },
  {
    scene: 'Lilo & Stitch - Ohana',
    lines: [
      { speaker: '👽', text: 'Ohana means family...', emotion: 'learning' },
      { speaker: '👧', text: '...and family means nobody gets left behind!', emotion: 'determined' },
      { speaker: '👽', text: 'Also cute and fluffy!', emotion: 'proud' },
    ],
    correctEmotions: ['🤔', '💪', '😊'],
  },
  {
    scene: 'Hercules - Zero to Hero',
    lines: [
      { speaker: '💪', text: 'I can go the distance!', emotion: 'determined' },
      { speaker: '😈', text: 'Name is Hades, Lord of the dead.', emotion: 'sarcastic' },
      { speaker: '🐴', text: '*heroic whinny*', emotion: 'noble' },
    ],
    correctEmotions: ['💪', '😏', '😎'],
  },
  {
    scene: 'Pocahontas - Colors of the Wind',
    lines: [
      { speaker: '🍃', text: 'Can you paint with all the colors of the wind?', emotion: 'wise' },
      { speaker: '🦝', text: '*curious raccoon chittering*', emotion: 'playful' },
      { speaker: '🌳', text: 'Listen with your heart...', emotion: 'mystical' },
    ],
    correctEmotions: ['😌', '😄', '🥰'],
  },
];

const ALL_EMOTIONS = ['🤔', '😄', '🤣', '😌', '🤗', '🥺', '😔', '🤩', '😐', '🥰', '😊', '😎', '💪', '😢', '😠', '🥳', '😈', '😱', '😰', '🤫', '😤', '😏'];

export default function TheaterMiniGame() {
  const { setScreen, updateResources, resources, incrementAchievementStat, updateAchievementStats } = useGameStore();
  const [currentScript, setCurrentScript] = useState<Script | null>(null);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [scenesCompleted, setScenesCompleted] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showCurtains, setShowCurtains] = useState(true);

  useEffect(() => {
    // Opening curtains animation
    setTimeout(() => {
      setShowCurtains(false);
      selectNewScript();
    }, 1500);
  }, []);

  const selectNewScript = () => {
    const script = SCRIPTS[Math.floor(Math.random() * SCRIPTS.length)];
    setCurrentScript(script);
    setCurrentLineIndex(0);
    setSelectedEmotions([]);
  };

  const handleEmotionSelect = (emotion: string) => {
    if (!currentScript || gameOver) return;
    playSound('click');

    const isCorrect = currentScript.correctEmotions[currentLineIndex] === emotion;

    if (isCorrect) {
      playSound('success');
      setFeedback('correct');
      setScore((s) => s + 100);
      setSelectedEmotions((prev) => [...prev, emotion]);

      setTimeout(() => {
        setFeedback(null);
        if (currentLineIndex < currentScript.lines.length - 1) {
          setCurrentLineIndex((i) => i + 1);
        } else {
          // Scene complete!
          playSound('levelup');
          setScenesCompleted((s) => s + 1);
          setScore((s) => s + 200); // Bonus for completing scene

          if (scenesCompleted >= 2) {
            // Game over after 3 scenes
            setTimeout(() => setGameOver(true), 1000);
          } else {
            // Next scene
            setTimeout(() => {
              setShowCurtains(true);
              setTimeout(() => {
                setShowCurtains(false);
                selectNewScript();
              }, 1000);
            }, 1500);
          }
        }
      }, 800);
    } else {
      playSound('error');
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 500);
    }
  };

  const handleFinish = () => {
    playSound('success');

    // Award pixie dust based on performance (theater magic!)
    const pixieDustReward = Math.floor(score / 100) * 2;
    if (pixieDustReward > 0) {
      updateResources({ pixieDust: resources.pixieDust + pixieDustReward });
    }

    // Track perfect shows (all 3 scenes completed = 900+ score)
    if (score >= 900) {
      incrementAchievementStat('theaterPerfectShows');
    }

    // Track theater reference achievement
    updateAchievementStats({ foundTheaterReference: true });

    setScreen('travel');
  };

  // Get shuffled emotions including the correct one
  const getEmotionOptions = () => {
    if (!currentScript) return [];
    const correct = currentScript.correctEmotions[currentLineIndex];
    const others = ALL_EMOTIONS.filter((e) => e !== correct)
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);
    return [...others, correct].sort(() => Math.random() - 0.5);
  };

  return (
    <div className="bg-gradient-to-b from-[#2d1b1b] via-[#1a1a2e] to-[#1a1a2e] rounded-lg p-4 shadow-2xl border-4 border-magic-gold overflow-hidden relative">
      {/* Curtains */}
      <div
        className={`absolute inset-0 z-50 flex transition-all duration-1000 ${
          showCurtains ? '' : 'pointer-events-none'
        }`}
      >
        <div
          className={`w-1/2 h-full bg-gradient-to-r from-red-900 to-red-800 transition-transform duration-1000 ${
            showCurtains ? '' : '-translate-x-full'
          }`}
          style={{ boxShadow: 'inset -20px 0 40px rgba(0,0,0,0.5)' }}
        />
        <div
          className={`w-1/2 h-full bg-gradient-to-l from-red-900 to-red-800 transition-transform duration-1000 ${
            showCurtains ? '' : 'translate-x-full'
          }`}
          style={{ boxShadow: 'inset 20px 0 40px rgba(0,0,0,0.5)' }}
        />
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-lg md:text-xl text-magic-gold">Theater Time!</h1>
          <p className="text-xs text-white/60">NW Children's Theater presents...</p>
        </div>
        <div className="text-right">
          <p className="text-white text-sm">
            Score: <span className="text-magic-gold">{score}</span>
          </p>
          <p className="text-xs text-white/60">
            Scenes: {scenesCompleted + 1}/3
          </p>
        </div>
      </div>

      {/* Stage */}
      {currentScript && !gameOver && (
        <div className="relative">
          {/* Scene title */}
          <div className="text-center mb-4 p-2 bg-white/5 rounded">
            <p className="text-magic-gold text-sm">🎭 {currentScript.scene} 🎭</p>
          </div>

          {/* Stage area */}
          <div className="bg-gradient-to-b from-amber-900/30 to-amber-950/30 rounded-lg p-4 mb-4 min-h-[200px]">
            {/* Spotlights */}
            <div className="absolute top-0 left-1/4 w-16 h-16 bg-yellow-400/10 rounded-full blur-xl" />
            <div className="absolute top-0 right-1/4 w-16 h-16 bg-yellow-400/10 rounded-full blur-xl" />

            {/* Current line */}
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">
                {currentScript.lines[currentLineIndex].speaker}
              </div>
              <div className="bg-black/30 rounded-lg p-4 inline-block max-w-md">
                <p className="text-white text-lg italic">
                  "{currentScript.lines[currentLineIndex].text}"
                </p>
              </div>
            </div>

            {/* Instruction */}
            <p className="text-center text-white/60 text-sm mb-4">
              Choose the right emotion for this line:
            </p>

            {/* Selected emotions so far */}
            {selectedEmotions.length > 0 && (
              <div className="flex justify-center gap-2 mb-4">
                {selectedEmotions.map((e, i) => (
                  <span key={i} className="text-2xl animate-bounce">{e}</span>
                ))}
              </div>
            )}
          </div>

          {/* Emotion choices */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
            {getEmotionOptions().map((emotion, i) => (
              <button
                key={i}
                onClick={() => handleEmotionSelect(emotion)}
                className={`text-3xl p-3 rounded-lg transition-all ${
                  feedback === 'correct' && currentScript.correctEmotions[currentLineIndex] === emotion
                    ? 'bg-green-500/30 scale-110'
                    : feedback === 'wrong'
                    ? 'bg-red-500/30'
                    : 'bg-white/10 hover:bg-white/20 hover:scale-110'
                }`}
              >
                {emotion}
              </button>
            ))}
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`text-center p-2 rounded ${
              feedback === 'correct' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {feedback === 'correct' ? '🎭 Perfect delivery! Standing ovation!' : '🎭 Try another emotion!'}
            </div>
          )}
        </div>
      )}

      {/* Game over */}
      {gameOver && (
        <div className="text-center p-6">
          <div className="text-5xl mb-4">🎭🌟🎭</div>
          <h2 className="text-2xl text-magic-gold mb-2">Bravo!</h2>
          <p className="text-white mb-1">The audience loved it!</p>
          <p className="text-white/60 text-sm mb-4">Final Score: {score}</p>
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-2xl animate-bounce" style={{ animationDelay: `${i * 100}ms` }}>
                🌹
              </span>
            ))}
          </div>
          <button
            onClick={handleFinish}
            className="px-6 py-3 bg-prairie-green hover:bg-green-700 text-white rounded-lg"
          >
            Take Your Bow 🎭
          </button>
        </div>
      )}

      {/* Back button */}
      {!gameOver && (
        <button
          onClick={() => {
            playSound('click');
            setScreen('travel');
          }}
          className="w-full mt-2 py-2 bg-white/10 hover:bg-white/20 text-white/70 rounded text-sm"
        >
          Exit Stage
        </button>
      )}
    </div>
  );
}

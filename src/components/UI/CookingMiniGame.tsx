import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { playSound } from '../../services/audio';

interface Recipe {
  name: string;
  emoji: string;
  ingredients: string[];
  reward: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

const RECIPES: Recipe[] = [
  { name: 'Trail Mix', emoji: '🥜', ingredients: ['🥜', '🍫', '🍇'], reward: 15, difficulty: 'easy' },
  { name: 'Fruit Salad', emoji: '🥗', ingredients: ['🍎', '🍊', '🍇', '🍓'], reward: 20, difficulty: 'easy' },
  { name: 'Campfire Stew', emoji: '🍲', ingredients: ['🥕', '🥔', '🧅', '🍖'], reward: 30, difficulty: 'medium' },
  { name: "Remy's Ratatouille", emoji: '🍆', ingredients: ['🍆', '🍅', '🧅', '🫑', '🧄'], reward: 50, difficulty: 'hard' },
  { name: 'Magic Cookies', emoji: '🍪', ingredients: ['🥛', '🥚', '🍫', '🧈'], reward: 25, difficulty: 'medium' },
  { name: "Tiana's Gumbo", emoji: '🥘', ingredients: ['🦐', '🍚', '🫑', '🧅', '🌶️'], reward: 45, difficulty: 'hard' },
];

const ALL_INGREDIENTS = ['🥜', '🍫', '🍇', '🍎', '🍊', '🍓', '🥕', '🥔', '🧅', '🍖', '🍆', '🍅', '🫑', '🧄', '🥛', '🥚', '🧈', '🦐', '🍚', '🌶️'];

export default function CookingMiniGame() {
  const { setScreen, updateResources, resources, updatePartyMember, partyMembers, incrementAchievementStat } = useGameStore();
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [availableIngredients, setAvailableIngredients] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [recipesCompleted, setRecipesCompleted] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Initialize game
  useEffect(() => {
    const recipe = RECIPES[Math.floor(Math.random() * RECIPES.length)];
    setCurrentRecipe(recipe);
    shuffleIngredientsWithRecipe(recipe);
  }, []);

  const selectNewRecipe = () => {
    const recipe = RECIPES[Math.floor(Math.random() * RECIPES.length)];
    setCurrentRecipe(recipe);
    setSelectedIngredients([]);
    shuffleIngredientsWithRecipe(recipe);
  };

  const shuffleIngredientsWithRecipe = (recipe: Recipe) => {
    // MUST include recipe ingredients plus random extras
    const recipeIngredients = recipe.ingredients;
    const extras = ALL_INGREDIENTS
      .filter(ing => !recipeIngredients.includes(ing))
      .sort(() => Math.random() - 0.5)
      .slice(0, 8 - recipeIngredients.length);

    // Combine and shuffle
    const combined = [...recipeIngredients, ...extras];
    setAvailableIngredients(combined.sort(() => Math.random() - 0.5));
  };

  const shuffleIngredients = () => {
    if (currentRecipe) {
      shuffleIngredientsWithRecipe(currentRecipe);
    }
  };

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

  const handleIngredientClick = (ingredient: string) => {
    if (gameOver || !currentRecipe) return;
    playSound('click');

    if (selectedIngredients.includes(ingredient)) {
      // Remove ingredient
      setSelectedIngredients((prev) => prev.filter((i) => i !== ingredient));
    } else {
      // Add ingredient
      setSelectedIngredients((prev) => [...prev, ingredient]);
    }
  };

  const handleCook = useCallback(() => {
    if (!currentRecipe || gameOver) return;
    playSound('click');

    const isCorrect =
      selectedIngredients.length === currentRecipe.ingredients.length &&
      currentRecipe.ingredients.every((ing) => selectedIngredients.includes(ing));

    if (isCorrect) {
      playSound('success');
      setScore((s) => s + currentRecipe.reward);
      setRecipesCompleted((r) => r + 1);
      setShowSuccess(true);
      setMessage(`Perfect ${currentRecipe.name}! +${currentRecipe.reward} food!`);

      // Track recipe completions for achievements
      incrementAchievementStat('cookingRecipesCompleted');

      // Bonus time for completing recipes
      setTimeLeft((t) => Math.min(90, t + 10));

      setTimeout(() => {
        setShowSuccess(false);
        setMessage('');
        selectNewRecipe();
      }, 1500);
    } else {
      playSound('error');
      setMessage('Not quite right... Check the recipe!');
      setSelectedIngredients([]);
      setTimeout(() => setMessage(''), 2000);
    }
  }, [currentRecipe, selectedIngredients, gameOver]);

  const handleFinish = () => {
    playSound('success');
    updateResources({ food: resources.food + score });

    // Cooking also heals the party a bit!
    if (score > 30) {
      partyMembers.forEach((member) => {
        if (member.isAlive) {
          updatePartyMember(member.id, {
            health: Math.min(100, member.health + 10),
          });
        }
      });
    }

    setScreen('travel');
  };

  return (
    <div className="bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-lg p-4 shadow-2xl border-4 border-magic-gold">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-lg md:text-xl text-magic-gold">Remy's Kitchen!</h1>
          <p className="text-xs text-white/60">Cook delicious meals!</p>
        </div>
        <div className="text-right">
          <p className="text-white text-sm">
            Food: <span className="text-magic-gold">{score}</span>
          </p>
          <p className="text-xs text-white/60">
            Time: <span className={timeLeft < 15 ? 'text-red-400' : 'text-white'}>{timeLeft}s</span>
          </p>
        </div>
      </div>

      {/* Remy */}
      <div className="flex items-center gap-2 mb-4 p-2 bg-white/5 rounded-lg">
        <span className="text-3xl">🐀</span>
        <div className="flex-1">
          <p className="text-white text-xs">
            "Anyone can cook! Match the ingredients to make the dish!"
          </p>
          <p className="text-xs text-white/50">- Remy, from Ratatouille</p>
        </div>
        <span className="text-2xl">👨‍🍳</span>
      </div>

      {/* Current Recipe */}
      {currentRecipe && (
        <div className={`mb-4 p-3 rounded-lg border-2 ${
          showSuccess ? 'border-green-500 bg-green-500/20' : 'border-magic-gold/50 bg-white/5'
        } transition-all`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{currentRecipe.emoji}</span>
              <div>
                <p className="text-white font-bold">{currentRecipe.name}</p>
                <p className={`text-xs ${
                  currentRecipe.difficulty === 'easy' ? 'text-green-400' :
                  currentRecipe.difficulty === 'medium' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {currentRecipe.difficulty.toUpperCase()} • +{currentRecipe.reward} food
                </p>
              </div>
            </div>
          </div>

          {/* Required ingredients */}
          <div className="flex flex-wrap gap-1 mb-2">
            <span className="text-xs text-white/60 w-full">Needs:</span>
            {currentRecipe.ingredients.map((ing, i) => (
              <span
                key={i}
                className={`text-xl p-1 rounded ${
                  selectedIngredients.includes(ing) ? 'bg-green-500/30' : 'bg-white/10'
                }`}
              >
                {ing}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Selected ingredients (mixing bowl) */}
      <div className="mb-4 p-3 bg-white/5 rounded-lg min-h-[60px]">
        <p className="text-xs text-white/60 mb-2">Your mixing bowl:</p>
        <div className="flex flex-wrap gap-2 items-center">
          {selectedIngredients.length === 0 ? (
            <span className="text-white/40 text-sm">Tap ingredients to add them...</span>
          ) : (
            selectedIngredients.map((ing, i) => (
              <span
                key={i}
                onClick={() => handleIngredientClick(ing)}
                className="text-2xl cursor-pointer hover:scale-125 transition-transform"
              >
                {ing}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Available ingredients */}
      <div className="mb-4">
        <p className="text-xs text-white/60 mb-2">Available ingredients (tap to add):</p>
        <div className="grid grid-cols-5 md:grid-cols-8 gap-2">
          {availableIngredients.map((ing, i) => (
            <button
              key={i}
              onClick={() => handleIngredientClick(ing)}
              className={`text-2xl p-2 rounded-lg transition-all ${
                selectedIngredients.includes(ing)
                  ? 'bg-magic-gold/30 scale-90'
                  : 'bg-white/10 hover:bg-white/20 hover:scale-110'
              }`}
              disabled={gameOver}
            >
              {ing}
            </button>
          ))}
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-4 p-2 rounded text-center text-sm ${
          showSuccess ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
        }`}>
          {message}
        </div>
      )}

      {/* Cook button */}
      {!gameOver ? (
        <div className="flex gap-2">
          <button
            onClick={handleCook}
            disabled={selectedIngredients.length === 0}
            className="flex-1 py-3 bg-cat-orange hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-bold"
          >
            🍳 Cook It!
          </button>
          <button
            onClick={() => {
              playSound('click');
              setSelectedIngredients([]);
              shuffleIngredients();
            }}
            className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg"
          >
            🔄
          </button>
        </div>
      ) : (
        <div className="text-center p-4 bg-white/5 rounded-lg">
          <div className="text-4xl mb-2">🍽️</div>
          <h2 className="text-xl text-magic-gold mb-2">Kitchen Closed!</h2>
          <p className="text-white mb-1">You cooked {recipesCompleted} dishes!</p>
          <p className="text-white/60 text-sm mb-4">Total food: {score}</p>
          <button
            onClick={handleFinish}
            className="px-6 py-3 bg-prairie-green hover:bg-green-700 text-white rounded-lg"
          >
            Take Food to Wagon
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="mt-4 flex justify-center gap-4 text-xs text-white/50">
        <span>Recipes: {recipesCompleted}</span>
        <span>•</span>
        <span>Food: {score}</span>
      </div>

      {/* Back button */}
      {!gameOver && (
        <button
          onClick={() => {
            playSound('click');
            setScreen('travel');
          }}
          className="w-full mt-2 py-2 bg-white/10 hover:bg-white/20 text-white/70 rounded text-sm"
        >
          Leave Kitchen
        </button>
      )}
    </div>
  );
}

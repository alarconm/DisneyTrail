import { useEffect } from 'react';
import { useGameStore } from './stores/gameStore';
import MainMenu from './components/UI/MainMenu';
import PartySetup from './components/UI/PartySetup';
import ShopScreen from './components/UI/ShopScreen';
import TravelScreen from './components/UI/TravelScreen';
import EventScreen from './components/UI/EventScreen';
import LandmarkScreen from './components/UI/LandmarkScreen';
import ForagingMiniGame from './components/UI/ForagingMiniGame';
import CookingMiniGame from './components/UI/CookingMiniGame';
import DancingMiniGame from './components/UI/DancingMiniGame';
import TheaterMiniGame from './components/UI/TheaterMiniGame';
import RiverCrossing from './components/UI/RiverCrossing';
import VictoryScreen from './components/UI/VictoryScreen';
import GameOverScreen from './components/UI/GameOverScreen';
import AchievementsScreen from './components/UI/AchievementsScreen';
import KaraokeMiniGame from './components/UI/KaraokeMiniGame';
import RestScreen from './components/UI/RestScreen';
import MemoryBook from './components/UI/MemoryBook';
import MuteButton from './components/UI/MuteButton';
import { playMusic, stopMusic } from './services/audio';

function App() {
  const { currentScreen, googlyEyesMode } = useGameStore();

  // Play appropriate music based on screen
  useEffect(() => {
    switch (currentScreen) {
      case 'main-menu':
      case 'party-setup':
        playMusic('music_menu');
        break;
      case 'travel':
      case 'shop':
      case 'landmark':
      case 'rest':
        playMusic('music_travel');
        break;
      case 'victory':
        playMusic('music_victory');
        break;
      case 'hunting':
      case 'cooking':
      case 'dancing':
      case 'theater':
      case 'karaoke':
      case 'river-crossing':
        playMusic('music_minigame');
        break;
      case 'game-over':
        stopMusic();
        break;
      default:
        break;
    }
  }, [currentScreen]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'main-menu':
        return <MainMenu />;
      case 'party-setup':
        return <PartySetup />;
      case 'shop':
        return <ShopScreen />;
      case 'travel':
        return <TravelScreen />;
      case 'event':
        return <EventScreen />;
      case 'landmark':
        return <LandmarkScreen />;
      case 'hunting':
        return <ForagingMiniGame />;
      case 'cooking':
        return <CookingMiniGame />;
      case 'dancing':
        return <DancingMiniGame />;
      case 'theater':
        return <TheaterMiniGame />;
      case 'river-crossing':
        return <RiverCrossing />;
      case 'victory':
        return <VictoryScreen />;
      case 'game-over':
        return <GameOverScreen />;
      case 'achievements':
        return <AchievementsScreen />;
      case 'karaoke':
        return <KaraokeMiniGame />;
      case 'rest':
        return <RestScreen />;
      case 'memory-book':
        return <MemoryBook />;
      default:
        return <MainMenu />;
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center ${
        googlyEyesMode ? 'googly-mode' : ''
      }`}
    >
      <MuteButton />
      <div className="relative w-full max-w-4xl">
        {/* Googly eyes overlay indicator */}
        {googlyEyesMode && (
          <div className="absolute top-2 right-14 text-xs text-magic-gold animate-pulse z-50">
            GOOGLY MODE
          </div>
        )}
        {renderScreen()}
      </div>
    </div>
  );
}

export default App;

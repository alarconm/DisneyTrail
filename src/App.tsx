import { useGameStore } from './stores/gameStore';
import MainMenu from './components/UI/MainMenu';
import PartySetup from './components/UI/PartySetup';
import ShopScreen from './components/UI/ShopScreen';
import TravelScreen from './components/UI/TravelScreen';
import EventScreen from './components/UI/EventScreen';
import LandmarkScreen from './components/UI/LandmarkScreen';
import HuntingMiniGame from './components/UI/HuntingMiniGame';
import RiverCrossing from './components/UI/RiverCrossing';
import VictoryScreen from './components/UI/VictoryScreen';
import GameOverScreen from './components/UI/GameOverScreen';

function App() {
  const { currentScreen, googlyEyesMode } = useGameStore();

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
        return <HuntingMiniGame />;
      case 'river-crossing':
        return <RiverCrossing />;
      case 'victory':
        return <VictoryScreen />;
      case 'game-over':
        return <GameOverScreen />;
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
      <div className="relative w-full max-w-4xl">
        {/* Googly eyes overlay indicator */}
        {googlyEyesMode && (
          <div className="absolute top-2 right-2 text-xs text-magic-gold animate-pulse z-50">
            GOOGLY MODE ACTIVE
          </div>
        )}
        {renderScreen()}
      </div>
    </div>
  );
}

export default App;

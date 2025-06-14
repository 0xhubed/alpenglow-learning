'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { GameEngine } from '@/lib/game-engine/GameEngine';
import { GameConfig } from '@/lib/game-engine/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import useGameStore from '@/store/useGameStore';

interface Season {
  id: string;
  name: string;
  emoji: string;
  color: string;
  months: string[];
  description: string;
}

interface SeasonItem {
  id: string;
  name: string;
  emoji: string;
  season: string;
  category: 'activity' | 'weather' | 'nature' | 'clothing';
  description: string;
}

interface GameLevel {
  id: number;
  name: string;
  description: string;
  pointsPerItem: number;
  maxItems: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

const SEASONS: Season[] = [
  {
    id: 'spring',
    name: 'Frühling',
    emoji: '🌸',
    color: 'bg-green-400',
    months: ['März', 'April', 'Mai'],
    description: 'Alles blüht und wird grün'
  },
  {
    id: 'summer',
    name: 'Sommer',
    emoji: '☀️',
    color: 'bg-yellow-400',
    months: ['Juni', 'Juli', 'August'],
    description: 'Heiß und sonnig, Ferienzeit'
  },
  {
    id: 'autumn',
    name: 'Herbst',
    emoji: '🍂',
    color: 'bg-orange-400',
    months: ['September', 'Oktober', 'November'],
    description: 'Bunte Blätter fallen'
  },
  {
    id: 'winter',
    name: 'Winter',
    emoji: '❄️',
    color: 'bg-blue-400',
    months: ['Dezember', 'Januar', 'Februar'],
    description: 'Kalt und schneeig'
  }
];

const SEASON_ITEMS: SeasonItem[] = [
  // Easy level items
  { id: 'swimming', name: 'Schwimmen', emoji: '🏊', season: 'summer', category: 'activity', description: 'Im warmen Wasser plantschen' },
  { id: 'skiing', name: 'Ski fahren', emoji: '⛷️', season: 'winter', category: 'activity', description: 'Den Berg hinunter sausen' },
  { id: 'flowers', name: 'Blumen', emoji: '🌷', season: 'spring', category: 'nature', description: 'Bunte Blüten überall' },
  { id: 'leaves', name: 'Bunte Blätter', emoji: '🍁', season: 'autumn', category: 'nature', description: 'Rot und gelb gefärbte Blätter' },
  { id: 'snow', name: 'Schnee', emoji: '❄️', season: 'winter', category: 'weather', description: 'Weiße Flocken vom Himmel' },
  { id: 'sun', name: 'Sonne', emoji: '☀️', season: 'summer', category: 'weather', description: 'Heiße Sonnenstrahlen' },
  { id: 'rain', name: 'Regen', emoji: '🌧️', season: 'spring', category: 'weather', description: 'Tropfen für die Pflanzen' },
  { id: 'wind', name: 'Wind', emoji: '💨', season: 'autumn', category: 'weather', description: 'Blätter wirbeln durch die Luft' },

  // Medium level items
  { id: 'ice_cream', name: 'Glace', emoji: '🍦', season: 'summer', category: 'activity', description: 'Kühles Eis gegen die Hitze' },
  { id: 'sledding', name: 'Schlitteln', emoji: '🛷', season: 'winter', category: 'activity', description: 'Mit dem Schlitten fahren' },
  { id: 'hiking', name: 'Wandern', emoji: '🥾', season: 'spring', category: 'activity', description: 'Spazieren in der Natur' },
  { id: 'harvest', name: 'Ernte', emoji: '🍎', season: 'autumn', category: 'activity', description: 'Früchte und Gemüse sammeln' },
  { id: 'swimsuit', name: 'Badehose', emoji: '🩱', season: 'summer', category: 'clothing', description: 'Kleidung für den Strand' },
  { id: 'coat', name: 'Wintermantel', emoji: '🧥', season: 'winter', category: 'clothing', description: 'Warme Jacke gegen die Kälte' },
  { id: 'umbrella', name: 'Regenschirm', emoji: '☂️', season: 'spring', category: 'clothing', description: 'Schutz vor dem Regen' },
  { id: 'sweater', name: 'Pullover', emoji: '🧶', season: 'autumn', category: 'clothing', description: 'Warmer Strickpullover' },

  // Hard level items
  { id: 'birds', name: 'Zugvögel', emoji: '🦅', season: 'spring', category: 'nature', description: 'Vögel kehren zurück' },
  { id: 'berries', name: 'Beeren', emoji: '🫐', season: 'summer', category: 'nature', description: 'Süße Früchte im Wald' },
  { id: 'mushrooms', name: 'Pilze', emoji: '🍄', season: 'autumn', category: 'nature', description: 'Pilze wachsen im feuchten Wald' },
  { id: 'icicles', name: 'Eiszapfen', emoji: '🧊', season: 'winter', category: 'nature', description: 'Gefrorenes Wasser hängt herab' },
  { id: 'thunderstorm', name: 'Gewitter', emoji: '⛈️', season: 'summer', category: 'weather', description: 'Blitz und Donner am Himmel' },
  { id: 'fog', name: 'Nebel', emoji: '🌫️', season: 'autumn', category: 'weather', description: 'Dichter Nebel in den Tälern' },
  { id: 'frost', name: 'Frost', emoji: '🧊', season: 'winter', category: 'weather', description: 'Alles ist mit Eis bedeckt' },
  { id: 'breeze', name: 'Lauer Wind', emoji: '🌬️', season: 'spring', category: 'weather', description: 'Sanfter warmer Wind' }
];

const GAME_LEVELS: GameLevel[] = [
  { id: 1, name: 'Anfänger', description: 'Einfache Jahreszeiten-Sachen', pointsPerItem: 100, maxItems: 8, difficulty: 'easy' },
  { id: 2, name: 'Fortgeschritten', description: 'Aktivitäten und Kleidung', pointsPerItem: 150, maxItems: 8, difficulty: 'medium' },
  { id: 3, name: 'Experte', description: 'Natur und Wetter-Details', pointsPerItem: 200, maxItems: 8, difficulty: 'hard' }
];

export default function JahreszeitenRad() {
  const router = useRouter();
  const { user, updateUserPoints, completeGame, updateLeaderboard } = useGameStore();
  const [gameEngine, setGameEngine] = useState<GameEngine | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<GameLevel | null>(null);
  const [currentItems, setCurrentItems] = useState<SeasonItem[]>([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [itemsCompleted, setItemsCompleted] = useState(0);
  const [correctItems, setCorrectItems] = useState(0);
  const [selectedItem, setSelectedItem] = useState<SeasonItem | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<{ correct: boolean; item: SeasonItem; season: Season } | null>(null);
  const [wheelRotation, setWheelRotation] = useState(0);

  const gameConfig: GameConfig = {
    gameType: 'JAHRESZEITEN',
    maxLives: 3,
    basePoints: selectedLevel?.pointsPerItem || 100,
    comboMultiplier: 0.3,
    errorTolerance: 2,
    autoSaveInterval: 30000,
  };

  useEffect(() => {
    const engine = new GameEngine(gameConfig);
    
    engine.onScore((score) => {
      console.log('Score updated:', score);
    });
    
    engine.onAchievement((achievement) => {
      console.log('Achievement unlocked:', achievement);
    });
    
    setGameEngine(engine);
    
    return () => {
      engine.destroy();
    };
  }, []);

  const getFilteredItems = () => {
    if (!selectedLevel) return SEASON_ITEMS.slice(0, 8);
    
    let filtered = [...SEASON_ITEMS];
    
    if (selectedLevel.difficulty === 'easy') {
      filtered = filtered.slice(0, 8); // First 8 items
    } else if (selectedLevel.difficulty === 'medium') {
      filtered = filtered.slice(8, 16); // Items 9-16
    } else {
      filtered = filtered.slice(16, 24); // Items 17-24
    }
    
    return filtered.slice(0, selectedLevel.maxItems);
  };

  const startGame = (level: GameLevel) => {
    setSelectedLevel(level);
    const filteredItems = getFilteredItemsForLevel(level);
    setCurrentItems(shuffleArray([...filteredItems]));
    setItemsCompleted(0);
    setCorrectItems(0);
    setGameCompleted(false);
    setSelectedItem(null);
    setShowResult(false);
    setWheelRotation(0);
    
    if (gameEngine) {
      gameEngine.startGame();
      setIsGameStarted(true);
    }
  };

  const getFilteredItemsForLevel = (level: GameLevel) => {
    let filtered = [...SEASON_ITEMS];
    
    if (level.difficulty === 'easy') {
      filtered = filtered.slice(0, 8);
    } else if (level.difficulty === 'medium') {
      filtered = filtered.slice(8, 16);
    } else {
      filtered = filtered.slice(16, 24);
    }
    
    return filtered.slice(0, level.maxItems);
  };

  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleItemClick = (item: SeasonItem) => {
    if (selectedItem || showResult) return;
    setSelectedItem(item);
  };

  const handleSeasonClick = (season: Season) => {
    if (!selectedItem || showResult) return;
    
    const isCorrect = selectedItem.season === season.id;
    setLastResult({ correct: isCorrect, item: selectedItem, season });
    setShowResult(true);
    
    // Simple visual feedback - no wheel rotation needed with fixed positions
    const seasonIndex = SEASONS.findIndex(s => s.id === season.id);
    setWheelRotation(seasonIndex * 90);
    
    if (isCorrect) {
      setCorrectItems(prev => prev + 1);
      if (gameEngine) {
        gameEngine.updateScore(gameConfig.basePoints, true);
      }
      updateUserPoints(gameConfig.basePoints);
    } else {
      if (gameEngine) {
        gameEngine.updateScore(0, false);
      }
    }
    
    const newItemsCompleted = itemsCompleted + 1;
    setItemsCompleted(newItemsCompleted);
    
    setTimeout(() => {
      // Remove the item from current items
      setCurrentItems(prev => prev.filter(item => item.id !== selectedItem.id));
      setSelectedItem(null);
      setShowResult(false);
      
      if (newItemsCompleted >= (selectedLevel?.maxItems || 8)) {
        setGameCompleted(true);
        completeGame();
        updateLeaderboard();
      }
    }, 2500);
  };

  const handleBackToOverview = () => {
    router.push('/spiele');
  };

  if (!isGameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-300 via-yellow-200 to-orange-300 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="text-6xl sm:text-8xl mb-8">🌍</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Jahreszeiten-Rad</h1>
          <p className="text-lg sm:text-xl text-gray-700 mb-8">
            Wähle dein Level und ordne die Gegenstände den Jahreszeiten zu!
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {GAME_LEVELS.map((level) => (
              <motion.div
                key={level.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card 
                  isHoverable={true}
                  onClick={() => startGame(level)}
                  className="bg-white/80 backdrop-blur-sm border-gray-300 cursor-pointer hover:bg-white/90"
                >
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{level.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{level.description}</p>
                    <div className="bg-yellow-400/20 rounded-lg p-2 mb-3">
                      <p className="text-gray-800 text-sm font-bold">{level.maxItems} Gegenstände</p>
                      <p className="text-gray-600 text-xs">{level.pointsPerItem} Punkte pro Gegenstand</p>
                    </div>
                    <Button className="w-full">
                      Level {level.id} starten
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (gameCompleted && selectedLevel) {
    const totalPoints = selectedLevel.pointsPerItem * correctItems;
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-300 via-yellow-200 to-orange-300 flex items-center justify-center game-area p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white/90 backdrop-blur-sm rounded-xl p-8 max-w-2xl mx-4"
        >
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Jahreszeiten-Experte!</h1>
          <p className="text-xl text-gray-600 mb-6">
            Du hast {correctItems} von {itemsCompleted} Gegenstände richtig zugeordnet!
          </p>
          
          <div className="bg-yellow-400/20 rounded-lg p-4 mb-6">
            <p className="text-gray-800 text-lg font-bold">
              {totalPoints} Punkte erhalten! 
            </p>
            <p className="text-gray-600 text-sm">
              {selectedLevel.name} - {selectedLevel.pointsPerItem} Punkte pro richtigem Gegenstand
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => {
                setIsGameStarted(false);
                setGameCompleted(false);
                setSelectedLevel(null);
              }} 
              variant="success"
            >
              Neues Level wählen
            </Button>
            <Button onClick={handleBackToOverview} variant="secondary">
              Zurück zur Übersicht
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-300 via-yellow-200 to-orange-300 p-4 game-area">
      {/* Back Button */}
      <div className="mb-4">
        <Button
          variant="secondary"
          icon={ArrowLeft}
          onClick={handleBackToOverview}
          className="bg-white/80 backdrop-blur-sm border-gray-300 text-gray-800 hover:bg-white/90"
        >
          Zurück zur Übersicht
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="text-xl sm:text-2xl">🌍</div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Jahreszeiten-Rad</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {/* User Avatar */}
          {user && user.avatar && (
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1 sm:py-2">
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br ${user.avatar.color} flex items-center justify-center text-sm sm:text-lg`}>
                {user.avatar.emoji}
              </div>
              <span className="text-gray-800 font-semibold text-xs sm:text-sm hidden sm:block">{user.avatar.name}</span>
            </div>
          )}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-1 sm:py-2">
            <span className="text-gray-800 font-bold text-sm sm:text-base">
              {selectedLevel?.name || 'Level 1'}
            </span>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-1 sm:py-2">
            <span className="text-gray-800 font-bold text-sm sm:text-base">
              Gegenstände: {itemsCompleted}/{selectedLevel?.maxItems || 8}
            </span>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-1 sm:py-2">
            <span className="text-gray-800 font-bold text-sm sm:text-base">
              Punkte: {gameEngine?.getState().score.current || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-6"
      >
        <p className="text-gray-700 bg-white/60 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
          📱 Wähle einen Gegenstand und dann die passende Jahreszeit!
        </p>
      </motion.div>

      {/* Seasons Wheel */}
      <div className="flex justify-center mb-8">
        <div className="relative w-80 h-80 rounded-full border-4 border-white bg-white/80 backdrop-blur-sm">
          {SEASONS.map((season, index) => {
            // Position seasons in quadrants: top, right, bottom, left
            const positions = [
              { top: '10px', left: '50%', transform: 'translateX(-50%)' }, // Spring - top
              { top: '50%', right: '10px', transform: 'translateY(-50%)' }, // Summer - right  
              { bottom: '10px', left: '50%', transform: 'translateX(-50%)' }, // Autumn - bottom
              { top: '50%', left: '10px', transform: 'translateY(-50%)' }, // Winter - left
            ];
            
            return (
              <motion.div
                key={season.id}
                onClick={() => handleSeasonClick(season)}
                className={`absolute w-20 h-20 sm:w-24 sm:h-24 ${season.color} rounded-full flex flex-col items-center justify-center cursor-pointer shadow-lg z-10`}
                style={positions[index]}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  rotateZ: wheelRotation === index * 90 ? 360 : 0,
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-xl sm:text-2xl">{season.emoji}</div>
                <p className="text-white text-xs font-bold text-center">{season.name}</p>
              </motion.div>
            );
          })}
          
          {/* Center circle with seasonal info */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex flex-col items-center justify-center border-4 border-white shadow-lg">
            <div className="text-2xl sm:text-3xl">🌍</div>
            <p className="text-xs font-bold text-gray-700">Jahreszeiten</p>
          </div>
          
          {/* Decorative lines connecting center to seasons */}
          <div className="absolute inset-0">
            {[0, 90, 180, 270].map((angle, index) => (
              <div
                key={index}
                className="absolute w-0.5 h-20 bg-gray-300"
                style={{
                  top: '50%',
                  left: '50%',
                  transformOrigin: 'bottom center',
                  transform: `translateX(-50%) translateY(-100%) rotate(${angle}deg)`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Selected Item Display */}
      {selectedItem && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-6"
        >
          <div className="bg-blue-500 text-white rounded-lg p-4 inline-block">
            <div className="text-4xl mb-2">{selectedItem.emoji}</div>
            <p className="font-bold">{selectedItem.name}</p>
            <p className="text-sm">{selectedItem.description}</p>
          </div>
        </motion.div>
      )}

      {/* Available Items */}
      <div className="mb-8">
        <h3 className="text-center text-lg font-bold text-gray-800 mb-4">Wähle einen Gegenstand:</h3>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 px-4">
          {currentItems.map((item) => (
            <motion.div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`cursor-pointer p-3 rounded-lg border-2 ${
                selectedItem?.id === item.id 
                  ? 'border-blue-500 bg-blue-100' 
                  : 'border-gray-300 bg-white hover:bg-gray-50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{item.emoji}</div>
                <p className="text-sm font-bold text-gray-800">{item.name}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Result Display */}
      <AnimatePresence>
        {showResult && lastResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center mb-6"
          >
            <div className={`inline-block px-6 py-3 rounded-lg text-white font-bold text-xl ${
              lastResult.correct ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {lastResult.correct ? (
                <>
                  🎉 Richtig! {lastResult.item.name} gehört zum {lastResult.season.name}!
                </>
              ) : (
                <>
                  💪 Nicht ganz! {lastResult.item.name} gehört eigentlich zu einer anderen Jahreszeit.
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      {selectedLevel && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-80">
          <div className="bg-white/80 rounded-full h-4 overflow-hidden">
            <motion.div
              className="h-full bg-green-500"
              initial={{ width: 0 }}
              animate={{ width: `${(itemsCompleted / selectedLevel.maxItems) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-center text-gray-800 text-sm mt-2">
            {itemsCompleted} von {selectedLevel.maxItems} Gegenstände zugeordnet
          </p>
        </div>
      )}
    </div>
  );
}
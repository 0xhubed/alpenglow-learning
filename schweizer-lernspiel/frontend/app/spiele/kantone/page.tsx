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

interface Canton {
  id: string;
  name: string;
  capital: string;
  color: string;
  shape: string;
  flag: string;
  landmark: string;
  description: string;
}

interface PuzzlePiece {
  id: string;
  canton: Canton;
  position: { x: number; y: number };
  isPlaced: boolean;
  isCorrect: boolean;
}

interface GameLevel {
  id: number;
  name: string;
  description: string;
  pointsPerCanton: number;
  maxCantons: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

const CANTONS: Canton[] = [
  // Easy level cantons (large, well-known)
  { 
    id: 'zurich', name: 'Zürich', capital: 'Zürich', color: 'bg-blue-500', 
    shape: '🟦', flag: '🏳️‍⚪', landmark: '🏛️', 
    description: 'Größte Stadt der Schweiz mit vielen Banken'
  },
  { 
    id: 'bern', name: 'Bern', capital: 'Bern', color: 'bg-yellow-600', 
    shape: '🟨', flag: '🐻', landmark: '🏛️', 
    description: 'Hauptstadt der Schweiz mit dem berühmten Bären'
  },
  { 
    id: 'geneva', name: 'Genf', capital: 'Genf', color: 'bg-red-500', 
    shape: '🟥', flag: '⚰️', landmark: '⛲', 
    description: 'Stadt am Genfersee mit der UN'
  },
  { 
    id: 'basel', name: 'Basel-Stadt', capital: 'Basel', color: 'bg-purple-500', 
    shape: '🟪', flag: '🏴‍☠️', landmark: '🏭', 
    description: 'Stadt am Rhein, bekannt für Chemie'
  },
  
  // Medium level cantons
  { 
    id: 'valais', name: 'Wallis', capital: 'Sitten', color: 'bg-green-600', 
    shape: '🟩', flag: '⭐', landmark: '🏔️', 
    description: 'Kanton mit dem Matterhorn'
  },
  { 
    id: 'vaud', name: 'Waadt', capital: 'Lausanne', color: 'bg-teal-500', 
    shape: '🔷', flag: '🌿', landmark: '🍇', 
    description: 'Weinregion am Genfersee'
  },
  { 
    id: 'ticino', name: 'Tessin', capital: 'Bellinzona', color: 'bg-orange-500', 
    shape: '🔶', flag: '🌴', landmark: '☀️', 
    description: 'Italienischsprachiger Kanton im Süden'
  },
  { 
    id: 'grisons', name: 'Graubünden', capital: 'Chur', color: 'bg-indigo-500', 
    shape: '🔹', flag: '🦌', landmark: '🎿', 
    description: 'Größter Kanton mit vielen Skigebieten'
  },
  
  // Hard level cantons (smaller)
  { 
    id: 'appenzell', name: 'Appenzell', capital: 'Appenzell', color: 'bg-pink-500', 
    shape: '💎', flag: '🐄', landmark: '🧀', 
    description: 'Kleinster Kanton, bekannt für Käse'
  },
  { 
    id: 'nidwalden', name: 'Nidwalden', capital: 'Stans', color: 'bg-cyan-500', 
    shape: '💠', flag: '🦅', landmark: '🌊', 
    description: 'Kleiner Kanton in der Zentralschweiz'
  },
  { 
    id: 'schwyz', name: 'Schwyz', capital: 'Schwyz', color: 'bg-red-600', 
    shape: '♦️', flag: '✝️', landmark: '🏕️', 
    description: 'Urkanton der Schweiz'
  },
  { 
    id: 'glarus', name: 'Glarus', capital: 'Glarus', color: 'bg-emerald-500', 
    shape: '🔰', flag: '🌲', landmark: '⛰️', 
    description: 'Bergkanton mit steilen Hängen'
  }
];

const GAME_LEVELS: GameLevel[] = [
  { id: 1, name: 'Anfänger', description: 'Große bekannte Kantone', pointsPerCanton: 120, maxCantons: 4, difficulty: 'easy' },
  { id: 2, name: 'Fortgeschritten', description: 'Mittlere Kantone', pointsPerCanton: 180, maxCantons: 4, difficulty: 'medium' },
  { id: 3, name: 'Experte', description: 'Kleine schwierige Kantone', pointsPerCanton: 250, maxCantons: 4, difficulty: 'hard' }
];

export default function KantonePuzzle() {
  const router = useRouter();
  const { user, updateUserPoints, completeGame, updateLeaderboard } = useGameStore();
  const [gameEngine, setGameEngine] = useState<GameEngine | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<GameLevel | null>(null);
  const [puzzlePieces, setPuzzlePieces] = useState<PuzzlePiece[]>([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [cantonsCompleted, setCantonsCompleted] = useState(0);
  const [correctCantons, setCorrectCantons] = useState(0);
  const [selectedPiece, setSelectedPiece] = useState<PuzzlePiece | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [currentHintCanton, setCurrentHintCanton] = useState<Canton | null>(null);

  const gameConfig: GameConfig = {
    gameType: 'KANTONE',
    maxLives: 5,
    basePoints: selectedLevel?.pointsPerCanton || 120,
    comboMultiplier: 0.4,
    errorTolerance: 3,
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

  const getFilteredCantons = () => {
    if (!selectedLevel) return CANTONS.slice(0, 4);
    
    let filtered = [...CANTONS];
    
    if (selectedLevel.difficulty === 'easy') {
      filtered = filtered.slice(0, 4); // First 4 cantons
    } else if (selectedLevel.difficulty === 'medium') {
      filtered = filtered.slice(4, 8); // Cantons 5-8
    } else {
      filtered = filtered.slice(8, 12); // Cantons 9-12
    }
    
    return filtered.slice(0, selectedLevel.maxCantons);
  };

  const startGame = (level: GameLevel) => {
    setSelectedLevel(level);
    const filteredCantons = getFilteredCantonsForLevel(level);
    
    // Create puzzle pieces
    const pieces: PuzzlePiece[] = filteredCantons.map((canton, index) => ({
      id: canton.id,
      canton,
      position: { 
        x: 50 + (index % 3) * 120, 
        y: 400 + Math.floor(index / 3) * 100 
      },
      isPlaced: false,
      isCorrect: false
    }));
    
    setPuzzlePieces(pieces);
    setCantonsCompleted(0);
    setCorrectCantons(0);
    setGameCompleted(false);
    setSelectedPiece(null);
    setShowHint(false);
    
    if (gameEngine) {
      gameEngine.startGame();
      setIsGameStarted(true);
    }
  };

  const getFilteredCantonsForLevel = (level: GameLevel) => {
    let filtered = [...CANTONS];
    
    if (level.difficulty === 'easy') {
      filtered = filtered.slice(0, 4);
    } else if (level.difficulty === 'medium') {
      filtered = filtered.slice(4, 8);
    } else {
      filtered = filtered.slice(8, 12);
    }
    
    return filtered.slice(0, level.maxCantons);
  };

  const handlePieceClick = (piece: PuzzlePiece) => {
    if (piece.isPlaced) return;
    setSelectedPiece(selectedPiece?.id === piece.id ? null : piece);
  };

  const handleMapClick = (cantonId: string) => {
    if (!selectedPiece) return;
    
    const isCorrect = selectedPiece.canton.id === cantonId;
    
    if (isCorrect) {
      // Correct placement
      setPuzzlePieces(prev => prev.map(piece => 
        piece.id === selectedPiece.id 
          ? { ...piece, isPlaced: true, isCorrect: true }
          : piece
      ));
      
      setCorrectCantons(prev => prev + 1);
      setSelectedPiece(null);
      
      if (gameEngine) {
        gameEngine.updateScore(gameConfig.basePoints, true);
      }
      updateUserPoints(gameConfig.basePoints);
      
      const newCompleted = cantonsCompleted + 1;
      setCantonsCompleted(newCompleted);
      
      if (newCompleted >= (selectedLevel?.maxCantons || 4)) {
        setTimeout(() => {
          setGameCompleted(true);
          completeGame();
          updateLeaderboard();
        }, 1000);
      }
    } else {
      // Incorrect placement
      if (gameEngine) {
        gameEngine.updateScore(0, false);
      }
      // Visual feedback for wrong placement could be added here
    }
  };

  const showCantonHint = (canton: Canton) => {
    setCurrentHintCanton(canton);
    setShowHint(true);
  };

  const handleBackToOverview = () => {
    router.push('/spiele');
  };

  if (!isGameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-400 via-white to-red-400 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="text-6xl sm:text-8xl mb-8">🗺️</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Kantone-Puzzle</h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8">
            Wähle dein Level und setze die Schweizer Kantone zusammen!
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
                    <div className="bg-red-400/20 rounded-lg p-2 mb-3">
                      <p className="text-gray-800 text-sm font-bold">{level.maxCantons} Kantone</p>
                      <p className="text-gray-600 text-xs">{level.pointsPerCanton} Punkte pro Kanton</p>
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
    const totalPoints = selectedLevel.pointsPerCanton * correctCantons;
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-400 via-white to-red-400 flex items-center justify-center game-area p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white/90 backdrop-blur-sm rounded-xl p-8 max-w-2xl mx-4"
        >
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Puzzle gelöst!</h1>
          <p className="text-xl text-gray-600 mb-6">
            Du hast {correctCantons} von {cantonsCompleted} Kantone richtig platziert!
          </p>
          
          <div className="bg-red-400/20 rounded-lg p-4 mb-6">
            <p className="text-gray-800 text-lg font-bold">
              {totalPoints} Punkte erhalten! 
            </p>
            <p className="text-gray-600 text-sm">
              {selectedLevel.name} - {selectedLevel.pointsPerCanton} Punkte pro richtigem Kanton
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
    <div className="min-h-screen bg-gradient-to-b from-red-400 via-white to-red-400 p-4 game-area">
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
          <div className="text-xl sm:text-2xl">🗺️</div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Kantone-Puzzle</h1>
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
              Kantone: {cantonsCompleted}/{selectedLevel?.maxCantons || 4}
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
          📱 Wähle einen Kanton aus und klicke dann auf die richtige Stelle auf der Karte!
        </p>
      </motion.div>

      {/* Swiss Map (Simplified) */}
      <div className="flex justify-center mb-8">
        <div className="relative bg-white/90 backdrop-blur-sm rounded-lg p-6 w-full max-w-lg border-2 border-gray-300">
          <h3 className="text-center text-lg font-bold text-gray-800 mb-4">🗺️ Schweizer Karte</h3>
          <p className="text-center text-sm text-gray-600 mb-4">Klicke auf ein Feld um den gewählten Kanton zu platzieren</p>
          
          {/* Map regions with better visibility */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {getFilteredCantons().map((canton, index) => {
              const piece = puzzlePieces.find(p => p.canton.id === canton.id);
              return (
                <motion.div
                  key={canton.id}
                  onClick={() => handleMapClick(canton.id)}
                  className={`h-24 sm:h-28 border-4 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                    piece?.isPlaced 
                      ? `${canton.color} border-green-500 text-white shadow-lg` 
                      : selectedPiece 
                        ? 'bg-blue-50 border-blue-400 border-dashed hover:bg-blue-100' 
                        : 'bg-gray-100 border-gray-400 border-dashed hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  animate={{
                    borderColor: selectedPiece ? '#3b82f6' : piece?.isPlaced ? '#10b981' : '#9ca3af'
                  }}
                >
                  {piece?.isPlaced ? (
                    <div className="text-center">
                      <div className="text-3xl mb-1">{canton.shape}</div>
                      <p className="text-xs font-bold">{canton.name}</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-3xl mb-1">📍</div>
                      <p className="text-xs text-gray-600 font-medium">Platz {index + 1}</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
          
          {/* Map legend */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-100 border-2 border-dashed border-gray-400 rounded"></div>
                <span>Leer</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-50 border-2 border-blue-400 rounded"></div>
                <span>Auswahl aktiv</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 border-2 border-green-500 rounded"></div>
                <span>Platziert</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Puzzle Pieces */}
      <div className="mb-8">
        <h3 className="text-center text-lg font-bold text-gray-800 mb-4">Wähle einen Kanton:</h3>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 px-4">
          {puzzlePieces.filter(piece => !piece.isPlaced).map((piece) => (
            <motion.div
              key={piece.id}
              onClick={() => handlePieceClick(piece)}
              className={`cursor-pointer p-3 rounded-lg border-2 ${
                selectedPiece?.id === piece.id 
                  ? 'border-blue-500 bg-blue-100' 
                  : 'border-gray-300 bg-white hover:bg-gray-50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{piece.canton.shape}</div>
                <p className="text-sm font-bold text-gray-800">{piece.canton.name}</p>
                <p className="text-xs text-gray-600">{piece.canton.capital}</p>
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    showCantonHint(piece.canton);
                  }}
                  className="mt-2"
                >
                  💡 Tipp
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hint Display */}
      <AnimatePresence>
        {showHint && currentHintCanton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowHint(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg p-6 max-w-md mx-4"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">{currentHintCanton.landmark}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{currentHintCanton.name}</h3>
                <p className="text-gray-600 mb-4">{currentHintCanton.description}</p>
                <p className="text-sm text-gray-500 mb-4">
                  Hauptstadt: {currentHintCanton.capital}
                </p>
                <Button onClick={() => setShowHint(false)}>
                  Verstanden!
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      {selectedLevel && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-80">
          <div className="bg-white/80 rounded-full h-4 overflow-hidden">
            <motion.div
              className="h-full bg-red-500"
              initial={{ width: 0 }}
              animate={{ width: `${(cantonsCompleted / selectedLevel.maxCantons) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-center text-gray-800 text-sm mt-2">
            {cantonsCompleted} von {selectedLevel.maxCantons} Kantone platziert
          </p>
        </div>
      )}
    </div>
  );
}
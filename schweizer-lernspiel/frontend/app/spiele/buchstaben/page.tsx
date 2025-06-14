'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { GameEngine } from '@/lib/game-engine/GameEngine';
import { GameConfig } from '@/lib/game-engine/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import useGameStore from '@/store/useGameStore';

interface Letter {
  id: string;
  letter: string;
  position: { x: number; y: number };
  isDragging: boolean;
  isMatched: boolean;
}

interface WordChallenge {
  word: string;
  image: string;
  letters: string[];
  description: string;
}

const WORD_CHALLENGES: WordChallenge[] = [
  {
    word: 'BERG',
    image: '🎿',
    letters: ['B', 'E', 'R', 'G'],
    description: 'Hier fahren die Schweizer Ski. Es ist sehr hoch und hat Schnee.'
  },
  {
    word: 'BAUM',
    image: '🍂',
    letters: ['B', 'A', 'U', 'M'],
    description: 'Er hat Äste und Blätter. Im Herbst werden sie bunt.'
  },
  {
    word: 'HUND',
    image: '🦴',
    letters: ['H', 'U', 'N', 'D'],
    description: 'Mein bester Freund bellt und mag Knochen.'
  },
  {
    word: 'BROT',
    image: '🍞',
    letters: ['B', 'R', 'O', 'T'],
    description: 'Ich esse es zum Frühstück mit Butter und Marmelade.'
  },
  {
    word: 'FISCH',
    image: '🎣',
    letters: ['F', 'I', 'S', 'C', 'H'],
    description: 'Er schwimmt im Wasser. Man kann ihn mit der Angel fangen.'
  },
  {
    word: 'BALL',
    image: '⚽',
    letters: ['B', 'A', 'L', 'L'],
    description: 'Er ist rund. Man kann damit Fußball spielen.'
  },
  {
    word: 'AUTO',
    image: '🚗',
    letters: ['A', 'U', 'T', 'O'],
    description: 'Es hat vier Räder und fährt auf der Straße.'
  },
  {
    word: 'APFEL',
    image: '🍎',
    letters: ['A', 'P', 'F', 'E', 'L'],
    description: 'Er ist rot oder grün. Er wächst am Baum und ist gesund.'
  }
];

const DISTRACTORS = ['X', 'Y', 'Q', 'W', 'P', 'F', 'J', 'V'];

interface GameLevel {
  id: number;
  name: string;
  description: string;
  pointsPerWord: number;
  maxWords: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

const GAME_LEVELS: GameLevel[] = [
  { id: 1, name: 'Anfänger', description: '4-5 Buchstaben Wörter', pointsPerWord: 50, maxWords: 6, difficulty: 'easy' },
  { id: 2, name: 'Fortgeschritten', description: '5-6 Buchstaben Wörter', pointsPerWord: 75, maxWords: 8, difficulty: 'medium' },
  { id: 3, name: 'Experte', description: 'Alle Wörter', pointsPerWord: 100, maxWords: 8, difficulty: 'hard' }
];

export default function BuchstabenBerg() {
  const router = useRouter();
  const { user, updateUserPoints, completeGame, updateLeaderboard } = useGameStore();
  const [gameEngine, setGameEngine] = useState<GameEngine | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<GameLevel | null>(null);
  const [currentChallenge, setCurrentChallenge] = useState<WordChallenge>(WORD_CHALLENGES[0]);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [availableLetters, setAvailableLetters] = useState<Letter[]>([]);
  const [wordSlots, setWordSlots] = useState<(Letter | null)[]>([]);
  const [draggedLetter, setDraggedLetter] = useState<Letter | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const gameConfig: GameConfig = {
    gameType: 'BUCHSTABEN',
    maxLives: 5,
    basePoints: selectedLevel?.pointsPerWord || 50,
    comboMultiplier: 0.2,
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
    
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      engine.destroy();
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    if (isGameStarted) {
      setupChallenge();
    }
  }, [currentChallenge, isGameStarted]);

  const getFilteredChallenges = useCallback(() => {
    if (!selectedLevel) return WORD_CHALLENGES.slice(0, 6);
    
    let filtered = [...WORD_CHALLENGES];
    
    if (selectedLevel.difficulty === 'easy') {
      // 4-5 letter words
      filtered = filtered.filter(challenge => challenge.word.length <= 5);
    } else if (selectedLevel.difficulty === 'medium') {
      // 5-6 letter words  
      filtered = filtered.filter(challenge => challenge.word.length >= 4 && challenge.word.length <= 6);
    }
    // For 'hard' difficulty, use all words
    
    return filtered.slice(0, selectedLevel.maxWords);
  }, [selectedLevel]);

  const setupChallenge = useCallback(() => {
    const challenge = currentChallenge;
    const letters = [...challenge.letters];
    
    // Add some distractors
    const numDistractors = Math.min(3, DISTRACTORS.length);
    const shuffledDistractors = [...DISTRACTORS].sort(() => Math.random() - 0.5);
    const selectedDistractors = shuffledDistractors.slice(0, numDistractors);
    
    letters.push(...selectedDistractors);
    
    // Shuffle all letters
    const shuffledLetters = letters.sort(() => Math.random() - 0.5);
    
    // Create letter objects with random positions
    const letterObjects: Letter[] = shuffledLetters.map((letter, index) => ({
      id: `letter-${index}`,
      letter,
      position: { 
        x: 50 + (index % 4) * 120, 
        y: 400 + Math.floor(index / 4) * 80 
      },
      isDragging: false,
      isMatched: false,
    }));
    
    setAvailableLetters(letterObjects);
    setWordSlots(new Array(challenge.word.length).fill(null));
    setShowHint(false);
    setShowSuccess(false);
  }, [currentChallenge]);

  const startGame = (level: GameLevel) => {
    setSelectedLevel(level);
    const filteredChallenges = getFilteredChallengesForLevel(level);
    setCurrentChallenge(filteredChallenges[0]);
    setChallengeIndex(0);
    setWordsCompleted(0);
    setGameCompleted(false);
    
    if (gameEngine) {
      gameEngine.startGame();
      setIsGameStarted(true);
    }
  };

  const getFilteredChallengesForLevel = (level: GameLevel) => {
    let filtered = [...WORD_CHALLENGES];
    
    if (level.difficulty === 'easy') {
      filtered = filtered.filter(challenge => challenge.word.length <= 5);
    } else if (level.difficulty === 'medium') {
      filtered = filtered.filter(challenge => challenge.word.length >= 4 && challenge.word.length <= 6);
    }
    
    return filtered.slice(0, level.maxWords);
  };

  const handleDragStart = (letter: Letter) => {
    setDraggedLetter(letter);
    setAvailableLetters(prev => 
      prev.map(l => l.id === letter.id ? { ...l, isDragging: true } : l)
    );
  };

  const handleDragEnd = () => {
    setDraggedLetter(null);
    setAvailableLetters(prev => 
      prev.map(l => ({ ...l, isDragging: false }))
    );
  };

  const handleLetterClick = (letter: Letter) => {
    if (isMobile) {
      setSelectedLetter(letter);
      setSelectedSlotIndex(null);
    }
  };

  const handleSlotClick = (slotIndex: number) => {
    if (isMobile && selectedLetter) {
      placeLetter(selectedLetter, slotIndex);
      setSelectedLetter(null);
    } else if (isMobile && !selectedLetter && wordSlots[slotIndex]) {
      // Allow removing letter from slot
      const removedLetter = wordSlots[slotIndex]!;
      const newWordSlots = [...wordSlots];
      newWordSlots[slotIndex] = null;
      setWordSlots(newWordSlots);
      
      // Add letter back to available letters
      setAvailableLetters(prev => [...prev, removedLetter]);
    }
  };

  const placeLetter = (letter: Letter, slotIndex: number) => {
    const expectedLetter = currentChallenge.letters[slotIndex];
    const isCorrect = letter.letter === expectedLetter;
    
    if (isCorrect) {
      // Correct placement
      const newWordSlots = [...wordSlots];
      newWordSlots[slotIndex] = letter;
      setWordSlots(newWordSlots);
      
      // Remove letter from available letters
      setAvailableLetters(prev => 
        prev.filter(l => l.id !== letter.id)
      );
      
      // Update score
      if (gameEngine) {
        gameEngine.updateScore(gameConfig.basePoints, true);
      }
      
      // Update user points in global store
      updateUserPoints(gameConfig.basePoints);
      
      // Check if word is complete
      const isWordComplete = newWordSlots.every(slot => slot !== null);
      if (isWordComplete) {
        setShowSuccess(true);
        const newWordsCompleted = wordsCompleted + 1;
        setWordsCompleted(newWordsCompleted);
        
        setTimeout(() => {
          if (newWordsCompleted >= (selectedLevel?.maxWords || 6)) {
            // Game completed
            setGameCompleted(true);
            completeGame();
            updateLeaderboard();
          } else {
            nextChallenge();
          }
        }, 2000);
      }
    } else {
      // Incorrect placement
      if (gameEngine) {
        gameEngine.updateScore(0, false);
      }
    }
  };

  const handleSlotDrop = (slotIndex: number) => {
    if (!draggedLetter) return;
    
    placeLetter(draggedLetter, slotIndex);
    handleDragEnd();
  };

  const nextChallenge = () => {
    if (!selectedLevel) return;
    
    const filteredChallenges = getFilteredChallengesForLevel(selectedLevel);
    const nextIndex = challengeIndex + 1;
    
    if (nextIndex < filteredChallenges.length) {
      setChallengeIndex(nextIndex);
      setCurrentChallenge(filteredChallenges[nextIndex]);
      
      if (gameEngine) {
        gameEngine.nextLevel();
      }
    }
  };

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  const handleBackToOverview = () => {
    router.push('/spiele');
  };

  if (!isGameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-400 via-blue-300 to-green-300 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="text-6xl sm:text-8xl mb-8">🏔️</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Buchstaben-Berg</h1>
          <p className="text-lg sm:text-xl text-white mb-8">
            Wähle dein Level und bilde Wörter!
          </p>
          
          {/* Level Selection */}
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
                  className="bg-white/20 backdrop-blur-sm border-white/30 cursor-pointer hover:bg-white/30"
                >
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">{level.name}</h3>
                    <p className="text-white/80 text-sm mb-3">{level.description}</p>
                    <div className="bg-yellow-400/20 rounded-lg p-2 mb-3">
                      <p className="text-white text-sm font-bold">{level.maxWords} Wörter</p>
                      <p className="text-white text-xs">{level.pointsPerWord} Punkte pro Wort</p>
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
    const totalPoints = selectedLevel.pointsPerWord * wordsCompleted;
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-400 via-blue-300 to-green-300 flex items-center justify-center game-area p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-2xl mx-4"
        >
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold text-white mb-4">Level geschafft!</h1>
          <p className="text-xl text-white mb-6">
            Du hast alle {wordsCompleted} Wörter richtig gebildet!
          </p>
          
          <div className="bg-yellow-400/20 rounded-lg p-4 mb-6">
            <p className="text-white text-lg font-bold">
              {totalPoints} Punkte erhalten! 
            </p>
            <p className="text-white/80 text-sm">
              {selectedLevel.name} - {selectedLevel.pointsPerWord} Punkte pro Wort
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
    <div className="min-h-screen bg-gradient-to-b from-blue-400 via-blue-300 to-green-300 p-4 game-area">
      {/* Back Button */}
      <div className="mb-4">
        <Button
          variant="secondary"
          icon={ArrowLeft}
          onClick={handleBackToOverview}
          className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
        >
          Zurück zur Übersicht
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="text-xl sm:text-2xl">🏔️</div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Buchstaben-Berg</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {/* User Avatar */}
          {user && user.avatar && (
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1 sm:py-2">
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br ${user.avatar.color} flex items-center justify-center text-sm sm:text-lg`}>
                {user.avatar.emoji}
              </div>
              <span className="text-white font-semibold text-xs sm:text-sm hidden sm:block">{user.avatar.name}</span>
            </div>
          )}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-1 sm:py-2">
            <span className="text-white font-bold text-sm sm:text-base">
              {selectedLevel?.name || 'Level 1'}
            </span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-1 sm:py-2">
            <span className="text-white font-bold text-sm sm:text-base">
              Wörter: {wordsCompleted}/{selectedLevel?.maxWords || 6}
            </span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-1 sm:py-2">
            <span className="text-white font-bold text-sm sm:text-base">
              Punkte: {gameEngine?.getState().score.current || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div ref={gameAreaRef} className="relative">
        {/* Word Challenge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-6xl mb-4">{currentChallenge.image}</div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 inline-block">
            <p className="text-white text-lg">{currentChallenge.description}</p>
          </div>
        </motion.div>

        {/* Mobile Instructions */}
        {isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-4"
          >
            <p className="text-white bg-blue-500/50 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
              📱 Tippe auf einen Buchstaben und dann auf das richtige Feld!
            </p>
          </motion.div>
        )}

        {/* Word Slots */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {wordSlots.map((slot, index) => (
            <motion.div
              key={index}
              className={`w-16 h-16 sm:w-20 sm:h-20 border-2 border-white border-dashed rounded-lg flex items-center justify-center bg-white/10 backdrop-blur-sm cursor-pointer ${
                isMobile && selectedLetter ? 'hover:bg-white/20' : ''
              }`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleSlotDrop(index)}
              onClick={() => handleSlotClick(index)}
              whileHover={{ scale: 1.05 }}
              animate={{ 
                borderColor: slot ? '#10b981' : '#ffffff',
                backgroundColor: isMobile && selectedLetter ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'
              }}
            >
              {slot && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-full h-full bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-xl sm:text-2xl"
                >
                  {slot.letter}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Available Letters */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 px-4">
          {availableLetters.map((letter) => (
            <motion.div
              key={letter.id}
              draggable={!isMobile}
              onDragStart={() => !isMobile && handleDragStart(letter)}
              onDragEnd={() => !isMobile && handleDragEnd()}
              onClick={() => handleLetterClick(letter)}
              className={`cursor-pointer w-14 h-14 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center text-black font-bold text-xl sm:text-2xl ${
                letter.isDragging ? 'opacity-50' : ''
              } ${
                selectedLetter?.id === letter.id 
                  ? 'bg-orange-400 ring-4 ring-orange-300' 
                  : 'bg-yellow-400 hover:bg-yellow-300'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                rotate: letter.isDragging ? 5 : 0,
                scale: letter.isDragging || selectedLetter?.id === letter.id ? 0.9 : 1
              }}
            >
              {letter.letter}
            </motion.div>
          ))}
        </div>

        {/* Hint Button */}
        <div className="flex justify-center mb-4">
          <Button
            onClick={toggleHint}
            className="bg-purple-500 hover:bg-purple-600"
          >
            💡 Tipp {showHint ? 'verstecken' : 'anzeigen'}
          </Button>
        </div>

        {/* Hint Display */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="bg-purple-500/80 backdrop-blur-sm rounded-lg p-4 inline-block">
                <p className="text-white text-lg mb-2">
                  💡 <strong>Tipp:</strong> Das Wort beginnt mit dem Buchstaben <strong>{currentChallenge.word[0]}</strong>
                </p>
                <p className="text-white text-sm">
                  Es hat {currentChallenge.word.length} Buchstaben: {currentChallenge.word.split('').join(' - ')}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Animation */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            >
              <div className="bg-white rounded-lg p-8 text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-green-600 mb-2">
                  Sehr gut gemacht!
                </h2>
                <p className="text-lg text-gray-600">
                  Du hast das Wort richtig gebildet!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Bar */}
      {selectedLevel && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-80">
          <div className="bg-white/20 rounded-full h-4 overflow-hidden">
            <motion.div
              className="h-full bg-yellow-400"
              initial={{ width: 0 }}
              animate={{ width: `${(wordsCompleted / selectedLevel.maxWords) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-center text-white text-sm mt-2">
            {wordsCompleted} von {selectedLevel.maxWords} Wörtern geschafft
          </p>
        </div>
      )}
    </div>
  );
}
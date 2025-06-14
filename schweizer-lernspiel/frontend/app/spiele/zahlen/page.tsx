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

interface MathProblem {
  id: string;
  expression: string;
  answer: number;
  options: number[];
  type: 'addition' | 'subtraction' | 'counting';
  visual?: string;
}

interface TrainCar {
  id: string;
  number: number;
  isCorrect: boolean;
  isSelected: boolean;
  position: number;
}

interface GameLevel {
  id: number;
  name: string;
  description: string;
  pointsPerProblem: number;
  maxProblems: number;
  maxNumber: number;
}

const GAME_LEVELS: GameLevel[] = [
  { id: 1, name: 'Anfänger', description: 'Zahlen 1-10, einfache Aufgaben', pointsPerProblem: 100, maxProblems: 6, maxNumber: 10 },
  { id: 2, name: 'Fortgeschritten', description: 'Zahlen 1-20, mittlere Aufgaben', pointsPerProblem: 150, maxProblems: 8, maxNumber: 20 },
  { id: 3, name: 'Experte', description: 'Zahlen 1-30, schwere Aufgaben', pointsPerProblem: 200, maxProblems: 10, maxNumber: 30 }
];

export default function ZahlenExpress() {
  const router = useRouter();
  const { user, updateUserPoints, completeGame, updateLeaderboard } = useGameStore();
  const [gameEngine, setGameEngine] = useState<GameEngine | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<GameLevel | null>(null);
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [trainCars, setTrainCars] = useState<TrainCar[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [problemsCompleted, setProblemsCompleted] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const gameConfig: GameConfig = {
    gameType: 'ZAHLEN',
    maxLives: 5,
    basePoints: selectedLevel?.pointsPerProblem || 100,
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
    
    engine.onLevel((level) => {
      // Level management now handled by our system
    });
    
    setGameEngine(engine);
    
    return () => {
      engine.destroy();
    };
  }, []);

  useEffect(() => {
    if (isGameStarted && !currentProblem && selectedLevel) {
      generateProblem();
    }
  }, [isGameStarted, selectedLevel]);

  const generateProblem = () => {
    if (!selectedLevel) return;
    
    let problem: MathProblem;
    const maxNum = selectedLevel.maxNumber;

    if (selectedLevel.id === 1) {
      // Easy: Simple counting and addition
      problem = generateSimpleProblem(maxNum);
    } else if (selectedLevel.id === 2) {
      // Medium: Addition and subtraction
      problem = Math.random() > 0.5 ? generateAdditionProblem(maxNum) : generateSubtractionProblem(maxNum);
    } else {
      // Hard: Mixed operations
      problem = generateMixedProblem(maxNum);
    }

    setCurrentProblem(problem);
    generateTrainCars(problem);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowHint(false);
  };

  const generateSimpleProblem = (maxNum: number = 10): MathProblem => {
    const type = Math.random() < 0.7 ? 'counting' : 'addition';
    
    if (type === 'counting') {
      const count = Math.floor(Math.random() * Math.min(maxNum, 10)) + 1;
      const visual = '🟦'.repeat(count);
      return {
        id: 'counting-' + Date.now(),
        expression: `Wie viele Blöcke siehst du?`,
        answer: count,
        options: generateOptions(count, 1, maxNum),
        type: 'counting',
        visual,
      };
    } else {
      const a = Math.floor(Math.random() * Math.min(maxNum / 2, 5)) + 1;
      const b = Math.floor(Math.random() * Math.min(maxNum / 2, 5)) + 1;
      return {
        id: 'addition-' + Date.now(),
        expression: `${a} + ${b}`,
        answer: a + b,
        options: generateOptions(a + b, 1, maxNum),
        type: 'addition',
      };
    }
  };

  const generateAdditionProblem = (max: number): MathProblem => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * (max - a)) + 1;
    return {
      id: 'addition-' + Date.now(),
      expression: `${a} + ${b}`,
      answer: a + b,
      options: generateOptions(a + b, 1, max),
      type: 'addition',
    };
  };

  const generateSubtractionProblem = (max: number): MathProblem => {
    const a = Math.floor(Math.random() * max) + 5;
    const b = Math.floor(Math.random() * a) + 1;
    return {
      id: 'subtraction-' + Date.now(),
      expression: `${a} - ${b}`,
      answer: a - b,
      options: generateOptions(a - b, 0, max),
      type: 'subtraction',
    };
  };

  const generateMixedProblem = (max: number): MathProblem => {
    const isAddition = Math.random() < 0.6;
    
    if (isAddition) {
      return generateAdditionProblem(max);
    } else {
      return generateSubtractionProblem(max);
    }
  };

  const generateOptions = (correctAnswer: number, min: number, max: number): number[] => {
    const options = [correctAnswer];
    
    while (options.length < 4) {
      const option = Math.floor(Math.random() * (max - min + 1)) + min;
      if (!options.includes(option)) {
        options.push(option);
      }
    }
    
    return options.sort(() => Math.random() - 0.5);
  };

  const generateTrainCars = (problem: MathProblem) => {
    const cars: TrainCar[] = problem.options.map((num, index) => ({
      id: `car-${index}`,
      number: num,
      isCorrect: num === problem.answer,
      isSelected: false,
      position: index,
    }));
    
    setTrainCars(cars);
  };

  const startGame = (level: GameLevel) => {
    setSelectedLevel(level);
    setProblemsCompleted(0);
    setCorrectAnswers(0);
    setGameCompleted(false);
    setStreak(0);
    
    if (gameEngine) {
      gameEngine.startGame();
      setIsGameStarted(true);
    }
  };

  const handleAnswerSelect = (answer: number) => {
    if (showResult || !currentProblem) return;
    
    setSelectedAnswer(answer);
    const correct = answer === currentProblem.answer;
    setIsCorrect(correct);
    setShowResult(true);
    
    // Update train cars
    setTrainCars(prev => 
      prev.map(car => ({
        ...car,
        isSelected: car.number === answer
      }))
    );
    
    // Update game state
    if (gameEngine) {
      gameEngine.updateScore(gameConfig.basePoints, correct);
    }
    
    // Update user points in global store
    if (correct) {
      updateUserPoints(gameConfig.basePoints);
      setStreak(prev => prev + 1);
      setCorrectAnswers(prev => prev + 1);
    } else {
      setStreak(0);
    }
    
    // Update problems completed
    const newProblemsCompleted = problemsCompleted + 1;
    setProblemsCompleted(newProblemsCompleted);
    
    // Auto-advance after delay
    setTimeout(() => {
      if (newProblemsCompleted >= (selectedLevel?.maxProblems || 6)) {
        // Game completed
        setGameCompleted(true);
        completeGame();
        updateLeaderboard();
      } else {
        nextProblem();
      }
    }, 2000);
  };

  const nextProblem = () => {
    generateProblem();
  };

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  const handleBackToOverview = () => {
    router.push('/spiele');
  };

  const renderVisualHint = () => {
    if (!currentProblem || currentProblem.type !== 'counting') return null;
    
    return (
      <div className="text-center mb-6">
        <div className="text-4xl tracking-wider">
          {currentProblem.visual}
        </div>
      </div>
    );
  };

  if (!isGameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-400 via-green-300 to-blue-300 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="text-6xl sm:text-8xl mb-8">🚂</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Zahlen-Express</h1>
          <p className="text-lg sm:text-xl text-white mb-8">
            Wähle dein Level und steige ein!
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
                      <p className="text-white text-sm font-bold">{level.maxProblems} Aufgaben</p>
                      <p className="text-white text-xs">{level.pointsPerProblem} Punkte pro Aufgabe</p>
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
    const totalPoints = selectedLevel.pointsPerProblem * correctAnswers;
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-400 via-green-300 to-blue-300 flex items-center justify-center game-area p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-2xl mx-4"
        >
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold text-white mb-4">Level geschafft!</h1>
          <p className="text-xl text-white mb-6">
            Du hast {correctAnswers} von {problemsCompleted} Aufgaben richtig gelöst!
          </p>
          
          <div className="bg-yellow-400/20 rounded-lg p-4 mb-6">
            <p className="text-white text-lg font-bold">
              {totalPoints} Punkte erhalten! 
            </p>
            <p className="text-white/80 text-sm">
              {selectedLevel.name} - {selectedLevel.pointsPerProblem} Punkte pro richtige Antwort
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
            <Button onClick={() => router.push('/spiele')} variant="secondary">
              Zurück zur Übersicht
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-400 via-green-300 to-blue-300 p-4 game-area">
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
          <div className="text-xl sm:text-2xl">🚂</div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Zahlen-Express</h1>
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
              Aufgaben: {problemsCompleted}/{selectedLevel?.maxProblems || 6}
            </span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-1 sm:py-2">
            <span className="text-white font-bold text-sm sm:text-base">
              Punkte: {gameEngine?.getState().score.current || 0}
            </span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-1 sm:py-2">
            <span className="text-white font-bold text-sm sm:text-base">
              Serie: {streak}
            </span>
          </div>
        </div>
      </div>

      {/* Problem Display */}
      {currentProblem && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 sm:p-6 mx-4 sm:mx-0 inline-block">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              {currentProblem.expression}
            </h2>
            {renderVisualHint()}
          </div>
        </motion.div>
      )}

      {/* Train with Answer Options */}
      <div className="flex flex-col sm:flex-row justify-center items-center mb-8 px-4">
        {/* Locomotive */}
        <motion.div
          className="relative mb-4 sm:mb-0 sm:mr-4"
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="text-4xl sm:text-6xl">🚂</div>
          <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 text-lg sm:text-2xl">💨</div>
        </motion.div>

        {/* Train Cars with Answers */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-2">
          {trainCars.map((car, index) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative cursor-pointer ${
                showResult ? 'cursor-default' : 'hover:scale-105'
              }`}
              onClick={() => !showResult && handleAnswerSelect(car.number)}
              whileHover={!showResult ? { scale: 1.05 } : {}}
              whileTap={!showResult ? { scale: 0.95 } : {}}
            >
              <div className={`w-16 h-12 sm:w-20 sm:h-16 rounded-lg flex items-center justify-center text-white font-bold text-lg sm:text-xl border-2 ${
                car.isSelected && car.isCorrect
                  ? 'bg-green-500 border-green-600'
                  : car.isSelected && !car.isCorrect
                  ? 'bg-red-500 border-red-600'
                  : car.isCorrect && showResult
                  ? 'bg-green-500 border-green-600 animate-pulse'
                  : 'bg-blue-500 border-blue-600'
              }`}>
                {car.number}
              </div>
              
              {/* Car Connection - hide on mobile wrap */}
              <div className="absolute top-1/2 -right-1 w-2 h-1 bg-gray-600 transform -translate-y-1/2 hidden sm:block" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Result Display */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center mb-6"
          >
            <div className={`inline-block px-6 py-3 rounded-lg text-white font-bold text-xl ${
              isCorrect ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {isCorrect ? (
                <>
                  🎉 Richtig! Die Antwort ist {currentProblem?.answer}
                </>
              ) : (
                <>
                  💪 Nicht ganz! Die richtige Antwort ist {currentProblem?.answer}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint Button */}
      {!showResult && (
        <div className="flex justify-center mb-4">
          <Button
            onClick={toggleHint}
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            💡 {showHint ? 'Tipp verstecken' : 'Tipp anzeigen'}
          </Button>
        </div>
      )}

      {/* Hint Display */}
      <AnimatePresence>
        {showHint && currentProblem && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <div className="bg-yellow-500/80 backdrop-blur-sm rounded-lg p-4 inline-block">
              <p className="text-white text-lg">
                {currentProblem.type === 'counting' && 'Zähle die blauen Blöcke!'}
                {currentProblem.type === 'addition' && 'Rechne die Zahlen zusammen!'}
                {currentProblem.type === 'subtraction' && 'Ziehe die zweite Zahl von der ersten ab!'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      {selectedLevel && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-80">
          <div className="bg-white/20 rounded-full h-4 overflow-hidden">
            <motion.div
              className="h-full bg-yellow-400"
              initial={{ width: 0 }}
              animate={{ width: `${(problemsCompleted / selectedLevel.maxProblems) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-center text-white text-sm mt-2">
            {problemsCompleted} von {selectedLevel.maxProblems} Aufgaben geschafft
          </p>
        </div>
      )}

      {/* Streak Indicators */}
      <div className="flex justify-center mt-8">
        <div className="flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < streak ? 'bg-yellow-400' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
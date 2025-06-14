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
import { useAudio } from '@/hooks/useAudio';

interface MelodyNote {
  id: string;
  note: string;
  sound: string;
  color: string;
  emoji: string;
}

interface MelodyPattern {
  id: string;
  name: string;
  notes: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
}

interface GameLevel {
  id: number;
  name: string;
  description: string;
  pointsPerPattern: number;
  maxPatterns: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

const NOTES: MelodyNote[] = [
  { id: 'do', note: 'Do', sound: '🎵', color: 'bg-red-500', emoji: '🔴' },
  { id: 're', note: 'Re', sound: '🎶', color: 'bg-orange-500', emoji: '🟠' },
  { id: 'mi', note: 'Mi', sound: '🎼', color: 'bg-yellow-500', emoji: '🟡' },
  { id: 'fa', note: 'Fa', sound: '🎹', color: 'bg-green-500', emoji: '🟢' },
  { id: 'sol', note: 'Sol', sound: '🎺', color: 'bg-blue-500', emoji: '🔵' },
  { id: 'la', note: 'La', sound: '🎻', color: 'bg-purple-500', emoji: '🟣' },
];

// Simple note frequencies for Web Audio API
const NOTE_FREQUENCIES: { [key: string]: number } = {
  'do': 261.63,   // C4
  're': 293.66,   // D4
  'mi': 329.63,   // E4
  'fa': 349.23,   // F4
  'sol': 392.00,  // G4
  'la': 440.00,   // A4
};

const MELODY_PATTERNS: MelodyPattern[] = [
  // Easy patterns (3 notes)
  { id: 'simple1', name: 'Guten Morgen', notes: ['do', 're', 'mi'], difficulty: 'easy', description: 'Einfache Melodie' },
  { id: 'simple2', name: 'Bergecho', notes: ['mi', 're', 'do'], difficulty: 'easy', description: 'Echo in den Bergen' },
  { id: 'simple3', name: 'Kuhglocke', notes: ['do', 'mi', 'do'], difficulty: 'easy', description: 'Bim Bam Bum' },
  { id: 'simple4', name: 'Vogelruf', notes: ['re', 'fa', 're'], difficulty: 'easy', description: 'Wie ein Vogel singt' },
  
  // Medium patterns (4 notes)
  { id: 'medium1', name: 'Alpenlied', notes: ['do', 're', 'mi', 'fa'], difficulty: 'medium', description: 'Bekannte Alpenmelodie' },
  { id: 'medium2', name: 'Jodler', notes: ['fa', 'mi', 're', 'do'], difficulty: 'medium', description: 'Traditioneller Jodler' },
  { id: 'medium3', name: 'Bergtanz', notes: ['do', 'mi', 're', 'fa'], difficulty: 'medium', description: 'Fröhlicher Tanz' },
  { id: 'medium4', name: 'Hirtenruf', notes: ['sol', 'fa', 'mi', 're'], difficulty: 'medium', description: 'Ruf des Hirten' },
  
  // Hard patterns (5-6 notes)
  { id: 'hard1', name: 'Schweizer Hymne', notes: ['do', 're', 'mi', 'fa', 'sol'], difficulty: 'hard', description: 'Schweizer Nationalhymne' },
  { id: 'hard2', name: 'Alphorn Solo', notes: ['sol', 'fa', 'mi', 're', 'do', 'mi'], difficulty: 'hard', description: 'Virtuoses Solo' },
  { id: 'hard3', name: 'Bergfest', notes: ['do', 'mi', 'sol', 'fa', 're'], difficulty: 'hard', description: 'Festliche Melodie' },
  { id: 'hard4', name: 'Gipfelruf', notes: ['fa', 'sol', 'la', 'sol', 'fa', 'mi'], difficulty: 'hard', description: 'Vom Gipfel ins Tal' }
];

const GAME_LEVELS: GameLevel[] = [
  { id: 1, name: 'Anfänger', description: '3-Ton Melodien', pointsPerPattern: 100, maxPatterns: 4, difficulty: 'easy' },
  { id: 2, name: 'Fortgeschritten', description: '4-Ton Melodien', pointsPerPattern: 150, maxPatterns: 4, difficulty: 'medium' },
  { id: 3, name: 'Experte', description: '5-6 Ton Melodien', pointsPerPattern: 200, maxPatterns: 4, difficulty: 'hard' }
];

export default function AlphornMelodie() {
  const router = useRouter();
  const { user, updateUserPoints, completeGame, updateLeaderboard } = useGameStore();
  const { playSound } = useAudio();
  const [gameEngine, setGameEngine] = useState<GameEngine | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<GameLevel | null>(null);
  const [currentPattern, setCurrentPattern] = useState<MelodyPattern | null>(null);
  const [patternIndex, setPatternIndex] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [patternsCompleted, setPatternsCompleted] = useState(0);
  const [correctPatterns, setCorrectPatterns] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [playingNoteIndex, setPlayingNoteIndex] = useState(-1);

  const gameConfig: GameConfig = {
    gameType: 'ALPHORN',
    maxLives: 3,
    basePoints: selectedLevel?.pointsPerPattern || 100,
    comboMultiplier: 0.5,
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
    
    // Initialize Web Audio API
    const initAudio = () => {
      if (typeof window !== 'undefined') {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(context);
      }
    };
    
    initAudio();
    
    return () => {
      engine.destroy();
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  const playNote = (noteId: string, duration: number = 0.5) => {
    if (!audioContext) return;
    
    const frequency = NOTE_FREQUENCIES[noteId];
    if (!frequency) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine'; // Smooth tone for alphorn-like sound
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  };

  const getFilteredPatterns = () => {
    if (!selectedLevel) return MELODY_PATTERNS.slice(0, 4);
    
    const filtered = MELODY_PATTERNS.filter(pattern => pattern.difficulty === selectedLevel.difficulty);
    return filtered.slice(0, selectedLevel.maxPatterns);
  };

  const startGame = (level: GameLevel) => {
    setSelectedLevel(level);
    const filteredPatterns = getFilteredPatternsForLevel(level);
    setCurrentPattern(filteredPatterns[0]);
    setPatternIndex(0);
    setPatternsCompleted(0);
    setCorrectPatterns(0);
    setGameCompleted(false);
    setUserSequence([]);
    setShowResult(false);
    
    if (gameEngine) {
      gameEngine.startGame();
      setIsGameStarted(true);
    }
  };

  const getFilteredPatternsForLevel = (level: GameLevel) => {
    return MELODY_PATTERNS.filter(pattern => pattern.difficulty === level.difficulty).slice(0, level.maxPatterns);
  };

  const playPattern = async () => {
    if (!currentPattern || isPlaying || !audioContext) return;
    
    // Resume audio context if suspended (browser requirement)
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
    
    setIsPlaying(true);
    setPlayingNoteIndex(-1);
    
    for (let i = 0; i < currentPattern.notes.length; i++) {
      setPlayingNoteIndex(i);
      playNote(currentPattern.notes[i], 0.5);
      await new Promise(resolve => setTimeout(resolve, 600));
    }
    
    setPlayingNoteIndex(-1);
    setIsPlaying(false);
  };

  const handleNoteClick = async (noteId: string) => {
    if (!currentPattern || isPlaying || showResult) return;
    
    // Resume audio context if needed and play note
    if (audioContext && audioContext.state === 'suspended') {
      await audioContext.resume();
    }
    playNote(noteId, 0.3);
    
    const newSequence = [...userSequence, noteId];
    setUserSequence(newSequence);
    
    // Check if pattern is complete
    if (newSequence.length === currentPattern.notes.length) {
      checkPattern(newSequence);
    }
  };

  const checkPattern = (sequence: string[]) => {
    if (!currentPattern) return;
    
    const correct = JSON.stringify(sequence) === JSON.stringify(currentPattern.notes);
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setCorrectPatterns(prev => prev + 1);
      if (gameEngine) {
        gameEngine.updateScore(gameConfig.basePoints, true);
      }
      updateUserPoints(gameConfig.basePoints);
    } else {
      if (gameEngine) {
        gameEngine.updateScore(0, false);
      }
    }
    
    const newPatternsCompleted = patternsCompleted + 1;
    setPatternsCompleted(newPatternsCompleted);
    
    setTimeout(() => {
      if (newPatternsCompleted >= (selectedLevel?.maxPatterns || 4)) {
        setGameCompleted(true);
        completeGame();
        updateLeaderboard();
      } else {
        nextPattern();
      }
    }, 2000);
  };

  const nextPattern = () => {
    if (!selectedLevel) return;
    
    const filteredPatterns = getFilteredPatternsForLevel(selectedLevel);
    const nextIndex = patternIndex + 1;
    
    if (nextIndex < filteredPatterns.length) {
      setPatternIndex(nextIndex);
      setCurrentPattern(filteredPatterns[nextIndex]);
      setUserSequence([]);
      setShowResult(false);
      
      if (gameEngine) {
        gameEngine.nextLevel();
      }
    }
  };

  const resetPattern = () => {
    setUserSequence([]);
    setShowResult(false);
  };

  const handleBackToOverview = () => {
    router.push('/spiele');
  };

  if (!isGameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-400 via-pink-300 to-orange-300 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="text-6xl sm:text-8xl mb-8">🎺</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Alphorn-Melodie</h1>
          <p className="text-lg sm:text-xl text-white mb-8">
            Wähle dein Level und spiele Melodien nach!
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
                  className="bg-white/20 backdrop-blur-sm border-white/30 cursor-pointer hover:bg-white/30"
                >
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">{level.name}</h3>
                    <p className="text-white/80 text-sm mb-3">{level.description}</p>
                    <div className="bg-yellow-400/20 rounded-lg p-2 mb-3">
                      <p className="text-white text-sm font-bold">{level.maxPatterns} Melodien</p>
                      <p className="text-white text-xs">{level.pointsPerPattern} Punkte pro Melodie</p>
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
    const totalPoints = selectedLevel.pointsPerPattern * correctPatterns;
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-400 via-pink-300 to-orange-300 flex items-center justify-center game-area p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-2xl mx-4"
        >
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold text-white mb-4">Level geschafft!</h1>
          <p className="text-xl text-white mb-6">
            Du hast {correctPatterns} von {patternsCompleted} Melodien richtig gespielt!
          </p>
          
          <div className="bg-yellow-400/20 rounded-lg p-4 mb-6">
            <p className="text-white text-lg font-bold">
              {totalPoints} Punkte erhalten! 
            </p>
            <p className="text-white/80 text-sm">
              {selectedLevel.name} - {selectedLevel.pointsPerPattern} Punkte pro richtige Melodie
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
    <div className="min-h-screen bg-gradient-to-b from-purple-400 via-pink-300 to-orange-300 p-4 game-area">
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
          <div className="text-xl sm:text-2xl">🎺</div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Alphorn-Melodie</h1>
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
              Melodien: {patternsCompleted}/{selectedLevel?.maxPatterns || 4}
            </span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-1 sm:py-2">
            <span className="text-white font-bold text-sm sm:text-base">
              Punkte: {gameEngine?.getState().score.current || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Current Pattern */}
      {currentPattern && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 sm:p-6 mx-4 sm:mx-0 inline-block">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {currentPattern.name}
            </h2>
            <p className="text-white/80 mb-4">{currentPattern.description}</p>
            <Button 
              onClick={playPattern} 
              disabled={isPlaying}
              className="bg-green-500 hover:bg-green-600 disabled:opacity-50"
            >
              {isPlaying ? '🎵 Spielt...' : '🎵 Melodie anhören'}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Pattern Display */}
      {currentPattern && (
        <div className="flex justify-center mb-8">
          <div className="flex gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-4">
            {currentPattern.notes.map((noteId, index) => {
              const note = NOTES.find(n => n.id === noteId);
              return (
                <motion.div
                  key={index}
                  className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center text-white font-bold border-2 ${
                    playingNoteIndex === index ? 'bg-yellow-400 border-yellow-300 scale-110' : 'bg-gray-600 border-gray-500'
                  }`}
                  animate={{
                    scale: playingNoteIndex === index ? 1.1 : 1,
                    backgroundColor: playingNoteIndex === index ? '#fbbf24' : '#4b5563'
                  }}
                >
                  {note?.emoji}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* User Input Display */}
      <div className="flex justify-center mb-8">
        <div className="flex gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <span className="text-white font-bold mr-4">Deine Melodie:</span>
          {userSequence.map((noteId, index) => {
            const note = NOTES.find(n => n.id === noteId);
            return (
              <motion.div
                key={index}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center text-white font-bold bg-blue-500"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                {note?.emoji}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Note Buttons */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 px-4">
        {NOTES.map((note) => (
          <motion.div
            key={note.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => handleNoteClick(note.id)}
              disabled={isPlaying || showResult}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg ${note.color} hover:opacity-80 disabled:opacity-50 text-2xl`}
            >
              {note.emoji}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-8">
        <Button onClick={resetPattern} variant="secondary" disabled={userSequence.length === 0 || showResult}>
          🔄 Neu starten
        </Button>
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
                  🎉 Perfekt gespielt! Das war "{currentPattern?.name}"
                </>
              ) : (
                <>
                  💪 Nicht ganz richtig! Versuch es nochmal mit "{currentPattern?.name}"
                </>
              )}
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
              animate={{ width: `${(patternsCompleted / selectedLevel.maxPatterns) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-center text-white text-sm mt-2">
            {patternsCompleted} von {selectedLevel.maxPatterns} Melodien gespielt
          </p>
        </div>
      )}
    </div>
  );
}
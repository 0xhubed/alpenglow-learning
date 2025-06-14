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

interface NatureQuestion {
  id: string;
  question: string;
  image: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: 'animals' | 'plants' | 'mountains' | 'weather';
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

interface GameLevel {
  id: number;
  name: string;
  description: string;
  pointsPerQuestion: number;
  maxQuestions: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

const NATURE_QUESTIONS: NatureQuestion[] = [
  // EASY LEVEL QUESTIONS (8 questions)
  {
    id: 'marmot',
    question: 'Welches Tier hält Winterschlaf in den Schweizer Bergen?',
    image: '🐹',
    options: ['Murmeltier', 'Steinbock', 'Hirsch', 'Fuchs'],
    correctAnswer: 0,
    explanation: 'Murmeltiere schlafen 6 Monate lang in ihren Höhlen!',
    category: 'animals'
  },
  {
    id: 'ibex',
    question: 'Welches Tier kann steile Felswände hinaufklettern?',
    image: '🧗',
    options: ['Hirsch', 'Steinbock', 'Hase', 'Bär'],
    correctAnswer: 1,
    explanation: 'Steinböcke haben spezielle Hufe zum Klettern!',
    category: 'animals'
  },
  {
    id: 'snow',
    question: 'Was passiert mit Wasser bei 0 Grad Celsius?',
    image: '❄️',
    options: ['Es kocht', 'Es gefriert', 'Es verschwindet', 'Es wird warm'],
    correctAnswer: 1,
    explanation: 'Bei 0 Grad wird Wasser zu Eis und Schnee!',
    category: 'weather'
  },
  {
    id: 'pine',
    question: 'Welche Bäume bleiben auch im Winter grün?',
    image: '🌲',
    options: ['Buche', 'Tanne', 'Birke', 'Ahorn'],
    correctAnswer: 1,
    explanation: 'Tannen sind Nadelbäume und bleiben immer grün!',
    category: 'plants'
  },
  {
    id: 'cow',
    question: 'Welche Tiere geben uns Milch auf dem Bauernhof?',
    image: '🐄',
    options: ['Pferde', 'Kühe', 'Schafe', 'Ziegen'],
    correctAnswer: 1,
    explanation: 'Kühe geben uns frische Milch für Käse und Butter!',
    category: 'animals'
  },
  {
    id: 'flower',
    question: 'Was brauchen Blumen zum Wachsen?',
    image: '🌻',
    options: ['Nur Wasser', 'Sonne und Wasser', 'Nur Erde', 'Nur Luft'],
    correctAnswer: 1,
    explanation: 'Blumen brauchen Sonnenlicht und Wasser zum Wachsen!',
    category: 'plants'
  },
  {
    id: 'rain',
    question: 'Was fällt vom Himmel wenn es regnet?',
    image: '🌧️',
    options: ['Blätter', 'Wasser', 'Steine', 'Sand'],
    correctAnswer: 1,
    explanation: 'Regen ist Wasser, das aus den Wolken fällt!',
    category: 'weather'
  },
  {
    id: 'mountain_basic',
    question: 'Wie nennt man sehr hohe Hügel?',
    image: '⛰️',
    options: ['Seen', 'Berge', 'Wälder', 'Felder'],
    correctAnswer: 1,
    explanation: 'Sehr hohe Hügel nennt man Berge!',
    category: 'mountains'
  },

  // MEDIUM LEVEL QUESTIONS (10 questions)  
  {
    id: 'edelweiss',
    question: 'Wie heißt die berühmte weiße Blume der Schweizer Alpen?',
    image: '🌸',
    options: ['Tulpe', 'Rose', 'Edelweiß', 'Löwenzahn'],
    correctAnswer: 2,
    explanation: 'Das Edelweiß ist das Symbol der Schweizer Berge!',
    category: 'plants'
  },
  {
    id: 'matterhorn',
    question: 'Wie heißt der berühmteste Berg der Schweiz?',
    image: '🗻',
    options: ['Matterhorn', 'Mont Blanc', 'Eiger', 'Pilatus'],
    correctAnswer: 0,
    explanation: 'Das Matterhorn ist 4478 Meter hoch!',
    category: 'mountains'
  },
  {
    id: 'eagle',
    question: 'Welcher Vogel kann am höchsten fliegen?',
    image: '🦅',
    options: ['Spatz', 'Ente', 'Steinadler', 'Huhn'],
    correctAnswer: 2,
    explanation: 'Steinadler fliegen über 3000 Meter hoch!',
    category: 'animals'
  },
  {
    id: 'lake',
    question: 'Wie entstehen die blauen Bergseen in der Schweiz?',
    image: '🏔️💧',
    options: ['Durch Regen', 'Durch Gletscher', 'Durch Wind', 'Durch Tiere'],
    correctAnswer: 1,
    explanation: 'Gletscher schmelzen und bilden wunderschöne Bergseen!',
    category: 'mountains'
  },
  {
    id: 'deer',
    question: 'Welches Tier hat ein Geweih und lebt im Wald?',
    image: '🦌',
    options: ['Fuchs', 'Hirsch', 'Wolf', 'Hase'],
    correctAnswer: 1,
    explanation: 'Hirsche haben ein Geweih und leben in Schweizer Wäldern!',
    category: 'animals'
  },
  {
    id: 'seasons',
    question: 'Wann fallen die Blätter von den Bäumen?',
    image: '🍂',
    options: ['Frühling', 'Sommer', 'Herbst', 'Winter'],
    correctAnswer: 2,
    explanation: 'Im Herbst werden die Blätter bunt und fallen ab!',
    category: 'weather'
  },
  {
    id: 'mushroom',
    question: 'Was wächst oft unter Bäumen im feuchten Wald?',
    image: '🍄',
    options: ['Pilze', 'Fische', 'Steine', 'Eis'],
    correctAnswer: 0,
    explanation: 'Pilze lieben feuchte, schattige Plätze unter Bäumen!',
    category: 'plants'
  },
  {
    id: 'fox',
    question: 'Welches schlaue Tier hat einen buschigen Schwanz?',
    image: '🦊',
    options: ['Bär', 'Wolf', 'Fuchs', 'Hase'],
    correctAnswer: 2,
    explanation: 'Füchse sind sehr schlau und haben buschige Schwänze!',
    category: 'animals'
  },
  {
    id: 'avalanche',
    question: 'Wie nennt man es, wenn viel Schnee den Berg hinunterfällt?',
    image: '🏔️❄️',
    options: ['Regen', 'Lawine', 'Gewitter', 'Nebel'],
    correctAnswer: 1,
    explanation: 'Eine Lawine ist gefährlich - viel Schnee rutscht schnell hinunter!',
    category: 'mountains'
  },
  {
    id: 'bee',
    question: 'Welches Insekt sammelt Nektar und macht Honig?',
    image: '🐝',
    options: ['Ameise', 'Biene', 'Käfer', 'Fliege'],
    correctAnswer: 1,
    explanation: 'Bienen sammeln Nektar von Blüten und machen daraus Honig!',
    category: 'animals'
  },

  // HARD LEVEL QUESTIONS (12 questions)
  {
    id: 'chamois',
    question: 'Welches Tier ist mit dem Steinbock verwandt und lebt in steilen Bergen?',
    image: '🏔️🐐',
    options: ['Gämse', 'Ziege', 'Schaf', 'Kuh'],
    correctAnswer: 0,
    explanation: 'Gämsen sind sehr geschickte Kletterer und leben in steilen Felswänden!',
    category: 'animals'
  },
  {
    id: 'rhododendron',
    question: 'Welche Pflanze blüht rosa-rot in den Schweizer Alpen?',
    image: '🌺',
    options: ['Edelweiß', 'Alpenrose', 'Löwenzahn', 'Vergissmeinnicht'],
    correctAnswer: 1,
    explanation: 'Die Alpenrose (Rhododendron) blüht wunderschön rosa-rot!',
    category: 'plants'
  },
  {
    id: 'glacier',
    question: 'Wie nennt man gefrorenes Wasser, das sich über Jahre ansammelt?',
    image: '🧊',
    options: ['See', 'Gletscher', 'Fluss', 'Quelle'],
    correctAnswer: 1,
    explanation: 'Gletscher entstehen aus Schnee, der über Jahre zu Eis wird!',
    category: 'mountains'
  },
  {
    id: 'wind',
    question: 'Welcher warme Wind schmilzt oft den Schnee in den Alpen?',
    image: '🌬️',
    options: ['Föhn', 'Bise', 'Mistral', 'Tramontana'],
    correctAnswer: 0,
    explanation: 'Der Föhn ist ein warmer Wind, der Schnee schnell schmelzen lässt!',
    category: 'weather'
  },
  {
    id: 'lynx',
    question: 'Welche wilde Katze lebt heimlich in Schweizer Wäldern?',
    image: '🐱',
    options: ['Löwe', 'Tiger', 'Luchs', 'Leopard'],
    correctAnswer: 2,
    explanation: 'Der Luchs ist eine seltene wilde Katze in Schweizer Wäldern!',
    category: 'animals'
  },
  {
    id: 'gentian',
    question: 'Welche blaue Alpenblume wird für Schnaps verwendet?',
    image: '💙',
    options: ['Vergissmeinnicht', 'Enzian', 'Kornblume', 'Veilchen'],
    correctAnswer: 1,
    explanation: 'Aus der Enzianwurzel macht man den berühmten Enzianschnaps!',
    category: 'plants'
  },
  {
    id: 'treeline',
    question: 'Wie nennt man die Höhe, über der keine Bäume mehr wachsen?',
    image: '🌲📏',
    options: ['Baumgrenze', 'Waldende', 'Gipfellinie', 'Schneegrenze'],
    correctAnswer: 0,
    explanation: 'Über der Baumgrenze ist es zu kalt und windig für Bäume!',
    category: 'mountains'
  },
  {
    id: 'wolf',
    question: 'Welches Raubtier ist in die Schweiz zurückgekehrt?',
    image: '🐺',
    options: ['Bär', 'Wolf', 'Löwe', 'Tiger'],
    correctAnswer: 1,
    explanation: 'Wölfe sind nach langer Zeit wieder in die Schweiz eingewandert!',
    category: 'animals'
  },
  {
    id: 'thunderstorm',
    question: 'Wie entstehen Gewitter in den Bergen?',
    image: '⛈️',
    options: ['Durch Wind', 'Durch warme Luft', 'Durch Kälte', 'Durch Regen'],
    correctAnswer: 1,
    explanation: 'Warme Luft steigt auf und bildet Gewitterwolken!',
    category: 'weather'
  },
  {
    id: 'hibernation',
    question: 'Welche Tiere halten Winterschlaf in der Schweiz?',
    image: '😴',
    options: ['Hirsche', 'Murmeltiere und Fledermäuse', 'Vögel', 'Füchse'],
    correctAnswer: 1,
    explanation: 'Murmeltiere und Fledermäuse schlafen den ganzen Winter!',
    category: 'animals'
  },
  {
    id: 'alpine_garden',
    question: 'Wie heißen die besonderen Pflanzen, die in großer Höhe wachsen?',
    image: '🌺⛰️',
    options: ['Wiesenpflanzen', 'Alpenpflanzen', 'Gartenpflanzen', 'Waldpflanzen'],
    correctAnswer: 1,
    explanation: 'Alpenpflanzen sind an das harte Bergklima angepasst!',
    category: 'plants'
  },
  {
    id: 'climate_change',
    question: 'Was passiert mit den Gletschern durch die Klimaerwärmung?',
    image: '🌡️🧊',
    options: ['Sie wachsen', 'Sie schmelzen', 'Sie bleiben gleich', 'Sie werden härter'],
    correctAnswer: 1,
    explanation: 'Durch wärmeres Klima schmelzen die Gletscher leider schneller!',
    category: 'mountains'
  }
];

const GAME_LEVELS: GameLevel[] = [
  { id: 1, name: 'Anfänger', description: 'Einfache Tierfragen', pointsPerQuestion: 150, maxQuestions: 8, difficulty: 'easy' },
  { id: 2, name: 'Fortgeschritten', description: 'Mittlere Natur-Fragen', pointsPerQuestion: 200, maxQuestions: 10, difficulty: 'medium' },
  { id: 3, name: 'Experte', description: 'Schwere Natur-Fragen', pointsPerQuestion: 250, maxQuestions: 12, difficulty: 'hard' }
];

const ACHIEVEMENTS: Achievement[] = [
  { id: 'animal_expert', name: 'Tier-Experte', description: '3 Tierfragen richtig', icon: '🐾', category: 'animals' },
  { id: 'plant_lover', name: 'Pflanzen-Freund', description: '2 Pflanzenfragen richtig', icon: '🌿', category: 'plants' },
  { id: 'mountain_climber', name: 'Berg-Steiger', description: '2 Bergfragen richtig', icon: '⛰️', category: 'mountains' },
  { id: 'weather_watcher', name: 'Wetter-Beobachter', description: '1 Wetterfrage richtig', icon: '🌤️', category: 'weather' },
  { id: 'nature_master', name: 'Natur-Meister', description: '6 Fragen richtig', icon: '🏆', category: 'all' }
];

export default function SchweizNaturQuiz() {
  const router = useRouter();
  const { user, updateUserPoints, completeGame, updateLeaderboard } = useGameStore();
  const [gameEngine, setGameEngine] = useState<GameEngine | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<GameLevel | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<NatureQuestion | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [categoryStats, setCategoryStats] = useState({ animals: 0, plants: 0, mountains: 0, weather: 0 });
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);
  const [gameCompleted, setGameCompleted] = useState(false);

  const gameConfig: GameConfig = {
    gameType: 'NATUR',
    maxLives: 3,
    basePoints: selectedLevel?.pointsPerQuestion || 200,
    comboMultiplier: 0.4,
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

  const getFilteredQuestions = () => {
    if (!selectedLevel) return NATURE_QUESTIONS.slice(0, 8);
    
    let filtered = [...NATURE_QUESTIONS];
    
    if (selectedLevel.difficulty === 'easy') {
      // Easy level: first 8 questions
      filtered = filtered.slice(0, 8);
    } else if (selectedLevel.difficulty === 'medium') {
      // Medium level: questions 9-18 (index 8-17)
      filtered = filtered.slice(8, 18);
    } else {
      // Hard level: questions 19-30 (index 18-29)
      filtered = filtered.slice(18, 30);
    }
    
    return filtered.slice(0, selectedLevel.maxQuestions);
  };

  useEffect(() => {
    if (isGameStarted && selectedLevel) {
      const filteredQuestions = getFilteredQuestions();
      if (questionIndex < filteredQuestions.length) {
        setCurrentQuestion(filteredQuestions[questionIndex]);
        setSelectedAnswer(null);
        setShowResult(false);
        setShowExplanation(false);
      } else {
        setGameCompleted(true);
      }
    }
  }, [isGameStarted, questionIndex, selectedLevel]);

  const startGame = (level: GameLevel) => {
    setSelectedLevel(level);
    setQuestionIndex(0);
    setCorrectAnswers(0);
    setCategoryStats({ animals: 0, plants: 0, mountains: 0, weather: 0 });
    setUnlockedAchievements([]);
    setGameCompleted(false);
    
    if (gameEngine) {
      gameEngine.startGame();
      setIsGameStarted(true);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult || !currentQuestion) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setCategoryStats(prev => ({
        ...prev,
        [currentQuestion.category]: prev[currentQuestion.category] + 1
      }));
      
      if (gameEngine) {
        gameEngine.updateScore(gameConfig.basePoints, true);
      }
      
      // Update user points in global store
      updateUserPoints(gameConfig.basePoints);
    } else {
      if (gameEngine) {
        gameEngine.updateScore(0, false);
      }
    }
    
    setTimeout(() => {
      setShowExplanation(true);
    }, 1000);
    
    setTimeout(() => {
      checkAchievements();
      nextQuestion();
    }, 4000);
  };

  const checkAchievements = () => {
    const newAchievements: Achievement[] = [];
    
    ACHIEVEMENTS.forEach(achievement => {
      if (unlockedAchievements.some(a => a.id === achievement.id)) return;
      
      let unlocked = false;
      
      switch (achievement.id) {
        case 'animal_expert':
          unlocked = categoryStats.animals >= 3;
          break;
        case 'plant_lover':
          unlocked = categoryStats.plants >= 2;
          break;
        case 'mountain_climber':
          unlocked = categoryStats.mountains >= 2;
          break;
        case 'weather_watcher':
          unlocked = categoryStats.weather >= 1;
          break;
        case 'nature_master':
          unlocked = correctAnswers >= 6;
          break;
      }
      
      if (unlocked) {
        newAchievements.push(achievement);
      }
    });
    
    if (newAchievements.length > 0) {
      setUnlockedAchievements(prev => [...prev, ...newAchievements]);
    }
  };

  const nextQuestion = () => {
    if (!selectedLevel) return;
    
    const filteredQuestions = getFilteredQuestions();
    if (questionIndex < filteredQuestions.length - 1) {
      setQuestionIndex(prev => prev + 1);
      if (gameEngine) {
        gameEngine.nextLevel();
      }
    } else {
      setGameCompleted(true);
      // Mark game as completed in global store
      completeGame();
      updateLeaderboard();
    }
  };

  const handleBackToOverview = () => {
    router.push('/spiele');
  };

  const restartGame = () => {
    setIsGameStarted(false);
    setGameCompleted(false);
    setQuestionIndex(0);
    setCorrectAnswers(0);
    setCategoryStats({ animals: 0, plants: 0, mountains: 0, weather: 0 });
    setUnlockedAchievements([]);
  };

  if (!isGameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-400 via-blue-300 to-green-500 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="text-6xl sm:text-8xl mb-8">🌿</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Schweizer Natur-Quiz</h1>
          <p className="text-lg sm:text-xl text-white mb-8">
            Wähle dein Level und teste dein Wissen!
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
                      <p className="text-white text-sm font-bold">{level.maxQuestions} Fragen</p>
                      <p className="text-white text-xs">{level.pointsPerQuestion} Punkte pro Frage</p>
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
    const totalPoints = selectedLevel.pointsPerQuestion * correctAnswers;
    const filteredQuestions = getFilteredQuestions();
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-400 via-blue-300 to-green-500 flex items-center justify-center game-area p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-2xl mx-4"
        >
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold text-white mb-4">Level geschafft!</h1>
          <p className="text-xl text-white mb-6">
            Du hast {correctAnswers} von {filteredQuestions.length} Fragen richtig beantwortet!
          </p>
          
          <div className="bg-yellow-400/20 rounded-lg p-4 mb-6">
            <p className="text-white text-lg font-bold">
              {totalPoints} Punkte erhalten! 
            </p>
            <p className="text-white/80 text-sm">
              {selectedLevel.name} - {selectedLevel.pointsPerQuestion} Punkte pro richtige Antwort
            </p>
          </div>
          
          {/* Achievements */}
          {unlockedAchievements.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-4">🏆 Errungenschaften:</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {unlockedAchievements.map((achievement) => (
                  <div key={achievement.id} className="bg-yellow-400/20 rounded-lg p-3 text-center">
                    <div className="text-2xl mb-1">{achievement.icon}</div>
                    <div className="text-white font-bold text-sm">{achievement.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
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
    <div className="min-h-screen bg-gradient-to-b from-green-400 via-blue-300 to-green-500 p-4 game-area">
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
          <div className="text-xl sm:text-2xl">🌿</div>
          <h1 className="text-lg sm:text-2xl font-bold text-white">Schweizer Natur-Quiz</h1>
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
              Frage: {questionIndex + 1}/{selectedLevel?.maxQuestions || 8}
            </span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-1 sm:py-2">
            <span className="text-white font-bold text-sm sm:text-base">
              Richtig: {correctAnswers}
            </span>
          </div>
        </div>
      </div>

      {/* Question */}
      {currentQuestion && (
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Question Card */}
          <Card className="mb-8 bg-white/10 backdrop-blur-sm border-white/20 mx-4 sm:mx-0">
            <div className="text-center">
              <div className="text-4xl sm:text-6xl mb-4">{currentQuestion.image}</div>
              <h2 className="text-lg sm:text-2xl font-bold text-white mb-6">
                {currentQuestion.question}
              </h2>
            </div>
          </Card>

          {/* Answer Options */}
          <div className="grid grid-cols-1 gap-4 mb-8 px-4 sm:px-0 sm:grid-cols-2">
            {currentQuestion.options.map((option, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: showResult ? 1 : 1.05 }}
                whileTap={{ scale: showResult ? 1 : 0.95 }}
              >
                <Card
                  isHoverable={!showResult}
                  onClick={() => !showResult && handleAnswerSelect(index)}
                  className={`text-center cursor-pointer transition-all duration-300 min-h-[60px] flex items-center justify-center ${
                    showResult
                      ? index === currentQuestion.correctAnswer
                        ? 'bg-green-600 border-green-400 ring-2 ring-green-300'
                        : index === selectedAnswer
                        ? 'bg-red-600 border-red-400 ring-2 ring-red-300'
                        : 'bg-white/10 border-white/20'
                      : 'bg-white/10 hover:bg-white/20 border-white/20'
                  }`}
                >
                  <p className="text-lg sm:text-xl font-bold text-white">{option}</p>
                  {showResult && index === currentQuestion.correctAnswer && (
                    <div className="text-2xl mt-2">✅</div>
                  )}
                  {showResult && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                    <div className="text-2xl mt-2">❌</div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <Card className="bg-blue-500/80 backdrop-blur-sm border-blue-300">
                  <div className="text-4xl mb-2">💡</div>
                  <p className="text-white text-lg font-bold">
                    {currentQuestion.explanation}
                  </p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Progress Bar */}
      {selectedLevel && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-80">
          <div className="bg-white/20 rounded-full h-4 overflow-hidden">
            <motion.div
              className="h-full bg-yellow-400"
              initial={{ width: 0 }}
              animate={{ width: `${((questionIndex + 1) / selectedLevel.maxQuestions) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-center text-white text-sm mt-2">
            {questionIndex + 1} von {selectedLevel.maxQuestions} Fragen
          </p>
        </div>
      )}
    </div>
  );
}
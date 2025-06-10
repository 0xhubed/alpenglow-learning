'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import { BookOpen, Calculator, Trees, Music, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAudio } from '@/hooks/useAudio';

const games = [
  {
    id: 'buchstaben',
    title: 'Buchstaben-Berg',
    description: 'Klettere den Berg hoch und lerne dabei Buchstaben!',
    icon: BookOpen,
    color: 'from-blue-400 to-blue-600',
    bgColor: 'bg-blue-50',
    available: true,
  },
  {
    id: 'zahlen',
    title: 'Zahlen-Express',
    description: 'Fahre mit dem Zug und entdecke die Welt der Zahlen!',
    icon: Calculator,
    color: 'from-green-400 to-green-600',
    bgColor: 'bg-green-50',
    available: true,
  },
  {
    id: 'natur',
    title: 'Tier-Safari',
    description: 'Entdecke die Schweizer Tierwelt auf einer spannenden Safari!',
    icon: Trees,
    color: 'from-yellow-400 to-yellow-600',
    bgColor: 'bg-yellow-50',
    available: true,
  },
  {
    id: 'musik',
    title: 'Alphorn-Melodie',
    description: 'Spiele wunderschöne Melodien mit dem Alphorn!',
    icon: Music,
    color: 'from-purple-400 to-purple-600',
    bgColor: 'bg-purple-50',
    available: false,
  },
];

export default function GamesPage() {
  const router = useRouter();
  const { playSound } = useAudio();

  const handleGameSelect = (gameId: string, available: boolean) => {
    if (!available) {
      playSound('error');
      return;
    }
    playSound('click');
    router.push(`/spiele/${gameId}`);
  };

  const handleBack = () => {
    playSound('click');
    router.push('/');
  };

  return (
    <div className="min-h-screen p-8">
      <div className="game-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Button
            variant="secondary"
            icon={ArrowLeft}
            onClick={handleBack}
            className="mb-6"
          >
            Zurück
          </Button>
          
          <h1 className="text-4xl font-bold text-gray-800 text-center">
            Wähle dein Spiel!
          </h1>
          <p className="text-xl text-gray-600 text-center mt-2">
            Klicke auf ein Spiel, um zu beginnen
          </p>
        </motion.div>

        {/* Games Grid */}
        <div className="game-grid">
          {games.map((game, index) => {
            const Icon = game.icon;
            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  isHoverable={game.available}
                  onClick={() => handleGameSelect(game.id, game.available)}
                  className={`relative ${!game.available ? 'opacity-50 cursor-not-allowed' : ''} ${game.bgColor}`}
                >
                  {!game.available && (
                    <div className="absolute top-2 right-2 bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Bald verfügbar
                    </div>
                  )}
                  
                  <div className={`w-full h-32 rounded-lg bg-gradient-to-br ${game.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-16 h-16 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {game.title}
                  </h3>
                  
                  <p className="text-gray-600">
                    {game.description}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
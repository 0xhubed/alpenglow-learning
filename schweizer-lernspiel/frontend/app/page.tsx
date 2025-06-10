'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { Play, Mountain, Sparkles } from 'lucide-react';
import { useAudio } from '@/hooks/useAudio';

export default function Home() {
  const router = useRouter();
  const { playSound } = useAudio();

  const handleStartGame = () => {
    playSound('click');
    router.push('/spiele');
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-20"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-32 h-32 bg-blue-400 rounded-full opacity-20"
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="game-container relative z-10 min-h-screen flex flex-col items-center justify-center text-center">
        {/* Logo/Title */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Mountain className="w-16 h-16 text-blue-600 mr-4" />
            <h1 className="text-6xl font-bold text-gray-800">
              Schweizer Abenteuerland
            </h1>
          </div>
          <p className="text-xl text-gray-600">Ein spannendes Lernspiel für Erstklässler</p>
        </motion.div>

        {/* Hero illustration placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12 relative"
        >
          <div className="w-96 h-64 bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl shadow-2xl flex items-center justify-center">
            <Sparkles className="w-32 h-32 text-yellow-500 animate-pulse" />
          </div>
          <motion.div
            className="absolute -top-4 -right-4 w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-2xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            +
          </motion.div>
        </motion.div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Button
            size="lg"
            icon={Play}
            onClick={handleStartGame}
            className="text-xl px-12 py-6"
          >
            Spiel starten
          </Button>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl"
        >
          {[
            { title: 'Buchstaben', emoji: '📝', color: 'bg-blue-100 text-blue-600' },
            { title: 'Zahlen', emoji: '🔢', color: 'bg-green-100 text-green-600' },
            { title: 'Natur', emoji: '🌲', color: 'bg-yellow-100 text-yellow-600' },
            { title: 'Musik', emoji: '🎵', color: 'bg-red-100 text-red-600' },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-6 rounded-xl ${feature.color} cursor-pointer transition-all duration-200`}
            >
              <div className="text-4xl mb-2">{feature.emoji}</div>
              <h3 className="font-semibold">{feature.title}</h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
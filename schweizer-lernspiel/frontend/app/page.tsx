'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo, useCallback } from 'react';
import Button from '@/components/ui/Button';
import { Play, Sparkles } from 'lucide-react';
import { useAudio } from '@/hooks/useAudio';

// Memoized components for better performance
const Cloud = ({ index }: { index: number }) => {
  const size = useMemo(() => 60 + Math.random() * 80, []);
  const startY = useMemo(() => 10 + Math.random() * 30, []);
  const duration = useMemo(() => 25 + Math.random() * 15, []);
  
  return (
    <motion.div
      className="absolute opacity-20 will-change-transform"
      style={{
        left: '-100px',
        top: `${startY}%`,
        fontSize: `${size}px`,
      }}
      animate={{
        x: ['0vw', '110vw'],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "linear",
        delay: index * 5,
      }}
    >
      ☁️
    </motion.div>
  );
};

const SparkleParticle = () => {
  const randomX = useMemo(() => Math.random() * 100, []);
  const randomY = useMemo(() => Math.random() * 100, []);
  const moveDistance = useMemo(() => 15 + Math.random() * 25, []);
  const isSpecial = useMemo(() => Math.random() > 0.8, []);
  const specialEmoji = useMemo(() => Math.random() > 0.5 ? '✨' : '⭐', []);
  
  return (
    <motion.div
      className={`absolute ${isSpecial ? 'text-lg' : 'w-2 h-2'} ${isSpecial ? '' : 'bg-white rounded-full'} will-change-transform`}
      style={{
        left: `${randomX}%`,
        top: `${randomY}%`,
      }}
      animate={{
        x: [0, moveDistance, -moveDistance, 0],
        y: [0, -moveDistance, moveDistance, 0],
        opacity: [0.2, 1, 0.2],
        scale: [0.5, 1.2, 0.5],
        rotate: isSpecial ? [0, 360] : 0,
      }}
      transition={{
        duration: 6 + Math.random() * 6,
        repeat: Infinity,
        delay: Math.random() * 8,
        ease: "easeInOut",
      }}
    >
      {isSpecial ? specialEmoji : ''}
    </motion.div>
  );
};

const AdventureCharacter = ({ character, index }: { character: { emoji: string; color: string }, index: number }) => {
  const xOffset = useMemo(() => Math.sin(index) * 10, [index]);
  
  return (
    <motion.div
      className="absolute text-2xl drop-shadow-lg cursor-pointer"
      style={{
        left: `${25 + (index * 10)}%`,
        top: `${35 + (index % 2) * 30}%`,
      }}
      animate={{
        y: [0, -15, 0],
        x: [0, xOffset, 0],
        rotate: [0, 10, -10, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 3 + (index * 0.5),
        repeat: Infinity,
        delay: index * 0.3,
        ease: "easeInOut",
      }}
      whileHover={{ scale: 1.5, rotate: 360 }}
    >
      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${character.color} opacity-30 absolute -inset-1 blur-sm`}></div>
      {character.emoji}
    </motion.div>
  );
};

const MagicalParticle = ({ index }: { index: number }) => {
  const angle = useMemo(() => (index * Math.PI) / 4, [index]);
  
  return (
    <motion.div
      className="absolute w-2 h-2 bg-yellow-400 rounded-full"
      style={{
        left: `${50 + 40 * Math.cos(angle)}%`,
        top: `${50 + 40 * Math.sin(angle)}%`,
      }}
      animate={{
        scale: [0.5, 1.5, 0.5],
        opacity: [0.3, 1, 0.3],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        delay: index * 0.2,
      }}
    />
  );
};

export default function Home() {
  const router = useRouter();
  const { playSound } = useAudio({ preloadSounds: true });
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleStartGame = useCallback(() => {
    playSound('click');
    router.push('/profil');
  }, [playSound, router]);

  // Memoized static content
  const characters = useMemo(() => [
    { emoji: '🦁', color: 'from-orange-400 to-red-500' },
    { emoji: '🦄', color: 'from-purple-400 to-pink-500' },
    { emoji: '🐺', color: 'from-blue-400 to-indigo-500' },
    { emoji: '🐸', color: 'from-green-400 to-emerald-500' },
    { emoji: '🐱', color: 'from-pink-400 to-rose-500' },
    { emoji: '🦋', color: 'from-cyan-400 to-blue-500' }
  ], []);

  const clouds = useMemo(() => Array.from({ length: 6 }, (_, i) => i), []);
  const sparkles = useMemo(() => Array.from({ length: 15 }, (_, i) => i), []);
  const magicalParticles = useMemo(() => Array.from({ length: 8 }, (_, i) => i), []);

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Enhanced Dynamic Background */}
      <div className="absolute inset-0 z-0">
        {/* Base gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-blue-400/10 to-white/20"></div>
        
        {/* Floating Clouds - Reduced number and optimized */}
        {isClient && clouds.map((i) => (
          <Cloud key={`cloud-${i}`} index={i} />
        ))}
        
        {/* Enhanced Sparkle Particles - Reduced number */}
        {isClient && sparkles.map((i) => (
          <SparkleParticle key={`particle-${i}`} />
        ))}

        {/* Mountain Silhouettes */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-800/30 to-transparent">
          <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1200 200" fill="none">
            <path 
              d="M0,200 L0,120 L200,60 L400,100 L600,40 L800,80 L1000,50 L1200,90 L1200,200 Z" 
              fill="url(#mountainGradient)"
              opacity="0.6"
            />
            <defs>
              <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#1e293b', stopOpacity: 0.8 }} />
                <stop offset="100%" style={{ stopColor: '#0f172a', stopOpacity: 0.4 }} />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Ambient light orbs - Optimized animations */}
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl will-change-transform"
          animate={{
            x: [0, 120, -80, 0],
            y: [0, -60, 80, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-80 h-80 bg-gradient-to-r from-pink-500/15 to-yellow-500/15 rounded-full blur-2xl will-change-transform"
          style={{ right: 0, bottom: '20%' }}
          animate={{
            x: [0, -100, 60, 0],
            y: [0, 60, -40, 0],
            scale: [0.8, 1.1, 0.9, 0.8],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Hero Section */}
      <motion.div 
        style={{ y: y1 }}
        className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative">
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold leading-tight">
              <motion.span
                className="block bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent drop-shadow-2xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                style={{
                  textShadow: '0 0 30px rgba(255,255,255,0.5)',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                }}
              >
                Schweizer
              </motion.span>
              <motion.span
                className="block bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                }}
                transition={{ duration: 0.8, delay: 0.6 }}
                style={{
                  textShadow: '0 0 40px rgba(255,215,0,0.6)',
                  filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.4))',
                }}
              >
                Abenteuerland
              </motion.span>
            </h1>
            
            {/* Magical sparkles around title */}
            <motion.div
              className="absolute -top-4 -right-4 text-3xl"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              ✨
            </motion.div>
            <motion.div
              className="absolute top-1/2 -left-8 text-2xl"
              animate={{ 
                y: [-10, 10, -10],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🌟
            </motion.div>
          </div>
          
          <motion.p 
            className="text-xl sm:text-2xl text-blue-100 mt-6 max-w-2xl mx-auto font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            style={{
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            🎮 Ein Lernspiel für Erstklässler 🇨🇭
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mb-12 relative"
        >
          {/* Enhanced Swiss Adventure Preview */}
          <div className="relative w-80 sm:w-96 h-64 bg-gradient-to-br from-blue-500/20 to-green-500/20 backdrop-blur-sm rounded-3xl border border-white/30 flex items-center justify-center overflow-hidden shadow-2xl">
            {/* Animated Swiss landscape background */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-white/20 opacity-70" 
                 style={{
                   clipPath: 'polygon(20% 40%, 80% 35%, 90% 45%, 85% 65%, 60% 75%, 40% 70%, 15% 55%)'
                 }}>
            </div>
            
            {/* Rotating Swiss flag with better animation */}
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
              className="text-6xl z-10 drop-shadow-lg"
            >
              🇨🇭
            </motion.div>
            
            {/* Enhanced floating characters with trail effects */}
            {characters.map((character, i) => (
              <AdventureCharacter key={i} character={character} index={i} />
            ))}
            
            {/* Floating game elements */}
            <motion.div
              className="absolute top-2 right-2 text-lg opacity-60"
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              📚
            </motion.div>
            <motion.div
              className="absolute bottom-2 left-2 text-lg opacity-60"
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              🎯
            </motion.div>
          </div>

          {/* Enhanced glow effect */}
          <div className="absolute -inset-6 bg-gradient-to-r from-blue-500/20 via-purple-500/30 to-pink-500/20 rounded-3xl blur-2xl opacity-80 animate-pulse"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mb-16"
        >
          {/* Enhanced Call-to-Action Button */}
          <div className="relative">
            {/* Magical particle ring around button */}
            <motion.div
              className="absolute -inset-8 opacity-50"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              {magicalParticles.map((i) => (
                <MagicalParticle key={i} index={i} />
              ))}
            </motion.div>

            <motion.div
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 60px rgba(147, 51, 234, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              className="relative z-10"
            >
              <Button
                size="lg"
                icon={Play}
                onClick={handleStartGame}
                className="text-xl sm:text-2xl px-10 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 border-none shadow-2xl relative overflow-hidden group font-bold"
                style={{
                  backgroundSize: '200% 100%',
                  animation: 'gradientShift 3s ease infinite',
                }}
              >
                <span className="relative z-10 flex items-center gap-3">
                  <motion.span
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🎮
                  </motion.span>
                  Profil erstellen & Spielen
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-6 h-6" />
                  </motion.div>
                </span>
                
                {/* Animated background effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 via-pink-400/30 to-purple-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
                  style={{ transform: 'skewX(-20deg)' }}
                />
              </Button>
            </motion.div>
          </div>


          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="mt-6"
          >
            <span className="text-sm text-gray-400">© 2025 Daniel Huber</span>
          </motion.div>
        </motion.div>

      </motion.div>

    </main>
  );
}
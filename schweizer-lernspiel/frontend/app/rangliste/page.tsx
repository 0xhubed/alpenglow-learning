'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trophy, Medal, Crown, Star, Calendar, GamepadIcon, TrendingUp } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import useGameStore from '@/store/useGameStore';

export default function RanglistePage() {
  const router = useRouter();
  const { user, leaderboard } = useGameStore();
  const [showStats, setShowStats] = useState(false);

  const handleBackToOverview = () => {
    router.push('/spiele');
  };

  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.totalPoints - a.totalPoints);
  const userRank = user ? sortedLeaderboard.findIndex(entry => entry.id === user.id) + 1 : 0;
  
  // Get top 10 for full leaderboard
  const topPlayers = sortedLeaderboard.slice(0, 10);
  
  // Calculate some stats
  const totalPlayers = leaderboard.length;
  const totalPoints = leaderboard.reduce((sum, player) => sum + player.totalPoints, 0);
  const totalGames = leaderboard.reduce((sum, player) => sum + player.gamesCompleted, 0);
  const averagePoints = totalPlayers > 0 ? Math.round(totalPoints / totalPlayers) : 0;

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return <div className="w-6 h-6 flex items-center justify-center text-white font-bold">{position}</div>;
    }
  };

  const getRankColor = (position: number) => {
    switch (position) {
      case 1: return 'from-yellow-400 to-yellow-600';
      case 2: return 'from-gray-300 to-gray-500';
      case 3: return 'from-amber-500 to-amber-700';
      default: return 'from-blue-400 to-blue-600';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', { 
      day: '2-digit', 
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-400 via-orange-300 to-red-400 p-4 sm:p-8 game-area">
      {/* Back Button */}
      <div className="mb-4">
        <Button
          variant="secondary"
          icon={ArrowLeft}
          onClick={handleBackToOverview}
          className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
        >
          Zurück zu den Spielen
        </Button>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-6xl sm:text-8xl mb-4">🏆</div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            Rangliste
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-6">
            Die besten Spieler im Schweizer Abenteuerland
          </p>
          
          {/* Current User Stats */}
          {user && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-4 bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 mb-4"
            >
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${user.avatar.color} flex items-center justify-center text-2xl`}>
                {user.avatar.emoji}
              </div>
              <div className="text-white">
                <div className="font-bold text-lg">{user.username}</div>
                <div className="text-sm text-white/80">
                  {userRank > 0 ? `Platz ${userRank}` : 'Noch nicht gerankt'} • {user.totalPoints} Punkte
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Stats Toggle */}
        <div className="text-center mb-6">
          <Button
            onClick={() => setShowStats(!showStats)}
            variant="secondary"
            className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
          >
            {showStats ? 'Statistiken ausblenden' : 'Statistiken anzeigen'}
          </Button>
        </div>

        {/* Global Statistics */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <Card className="bg-white/20 backdrop-blur-sm border-white/30">
                <h3 className="text-xl font-bold text-white mb-4 text-center">📊 Spielstatistiken</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-white">{totalPlayers}</div>
                    <div className="text-sm text-white/80">Spieler</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-white">{totalPoints.toLocaleString()}</div>
                    <div className="text-sm text-white/80">Gesamtpunkte</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-white">{totalGames}</div>
                    <div className="text-sm text-white/80">Gespielte Runden</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-white">{averagePoints}</div>
                    <div className="text-sm text-white/80">⌀ Punkte</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-white/20 backdrop-blur-sm border-white/30">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">
              🥇 Top {Math.min(topPlayers.length, 10)} Spieler
            </h3>
            
            {topPlayers.length > 0 ? (
              <div className="space-y-3">
                {topPlayers.map((entry, index) => {
                  const position = index + 1;
                  const isCurrentUser = entry.id === user?.id;
                  
                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`relative p-4 rounded-xl transition-all duration-300 ${
                        isCurrentUser
                          ? 'bg-yellow-400/40 border-2 border-yellow-400 ring-2 ring-yellow-300 transform scale-105'
                          : position <= 3
                          ? 'bg-white/20 border border-white/40'
                          : 'bg-white/10 border border-white/20'
                      }`}
                    >
                      {/* Position Badge */}
                      <div className={`absolute -top-2 -left-2 w-10 h-10 rounded-full bg-gradient-to-br ${getRankColor(position)} flex items-center justify-center shadow-lg`}>
                        {getRankIcon(position)}
                      </div>
                      
                      <div className="flex items-center ml-6">
                        {/* Avatar */}
                        <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br ${entry.avatar.color} flex items-center justify-center text-xl sm:text-2xl mr-4 shadow-lg`}>
                          {entry.avatar.emoji}
                        </div>
                        
                        {/* Player Info */}
                        <div className="flex-1 min-w-0">
                          <div className={`text-lg sm:text-xl font-bold truncate ${
                            isCurrentUser ? 'text-gray-800' : 'text-white'
                          }`}>
                            {entry.username}
                            {isCurrentUser && (
                              <span className="ml-2 text-sm bg-yellow-500 text-gray-800 px-2 py-1 rounded-full">
                                Du!
                              </span>
                            )}
                          </div>
                          <div className={`text-sm flex items-center gap-4 ${
                            isCurrentUser ? 'text-gray-600' : 'text-white/80'
                          }`}>
                            <span className="flex items-center gap-1">
                              <GamepadIcon className="w-4 h-4" />
                              {entry.gamesCompleted} Spiele
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(entry.lastPlayed)}
                            </span>
                          </div>
                        </div>
                        
                        {/* Points */}
                        <div className="text-right">
                          <div className={`text-xl sm:text-2xl font-bold ${
                            isCurrentUser ? 'text-gray-800' : 'text-yellow-400'
                          }`}>
                            {entry.totalPoints.toLocaleString()}
                          </div>
                          <div className={`text-sm ${
                            isCurrentUser ? 'text-gray-600' : 'text-white/80'
                          }`}>
                            Punkte
                          </div>
                        </div>
                      </div>
                      
                      {/* Special Effects for Top 3 */}
                      {position <= 3 && (
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50 pointer-events-none" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎮</div>
                <h3 className="text-xl font-bold text-white mb-2">Noch keine Spieler!</h3>
                <p className="text-white/80 mb-6">
                  Sei der erste, der ein Spiel spielt und die Rangliste anführt!
                </p>
                <Button
                  onClick={() => router.push('/spiele')}
                  variant="primary"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  Jetzt spielen!
                </Button>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Additional Info */}
        {topPlayers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 inline-block">
              <div className="flex items-center gap-3 text-white/80">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm">
                  Die Rangliste wird automatisch aktualisiert, wenn du Spiele spielst!
                </span>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
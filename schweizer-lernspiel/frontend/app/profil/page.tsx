'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trophy, Star, GamepadIcon } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import useGameStore from '@/store/useGameStore';

export default function ProfilPage() {
  const router = useRouter();
  const { 
    user, 
    availableAvatars, 
    leaderboard, 
    setUser, 
    selectAvatar, 
    updateLeaderboard,
    cleanupLeaderboard,
    resetData 
  } = useGameStore();
  
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>(user?.avatar?.id || '');
  const [username, setUsername] = useState(user?.username || '');
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    // Clean up leaderboard on component mount
    cleanupLeaderboard();
    
    // Initialize selected avatar if user exists
    if (user) {
      setSelectedAvatarId(user.avatar.id);
      setUsername(user.avatar.name);
      
      // Ensure username matches avatar name (fix for old test data)
      if (user.username !== user.avatar.name) {
        const updatedUser = {
          ...user,
          username: user.avatar.name,
        };
        setUser(updatedUser);
      }
    }
  }, [user, setUser, cleanupLeaderboard]);

  const handleBackToOverview = () => {
    router.push('/spiele');
  };

  const handleSaveProfile = () => {
    if (!selectedAvatarId) return;
    
    const selectedAvatar = availableAvatars.find(a => a.id === selectedAvatarId);
    if (!selectedAvatar) return;
    
    if (!user) {
      // Create new user with selected avatar
      const newUser = {
        id: selectedAvatarId, // Use avatar id as user id
        username: selectedAvatar.name,
        email: '',
        avatar: selectedAvatar,
        totalPoints: 0,
        currentLevel: 1,
        gamesCompleted: 0,
        achievements: [],
      };
      setUser(newUser);
    } else {
      // Update existing user's avatar
      const updatedUser = {
        ...user,
        username: selectedAvatar.name,
        avatar: selectedAvatar,
      };
      setUser(updatedUser);
    }
    
    updateLeaderboard();
    router.push('/spiele');
  };

  const toggleLeaderboard = () => {
    setShowLeaderboard(!showLeaderboard);
  };

  // No need to check for user - anyone can select an avatar

  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.totalPoints - a.totalPoints);
  const userRank = user ? sortedLeaderboard.findIndex(entry => entry.id === user.id) + 1 : 0;
  
  // Limit leaderboard to top 5 entries
  const displayLeaderboard = sortedLeaderboard.slice(0, 5);
  
  // Check if there are invalid usernames (for debugging)
  const validAvatarNames = availableAvatars.map(avatar => avatar.name);
  const hasInvalidData = user && !validAvatarNames.includes(user.username);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-400 via-pink-300 to-purple-500 p-4 sm:p-8 game-area">
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

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-6xl sm:text-8xl mb-4">🎭</div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            Wähle dein Tier!
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-2">
            Leo, Lynn, Elia, Nean, Lia, Noena oder Gast?
          </p>
          <p className="text-sm sm:text-lg text-white/70">
            Eltern können "Gast" wählen um die App zu erkunden
          </p>
        </motion.div>

        {/* Current Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-2 sm:gap-4 mb-8 px-4 sm:px-0"
        >
          <Card className="bg-white/20 backdrop-blur-sm border-white/30 text-center p-3 sm:p-6">
            <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-lg sm:text-2xl font-bold text-white">{user?.totalPoints || 0}</div>
            <div className="text-xs sm:text-base text-white/80">Punkte</div>
          </Card>
          
          <Card className="bg-white/20 backdrop-blur-sm border-white/30 text-center p-3 sm:p-6">
            <GamepadIcon className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 mx-auto mb-2" />
            <div className="text-lg sm:text-2xl font-bold text-white">{user?.gamesCompleted || 0}</div>
            <div className="text-xs sm:text-base text-white/80">Spiele</div>
          </Card>
          
          <Card className="bg-white/20 backdrop-blur-sm border-white/30 text-center p-3 sm:p-6">
            <Star className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-lg sm:text-2xl font-bold text-white">#{userRank || '-'}</div>
            <div className="text-xs sm:text-base text-white/80">Rang</div>
          </Card>
        </motion.div>


        {/* Avatar Selection - Main Focus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 px-4 sm:px-0"
        >
          <Card className="bg-white/30 backdrop-blur-sm border-white/50 shadow-2xl">
            <div className="text-center mb-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                🎯 Tier-Auswahl
              </h3>
              <p className="text-sm sm:text-lg text-white/90">
                Klicke auf dein Lieblingstier oder wähle "Gast" als Elternteil
              </p>
            </div>
            
            {/* Animals Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
              {availableAvatars.filter(avatar => avatar.id !== 'gast').map((avatar) => (
                <motion.div
                  key={avatar.id}
                  whileHover={{ scale: 1.08, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`cursor-pointer transition-all duration-300 ${
                    selectedAvatarId === avatar.id ? 'ring-4 ring-yellow-400 ring-offset-2 ring-offset-purple-500' : ''
                  }`}
                  onClick={() => {
                    setSelectedAvatarId(avatar.id);
                    setUsername(avatar.name);
                  }}
                >
                  <Card className={`text-center h-full ${
                    selectedAvatarId === avatar.id 
                      ? 'bg-yellow-200/90 border-yellow-400 border-2 shadow-lg' 
                      : 'bg-white/15 border-white/30 hover:bg-white/25 hover:border-white/50'
                  }`}>
                    <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br ${avatar.color} flex items-center justify-center text-3xl sm:text-5xl mx-auto mb-4 shadow-lg`}>
                      {avatar.emoji}
                    </div>
                    <h4 className={`text-lg sm:text-xl font-bold mb-2 ${
                      selectedAvatarId === avatar.id ? 'text-gray-800' : 'text-white'
                    }`}>
                      {avatar.name}
                    </h4>
                    <p className={`text-xs sm:text-sm mb-2 ${
                      selectedAvatarId === avatar.id ? 'text-gray-700' : 'text-white/80'
                    }`}>
                      {avatar.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            {/* Guest Option - Separate and Special */}
            <div className="border-t border-white/30 pt-6">
              <p className="text-center text-white/90 mb-4 text-sm sm:text-base">
                👨‍👩‍👧‍👦 <strong>Für Eltern und Besucher:</strong>
              </p>
              {(() => {
                const guestAvatar = availableAvatars.find(avatar => avatar.id === 'gast');
                return guestAvatar ? (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`cursor-pointer transition-all duration-300 max-w-sm mx-auto ${
                      selectedAvatarId === guestAvatar.id ? 'ring-4 ring-yellow-400 ring-offset-2 ring-offset-purple-500' : ''
                    }`}
                    onClick={() => {
                      setSelectedAvatarId(guestAvatar.id);
                      setUsername(guestAvatar.name);
                    }}
                  >
                    <Card className={`text-center ${
                      selectedAvatarId === guestAvatar.id 
                        ? 'bg-yellow-200/90 border-yellow-400 border-2 shadow-lg' 
                        : 'bg-gray-500/20 border-gray-300/40 hover:bg-gray-400/30'
                    }`}>
                      <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${guestAvatar.color} flex items-center justify-center text-2xl sm:text-3xl mx-auto mb-3 shadow-lg`}>
                        {guestAvatar.emoji}
                      </div>
                      <h4 className={`text-base sm:text-lg font-bold mb-2 ${
                        selectedAvatarId === guestAvatar.id ? 'text-gray-800' : 'text-white'
                      }`}>
                        {guestAvatar.name}
                      </h4>
                      <p className={`text-xs sm:text-sm ${
                        selectedAvatarId === guestAvatar.id ? 'text-gray-700' : 'text-white/80'
                      }`}>
                        {guestAvatar.description}
                      </p>
                    </Card>
                  </motion.div>
                ) : null;
              })()}
            </div>
          </Card>
        </motion.div>

        {/* Action Buttons - Prominent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center px-4 sm:px-0"
        >
          <div className="space-y-4">
            {/* Main Action Button - Most Prominent */}
            <motion.div
              whileHover={selectedAvatarId ? { scale: 1.05 } : {}}
              whileTap={selectedAvatarId ? { scale: 0.95 } : {}}
            >
              <Button
                onClick={handleSaveProfile}
                variant="primary"
                disabled={!selectedAvatarId}
                className={`w-full sm:w-auto px-8 py-4 text-xl sm:text-2xl font-bold shadow-xl ${
                  selectedAvatarId 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-none'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
              >
                {selectedAvatarId ? (
                  <span className="flex items-center gap-3">
                    🎮 Jetzt Spielen! 
                    {selectedAvatarId !== 'gast' && <span className="text-lg">🦁🦄🐺🐸🐱🦋</span>}
                  </span>
                ) : (
                  '👆 Wähle zuerst dein Tier'
                )}
              </Button>
            </motion.div>
            
            {/* Secondary Actions */}
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button
                onClick={toggleLeaderboard}
                variant="success"
                className="w-full sm:w-auto bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                {showLeaderboard ? '📋 Top 5 verstecken' : '🏆 Top 5 anzeigen'}
              </Button>
              
              {/* Debug button - only show if there's invalid data */}
              {hasInvalidData && (
                <Button
                  onClick={() => {
                    resetData();
                    window.location.reload();
                  }}
                  variant="secondary"
                  className="w-full sm:w-auto bg-red-500 text-white hover:bg-red-600"
                >
                  🔧 Daten zurücksetzen
                </Button>
              )}
            </div>
            
            {/* Selected Animal Display */}
            {selectedAvatarId && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-4 bg-white/20 rounded-lg backdrop-blur-sm inline-block"
              >
                <p className="text-white text-sm sm:text-base">
                  ✅ <strong>Ausgewählt:</strong> {username}
                  {selectedAvatarId === 'gast' && ' (Eltern-Modus)'}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Leaderboard */}
        <AnimatePresence>
          {showLeaderboard && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Card className="bg-white/20 backdrop-blur-sm border-white/30 mx-4 sm:mx-0">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">🏆 Top 5</h3>
                <div className="space-y-3">
                  {displayLeaderboard.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center p-3 sm:p-4 rounded-lg ${
                        entry.id === user?.id 
                          ? 'bg-yellow-400/30 border-2 border-yellow-400' 
                          : 'bg-white/10'
                      }`}
                    >
                      {/* Rank */}
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-bold text-base sm:text-lg mr-3 sm:mr-4">
                        {index + 1}
                      </div>
                      
                      {/* Avatar */}
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${entry.avatar.color} flex items-center justify-center text-lg sm:text-xl mr-3 sm:mr-4`}>
                        {entry.avatar.emoji}
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="text-base sm:text-lg font-bold text-white truncate">{entry.username}</div>
                        <div className="text-xs sm:text-sm text-white/80">{entry.gamesCompleted} Spiele</div>
                      </div>
                      
                      {/* Points */}
                      <div className="text-right">
                        <div className="text-lg sm:text-xl font-bold text-yellow-400">{entry.totalPoints}</div>
                        <div className="text-xs sm:text-sm text-white/80">Punkte</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
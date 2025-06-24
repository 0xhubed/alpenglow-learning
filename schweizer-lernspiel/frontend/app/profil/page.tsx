'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trophy, Star, GamepadIcon, RefreshCw, Check, Crown } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import useGameStore from '@/store/useGameStore';

export default function ProfilPage() {
  const router = useRouter();
  const { 
    user, 
    leaderboard, 
    createUser,
    updateLeaderboard,
    resetData,
    getAvatarEmojis,
    getAvatarColors
  } = useGameStore();
  
  const [username, setUsername] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  
  const avatarEmojis = getAvatarEmojis();
  const avatarColors = getAvatarColors();
  
  console.log('Avatar emojis:', avatarEmojis.length);
  console.log('Avatar colors:', avatarColors.length);

  useEffect(() => {
    // If user exists, redirect to games
    if (user && !isCreatingUser) {
      setUsername(user.username);
      setSelectedEmoji(user.avatar.emoji);
      setSelectedColor(user.avatar.color);
    }
  }, [user, isCreatingUser]);

  const handleBackToOverview = () => {
    router.push('/');
  };

  const handleGoToGames = () => {
    router.push('/spiele');
  };

  const handleCreateUser = () => {
    if (!username.trim() || !selectedEmoji || !selectedColor) return;
    
    createUser(username.trim(), selectedEmoji, selectedColor);
    updateLeaderboard();
    router.push('/spiele');
  };

  const handleNewUser = () => {
    setIsCreatingUser(true);
    setUsername('');
    setSelectedEmoji('');
    setSelectedColor('');
    resetData();
  };

  const handleLeaderboard = () => {
    router.push('/rangliste');
  };

  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.totalPoints - a.totalPoints);
  const userRank = user ? sortedLeaderboard.findIndex(entry => entry.id === user.id) + 1 : 0;
  
  // Limit leaderboard to top 5 entries
  const displayLeaderboard = sortedLeaderboard.slice(0, 5);

  const isFormValid = username.trim().length > 0 && selectedEmoji && selectedColor;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-400 via-pink-300 to-purple-500 p-4 sm:p-8 game-area">
      {/* Navigation Buttons */}
      <div className="mb-4 flex gap-3">
        <Button
          variant="secondary"
          icon={ArrowLeft}
          onClick={handleBackToOverview}
          className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
        >
          Zurück
        </Button>
        {user && (
          <Button
            variant="primary"
            onClick={handleGoToGames}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            🎮 Zu den Spielen
          </Button>
        )}
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-6xl sm:text-8xl mb-4">🎮</div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            {user && !isCreatingUser ? 'Dein Profil' : 'Erstelle dein Profil'}
          </h1>
          <p className="text-lg sm:text-xl text-white/90">
            {user && !isCreatingUser ? 'Schau dir deine Fortschritte an!' : 'Wähle einen Namen und dein Aussehen'}
          </p>
        </motion.div>

        {/* Current Stats - Only show if user exists */}
        {user && !isCreatingUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-2 sm:gap-4 mb-8 px-4 sm:px-0"
          >
            <Card className="bg-white/20 backdrop-blur-sm border-white/30 text-center p-3 sm:p-6">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-lg sm:text-2xl font-bold text-white">{user.totalPoints}</div>
              <div className="text-xs sm:text-base text-white/80">Punkte</div>
            </Card>
            
            <Card className="bg-white/20 backdrop-blur-sm border-white/30 text-center p-3 sm:p-6">
              <GamepadIcon className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 mx-auto mb-2" />
              <div className="text-lg sm:text-2xl font-bold text-white">{user.gamesCompleted}</div>
              <div className="text-xs sm:text-base text-white/80">Spiele</div>
            </Card>
            
            <Card className="bg-white/20 backdrop-blur-sm border-white/30 text-center p-3 sm:p-6">
              <Star className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-lg sm:text-2xl font-bold text-white">#{userRank || '-'}</div>
              <div className="text-xs sm:text-base text-white/80">Rang</div>
            </Card>
          </motion.div>
        )}

        {/* User Creation Form or Profile Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 px-4 sm:px-0"
        >
          {user && !isCreatingUser ? (
            // Show existing user profile
            <Card className="bg-white/30 backdrop-blur-sm border-white/50 shadow-2xl">
              <div className="text-center mb-6">
                <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br ${user.avatar.color} flex items-center justify-center text-5xl sm:text-6xl mx-auto mb-4 shadow-lg`}>
                  {user.avatar.emoji}
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  {user.username}
                </h2>
                <p className="text-white/80">Level {user.currentLevel}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Button
                  onClick={handleLeaderboard}
                  variant="secondary"
                  icon={Crown}
                  className="bg-yellow-400 text-gray-800 hover:bg-yellow-500"
                >
                  🏆 Rangliste anzeigen
                </Button>
                <Button
                  onClick={handleNewUser}
                  variant="secondary"
                  icon={RefreshCw}
                  className="bg-orange-400 text-gray-800 hover:bg-orange-500"
                >
                  Neuer Spieler
                </Button>
              </div>
            </Card>
          ) : (
            // Show user creation form
            <Card className="bg-white/30 backdrop-blur-sm border-white/50 shadow-2xl">
              <div className="space-y-6" suppressHydrationWarning>
                {/* Username Input */}
                <div>
                  <label className="block text-white font-bold mb-2 text-lg">
                    Wie heißt du?
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Dein Name"
                    maxLength={20}
                    className="w-full px-4 py-3 rounded-lg bg-white/80 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-yellow-400 text-lg"
                    suppressHydrationWarning
                  />
                </div>

                {/* Avatar Selection */}
                <div>
                  <label className="block text-white font-bold mb-2 text-lg">
                    Wähle dein Aussehen
                  </label>
                  
                  {/* Selected Avatar Preview */}
                  <div className="flex justify-center mb-4">
                    <div 
                      onClick={() => selectedEmoji && setShowEmojiPicker(!showEmojiPicker)}
                      className={`w-24 h-24 rounded-full ${selectedColor || 'bg-gray-300'} ${selectedColor && `bg-gradient-to-br ${selectedColor}`} flex items-center justify-center text-5xl cursor-pointer transition-all hover:scale-110 ${!selectedEmoji && 'border-4 border-dashed border-white/50'}`}
                    >
                      {selectedEmoji || '?'}
                    </div>
                  </div>

                  {/* Emoji Picker */}
                  <div className="mb-4">
                    <button
                      type="button"
                      onClick={() => {
                        console.log('Emoji picker button clicked', showEmojiPicker);
                        setShowEmojiPicker(!showEmojiPicker);
                      }}
                      className="w-full py-2 bg-white/20 rounded-lg text-white font-semibold hover:bg-white/30 transition-colors cursor-pointer"
                      style={{ cursor: 'pointer' }}
                    >
                      {selectedEmoji ? 'Emoji ändern' : 'Emoji wählen'} 
                    </button>
                    
                    <AnimatePresence>
                      {showEmojiPicker && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-2 bg-white/20 rounded-lg p-2 overflow-hidden"
                        >
                          <div className="grid grid-cols-8 gap-1 max-h-60 overflow-y-auto">
                            {avatarEmojis.map((emoji) => (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() => {
                                  console.log('Emoji selected:', emoji);
                                  setSelectedEmoji(emoji);
                                  setShowEmojiPicker(false);
                                }}
                                className={`text-2xl p-2 rounded hover:bg-white/30 transition-colors cursor-pointer ${selectedEmoji === emoji && 'bg-white/40 ring-2 ring-yellow-400'}`}
                                style={{ cursor: 'pointer' }}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Color Picker */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowColorPicker(!showColorPicker)}
                      className="w-full py-2 bg-white/20 rounded-lg text-white font-semibold hover:bg-white/30 transition-colors cursor-pointer"
                      style={{ cursor: 'pointer' }}
                    >
                      {selectedColor ? 'Farbe ändern' : 'Farbe wählen'}
                    </button>
                    
                    <AnimatePresence>
                      {showColorPicker && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-2 bg-white/20 rounded-lg p-2 overflow-hidden"
                        >
                          <div className="grid grid-cols-4 gap-2">
                            {avatarColors.map((color) => (
                              <button
                                key={color}
                                type="button"
                                onClick={() => {
                                  setSelectedColor(color);
                                  setShowColorPicker(false);
                                }}
                                className={`h-12 rounded-lg bg-gradient-to-br ${color} hover:scale-110 transition-transform cursor-pointer ${selectedColor === color && 'ring-4 ring-yellow-400'}`}
                                style={{ cursor: 'pointer' }}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Create Button */}
                <motion.div
                  whileHover={isFormValid ? { scale: 1.05 } : {}}
                  whileTap={isFormValid ? { scale: 0.95 } : {}}
                >
                  <Button
                    onClick={handleCreateUser}
                    variant="primary"
                    disabled={!isFormValid}
                    className={`w-full py-4 text-xl font-bold ${
                      isFormValid 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    }`}
                  >
                    {isFormValid ? (
                      <span className="flex items-center justify-center gap-2">
                        <Check className="w-6 h-6" />
                        Profil erstellen & Spielen!
                      </span>
                    ) : (
                      'Bitte alles ausfüllen'
                    )}
                  </Button>
                </motion.div>
              </div>
            </Card>
          )}
        </motion.div>

        {/* Top 5 Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="px-4 sm:px-0"
        >
          <Card className="bg-white/20 backdrop-blur-sm border-white/30">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">🏆 Top 5 Spieler</h3>
            <div className="space-y-3">
              {displayLeaderboard.length > 0 ? (
                displayLeaderboard.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
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
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🌟</div>
                  <p className="text-white/80 text-sm">
                    Sei der erste Spieler!<br />
                    Erstelle dein Profil und starte.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
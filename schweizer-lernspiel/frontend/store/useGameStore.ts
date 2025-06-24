import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Avatar {
  emoji: string;
  color: string;
}

interface UserProfile {
  id: string;
  username: string;
  avatar: Avatar;
  totalPoints: number;
  currentLevel: number;
  gamesCompleted: number;
  achievements: string[];
}

interface GameProgress {
  gameType: string;
  level: number;
  score: number;
  highScore: number;
  stars: number;
  lastPlayed: Date;
}

interface LeaderboardEntry {
  id: string;
  username: string;
  avatar: Avatar;
  totalPoints: number;
  gamesCompleted: number;
  lastPlayed: Date;
}

const AVATAR_EMOJIS = [
  '😀', '😎', '🤓', '🥳', '😇', '🤠', '🦸', '🦹',
  '🧙', '🧚', '🧛', '🧜', '🧝', '🤴', '👸', '🦁',
  '🐯', '🦊', '🦝', '🐸', '🐵', '🦄', '🐨', '🐼',
  '🐻', '🐺', '🐷', '🐮', '🐶', '🐱', '🐭', '🐹',
  '🐰', '🦋', '🐝', '🐞', '🦗', '🐛', '🦀', '🐙',
  '🦑', '🦐', '🐠', '🐟', '🐡', '🐬', '🦈', '🐳',
  '🦜', '🦢', '🦩', '🦚', '🦉', '🦅', '🦆', '🐧',
  '🐦', '🐤', '🐣', '🐥', '🦖', '🦕', '🐉', '🐲'
];

const AVATAR_COLORS = [
  'from-red-400 to-red-600',
  'from-orange-400 to-orange-600',
  'from-yellow-400 to-yellow-600',
  'from-green-400 to-green-600',
  'from-teal-400 to-teal-600',
  'from-blue-400 to-blue-600',
  'from-indigo-400 to-indigo-600',
  'from-purple-400 to-purple-600',
  'from-pink-400 to-pink-600',
  'from-rose-400 to-rose-600',
  'from-cyan-400 to-cyan-600',
  'from-emerald-400 to-emerald-600',
  'from-lime-400 to-lime-600',
  'from-amber-400 to-amber-600',
  'from-fuchsia-400 to-fuchsia-600',
  'from-violet-400 to-violet-600'
];

interface GameStore {
  // User state
  user: UserProfile | null;
  isAuthenticated: boolean;
  leaderboard: LeaderboardEntry[];
  
  // Game progress
  gameProgress: Record<string, GameProgress>;
  
  // UI state
  isSoundEnabled: boolean;
  isMusicEnabled: boolean;
  masterVolume: number;
  
  // Actions
  setUser: (user: UserProfile | null) => void;
  createUser: (username: string, emoji: string, color: string) => void;
  updateUserPoints: (points: number) => void;
  updateGameProgress: (gameType: string, progress: Partial<GameProgress>) => void;
  completeGame: () => void;
  updateLeaderboard: () => void;
  resetData: () => void;
  toggleSound: () => void;
  toggleMusic: () => void;
  setMasterVolume: (volume: number) => void;
  logout: () => void;
  
  // Avatar options
  getAvatarEmojis: () => string[];
  getAvatarColors: () => string[];
}

const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      leaderboard: [],
      gameProgress: {},
      isSoundEnabled: true,
      isMusicEnabled: true,
      masterVolume: 0.7,
      
      // Actions
      setUser: (user) => 
        set((state) => ({
          user,
          isAuthenticated: !!user,
        })),
      
      createUser: (username, emoji, color) => {
        const newUser: UserProfile = {
          id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          username,
          avatar: {
            emoji,
            color,
          },
          totalPoints: 0,
          currentLevel: 1,
          gamesCompleted: 0,
          achievements: [],
        };
        
        set({ user: newUser, isAuthenticated: true });
        get().updateLeaderboard();
      },
      
      updateUserPoints: (points) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                totalPoints: state.user.totalPoints + points,
              }
            : null,
        })),
      
      updateGameProgress: (gameType, progress) =>
        set((state) => ({
          gameProgress: {
            ...state.gameProgress,
            [gameType]: {
              ...state.gameProgress[gameType],
              ...progress,
              lastPlayed: new Date(),
            },
          },
        })),
      
      completeGame: () =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                gamesCompleted: state.user.gamesCompleted + 1,
              }
            : null,
        })),
      
      updateLeaderboard: () =>
        set((state) => {
          if (!state.user) return state;
          
          const existingIndex = state.leaderboard.findIndex(entry => entry.id === state.user!.id);
          const newEntry: LeaderboardEntry = {
            id: state.user.id,
            username: state.user.username,
            avatar: state.user.avatar,
            totalPoints: state.user.totalPoints,
            gamesCompleted: state.user.gamesCompleted,
            lastPlayed: new Date(),
          };
          
          let newLeaderboard;
          if (existingIndex >= 0) {
            newLeaderboard = [...state.leaderboard];
            newLeaderboard[existingIndex] = newEntry;
          } else {
            newLeaderboard = [...state.leaderboard, newEntry];
          }
          
          // Sort by total points (descending)
          newLeaderboard.sort((a, b) => b.totalPoints - a.totalPoints);
          
          return { leaderboard: newLeaderboard };
        }),
      
      resetData: () =>
        set(() => ({
          user: null,
          isAuthenticated: false,
          leaderboard: [],
          gameProgress: {},
        })),
      
      toggleSound: () =>
        set((state) => ({
          isSoundEnabled: !state.isSoundEnabled,
        })),
      
      toggleMusic: () =>
        set((state) => ({
          isMusicEnabled: !state.isMusicEnabled,
        })),
      
      setMasterVolume: (volume) =>
        set(() => ({
          masterVolume: Math.max(0, Math.min(1, volume)),
        })),
      
      logout: () =>
        set(() => ({
          user: null,
          isAuthenticated: false,
          gameProgress: {},
        })),
      
      getAvatarEmojis: () => AVATAR_EMOJIS,
      getAvatarColors: () => AVATAR_COLORS,
    }),
    {
      name: 'schweizer-lernspiel-storage', // localStorage key
      partialize: (state) => ({
        // Only persist these fields
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        leaderboard: state.leaderboard,
        gameProgress: state.gameProgress,
        isSoundEnabled: state.isSoundEnabled,
        isMusicEnabled: state.isMusicEnabled,
        masterVolume: state.masterVolume,
      }),
    }
  )
);

export default useGameStore;
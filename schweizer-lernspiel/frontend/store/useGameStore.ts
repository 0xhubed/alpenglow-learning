import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Avatar {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

interface UserProfile {
  id: string;
  username: string;
  email: string;
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

const AVATARS: Avatar[] = [
  {
    id: 'leo',
    name: 'Leo',
    emoji: '🦁',
    color: 'from-orange-400 to-red-500',
    description: 'Der mutige Löwe liebt Abenteuer!'
  },
  {
    id: 'lynn',
    name: 'Lynn',
    emoji: '🦄',
    color: 'from-purple-400 to-pink-500',
    description: 'Das magische Einhorn bringt Glück!'
  },
  {
    id: 'elia',
    name: 'Elia',
    emoji: '🐺',
    color: 'from-blue-400 to-indigo-500',
    description: 'Der schlaue Wolf kennt alle Geheimnisse!'
  },
  {
    id: 'nean',
    name: 'Nean',
    emoji: '🐸',
    color: 'from-green-400 to-emerald-500',
    description: 'Der fröhliche Frosch springt überall hin!'
  },
  {
    id: 'lia',
    name: 'Lia',
    emoji: '🐱',
    color: 'from-pink-400 to-rose-500',
    description: 'Die verspielte Katze ist sehr neugierig!'
  },
  {
    id: 'noena',
    name: 'Noena',
    emoji: '🦋',
    color: 'from-cyan-400 to-blue-500',
    description: 'Der bunte Schmetterling tanzt durch die Luft!'
  }
];

interface GameStore {
  // User state
  user: UserProfile | null;
  isAuthenticated: boolean;
  availableAvatars: Avatar[];
  leaderboard: LeaderboardEntry[];
  
  // Game progress
  gameProgress: Record<string, GameProgress>;
  
  // UI state
  isSoundEnabled: boolean;
  isMusicEnabled: boolean;
  masterVolume: number;
  
  // Actions
  setUser: (user: UserProfile | null) => void;
  selectAvatar: (avatarId: string) => void;
  updateUserPoints: (points: number) => void;
  updateGameProgress: (gameType: string, progress: Partial<GameProgress>) => void;
  completeGame: () => void;
  updateLeaderboard: () => void;
  cleanupLeaderboard: () => void;
  resetData: () => void;
  toggleSound: () => void;
  toggleMusic: () => void;
  setMasterVolume: (volume: number) => void;
  logout: () => void;
}

const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      availableAvatars: AVATARS,
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
      
      selectAvatar: (avatarId) => 
        set((state) => {
          const avatar = AVATARS.find(a => a.id === avatarId);
          if (!avatar || !state.user) return state;
          
          return {
            user: {
              ...state.user,
              avatar,
            },
          };
        }),
      
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
      
      cleanupLeaderboard: () =>
        set((state) => {
          // Filter out entries with invalid avatar names (test data)
          const validAvatarNames = AVATARS.map(avatar => avatar.name);
          const cleanLeaderboard = state.leaderboard.filter(entry => 
            validAvatarNames.includes(entry.username) || validAvatarNames.includes(entry.avatar.name)
          );
          
          return { leaderboard: cleanLeaderboard };
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
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  totalPoints: number;
  currentLevel: number;
}

interface GameProgress {
  gameType: string;
  level: number;
  score: number;
  highScore: number;
  stars: number;
  lastPlayed: Date;
}

interface GameStore {
  // User state
  user: UserProfile | null;
  isAuthenticated: boolean;
  
  // Game progress
  gameProgress: Record<string, GameProgress>;
  
  // UI state
  isSoundEnabled: boolean;
  isMusicEnabled: boolean;
  masterVolume: number;
  
  // Actions
  setUser: (user: UserProfile | null) => void;
  updateUserPoints: (points: number) => void;
  updateGameProgress: (gameType: string, progress: Partial<GameProgress>) => void;
  toggleSound: () => void;
  toggleMusic: () => void;
  setMasterVolume: (volume: number) => void;
  logout: () => void;
}

const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
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
        gameProgress: state.gameProgress,
        isSoundEnabled: state.isSoundEnabled,
        isMusicEnabled: state.isMusicEnabled,
        masterVolume: state.masterVolume,
      }),
    }
  )
);

export default useGameStore;
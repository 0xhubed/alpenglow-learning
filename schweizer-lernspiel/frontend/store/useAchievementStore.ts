import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  category: string;
  unlockedAt?: Date;
}

interface AchievementStore {
  achievements: Achievement[];
  unlockedAchievements: string[];
  recentUnlocks: Achievement[];
  totalPoints: number;
  
  // Actions
  unlockAchievement: (achievementId: string) => void;
  addRecentUnlock: (achievement: Achievement) => void;
  clearRecentUnlocks: () => void;
  loadAchievements: (achievements: Achievement[]) => void;
  getAchievementById: (id: string) => Achievement | undefined;
  isUnlocked: (achievementId: string) => boolean;
}

const useAchievementStore = create<AchievementStore>()(
  persist(
    (set, get) => ({
      achievements: [],
      unlockedAchievements: [],
      recentUnlocks: [],
      totalPoints: 0,
      
      unlockAchievement: (achievementId) =>
        set((state) => {
          if (state.unlockedAchievements.includes(achievementId)) {
            return state;
          }
          
          const achievement = state.achievements.find(a => a.id === achievementId);
          if (!achievement) return state;
          
          return {
            unlockedAchievements: [...state.unlockedAchievements, achievementId],
            totalPoints: state.totalPoints + achievement.points,
          };
        }),
      
      addRecentUnlock: (achievement) =>
        set((state) => ({
          recentUnlocks: [...state.recentUnlocks, achievement],
        })),
      
      clearRecentUnlocks: () =>
        set(() => ({
          recentUnlocks: [],
        })),
      
      loadAchievements: (achievements) =>
        set(() => ({
          achievements,
        })),
      
      getAchievementById: (id) => {
        const state = get();
        return state.achievements.find(a => a.id === id);
      },
      
      isUnlocked: (achievementId) => {
        const state = get();
        return state.unlockedAchievements.includes(achievementId);
      },
    }),
    {
      name: 'schweizer-lernspiel-achievements',
      partialize: (state) => ({
        unlockedAchievements: state.unlockedAchievements,
        totalPoints: state.totalPoints,
      }),
    }
  )
);

// Initialize with default achievements
const defaultAchievements: Achievement[] = [
  // Score achievements
  {
    id: 'first_points',
    name: 'Erste Schritte',
    description: 'Sammle deine ersten Punkte',
    icon: '🌟',
    points: 5,
    category: 'score',
  },
  {
    id: 'score_100',
    name: 'Hundert!',
    description: 'Erreiche 100 Punkte in einem Spiel',
    icon: '💯',
    points: 10,
    category: 'score',
  },
  {
    id: 'score_500',
    name: 'Punktesammler',
    description: 'Erreiche 500 Punkte in einem Spiel',
    icon: '⭐',
    points: 25,
    category: 'score',
  },
  {
    id: 'score_1000',
    name: 'Punktekönig',
    description: 'Erreiche 1000 Punkte in einem Spiel',
    icon: '👑',
    points: 50,
    category: 'score',
  },
  
  // Combo achievements
  {
    id: 'combo_3',
    name: 'Dreier-Combo',
    description: 'Erreiche eine 3er Combo',
    icon: '🔥',
    points: 10,
    category: 'combo',
  },
  {
    id: 'combo_5',
    name: 'Combo-Meister',
    description: 'Erreiche eine 5er Combo',
    icon: '💥',
    points: 20,
    category: 'combo',
  },
  {
    id: 'combo_10',
    name: 'Combo-Legende',
    description: 'Erreiche eine 10er Combo',
    icon: '🌟',
    points: 40,
    category: 'combo',
  },
  
  // Level achievements
  {
    id: 'level_5',
    name: 'Fortgeschritten',
    description: 'Erreiche Level 5',
    icon: '🏆',
    points: 15,
    category: 'level',
  },
  {
    id: 'level_10',
    name: 'Experte',
    description: 'Erreiche Level 10',
    icon: '🥇',
    points: 30,
    category: 'level',
  },
  
  // Game-specific achievements
  {
    id: 'buchstaben_master',
    name: 'Buchstaben-Meister',
    description: 'Beherrsche alle Buchstaben',
    icon: '📚',
    points: 50,
    category: 'buchstaben',
  },
  {
    id: 'zahlen_master',
    name: 'Zahlen-Genie',
    description: 'Meistere alle Zahlenaufgaben',
    icon: '🔢',
    points: 50,
    category: 'zahlen',
  },
  {
    id: 'tier_expert',
    name: 'Tierexperte',
    description: 'Kenne alle Schweizer Tiere',
    icon: '🦌',
    points: 50,
    category: 'natur',
  },
  
  // Special achievements
  {
    id: 'perfect_game',
    name: 'Perfektes Spiel',
    description: 'Beende ein Level ohne Fehler',
    icon: '✨',
    points: 30,
    category: 'special',
  },
  {
    id: 'daily_player',
    name: 'Täglicher Spieler',
    description: 'Spiele 7 Tage hintereinander',
    icon: '📅',
    points: 25,
    category: 'special',
  },
  {
    id: 'all_games',
    name: 'Vielseitig',
    description: 'Spiele alle verfügbaren Spiele',
    icon: '🎮',
    points: 40,
    category: 'special',
  },
];

// Load default achievements on store creation
useAchievementStore.getState().loadAchievements(defaultAchievements);

export default useAchievementStore;
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  unlockedAt?: Date;
}

export interface GameScore {
  current: number;
  high: number;
  stars: number;
}

export interface GameLevel {
  id: number;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  targetScore: number;
  timeLimit?: number;
  unlocked: boolean;
  completed: boolean;
}

export interface GameState {
  score: GameScore;
  level: number;
  lives: number;
  isPaused: boolean;
  isGameOver: boolean;
  startTime: number;
  elapsedTime: number;
}

export interface GameConfig {
  gameType: 'BUCHSTABEN' | 'ZAHLEN' | 'NATUR' | 'MUSIK';
  maxLives: number;
  basePoints: number;
  comboMultiplier: number;
  errorTolerance: number; // For kids - how many mistakes before losing a life
  autoSaveInterval: number; // milliseconds
}
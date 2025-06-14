import { Achievement, GameScore, GameLevel, GameState, GameConfig } from './types';
import audioManager from '@/lib/audio/AudioManager';

export class GameEngine {
  private config: GameConfig;
  private state: GameState;
  private achievements: Achievement[] = [];
  private combo: number = 0;
  private errorCount: number = 0;
  private autoSaveTimer: NodeJS.Timeout | null = null;
  private animationFrameId: number | null = null;
  
  // Callbacks
  private onScoreUpdate?: (score: number) => void;
  private onLevelComplete?: (level: number) => void;
  private onGameOver?: (finalScore: number) => void;
  private onAchievementUnlocked?: (achievement: Achievement) => void;
  private onLivesUpdate?: (lives: number) => void;
  private onStateChange?: (state: GameState) => void;

  constructor(config: GameConfig) {
    this.config = config;
    this.state = this.initializeState();
  }

  private initializeState(): GameState {
    return {
      score: {
        current: 0,
        high: this.getHighScore(),
        stars: 0,
      },
      level: 1,
      lives: this.config.maxLives,
      isPaused: false,
      isGameOver: false,
      startTime: Date.now(),
      elapsedTime: 0,
    };
  }

  // Game lifecycle methods
  public startGame(): void {
    this.state = this.initializeState();
    this.combo = 0;
    this.errorCount = 0;
    
    // Start auto-save
    this.startAutoSave();
    
    // Start game loop
    this.startGameLoop();
    
    // Play start sound
    audioManager.playSound('levelUp');
    
    this.onStateChange?.(this.state);
  }

  public pauseGame(): void {
    this.state.isPaused = true;
    this.stopGameLoop();
    this.stopAutoSave();
    audioManager.pauseBackgroundMusic();
    this.onStateChange?.(this.state);
  }

  public resumeGame(): void {
    this.state.isPaused = false;
    this.startGameLoop();
    this.startAutoSave();
    audioManager.resumeBackgroundMusic();
    this.onStateChange?.(this.state);
  }

  public endGame(): void {
    this.state.isGameOver = true;
    this.stopGameLoop();
    this.stopAutoSave();
    this.saveProgress();
    
    // Play game over sound
    audioManager.playSound('gameOver');
    audioManager.stopBackgroundMusic();
    
    this.onGameOver?.(this.state.score.current);
    this.onStateChange?.(this.state);
  }

  // Score management
  public updateScore(points: number, isCorrect: boolean = true): void {
    if (this.state.isGameOver || this.state.isPaused) return;

    if (isCorrect) {
      // Apply combo multiplier
      this.combo++;
      const multipliedPoints = points * (1 + (this.combo - 1) * this.config.comboMultiplier);
      this.state.score.current += Math.round(multipliedPoints);
      
      // Update high score
      if (this.state.score.current > this.state.score.high) {
        this.state.score.high = this.state.score.current;
        this.saveHighScore();
      }
      
      // Play success sound
      audioManager.playSound('success', 0.5 + Math.min(this.combo * 0.1, 0.5));
      
      // Check for achievements
      this.checkAchievements();
    } else {
      // Handle incorrect answer
      this.combo = 0;
      this.errorCount++;
      
      if (this.errorCount >= this.config.errorTolerance) {
        this.loseLife();
        this.errorCount = 0;
      }
      
      // Play error sound
      audioManager.playSound('error');
    }
    
    this.onScoreUpdate?.(this.state.score.current);
    this.onStateChange?.(this.state);
  }

  // Level management
  public nextLevel(): void {
    if (this.state.isGameOver || this.state.isPaused) return;

    this.state.level++;
    this.combo = 0;
    this.errorCount = 0;
    
    // Calculate stars based on performance
    const stars = this.calculateStars();
    this.state.score.stars = Math.max(this.state.score.stars, stars);
    
    // Play level up sound
    audioManager.playSound('levelUp');
    
    // Save progress
    this.saveProgress();
    
    this.onLevelComplete?.(this.state.level);
    this.onStateChange?.(this.state);
  }

  // Lives management
  private loseLife(): void {
    this.state.lives--;
    
    if (this.state.lives <= 0) {
      this.endGame();
    } else {
      // Play lose life sound
      audioManager.playSound('loseLife');
      this.onLivesUpdate?.(this.state.lives);
    }
  }

  public addLife(): void {
    if (this.state.lives < this.config.maxLives) {
      this.state.lives++;
      audioManager.playSound('extraLife');
      this.onLivesUpdate?.(this.state.lives);
      this.onStateChange?.(this.state);
    }
  }

  // Achievement system
  private checkAchievements(): void {
    // Check score-based achievements
    if (this.state.score.current >= 100 && !this.hasAchievement('first_100')) {
      this.unlockAchievement({
        id: 'first_100',
        name: 'Erste 100 Punkte!',
        description: 'Erreiche 100 Punkte',
        icon: '🌟',
        points: 10,
      });
    }
    
    if (this.state.score.current >= 500 && !this.hasAchievement('score_500')) {
      this.unlockAchievement({
        id: 'score_500',
        name: 'Punktesammler',
        description: 'Erreiche 500 Punkte',
        icon: '⭐',
        points: 25,
      });
    }
    
    // Check combo achievements
    if (this.combo >= 5 && !this.hasAchievement('combo_5')) {
      this.unlockAchievement({
        id: 'combo_5',
        name: 'Combo-Meister',
        description: '5er Combo erreicht!',
        icon: '🔥',
        points: 15,
      });
    }
    
    // Check level achievements
    if (this.state.level >= 5 && !this.hasAchievement('level_5')) {
      this.unlockAchievement({
        id: 'level_5',
        name: 'Fortgeschritten',
        description: 'Erreiche Level 5',
        icon: '🏆',
        points: 20,
      });
    }
  }

  private hasAchievement(id: string): boolean {
    return this.achievements.some(a => a.id === id);
  }

  private unlockAchievement(achievement: Achievement): void {
    achievement.unlockedAt = new Date();
    this.achievements.push(achievement);
    
    // Play achievement sound
    audioManager.playSound('achievement');
    
    // Notify
    this.onAchievementUnlocked?.(achievement);
    
    // Save to storage
    this.saveAchievements();
  }

  // Star calculation
  private calculateStars(): number {
    const perfectScore = this.state.level * 100;
    const percentage = (this.state.score.current / perfectScore) * 100;
    
    if (percentage >= 90) return 3;
    if (percentage >= 70) return 2;
    if (percentage >= 50) return 1;
    return 0;
  }

  // Game loop
  private startGameLoop(): void {
    if (this.animationFrameId) return;
    
    const gameLoop = () => {
      if (!this.state.isPaused && !this.state.isGameOver) {
        this.state.elapsedTime = Date.now() - this.state.startTime;
        this.onStateChange?.(this.state);
      }
      
      this.animationFrameId = requestAnimationFrame(gameLoop);
    };
    
    this.animationFrameId = requestAnimationFrame(gameLoop);
  }

  private stopGameLoop(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  // Auto-save functionality
  private startAutoSave(): void {
    if (this.autoSaveTimer) return;
    
    this.autoSaveTimer = setInterval(() => {
      this.saveProgress();
    }, this.config.autoSaveInterval);
  }

  private stopAutoSave(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  // Storage methods
  private saveProgress(): void {
    if (typeof window === 'undefined') return;
    
    const progressKey = `game_progress_${this.config.gameType}`;
    const progress = {
      score: this.state.score,
      level: this.state.level,
      timestamp: Date.now(),
    };
    localStorage.setItem(progressKey, JSON.stringify(progress));
  }

  private getHighScore(): number {
    if (typeof window === 'undefined') return 0;
    
    const progressKey = `game_progress_${this.config.gameType}`;
    const saved = localStorage.getItem(progressKey);
    
    if (saved) {
      const progress = JSON.parse(saved);
      return progress.score?.high || 0;
    }
    
    return 0;
  }

  private saveHighScore(): void {
    if (typeof window === 'undefined') return;
    
    const highScoreKey = `high_score_${this.config.gameType}`;
    localStorage.setItem(highScoreKey, this.state.score.high.toString());
  }

  private saveAchievements(): void {
    if (typeof window === 'undefined') return;
    
    const achievementsKey = `achievements_${this.config.gameType}`;
    localStorage.setItem(achievementsKey, JSON.stringify(this.achievements));
  }

  private loadAchievements(): void {
    if (typeof window === 'undefined') return;
    
    const achievementsKey = `achievements_${this.config.gameType}`;
    const saved = localStorage.getItem(achievementsKey);
    
    if (saved) {
      this.achievements = JSON.parse(saved);
    }
  }

  // Event handlers
  public onScore(callback: (score: number) => void): void {
    this.onScoreUpdate = callback;
  }

  public onLevel(callback: (level: number) => void): void {
    this.onLevelComplete = callback;
  }

  public onGameOverEvent(callback: (finalScore: number) => void): void {
    this.onGameOver = callback;
  }

  public onAchievement(callback: (achievement: Achievement) => void): void {
    this.onAchievementUnlocked = callback;
  }

  public onLives(callback: (lives: number) => void): void {
    this.onLivesUpdate = callback;
  }

  public onChange(callback: (state: GameState) => void): void {
    this.onStateChange = callback;
  }

  // Getters
  public getState(): GameState {
    return { ...this.state };
  }

  public getAchievements(): Achievement[] {
    return [...this.achievements];
  }

  public getCombo(): number {
    return this.combo;
  }

  // Cleanup
  public destroy(): void {
    this.stopGameLoop();
    this.stopAutoSave();
    this.saveProgress();
  }
}
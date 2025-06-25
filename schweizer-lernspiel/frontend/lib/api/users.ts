const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface UserProfile {
  id: string;
  username: string;
  avatar: {
    emoji: string;
    color: string;
  };
  totalPoints: number;
  currentLevel: number;
  gamesCompleted: number;
  achievements: string[];
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  avatar: {
    emoji: string;
    color: string;
  };
  totalPoints: number;
  gamesCompleted: number;
  lastPlayed: Date;
}

export const userAPI = {
  // Create or get user
  async createUser(username: string, avatar: { emoji: string; color: string }): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, avatar }),
    });

    if (!response.ok) {
      throw new Error('Failed to create user');
    }

    const result = await response.json();
    return result.data;
  },

  // Get leaderboard
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const response = await fetch(`${API_BASE_URL}/api/users/leaderboard`);

    if (!response.ok) {
      throw new Error('Failed to fetch leaderboard');
    }

    const result = await response.json();
    return result.data.map((entry: any) => ({
      ...entry,
      lastPlayed: new Date(entry.lastPlayed)
    }));
  },

  // Update user points
  async updatePoints(userId: string, points: number): Promise<{ totalPoints: number }> {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/points`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ points }),
    });

    if (!response.ok) {
      throw new Error('Failed to update points');
    }

    const result = await response.json();
    return result.data;
  },

  // Complete game
  async completeGame(userId: string): Promise<{ gamesCompleted: number }> {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/complete-game`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to complete game');
    }

    const result = await response.json();
    return result.data;
  }
};
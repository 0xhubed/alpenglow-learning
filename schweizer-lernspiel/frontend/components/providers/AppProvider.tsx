'use client';

import { useEffect } from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import useGameStore from '@/store/useGameStore';

export default function AppProvider({ children }: { children: React.ReactNode }) {
  useOnlineStatus();
  const { fetchLeaderboard, isOnline } = useGameStore();
  
  useEffect(() => {
    // Fetch leaderboard on app start if online
    if (isOnline) {
      fetchLeaderboard();
    }
  }, [fetchLeaderboard, isOnline]);
  
  return <>{children}</>;
}
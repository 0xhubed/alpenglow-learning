import { useEffect } from 'react';
import useGameStore from '@/store/useGameStore';

export function useOnlineStatus() {
  const { setOnlineStatus, fetchLeaderboard } = useGameStore();

  useEffect(() => {
    const updateOnlineStatus = () => {
      const isOnline = navigator.onLine;
      setOnlineStatus(isOnline);
      
      // Fetch leaderboard when coming back online
      if (isOnline) {
        fetchLeaderboard();
      }
    };

    // Set initial status
    updateOnlineStatus();

    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [setOnlineStatus, fetchLeaderboard]);
}
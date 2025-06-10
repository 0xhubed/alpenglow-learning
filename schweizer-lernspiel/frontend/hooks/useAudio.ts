'use client';

import { useEffect, useCallback } from 'react';
import audioManager from '@/lib/audio/AudioManager';

interface UseAudioOptions {
  preloadSounds?: boolean;
  backgroundMusic?: string;
}

export const useAudio = (options: UseAudioOptions = {}) => {
  const { preloadSounds = true, backgroundMusic } = options;

  useEffect(() => {
    // Preload common game sounds
    if (preloadSounds) {
      audioManager.preloadGameSounds();
    }

    // Play background music if provided
    if (backgroundMusic) {
      audioManager.playBackgroundMusic(backgroundMusic);
    }

    // Cleanup on unmount
    return () => {
      if (backgroundMusic) {
        audioManager.stopBackgroundMusic();
      }
    };
  }, [preloadSounds, backgroundMusic]);

  const playSound = useCallback((soundName: string, volume?: number) => {
    audioManager.playSound(soundName, volume);
  }, []);

  const stopSound = useCallback((soundName: string) => {
    audioManager.stopSound(soundName);
  }, []);

  const toggleMute = useCallback(() => {
    return audioManager.toggleMute();
  }, []);

  const setMasterVolume = useCallback((volume: number) => {
    audioManager.setMasterVolume(volume);
  }, []);

  const setSoundEffectsVolume = useCallback((volume: number) => {
    audioManager.setSoundEffectsVolume(volume);
  }, []);

  const setMusicVolume = useCallback((volume: number) => {
    audioManager.setMusicVolume(volume);
  }, []);

  const pauseMusic = useCallback(() => {
    audioManager.pauseBackgroundMusic();
  }, []);

  const resumeMusic = useCallback(() => {
    audioManager.resumeBackgroundMusic();
  }, []);

  const getSettings = useCallback(() => {
    return audioManager.getSettings();
  }, []);

  return {
    playSound,
    stopSound,
    toggleMute,
    setMasterVolume,
    setSoundEffectsVolume,
    setMusicVolume,
    pauseMusic,
    resumeMusic,
    getSettings,
  };
};
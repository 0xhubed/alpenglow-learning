import { Howl, Howler } from 'howler';

interface Sound {
  name: string;
  src: string;
  volume?: number;
  loop?: boolean;
}

interface SoundMap {
  [key: string]: Howl;
}

class AudioManager {
  private sounds: SoundMap = {};
  private backgroundMusic: Howl | null = null;
  private isMuted: boolean = false;
  private masterVolume: number = 1.0;
  private soundEffectsVolume: number = 0.8;
  private musicVolume: number = 0.5;

  constructor() {
    // Check if audio is enabled in localStorage
    const savedMuted = localStorage.getItem('audioMuted');
    const savedMasterVolume = localStorage.getItem('masterVolume');
    const savedSoundEffectsVolume = localStorage.getItem('soundEffectsVolume');
    const savedMusicVolume = localStorage.getItem('musicVolume');

    if (savedMuted !== null) {
      this.isMuted = savedMuted === 'true';
    }
    if (savedMasterVolume !== null) {
      this.masterVolume = parseFloat(savedMasterVolume);
    }
    if (savedSoundEffectsVolume !== null) {
      this.soundEffectsVolume = parseFloat(savedSoundEffectsVolume);
    }
    if (savedMusicVolume !== null) {
      this.musicVolume = parseFloat(savedMusicVolume);
    }

    Howler.volume(this.isMuted ? 0 : this.masterVolume);
  }

  // Load a sound effect
  loadSound(sound: Sound): void {
    if (this.sounds[sound.name]) {
      console.warn(`Sound ${sound.name} already loaded`);
      return;
    }

    this.sounds[sound.name] = new Howl({
      src: [sound.src],
      volume: (sound.volume || 1.0) * this.soundEffectsVolume,
      loop: sound.loop || false,
      preload: true,
    });
  }

  // Load multiple sounds
  loadSounds(sounds: Sound[]): void {
    sounds.forEach(sound => this.loadSound(sound));
  }

  // Play a sound effect
  playSound(name: string, volume?: number): void {
    if (!this.sounds[name]) {
      console.error(`Sound ${name} not loaded`);
      return;
    }

    const sound = this.sounds[name];
    if (volume !== undefined) {
      sound.volume(volume * this.soundEffectsVolume);
    }
    sound.play();
  }

  // Stop a sound effect
  stopSound(name: string): void {
    if (!this.sounds[name]) {
      console.error(`Sound ${name} not loaded`);
      return;
    }

    this.sounds[name].stop();
  }

  // Load and play background music
  playBackgroundMusic(src: string, volume?: number): void {
    // Stop current music if playing
    if (this.backgroundMusic) {
      this.backgroundMusic.stop();
      this.backgroundMusic.unload();
    }

    this.backgroundMusic = new Howl({
      src: [src],
      volume: (volume || this.musicVolume) * this.masterVolume,
      loop: true,
      autoplay: true,
    });
  }

  // Stop background music
  stopBackgroundMusic(): void {
    if (this.backgroundMusic) {
      this.backgroundMusic.stop();
    }
  }

  // Pause background music
  pauseBackgroundMusic(): void {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
    }
  }

  // Resume background music
  resumeBackgroundMusic(): void {
    if (this.backgroundMusic) {
      this.backgroundMusic.play();
    }
  }

  // Toggle mute
  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    Howler.volume(this.isMuted ? 0 : this.masterVolume);
    localStorage.setItem('audioMuted', this.isMuted.toString());
    return this.isMuted;
  }

  // Set master volume
  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    if (!this.isMuted) {
      Howler.volume(this.masterVolume);
    }
    localStorage.setItem('masterVolume', this.masterVolume.toString());
  }

  // Set sound effects volume
  setSoundEffectsVolume(volume: number): void {
    this.soundEffectsVolume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('soundEffectsVolume', this.soundEffectsVolume.toString());
    
    // Update all loaded sound effects volumes
    Object.values(this.sounds).forEach(sound => {
      sound.volume(this.soundEffectsVolume);
    });
  }

  // Set music volume
  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('musicVolume', this.musicVolume.toString());
    
    if (this.backgroundMusic) {
      this.backgroundMusic.volume(this.musicVolume);
    }
  }

  // Get current settings
  getSettings() {
    return {
      isMuted: this.isMuted,
      masterVolume: this.masterVolume,
      soundEffectsVolume: this.soundEffectsVolume,
      musicVolume: this.musicVolume,
    };
  }

  // Preload common game sounds
  preloadGameSounds(): void {
    const commonSounds: Sound[] = [
      { name: 'click', src: '/audio/click.mp3', volume: 0.5 },
      { name: 'success', src: '/audio/success.mp3', volume: 0.7 },
      { name: 'error', src: '/audio/error.mp3', volume: 0.5 },
      { name: 'levelUp', src: '/audio/level-up.mp3', volume: 0.8 },
      { name: 'coin', src: '/audio/coin.mp3', volume: 0.6 },
      { name: 'whoosh', src: '/audio/whoosh.mp3', volume: 0.4 },
      { name: 'pop', src: '/audio/pop.mp3', volume: 0.5 },
      { name: 'achievement', src: '/audio/achievement.mp3', volume: 0.8 },
    ];

    this.loadSounds(commonSounds);
  }

  // Cleanup
  destroy(): void {
    // Stop and unload all sounds
    Object.values(this.sounds).forEach(sound => {
      sound.stop();
      sound.unload();
    });
    this.sounds = {};

    // Stop and unload background music
    if (this.backgroundMusic) {
      this.backgroundMusic.stop();
      this.backgroundMusic.unload();
      this.backgroundMusic = null;
    }
  }
}

// Create singleton instance
const audioManager = new AudioManager();

export default audioManager;
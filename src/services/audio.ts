import { Howl, Howler } from 'howler';

// Sound configuration - easy to add/modify sounds
const SOUND_CONFIG: Record<string, { src: string; volume: number; loop?: boolean }> = {
  // UI sounds (8-bit retro from OpenGameArt - CC0 license)
  click: { src: '/sounds/click.wav', volume: 0.4 },
  success: { src: '/sounds/success.wav', volume: 0.5 },
  error: { src: '/sounds/error.wav', volume: 0.4 },

  // Game sounds
  coin: { src: '/sounds/coin.wav', volume: 0.4 },
  levelup: { src: '/sounds/levelup.wav', volume: 0.5 },
  notification: { src: '/sounds/notification.wav', volume: 0.4 },

  // Music tracks (Retro Game Music Pack by Juhani Junkala - CC0 license)
  music_menu: { src: '/sounds/music_menu.wav', volume: 0.3, loop: true },
  music_travel: { src: '/sounds/music_travel.wav', volume: 0.2, loop: true },
  music_victory: { src: '/sounds/music_victory.wav', volume: 0.35, loop: true },
  music_minigame: { src: '/sounds/music_minigame.wav', volume: 0.25, loop: true },
};

// Audio manager for game sounds and music
class AudioManager {
  private sounds: Map<string, Howl> = new Map();
  private music: Howl | null = null;
  private currentMusicId: string | null = null;
  private initialized = false;
  private loadErrors: Set<string> = new Set();

  private _sfxVolume = 0.5;
  private _musicVolume = 0.3;
  private _sfxEnabled = true;
  private _musicEnabled = true;

  // Initialize sounds lazily (after user interaction)
  init() {
    if (this.initialized) return;
    this.initialized = true;
    this.initSounds();
  }

  private initSounds() {
    Object.entries(SOUND_CONFIG).forEach(([id, config]) => {
      const howl = new Howl({
        src: [config.src],
        volume: config.volume,
        loop: config.loop || false,
        onloaderror: () => {
          this.loadErrors.add(id);
          console.warn(`Sound not found: ${config.src}`);
        },
      });
      this.sounds.set(id, howl);
    });
  }

  // Play a sound effect
  play(soundId: string) {
    if (!this._sfxEnabled) return;
    if (!this.initialized) this.init();
    if (this.loadErrors.has(soundId)) return;

    const sound = this.sounds.get(soundId);
    if (sound) {
      sound.volume(this._sfxVolume);
      sound.play();
    }
  }

  // Stop a sound
  stop(soundId: string) {
    const sound = this.sounds.get(soundId);
    if (sound) {
      sound.stop();
    }
  }

  // Play background music
  playMusic(musicId: string) {
    if (!this._musicEnabled) return;
    if (!this.initialized) this.init();
    if (this.currentMusicId === musicId) return;
    if (this.loadErrors.has(musicId)) return;

    // Stop current music
    this.stopMusic();

    const music = this.sounds.get(musicId);
    if (music) {
      this.music = music;
      this.currentMusicId = musicId;
      music.volume(this._musicVolume);
      music.play();
    }
  }

  // Stop background music
  stopMusic() {
    if (this.music) {
      this.music.fade(this._musicVolume, 0, 500);
      setTimeout(() => {
        this.music?.stop();
        this.music = null;
        this.currentMusicId = null;
      }, 500);
    }
  }

  // Volume controls
  set sfxVolume(value: number) {
    this._sfxVolume = Math.max(0, Math.min(1, value));
  }

  get sfxVolume() {
    return this._sfxVolume;
  }

  set musicVolume(value: number) {
    this._musicVolume = Math.max(0, Math.min(1, value));
    if (this.music) {
      this.music.volume(this._musicVolume);
    }
  }

  get musicVolume() {
    return this._musicVolume;
  }

  // Enable/disable
  set sfxEnabled(value: boolean) {
    this._sfxEnabled = value;
  }

  get sfxEnabled() {
    return this._sfxEnabled;
  }

  set musicEnabled(value: boolean) {
    this._musicEnabled = value;
    if (!value) {
      this.stopMusic();
    }
  }

  get musicEnabled() {
    return this._musicEnabled;
  }

  // Mute all
  muteAll() {
    Howler.mute(true);
  }

  unmuteAll() {
    Howler.mute(false);
  }

  private _isMuted = false;

  toggleMute() {
    this._isMuted = !this._isMuted;
    if (this._isMuted) {
      this.muteAll();
    } else {
      this.unmuteAll();
    }
    return this._isMuted;
  }

  isMuted() {
    return this._isMuted;
  }
}

// Singleton instance
export const audio = new AudioManager();

// Convenience functions
export const playSound = (id: string) => audio.play(id);
export const stopSound = (id: string) => audio.stop(id);
export const playMusic = (id: string) => audio.playMusic(id);
export const stopMusic = () => audio.stopMusic();
export const toggleMute = () => audio.toggleMute();
export const isMuted = () => audio.isMuted();

// Audio manager for smooth romantic playback with fallback synth
class RomanticAudioManager {
  private audio: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private synthInterval: number | null = null;
  private isSynthesizing = false;
  private _isPlaying = false;
  private volume = 0.7;
  private listeners: ((playing: boolean) => void)[] = [];

  constructor() {
    // will initialize on first user gesture
  }

  public init(songUrl: string) {
    if (!this.audio) {
      this.audio = new Audio();
      this.audio.loop = true;
      this.audio.crossOrigin = "anonymous";
      this.audio.volume = this.volume;

      this.audio.addEventListener('playing', () => {
        this._isPlaying = true;
        this.stopSynth();
        this.notify();
      });

      this.audio.addEventListener('pause', () => {
        this._isPlaying = false;
        this.notify();
      });

      this.audio.addEventListener('error', (e) => {
        console.warn('Audio URL playback error, switching to gentle romantic chime harmony fallback', e);
        if (this._isPlaying) {
          this.startRomanticSynth();
        }
      });
    }

    if (songUrl) {
      this.audio.src = songUrl;
    }
  }

  public setSong(songUrl: string) {
    if (this.audio) {
      const wasPlaying = this._isPlaying;
      this.audio.src = songUrl;
      this.audio.load();
      if (wasPlaying) {
        this.play();
      }
    }
  }

  public async play(): Promise<boolean> {
    try {
      this.initCtx();
      if (this.audio && this.audio.src) {
        this.audio.volume = this.volume;
        const playPromise = this.audio.play();
        if (playPromise !== undefined) {
          await playPromise;
          this._isPlaying = true;
          this.stopSynth();
          this.notify();
          return true;
        }
      }
    } catch (err) {
      console.warn('Direct HTML audio play blocked or network error, playing gentle romantic chimes:', err);
      this.startRomanticSynth();
      this._isPlaying = true;
      this.notify();
      return true;
    }

    this.startRomanticSynth();
    this._isPlaying = true;
    this.notify();
    return true;
  }

  public pause() {
    if (this.audio) {
      this.audio.pause();
    }
    this.stopSynth();
    this._isPlaying = false;
    this.notify();
  }

  public toggle(): boolean {
    if (this._isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public isPlaying(): boolean {
    return this._isPlaying;
  }

  public setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
  }

  public subscribe(fn: (playing: boolean) => void) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn(this._isPlaying));
  }

  private initCtx() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Gentle romantic music chords fallback (Eb Major / C minor warmth)
  private startRomanticSynth() {
    this.initCtx();
    if (!this.audioCtx || this.isSynthesizing) return;
    this.isSynthesizing = true;

    // Dreamy romantic notes (Frequencies in Hz)
    const melody = [
      261.63, 329.63, 392.00, 523.25, // C - E - G - C
      293.66, 349.23, 440.00, 587.33, // D - F - A - D
      329.63, 392.00, 493.88, 659.25, // E - G - B - E
      349.23, 440.00, 523.25, 698.46  // F - A - C - F
    ];
    let noteIdx = 0;

    this.synthInterval = window.setInterval(() => {
      if (!this._isPlaying || !this.audioCtx) return;
      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        const freq = melody[noteIdx % melody.length];
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

        const now = this.audioCtx.currentTime;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.08 * this.volume, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 1.25);
        noteIdx++;
      } catch (e) {
        console.error('Synth note error', e);
      }
    }, 450);
  }

  private stopSynth() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    this.isSynthesizing = false;
  }
}

export const audioPlayer = new RomanticAudioManager();

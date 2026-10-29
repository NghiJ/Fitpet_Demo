/**
 * Web Audio API Sound Synthesizer
 * Tạo âm thanh chuông thanh thoát, êm dịu mà không cần tải file MP3 nặng.
 */
class SoundService {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(frequency, type = 'sine', duration = 0.2, gainValue = 0.15) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainValue, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Ignore audio autoplay restrictions
    }
  }

  playCountdown() {
    this.playTone(440, 'sine', 0.1, 0.12);
  }

  playRepBeep() {
    // 2-tone melodic chirp
    this.playTone(587.33, 'sine', 0.12, 0.15); // D5
    setTimeout(() => this.playTone(880, 'sine', 0.15, 0.12), 80); // A5
  }

  playRestChime() {
    this.playTone(523.25, 'triangle', 0.4, 0.15); // C5
    setTimeout(() => this.playTone(392.00, 'sine', 0.6, 0.15), 180); // G4
  }

  playVictory() {
    // Happy chord progression
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.35, 0.18), idx * 120);
    });
  }
}

export const soundService = new SoundService();

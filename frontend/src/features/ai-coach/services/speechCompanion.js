/**
 * FitPet Voice Companion Service
 * Sử dụng Web Speech API (SpeechSynthesis) với giọng đọc Tiếng Việt (vi-VN).
 * Chạy 100% cục bộ trên trình duyệt/thiết bị của người dùng, không tốn data, độ trễ tức thì và bảo mật tuyệt đối.
 */

class SpeechCompanionService {
  constructor() {
    this.isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
    this.isMuted = false;
    this.currentUtterance = null;
    this.vietnameseVoice = null;
    
    // Load persisted mute preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fitpet_voice_muted');
      if (saved !== null) {
        this.isMuted = saved === 'true';
      }

      if (this.isSupported) {
        this.initVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
          window.speechSynthesis.onvoiceschanged = () => {
            this.initVoices();
          };
        }
      }
    }
  }

  initVoices() {
    if (!this.isSupported) return;
    try {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return;

      // Find the best Vietnamese voice available on the device (Android, iOS, Windows, macOS)
      const viVoice = voices.find(v => {
        const lang = (v.lang || '').toLowerCase();
        const name = (v.name || '').toLowerCase();
        return (
          lang === 'vi-vn' ||
          lang === 'vi_vn' ||
          lang.startsWith('vi') ||
          name.includes('vietnam') ||
          name.includes('tiếng việt') ||
          name.includes('hoaimy') ||
          name.includes('namminh') ||
          name.includes('linh') ||
          name.includes('an')
        );
      });

      if (viVoice) {
        this.vietnameseVoice = viVoice;
      }
    } catch (e) {
      // Ignore
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('fitpet_voice_muted', String(muted));
      if (muted) {
        this.stop();
      }
    }
  }

  toggleMute() {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  speak(text, priority = false) {
    if (!this.isSupported || this.isMuted || !text) return;

    try {
      if (priority) {
        window.speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.92; // Tốc độ đọc thân thiện, truyền cảm
      utterance.pitch = 1.02; // Tông giọng ấm áp, khích lệ

      if (!this.vietnameseVoice) {
        this.initVoices();
      }

      if (this.vietnameseVoice) {
        utterance.voice = this.vietnameseVoice;
      }

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis unavailable or blocked:', e);
    }
  }

  stop() {
    if (this.isSupported) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // Ignore
      }
    }
  }
}

export const speechCompanion = new SpeechCompanionService();

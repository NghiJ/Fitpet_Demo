/**
 * FitPet Voice Companion Service
 * Uses standard Web Speech API (SpeechSynthesis) for local, client-side, zero-latency cues.
 * Note: Clearly transparent—does not require external cloud AI calls or microphone access.
 */

class SpeechCompanionService {
  constructor() {
    this.isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
    this.isMuted = false;
    this.currentUtterance = null;
    
    // Load persisted mute preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fitpet_voice_muted');
      if (saved !== null) {
        this.isMuted = saved === 'true';
      }
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
      utterance.rate = 0.95; // Friendly, calm pacing
      utterance.pitch = 1.05; // Warm, encouraging tone
      utterance.lang = 'en-US';

      // Pick an agreeable natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => 
        (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Google UK English Female') || v.name.includes('Google US English')) && v.lang.startsWith('en')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
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

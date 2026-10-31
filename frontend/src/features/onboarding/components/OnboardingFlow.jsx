import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Check, Clock, Volume2, Heart } from 'lucide-react';
import { VirtualPet } from '../../pet/components/VirtualPet';
import { soundService } from '../../workout/services/soundService';

export const OnboardingFlow = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    timePreference: 3, // minutes
    focusArea: 'neck-shoulder',
    voiceEnabled: true
  });

  const totalSteps = 4;

  const handleNext = () => {
    soundService.playTone(440, 'sine', 0.1);
    if (step < totalSteps) {
      setStep(prev => prev + 1);
    } else {
      finishOnboarding();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const finishOnboarding = () => {
    soundService.playVictory();
    try {
      localStorage.setItem('fitpet_onboarding_completed', 'true');
      localStorage.setItem('fitpet_user_preferences', JSON.stringify(preferences));
    } catch (e) {
      console.warn('Unable to save onboarding preferences:', e);
    }
    onComplete(preferences);
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-content" style={{ maxWidth: '460px', padding: '28px 20px', textAlign: 'center' }}>
        {/* Progress Bar & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="btn-ghost"
              style={{ fontSize: '0.82rem', padding: '4px 8px' }}
            >
              <ArrowLeft size={15} style={{ marginRight: '4px' }} /> Lại
            </button>
          ) : <div style={{ width: '40px' }} />}

          <div style={{ display: 'flex', gap: '6px' }}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: i + 1 === step ? '20px' : '6px',
                  height: '6px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: i + 1 <= step ? 'var(--color-brand-primary)' : 'var(--color-border)',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>

          <button
            onClick={finishOnboarding}
            className="btn-ghost"
            style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', padding: '4px 8px' }}
          >
            Bỏ qua
          </button>
        </div>

        {/* Step 1: Mascot Welcome */}
        {step === 1 && (
          <div>
            <div style={{ marginBottom: '14px' }}>
              <VirtualPet state="cheering" size="lg" message="Chào bạn, mình là Pip!" showSpeechBubble={true} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '6px' }}>
              Chào mừng bạn đến với FitPet
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', maxWidth: '340px', margin: '0 auto 20px auto' }}>
              2-5 phút vận động giải tỏa mỏi cơ mỗi ngày cùng Pip. Không áp lực, không cần dụng cụ!
            </p>
          </div>
        )}

        {/* Step 2: Preferred Workout Duration */}
        {step === 2 && (
          <div>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-brand-light)', color: 'var(--color-brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
              <Clock size={24} />
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '4px' }}>
              Thời Gian Giải Lao Phù Hợp
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem', marginBottom: '18px' }}>
              Chọn thời lượng bạn mong muốn cho mỗi lần nghỉ:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '340px', margin: '0 auto 20px auto' }}>
              {[
                { time: 2, label: '2 Phút', sub: 'Nhanh gọn giữa các giờ làm' },
                { time: 3, label: '3 Phút (Gợi ý)', sub: 'Giải tỏa cổ vai gáy lý tưởng' },
                { time: 5, label: '5 Phút', sub: 'Thư giãn sâu toàn diện' }
              ].map(item => (
                <button
                  key={item.time}
                  onClick={() => setPreferences(prev => ({ ...prev, timePreference: item.time }))}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: preferences.timePreference === item.time ? 'var(--color-brand-light)' : 'var(--color-surface)',
                    border: `1.5px solid ${preferences.timePreference === item.time ? 'var(--color-brand-primary)' : 'var(--color-border)'}`,
                    textAlign: 'left',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--color-text-primary)' }}>{item.label}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{item.sub}</div>
                  </div>
                  {preferences.timePreference === item.time && (
                    <Check size={16} style={{ color: 'var(--color-brand-primary)' }} />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Focus Discomfort Area */}
        {step === 3 && (
          <div>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-pet-warmth)', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
              <Heart size={24} />
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '4px' }}>
              Vùng Bạn Thường Mỏi Nhất?
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem', marginBottom: '16px' }}>
              FitPet sẽ ưu tiên bài tập giải tỏa vùng này đầu tiên:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', maxWidth: '340px', margin: '0 auto 20px auto' }}>
              {[
                { id: 'neck-shoulder', icon: '💆', label: 'Cổ Vai Gáy' },
                { id: 'lower-back', icon: '🪑', label: 'Thắt Lưng' },
                { id: 'wrist-hand', icon: '⌨️', label: 'Cổ Tay' },
                { id: 'hip-legs', icon: '🧘', label: 'Hông & Chân' }
              ].map(area => (
                <button
                  key={area.id}
                  onClick={() => setPreferences(prev => ({ ...prev, focusArea: area.id }))}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: preferences.focusArea === area.id ? 'var(--color-brand-light)' : 'var(--color-surface)',
                    border: `1.5px solid ${preferences.focusArea === area.id ? 'var(--color-brand-primary)' : 'var(--color-border)'}`,
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>{area.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--color-text-primary)' }}>{area.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: AI Voice Coach Preference */}
        {step === 4 && (
          <div>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-brand-light)', color: 'var(--color-brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
              <Volume2 size={24} />
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '4px' }}>
              Giọng Nói AI Hướng Dẫn
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem', marginBottom: '20px' }}>
              Trợ lý âm thanh nhắc nhở nhịp thở và cách giữ thẳng lưng khi tập.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '24px' }}>
              <button
                onClick={() => setPreferences(prev => ({ ...prev, voiceEnabled: true }))}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: preferences.voiceEnabled ? 'var(--color-brand-light)' : 'var(--color-surface)',
                  border: `1.5px solid ${preferences.voiceEnabled ? 'var(--color-brand-primary)' : 'var(--color-border)'}`,
                  fontWeight: 700,
                  fontSize: '0.88rem'
                }}
              >
                🔊 Bật giọng nói
              </button>
              <button
                onClick={() => setPreferences(prev => ({ ...prev, voiceEnabled: false }))}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: !preferences.voiceEnabled ? 'var(--color-brand-light)' : 'var(--color-surface)',
                  border: `1.5px solid ${!preferences.voiceEnabled ? 'var(--color-brand-primary)' : 'var(--color-border)'}`,
                  fontWeight: 700,
                  fontSize: '0.88rem'
                }}
              >
                🔇 Tập im lặng
              </button>
            </div>
          </div>
        )}

        {/* Navigation Action */}
        <button
          onClick={handleNext}
          className="btn-primary"
          style={{ width: '100%', maxWidth: '320px', margin: '0 auto', justifyContent: 'center', fontSize: '0.98rem', padding: '11px' }}
        >
          {step === totalSteps ? 'Bắt Đầu Ngay!' : 'Tiếp Tục'}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default OnboardingFlow;

import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Check, Clock, Volume2, ShieldCheck, Heart } from 'lucide-react';
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
      <div className="modal-content" style={{ maxWidth: '520px', padding: '32px 24px', textAlign: 'center' }}>
        {/* Progress Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="btn-ghost"
              style={{ fontSize: '0.84rem', padding: '4px 8px' }}
            >
              <ArrowLeft size={16} style={{ marginRight: '4px' }} /> Quay lại
            </button>
          ) : <div style={{ width: '80px' }} />}

          <div style={{ display: 'flex', gap: '6px' }}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: i + 1 === step ? '24px' : '8px',
                  height: '8px',
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
            style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', padding: '4px 8px' }}
          >
            Bỏ qua
          </button>
        </div>

        {/* Step 1: Welcome & Pip Introduction */}
        {step === 1 && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <VirtualPet state="cheering" size="lg" message="Chào bạn! Mình là Pip!" showSpeechBubble={true} />
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>
              Chào mừng bạn đến với FitPet
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.55, maxWidth: '420px', margin: '0 auto 24px auto' }}>
              Giải pháp vận động ngắn 2-5 phút cho người làm việc và học tập nhiều giờ. Không áp lực, không cần dụng cụ, Pip sẽ luôn đồng hành cùng bạn!
            </p>
          </div>
        )}

        {/* Step 2: Preferred Workout Duration */}
        {step === 2 && (
          <div>
            <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-brand-light)', color: 'var(--color-brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <Clock size={28} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>
              Thời Gian Nghỉ Phù Hợp Với Bạn
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', marginBottom: '24px' }}>
              Bạn muốn dành bao nhiêu phút cho mỗi lần giải lao vận động?
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '360px', margin: '0 auto 24px auto' }}>
              {[
                { time: 2, label: '2 Phút', sub: 'Cực nhanh giữa 2 cuộc họp' },
                { time: 3, label: '3 Phút (Khuyên Dùng)', sub: 'Lý tưởng giải phóng cổ vai gáy' },
                { time: 5, label: '5 Phút', sub: 'Đầy đủ phục hồi và đánh thức năng lượng' }
              ].map(item => (
                <button
                  key={item.time}
                  onClick={() => setPreferences(prev => ({ ...prev, timePreference: item.time }))}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: preferences.timePreference === item.time ? 'var(--color-brand-light)' : 'var(--color-surface)',
                    border: `1.5px solid ${preferences.timePreference === item.time ? 'var(--color-brand-primary)' : 'var(--color-border)'}`,
                    textAlign: 'left',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.96rem', color: 'var(--color-text-primary)' }}>{item.label}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{item.sub}</div>
                  </div>
                  {preferences.timePreference === item.time && (
                    <Check size={18} style={{ color: 'var(--color-brand-primary)' }} />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Focus Discomfort Area */}
        {step === 3 && (
          <div>
            <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-pet-warmth)', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <Heart size={28} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>
              Vùng Bạn Thường Mỏi Nhất
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', marginBottom: '20px' }}>
              FitPet sẽ ưu tiên gợi ý các động tác giải tỏa vùng này đầu tiên.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', maxWidth: '380px', margin: '0 auto 24px auto' }}>
              {[
                { id: 'neck-shoulder', icon: '💆', label: 'Cổ & Vai Gáy' },
                { id: 'lower-back', icon: '🪑', label: 'Thắt Lưng' },
                { id: 'wrist-hand', icon: '⌨️', label: 'Cổ Tay & Ngón' },
                { id: 'hip-legs', icon: '🧘', label: 'Hông & Chân' }
              ].map(area => (
                <button
                  key={area.id}
                  onClick={() => setPreferences(prev => ({ ...prev, focusArea: area.id }))}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '16px 12px',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: preferences.focusArea === area.id ? 'var(--color-brand-light)' : 'var(--color-surface)',
                    border: `1.5px solid ${preferences.focusArea === area.id ? 'var(--color-brand-primary)' : 'var(--color-border)'}`,
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>{area.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-text-primary)' }}>{area.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: AI Voice Coach Preference & Finish */}
        {step === 4 && (
          <div>
            <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-brand-light)', color: 'var(--color-brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <Volume2 size={28} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>
              Giọng Nói AI Đồng Hành
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', marginBottom: '24px' }}>
              Trợ lý âm thanh sẽ nhắc nhở nhịp thở và tư thế ngắn gọn trong khi bạn tập.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginBottom: '28px' }}>
              <button
                onClick={() => setPreferences(prev => ({ ...prev, voiceEnabled: true }))}
                style={{
                  padding: '14px 22px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: preferences.voiceEnabled ? 'var(--color-brand-light)' : 'var(--color-surface)',
                  border: `1.5px solid ${preferences.voiceEnabled ? 'var(--color-brand-primary)' : 'var(--color-border)'}`,
                  fontWeight: 700,
                  fontSize: '0.92rem'
                }}
              >
                Bật Giọng Nói (Khuyên Dùng)
              </button>
              <button
                onClick={() => setPreferences(prev => ({ ...prev, voiceEnabled: false }))}
                style={{
                  padding: '14px 22px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: !preferences.voiceEnabled ? 'var(--color-brand-light)' : 'var(--color-surface)',
                  border: `1.5px solid ${!preferences.voiceEnabled ? 'var(--color-brand-primary)' : 'var(--color-border)'}`,
                  fontWeight: 700,
                  fontSize: '0.92rem'
                }}
              >
                Tập Trong Im Lặng
              </button>
            </div>
          </div>
        )}

        {/* Navigation Action */}
        <button
          onClick={handleNext}
          className="btn-primary"
          style={{ width: '100%', maxWidth: '340px', margin: '0 auto', justifyContent: 'center', fontSize: '1.05rem' }}
        >
          {step === totalSteps ? 'Sẵn Sàng Vận Động!' : 'Tiếp Tục'}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Volume2, VolumeX, Moon, Sun, ShieldAlert, Sparkles, Check, Music } from 'lucide-react';
import { speechCompanion } from '../ai-coach/services/speechCompanion';
import { soundService } from '../workout/services/soundService';

export const PreferencesView = ({ currentTheme, onToggleTheme }) => {
  const [isVoiceMuted, setIsVoiceMuted] = useState(speechCompanion.isMuted);
  const [testSpeechStatus, setTestSpeechStatus] = useState('');

  const handleVoiceToggle = () => {
    const next = speechCompanion.toggleMute();
    setIsVoiceMuted(next);
  };

  const handleTestVoice = () => {
    soundService.playTone(523.25, 'sine', 0.2);
    if (isVoiceMuted) {
      setTestSpeechStatus('Giọng nói đang tắt. Hãy bật âm thanh trước khi nghe thử.');
      return;
    }
    setTestSpeechStatus('Đang phát giọng đọc mẫu...');
    speechCompanion.speak('Xin chào! Mình là trợ lý FitPet. Mình sẽ hướng dẫn các lưu ý động tác nhẹ nhàng cho bạn.', true);
    setTimeout(() => setTestSpeechStatus(''), 4000);
  };

  const handleTestChime = () => {
    soundService.playVictory();
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', width: '100%', paddingBottom: 'var(--space-12)' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '6px' }}>Cài Đặt & Quyền Riêng Tư</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          Tùy chỉnh âm thanh, giao diện hiển thị và thiết lập trải nghiệm vận động phù hợp nhất với bạn.
        </p>
      </div>

      {/* Voice Companion Settings */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>Giọng Nói AI & Âm Thanh</h2>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--color-border-subtle)', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ flex: '1 1 200px' }}>
            <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>Giọng nói hướng dẫn</div>
            <div style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              Nhắc nhở nhịp thở và lưu ý tư thế (xử lý trực tiếp trên trình duyệt, 100% riêng tư)
            </div>
          </div>
          <button
            className={`btn-secondary ${!isVoiceMuted ? 'active' : ''}`}
            onClick={handleVoiceToggle}
            style={{ minWidth: '110px' }}
          >
            {isVoiceMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
            {isVoiceMuted ? 'Đang Tắt' : 'Đang Bật'}
          </button>
        </div>

        <div style={{ marginTop: '18px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            className="btn-ghost"
            onClick={handleTestVoice}
            style={{ fontSize: '0.86rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
          >
            <Volume2 size={15} style={{ marginRight: '4px' }} />
            Nghe thử giọng đọc mẫu
          </button>

          <button
            className="btn-ghost"
            onClick={handleTestChime}
            style={{ fontSize: '0.86rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
          >
            <Music size={15} style={{ marginRight: '4px' }} />
            Thử chuông hoàn thành
          </button>

          {testSpeechStatus && (
            <span style={{ fontSize: '0.84rem', color: 'var(--color-brand-primary)', fontWeight: 600 }}>
              {testSpeechStatus}
            </span>
          )}
        </div>
      </div>

      {/* Theme Settings */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>Giao Diện Hiển Thị</h2>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ flex: '1 1 200px' }}>
            <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>Chế độ màu</div>
            <div style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              Hiện tại đang dùng {currentTheme === 'dark' ? 'Giao diện Tối (Dark Mode)' : 'Giao diện Sáng (Light Mode)'}
            </div>
          </div>
          <button
            className="btn-secondary"
            onClick={onToggleTheme}
            style={{ minWidth: '110px' }}
          >
            {currentTheme === 'dark' ? <Moon size={17} /> : <Sun size={17} />}
            {currentTheme === 'dark' ? 'Tối' : 'Sáng'}
          </button>
        </div>
      </div>

      {/* Trust & Medical Disclaimer */}
      <div className="card-subtle" style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '16px' }}>
        <ShieldAlert size={22} style={{ color: 'var(--color-brand-primary)', flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>
          <strong>Lưu ý sức khỏe:</strong> FitPet được tạo ra nhằm khuyến khích những quãng nghỉ vận động ngắn cho người ngồi nhiều. Ứng dụng không thay thế chẩn đoán y tế, phục hồi chức năng sau chấn thương hay huấn luyện thể thao chuyên nghiệp. Luôn vận động trong giới hạn dễ chịu của khớp và cơ thể bạn.
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  Bell, Clock, Play, Pause, RotateCcw, Volume2, Sparkles, 
  CheckCircle2, ShieldCheck, Calendar, Sun, Coffee, Zap, ChevronRight, Award
} from 'lucide-react';
import { reminderService } from '../services/reminderService';
import { CURATED_WORKOUTS } from '../../workout/data/curatedWorkouts';
import { soundService } from '../../workout/services/soundService';

export const DeskReminderPage = ({ onStartWorkout }) => {
  const [settings, setSettings] = useState(() => reminderService.getSettings());
  const [timerMode, setTimerMode] = useState('work'); // 'work' | 'break'
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes default in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Synchronize settings
  useEffect(() => {
    const unsub = reminderService.subscribe(setSettings);
    return () => unsub();
  }, []);

  // Pomodoro countdown timer tick
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
      soundService.playVictory();
      if (timerMode === 'work') {
        setToastMessage('🎉 Đã hoàn thành 45 phút tập trung! Hãy nghỉ giải lao 3 phút cùng Pip.');
        setTimerMode('break');
        setTimeLeft(3 * 60);
      } else {
        setToastMessage('✨ Sẵn sàng tiếp tục công việc đầy năng lượng!');
        setTimerMode('work');
        setTimeLeft(settings.intervalMinutes * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, timerMode, settings.intervalMinutes]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleToggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
    soundService.playTone(isTimerRunning ? 350 : 523.25, 'sine', 0.15);
  };

  const handleResetTimer = (minutes = settings.intervalMinutes) => {
    setIsTimerRunning(false);
    setTimeLeft(minutes * 60);
    setTimerMode('work');
  };

  const handleIntervalChange = (mins) => {
    const updated = reminderService.updateSetting('intervalMinutes', mins);
    setSettings(updated);
    if (!isTimerRunning && timerMode === 'work') {
      setTimeLeft(mins * 60);
    }
    showToast(`Đã đổi tần suất nhắc: Mỗi ${mins} phút`);
  };

  const handleToggleSlot = (slotId) => {
    const updated = reminderService.toggleScheduleSlot(slotId);
    setSettings(updated);
    showToast('Đã cập nhật lịch trình');
  };

  const handleTestSound = () => {
    soundService.playVictory();
    showToast('Đang phát chuông nhắc thử...');
  };

  // Format MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const totalSeconds = timerMode === 'work' ? settings.intervalMinutes * 60 : 3 * 60;
  const progressPercent = Math.max(0, Math.min(100, ((totalSeconds - timeLeft) / totalSeconds) * 100));

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', width: '100%', boxSizing: 'border-box', paddingBottom: 'var(--space-12)' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '16px',
          left: '16px',
          maxWidth: '400px',
          margin: '0 auto',
          zIndex: 1000,
          backgroundColor: 'var(--color-brand-primary)',
          color: '#FFFFFF',
          padding: '10px 16px',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.86rem',
          fontWeight: 700
        }}>
          <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '18px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-brand-primary)', marginBottom: '4px' }}>
          <Clock size={15} /> Nhắc Nhở Vận Động & Pomodoro Bàn Làm Việc
        </div>
        <h1 style={{ fontSize: 'clamp(1.35rem, 5vw, 1.85rem)', fontWeight: 800, marginBottom: '6px', letterSpacing: '-0.02em' }}>
          Đồng Hồ Nhắc Nhở Văn Phòng
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem', lineHeight: 1.5 }}>
          Chống ngồi lâu một chỗ. Tự động nhắc bạn đứng dậy vươn vai sau mỗi 45 phút làm việc.
        </p>
      </div>

      {/* Hero Pomodoro Widget */}
      <div className="card" style={{
        padding: '20px 14px',
        marginBottom: '20px',
        textAlign: 'center',
        background: timerMode === 'work' 
          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(255, 255, 255, 0.95) 100%)'
          : 'linear-gradient(135deg, rgba(255, 107, 74, 0.1) 0%, rgba(255, 255, 255, 0.95) 100%)',
        border: '2px solid var(--color-border)',
        boxShadow: 'var(--shadow-md)',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '14px' }}>
          <span className={`badge ${timerMode === 'work' ? 'badge-brand' : 'badge-amber'}`} style={{ fontSize: '0.8rem', padding: '5px 12px' }}>
            {timerMode === 'work' ? '💻 Chế Độ Làm Việc Tập Trung' : '🧘 Nghỉ Giải Lao Cùng Pip'}
          </span>
        </div>

        {/* Big Countdown Number */}
        <div style={{
          fontSize: 'clamp(2.8rem, 11vw, 4.2rem)',
          fontWeight: 900,
          letterSpacing: '-0.04em',
          color: timerMode === 'work' ? 'var(--color-brand-dark)' : 'var(--color-accent)',
          fontFamily: 'monospace',
          lineHeight: 1,
          marginBottom: '10px'
        }}>
          {timeFormatted}
        </div>

        {/* Progress Bar */}
        <div style={{
          width: '100%',
          maxWidth: '380px',
          height: '8px',
          backgroundColor: 'var(--color-surface-subtle)',
          borderRadius: 'var(--radius-full)',
          margin: '0 auto 16px auto',
          overflow: 'hidden',
          border: '1px solid var(--color-border)'
        }}>
          <div style={{
            height: '100%',
            width: `${progressPercent}%`,
            backgroundColor: timerMode === 'work' ? 'var(--color-brand-primary)' : 'var(--color-accent)',
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.3s ease'
          }} />
        </div>

        <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', marginBottom: '18px', padding: '0 8px' }}>
          {timerMode === 'work' 
            ? 'Đang đếm ngược. Khi hết giờ, chuông sẽ reo nhắc bạn vươn vai 3 phút.'
            : 'Đã đến giờ nghỉ ngơi! Hãy chọn một bài tập nhẹ để nạp lại năng lượng.'}
        </p>

        {/* Control Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={handleToggleTimer}
            className="btn-primary"
            style={{
              padding: '10px 22px',
              fontSize: '0.98rem',
              backgroundColor: timerMode === 'work' ? 'var(--color-brand-primary)' : 'var(--color-accent)',
              borderColor: timerMode === 'work' ? 'var(--color-brand-primary)' : 'var(--color-accent)'
            }}
          >
            {isTimerRunning ? <Pause size={17} /> : <Play size={17} fill="currentColor" />}
            {isTimerRunning ? 'Tạm Dừng' : 'Bắt Đầu Đếm'}
          </button>

          <button
            onClick={() => handleResetTimer()}
            className="btn-secondary"
            style={{ padding: '10px 16px', fontSize: '0.9rem' }}
          >
            <RotateCcw size={15} /> Đặt Lại
          </button>

          {timerMode === 'break' && (
            <button
              onClick={() => {
                const w = CURATED_WORKOUTS[0];
                onStartWorkout(w);
              }}
              className="btn-primary"
              style={{ padding: '10px 18px', fontSize: '0.9rem', backgroundColor: 'var(--color-accent)', borderColor: 'var(--color-accent)' }}
            >
              <Zap size={15} /> Tập Ngay 3 Phút
            </button>
          )}
        </div>
      </div>

      {/* Interval Selector Buttons */}
      <div className="card" style={{ padding: '18px 14px', marginBottom: '20px', boxSizing: 'border-box' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '4px' }}>
          Tần Suất Nhắc Nhở Giải Lao
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginBottom: '14px', lineHeight: 1.4 }}>
          Theo khuyến nghị công thái học, dân văn phòng nên đổi tư thế sau mỗi 45 - 60 phút.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(105px, 1fr))', gap: '8px' }}>
          {[30, 45, 60, 90].map(mins => {
            const isSelected = settings.intervalMinutes === mins;
            return (
              <button
                key={mins}
                onClick={() => handleIntervalChange(mins)}
                style={{
                  padding: '10px 8px',
                  borderRadius: 'var(--radius-md)',
                  border: isSelected ? '2px solid var(--color-brand-primary)' : '1px solid var(--color-border)',
                  backgroundColor: isSelected ? 'var(--color-brand-light)' : 'var(--color-surface)',
                  color: isSelected ? 'var(--color-brand-dark)' : 'var(--color-text-primary)',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <span>{mins} Phút</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: isSelected ? 'var(--color-brand-primary)' : 'var(--color-text-muted)' }}>
                  {mins === 45 ? 'Khuyên dùng ⭐' : `${mins / 60 >= 1 ? mins / 60 + ' giờ' : mins + 'p'}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 Ideal Desk Movement Slots in the Day */}
      <div className="card" style={{ padding: '18px 14px', marginBottom: '20px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>
              Khung Giờ Vận Động Lý Tưởng Trong Ngày
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: '2px 0 0 0' }}>
              4 mốc vàng giúp đánh tan cơn buồn ngủ và giải tỏa các khớp cơ văn phòng.
            </p>
          </div>
          <button
            onClick={handleTestSound}
            className="btn-ghost"
            style={{ fontSize: '0.78rem', border: '1px solid var(--color-border)', padding: '4px 8px', borderRadius: 'var(--radius-full)' }}
          >
            <Volume2 size={13} style={{ marginRight: '3px' }} /> Thử chuông
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {settings.idealSchedule.map(slot => {
            const targetWorkout = CURATED_WORKOUTS.find(w => w.id === slot.workoutId) || CURATED_WORKOUTS[0];
            return (
              <div
                key={slot.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: slot.enabled ? 'var(--color-surface)' : 'var(--color-surface-subtle)',
                  border: slot.enabled ? '1.5px solid var(--color-border)' : '1px dashed var(--color-border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px',
                  opacity: slot.enabled ? 1 : 0.65
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 180px' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-brand-light)',
                    color: 'var(--color-brand-dark)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '0.92rem',
                    flexShrink: 0
                  }}>
                    <span>{slot.time}</span>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 800, marginBottom: '2px' }}>
                      {slot.label}
                    </h4>
                    <div style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {slot.durationMinutes} phút • {targetWorkout.title}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
                  <button
                    onClick={() => handleToggleSlot(slot.id)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: 'var(--radius-full)',
                      border: slot.enabled ? '1.5px solid var(--color-brand-primary)' : '1px solid var(--color-border)',
                      backgroundColor: slot.enabled ? 'var(--color-brand-light)' : 'transparent',
                      color: slot.enabled ? 'var(--color-brand-dark)' : 'var(--color-text-muted)',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {slot.enabled ? 'Đang Bật' : 'Tắt'}
                  </button>

                  <button
                    onClick={() => onStartWorkout(targetWorkout)}
                    className="btn-secondary"
                    style={{ padding: '5px 10px', fontSize: '0.78rem', color: 'var(--color-brand-primary)' }}
                    title="Tập ngay bài này"
                  >
                    <Play size={12} fill="currentColor" /> Tập
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ergonomic Desk Tip Banner */}
      <div className="card-subtle" style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        border: '1px solid var(--color-brand-primary)',
        borderRadius: 'var(--radius-lg)'
      }}>
        <ShieldCheck size={24} style={{ color: 'var(--color-brand-primary)', flexShrink: 0 }} />
        <div style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
          <strong>Mẹo tư thế văn phòng:</strong> Mép trên của màn hình máy tính nên ngang tầm mắt, khuỷu tay gập góc 90 độ và bàn chân đặt phẳng trên mặt sàn để giảm 40% áp lực cột sống.
        </div>
      </div>
    </div>
  );
};

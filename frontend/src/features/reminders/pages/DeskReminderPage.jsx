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
        setToastMessage('🎉 Đã xong 45p làm việc! Cùng Mochi vươn vai 3 phút nhé.');
        setTimerMode('break');
        setTimeLeft(3 * 60);
      } else {
        setToastMessage('✨ Sẵn sàng tiếp tục làm việc tràn đầy năng lượng!');
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
    showToast(`Đã đổi tần suất: Nhắc mỗi ${mins} phút`);
  };

  const handleToggleSlot = (slotId) => {
    const updated = reminderService.toggleScheduleSlot(slotId);
    setSettings(updated);
    showToast('Đã cập nhật lịch trình');
  };

  const handleTestSound = () => {
    soundService.playVictory();
    showToast('Đang phát chuông thử nghiệm...');
  };

  // Format MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const totalSeconds = timerMode === 'work' ? settings.intervalMinutes * 60 : 3 * 60;
  const progressPercent = Math.max(0, Math.min(100, ((totalSeconds - timeLeft) / totalSeconds) * 100));

  return (
    <div style={{ width: '100%', padding: '4px 6px 120px 6px', boxSizing: 'border-box' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '16px',
          left: '16px',
          maxWidth: '380px',
          margin: '0 auto',
          zIndex: 1000,
          backgroundColor: '#F78C25',
          color: '#FFFFFF',
          padding: '12px 18px',
          borderRadius: '9999px',
          boxShadow: '0 8px 24px rgba(247, 140, 37, 0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.88rem',
          fontWeight: 700
        }}>
          <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '16px', padding: '0 4px' }}>
        <div style={{
          fontSize: '0.72rem',
          fontWeight: 800,
          color: '#F78C25',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '4px'
        }}>
          NHẮC NHỞ & POMODORO
        </div>
        <h1 style={{
          fontSize: '1.45rem',
          fontWeight: 900,
          color: '#133E35',
          margin: '0 0 6px 0',
          lineHeight: 1.2
        }}>
          Đồng Hồ Nhắc Vận Động ⏰
        </h1>
        <p style={{
          fontSize: '0.86rem',
          color: '#4A6B63',
          margin: 0,
          lineHeight: 1.45
        }}>
          Chống ngồi lâu một chỗ. Tự động nhắc bạn đứng dậy vươn vai cùng Mochi sau mỗi phiên làm việc.
        </p>
      </div>

      {/* Hero Pomodoro Widget in Seafoam Mint */}
      <div className="card-mint" style={{
        padding: '24px 20px',
        marginBottom: '16px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#FFFFFF',
          color: '#133E35',
          fontSize: '0.76rem',
          fontWeight: 800,
          padding: '5px 14px',
          borderRadius: '9999px',
          marginBottom: '16px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
        }}>
          {timerMode === 'work' ? '💻 Phiên Tập Trung Làm Việc' : '🧘 Nghỉ Giải Lao Cùng Mochi 🐾'}
        </div>

        {/* Big Circular Countdown Display */}
        <div style={{
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 20px rgba(19, 62, 53, 0.12)',
          marginBottom: '16px'
        }}>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            color: timerMode === 'work' ? '#133E35' : '#F78C25',
            fontFamily: 'monospace',
            lineHeight: 1
          }}>
            {timeFormatted}
          </div>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#7E9F97', marginTop: '4px', textTransform: 'uppercase' }}>
            {timerMode === 'work' ? 'Thời gian còn lại' : 'Nghỉ giải lao'}
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{
          width: '100%',
          maxWidth: '280px',
          height: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          borderRadius: '9999px',
          overflow: 'hidden',
          marginBottom: '14px'
        }}>
          <div style={{
            height: '100%',
            width: `${progressPercent}%`,
            backgroundColor: timerMode === 'work' ? '#133E35' : '#F78C25',
            borderRadius: '9999px',
            transition: 'width 0.3s ease'
          }} />
        </div>

        <p style={{
          fontSize: '0.82rem',
          color: '#133E35',
          margin: '0 0 16px 0',
          fontWeight: 600,
          lineHeight: 1.4
        }}>
          {timerMode === 'work' 
            ? 'Đang đếm ngược. Khi hết giờ, chuông sẽ reo nhắc bạn vươn vai 3 phút.'
            : 'Đã đến giờ nghỉ ngơi! Hãy chọn một bài tập nhẹ để nạp lại năng lượng.'}
        </p>

        {/* Control Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={handleToggleTimer}
            className="btn-orange"
            style={{ padding: '10px 22px', fontSize: '0.92rem' }}
          >
            {isTimerRunning ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}
            <span>{isTimerRunning ? 'Tạm Dừng' : 'Bắt Đầu Đếm'}</span>
          </button>

          <button
            onClick={() => handleResetTimer()}
            style={{
              backgroundColor: '#FFFFFF',
              color: '#133E35',
              border: 'none',
              borderRadius: '9999px',
              padding: '10px 18px',
              fontSize: '0.86rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RotateCcw size={14} /> Đặt Lại
          </button>

          {timerMode === 'break' && (
            <button
              onClick={() => {
                const w = CURATED_WORKOUTS[0];
                onStartWorkout(w);
              }}
              className="btn-orange"
              style={{ padding: '10px 20px', fontSize: '0.88rem' }}
            >
              <Zap size={15} /> Tập Ngay 3 Phút
            </button>
          )}
        </div>
      </div>

      {/* Interval Selector Buttons in Peach Card */}
      <div className="card-peach" style={{ padding: '18px 16px', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#133E35', margin: '0 0 4px 0' }}>
          Tần Suất Nhắc Nhở Giải Lao
        </h3>
        <p style={{ fontSize: '0.8rem', color: '#6A564C', margin: '0 0 12px 0', lineHeight: 1.4 }}>
          Khuyến nghị công thái học: Đổi tư thế ngồi sau mỗi 45 - 60 phút.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
          {[30, 45, 60, 90].map(mins => {
            const isSelected = settings.intervalMinutes === mins;
            return (
              <button
                key={mins}
                onClick={() => handleIntervalChange(mins)}
                style={{
                  padding: '10px 4px',
                  borderRadius: '16px',
                  border: isSelected ? '2px solid #F78C25' : '1px solid rgba(0,0,0,0.06)',
                  backgroundColor: isSelected ? '#F78C25' : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : '#133E35',
                  fontWeight: 900,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  boxShadow: isSelected ? '0 3px 8px rgba(247, 140, 37, 0.25)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{mins}p</span>
                <span style={{ fontSize: '0.62rem', fontWeight: 700, color: isSelected ? '#FFFFFF' : '#7E9F97' }}>
                  {mins === 45 ? 'Khuyên dùng' : `${mins / 60 >= 1 ? mins / 60 + 'h' : mins + 'p'}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 Ideal Desk Movement Slots in the Day */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        padding: '18px 16px',
        marginBottom: '16px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h3 style={{ fontSize: '0.96rem', fontWeight: 900, color: '#133E35', margin: 0 }}>
              Khung Giờ Lý Tưởng Trong Ngày
            </h3>
            <p style={{ fontSize: '0.76rem', color: '#7E9F97', margin: '2px 0 0 0' }}>
              4 mốc vàng giúp đánh tan mệt mỏi
            </p>
          </div>
          <button
            onClick={handleTestSound}
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              backgroundColor: '#FEDFD2',
              color: '#8A4828',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '9999px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Volume2 size={12} /> Thử chuông
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {settings.idealSchedule.map(slot => {
            const targetWorkout = CURATED_WORKOUTS.find(w => w.id === slot.workoutId) || CURATED_WORKOUTS[0];
            return (
              <div
                key={slot.id}
                style={{
                  padding: '10px 12px',
                  borderRadius: '16px',
                  backgroundColor: slot.enabled ? 'rgba(114, 213, 195, 0.12)' : '#F8FAFC',
                  border: slot.enabled ? '1px solid rgba(114, 213, 195, 0.4)' : '1px dashed #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  opacity: slot.enabled ? 1 : 0.65
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: '#133E35',
                    color: '#FFFFFF',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '0.82rem',
                    flexShrink: 0
                  }}>
                    <span>{slot.time}</span>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '0.86rem', fontWeight: 800, color: '#133E35', margin: '0 0 2px 0' }}>
                      {slot.label}
                    </h4>
                    <div style={{ fontSize: '0.72rem', color: '#7E9F97', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={11} /> {slot.durationMinutes}p • {targetWorkout.title}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button
                    onClick={() => handleToggleSlot(slot.id)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '9999px',
                      border: 'none',
                      backgroundColor: slot.enabled ? '#133E35' : '#CBD5E1',
                      color: '#FFFFFF',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    {slot.enabled ? 'Bật' : 'Tắt'}
                  </button>

                  <button
                    onClick={() => onStartWorkout(targetWorkout)}
                    className="btn-orange"
                    style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                    title="Tập ngay bài này"
                  >
                    <Play size={10} fill="currentColor" /> Tập
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ergonomic Desk Tip Banner */}
      <div className="card-peach" style={{
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <ShieldCheck size={22} style={{ color: '#F78C25', flexShrink: 0 }} />
        <div style={{ fontSize: '0.78rem', color: '#5C473C', lineHeight: 1.45 }}>
          <strong style={{ color: '#133E35' }}>Mẹo tư thế Mochi:</strong> Mép trên màn hình ngang tầm mắt, khuỷu tay gập góc 90° và bàn chân chạm sàn giúp giảm 40% áp lực cột sống.
        </div>
      </div>
    </div>
  );
};

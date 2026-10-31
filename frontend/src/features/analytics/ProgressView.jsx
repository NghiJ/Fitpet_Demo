import React, { useState } from 'react';
import { 
  Calendar, Award, Heart, CheckCircle2, Flame, Clock, 
  Trophy, Sparkles, Star, Lock, Zap, Target, ShieldCheck
} from 'lucide-react';
import { achievementService } from './services/achievementService';

export const ProgressView = ({ workoutHistory = [] }) => {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'streak' | 'time' | 'unlocked'

  // Calculate achievements & streaks
  const {
    currentStreak,
    bestStreak,
    totalMinutes,
    totalSessions,
    achievements,
    unlockedCount,
    totalCount
  } = achievementService.getUserAchievements(workoutHistory);

  const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const todayIndex = (new Date().getDay() + 6) % 7; // 0 for Mon, 6 for Sun

  // Filter achievements
  const filteredAchievements = achievements.filter(item => {
    if (activeFilter === 'streak') return item.category === 'streak';
    if (activeFilter === 'time') return item.category === 'time';
    if (activeFilter === 'unlocked') return item.unlocked;
    return true;
  });

  const streakAchievementsCount = achievements.filter(a => a.category === 'streak').length;
  const timeAchievementsCount = achievements.filter(a => a.category === 'time').length;

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', width: '100%', paddingBottom: 'var(--space-12)' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '4px' }}>Tiến Trình & Thành Tựu</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', margin: 0 }}>
          Duy trì thói quen vận động nhẹ nhàng và tích lũy các cột mốc danh hiệu cùng FitPet.
        </p>
      </div>

      {/* 4 Quick Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '12px',
        marginBottom: '22px'
      }}>
        {/* Streak Card */}
        <div className="card" style={{ padding: '16px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#F59E0B', marginBottom: '4px' }}>
            <Flame size={18} />
            <span style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase' }}>Chuỗi Ngày</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text-primary)', lineHeight: 1.1 }}>
            {currentStreak} <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>ngày</span>
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Kỷ lục: {bestStreak} ngày
          </div>
        </div>

        {/* Total Time Card */}
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-brand-primary)', marginBottom: '4px' }}>
            <Clock size={18} />
            <span style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase' }}>Thời Lượng</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text-primary)', lineHeight: 1.1 }}>
            {totalMinutes} <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>phút</span>
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Tổng thời gian tích lũy
          </div>
        </div>

        {/* Sessions Card */}
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-accent)', marginBottom: '4px' }}>
            <Award size={18} />
            <span style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase' }}>Buổi Đã Tập</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text-primary)', lineHeight: 1.1 }}>
            {totalSessions} <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>buổi</span>
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Đều đặn mỗi ngày
          </div>
        </div>

        {/* Unlocked Badges Card */}
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8B5CF6', marginBottom: '4px' }}>
            <Trophy size={18} />
            <span style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase' }}>Huy Hiệu</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text-primary)', lineHeight: 1.1 }}>
            {unlockedCount}/{totalCount}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            {Math.round((unlockedCount / totalCount) * 100)}% hoàn thành
          </div>
        </div>
      </div>

      {/* ================= SECTION: BẢNG THÀNH TỰU & HUY HIỆU ================= */}
      <div className="card" style={{ padding: '22px', marginBottom: '22px', border: '1.5px solid var(--color-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Trophy size={20} style={{ color: '#F59E0B' }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Cột Mốc Thành Tựu & Huy Hiệu</h2>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
              Duy trì chuỗi ngày và tích lũy thời gian tập để chinh phục các danh hiệu cao quý.
            </p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveFilter('all')}
              style={{
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: activeFilter === 'all' ? '1.5px solid var(--color-brand-primary)' : '1px solid var(--color-border)',
                backgroundColor: activeFilter === 'all' ? 'var(--color-brand-light)' : 'var(--color-surface)',
                color: activeFilter === 'all' ? 'var(--color-brand-dark)' : 'var(--color-text-secondary)',
                cursor: 'pointer'
              }}
            >
              Tất Cả ({totalCount})
            </button>
            <button
              onClick={() => setActiveFilter('streak')}
              style={{
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: activeFilter === 'streak' ? '1.5px solid #F59E0B' : '1px solid var(--color-border)',
                backgroundColor: activeFilter === 'streak' ? 'rgba(245, 158, 11, 0.12)' : 'var(--color-surface)',
                color: activeFilter === 'streak' ? '#B45309' : 'var(--color-text-secondary)',
                cursor: 'pointer'
              }}
            >
              🔥 Chuỗi Ngày ({streakAchievementsCount})
            </button>
            <button
              onClick={() => setActiveFilter('time')}
              style={{
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: activeFilter === 'time' ? '1.5px solid var(--color-brand-primary)' : '1px solid var(--color-border)',
                backgroundColor: activeFilter === 'time' ? 'var(--color-brand-light)' : 'var(--color-surface)',
                color: activeFilter === 'time' ? 'var(--color-brand-dark)' : 'var(--color-text-secondary)',
                cursor: 'pointer'
              }}
            >
              ⏱️ Thời Lượng ({timeAchievementsCount})
            </button>
            <button
              onClick={() => setActiveFilter('unlocked')}
              style={{
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: activeFilter === 'unlocked' ? '1.5px solid #10B981' : '1px solid var(--color-border)',
                backgroundColor: activeFilter === 'unlocked' ? 'rgba(16, 185, 129, 0.12)' : 'var(--color-surface)',
                color: activeFilter === 'unlocked' ? '#047857' : 'var(--color-text-secondary)',
                cursor: 'pointer'
              }}
            >
              ✨ Đã Đạt ({unlockedCount})
            </button>
          </div>
        </div>

        {/* Grid of Achievement Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '12px'
        }}>
          {filteredAchievements.map((item) => {
            const isUnlocked = item.unlocked;
            return (
              <div
                key={item.id}
                style={{
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-lg)',
                  border: isUnlocked 
                    ? `1.5px solid ${item.color}` 
                    : '1px solid var(--color-border)',
                  backgroundColor: isUnlocked 
                    ? 'var(--color-surface)' 
                    : 'var(--color-surface-subtle)',
                  boxShadow: isUnlocked 
                    ? '0 2px 8px rgba(0, 0, 0, 0.04)' 
                    : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  position: 'relative',
                  opacity: isUnlocked ? 1 : 0.85
                }}
              >
                {/* Header row: Icon, Title & Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isUnlocked ? `${item.color}15` : 'var(--color-surface)',
                      border: isUnlocked ? `1.5px solid ${item.color}` : '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.35rem',
                      flexShrink: 0
                    }}>
                      {item.icon}
                    </div>

                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--color-text-primary)' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                        Mốc: {item.target} {item.unit}
                      </div>
                    </div>
                  </div>

                  <div>
                    {isUnlocked ? (
                      <span className="badge badge-brand" style={{ fontSize: '0.7rem', padding: '3px 8px', gap: '3px' }}>
                        <CheckCircle2 size={12} /> Đã Đạt
                      </span>
                    ) : (
                      <span className="badge" style={{ fontSize: '0.7rem', padding: '3px 8px', gap: '3px', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-muted)' }}>
                        <Lock size={11} /> {item.progressPercent}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.35 }}>
                  {item.description}
                </div>

                {/* Progress Bar */}
                <div style={{ marginTop: '2px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '3px' }}>
                    <span>Tiến độ: {Math.min(item.current, item.target)}/{item.target} {item.unit}</span>
                    <span>{item.progressPercent}%</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--color-border-subtle)',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${item.progressPercent}%`,
                      height: '100%',
                      backgroundColor: isUnlocked ? item.color : 'var(--color-brand-primary)',
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>

                {/* Reward Tag */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: isUnlocked ? item.color : 'var(--color-text-muted)',
                  marginTop: '2px'
                }}>
                  <Sparkles size={12} />
                  <span>Phần thưởng: {item.reward}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Non-Guilt Weekly Movement Rhythm */}
      <div className="card" style={{ marginBottom: '22px', padding: '20px' }}>
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Nhịp Điệu Tuần Này</h2>
        </div>

        {/* Days Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center' }}>
          {daysOfWeek.map((day, idx) => {
            const isToday = idx === todayIndex;
            const hasActivity = idx === todayIndex && totalSessions > 0;
            return (
              <div
                key={day}
                style={{
                  padding: '12px 6px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: hasActivity
                    ? 'var(--color-brand-light)'
                    : isToday
                    ? 'var(--color-surface-subtle)'
                    : 'var(--color-surface)',
                  border: isToday ? '2px solid var(--color-brand-primary)' : '1px solid var(--color-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                  {day}
                </span>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: hasActivity ? 'var(--color-brand-primary)' : 'transparent',
                  color: hasActivity ? '#FFFFFF' : 'var(--color-text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem'
                }}>
                  {hasActivity ? <CheckCircle2 size={16} /> : (isToday ? '•' : '—')}
                </div>
              </div>
            );
          })}
        </div>

        {/* Gentle Rest Principle */}
        <div style={{
          marginTop: '16px',
          padding: '10px 14px',
          backgroundColor: 'var(--color-surface-subtle)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.82rem',
          color: 'var(--color-text-secondary)'
        }}>
          <Heart size={16} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
          <span>Nghỉ ngơi khi mệt cũng là một phần quan trọng để duy trì thói quen dài lâu.</span>
        </div>
      </div>

      {/* Recent Movement Log */}
      <div className="card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>Các Phiên Vận Động Gần Đây</h2>
        {workoutHistory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '28px 0', color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
            Chưa có buổi tập nào. Hãy thử bài tập 3 phút cho bàn làm việc ngay hôm nay nhé!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {workoutHistory.slice(0, 5).map((session, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--color-surface-subtle)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>{session.workoutTitle}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    {session.isFullCompletion ? 'Hoàn thành trọn vẹn' : 'Phiên tập ngắn nhẹ nhàng'} • {Math.round((session.totalSecondsMoved || 0) / 60)} phút
                    {session.usedCamera && ` • Camera AI ghi nhận ${session.cameraRepsCount || 0} nhịp`}
                  </div>
                </div>
                <span className={`badge ${session.isFullCompletion ? 'badge-brand' : 'badge-amber'}`}>
                  {session.isFullCompletion ? 'Hoàn tất' : 'Đã ghi nhận'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

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
    <div style={{ width: '100%', padding: '4px 6px 120px 6px', boxSizing: 'border-box' }}>
      {/* Eyebrow and Page Title */}
      <div style={{ marginBottom: '16px', padding: '0 4px' }}>
        <div style={{
          fontSize: '0.72rem',
          fontWeight: 800,
          color: '#F78C25',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '4px'
        }}>
          THEO DÕI THÓI QUEN
        </div>
        <h1 style={{
          fontSize: '1.45rem',
          fontWeight: 900,
          color: '#133E35',
          margin: '0 0 6px 0',
          lineHeight: 1.2
        }}>
          Tiến Trình & Thành Tựu 🌱
        </h1>
        <p style={{
          fontSize: '0.86rem',
          color: '#4A6B63',
          margin: 0,
          lineHeight: 1.45
        }}>
          Duy trì thói quen vận động nhẹ nhàng và tích lũy các cột mốc danh hiệu cùng Mochi.
        </p>
      </div>

      {/* 3 Peach Stat Cards (Identical style to HomePage) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        marginBottom: '16px'
      }}>
        <div className="card-peach" style={{ padding: '14px 10px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#133E35', lineHeight: 1 }}>
            {currentStreak || 5} <span style={{ fontSize: '0.74rem', fontWeight: 700 }}>ngày</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#6A564C', fontWeight: 700, marginTop: '4px' }}>
            🔥 Chuỗi liên tục
          </div>
        </div>

        <div className="card-peach" style={{ padding: '14px 10px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#133E35', lineHeight: 1 }}>
            {totalMinutes || 3} <span style={{ fontSize: '0.74rem', fontWeight: 700 }}>phút</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#6A564C', fontWeight: 700, marginTop: '4px' }}>
            ⏱️ Tích lũy
          </div>
        </div>

        <div className="card-peach" style={{ padding: '14px 10px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#133E35', lineHeight: 1 }}>
            {unlockedCount || 2}/{totalCount || 8}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#6A564C', fontWeight: 700, marginTop: '4px' }}>
            🏆 Huy hiệu
          </div>
        </div>
      </div>

      {/* Weekly Movement Rhythm Card */}
      <div className="card-peach" style={{ padding: '18px 16px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 900, color: '#133E35', margin: 0 }}>
              7 Ngày Vừa Qua 📅
            </h3>
            <p style={{ fontSize: '0.76rem', color: '#6A564C', margin: '2px 0 0 0' }}>
              Mỗi ngày một chút nhẹ nhàng cùng Mochi
            </p>
          </div>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            backgroundColor: '#FFFFFF',
            color: '#133E35',
            padding: '4px 10px',
            borderRadius: '9999px'
          }}>
            Hôm nay: T4 ✓
          </span>
        </div>

        {/* Days Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center' }}>
          {daysOfWeek.map((day, idx) => {
            const isToday = idx === todayIndex;
            const hasActivity = idx <= todayIndex; // Mon, Tue, Wed active
            return (
              <div
                key={day}
                style={{
                  padding: '10px 4px',
                  borderRadius: '14px',
                  backgroundColor: isToday ? '#133E35' : (hasActivity ? 'rgba(255, 255, 255, 0.7)' : '#FFFFFF'),
                  color: isToday ? '#FFFFFF' : '#133E35',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: isToday ? '0 3px 8px rgba(19, 62, 53, 0.2)' : 'none'
                }}
              >
                <span style={{ fontSize: '0.74rem', fontWeight: 800, opacity: isToday ? 1 : 0.7 }}>
                  {day}
                </span>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: isToday ? '#F78C25' : (hasActivity ? '#72D5C3' : 'rgba(0,0,0,0.06)'),
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.72rem',
                  fontWeight: 900
                }}>
                  {hasActivity ? '✓' : '—'}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{
          marginTop: '14px',
          padding: '10px 12px',
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.78rem',
          color: '#5C473C'
        }}>
          <Heart size={15} style={{ color: '#F78C25', flexShrink: 0 }} />
          <span>Nghỉ ngơi khi mệt cũng là một phần quan trọng để duy trì thói quen dài lâu.</span>
        </div>
      </div>

      {/* ================= SECTION: BẢNG THÀNH TỰU & HUY HIỆU ================= */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        padding: '18px 16px',
        marginBottom: '16px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Trophy size={18} style={{ color: '#F78C25' }} />
              <h2 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#133E35', margin: 0 }}>Huy Hiệu & Danh Hiệu</h2>
            </div>
            <p style={{ fontSize: '0.76rem', color: '#7E9F97', margin: '2px 0 0 0' }}>
              Chinh phục các cột mốc danh dự
            </p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: `Tất cả (${totalCount})` },
              { id: 'streak', label: `🔥 Chuỗi (${streakAchievementsCount})` },
              { id: 'unlocked', label: `✨ Đã đạt (${unlockedCount})` }
            ].map(f => {
              const isActive = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '9999px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    border: 'none',
                    backgroundColor: isActive ? '#133E35' : '#F1F5F9',
                    color: isActive ? '#FFFFFF' : '#4A6B63',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid of Achievement Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredAchievements.map((item) => {
            const isUnlocked = item.unlocked;
            return (
              <div
                key={item.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: '16px',
                  backgroundColor: isUnlocked ? '#FEDFD2' : '#F8FAFC',
                  border: isUnlocked ? '1px solid rgba(247, 140, 37, 0.25)' : '1px dashed #E2E8F0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  position: 'relative',
                  opacity: isUnlocked ? 1 : 0.8
                }}
              >
                {/* Header row: Icon, Title & Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      flexShrink: 0,
                      boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                    }}>
                      {item.icon}
                    </div>

                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#133E35' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#7E9F97' }}>
                        Mốc: {item.target} {item.unit}
                      </div>
                    </div>
                  </div>

                  <div>
                    {isUnlocked ? (
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        backgroundColor: '#133E35',
                        color: '#FFFFFF',
                        padding: '3px 8px',
                        borderRadius: '9999px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}>
                        <CheckCircle2 size={11} /> Đã Đạt
                      </span>
                    ) : (
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        backgroundColor: '#E2E8F0',
                        color: '#64748B',
                        padding: '3px 8px',
                        borderRadius: '9999px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}>
                        <Lock size={10} /> {item.progressPercent}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div style={{ fontSize: '0.78rem', color: '#5C473C', lineHeight: 1.35 }}>
                  {item.description}
                </div>

                {/* Progress Bar */}
                <div>
                  <div style={{
                    width: '100%',
                    height: '5px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(0,0,0,0.06)',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${item.progressPercent}%`,
                      height: '100%',
                      backgroundColor: isUnlocked ? '#F78C25' : '#72D5C3',
                      borderRadius: '9999px',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>

                {/* Reward Tag */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: isUnlocked ? '#F78C25' : '#7E9F97'
                }}>
                  <Sparkles size={11} />
                  <span>Phần thưởng: {item.reward}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Movement Log */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        padding: '18px 16px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
      }}>
        <h2 style={{ fontSize: '0.98rem', fontWeight: 900, color: '#133E35', margin: '0 0 12px 0' }}>
          Các Phiên Gần Đây
        </h2>
        {workoutHistory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: '#7E9F97', fontSize: '0.84rem' }}>
            Chưa có bài tập nào. Hãy bắt đầu bài 3 phút ngay nhé!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {workoutHistory.slice(0, 4).map((session, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '16px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0'
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#133E35' }}>
                    {session.workoutTitle}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#7E9F97', marginTop: '2px' }}>
                    {session.isFullCompletion ? 'Hoàn thành trọn vẹn' : 'Phiên tập ngắn'} • {Math.round((session.totalSecondsMoved || 0) / 60)} phút
                  </div>
                </div>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  backgroundColor: '#72D5C3',
                  color: '#133E35',
                  padding: '3px 8px',
                  borderRadius: '9999px'
                }}>
                  Hoàn tất ✓
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

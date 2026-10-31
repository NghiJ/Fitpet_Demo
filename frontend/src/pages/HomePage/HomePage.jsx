import React, { useState, useEffect } from 'react';
import { Play, Eye, Clock, ShieldCheck, Zap, Sparkles, Heart, Flame } from 'lucide-react';
import { CURATED_WORKOUTS } from '../../features/workout/data/curatedWorkouts';
import { VirtualPet } from '../../features/pet/components/VirtualPet';
import { soundService } from '../../features/workout/services/soundService';
import { PainAreaSelector } from '../../features/workout/components/PainAreaSelector';
import { petService } from '../../features/pet/services/petService';
import { achievementService } from '../../features/analytics/services/achievementService';

export const HomePage = ({
  onStartWorkout,
  onPreviewWorkout,
  workoutHistory = []
}) => {
  const [petData, setPetData] = useState(() => petService.getPetData());
  const { currentStreak } = achievementService.calculateStreaks(workoutHistory);

  useEffect(() => {
    const unsub = petService.subscribe(setPetData);
    return () => unsub();
  }, []);
  // Primary recommended workout is always the 3-minute Desk De-Stiffener
  const recommendedWorkout = CURATED_WORKOUTS.find(w => w.isRecommended) || CURATED_WORKOUTS[0];
  const alternativeWorkouts = CURATED_WORKOUTS.filter(w => w.id !== recommendedWorkout.id);

  const completedToday = workoutHistory.some(s => {
    const sessionDate = new Date(s.startTime).toDateString();
    return sessionDate === new Date().toDateString();
  });

  const handleStart = (w) => {
    soundService.playTone(523.25, 'sine', 0.2); // Start chime
    onStartWorkout(w);
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', width: '100%', paddingBottom: 'var(--space-12)' }}>
      {/* Friendly Welcome & Pet Companion Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0 10px 0', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-brand-primary)' }}>
              <Sparkles size={14} /> Chào bạn! Cùng vận động nhé
            </span>
            {currentStreak > 0 && (
              <span className="badge badge-amber" style={{ fontSize: '0.74rem', padding: '2px 8px', gap: '3px' }}>
                <Flame size={13} style={{ color: '#F59E0B' }} /> Chuỗi {currentStreak} ngày
              </span>
            )}
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '4px' }}>
            Nghỉ giải lao một chút nào!
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem' }}>
            Vận động nhẹ 2-5 phút ngay tại bàn làm việc.
          </p>
        </div>

        {/* Friendly Pet Companion */}
        <div style={{ flexShrink: 0 }}>
          <VirtualPet
            state={completedToday ? 'cheering' : 'idle'}
            size="sm"
            message={completedToday ? "Hôm nay bạn đã vận động rồi!" : `${petData.customName} sẵn sàng!`}
            showSpeechBubble={false}
          />
        </div>
      </div>

      {/* PROMINENT RECOMMENDED WORKOUT HERO CARD */}
      <div className="hero-workout-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <span className="badge badge-brand">
            <Zap size={14} style={{ marginRight: '3px' }} />
            Bài tập gợi ý
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: 800, color: 'var(--color-brand-primary)' }}>
            <Clock size={15} />
            <span>{recommendedWorkout.durationMinutes} Phút</span>
          </div>
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '4px' }}>
          {recommendedWorkout.title}
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '18px' }}>
          {recommendedWorkout.description || recommendedWorkout.tagline}
        </p>

        {/* Quick Exercise Chips preview */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
          {recommendedWorkout.exercises.map((ex, i) => (
            <span
              key={ex.id}
              style={{
                fontSize: '0.78rem',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-full)',
                padding: '4px 10px',
                color: 'var(--color-text-secondary)',
                fontWeight: 600,
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {i + 1}. {ex.name}
            </span>
          ))}
        </div>

        {/* Prominent Primary CTA & Preview Action */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn-primary"
            onClick={() => handleStart(recommendedWorkout)}
            style={{ flex: '1 1 200px', fontSize: '1rem', justifyContent: 'center', padding: '10px 18px' }}
            id="start-workout-btn"
          >
            <Play size={18} fill="currentColor" />
            Tập ngay ({recommendedWorkout.durationMinutes} phút)
          </button>

          <button
            className="btn-secondary"
            onClick={() => onPreviewWorkout(recommendedWorkout)}
            style={{ fontSize: '0.9rem', padding: '10px 16px' }}
          >
            <Eye size={16} />
            Xem trước
          </button>
        </div>
      </div>

      {/* INTERACTIVE PAIN AREA & TARGET RELIEF SELECTOR */}
      <PainAreaSelector
        onStartWorkout={handleStart}
        onPreviewWorkout={onPreviewWorkout}
      />

      {/* ALTERNATIVE SESSIONS */}
      <div style={{ marginTop: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Hoặc Chọn Bài Tập Khác</h3>
          <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Không cần dụng cụ</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {alternativeWorkouts.map((workout) => (
            <div
              key={workout.id}
              className="card"
              style={{
                padding: '18px 22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className="badge badge-amber" style={{ fontSize: '0.72rem', padding: '3px 9px' }}>
                    {workout.category}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                    <Clock size={14} /> {workout.durationMinutes} phút
                  </span>
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '2px' }}>{workout.title}</h4>
                <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                  {workout.tagline}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button
                  className="btn-ghost"
                  onClick={() => onPreviewWorkout(workout)}
                  style={{ fontSize: '0.88rem' }}
                >
                  Xem trước
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => handleStart(workout)}
                  style={{ padding: '9px 16px', fontSize: '0.9rem', color: 'var(--color-brand-primary)' }}
                >
                  <Play size={15} fill="currentColor" />
                  Tập
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zero Guilt Guarantee */}
      <div style={{
        marginTop: '28px',
        padding: '12px 18px',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: 'var(--color-surface-subtle)',
        border: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '0.82rem',
        color: 'var(--color-text-secondary)'
      }}>
        <ShieldCheck size={18} style={{ color: 'var(--color-brand-primary)', flexShrink: 0 }} />
        <span>
          <strong>Tập luyện thoải mái:</strong> Chỉ 2-3 phút vận động nhẹ cũng đủ giúp cơ thể giải phóng căng thẳng!
        </span>
      </div>
    </div>
  );
};

import React from 'react';
import { CheckCircle2, Clock, Activity, ArrowRight, RotateCcw, Heart, Shield } from 'lucide-react';
import { VirtualPet } from '../../pet/components/VirtualPet';

export const WorkoutSummary = ({
  sessionData,
  onDone,
  onStartAnother
}) => {
  const isFull = sessionData?.isFullCompletion;
  const minutesMoved = Math.max(1, Math.round((sessionData?.totalSecondsMoved || 0) / 60));
  const completedCount = sessionData?.completedExercises?.length || 0;
  const skippedCount = sessionData?.skippedExercises?.length || 0;
  const modifiedCount = sessionData?.modifiedExercises?.length || 0;

  return (
    <div style={{ maxWidth: '580px', margin: '0 auto', width: '100%', padding: 'var(--space-4) 0 var(--space-12) 0' }}>
      <div className="card" style={{ textAlign: 'center', padding: '36px 24px', position: 'relative' }}>
        {/* Supportive Pet Reaction */}
        <div style={{ marginBottom: '16px' }}>
          <VirtualPet
            state="cheering"
            size="lg"
            message={isFull ? "Wonderful movement session! High-five!" : "Great job taking time to move today!"}
            showSpeechBubble={true}
          />
        </div>

        {/* Completion Title & Honest Status */}
        <div style={{ marginBottom: '16px' }}>
          <span className={`badge ${isFull ? 'badge-brand' : 'badge-amber'}`} style={{ marginBottom: '8px' }}>
            {isFull ? 'Session Complete' : 'Movement Logged (Partial Session)'}
          </span>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
            {isFull ? 'Great Movement Session!' : 'Honoring Your Movement'}
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', marginTop: '6px' }}>
            {isFull
              ? 'You showed up for your body today. Consistency builds habit one small session at a time.'
              : 'You listened to your body and did what felt right. Stopping or adjusting when needed is smart exercise.'}
          </p>
        </div>

        {/* Honest Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: sessionData?.usedCamera ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)',
          gap: '10px',
          margin: '24px 0',
          padding: '16px',
          backgroundColor: 'var(--color-surface-subtle)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--color-brand-primary)', marginBottom: '4px' }}>
              <Clock size={16} />
              <span style={{ fontSize: '1.3rem', fontWeight: 800 }}>{minutesMoved}</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              Phút vận động
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--color-brand-primary)', marginBottom: '4px' }}>
              <CheckCircle2 size={16} />
              <span style={{ fontSize: '1.3rem', fontWeight: 800 }}>{completedCount}</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              Động tác xong
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--color-neutral)', marginBottom: '4px' }}>
              <Activity size={16} />
              <span style={{ fontSize: '1.3rem', fontWeight: 800 }}>{modifiedCount + skippedCount}</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              Đổi / Bỏ qua
            </div>
          </div>

          {sessionData?.usedCamera && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#10B981', marginBottom: '4px' }}>
                <CheckCircle2 size={16} />
                <span style={{ fontSize: '1.3rem', fontWeight: 800 }}>{sessionData.cameraRepsCount || 0}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                Nhịp AI nhận diện
              </div>
            </div>
          )}
        </div>

        {/* Honest Fitness Principle Reminder */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textAlign: 'left',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
          marginBottom: '24px',
          fontSize: '0.82rem',
          color: 'var(--color-text-secondary)'
        }}>
          <Shield size={20} style={{ color: 'var(--color-brand-primary)', flexShrink: 0 }} />
          <span>
            <strong>Honest Coaching Note:</strong> Timers track your active interval, not flawless execution. What matters is building body awareness, safe motion, and feeling refreshed!
          </span>
        </div>

        {/* Primary Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            className="btn-primary"
            onClick={onDone}
            style={{ width: '100%', fontSize: '1.05rem', justifyContent: 'center' }}
          >
            Finish & Return Home
            <ArrowRight size={18} />
          </button>

          {onStartAnother && (
            <button
              className="btn-secondary"
              onClick={onStartAnother}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <RotateCcw size={16} />
              Voluntarily Do Another Quick 2-Min Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

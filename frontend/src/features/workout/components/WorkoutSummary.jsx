import React from 'react';
import { CheckCircle2, Clock, Sparkles, ArrowRight, RotateCcw, Heart, Flame } from 'lucide-react';
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
    <div style={{ maxWidth: '520px', margin: '0 auto', width: '100%', padding: 'var(--space-4) 0 var(--space-12) 0' }}>
      <div className="card" style={{ textAlign: 'center', padding: '32px 24px', position: 'relative' }}>
        {/* Supportive Pet Mascot */}
        <div style={{ marginBottom: '16px' }}>
          <VirtualPet
            state="cheering"
            size="lg"
            message={isFull ? "Tuyệt vời! Bạn làm tốt lắm!" : "Lắng nghe cơ thể thật tốt!"}
            showSpeechBubble={true}
          />
        </div>

        {/* Completion Title */}
        <div style={{ marginBottom: '20px' }}>
          <span className={`badge ${isFull ? 'badge-brand' : 'badge-amber'}`} style={{ marginBottom: '8px' }}>
            {isFull ? 'Hoàn thành bài tập' : 'Đã ghi nhận vận động'}
          </span>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '4px 0' }}>
            {isFull ? 'Buổi tập hoàn tất! 🎉' : 'Đã nạp lại năng lượng! ✨'}
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', margin: '4px 0 0 0' }}>
            {isFull
              ? 'Cơ thể bạn vừa được giải tỏa căng thẳng sau giờ làm việc.'
              : 'Tập đúng sức và lắng nghe cơ thể luôn là cách tập luyện thông minh nhất.'}
          </p>
        </div>

        {/* Clean Metrics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: sessionData?.usedCamera ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)',
          gap: '10px',
          marginBottom: '24px',
          padding: '16px 12px',
          backgroundColor: 'var(--color-surface-subtle)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--color-brand-primary)', marginBottom: '2px' }}>
              <Clock size={16} />
              <span style={{ fontSize: '1.35rem', fontWeight: 900 }}>{minutesMoved}</span>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>
              Phút tập
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--color-brand-primary)', marginBottom: '2px' }}>
              <CheckCircle2 size={16} />
              <span style={{ fontSize: '1.35rem', fontWeight: 900 }}>{completedCount}</span>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>
              Động tác
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--color-accent)', marginBottom: '2px' }}>
              <Flame size={16} />
              <span style={{ fontSize: '1.35rem', fontWeight: 900 }}>{minutesMoved * 4}</span>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>
              Kcal nhẹ
            </div>
          </div>

          {sessionData?.usedCamera && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#10B981', marginBottom: '2px' }}>
                <Sparkles size={16} />
                <span style={{ fontSize: '1.35rem', fontWeight: 900 }}>{sessionData.cameraRepsCount || 0}</span>
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                Nhịp AI
              </div>
            </div>
          )}
        </div>

        {/* Streak & Milestone Encouragement */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '10px 16px',
          backgroundColor: 'rgba(245, 158, 11, 0.08)',
          border: '1px dashed #F59E0B',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '20px',
          color: '#B45309',
          fontSize: '0.84rem',
          fontWeight: 700
        }}>
          <Flame size={16} style={{ color: '#F59E0B', flexShrink: 0 }} />
          <span>+{minutesMoved} phút tích lũy vào Cột Mốc Thành Tựu & Chuỗi ngày vận động!</span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            className="btn-primary"
            onClick={onDone}
            style={{ width: '100%', fontSize: '1.02rem', justifyContent: 'center', padding: '12px' }}
          >
            Về Trang Chủ
            <ArrowRight size={18} />
          </button>

          {onStartAnother && (
            <button
              className="btn-secondary"
              onClick={onStartAnother}
              style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '0.9rem' }}
            >
              <RotateCcw size={16} />
              Tập Thêm Bài 2 Phút
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default WorkoutSummary;

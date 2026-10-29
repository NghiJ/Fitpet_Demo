import React, { useState } from 'react';
import { Play, X, Clock, ShieldCheck, RefreshCw } from 'lucide-react';
import { ExerciseIllustration } from './ExerciseIllustration';
import { soundService } from '../services/soundService';

export const WorkoutPreviewModal = ({
  workout,
  onStart,
  onClose,
  onSelectAlternative
}) => {
  const [selectedExIndex, setSelectedExIndex] = useState(0);

  if (!workout) return null;

  const currentExercise = workout.exercises[selectedExIndex] || workout.exercises[0];

  const handleStart = () => {
    soundService.playTone(523.25, 'sine', 0.2);
    onStart(workout);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="preview-modal-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-brand">{workout.category}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.84rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                <Clock size={15} /> ~{workout.durationMinutes} phút
              </span>
              <span style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>• {workout.difficulty}</span>
            </div>
            <h2 id="preview-modal-title" style={{ fontSize: '1.5rem', fontWeight: 800 }}>{workout.title}</h2>
          </div>
          <button
            className="icon-btn"
            onClick={onClose}
            aria-label="Đóng bảng xem trước"
          >
            <X size={20} />
          </button>
        </div>

        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.94rem', marginBottom: '20px', lineHeight: 1.55 }}>
          {workout.description}
        </p>

        {/* Selected Exercise Spotlight Preview */}
        <div style={{ backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-xl)', padding: '18px', marginBottom: '22px', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-brand-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Động tác {selectedExIndex + 1} / {workout.exercises.length}
            </span>
            <span style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>
              {currentExercise.durationSec} giây
            </span>
          </div>

          <ExerciseIllustration type={currentExercise.illustrationType} name={currentExercise.name} />

          <div style={{ marginTop: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>{currentExercise.name}</h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '10px' }}>
              {currentExercise.instruction}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--color-brand-primary)', fontWeight: 600 }}>
              <ShieldCheck size={16} /> Nhẹ nhàng / Không cần dụng cụ
            </div>
          </div>
        </div>

        {/* Exercise Sequence List */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px', fontWeight: 700 }}>
            Danh sách động tác trong bài
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {workout.exercises.map((ex, idx) => (
              <button
                key={ex.id}
                onClick={() => setSelectedExIndex(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: selectedExIndex === idx ? 'var(--color-brand-light)' : 'var(--color-surface)',
                  border: `1.5px solid ${selectedExIndex === idx ? 'var(--color-brand-primary)' : 'var(--color-border)'}`,
                  textAlign: 'left',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: selectedExIndex === idx ? 'var(--color-brand-primary)' : 'var(--color-surface-subtle)',
                    color: selectedExIndex === idx ? '#FFF' : 'var(--color-text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.78rem',
                    fontWeight: 800
                  }}>
                    {idx + 1}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-text-primary)' }}>
                    {ex.name}
                  </span>
                </div>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  {ex.durationSec}s
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            className="btn-primary"
            onClick={handleStart}
            style={{ width: '100%', fontSize: '1.08rem', justifyContent: 'center' }}
          >
            <Play size={20} fill="currentColor" />
            Bắt đầu bài tập này ngay
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
            <button
              className="btn-ghost"
              onClick={onClose}
            >
              Quay lại
            </button>
            {onSelectAlternative && (
              <button
                className="btn-ghost"
                onClick={onSelectAlternative}
                style={{ color: 'var(--color-brand-primary)', fontWeight: 700 }}
              >
                <RefreshCw size={14} style={{ marginRight: '4px' }} />
                Đổi bài tập khác nhẹ hơn
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

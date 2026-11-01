import React, { useState, useMemo } from 'react';
import { Search, Sparkles, Play, Eye, Clock, ShieldAlert } from 'lucide-react';
import { PAIN_AREAS, CURATED_WORKOUTS, findWorkoutsByPainQuery } from '../data/curatedWorkouts';
import { soundService } from '../services/soundService';

export const PainAreaSelector = ({
  onStartWorkout,
  onPreviewWorkout
}) => {
  const [selectedAreaId, setSelectedAreaId] = useState('neck-shoulder');
  const [searchQuery, setSearchQuery] = useState('');

  // Determine active workout based on selection or search query
  const searchResult = useMemo(() => {
    if (searchQuery.trim().length > 1) {
      return findWorkoutsByPainQuery(searchQuery);
    }
    const area = PAIN_AREAS.find(a => a.id === selectedAreaId) || PAIN_AREAS[0];
    const workout = CURATED_WORKOUTS.find(w => w.id === area.recommendedWorkoutId) || CURATED_WORKOUTS[0];
    return { area, workout };
  }, [selectedAreaId, searchQuery]);

  const activeArea = searchResult?.area;
  const activeWorkout = searchResult?.workout;

  const handleSelectArea = (areaId) => {
    setSelectedAreaId(areaId);
    setSearchQuery('');
    soundService.playTone(440, 'sine', 0.1);
  };

  const handleStart = () => {
    soundService.playTone(523.25, 'sine', 0.2);
    if (activeWorkout) {
      onStartWorkout(activeWorkout);
    }
  };

  return (
    <div className="card" style={{ padding: '22px', marginBottom: '24px', border: '1.5px solid rgba(16, 185, 129, 0.3)' }}>
      {/* Header */}
      <div style={{ marginBottom: '14px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '4px' }}>
          Bạn đang mỏi ở đâu?
        </h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem', margin: 0 }}>
          Chọn vùng mỏi hoặc tìm kiếm để nhận bài tập giải tỏa phù hợp:
        </p>
      </div>

      {/* Quick Interactive Pain Area Chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
        {PAIN_AREAS.map((area) => {
          const isSelected = selectedAreaId === area.id && !searchQuery;
          return (
            <button
              key={area.id}
              onClick={() => handleSelectArea(area.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: isSelected ? 'var(--color-brand-light)' : 'var(--color-surface)',
                border: `1.5px solid ${isSelected ? 'var(--color-brand-primary)' : 'var(--color-border)'}`,
                color: isSelected ? 'var(--color-brand-hover)' : 'var(--color-text-primary)',
                fontWeight: 700,
                fontSize: '0.86rem',
                boxShadow: isSelected ? '0 2px 8px rgba(16, 185, 129, 0.2)' : 'none',
                transition: 'all var(--transition-fast)'
              }}
            >
              <span>{area.icon}</span>
              <span>{area.name}</span>
            </button>
          );
        })}
      </div>

      {/* Search Input Box */}
      <div style={{ position: 'relative', marginBottom: '18px' }}>
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-text-muted)'
          }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm vùng mỏi (cổ tay, thắt lưng, chuột rút...)"
          style={{
            width: '100%',
            padding: '10px 14px 10px 36px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface-subtle)',
            color: 'var(--color-text-primary)',
            fontSize: '16px'
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '0.78rem',
              color: 'var(--color-text-muted)',
              padding: '2px 6px',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            Xóa
          </button>
        )}
      </div>

      {/* Tailored Workout Recommendation Card */}
      {activeWorkout && (
        <div style={{
          padding: '16px 14px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--color-surface)',
          border: '1.5px solid var(--color-brand-primary)',
          boxShadow: 'var(--shadow-sm)',
          boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
            <span className="badge badge-brand">{activeArea?.badgeText || 'Gợi ý giải tỏa'}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              <Clock size={14} />
              <span>{activeWorkout.durationMinutes} phút</span>
              <span>• {activeWorkout.difficulty}</span>
            </div>
          </div>

          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '4px', color: 'var(--color-text-primary)' }}>
            {activeWorkout.title}
          </h4>
          <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', lineHeight: 1.45, marginBottom: '12px' }}>
            {activeArea?.description || activeWorkout.tagline}
          </p>

          {/* Targeted Moves list */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
            {activeWorkout.exercises.map((ex, i) => (
              <span
                key={ex.id}
                style={{
                  fontSize: '0.75rem',
                  backgroundColor: 'var(--color-surface-subtle)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-full)',
                  padding: '3px 9px',
                  color: 'var(--color-text-secondary)',
                  fontWeight: 600
                }}
              >
                {i + 1}. {ex.name}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn-primary"
              onClick={handleStart}
              style={{ flex: '2 1 160px', fontSize: '0.92rem', minHeight: '38px', padding: '8px 14px', justifyContent: 'center' }}
            >
              <Play size={15} fill="currentColor" />
              Tập ngay ({activeWorkout.durationMinutes} phút)
            </button>

            <button
              className="btn-secondary"
              onClick={() => onPreviewWorkout(activeWorkout)}
              style={{ flex: '1 1 80px', fontSize: '0.86rem', minHeight: '38px', padding: '8px 12px', justifyContent: 'center' }}
            >
              <Eye size={14} />
              Chi tiết
            </button>
          </div>
        </div>
      )}

      {/* Subtle Safety Disclaimer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
        <ShieldAlert size={14} style={{ color: 'var(--color-brand-primary)', flexShrink: 0 }} />
        <span>Bài tập hỗ trợ thư giãn cơ học sau giờ làm việc, không thay thế chẩn đoán y khoa.</span>
      </div>
    </div>
  );
};

export default PainAreaSelector;

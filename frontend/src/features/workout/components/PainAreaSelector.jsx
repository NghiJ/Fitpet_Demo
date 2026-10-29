import React, { useState, useMemo } from 'react';
import { Search, Sparkles, Play, Eye, Clock, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
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
    <div className="card" style={{ padding: '24px', marginBottom: '28px', border: '2px solid rgba(16, 185, 129, 0.3)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-brand-primary)' }}>
          <Sparkles size={16} /> Chọn Vùng Căng Mỏi Để Nhận Bài Tập Phù Hợp
        </div>
      </div>
      <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '6px' }}>
        Bạn đang cảm thấy mỏi ở đâu?
      </h3>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '18px' }}>
        Chọn vùng cơ thể hoặc gõ trực tiếp triệu chứng để nhận bài tập giải tỏa chuyên sâu.
      </p>

      {/* Quick Interactive Pain Area Chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        {PAIN_AREAS.map((area) => {
          const isSelected = selectedAreaId === area.id && !searchQuery;
          return (
            <button
              key={area.id}
              onClick={() => handleSelectArea(area.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: isSelected ? 'var(--color-brand-light)' : 'var(--color-surface)',
                border: `1.5px solid ${isSelected ? 'var(--color-brand-primary)' : 'var(--color-border)'}`,
                color: isSelected ? 'var(--color-brand-hover)' : 'var(--color-text-primary)',
                fontWeight: 700,
                fontSize: '0.9rem',
                boxShadow: isSelected ? '0 4px 12px rgba(16, 185, 129, 0.25)' : 'var(--shadow-sm)',
                transition: 'all var(--transition-fast)',
                transform: isSelected ? 'scale(1.02)' : 'none'
              }}
            >
              <span>{area.icon}</span>
              <span>{area.name}</span>
            </button>
          );
        })}
      </div>

      {/* Search Input Box */}
      <div style={{ position: 'relative', marginBottom: '22px' }}>
        <Search
          size={18}
          style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-text-muted)'
          }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Hoặc gõ vùng đau/mỏi (ví dụ: mỏi cổ tay, đau thắt lưng, chuột rút, tê chân...)"
          style={{
            width: '100%',
            padding: '12px 16px 12px 42px',
            borderRadius: 'var(--radius-lg)',
            border: '1.5px solid var(--color-border)',
            backgroundColor: 'var(--color-surface-subtle)',
            color: 'var(--color-text-primary)',
            fontSize: '0.92rem',
            fontWeight: 500
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '0.8rem',
              color: 'var(--color-text-muted)',
              padding: '2px 8px',
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
          padding: '20px',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'var(--color-surface)',
          border: '1.5px solid var(--color-brand-primary)',
          boxShadow: 'var(--shadow-md), 0 0 20px rgba(16, 185, 129, 0.08)',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-brand">{activeArea?.badgeText || 'Bài tập khuyên dùng'}</span>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <Clock size={14} /> {activeWorkout.durationMinutes} phút
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>• {activeWorkout.difficulty}</span>
            </div>
          </div>

          <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '4px', color: 'var(--color-text-primary)' }}>
            {activeWorkout.title}
          </h4>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
            {activeArea?.description || activeWorkout.description}
          </p>

          {/* Targeted Moves in this session */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
            {activeWorkout.exercises.map((ex, i) => (
              <span
                key={ex.id}
                style={{
                  fontSize: '0.78rem',
                  backgroundColor: 'var(--color-surface-subtle)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-full)',
                  padding: '3px 10px',
                  color: 'var(--color-text-secondary)',
                  fontWeight: 600
                }}
              >
                {i + 1}. {ex.name}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn-primary"
              onClick={handleStart}
              style={{ flex: '1 1 200px', fontSize: '1rem', minHeight: '44px', padding: '10px 20px' }}
            >
              <Play size={18} fill="currentColor" />
              Tập bài này ngay ({activeWorkout.durationMinutes} phút)
            </button>

            <button
              className="btn-secondary"
              onClick={() => onPreviewWorkout(activeWorkout)}
              style={{ fontSize: '0.9rem', minHeight: '44px', padding: '10px 16px' }}
            >
              <Eye size={16} />
              Xem chi tiết
            </button>
          </div>
        </div>
      )}

      {/* Friendly Safety Disclaimer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
        <ShieldAlert size={15} style={{ color: 'var(--color-brand-primary)', flexShrink: 0 }} />
        <span>Lưu ý: Các bài tập chỉ hỗ trợ giải tỏa căng mỏi cơ học sau giờ làm việc, không thay thế chẩn đoán y khoa.</span>
      </div>
    </div>
  );
};

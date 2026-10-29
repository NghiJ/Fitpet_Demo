import React, { useState, useMemo } from 'react';
import { Search, Filter, Clock, Play, Eye, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';
import { CURATED_WORKOUTS } from '../data/curatedWorkouts';
import { soundService } from '../services/soundService';

export const WorkoutLibraryPage = ({ onStartWorkout, onPreviewWorkout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'Tất cả' },
    { id: 'Cổ & Vai Gáy', label: 'Cổ & Vai Gáy' },
    { id: 'Thắt Lưng & Cột Sống', label: 'Thắt Lưng' },
    { id: 'Cổ Tay & Ngón Tay', label: 'Cổ Tay' },
    { id: 'Hông & Đôi Chân', label: 'Hông & Chân' },
    { id: 'Toàn Thân', label: 'Toàn Thân' },
    { id: 'Nạp năng lượng nhanh', label: '2 Phút Cấp Tốc' }
  ];

  const filteredWorkouts = useMemo(() => {
    return CURATED_WORKOUTS.filter(w => {
      const matchCat = selectedCategory === 'all' || w.category === selectedCategory;
      const matchQuery = !searchQuery.trim() || 
        w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.exercises.some(ex => ex.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  const handleStart = (w) => {
    soundService.playTone(523.25, 'sine', 0.2);
    onStartWorkout(w);
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', width: '100%', paddingBottom: 'var(--space-12)' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-brand-primary)', marginBottom: '4px' }}>
          <Sparkles size={16} /> Thư Viện Bài Tập Không Cần Dụng Cụ
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '6px' }}>
          Khám Phá Bài Tập
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.94rem' }}>
          Tất cả bài tập đều được thiết kế ngắn gọn 2-6 phút, phù hợp để tập ngay tại bàn làm việc hoặc không gian hẹp.
        </p>
      </div>

      {/* Search Input Bar */}
      <div style={{ position: 'relative', marginBottom: '18px' }}>
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
          placeholder="Tìm bài tập theo tên, vùng cơ, hoặc triệu chứng mỏi..."
          style={{
            width: '100%',
            padding: '12px 16px 12px 42px',
            borderRadius: 'var(--radius-lg)',
            border: '1.5px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text-primary)',
            fontSize: '0.92rem',
            boxShadow: 'var(--shadow-sm)'
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

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '24px', scrollbarWidth: 'none' }}>
        {categories.map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                soundService.playTone(440, 'sine', 0.08);
              }}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: isSelected ? 'var(--color-brand-primary)' : 'var(--color-surface)',
                color: isSelected ? '#FFFFFF' : 'var(--color-text-secondary)',
                border: `1px solid ${isSelected ? 'var(--color-brand-primary)' : 'var(--color-border)'}`,
                fontWeight: 700,
                fontSize: '0.85rem',
                whiteSpace: 'nowrap',
                boxShadow: isSelected ? 'var(--shadow-brand)' : 'var(--shadow-sm)',
                transition: 'all var(--transition-fast)'
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Workouts Grid */}
      {filteredWorkouts.length === 0 ? (
        /* Empty State */
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔍</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>Không tìm thấy bài tập phù hợp</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
            Không có kết quả nào cho "{searchQuery}". Hãy thử tìm kiếm từ khóa khác như "vai", "lưng", "cổ tay"...
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="btn-secondary"
          >
            <RefreshCw size={15} style={{ marginRight: '6px' }} />
            Xem tất cả bài tập
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredWorkouts.map((workout) => (
            <div
              key={workout.id}
              className="card"
              style={{
                padding: '22px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span className="badge badge-brand">{workout.category}</span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                      <Clock size={14} /> {workout.durationMinutes} phút
                    </span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>• {workout.difficulty}</span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--color-brand-primary)', fontWeight: 600 }}>• {workout.exercises.length} động tác</span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '4px' }}>{workout.title}</h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    {workout.tagline}. {workout.description}
                  </p>
                </div>
              </div>

              {/* Movement Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {workout.exercises.map((ex, i) => (
                  <span
                    key={ex.id}
                    style={{
                      fontSize: '0.78rem',
                      backgroundColor: 'var(--color-surface-subtle)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-full)',
                      padding: '4px 10px',
                      color: 'var(--color-text-secondary)',
                      fontWeight: 600
                    }}
                  >
                    {i + 1}. {ex.name}
                  </span>
                ))}
              </div>

              {/* Actions Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--color-border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--color-brand-primary)', fontWeight: 600 }}>
                  <ShieldCheck size={16} /> Không cần dụng cụ
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    className="btn-ghost"
                    onClick={() => onPreviewWorkout(workout)}
                    style={{ fontSize: '0.88rem' }}
                  >
                    <Eye size={15} style={{ marginRight: '4px' }} />
                    Xem chi tiết
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() => handleStart(workout)}
                    style={{ minHeight: '40px', padding: '8px 18px', fontSize: '0.9rem' }}
                  >
                    <Play size={16} fill="currentColor" />
                    Bắt đầu
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

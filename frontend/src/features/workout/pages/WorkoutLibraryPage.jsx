import React, { useState, useMemo } from 'react';
import { 
  Sparkles, Clock, Coins, Play, Eye, Flame, Heart, 
  ArrowRight, ShieldCheck, ChevronRight, Zap
} from 'lucide-react';
import { CURATED_WORKOUTS } from '../data/curatedWorkouts';
import { soundService } from '../services/soundService';

export const WorkoutLibraryPage = ({ onStartWorkout, onPreviewWorkout, onNavigateTab }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGoal, setSelectedGoal] = useState('all');

  const categories = [
    { id: 'all', label: 'Tất cả' },
    { id: 'Thư giãn', label: 'Thư giãn' },
    { id: 'Giãn cơ', label: 'Giãn cơ' },
    { id: 'Cardio', label: 'Cardio' }
  ];

  const goals = [
    { id: 'neck', title: 'Giãn cơ vai gáy', icon: '🧘', color: 'mint', workoutId: 'tha-long-vai-gay-cot-song' },
    { id: 'stress', title: 'Giảm căng thẳng', icon: '💆', color: 'peach', workoutId: 'danh-thuc-nang-luong' },
    { id: 'fatburn', title: 'Đốt mỡ nhanh', icon: '🔥', color: 'peach', workoutId: 'cardio-vui-ve' },
    { id: 'posture', title: 'Chăm sóc tư thế', icon: '🧍', color: 'mint', workoutId: 'tha-long-vai-gay-cot-song' }
  ];

  const targetFilters = [
    { id: 'all', label: 'Mục tiêu' },
    { id: 'warmup', label: 'Khởi động' },
    { id: 'calorie', label: 'Đốt calo' },
    { id: 'advance', label: 'Nâng cao' }
  ];

  const filteredWorkouts = useMemo(() => {
    return CURATED_WORKOUTS.filter(w => {
      const matchCat = selectedCategory === 'all' || w.category === selectedCategory;
      return matchCat;
    });
  }, [selectedCategory]);

  const handleStart = (w) => {
    soundService.playTone(523.25, 'sine', 0.2);
    onStartWorkout(w);
  };

  return (
    <div style={{ width: '100%', paddingBottom: '120px' }}>
      {/* 1. Header Section */}
      <div style={{ padding: '8px 4px 14px 4px' }}>
        <div style={{
          fontSize: '0.74rem',
          fontWeight: 800,
          color: '#133E35',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom: '4px'
        }}>
          Lộ trình dành riêng cho bạn
        </div>

        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 900,
          color: '#1E293B',
          letterSpacing: '-0.02em',
          margin: '2px 0 6px 0',
          lineHeight: 1.25
        }}>
          Vài phút cũng tạo nên khác biệt.
        </h1>

        <p style={{
          color: '#475569',
          fontSize: '0.88rem',
          fontWeight: 600,
          margin: 0,
          lineHeight: 1.4
        }}>
          Phù hợp cho cả ngày bận rộn. Bắt đầu với người bạn nhỏ của bạn ngay.
        </p>
      </div>

      {/* 2. Category Filter Pills */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '14px',
        scrollbarWidth: 'none'
      }}>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                soundService.playTone(440, 'sine', 0.08);
              }}
              style={{
                padding: '7px 18px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: isSelected ? '#133E35' : '#FFFFFF',
                color: isSelected ? '#FFFFFF' : '#475569',
                fontSize: '0.84rem',
                fontWeight: 800,
                border: isSelected ? '1px solid #133E35' : '1px solid rgba(19, 62, 53, 0.1)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: isSelected ? '0 2px 8px rgba(19, 62, 53, 0.2)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 3. Featured Mochi Workout Room Banner (Peach #FEDFD2) */}
      <div className="card-peach" style={{
        marginBottom: '18px',
        padding: '16px',
        position: 'relative'
      }}>
        <div style={{
          display: 'inline-block',
          backgroundColor: '#F97316',
          color: '#FFFFFF',
          fontSize: '0.68rem',
          fontWeight: 900,
          padding: '2px 8px',
          borderRadius: 'var(--radius-full)',
          marginBottom: '8px',
          textTransform: 'uppercase'
        }}>
          Phòng tập cùng Mochi
        </div>

        <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#1E293B', margin: '0 0 4px 0' }}>
          Bạn tập, Mochi cổ vũ!
        </h3>

        <p style={{ fontSize: '0.8rem', color: '#475569', margin: '0 0 12px 0', lineHeight: 1.4 }}>
          Khi bạn ngừng, Mochi sẽ ngóng chờ... Luyện tập đều giúp Mochi phát triển và mở khóa nhiều biểu cảm vui nhộn.
        </p>

        <button
          onClick={() => {
            const featured = CURATED_WORKOUTS.find(w => w.id === 'tha-long-vai-gay-cot-song') || CURATED_WORKOUTS[0];
            onPreviewWorkout(featured);
          }}
          style={{
            backgroundColor: '#FEE3D4',
            color: '#9A3412',
            fontWeight: 800,
            fontSize: '0.84rem',
            padding: '9px 16px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid #FCD2C0',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>Vào phòng tập Mochi</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* 4. Section: Mochi muốn rủ bạn tập gì? (2x2 Grid) */}
      <div style={{ marginBottom: '18px' }}>
        <h3 style={{
          fontSize: '0.98rem',
          fontWeight: 900,
          color: '#1E293B',
          margin: '0 0 10px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span>Mochi muốn rủ bạn tập gì?</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          {goals.map((g) => {
            const isMint = g.color === 'mint';
            return (
              <div
                key={g.id}
                onClick={() => {
                  const targetW = CURATED_WORKOUTS.find(w => w.id === g.workoutId) || CURATED_WORKOUTS[0];
                  onPreviewWorkout(targetW);
                }}
                style={{
                  backgroundColor: isMint ? '#72D5C3' : '#FEDFD2',
                  borderRadius: '16px',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: isMint ? 'none' : '1px solid rgba(254, 214, 198, 0.7)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                  transition: 'transform 0.15s ease'
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>{g.icon}</span>
                <span style={{
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: isMint ? '#133E35' : '#1E293B'
                }}>
                  {g.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Section: Bài tập gợi ý theo mục tiêu (Filter Pills) */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>
          Bài tập gợi ý theo mục tiêu
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {targetFilters.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedGoal(t.id)}
              style={{
                padding: '5px 14px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: selectedGoal === t.id ? '#133E35' : '#FFFFFF',
                color: selectedGoal === t.id ? '#FFFFFF' : '#475569',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: '1px solid rgba(19, 62, 53, 0.1)',
                cursor: 'pointer'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 6. Section: Bài tập năng lượng mỗi ngày (Workout Cards List) */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#1E293B', marginBottom: '10px' }}>
          Bài tập năng lượng mỗi ngày
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredWorkouts.slice(0, 4).map((w) => (
            <div
              key={w.id}
              style={{
                backgroundColor: '#FEDFD2',
                borderRadius: '20px',
                padding: '14px',
                border: '1px solid rgba(254, 214, 198, 0.8)',
                boxShadow: '0 4px 14px rgba(254, 214, 198, 0.25)'
              }}
            >
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                {/* Thumbnail with duration badge overlay */}
                <div style={{
                  width: '76px',
                  height: '76px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  flexShrink: 0,
                  position: 'relative',
                  backgroundColor: '#FFFFFF'
                }}>
                  <img
                    src={w.imageUrl || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&auto=format&fit=crop&q=80"}
                    alt={w.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '4px',
                    left: '4px',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    color: '#FFFFFF',
                    fontSize: '0.64rem',
                    fontWeight: 800,
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-full)'
                  }}>
                    {w.durationMinutes} phút
                  </div>
                </div>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: 900,
                    color: '#1E293B',
                    margin: '0 0 3px 0'
                  }}>
                    {w.title}
                  </h4>
                  <p style={{
                    fontSize: '0.78rem',
                    color: '#475569',
                    margin: '0 0 6px 0',
                    lineHeight: 1.35
                  }}>
                    {w.tagline || w.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', fontWeight: 800, color: '#9A3412' }}>
                    <span>🕒 {w.durationMinutes}p</span>
                    <span>•</span>
                    <span>🪙 +{w.xpReward || 30} XP</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleStart(w)}
                  className="btn-orange"
                  style={{ flex: 1, padding: '10px 16px', fontSize: '0.9rem' }}
                >
                  <Play size={14} fill="currentColor" />
                  <span>Bắt đầu ngay</span>
                </button>

                <button
                  onClick={() => onPreviewWorkout(w)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#475569',
                    border: '1px solid rgba(19, 62, 53, 0.1)',
                    borderRadius: 'var(--radius-full)',
                    padding: '10px 14px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <Eye size={15} />
                  <span>Chi tiết</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Footer Gentle Encouragement */}
      <div style={{
        backgroundColor: '#72D5C3',
        borderRadius: '20px',
        padding: '14px 16px',
        color: '#133E35',
        fontSize: '0.82rem',
        fontWeight: 700,
        lineHeight: 1.4,
        textAlign: 'center'
      }}>
        💡 Mẹo nhỏ từ Mochi: Tập đều 5 phút mỗi ngày hiệu quả hơn tập 35 phút dồn vào cuối tuần đó nha!
      </div>
    </div>
  );
};

export default WorkoutLibraryPage;

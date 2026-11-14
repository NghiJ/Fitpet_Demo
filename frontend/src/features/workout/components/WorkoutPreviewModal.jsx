import React, { useState } from 'react';
import { 
  Play, X, Clock, ShieldCheck, ChevronLeft, ChevronDown, ChevronUp,
  Sparkles, Coins, Flame, CheckCircle2, Award
} from 'lucide-react';
import { ExerciseIllustration } from './ExerciseIllustration';
import { VirtualPet } from '../../pet/components/VirtualPet';
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
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" style={{ padding: '8px' }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '430px',
          maxHeight: '92vh',
          backgroundColor: '#EAF7F0',
          borderRadius: '26px',
          padding: '0',
          overflowY: 'auto',
          boxShadow: '0 20px 45px rgba(19, 62, 53, 0.25)',
          position: 'relative'
        }}
      >
        {/* 1. Modal Top Bar */}
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backgroundColor: 'rgba(234, 247, 240, 0.95)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid rgba(19, 62, 53, 0.06)'
        }}>
          <button
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: '#133E35',
              fontWeight: 800,
              fontSize: '0.92rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <ChevronLeft size={20} />
            <span>Chi tiết bài tập</span>
          </button>

          <button
            onClick={onClose}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(19, 62, 53, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#475569'
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '16px' }}>
          {/* 2. Hero Banner Image with Overlay */}
          <div style={{
            position: 'relative',
            height: '180px',
            borderRadius: '20px',
            overflow: 'hidden',
            marginBottom: '16px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.08)'
          }}>
            <img
              src={workout.imageUrl || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80"}
              alt={workout.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Gradient Overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.2) 60%, transparent 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '12px 14px'
            }}>
              {/* Badge Top */}
              <div style={{ alignSelf: 'flex-start' }}>
                <span style={{
                  backgroundColor: 'rgba(5, 150, 105, 0.9)',
                  color: '#FFFFFF',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <ShieldCheck size={12} />
                  <span>Đã xác thực bởi HLV</span>
                </span>
              </div>

              {/* Title Bottom */}
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 3px 0' }}>
                  {workout.title}
                </h2>
                <div style={{ fontSize: '0.8rem', color: '#E2E8F0', fontWeight: 600 }}>
                  {workout.durationMinutes} phút • {workout.category} • {workout.difficulty}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Mochi Companion Box */}
          <div style={{
            backgroundColor: '#72D5C3',
            borderRadius: '20px',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px',
            boxShadow: '0 4px 14px rgba(114, 213, 195, 0.25)'
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: '2px solid #FEF3C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              overflow: 'hidden'
            }}>
              <VirtualPet species="mochi" size="sm" state="cheering" interactive={false} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 900, color: '#064E3B', marginBottom: '2px', textTransform: 'uppercase' }}>
                Bạn đồng hành Mochi
              </div>
              <div style={{ fontSize: '0.78rem', color: '#133E35', fontWeight: 700, lineHeight: 1.35 }}>
                "Cùng Mochi dành {workout.durationMinutes} phút thư giãn nhé! Di chuyển chậm rãi và giữ cơ thể thật thoải mái."
              </div>
            </div>
          </div>

          {/* 4. Four Stat Grid (Peach #FEDFD2) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
            marginBottom: '16px'
          }}>
            <div className="card-peach" style={{ padding: '10px 12px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B' }}>Thời lượng</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#C2410C' }}>
                {workout.durationMinutes} phút
              </div>
            </div>

            <div className="card-peach" style={{ padding: '10px 12px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B' }}>Động tác</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#C2410C' }}>
                {workout.exercises.length} động tác
              </div>
            </div>

            <div className="card-peach" style={{ padding: '10px 12px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B' }}>Cường độ</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#C2410C' }}>
                {workout.difficulty || 'Nhẹ nhàng'}
              </div>
            </div>

            <div className="card-peach" style={{ padding: '10px 12px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B' }}>Tác động</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#C2410C' }}>
                {workout.category}
              </div>
            </div>
          </div>

          {/* 5. Lợi ích bài tập */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            padding: '14px',
            marginBottom: '16px',
            border: '1px solid rgba(19, 62, 53, 0.08)'
          }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 900, color: '#1E293B', margin: '0 0 8px 0' }}>
              Lợi ích bài tập
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.45, margin: '0 0 10px 0' }}>
              {workout.description}
            </p>
            {workout.benefits && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {workout.benefits.map((b, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.78rem', color: '#334155' }}>
                    <CheckCircle2 size={14} style={{ color: '#059669', flexShrink: 0, marginTop: '2px' }} />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 6. Các động tác trong bài (Numbered list 01, 02, 03) */}
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 900, color: '#1E293B', margin: '0 0 10px 0' }}>
              Các động tác trong bài ({workout.exercises.length})
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {workout.exercises.map((ex, idx) => {
                const isSelected = selectedExIndex === idx;
                const numStr = String(idx + 1).padStart(2, '0');
                return (
                  <div
                    key={ex.id}
                    onClick={() => setSelectedExIndex(idx)}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      padding: '12px 14px',
                      border: isSelected ? '1.5px solid #72D5C3' : '1px solid rgba(19, 62, 53, 0.08)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: '#E0F7F2',
                          color: '#059669',
                          fontWeight: 900,
                          fontSize: '0.74rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {numStr}
                        </span>
                        <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1E293B' }}>
                          {ex.name}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748B' }}>
                        {ex.durationSec} giây
                      </span>
                    </div>

                    <p style={{ fontSize: '0.78rem', color: '#475569', margin: '4px 0 6px 32px', lineHeight: 1.35 }}>
                      {ex.instruction}
                    </p>

                    {/* Muscle Tags */}
                    {ex.tags && (
                      <div style={{ display: 'flex', gap: '4px', marginLeft: '32px', flexWrap: 'wrap' }}>
                        {ex.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            style={{
                              backgroundColor: '#FEDFD2',
                              color: '#9A3412',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-full)'
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 7. Vùng cơ được tác động */}
          {workout.targetMuscles && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#1E293B', marginBottom: '6px' }}>
                Vùng cơ được tác động
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {workout.targetMuscles.map((m, idx) => (
                  <span
                    key={idx}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid rgba(19, 62, 53, 0.12)',
                      borderRadius: 'var(--radius-full)',
                      padding: '4px 12px',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      color: '#133E35'
                    }}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 8. Phần thưởng hoàn thành (XP & Coins) */}
          <div style={{
            backgroundColor: '#FEDFD2',
            borderRadius: '18px',
            padding: '12px 14px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#9A3412', marginBottom: '2px' }}>
                Phần thưởng hoàn thành
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                Nhận ngay sau buổi tập
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{
                backgroundColor: '#FFFFFF',
                color: '#C2410C',
                fontSize: '0.78rem',
                fontWeight: 900,
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)'
              }}>
                ⭐ +{workout.xpReward || 30} XP
              </span>
              <span style={{
                backgroundColor: '#FFFFFF',
                color: '#D97706',
                fontSize: '0.78rem',
                fontWeight: 900,
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)'
              }}>
                🪙 +{workout.coinReward || 10} Xu
              </span>
            </div>
          </div>

          {/* 9. Sticky Primary CTA Button */}
          <button
            onClick={handleStart}
            className="btn-orange"
            style={{
              width: '100%',
              padding: '14px 20px',
              fontSize: '1.05rem',
              boxShadow: '0 8px 24px rgba(247, 140, 37, 0.4)'
            }}
          >
            <span>Bắt đầu luyện tập</span>
            <span>🚀</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPreviewModal;

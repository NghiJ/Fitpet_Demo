import React from 'react';
import { CheckCircle2, Clock, Sparkles, ArrowRight, RotateCcw, Heart, Flame, Coins, ShieldCheck, Check } from 'lucide-react';
import { VirtualPet } from '../../pet/components/VirtualPet';

export const WorkoutSummary = ({
  sessionData,
  onDone,
  onStartAnother
}) => {
  const isFull = sessionData?.isFullCompletion ?? true;
  const minutesMoved = Math.max(1, Math.round((sessionData?.totalSecondsMoved || 300) / 60));
  const totalSeconds = sessionData?.totalSecondsMoved || 300;
  const completedCount = sessionData?.completedExercises?.length || 3;
  const totalExercises = 3;
  const caloriesBurn = sessionData?.caloriesBurn || 12.5;
  const xpEarned = sessionData?.xpEarned || 50;
  const coinsEarned = sessionData?.coinsEarned || 15;
  const workoutTitle = sessionData?.workoutTitle || 'Thả lỏng vai gáy & cột sống';

  return (
    <div style={{ width: '100%', paddingBottom: '40px' }}>
      {/* 1. Top Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        padding: '4px 0'
      }}>
        <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#133E35' }}>
          Session Completion...
        </span>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: '2px solid #10B981',
          overflow: 'hidden'
        }}>
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="Avatar"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>

      {/* 2. Mascot Celebratory Hero */}
      <div style={{ textAlign: 'center', marginBottom: '14px' }}>
        <div style={{
          display: 'inline-block',
          position: 'relative'
        }}>
          <VirtualPet
            species="mochi"
            state="cheering"
            size="lg"
            showSpeechBubble={false}
          />
        </div>

        {/* Status Badge */}
        <div style={{ marginTop: '8px' }}>
          <span style={{
            backgroundColor: '#D1FAE5',
            color: '#065F46',
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '3px 12px',
            borderRadius: 'var(--radius-full)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Check size={12} />
            <span>Đã hoàn thành</span>
          </span>
        </div>

        {/* Big Orange Title */}
        <h1 style={{
          fontSize: '1.85rem',
          fontWeight: 900,
          color: '#F78C25',
          margin: '6px 0 2px 0',
          letterSpacing: '-0.02em'
        }}>
          Hoàn thành bài tập!
        </h1>

        <p style={{
          fontSize: '0.9rem',
          fontWeight: 700,
          color: '#475569',
          margin: 0
        }}>
          {workoutTitle}
        </p>
      </div>

      {/* 3. Mochi Message Box (Mint Green #C6F5E3) */}
      <div style={{
        backgroundColor: '#C6F5E3',
        borderRadius: '20px',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px',
        boxShadow: '0 4px 14px rgba(19, 62, 53, 0.08)'
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          backgroundColor: '#059669',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Sparkles size={18} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '0.72rem',
            fontWeight: 900,
            color: '#065F46',
            textTransform: 'uppercase',
            marginBottom: '2px'
          }}>
            Lời nhắn từ Mochi
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#133E35', lineHeight: 1.35 }}>
            "Giỏi quá! Bạn đã dành thời gian chăm sóc cổ, vai và lưng rồi đó. Mochi rất vui vì được tập cùng bạn!"
          </div>
        </div>
      </div>

      {/* 4. Rewards Box (Peach #FEDFD2) */}
      <div className="card-peach" style={{ marginBottom: '16px', padding: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '0.84rem', fontWeight: 900, color: '#1E293B' }}>
            Phần thưởng của bạn
          </span>
          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748B' }}>
            Đã nhận ngay
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {/* XP */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            padding: '10px',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#EA580C', fontWeight: 900, fontSize: '0.98rem' }}>
              <span>⭐</span>
              <span>+{xpEarned} XP</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#64748B', marginTop: '2px', lineHeight: 1.3 }}>
              Tăng cấp Mochi và mở khóa động tác...
            </div>
          </div>

          {/* Xu */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            padding: '10px',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#D97706', fontWeight: 900, fontSize: '0.98rem' }}>
              <span>🪙</span>
              <span>+{coinsEarned} Xu</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#64748B', marginTop: '2px', lineHeight: 1.3 }}>
              Xu Vàng: Dùng mua quà và trang phục ấm áp cho Mochi.
            </div>
          </div>
        </div>
      </div>

      {/* 5. Session Summary (Tóm tắt buổi tập) */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '22px',
        padding: '16px',
        marginBottom: '20px',
        border: '1px solid rgba(19, 62, 53, 0.08)',
        boxShadow: '0 4px 16px rgba(19, 62, 53, 0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: 900, color: '#1E293B', marginBottom: '12px' }}>
          <span>📊</span>
          <span>Tóm tắt buổi tập</span>
        </div>

        {/* 4 Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '12px' }}>
          <div style={{ backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '10px' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>
              Thời gian tập
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 900, color: '#1E293B' }}>
              {minutesMoved} phút <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8' }}>({totalSeconds}s)</span>
            </div>
          </div>

          <div style={{ backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '10px' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>
              Động tác
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 900, color: '#1E293B' }}>
              {completedCount}/{totalExercises} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#059669' }}>(100%)</span>
            </div>
          </div>

          <div style={{ backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '10px' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>
              Thời gian nghỉ
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 900, color: '#1E293B' }}>
              20 giây <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8' }}>(2 lần)</span>
            </div>
          </div>

          <div style={{ backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '10px' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>
              Calo tiêu hao
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 900, color: '#1E293B' }}>
              {caloriesBurn} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#EA580C' }}>kcal</span>
            </div>
          </div>
        </div>

        {/* Spine status check note */}
        <div style={{
          backgroundColor: '#ECFDF5',
          borderRadius: '12px',
          padding: '10px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '1px solid #D1FAE5'
        }}>
          <div style={{ fontSize: '0.78rem', color: '#065F46', fontWeight: 700 }}>
            Tình trạng cột sống: <strong>Đã giảm 40% căng thẳng cơ cổ</strong>
          </div>
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: '#059669',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Check size={12} strokeWidth={3} />
          </div>
        </div>
      </div>

      {/* 6. Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={onDone}
          className="btn-orange"
          style={{ width: '100%', padding: '14px 20px', fontSize: '1rem' }}
        >
          <span>Về trang bài tập</span>
          <span>➔</span>
        </button>

        <button
          onClick={onStartAnother}
          style={{
            width: '100%',
            backgroundColor: '#FFFFFF',
            color: '#475569',
            border: '1.5px solid rgba(19, 62, 53, 0.15)',
            borderRadius: 'var(--radius-full)',
            padding: '12px 20px',
            fontSize: '0.92rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <RotateCcw size={15} />
          <span>Tập lại bài này</span>
        </button>
      </div>
    </div>
  );
};

export default WorkoutSummary;

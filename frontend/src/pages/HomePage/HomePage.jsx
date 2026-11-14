import React, { useState, useEffect } from 'react';
import { 
  Play, Sparkles, Heart, Flame, Target, Flag, Coins, 
  Calendar, CheckCircle2, ChevronRight, ArrowUpRight, Flower2,
  Crown, ArrowRight
} from 'lucide-react';
import { CURATED_WORKOUTS } from '../../features/workout/data/curatedWorkouts';
import { VirtualPet } from '../../features/pet/components/VirtualPet';
import { soundService } from '../../features/workout/services/soundService';
import { petService } from '../../features/pet/services/petService';

export const HomePage = ({
  currentUser,
  onStartWorkout,
  onPreviewWorkout,
  workoutHistory = [],
  onNavigateTab,
  onOpenSubscription
}) => {
  const [petData, setPetData] = useState(() => petService.getPetData());
  const [petMoodText, setPetMoodText] = useState("Hôm nay bạn đã khởi động 3 phút rồi nè! Tiếp tục nhé!");
  const [petStatus, setPetStatus] = useState("Mochi đang vui vẻ ✨");
  const [petState, setPetState] = useState("idle"); // 'idle' | 'exercising' | 'cheering' | 'resting'

  useEffect(() => {
    const unsub = petService.subscribe(setPetData);
    return () => unsub();
  }, []);

  // Featured recommendation is always "Đánh thức năng lượng" (3 phút)
  const quickWorkout = CURATED_WORKOUTS.find(w => w.id === 'danh-thuc-nang-luong') || CURATED_WORKOUTS[0];

  const handleStart = (w) => {
    soundService.playTone(523.25, 'sine', 0.2);
    onStartWorkout(w);
  };

  const handlePetAction = (action) => {
    soundService.playRepBeep();
    if (action === 'relax') {
      setPetState('idle');
      setPetStatus('Mochi đang thư thái 🌿');
      setPetMoodText('Cùng hít thở sâu một nhịp, thả lỏng bờ vai và mỉm cười nào!');
    } else if (action === 'exercise') {
      setPetState('exercising');
      setPetStatus('Mochi sẵn sàng tập 🧘');
      setPetMoodText('Mochi đã đeo băng đô thể thao rồi nè, tập 3 phút cùng Mochi nhé!');
    } else if (action === 'sleep') {
      setPetState('resting');
      setPetStatus('Mochi đang ngủ ngoan 💤');
      setPetMoodText('Khò khò... Mochi ngủ một chút để nạp lại năng lượng nhé...');
    } else {
      setPetState('cheering');
      setPetStatus('Mochi được vuốt ve 🥰');
      setPetMoodText('Gâu gâu! Mochi thích bạn vuốt ve lắm! Chúng mình là bạn tốt nhất!');
      setTimeout(() => setPetState('idle'), 3000);
    }
  };

  return (
    <div style={{ width: '100%', paddingBottom: '120px' }}>
      {/* 1. Header Greeting Section */}
      <div style={{ padding: '8px 4px 16px 4px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: '#133E35',
          fontSize: '0.74rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom: '4px'
        }}>
          <Calendar size={13} style={{ color: '#059669' }} />
          <span>Tiến độ theo nhịp của bạn</span>
        </div>

        <h1 style={{
          fontSize: '1.95rem',
          fontWeight: 900,
          color: '#F78C25',
          letterSpacing: '-0.02em',
          margin: '2px 0 4px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          Chào buổi sáng! 🌱
        </h1>

        <p style={{
          color: '#334155',
          fontSize: '0.92rem',
          fontWeight: 600,
          margin: 0
        }}>
          Mỗi bước nhỏ đều đáng tự hào cùng Mochi.
        </p>
      </div>

      {/* 2. Mochi Companion Hero Card (Seafoam Mint #72D5C3) */}
      <div style={{
        backgroundColor: '#72D5C3',
        borderRadius: '26px',
        padding: '16px',
        color: '#133E35',
        boxShadow: '0 10px 24px -4px rgba(114, 213, 195, 0.35)',
        marginBottom: '16px',
        position: 'relative'
      }}>
        {/* Top Info Row: Avatar + Stats & Speech Bubble */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '14px' }}>
          {/* Avatar Circle */}
          <div style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: '3px solid #FEF3C7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(19, 62, 53, 0.1)',
            overflow: 'hidden'
          }}>
            <VirtualPet
              species="mochi"
              size="sm"
              state={petState}
              interactive={true}
              showSpeechBubble={false}
            />
          </div>

          {/* Right Info: Name, Status Pill, Speech Bubble, Progress Bars */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Name + Level Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#133E35' }}>Mochi</span>
              <span style={{
                backgroundColor: '#FEDFD2',
                color: '#9A3412',
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)'
              }}>
                Cấp 2
              </span>
            </div>

            {/* Status Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-full)',
              padding: '2px 10px',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#059669',
              marginBottom: '8px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
            }}>
              <span>•</span>
              <span>{petStatus}</span>
            </div>

            {/* Speech Bubble */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              borderRadius: '12px',
              padding: '8px 10px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#133E35',
              lineHeight: 1.35,
              marginBottom: '10px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}>
              "{petMoodText}"
            </div>

            {/* Progress Bars (Độ no 80%, Hạnh phúc 100%) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {/* Độ no */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 800, marginBottom: '3px' }}>
                  <span>🍖 Độ no</span>
                  <span>80%</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(19, 62, 53, 0.15)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: '80%', height: '100%', backgroundColor: '#059669', borderRadius: '9999px' }} />
                </div>
              </div>

              {/* Hạnh phúc */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 800, marginBottom: '3px' }}>
                  <span>❤️ Hạnh phúc</span>
                  <span>100%</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(19, 62, 53, 0.15)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: '100%', backgroundColor: '#E11D48', borderRadius: '9999px' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Pills Row */}
        <div style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '10px',
          scrollbarWidth: 'none'
        }}>
          <button onClick={() => handlePetAction('relax')} className="pill-action">
            Thư thái 🌿
          </button>
          <button onClick={() => handlePetAction('exercise')} className="pill-action">
            Rung bài tập 🧘
          </button>
          <button onClick={() => handlePetAction('sleep')} className="pill-action">
            Ru ngủ 💤
          </button>
          <button onClick={() => handlePetAction('pet')} className="pill-action">
            Chạm
          </button>
        </div>

        {/* Big Bottom Action Button */}
        <button
          onClick={() => onNavigateTab ? onNavigateTab('pet') : handlePetAction('pet')}
          style={{
            width: '100%',
            backgroundColor: '#FEE3D4',
            color: '#78350F',
            fontWeight: 800,
            fontSize: '0.88rem',
            padding: '11px 16px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            transition: 'transform 0.2s ease'
          }}
        >
          <span>🏠</span>
          <span>Ghé thăm & Chăm sóc Mochi</span>
          <span>🐾</span>
        </button>
      </div>

      {/* 3. Three Daily Quick Stat Cards (in a row in Peach #FEDFD2) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        marginBottom: '16px'
      }}>
        {/* Card 1: Vận động */}
        <div className="card-peach" style={{ padding: '12px 10px', textAlign: 'left' }}>
          <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#FED7AA', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EA580C', marginBottom: '8px' }}>
            <Target size={13} />
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#C2410C', lineHeight: 1 }}>
            3 <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>phút</span>
          </div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginTop: '3px' }}>
            Vận động
          </div>
        </div>

        {/* Card 2: Hoàn thành */}
        <div className="card-peach" style={{ padding: '12px 10px', textAlign: 'left' }}>
          <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#FED7AA', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EA580C', marginBottom: '8px' }}>
            <Flag size={13} />
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#C2410C', lineHeight: 1 }}>
            1 <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>bài</span>
          </div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginTop: '3px' }}>
            Hoàn thành
          </div>
        </div>

        {/* Card 3: Tích lũy hôm nay */}
        <div className="card-peach" style={{ padding: '12px 10px', textAlign: 'left' }}>
          <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#FED7AA', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EA580C', marginBottom: '8px' }}>
            <Coins size={13} />
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#C2410C', lineHeight: 1 }}>
            30 <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>xp</span>
          </div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginTop: '3px' }}>
            Tích lũy hôm nay
          </div>
        </div>
      </div>

      {/* 4. Gợi ý nhanh hôm nay (Seafoam Mint Border + Inner Peach Card) */}
      <div style={{
        backgroundColor: '#72D5C3',
        borderRadius: '24px',
        padding: '16px',
        marginBottom: '16px',
        boxShadow: '0 6px 20px -3px rgba(114, 213, 195, 0.3)'
      }}>
        {/* Section Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#EA580C', fontWeight: 900, fontSize: '0.98rem' }}>
            <ArrowUpRight size={18} strokeWidth={3} />
            <span>Gợi ý nhanh hôm nay</span>
          </div>
          <div style={{
            backgroundColor: '#FFFFFF',
            color: '#059669',
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)'
          }}>
            Phù hợp nghỉ trưa
          </div>
        </div>

        {/* Inner Peach Card */}
        <div style={{
          backgroundColor: '#FEDFD2',
          borderRadius: '18px',
          padding: '14px',
          marginBottom: '12px'
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* Thumbnail */}
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '14px',
              overflow: 'hidden',
              flexShrink: 0,
              backgroundColor: '#FFFFFF'
            }}>
              <img
                src={quickWorkout.imageUrl || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&auto=format&fit=crop&q=80"}
                alt="Đánh thức năng lượng"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Workout Details */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#1E293B', margin: '0 0 3px 0' }}>
                {quickWorkout.title}
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#475569', margin: '0 0 6px 0', lineHeight: 1.35 }}>
                {quickWorkout.tagline}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 800, color: '#9A3412' }}>
                <span>🕒 {quickWorkout.durationMinutes} phút</span>
                <span>•</span>
                <span>🪙 +{quickWorkout.xpReward || 30} XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width Vivid Orange CTA Button */}
        <button
          onClick={() => handleStart(quickWorkout)}
          className="btn-orange"
          style={{ width: '100%', padding: '13px 20px', fontSize: '1rem' }}
        >
          <span>Bắt đầu ngay</span>
          <span>🚀</span>
        </button>
      </div>

      {/* 5. 7 Ngày Vừa Qua (Chart Card in Peach #FEDFD2) */}
      <div className="card-peach" style={{ marginBottom: '16px', padding: '16px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#EA580C', fontWeight: 900, fontSize: '0.96rem' }}>
            <span>📈</span>
            <span>7 ngày vừa qua</span>
          </div>
          <div style={{
            backgroundColor: '#FFFFFF',
            color: '#133E35',
            fontSize: '0.74rem',
            fontWeight: 800,
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)'
          }}>
            Tổng: 3 phút
          </div>
        </div>

        {/* 7-Day Chart Bars */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '8px',
          alignItems: 'flex-end',
          height: '110px',
          paddingBottom: '6px'
        }}>
          {[
            { day: 'T5', time: '0p', active: false },
            { day: 'T6', time: '0p', active: false },
            { day: 'T7', time: '0p', active: false },
            { day: 'CN', time: '0p', active: false },
            { day: 'T2', time: '0p', active: false },
            { day: 'T3', time: '0p', active: false },
            { day: 'T4', time: '3p', active: true }
          ].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
              {/* Duration Text */}
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                color: item.active ? '#15803D' : '#94A3B8',
                marginBottom: '4px'
              }}>
                {item.time}
              </span>

              {/* Bar Fill */}
              {item.active ? (
                <div style={{
                  width: '26px',
                  height: '56px',
                  backgroundColor: '#A7EDB8',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(167, 237, 184, 0.5)',
                  marginBottom: '8px'
                }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#15803D' }} />
                </div>
              ) : (
                <div style={{
                  width: '26px',
                  height: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '2px',
                  marginBottom: '8px'
                }} />
              )}

              {/* Day Label */}
              <span style={{
                fontSize: '0.74rem',
                fontWeight: item.active ? 900 : 700,
                color: item.active ? '#1E293B' : '#64748B'
              }}>
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Gentle Daily Encouragement Card (Seafoam Mint #72D5C3) */}
      <div style={{
        backgroundColor: '#72D5C3',
        borderRadius: '22px',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 6px 18px -4px rgba(114, 213, 195, 0.3)'
      }}>
        {/* Flower / Paw Icon inside white circle */}
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#133E35',
          flexShrink: 0,
          boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
        }}>
          <Flower2 size={20} />
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#133E35', marginBottom: '2px' }}>
            Nhỏ thôi, nhưng mỗi ngày.
          </div>
          <div style={{ fontSize: '0.76rem', color: '#133E35', lineHeight: 1.35, opacity: 0.9 }}>
            Mỗi phút vận động là một chút yêu thương dịu dàng dành cho cơ thể bạn và người bạn nhỏ Mochi.
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

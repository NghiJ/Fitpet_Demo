import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Heart, Smile, Sun, Edit3, 
  Check, Award, Zap, ShieldCheck, Utensils, Moon, Dumbbell
} from 'lucide-react';
import { VirtualPet } from './VirtualPet';
import { petService, PET_SPECIES_LIST } from '../services/petService';
import { soundService } from '../../workout/services/soundService';

export const PetSanctuary = ({ sessionCount = 0 }) => {
  const [petData, setPetData] = useState(() => petService.getPetData());
  const [petMood, setPetMood] = useState('idle');
  const [petMessage, setPetMessage] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [hunger, setHunger] = useState(petData.hunger ?? 80);
  const [happiness, setHappiness] = useState(petData.happiness ?? 100);
  const [energy, setEnergy] = useState(90);

  useEffect(() => {
    const unsubscribe = petService.subscribe((updated) => {
      setPetData(updated);
    });
    return () => unsubscribe();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleFeed = () => {
    soundService.playTone(659.25, 'sine', 0.15);
    setHunger(prev => Math.min(100, prev + 10));
    setHappiness(prev => Math.min(100, prev + 5));
    setPetMood('cheering');
    setPetMessage('Ngon quá đi à! Cảm ơn bạn đã cho Mochi ăn bánh thưởng nhé! 🍖✨');
    showToast('🍖 Đã cho Mochi ăn bánh dinh dưỡng (+10% Độ no)');
    setTimeout(() => setPetMood('idle'), 3000);
  };

  const handlePet = () => {
    soundService.playRepBeep();
    setHappiness(100);
    setPetMood('cheering');
    setPetMessage('Gâu gâu! Mochi thích bạn xoa đầu lắm, chúng mình cùng cố gắng nhé! 🥰');
    showToast('❤️ Đã vuốt ve Mochi (Hạnh phúc đạt 100%)');
    setTimeout(() => setPetMood('idle'), 3000);
  };

  const handleExercise = () => {
    soundService.playTone(523.25, 'sine', 0.2);
    setPetMood('exercising');
    setEnergy(prev => Math.max(30, prev - 10));
    setPetMessage('Mochi đang tập giãn cơ cổ vai cùng bạn nè, 1-2-3 vươn vai nào! 🧘');
    showToast('🧘 Mochi đang tập luyện cùng bạn');
    setTimeout(() => setPetMood('idle'), 4000);
  };

  const handleSleep = () => {
    soundService.playTone(392.00, 'sine', 0.25);
    setPetMood('resting');
    setEnergy(100);
    setPetMessage('Khò khò... Mochi chợp mắt nghỉ ngơi nạp lại năng lượng nhé... 💤');
    showToast('💤 Mochi đang nghỉ ngơi dưỡng sức');
    setTimeout(() => setPetMood('idle'), 4000);
  };

  return (
    <div style={{ width: '100%', paddingBottom: '120px' }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#059669',
          color: '#FFFFFF',
          padding: '10px 18px',
          borderRadius: 'var(--radius-full)',
          boxShadow: '0 8px 24px rgba(5, 150, 105, 0.3)',
          fontSize: '0.84rem',
          fontWeight: 800,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Check size={16} /> {toastMessage}
        </div>
      )}

      {/* Header */}
      <div style={{ padding: '8px 4px 14px 4px' }}>
        <div style={{
          fontSize: '0.74rem',
          fontWeight: 800,
          color: '#133E35',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom: '4px'
        }}>
          Ngôi nhà của bạn nhỏ
        </div>
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 900,
          color: '#F78C25',
          letterSpacing: '-0.02em',
          margin: '2px 0 4px 0'
        }}>
          Ghé thăm & Chăm sóc Mochi 🐾
        </h1>
        <p style={{ color: '#475569', fontSize: '0.88rem', margin: 0, fontWeight: 600 }}>
          Chăm sóc Mochi mỗi ngày với các bài tập vận động, cho ăn và nghỉ ngơi.
        </p>
      </div>

      {/* Main Pet Stage (Seafoam Mint #72D5C3) */}
      <div style={{
        backgroundColor: '#72D5C3',
        borderRadius: '26px',
        padding: '24px 16px',
        textAlign: 'center',
        marginBottom: '16px',
        boxShadow: '0 10px 26px -4px rgba(114, 213, 195, 0.35)',
        position: 'relative'
      }}>
        {/* Level Tag Top */}
        <div style={{
          position: 'absolute',
          top: '14px',
          left: '14px',
          backgroundColor: '#FEDFD2',
          color: '#9A3412',
          fontSize: '0.74rem',
          fontWeight: 900,
          padding: '3px 10px',
          borderRadius: 'var(--radius-full)'
        }}>
          ⭐ Cấp độ 2 (Thân thiết)
        </div>

        {/* Mascot */}
        <div style={{ marginTop: '12px', marginBottom: '8px' }}>
          <VirtualPet
            species={petData.species || 'mochi'}
            size="lg"
            state={petMood}
            message={petMessage}
            showSpeechBubble={true}
          />
        </div>

        <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#133E35', margin: '4px 0 2px 0' }}>
          {petData.customName || 'Mochi'}
        </h3>
        <p style={{ fontSize: '0.82rem', color: '#133E35', opacity: 0.9, margin: '0 0 16px 0', fontWeight: 600 }}>
          Cún cưng thể thao vui vẻ & tràn đầy năng lượng
        </p>

        {/* 3 Status Sliders */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '18px',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          textAlign: 'left'
        }}>
          {/* Độ no */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', fontWeight: 800, color: '#133E35', marginBottom: '4px' }}>
              <span>🍖 Độ no dinh dưỡng</span>
              <span style={{ color: '#059669' }}>{hunger}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#E2ECE7', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ width: `${hunger}%`, height: '100%', backgroundColor: '#059669', borderRadius: '9999px' }} />
            </div>
          </div>

          {/* Hạnh phúc */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', fontWeight: 800, color: '#133E35', marginBottom: '4px' }}>
              <span>❤️ Chỉ số hạnh phúc</span>
              <span style={{ color: '#E11D48' }}>{happiness}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#E2ECE7', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ width: `${happiness}%`, height: '100%', backgroundColor: '#E11D48', borderRadius: '9999px' }} />
            </div>
          </div>

          {/* Năng lượng */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', fontWeight: 800, color: '#133E35', marginBottom: '4px' }}>
              <span>⚡ Năng lượng vận động</span>
              <span style={{ color: '#F59E0B' }}>{energy}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#E2ECE7', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ width: `${energy}%`, height: '100%', backgroundColor: '#F59E0B', borderRadius: '9999px' }} />
            </div>
          </div>
        </div>
      </div>

      {/* 4 Care Actions Grid (Peach #FEDFD2) */}
      <div style={{ marginBottom: '18px' }}>
        <h4 style={{ fontSize: '0.92rem', fontWeight: 900, color: '#1E293B', margin: '0 0 10px 0' }}>
          Tương tác chăm sóc cùng Mochi
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          <button
            onClick={handleFeed}
            className="card-peach"
            style={{
              padding: '14px',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ fontSize: '1.4rem' }}>🍖</div>
            <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#9A3412' }}>Cho ăn bánh</div>
            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Tăng +10% độ no</div>
          </button>

          <button
            onClick={handlePet}
            className="card-peach"
            style={{
              padding: '14px',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ fontSize: '1.4rem' }}>❤️</div>
            <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#9A3412' }}>Vuốt ve Mochi</div>
            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Tăng hạnh phúc 100%</div>
          </button>

          <button
            onClick={handleExercise}
            className="card-peach"
            style={{
              padding: '14px',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ fontSize: '1.4rem' }}>🧘</div>
            <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#9A3412' }}>Rung bài tập</div>
            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Giãn cơ cùng Mochi</div>
          </button>

          <button
            onClick={handleSleep}
            className="card-peach"
            style={{
              padding: '14px',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ fontSize: '1.4rem' }}>💤</div>
            <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#9A3412' }}>Ru ngủ nạp pin</div>
            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Hồi phục 100% năng lượng</div>
          </button>
        </div>
      </div>

      {/* Trang phục & Phụ kiện Mochi */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        padding: '16px',
        border: '1px solid rgba(19, 62, 53, 0.08)',
        marginBottom: '16px'
      }}>
        <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#1E293B', marginBottom: '10px' }}>
          Tủ đồ thể thao của Mochi 🎽
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          <div style={{ backgroundColor: '#FEDFD2', borderRadius: '12px', padding: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem' }}>🎽</div>
            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#9A3412', marginTop: '2px' }}>Áo thể thao cam</div>
            <div style={{ fontSize: '0.66rem', color: '#059669', fontWeight: 700 }}>Đang mặc</div>
          </div>

          <div style={{ backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem' }}>🩳</div>
            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#1E293B', marginTop: '2px' }}>Quần mint sporty</div>
            <div style={{ fontSize: '0.66rem', color: '#059669', fontWeight: 700 }}>Đang mặc</div>
          </div>

          <div style={{ backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem' }}>👟</div>
            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#1E293B', marginTop: '2px' }}>Giày chạy cam</div>
            <div style={{ fontSize: '0.66rem', color: '#059669', fontWeight: 700 }}>Đang mang</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetSanctuary;

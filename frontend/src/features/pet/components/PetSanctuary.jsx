import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Heart, Smile, Coffee, Sun, Edit3, 
  Check, RefreshCw, Award, Zap, ShieldCheck
} from 'lucide-react';
import { VirtualPet } from './VirtualPet';
import { petService, PET_SPECIES_LIST } from '../services/petService';
import { soundService } from '../../workout/services/soundService';

export const PetSanctuary = ({ sessionCount = 0 }) => {
  const [petData, setPetData] = useState(() => petService.getPetData());
  const [petMood, setPetMood] = useState('idle');
  const [petMessage, setPetMessage] = useState(null);
  const [newNameInput, setNewNameInput] = useState(petData.customName);
  const [isEditingName, setIsEditingName] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync state with petService
  useEffect(() => {
    const unsubscribe = petService.subscribe((updated) => {
      setPetData(updated);
      setNewNameInput(updated.customName);
    });
    return () => unsubscribe();
  }, []);

  const currentSpeciesInfo = petService.getSpeciesInfo(petData.species);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handlePetAction = (action) => {
    soundService.playRepBeep();
    if (action === 'cheer') {
      setPetMood('cheering');
      setPetMessage(currentSpeciesInfo.defaultCheer || `${petData.customName} đang ăn mừng cùng bạn! Thật tuyệt vời! 🎉`);
    } else if (action === 'rest') {
      setPetMood('resting');
      setPetMessage(currentSpeciesInfo.defaultRest || `Ngủ ngon nào... Nghỉ ngơi là lúc ${petData.customName} và cơ bắp nạp lại năng lượng! 💤`);
    } else {
      setPetMood('idle');
      setPetMessage(currentSpeciesInfo.defaultIdle || `${petData.customName} đứng đây chờ phiên tập tiếp theo cùng bạn nhé!`);
    }
  };

  const handleSaveName = (e) => {
    e?.preventDefault();
    if (!newNameInput.trim()) return;
    const updated = petService.renamePet(newNameInput.trim());
    setIsEditingName(false);
    showToast(`Đã đổi tên thú cưng thành "${updated.customName}" thành công! ✨`);
    setPetMood('cheering');
    setPetMessage(`Chào bạn, từ nay hãy gọi mình là ${updated.customName} nhé! 🥰`);
  };

  const handleSelectSpecies = (speciesId) => {
    soundService.playRepBeep();
    const updated = petService.setSpecies(speciesId);
    const newSpecies = petService.getSpeciesInfo(speciesId);
    showToast(`Đã chọn bạn "${newSpecies.name}" làm người đồng hành mới! 🐾`);
    setPetMood('cheering');
    setPetMessage(newSpecies.defaultCheer);
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', width: '100%', paddingBottom: 'var(--space-12)' }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: 'var(--color-brand-primary)',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          fontSize: '0.9rem',
          fontWeight: 700,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'fadeIn 0.25s ease'
        }}>
          <Check size={18} /> {toastMessage}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '6px' }}>
          Gặp Gỡ Thú Cưng Của Bạn
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
          Bạn đồng hành vận động nhẹ nhàng không áp lực. Bạn có thể tự do chọn thú cưng yêu thích (Pip, Mochi, Lulu, Bubu) và đặt một cái tên thân thương nhất!
        </p>
      </div>

      {/* ACTIVE PET STAGE CARD */}
      <div className="card" style={{
        textAlign: 'center',
        padding: '36px 24px',
        backgroundColor: currentSpeciesInfo.bgColor || 'var(--color-pet-bg)',
        border: `2px solid ${currentSpeciesInfo.themeColor || 'rgba(245, 158, 11, 0.4)'}`,
        boxShadow: 'var(--shadow-md), 0 0 30px rgba(0, 0, 0, 0.05)',
        marginBottom: '28px',
        transition: 'all 0.3s ease'
      }}>
        {/* Top Species Badge & Affinity */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
          <span className="badge" style={{
            backgroundColor: '#FFFFFF',
            color: currentSpeciesInfo.themeColor,
            fontWeight: 800,
            fontSize: '0.8rem',
            padding: '5px 12px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
          }}>
            <Sparkles size={13} style={{ marginRight: '4px' }} />
            {currentSpeciesInfo.badge}
          </span>
          <span className="badge" style={{
            backgroundColor: '#FFFFFF',
            color: 'var(--color-text-secondary)',
            fontWeight: 700,
            fontSize: '0.8rem',
            padding: '5px 12px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
          }}>
            <Heart size={13} style={{ marginRight: '4px', color: '#EF4444' }} />
            Đã vuốt ve {petData.pettedCount || 0} lần
          </span>
        </div>

        {/* Pet SVG with speech bubble */}
        <div style={{ marginBottom: '16px' }}>
          <VirtualPet
            state={petMood}
            size="lg"
            message={petMessage || currentSpeciesInfo.defaultIdle}
            showSpeechBubble={true}
          />
        </div>

        {/* Pet Name with inline edit */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            {petData.customName}
          </h2>
          <button
            onClick={() => setIsEditingName(!isEditingName)}
            className="icon-btn"
            style={{ width: '32px', height: '32px' }}
            title="Đổi tên thú cưng"
          >
            <Edit3 size={16} />
          </button>
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
          <Smile size={16} style={{ color: currentSpeciesInfo.themeColor }} />
          {currentSpeciesInfo.title} • Cam Kết Không Phán Xét
        </div>

        {/* Inline Name Editing Form */}
        {isEditingName && (
          <form 
            onSubmit={handleSaveName}
            style={{ 
              maxWidth: '380px', 
              margin: '18px auto 0', 
              display: 'flex', 
              gap: '8px',
              backgroundColor: '#FFFFFF',
              padding: '8px 12px',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <input
              type="text"
              value={newNameInput}
              onChange={(e) => setNewNameInput(e.target.value)}
              placeholder="Nhập tên mới cho pet..."
              maxLength={20}
              autoFocus
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '0.92rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)'
              }}
            />
            <button
              type="submit"
              className="btn-primary"
              style={{ fontSize: '0.82rem', padding: '6px 14px', minHeight: '32px' }}
            >
              Lưu Tên
            </button>
            <button
              type="button"
              onClick={() => setIsEditingName(false)}
              className="btn-ghost"
              style={{ fontSize: '0.82rem', padding: '6px 10px', minHeight: '32px' }}
            >
              Hủy
            </button>
          </form>
        )}

        {/* Gentle Interaction Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '24px', flexWrap: 'wrap' }}>
          <button
            className={`btn-secondary ${petMood === 'idle' ? 'active' : ''}`}
            onClick={() => handlePetAction('idle')}
            style={{ fontSize: '0.9rem' }}
          >
            <Sun size={17} /> Chào {petData.customName}
          </button>
          <button
            className={`btn-secondary ${petMood === 'cheering' ? 'active' : ''}`}
            onClick={() => handlePetAction('cheer')}
            style={{ fontSize: '0.9rem' }}
          >
            <Sparkles size={17} /> Cùng Ăn Mừng
          </button>
          <button
            className={`btn-secondary ${petMood === 'resting' ? 'active' : ''}`}
            onClick={() => handlePetAction('rest')}
            style={{ fontSize: '0.9rem' }}
          >
            <Coffee size={17} /> Cùng Nghỉ Ngơi
          </button>
        </div>
      </div>

      {/* ================= SECTION: CHỌN BẠN PET KHÁC ================= */}
      <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              Chọn Bạn Thú Cưng Đồng Hành
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              Mỗi bạn thú cưng mang một phong cách và năng lượng riêng để hỗ trợ buổi tập của bạn.
            </p>
          </div>
          <span className="badge badge-brand" style={{ fontSize: '0.78rem' }}>
            4 Thú Cưng Đáng Yêu
          </span>
        </div>

        {/* Grid of 4 Pets */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '16px'
        }}>
          {PET_SPECIES_LIST.map((species) => {
            const isSelected = petData.species === species.id;
            return (
              <div
                key={species.id}
                onClick={() => handleSelectSpecies(species.id)}
                style={{
                  border: isSelected 
                    ? `2.5px solid ${species.themeColor}` 
                    : '1.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px 12px',
                  textAlign: 'center',
                  backgroundColor: isSelected ? species.bgColor : 'var(--color-surface)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  transform: isSelected ? 'translateY(-3px)' : 'none',
                  boxShadow: isSelected ? 'var(--shadow-md)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative'
                }}
              >
                {/* Active checkmark */}
                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: species.themeColor,
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Check size={14} />
                  </div>
                )}

                {/* Pet Preview */}
                <div style={{ marginBottom: '8px', pointerEvents: 'none' }}>
                  <VirtualPet
                    species={species.id}
                    customName={species.name}
                    state={isSelected ? 'cheering' : 'idle'}
                    size="sm"
                    interactive={false}
                  />
                </div>

                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>
                  {species.name}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                  {species.title}
                </div>

                <p style={{
                  fontSize: '0.76rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.35,
                  marginBottom: '12px',
                  flex: 1
                }}>
                  {species.description}
                </p>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectSpecies(species.id);
                  }}
                  className={isSelected ? 'btn-primary' : 'btn-secondary'}
                  style={{
                    width: '100%',
                    fontSize: '0.78rem',
                    padding: '6px 10px',
                    minHeight: '30px',
                    backgroundColor: isSelected ? species.themeColor : undefined,
                    borderColor: isSelected ? species.themeColor : undefined
                  }}
                >
                  {isSelected ? '✓ Đang Đồng Hành' : 'Chọn Bạn Này'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= SECTION: ĐẶT TÊN NHANH & GỢI Ý ================= */}
      <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Edit3 size={18} style={{ color: 'var(--color-brand-primary)' }} />
          Đặt Tên Thân Yêu Cho Thú Cưng
        </h3>
        <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
          Bạn có thể thay đổi biệt danh bất kỳ lúc nào để buổi tập thêm gần gũi và thú vị.
        </p>

        <form onSubmit={handleSaveName} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <input
            type="text"
            value={newNameInput}
            onChange={(e) => setNewNameInput(e.target.value)}
            placeholder="Ví dụ: Mochi Béo, Pip Siêu Nhân, Lulu Vui Vẻ..."
            maxLength={25}
            style={{
              flex: '1 1 240px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface-subtle)',
              fontSize: '0.9rem',
              fontWeight: 600
            }}
          />
          <button
            type="submit"
            className="btn-primary"
            style={{ padding: '10px 22px', fontSize: '0.88rem', minHeight: '40px' }}
          >
            Lưu Tên Thú Cưng
          </button>
        </form>

        {/* Suggestion Chips */}
        <div>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 700, marginRight: '8px' }}>
            Gợi ý tên vui:
          </span>
          <div style={{ display: 'inline-flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
            {[
              `${currentSpeciesInfo.name} Béo`,
              `${currentSpeciesInfo.name} Vươn Vai`,
              'Bé Đậu Phộng',
              'Gia Bảo',
              'Bắp Rang',
              'Bình Yên'
            ].map((suggestName) => (
              <button
                key={suggestName}
                type="button"
                onClick={() => {
                  setNewNameInput(suggestName);
                  petService.renamePet(suggestName);
                  showToast(`Đã đổi tên thành "${suggestName}"! ✨`);
                }}
                style={{
                  border: '1px dashed var(--color-border)',
                  backgroundColor: 'var(--color-surface-subtle)',
                  borderRadius: 'var(--radius-full)',
                  padding: '3px 10px',
                  fontSize: '0.76rem',
                  cursor: 'pointer',
                  color: 'var(--color-text-secondary)',
                  fontWeight: 600,
                  transition: 'all 0.15s ease'
                }}
              >
                + {suggestName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gentle Companion Values Card */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '14px' }}>
          Triết Lý Đồng Hành Của FitPet
        </h3>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-brand-light)', color: 'var(--color-brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Heart size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.96rem' }}>Triết lý Không Tội Lỗi (Zero-Guilt)</div>
              <div style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                Thú cưng không bao giờ than phiền, không tụt tim hay phạt bạn nếu bạn bận rộn cuối tuần hoặc tạm nghỉ vài ngày.
              </div>
            </div>
          </li>

          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-pet-warmth)', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sparkles size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.96rem' }}>Tôn Vinh Từng Phút Nỗ Lực</div>
              <div style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                Mỗi khi bạn dành dù chỉ 2-3 phút vươn vai, thú cưng sẽ hào hứng ăn mừng để tiếp thêm năng lượng tích cực cho bạn.
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

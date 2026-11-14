import React, { useState, useEffect } from 'react';
import { soundService } from '../../workout/services/soundService';
import { petService } from '../services/petService';

/**
 * FitPet Supportive Movement Companion
 * Hỗ trợ 4 bạn thú cưng: Pip (Cánh cụt), Mochi (Mèo cam), Lulu (Cún Shiba), Bubu (Gấu trúc)
 * Tự động đồng bộ tên tùy biến và loài thú cưng đã chọn từ petService.
 * Trạng thái: 'idle', 'exercising', 'cheering', 'resting'
 */
export const VirtualPet = ({
  species: propSpecies,
  customName: propCustomName,
  state = 'idle',
  size = 'md',
  message = null,
  showSpeechBubble = false,
  className = '',
  interactive = true
}) => {
  const [petData, setPetData] = useState(() => petService.getPetData());
  const [isPetted, setIsPetted] = useState(false);
  const [customMessage, setCustomMessage] = useState(null);

  // Sync with petService updates (switching pet, renaming, petting)
  useEffect(() => {
    const unsubscribe = petService.subscribe((updated) => {
      setPetData(updated);
    });
    return () => unsubscribe();
  }, []);

  const currentSpecies = propSpecies || petData.species || 'mochi';
  const speciesInfo = petService.getSpeciesInfo(currentSpecies);
  const petDisplayName = propCustomName || petData.customName || speciesInfo.name;

  // Dimensions map
  const sizeMap = {
    sm: { width: 72, height: 72 },
    md: { width: 130, height: 130 },
    lg: { width: 190, height: 190 }
  };

  const dim = sizeMap[size] || sizeMap.md;

  // Visual cues based on state
  const isExercising = state === 'exercising';
  const isCheering = state === 'cheering' || isPetted;
  const isResting = state === 'resting' && !isPetted;

  const handlePetAction = () => {
    if (!interactive) return;
    setIsPetted(true);
    soundService.playRepBeep();
    petService.petCompanion();

    const cheerMsg = speciesInfo.defaultCheer || `${petDisplayName} rất vui khi được bạn vuốt ve! 🥰`;
    setCustomMessage(cheerMsg);

    setTimeout(() => {
      setIsPetted(false);
      setCustomMessage(null);
    }, 2800);
  };

  const activeMessage = customMessage || message;

  return (
    <div
      className={`pet-container pet-size-${size} ${className}`}
      onClick={handlePetAction}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        cursor: interactive ? 'pointer' : 'default',
        userSelect: 'none'
      }}
      title={interactive ? `Bấm vào ${petDisplayName} để vuốt ve!` : `${petDisplayName} đồng hành cùng bạn`}
    >
      {/* Speech Bubble */}
      {(showSpeechBubble || customMessage) && activeMessage && (
        <div
          role="status"
          aria-live="polite"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: `2px solid ${speciesInfo.themeColor || 'var(--color-brand-primary)'}`,
            borderRadius: 'var(--radius-lg)',
            padding: '7px 16px',
            fontSize: '0.84rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            boxShadow: 'var(--shadow-md), 0 0 14px rgba(0, 0, 0, 0.08)',
            marginBottom: '8px',
            maxWidth: '260px',
            textAlign: 'center',
            position: 'relative',
            animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            zIndex: 10
          }}
        >
          {activeMessage}
          {/* Bubble tail */}
          <div
            style={{
              position: 'absolute',
              bottom: '-7px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '7px solid transparent',
              borderRight: '7px solid transparent',
              borderTop: `7px solid ${speciesInfo.themeColor || 'var(--color-brand-primary)'}`
            }}
          />
        </div>
      )}

      {/* SVG Pet Container */}
      <svg
        width={dim.width}
        height={dim.height}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={`${petDisplayName}, người bạn đồng hành`}
        style={{
          overflow: 'visible',
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform: isPetted ? 'scale(1.1) translateY(-6px)' : 'none'
        }}
      >
        <defs>
          <filter id={`softGlow-${currentSpecies}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="5" stdDeviation="5" floodOpacity="0.18" floodColor={speciesInfo.themeColor} />
          </filter>

          {/* Gradients for Pip */}
          <linearGradient id="pipBodyGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="50%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          {/* Gradients for Mochi (Cat) */}
          <linearGradient id="mochiBodyGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDBA74" />
            <stop offset="50%" stopColor="#FB923C" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>

          {/* Gradients for Lulu (Shiba) */}
          <linearGradient id="luluBodyGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FED7AA" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Gradients for Bubu (Panda) */}
          <linearGradient id="bubuBodyGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>

          <linearGradient id="bubuDarkGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          <linearGradient id="earInnerPink" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCE7F3" />
            <stop offset="100%" stopColor="#F472B6" />
          </linearGradient>

          <linearGradient id="bandanaEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          <linearGradient id="bandanaMint" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#67E8F9" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>

          <linearGradient id="scarfRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F87171" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse
          cx="80"
          cy="144"
          rx={isResting ? "58" : "46"}
          ry="10"
          fill="#0F172A"
          opacity="0.12"
        />

        {/* ================= 1. PIP THE PENGUIN ================= */}
        {currentSpecies === 'pip' && (
          <g className="pet-species-pip">
            {/* Tail */}
            {!isResting && (
              <path
                d="M 125 105 Q 155 85 148 65 Q 136 64 128 92"
                fill="url(#pipBodyGlow)"
                stroke="#D97706"
                strokeWidth="3"
                strokeLinecap="round"
                style={{
                  transformOrigin: '125px 105px',
                  animation: isCheering ? 'wagFast 0.35s infinite alternate' : 'wagSlow 2s infinite alternate ease-in-out'
                }}
              />
            )}

            {/* Left Wing / Ear */}
            <path
              d={isResting ? "M 42 62 Q 20 74 24 90 Q 42 88 46 72 Z" : "M 45 60 Q 22 32 38 22 Q 54 28 52 50 Z"}
              fill="url(#pipBodyGlow)"
              stroke="#D97706"
              strokeWidth="3"
            />
            {/* Right Wing / Ear */}
            <path
              d={isResting ? "M 118 62 Q 140 74 136 90 Q 118 88 114 72 Z" : "M 115 60 Q 138 32 122 22 Q 106 28 108 50 Z"}
              fill="url(#pipBodyGlow)"
              stroke="#D97706"
              strokeWidth="3"
            />

            {/* Main Body */}
            <ellipse
              cx="80"
              cy={isResting ? "108" : "96"}
              rx={isResting ? "52" : "45"}
              ry={isResting ? "36" : "43"}
              fill="url(#pipBodyGlow)"
              stroke="#D97706"
              strokeWidth="3"
              filter={`url(#softGlow-${currentSpecies})`}
              style={{
                animation: isCheering ? 'bounceBody 0.45s infinite alternate' : 'breatheBody 2.8s infinite ease-in-out'
              }}
            />

            {/* Tummy Patch */}
            <ellipse
              cx="80"
              cy={isResting ? "114" : "106"}
              rx={isResting ? "30" : "27"}
              ry={isResting ? "22" : "27"}
              fill="#FFFBEB"
              opacity="0.95"
            />

            {/* Workout Sweatband when exercising */}
            {isExercising && (
              <g>
                <rect x="42" y="52" width="76" height="13" rx="6.5" fill="url(#bandanaEmerald)" stroke="#059669" strokeWidth="2" />
                <line x1="46" y1="58.5" x2="114" y2="58.5" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="4 4" />
              </g>
            )}

            {/* Eyes */}
            {isResting ? (
              <g stroke="#78350F" strokeWidth="3.5" strokeLinecap="round">
                <path d="M 58 78 Q 66 84 74 78" />
                <path d="M 86 78 Q 94 84 102 78" />
              </g>
            ) : isCheering ? (
              <g stroke="#78350F" strokeWidth="3.8" strokeLinecap="round" fill="none">
                <path d="M 58 78 Q 66 67 74 78" />
                <path d="M 86 78 Q 94 67 102 78" />
              </g>
            ) : (
              <g>
                <circle cx="66" cy="76" r="6.5" fill="#78350F" />
                <circle cx="64" cy="74" r="2.5" fill="#FFFFFF" />
                <circle cx="94" cy="76" r="6.5" fill="#78350F" />
                <circle cx="92" cy="74" r="2.5" fill="#FFFFFF" />
              </g>
            )}

            {/* Rosy Cheeks */}
            <circle cx="53" cy="85" r="7" fill="#F87171" opacity="0.45" />
            <circle cx="107" cy="85" r="7" fill="#F87171" opacity="0.45" />

            {/* Snout & Cute Nose */}
            <ellipse cx="80" cy="84" rx="14" ry="10" fill="#FEF3C7" />
            <path d="M 77 80 Q 80 77 83 80 Q 80 84 77 80 Z" fill="#78350F" />

            {/* Smile */}
            {isResting ? (
              <path d="M 77 88 Q 80 91 83 88" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            ) : (
              <path d="M 75 87 Q 80 94 85 87" stroke="#78350F" strokeWidth="3" strokeLinecap="round" fill="none" />
            )}

            {/* Paws */}
            {isCheering ? (
              <g fill="#F59E0B" stroke="#D97706" strokeWidth="2.5">
                <ellipse cx="38" cy="65" rx="10" ry="8" transform="rotate(-32 38 65)" />
                <ellipse cx="122" cy="65" rx="10" ry="8" transform="rotate(32 122 65)" />
              </g>
            ) : isResting ? (
              <g fill="#F59E0B" stroke="#D97706" strokeWidth="2">
                <ellipse cx="60" cy="132" rx="12" ry="7" />
                <ellipse cx="100" cy="132" rx="12" ry="7" />
              </g>
            ) : (
              <g fill="#F59E0B" stroke="#D97706" strokeWidth="2.5">
                <ellipse cx="62" cy="134" rx="11" ry="8" />
                <ellipse cx="98" cy="134" rx="11" ry="8" />
              </g>
            )}

            {/* Sporty Bandana */}
            {!isResting && (
              <path
                d="M 64 96 Q 80 114 96 96 Q 88 120 80 122 Q 72 120 64 96 Z"
                fill="url(#bandanaEmerald)"
                stroke="#059669"
                strokeWidth="1.8"
              />
            )}
          </g>
        )}

        {/* ================= 2. MOCHI THE ZEN ORANGE CAT ================= */}
        {/* ================= 2. MOCHI THE ATHLETIC FITNESS DOG ================= */}
        {currentSpecies === 'mochi' && (
          <g className="pet-species-mochi">
            {/* Wagging Fluffy Brown Dog Tail */}
            {!isResting && (
              <path
                d="M 124 105 C 150 115 158 85 146 68 C 138 58 126 72 134 84 C 140 94 134 102 120 102"
                fill="#9A5323"
                stroke="#6D3311"
                strokeWidth="2.8"
                strokeLinecap="round"
                style={{
                  transformOrigin: '120px 105px',
                  animation: isCheering ? 'wagFast 0.28s infinite alternate' : 'wagSlow 2s infinite alternate ease-in-out'
                }}
              />
            )}

            {/* Left Big Floppy Brown Dog Ear */}
            <path
              d={isResting ? "M 48 58 C 24 64 20 95 38 100 C 48 95 52 74 54 58 Z" : "M 48 54 C 20 58 18 96 36 102 C 48 98 52 72 54 54 Z"}
              fill="#8A481E"
              stroke="#6D3311"
              strokeWidth="2.5"
            />
            <path
              d="M 44 64 C 28 70 28 88 38 94 C 44 90 46 76 48 64 Z"
              fill="#A25927"
            />

            {/* Right Big Floppy Brown Dog Ear */}
            <path
              d={isResting ? "M 112 58 C 136 64 140 95 122 100 C 112 95 108 74 106 58 Z" : "M 112 54 C 140 58 142 96 124 102 C 112 98 108 72 106 54 Z"}
              fill="#8A481E"
              stroke="#6D3311"
              strokeWidth="2.5"
            />
            <path
              d="M 116 64 C 132 70 132 88 122 94 C 116 90 114 76 112 64 Z"
              fill="#A25927"
            />

            {/* Main Caramel Dog Head */}
            <ellipse
              cx="80"
              cy="68"
              rx="38"
              ry="32"
              fill="#B4652B"
              stroke="#6D3311"
              strokeWidth="2.8"
            />

            {/* White Muzzle & Chest Flare */}
            <path
              d="M 60 72 C 60 62 70 58 80 58 C 90 58 100 62 100 72 C 100 84 92 90 80 90 C 68 90 60 84 60 72 Z"
              fill="#FFFFFF"
            />

            {/* Cute Black Dog Nose */}
            <path
              d="M 75 68 C 75 65 77 64 80 64 C 83 64 85 65 85 68 C 85 73 80 75 80 75 C 80 75 75 73 75 68 Z"
              fill="#1E293B"
            />

            {/* Mouth & Tongue */}
            {isCheering ? (
              <g>
                <path d="M 74 76 Q 80 84 86 76" stroke="#6D3311" strokeWidth="2.5" fill="none" />
                <path d="M 76 78 Q 80 87 84 78 Z" fill="#FB7185" />
              </g>
            ) : isResting ? (
              <path d="M 76 76 Q 80 80 84 76" stroke="#6D3311" strokeWidth="2" fill="none" />
            ) : (
              <g>
                <path d="M 74 75 Q 80 82 86 75" stroke="#6D3311" strokeWidth="2.2" fill="none" />
                <path d="M 77 78 Q 80 84 83 78 Z" fill="#FB7185" />
              </g>
            )}

            {/* Eyes */}
            {isResting ? (
              <g stroke="#451A03" strokeWidth="3" strokeLinecap="round" fill="none">
                <path d="M 62 62 Q 68 66 74 62" />
                <path d="M 86 62 Q 92 66 98 62" />
              </g>
            ) : isCheering ? (
              <g stroke="#451A03" strokeWidth="3.2" strokeLinecap="round" fill="none">
                <path d="M 62 64 Q 68 56 74 64" />
                <path d="M 86 64 Q 92 56 98 64" />
              </g>
            ) : (
              <g>
                <circle cx="68" cy="62" r="5.5" fill="#1E293B" />
                <circle cx="66" cy="60" r="2" fill="#FFFFFF" />
                <circle cx="92" cy="62" r="5.5" fill="#1E293B" />
                <circle cx="90" cy="60" r="2" fill="#FFFFFF" />
              </g>
            )}

            {/* Cute Rosy Cheeks */}
            <circle cx="56" cy="74" r="5" fill="#F472B6" opacity="0.4" />
            <circle cx="104" cy="74" r="5" fill="#F472B6" opacity="0.4" />

            {/* Athletic Sportswear Shirt (Orange with Teal Collar & White Trim) */}
            <path
              d="M 52 92 L 62 90 L 80 92 L 98 90 L 108 92 L 106 122 L 54 122 Z"
              fill="#F97316"
              stroke="#EA580C"
              strokeWidth="2.5"
            />
            {/* Teal Collar Band */}
            <path
              d="M 62 90 Q 80 96 98 90"
              stroke="#14B8A6"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
            />
            {/* White Athletic Center Stripe */}
            <rect x="77" y="94" width="6" height="28" fill="#FFFFFF" />

            {/* Teal Athletic Shorts */}
            <path
              d="M 54 122 L 106 122 L 108 136 L 82 136 L 80 128 L 78 136 L 52 136 Z"
              fill="#0D9488"
              stroke="#042F2E"
              strokeWidth="2"
            />
            {/* White Trim on Shorts */}
            <line x1="53" y1="135" x2="77" y2="135" stroke="#FFFFFF" strokeWidth="2" />
            <line x1="83" y1="135" x2="107" y2="135" stroke="#FFFFFF" strokeWidth="2" />

            {/* Athletic Arms with Wristbands & Sneakers */}
            {isCheering ? (
              <g>
                {/* Left Arm Raised High */}
                <path d="M 54 94 Q 34 80 32 60" stroke="#B4652B" strokeWidth="9" strokeLinecap="round" fill="none" />
                <rect x="28" y="64" width="8" height="6" rx="2" fill="#FFFFFF" stroke="#0D9488" strokeWidth="1.5" />
                <circle cx="32" cy="58" r="5.5" fill="#B4652B" />

                {/* Right Arm Raised High */}
                <path d="M 106 94 Q 126 80 128 60" stroke="#B4652B" strokeWidth="9" strokeLinecap="round" fill="none" />
                <rect x="124" y="64" width="8" height="6" rx="2" fill="#FFFFFF" stroke="#0D9488" strokeWidth="1.5" />
                <circle cx="128" cy="58" r="5.5" fill="#B4652B" />

                {/* Confetti / Celebration Sparkles around Mochi */}
                <polygon points="25,40 28,46 34,47 29,51 31,57 25,53 19,57 21,51 16,47 22,46" fill="#FACC15" />
                <polygon points="135,38 138,44 144,45 139,49 141,55 135,51 129,55 131,49 126,45 132,44" fill="#38BDF8" />
                <circle cx="78" cy="24" r="3" fill="#F43F5E" />
                <circle cx="86" cy="20" r="2.5" fill="#10B981" />
              </g>
            ) : (
              <g>
                {/* Left Arm Resting at side */}
                <path d="M 54 96 Q 42 108 44 118" stroke="#B4652B" strokeWidth="9" strokeLinecap="round" fill="none" />
                <rect x="40" y="112" width="8" height="5" rx="2" fill="#FFFFFF" stroke="#0D9488" strokeWidth="1.2" />
                <circle cx="44" cy="120" r="5" fill="#B4652B" />

                {/* Right Arm Resting at side */}
                <path d="M 106 96 Q 118 108 116 118" stroke="#B4652B" strokeWidth="9" strokeLinecap="round" fill="none" />
                <rect x="112" y="112" width="8" height="5" rx="2" fill="#FFFFFF" stroke="#0D9488" strokeWidth="1.2" />
                <circle cx="116" cy="120" r="5" fill="#B4652B" />
              </g>
            )}

            {/* Sporty Shoes / Sneakers */}
            <g>
              {/* Left Shoe */}
              <ellipse cx="66" cy="142" rx="10" ry="6" fill="#EA580C" stroke="#9A3412" strokeWidth="1.5" />
              <path d="M 56 142 L 76 142" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
              {/* Right Shoe */}
              <ellipse cx="94" cy="142" rx="10" ry="6" fill="#EA580C" stroke="#9A3412" strokeWidth="1.5" />
              <path d="M 84 142 L 104 142" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          </g>
        )}

        {/* ================= 3. LULU THE CHEERFUL SHIBA INU ================= */}
        {currentSpecies === 'lulu' && (
          <g className="pet-species-lulu">
            {/* Curly Shiba Donut Tail */}
            {!isResting && (
              <path
                d="M 124 105 C 145 105 158 88 152 74 C 145 62 130 68 135 82 C 138 90 148 88 145 80"
                fill="url(#luluBodyGlow)"
                stroke="#B45309"
                strokeWidth="3.2"
                strokeLinecap="round"
                style={{
                  transformOrigin: '124px 105px',
                  animation: isCheering ? 'wagFast 0.3s infinite alternate' : 'wagSlow 1.8s infinite alternate ease-in-out'
                }}
              />
            )}

            {/* Alert Shiba Ears with White Fluff */}
            <path
              d={isResting ? "M 42 66 Q 22 72 26 88 Q 42 86 46 72 Z" : "M 48 60 L 34 26 Q 56 32 62 52 Z"}
              fill="url(#luluBodyGlow)"
              stroke="#B45309"
              strokeWidth="2.8"
            />
            <path
              d={isResting ? "M 38 72 Q 28 78 30 84 Q 40 82 42 74 Z" : "M 46 52 L 38 34 Q 50 38 54 48 Z"}
              fill="#FFFBEB"
            />

            <path
              d={isResting ? "M 118 66 Q 138 72 134 88 Q 118 86 114 72 Z" : "M 112 60 L 126 26 Q 104 32 98 52 Z"}
              fill="url(#luluBodyGlow)"
              stroke="#B45309"
              strokeWidth="2.8"
            />
            <path
              d={isResting ? "M 122 72 Q 132 78 130 84 Q 120 82 118 74 Z" : "M 114 52 L 122 34 Q 110 38 106 48 Z"}
              fill="#FFFBEB"
            />

            {/* Main Shiba Body */}
            <ellipse
              cx="80"
              cy={isResting ? "108" : "96"}
              rx={isResting ? "52" : "46"}
              ry={isResting ? "36" : "42"}
              fill="url(#luluBodyGlow)"
              stroke="#B45309"
              strokeWidth="3"
              filter={`url(#softGlow-${currentSpecies})`}
              style={{
                animation: isCheering ? 'bounceBody 0.45s infinite alternate' : 'breatheBody 2.7s infinite ease-in-out'
              }}
            />

            {/* White Shiba Muzzle & Cheek Mask */}
            <path
              d="M 52 86 C 50 106 70 114 80 114 C 90 114 110 106 108 86 C 100 80 90 76 80 76 C 70 76 60 80 52 86 Z"
              fill="#FFFBEB"
              stroke="#B45309"
              strokeWidth="2"
            />

            {/* Signature Shiba White Dot Eyebrows (Maromayu) */}
            <circle cx="64" cy="62" r="4" fill="#FFFBEB" />
            <circle cx="96" cy="62" r="4" fill="#FFFBEB" />

            {/* Workout Sweatband if exercising */}
            {isExercising && (
              <g>
                <rect x="42" y="48" width="76" height="12" rx="6" fill="url(#bandanaMint)" stroke="#0891B2" strokeWidth="2" />
                <line x1="46" y1="54" x2="114" y2="54" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="4 4" />
              </g>
            )}

            {/* Eyes */}
            {isResting ? (
              <g stroke="#451A03" strokeWidth="3.5" strokeLinecap="round">
                <path d="M 58 74 Q 66 80 74 74" />
                <path d="M 86 74 Q 94 80 102 74" />
              </g>
            ) : isCheering ? (
              <g stroke="#451A03" strokeWidth="3.8" strokeLinecap="round" fill="none">
                <path d="M 58 74 Q 66 64 74 74" />
                <path d="M 86 74 Q 94 64 102 74" />
              </g>
            ) : (
              <g>
                <circle cx="65" cy="73" r="6.5" fill="#451A03" />
                <circle cx="63.5" cy="71" r="2.5" fill="#FFFFFF" />
                <circle cx="95" cy="73" r="6.5" fill="#451A03" />
                <circle cx="93.5" cy="71" r="2.5" fill="#FFFFFF" />
              </g>
            )}

            {/* Rosy Cheeks */}
            <circle cx="50" cy="85" r="7" fill="#F87171" opacity="0.5" />
            <circle cx="110" cy="85" r="7" fill="#F87171" opacity="0.5" />

            {/* Black Shiba Gumdrop Nose */}
            <path d="M 76 83 Q 80 79 84 83 Q 80 88 76 83 Z" fill="#1C1917" />

            {/* Open Mouth Tongue / Happy Smile */}
            {isCheering ? (
              <g>
                <path d="M 74 88 Q 80 98 86 88" stroke="#451A03" strokeWidth="2.5" fill="#F43F5E" />
                <path d="M 77 93 Q 80 97 83 93" fill="#FDA4AF" />
              </g>
            ) : (
              <path d="M 74 88 Q 80 94 86 88" stroke="#451A03" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            )}

            {/* Mint Green Bandana Scarf */}
            {!isResting && (
              <path
                d="M 62 100 Q 80 118 98 100 Q 90 124 80 126 Q 70 124 62 100 Z"
                fill="url(#bandanaMint)"
                stroke="#0891B2"
                strokeWidth="2"
              />
            )}

            {/* Paws */}
            {isCheering ? (
              <g fill="#FFFBEB" stroke="#B45309" strokeWidth="2.5">
                <ellipse cx="38" cy="65" rx="10" ry="8" transform="rotate(-28 38 65)" />
                <ellipse cx="122" cy="65" rx="10" ry="8" transform="rotate(28 122 65)" />
              </g>
            ) : (
              <g fill="#FFFBEB" stroke="#B45309" strokeWidth="2.5">
                <ellipse cx="62" cy="134" rx="11" ry="8" />
                <ellipse cx="98" cy="134" rx="11" ry="8" />
              </g>
            )}
          </g>
        )}

        {/* ================= 4. BUBU THE MINDFUL PANDA ================= */}
        {currentSpecies === 'bubu' && (
          <g className="pet-species-bubu">
            {/* Round Fuzzy Panda Ears */}
            <circle
              cx={isResting ? "40" : "42"}
              cy={isResting ? "66" : "50"}
              r="17"
              fill="url(#bubuDarkGlow)"
              stroke="#0F172A"
              strokeWidth="2.5"
            />
            <circle
              cx={isResting ? "120" : "118"}
              cy={isResting ? "66" : "50"}
              r="17"
              fill="url(#bubuDarkGlow)"
              stroke="#0F172A"
              strokeWidth="2.5"
            />

            {/* Main Round Panda Body */}
            <ellipse
              cx="80"
              cy={isResting ? "108" : "96"}
              rx={isResting ? "55" : "48"}
              ry={isResting ? "38" : "45"}
              fill="url(#bubuBodyGlow)"
              stroke="#0F172A"
              strokeWidth="3"
              filter={`url(#softGlow-${currentSpecies})`}
              style={{
                animation: isCheering ? 'bounceBody 0.45s infinite alternate' : 'breatheBody 3s infinite ease-in-out'
              }}
            />

            {/* Bamboo leaf accessory tucked near ear */}
            {!isExercising && (
              <path
                d="M 125 44 C 138 34 148 42 144 50 C 136 50 128 48 125 44 Z"
                fill="#10B981"
                stroke="#047857"
                strokeWidth="1.5"
              />
            )}

            {/* Distinctive Dark Panda Eye Patches */}
            <ellipse cx="62" cy="76" rx="11" ry="13" transform="rotate(-18 62 76)" fill="#1E293B" />
            <ellipse cx="98" cy="76" rx="11" ry="13" transform="rotate(18 98 76)" fill="#1E293B" />

            {/* Workout Sweatband if exercising */}
            {isExercising && (
              <g>
                <rect x="42" y="44" width="76" height="13" rx="6.5" fill="url(#scarfRed)" stroke="#B91C1C" strokeWidth="2" />
                <line x1="46" y1="50.5" x2="114" y2="50.5" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="4 4" />
              </g>
            )}

            {/* Eyes inside Eye Patches */}
            {isResting ? (
              <g stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round">
                <path d="M 56 77 Q 62 82 68 77" />
                <path d="M 92 77 Q 98 82 104 77" />
              </g>
            ) : isCheering ? (
              <g stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" fill="none">
                <path d="M 56 77 Q 62 68 68 77" />
                <path d="M 92 77 Q 98 68 104 77" />
              </g>
            ) : (
              <g>
                <circle cx="63" cy="75" r="5" fill="#FFFFFF" />
                <circle cx="63.5" cy="75" r="3.2" fill="#0F172A" />
                <circle cx="62" cy="73.5" r="1.5" fill="#FFFFFF" />

                <circle cx="97" cy="75" r="5" fill="#FFFFFF" />
                <circle cx="96.5" cy="75" r="3.2" fill="#0F172A" />
                <circle cx="95" cy="73.5" r="1.5" fill="#FFFFFF" />
              </g>
            )}

            {/* Cute Rosy Cheeks */}
            <circle cx="48" cy="88" r="7" fill="#F472B6" opacity="0.4" />
            <circle cx="112" cy="88" r="7" fill="#F472B6" opacity="0.4" />

            {/* Panda Snout & Black Button Nose */}
            <ellipse cx="80" cy="86" rx="14" ry="10" fill="#F8FAFC" />
            <ellipse cx="80" cy="83" rx="5" ry="3.5" fill="#0F172A" />

            {/* Peaceful Smile */}
            <path
              d="M 75 89 Q 80 94 85 89"
              stroke="#0F172A"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Cozy Red Scarf */}
            {!isResting && (
              <g>
                <rect x="54" y="98" width="52" height="12" rx="6" fill="url(#scarfRed)" stroke="#B91C1C" strokeWidth="1.8" />
                <path d="M 92 104 L 98 126 L 86 126 Z" fill="url(#scarfRed)" stroke="#B91C1C" strokeWidth="1.5" />
              </g>
            )}

            {/* Black Panda Paws */}
            {isCheering ? (
              <g fill="url(#bubuDarkGlow)" stroke="#0F172A" strokeWidth="2.5">
                <ellipse cx="36" cy="65" rx="11" ry="9" transform="rotate(-25 36 65)" />
                <ellipse cx="124" cy="65" rx="11" ry="9" transform="rotate(25 124 65)" />
              </g>
            ) : isResting ? (
              <g fill="url(#bubuDarkGlow)" stroke="#0F172A" strokeWidth="2">
                <ellipse cx="58" cy="132" rx="13" ry="8" />
                <ellipse cx="102" cy="132" rx="13" ry="8" />
              </g>
            ) : (
              <g fill="url(#bubuDarkGlow)" stroke="#0F172A" strokeWidth="2.5">
                <ellipse cx="60" cy="134" rx="12" ry="9" />
                <ellipse cx="100" cy="134" rx="12" ry="9" />
              </g>
            )}
          </g>
        )}

        {/* Celebration Particles (When Cheering) */}
        {isCheering && (
          <g fill={speciesInfo.themeColor || '#F59E0B'}>
            <polygon points="28,45 31,52 38,53 33,58 34,65 28,61 22,65 23,58 18,53 25,52" />
            <polygon points="137,40 139,45 144,46 140,50 141,55 137,52 133,55 134,50 130,46 135,45" />
            <circle cx="80" cy="26" r="3.5" fill="#10B981" />
            <circle cx="36" cy="30" r="2.5" fill="#F43F5E" />
            <circle cx="124" cy="28" r="2.5" fill="#3B82F6" />
          </g>
        )}

        {/* Peaceful Zzz Floating text (When Resting) */}
        {isResting && (
          <g fill="#64748B" fontWeight="800" fontSize="16" fontFamily="sans-serif">
            <text x="125" y="65" opacity="0.8">z</text>
            <text x="135" y="50" opacity="0.6">Z</text>
            <text x="145" y="32" opacity="0.4">Z</text>
          </g>
        )}
      </svg>

      <style>{`
        @keyframes wagSlow {
          0% { transform: rotate(-6deg); }
          100% { transform: rotate(16deg); }
        }
        @keyframes wagFast {
          0% { transform: rotate(-22deg); }
          100% { transform: rotate(30deg); }
        }
        @keyframes bounceBody {
          0% { transform: translateY(0); }
          100% { transform: translateY(-7px); }
        }
        @keyframes breatheBody {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02) translateY(-2px); }
        }
      `}</style>
    </div>
  );
};

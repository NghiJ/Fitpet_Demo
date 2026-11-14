import React from 'react';
import { Flame, Heart, ShieldCheck, Award, Sprout, Coins } from 'lucide-react';

export const TopNav = ({
  theme,
  onToggleTheme,
  isVoiceMuted,
  onToggleVoice,
  onBrandClick,
  currentUser,
  onUserIconClick,
  onSwitchToAdmin,
  onSwitchToCoach,
  onOpenSubscription,
  onOpenRoleLogin,
  activeTab = 'home'
}) => {
  return (
    <header className="site-header" style={{ borderBottom: 'none', padding: '10px 0 4px 0' }}>
      <div className="app-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          {/* Left Brand Capsule: Plant icon + Hôm Nay / FitPet */}
          <button
            onClick={onBrandClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FFFFFF',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(220, 238, 230, 0.9)',
              boxShadow: '0 2px 8px rgba(19, 62, 53, 0.05)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease'
            }}
            title="Về trang chủ"
          >
            <div style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              backgroundColor: '#D1FAE5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#059669'
            }}>
              <Sprout size={14} />
            </div>
            <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#133E35' }}>
              {activeTab === 'library' ? 'FitPet' : 'Hôm Nay'}
            </span>
          </button>

          {/* Right Status Capsules: 5d Streak, 48 xu, Profile Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Streak Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: '#FFEAE1',
                border: '1px solid #FFD5C2',
                borderRadius: 'var(--radius-full)',
                padding: '4px 10px',
                fontSize: '0.78rem',
                fontWeight: 800,
                color: '#EA580C'
              }}
              title="Chuỗi hoạt động liên tiếp 5 ngày"
            >
              <Heart size={13} fill="#EA580C" color="#EA580C" />
              <span>5d</span>
            </div>

            {/* Coin Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: '#F1F5F9',
                border: '1px solid #E2E8F0',
                borderRadius: 'var(--radius-full)',
                padding: '4px 10px',
                fontSize: '0.78rem',
                fontWeight: 800,
                color: '#475569'
              }}
              title="Ví Xu FitPet: 48 xu"
            >
              <div style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontSize: '9px',
                fontWeight: 900
              }}>
                🪙
              </div>
              <span>48 xu</span>
            </div>

            {/* Quick Admin Portal Access Pill */}
            <button
              onClick={onSwitchToAdmin}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: '#FEDFD2',
                border: '1px solid #FDCBB7',
                borderRadius: 'var(--radius-full)',
                padding: '4px 9px',
                fontSize: '0.74rem',
                fontWeight: 800,
                color: '#8A4828',
                cursor: 'pointer',
                height: '28px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                transition: 'all 0.15s ease'
              }}
              title="Mở Bảng Điều Khiển Quản Trị Viên (Admin Portal)"
            >
              <ShieldCheck size={13} color="#F78C25" />
              <span>Admin</span>
            </button>

            {currentUser?.role === 'coach' && (
              <button
                onClick={onSwitchToCoach}
                style={{
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: '#8B5CF6',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  height: '28px'
                }}
              >
                <Award size={13} />
                <span>Coach</span>
              </button>
            )}

            {/* User Profile Avatar with glowing green ring */}
            <button
              onClick={onUserIconClick}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                border: '2.5px solid #10B981',
                padding: '1px',
                backgroundColor: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)',
                transition: 'transform 0.2s ease',
                overflow: 'hidden',
                flexShrink: 0
              }}
              title={currentUser ? `${currentUser.name} (${currentUser.role})` : "Tài khoản của bạn"}
            >
              <img
                src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                alt="Avatar"
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

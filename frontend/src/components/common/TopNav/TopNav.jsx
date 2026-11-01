import React from 'react';
import { Volume2, VolumeX, Moon, Sun, Heart, User, ShieldCheck, Sparkles, Crown, Star, Award, LogIn, Clock, Stethoscope } from 'lucide-react';

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
  onOpenReminders,
  onOpenConsultation
}) => {
  return (
    <header className="site-header">
      <div className="app-container">
        <div className="site-header-inner">
          {/* Brand Logo & Name */}
          <button
            onClick={onBrandClick}
            className="brand-badge"
            style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0, flexShrink: 0 }}
            aria-label="Về trang chủ FitPet"
          >
            <div className="brand-icon-wrap">
              <Heart size={18} fill="#FFFFFF" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div className="brand-title">FitPet</div>
              <div className="brand-tagline">Vận Động Cùng Pip</div>
            </div>
          </button>

          {/* Quick Action Controls */}
          <div className="header-actions">
            {/* Dedicated Role Portal Badges (Admin / Coach) */}
            {currentUser?.role === 'admin' ? (
              <button
                onClick={onSwitchToAdmin}
                className="btn-primary"
                style={{
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: '#F59E0B',
                  borderColor: '#F59E0B',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  height: '30px'
                }}
                title="Mở Bảng Điều Khiển Quản Trị Viên"
              >
                <ShieldCheck size={14} />
                <span className="hide-mobile-sm">Admin</span>
              </button>
            ) : currentUser?.role === 'coach' ? (
              <button
                onClick={onSwitchToCoach}
                className="btn-primary"
                style={{
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: '#8B5CF6',
                  borderColor: '#8B5CF6',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  height: '30px'
                }}
                title="Mở Bảng Điều Khiển Huấn Luyện Viên"
              >
                <Award size={14} />
                <span className="hide-mobile-sm">Coach</span>
              </button>
            ) : null}

            {/* Quick Switch Role / Login Button */}
            <button
              onClick={onOpenRoleLogin}
              className="btn-ghost"
              style={{
                padding: '4px 8px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-border)',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--color-text-secondary)',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
              title="Đăng nhập hoặc chuyển đổi vai trò (Hội viên / HLV / Admin)"
            >
              <LogIn size={13} />
              <span className="hide-mobile-sm">Vai Trò</span>
            </button>

            {/* Subscription Upgrade / Plan Badge */}
            {currentUser?.plan === 'vip' ? (
              <button
                onClick={onOpenSubscription}
                className="btn-ghost"
                style={{
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid #F59E0B',
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  color: '#F59E0B',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  height: '30px'
                }}
                title="Gói VIP Trọn Đời - Nhấn để xem quyền lợi"
              >
                <Crown size={13} /> VIP
              </button>
            ) : currentUser?.plan === 'plus' ? (
              <button
                onClick={onOpenSubscription}
                className="btn-ghost"
                style={{
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--color-accent)',
                  backgroundColor: 'rgba(255, 107, 74, 0.1)',
                  color: 'var(--color-accent)',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  height: '30px'
                }}
                title="Gói FitPet Plus - Nhấn để xem quyền lợi"
              >
                <Star size={13} /> PLUS
              </button>
            ) : (
              <button
                onClick={onOpenSubscription}
                className="btn-primary"
                style={{
                  padding: '4px 9px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  height: '30px',
                  minHeight: 'unset',
                  gap: '3px',
                  backgroundColor: 'var(--color-accent)',
                  borderColor: 'var(--color-accent)'
                }}
                title="Nâng cấp gói hội viên VIP"
              >
                <Sparkles size={13} />
                <span className="hide-mobile-sm">Gói VIP</span>
              </button>
            )}

            {/* Desktop Only Shortcuts: Stethoscope & Desk Clock */}
            {onOpenConsultation && (
              <button
                className="icon-btn desktop-only"
                onClick={onOpenConsultation}
                title="Tư vấn phác đồ cùng HLV & AI"
                aria-label="Tư vấn HLV"
                style={{ color: '#8B5CF6' }}
              >
                <Stethoscope size={18} />
              </button>
            )}

            {onOpenReminders && (
              <button
                className="icon-btn desktop-only"
                onClick={onOpenReminders}
                title="Đồng hồ nhắc nhở Pomodoro văn phòng"
                aria-label="Nhắc nhở Pomodoro"
                style={{ color: 'var(--color-brand-primary)' }}
              >
                <Clock size={18} />
              </button>
            )}

            {/* Quick Voice Companion Mute/Unmute */}
            <button
              className={`icon-btn ${!isVoiceMuted ? 'active' : ''}`}
              onClick={onToggleVoice}
              title={isVoiceMuted ? 'Bật giọng nói AI hướng dẫn' : 'Tắt tiếng AI hướng dẫn'}
              aria-label={isVoiceMuted ? 'Bật giọng nói AI hướng dẫn' : 'Tắt tiếng AI hướng dẫn'}
            >
              {isVoiceMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            {/* Light / Dark Mode Toggle */}
            <button
              className="icon-btn"
              onClick={onToggleTheme}
              title={theme === 'dark' ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối'}
              aria-label={theme === 'dark' ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối'}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* User Profile Avatar Entry */}
            <button
              className="icon-btn"
              onClick={onUserIconClick}
              title={currentUser?.isGuest ? 'Đăng nhập / Hồ sơ cá nhân' : `Tài khoản: ${currentUser?.name}`}
              aria-label="Hồ sơ cá nhân"
              style={{
                backgroundColor: currentUser?.isGuest ? 'var(--color-surface)' : 'var(--color-brand-light)',
                borderColor: currentUser?.isGuest ? 'var(--color-border)' : 'var(--color-brand-primary)'
              }}
            >
              {currentUser?.avatarEmoji ? (
                <span style={{ fontSize: '1rem' }}>{currentUser.avatarEmoji}</span>
              ) : (
                <User size={16} />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

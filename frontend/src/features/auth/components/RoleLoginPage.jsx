import React, { useState } from 'react';
import { 
  User, ShieldCheck, Award, Heart, Lock, Mail, ArrowRight, 
  Sparkles, CheckCircle2, AlertCircle, Eye, EyeOff, X
} from 'lucide-react';
import { authService } from '../services/authService';
import { soundService } from '../../workout/services/soundService';

/**
 * RoleLoginPage Component
 * Giao diện đăng nhập phân quyền đa vai trò với thiết kế tối giản, trực quan, hạn chế chữ rườm rà.
 */
export const RoleLoginPage = ({
  onLoginSuccess,
  onClose,
  initialRole = 'user'
}) => {
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const demoAccounts = authService.getDemoAccounts();

  // Role Theme Specs with streamlined, concise copy
  const roleConfigs = {
    user: {
      key: 'user',
      title: 'Hội Viên (Member)',
      shortTitle: 'Hội Viên',
      tagline: 'Vận động vi mô 3p, Pomodoro bàn làm việc, thử thách cộng đồng & phác đồ riêng',
      color: '#10B981',
      bgLight: 'rgba(16, 185, 129, 0.08)',
      borderColor: 'rgba(16, 185, 129, 0.3)',
      icon: <User size={16} />,
      defaultEmail: 'thuha.tran@example.com',
      demoUser: demoAccounts.user
    },
    coach: {
      key: 'coach',
      title: 'Huấn Luyện Viên (Coach)',
      shortTitle: 'HLV Coach',
      tagline: 'Kê đơn phác đồ học viên, lịch tham vấn 1-1, kiểm định an toàn & phân tích tư thế AI',
      color: '#8B5CF6',
      bgLight: 'rgba(139, 92, 246, 0.08)',
      borderColor: 'rgba(139, 92, 246, 0.3)',
      icon: <Award size={16} />,
      defaultEmail: 'phuonganh.pt@gmail.com',
      demoUser: demoAccounts.coach
    },
    admin: {
      key: 'admin',
      title: 'Quản Trị Viên (Admin)',
      shortTitle: 'Admin',
      tagline: 'Tổng quan điều hành, người dùng, doanh thu & thuê bao, đội ngũ HLV & hiệu chuẩn AI',
      color: '#F59E0B',
      bgLight: 'rgba(245, 158, 11, 0.08)',
      borderColor: 'rgba(245, 158, 11, 0.3)',
      icon: <ShieldCheck size={16} />,
      defaultEmail: 'tuan.nguyen@example.com',
      demoUser: demoAccounts.admin
    }
  };

  const currentConfig = roleConfigs[selectedRole];

  // Handle Role Switch
  const handleSelectRole = (roleKey) => {
    setSelectedRole(roleKey);
    setErrorMessage('');
    setEmail(roleConfigs[roleKey].defaultEmail);
    setPassword('fitpet2026');
  };

  // Submit standard login form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const user = await authService.login(email, password);
      soundService.playTone(587.33, 'sine', 0.15);
      onLoginSuccess(user);
    } catch (err) {
      setErrorMessage(err.message || 'Email hoặc mật khẩu không chính xác.');
    } finally {
      setIsLoading(false);
    }
  };

  // 1-Click Instant Demo Login
  const handleQuickDemoLogin = (roleKey) => {
    setIsLoading(true);
    setTimeout(() => {
      const user = authService.loginAsRole(roleKey);
      soundService.playVictory();
      setIsLoading(false);
      onLoginSuccess(user);
    }, 300);
  };

  // Continue as Guest (Member only)
  const handleGuestContinue = () => {
    const guest = authService.logout();
    onLoginSuccess(guest);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      position: 'relative'
    }}>
      {/* Background ambient glow matching current role */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '450px',
        height: '320px',
        backgroundColor: currentConfig.color,
        opacity: 0.07,
        filter: 'blur(90px)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      <div className="card" style={{
        maxWidth: '460px',
        width: '100%',
        padding: '22px 16px',
        borderRadius: 'var(--radius-xl)',
        border: `1.5px solid ${currentConfig.borderColor}`,
        boxShadow: '0 16px 36px rgba(0,0,0,0.08)',
        position: 'relative',
        zIndex: 1,
        boxSizing: 'border-box'
      }}>
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: currentConfig.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <Heart size={16} fill="#FFFFFF" />
            </div>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 900, lineHeight: 1 }}>FitPet</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Cổng Đăng Nhập</div>
            </div>
          </div>

          {onClose && (
            <button onClick={onClose} className="icon-btn" title="Đóng cửa sổ">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Role Selector Segmented Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '4px',
          padding: '4px',
          backgroundColor: 'var(--color-surface-subtle)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          marginBottom: '14px'
        }}>
          {Object.values(roleConfigs).map(cfg => {
            const isSelected = selectedRole === cfg.key;
            return (
              <button
                key={cfg.key}
                type="button"
                onClick={() => handleSelectRole(cfg.key)}
                style={{
                  padding: '7px 2px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  backgroundColor: isSelected ? 'var(--color-surface)' : 'transparent',
                  color: isSelected ? cfg.color : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                  transition: 'all var(--transition-fast)',
                  whiteSpace: 'nowrap'
                }}
              >
                {cfg.icon}
                <span>{cfg.shortTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Single-line role tagline badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          fontSize: '0.78rem',
          color: currentConfig.color,
          fontWeight: 600,
          marginBottom: '18px',
          padding: '4px 10px',
          backgroundColor: currentConfig.bgLight,
          borderRadius: 'var(--radius-full)',
          width: 'fit-content',
          margin: '0 auto 18px auto'
        }}>
          <Sparkles size={12} />
          <span>{currentConfig.tagline}</span>
        </div>

        {/* Error Notice */}
        {errorMessage && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #EF4444',
            borderRadius: 'var(--radius-md)',
            color: '#DC2626',
            fontSize: '0.82rem',
            marginBottom: '14px'
          }}>
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1-Click Demo Login Pill */}
        <div style={{ marginBottom: '16px' }}>
          <button
            type="button"
            onClick={() => handleQuickDemoLogin(selectedRole)}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 'var(--radius-lg)',
              border: `1.5px solid ${currentConfig.color}`,
              backgroundColor: currentConfig.bgLight,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all var(--transition-fast)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.25rem' }}>{currentConfig.demoUser.account.avatarEmoji}</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                  Demo: {currentConfig.demoUser.account.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                  {currentConfig.demoUser.account.email}
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: currentConfig.color
            }}>
              <span>Vào nhanh</span>
              <ArrowRight size={13} />
            </div>
          </button>
        </div>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          margin: '14px 0',
          color: 'var(--color-text-muted)',
          fontSize: '0.74rem',
          fontWeight: 600
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }} />
          <span>hoặc nhập tài khoản</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }} />
        </div>

        {/* Standard Email & Password Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email đăng nhập"
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                  fontSize: '16px'
                }}
              />
            </div>
          </div>

          <div>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mật khẩu"
                style={{
                  width: '100%',
                  padding: '10px 36px 10px 36px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                  fontSize: '16px'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
            style={{
              width: '100%',
              justifyContent: 'center',
              backgroundColor: currentConfig.color,
              borderColor: currentConfig.color,
              marginTop: '4px',
              padding: '10px'
            }}
          >
            {isLoading ? 'Đang xác thực...' : 'Đăng Nhập'}
            <ArrowRight size={15} />
          </button>
        </form>

        {/* Guest Continue for Member */}
        {selectedRole === 'user' && (
          <div style={{ textAlign: 'center', marginTop: '14px' }}>
            <button
              type="button"
              onClick={handleGuestContinue}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Dùng thử chế độ Khách
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleLoginPage;

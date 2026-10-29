import React, { useState } from 'react';
import { 
  User, ShieldCheck, Award, Heart, Lock, Mail, ArrowRight, 
  Sparkles, CheckCircle2, AlertCircle, Eye, EyeOff, X, ArrowLeft
} from 'lucide-react';
import { authService } from '../services/authService';
import { soundService } from '../../workout/services/soundService';

/**
 * RoleLoginPage Component
 * Màn hình đăng nhập đa vai trò (Multi-Role Authentication Portal).
 * Phân chia rõ ràng 3 phân hệ:
 * 1. 🏃 Hội Viên (Member): Chuyển hướng trực tiếp vào ứng dụng tập luyện FitPet
 * 2. 🧘 Huấn Luyện Viên (Coach): Chuyển hướng trực tiếp vào Coach Workspace chuyên biệt
 * 3. 🛡️ Quản Trị Viên (Admin): Chuyển hướng trực tiếp vào Admin Control Center
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

  // Role Theme Specs
  const roleConfigs = {
    user: {
      key: 'user',
      title: 'Hội Viên Vận Động',
      subtitle: 'Người dùng rèn luyện thói quen vận động nhẹ nhàng',
      badge: 'MEMBER PORTAL',
      color: '#10B981',
      bgLight: 'rgba(16, 185, 129, 0.08)',
      borderColor: 'rgba(16, 185, 129, 0.3)',
      icon: <User size={22} />,
      destination: 'Giao diện Tập Luyện & Thú Cưng Pip (App Chính)',
      defaultEmail: 'thuha.tran@example.com',
      demoUser: demoAccounts.user
    },
    coach: {
      key: 'coach',
      title: 'Huấn Luyện Viên',
      subtitle: 'Chuyên gia thể hình kiểm duyệt an toàn & kê đơn vùng đau',
      badge: 'COACH WORKSPACE',
      color: '#8B5CF6',
      bgLight: 'rgba(139, 92, 246, 0.08)',
      borderColor: 'rgba(139, 92, 246, 0.3)',
      icon: <Award size={22} />,
      destination: 'Không Gian Quản Lý Chuyên Môn & Học Viên (Coach Portal)',
      defaultEmail: 'phuonganh.pt@gmail.com',
      demoUser: demoAccounts.coach
    },
    admin: {
      key: 'admin',
      title: 'Quản Trị Viên Hệ Thống',
      subtitle: 'Ban điều hành quản lý người dùng, thuê bao & dữ liệu',
      badge: 'ADMIN CONTROL',
      color: '#F59E0B',
      bgLight: 'rgba(245, 158, 11, 0.08)',
      borderColor: 'rgba(245, 158, 11, 0.3)',
      icon: <ShieldCheck size={22} />,
      destination: 'Trung Tâm Điều Hành Quản Trị Tối Cao (Admin Dashboard)',
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
        width: '500px',
        height: '350px',
        backgroundColor: currentConfig.color,
        opacity: 0.08,
        filter: 'blur(100px)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      <div className="card" style={{
        maxWidth: '540px',
        width: '100%',
        padding: '32px',
        borderRadius: 'var(--radius-xl)',
        border: `1.5px solid ${currentConfig.borderColor}`,
        boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Brand & Close */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: currentConfig.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <Heart size={20} fill="#FFFFFF" />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, lineHeight: 1 }}>FitPet</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Cổng Đăng Nhập Phân Quyền</div>
            </div>
          </div>

          {onClose && (
            <button onClick={onClose} className="icon-btn" title="Đóng cửa sổ">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Role Selector Cards / Tabs */}
        <div style={{ marginBottom: '22px' }}>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
            Chọn vai trò đăng nhập của bạn:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {Object.values(roleConfigs).map(cfg => {
              const isSelected = selectedRole === cfg.key;
              return (
                <button
                  key={cfg.key}
                  type="button"
                  onClick={() => handleSelectRole(cfg.key)}
                  style={{
                    padding: '10px 8px',
                    borderRadius: 'var(--radius-lg)',
                    border: isSelected ? `2px solid ${cfg.color}` : '1.5px solid var(--color-border)',
                    backgroundColor: isSelected ? cfg.bgLight : 'var(--color-surface-subtle)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ color: isSelected ? cfg.color : 'var(--color-text-muted)' }}>
                    {cfg.icon}
                  </div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: isSelected ? cfg.color : 'var(--color-text-primary)' }}>
                    {cfg.title.split(' ')[0]}
                  </div>
                  <span style={{
                    fontSize: '0.64rem',
                    fontWeight: 700,
                    color: isSelected ? cfg.color : 'var(--color-text-muted)',
                    textTransform: 'uppercase'
                  }}>
                    {cfg.key}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Role Destination Info Banner */}
        <div style={{
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: currentConfig.bgLight,
          border: `1px solid ${currentConfig.borderColor}`,
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: currentConfig.color,
              color: '#FFFFFF'
            }}>
              {currentConfig.badge}
            </span>
            <span style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
              {currentConfig.title}
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
            {currentConfig.subtitle}
          </div>
          <div style={{
            marginTop: '8px',
            paddingTop: '6px',
            borderTop: '1px dashed var(--color-border-subtle)',
            fontSize: '0.75rem',
            color: currentConfig.color,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <ArrowRight size={13} /> Chuyển hướng: {currentConfig.destination}
          </div>
        </div>

        {/* Error Notice */}
        {errorMessage && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #EF4444',
            borderRadius: 'var(--radius-md)',
            color: '#DC2626',
            fontSize: '0.84rem',
            marginBottom: '16px'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1-Click Instant Demo Login Spotlight (The Easiest & Fastest Experience) */}
        <div style={{
          backgroundColor: 'var(--color-surface-subtle)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          padding: '14px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              ⚡ Trải Nghiệm Nhanh 1-Click
            </span>
            <span style={{ fontSize: '0.72rem', color: currentConfig.color, fontWeight: 700 }}>
              Không cần gõ mật khẩu
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin(selectedRole)}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: `1.5px solid ${currentConfig.color}`,
              backgroundColor: 'var(--color-surface)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all var(--transition-fast)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.4rem' }}>{currentConfig.demoUser.account.avatarEmoji}</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                  {currentConfig.demoUser.account.name}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                  {currentConfig.demoUser.account.email}
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.8rem',
              fontWeight: 800,
              color: currentConfig.color
            }}>
              <span>Vào Ngay</span>
              <ArrowRight size={14} />
            </div>
          </button>
        </div>

        {/* Standard Email & Password Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px', color: 'var(--color-text-secondary)' }}>
              Email Đăng Nhập
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px', color: 'var(--color-text-secondary)' }}>
              Mật Khẩu
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                style={{
                  width: '100%',
                  padding: '9px 38px 9px 36px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                  fontSize: '0.9rem'
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
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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
              marginTop: '6px'
            }}
          >
            {isLoading ? 'Đang xác thực...' : `Đăng Nhập Với Tư Cách ${currentConfig.title}`}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Guest Continue for Member */}
        {selectedRole === 'user' && (
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button
              type="button"
              onClick={handleGuestContinue}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                fontSize: '0.82rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Tiếp tục sử dụng dưới dạng Khách không cần tài khoản
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

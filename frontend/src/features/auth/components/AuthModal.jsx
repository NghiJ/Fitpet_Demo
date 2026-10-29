import React, { useState } from 'react';
import { 
  X, Lock, Mail, User, Eye, EyeOff, ArrowRight, ShieldCheck, 
  CheckCircle2, AlertCircle, Award, Sparkles, Crown 
} from 'lucide-react';
import { authService } from '../services/authService';
import { soundService } from '../../workout/services/soundService';

export const AuthModal = ({ isOpen, onClose, onAuthSuccess, initialRole = 'user' }) => {
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [formData, setFormData] = useState({
    name: '',
    email: 'thuha.tran@example.com',
    password: 'fitpet2026',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const demoAccounts = authService.getDemoAccounts();

  const roleConfigs = {
    user: {
      title: 'Hội Viên',
      color: '#10B981',
      badge: 'MEMBER',
      defaultEmail: 'thuha.tran@example.com',
      demo: demoAccounts.user
    },
    coach: {
      title: 'HLV Thể Hình',
      color: '#8B5CF6',
      badge: 'COACH',
      defaultEmail: 'phuonganh.pt@gmail.com',
      demo: demoAccounts.coach
    },
    admin: {
      title: 'Quản Trị Viên',
      color: '#F59E0B',
      badge: 'ADMIN',
      defaultEmail: 'tuan.nguyen@example.com',
      demo: demoAccounts.admin
    }
  };

  const handleRoleChange = (roleKey) => {
    setSelectedRole(roleKey);
    setErrorMessage('');
    setSuccessMessage('');
    setFormData(prev => ({
      ...prev,
      email: roleConfigs[roleKey].defaultEmail,
      password: 'fitpet2026'
    }));
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (mode === 'login') {
        const user = await authService.login(formData.email, formData.password);
        soundService.playTone(587.33, 'sine', 0.15);
        onAuthSuccess(user);
        onClose();
      } else if (mode === 'register') {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Mật khẩu xác nhận không khớp.');
        }
        const user = await authService.register(formData.name, formData.email, formData.password, selectedRole);
        soundService.playVictory();
        onAuthSuccess(user);
        onClose();
      } else if (mode === 'forgot') {
        const msg = await authService.requestPasswordReset(formData.email);
        setSuccessMessage(msg);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (roleKey) => {
    setIsLoading(true);
    setTimeout(() => {
      const user = authService.loginAsRole(roleKey);
      soundService.playVictory();
      setIsLoading(false);
      onAuthSuccess(user);
      onClose();
    }, 250);
  };

  const handleGuestContinue = () => {
    const guest = authService.logout();
    onAuthSuccess(guest);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px', padding: '28px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <h2 id="auth-modal-title" style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
              {mode === 'login' ? 'Đăng Nhập Theo Vai Trò' : mode === 'register' ? 'Đăng Ký Tài Khoản Mới' : 'Quên Mật Khẩu'}
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.84rem', marginTop: '3px', margin: 0 }}>
              Mỗi vai trò sẽ mở giao diện chuyên biệt phù hợp
            </p>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Đóng cửa sổ">
            <X size={18} />
          </button>
        </div>

        {/* Role Selector Tabs (User vs Coach vs Admin) */}
        {mode !== 'forgot' && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
              Chọn vai trò của bạn:
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '6px',
              backgroundColor: 'var(--color-surface-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '3px',
              border: '1px solid var(--color-border)'
            }}>
              {Object.entries(roleConfigs).map(([rKey, cfg]) => {
                const isSelected = selectedRole === rKey;
                return (
                  <button
                    key={rKey}
                    type="button"
                    onClick={() => handleRoleChange(rKey)}
                    style={{
                      padding: '7px 4px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'var(--color-surface)' : 'transparent',
                      color: isSelected ? cfg.color : 'var(--color-text-muted)',
                      boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '2px',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <span>{cfg.title}</span>
                    <span style={{ fontSize: '0.64rem', opacity: 0.8 }}>({cfg.badge})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 1-Click Instant Demo Login Banner */}
        {mode === 'login' && (
          <div style={{
            backgroundColor: 'var(--color-surface-subtle)',
            border: `1.5px solid ${roleConfigs[selectedRole].color}`,
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.4rem' }}>{roleConfigs[selectedRole].demo.account.avatarEmoji}</span>
              <div>
                <div style={{ fontSize: '0.84rem', fontWeight: 800 }}>
                  {roleConfigs[selectedRole].demo.account.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                  {roleConfigs[selectedRole].demo.account.email}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin(selectedRole)}
              className="btn-primary"
              style={{
                fontSize: '0.78rem',
                padding: '6px 12px',
                minHeight: '32px',
                backgroundColor: roleConfigs[selectedRole].color,
                borderColor: roleConfigs[selectedRole].color
              }}
            >
              <Sparkles size={13} style={{ marginRight: '4px' }} />
              Đăng Nhập 1-Click
            </button>
          </div>
        )}

        {/* Error / Success Feedback */}
        {errorMessage && (
          <div role="alert" style={{
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

        {successMessage && (
          <div role="status" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            backgroundColor: 'var(--color-brand-light)',
            border: '1px solid var(--color-brand-primary)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-brand-dark)',
            fontSize: '0.84rem',
            marginBottom: '16px'
          }}>
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {mode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px', color: 'var(--color-text-secondary)' }}>
                Họ và Tên
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ví dụ: Hoàng Minh"
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
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px', color: 'var(--color-text-secondary)' }}>
              Email Đăng Nhập
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
                Mật Khẩu
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  style={{ fontSize: '0.76rem', color: roleConfigs[selectedRole].color, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Quên mật khẩu?
                </button>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
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
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px', color: 'var(--color-text-secondary)' }}>
                Xác Nhận Mật Khẩu
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu"
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
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
            style={{
              width: '100%',
              justifyContent: 'center',
              backgroundColor: roleConfigs[selectedRole].color,
              borderColor: roleConfigs[selectedRole].color,
              marginTop: '6px'
            }}
          >
            {isLoading 
              ? 'Đang xác thực...' 
              : mode === 'login' 
              ? `Đăng Nhập (${roleConfigs[selectedRole].title})` 
              : mode === 'register' 
              ? 'Tạo Tài Khoản' 
              : 'Gửi Liên Kết'}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Switch Login / Register link */}
        <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '0.82rem' }}>
          {mode === 'login' ? (
            <span>
              Chưa có tài khoản?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                style={{ color: roleConfigs[selectedRole].color, fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Đăng ký ngay
              </button>
            </span>
          ) : (
            <span>
              Đã có tài khoản?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                style={{ color: roleConfigs[selectedRole].color, fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Đăng nhập
              </button>
            </span>
          )}
        </div>

        {/* Guest continue option (Member only) */}
        {selectedRole === 'user' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '14px 0', color: 'var(--color-text-muted)', fontSize: '0.74rem' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }} />
              <span>HOẶC</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }} />
            </div>

            <button
              onClick={handleGuestContinue}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.84rem' }}
            >
              <ShieldCheck size={16} style={{ color: 'var(--color-brand-primary)' }} />
              Tiếp tục với tư cách Khách
            </button>
          </>
        )}
      </div>
    </div>
  );
};

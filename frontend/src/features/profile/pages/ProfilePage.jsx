import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, Shield, Volume2, VolumeX, Moon, Sun, 
  Settings, LogOut, LogIn, Edit3, Check, X, ShieldAlert, 
  RotateCcw, Sparkles, Music, HelpCircle, LayoutDashboard, Crown, Star,
  Award, ShieldCheck, Activity, Clock, Target, FileText, CheckCircle2, AlertCircle
} from 'lucide-react';
import { authService } from '../../auth/services/authService';
import { speechCompanion } from '../../ai-coach/services/speechCompanion';
import { soundService } from '../../workout/services/soundService';

const AVATAR_OPTIONS = ['🌸', '🌱', '⚡', '💻', '🏃', '🧘‍♀️', '🦊', '🐱', '🐶', '🐼', '🐨', '🦁', '🌟', '🌈', '🎯', '🚀'];

const PAIN_AREA_OPTIONS = [
  'Cổ & Vai Gáy',
  'Thắt Lưng & Cột Sống',
  'Cổ Tay & Ngón Tay',
  'Toàn Thân & Hông',
  'Mắt & Giảm Căng Thẳng'
];

const SITTING_HOUR_OPTIONS = [
  'Dưới 4 giờ',
  '4 - 6 giờ',
  '7 - 9 giờ',
  'Trên 9 giờ'
];

const DAILY_GOAL_OPTIONS = [3, 5, 10, 15];

export const ProfilePage = ({
  currentUser,
  onUserUpdate,
  onOpenAuth,
  onReplayOnboarding,
  onSwitchToAdmin,
  onSwitchToCoach,
  onOpenRoleLogin,
  currentTheme,
  onToggleTheme,
  onOpenSubscription
}) => {
  const [isVoiceMuted, setIsVoiceMuted] = useState(speechCompanion.isMuted);
  const [testSpeechStatus, setTestSpeechStatus] = useState('');
  
  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    avatarEmoji: currentUser?.avatarEmoji || '🌸',
    primaryPainArea: currentUser?.primaryPainArea || 'Cổ & Vai Gáy',
    sittingHoursPerDay: currentUser?.sittingHoursPerDay || '7 - 9 giờ',
    dailyGoalMinutes: currentUser?.dailyGoalMinutes || 5,
    notes: currentUser?.notes || ''
  });
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [formError, setFormError] = useState('');

  // Keep form data synchronized when currentUser changes
  useEffect(() => {
    setEditFormData({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      avatarEmoji: currentUser?.avatarEmoji || '🌸',
      primaryPainArea: currentUser?.primaryPainArea || 'Cổ & Vai Gáy',
      sittingHoursPerDay: currentUser?.sittingHoursPerDay || '7 - 9 giờ',
      dailyGoalMinutes: currentUser?.dailyGoalMinutes || 5,
      notes: currentUser?.notes || ''
    });
  }, [currentUser]);

  const handleVoiceToggle = () => {
    const next = speechCompanion.toggleMute();
    setIsVoiceMuted(next);
  };

  const handleTestVoice = () => {
    soundService.playTone(523.25, 'sine', 0.2);
    if (isVoiceMuted) {
      setTestSpeechStatus('Giọng nói đang tắt. Hãy bật âm thanh trước khi nghe thử.');
      return;
    }
    setTestSpeechStatus('Đang phát giọng đọc mẫu...');
    speechCompanion.speak('Xin chào! Mình là trợ lý FitPet. Mình sẽ đồng hành hướng dẫn bạn trong mỗi động tác.', true);
    setTimeout(() => setTestSpeechStatus(''), 4000);
  };

  const handleSaveProfile = (e) => {
    if (e) e.preventDefault();
    if (!editFormData.name.trim()) {
      setFormError('Vui lòng nhập họ và tên của bạn.');
      return;
    }
    setFormError('');

    const updates = {
      name: editFormData.name.trim(),
      email: editFormData.email.trim(),
      phone: editFormData.phone.trim(),
      avatarEmoji: editFormData.avatarEmoji,
      primaryPainArea: editFormData.primaryPainArea,
      sittingHoursPerDay: editFormData.sittingHoursPerDay,
      dailyGoalMinutes: Number(editFormData.dailyGoalMinutes) || 5,
      notes: editFormData.notes.trim()
    };

    const updated = authService.updateProfile(updates);
    onUserUpdate(updated);
    setIsEditing(false);
    soundService.playRepBeep();
    setSaveSuccessMsg('Đã cập nhật thông tin cá nhân của bạn thành công!');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  const handleCancelEdit = () => {
    setEditFormData({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      avatarEmoji: currentUser?.avatarEmoji || '🌸',
      primaryPainArea: currentUser?.primaryPainArea || 'Cổ & Vai Gáy',
      sittingHoursPerDay: currentUser?.sittingHoursPerDay || '7 - 9 giờ',
      dailyGoalMinutes: currentUser?.dailyGoalMinutes || 5,
      notes: currentUser?.notes || ''
    });
    setFormError('');
    setIsEditing(false);
  };

  const handleLogout = () => {
    const guest = authService.logout();
    onUserUpdate(guest);
    soundService.playTone(440, 'sine', 0.15);
  };

  const handleResetData = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch sử tập luyện và thiết lập lại ứng dụng về trạng thái ban đầu?')) {
      localStorage.removeItem('fitpet_workout_history');
      localStorage.removeItem('fitpet_user_preferences');
      localStorage.removeItem('fitpet_onboarding_completed');
      window.location.reload();
    }
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', width: '100%', paddingBottom: 'var(--space-12)' }}>
      {/* Page Title */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '6px' }}>Tài Khoản & Cài Đặt</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.94rem' }}>
          Quản lý thông tin cá nhân, thói quen vận động và tùy chỉnh trải nghiệm FitPet.
        </p>
      </div>

      {/* Success Notification Banner */}
      {saveSuccessMsg && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 18px',
          backgroundColor: 'var(--color-brand-light)',
          border: '1.5px solid var(--color-brand-primary)',
          borderRadius: 'var(--radius-lg)',
          color: 'var(--color-brand-dark)',
          fontSize: '0.92rem',
          fontWeight: 700,
          marginBottom: '20px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <CheckCircle2 size={18} style={{ color: 'var(--color-brand-primary)', flexShrink: 0 }} />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* User Profile Header Card */}
      <div className="card" style={{ padding: '24px', marginBottom: '20px', border: '1.5px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-brand-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.2rem',
              boxShadow: 'var(--shadow-sm)',
              border: '2px solid var(--color-brand-primary)',
              flexShrink: 0
            }}>
              {currentUser?.avatarEmoji || '🌱'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                  {currentUser?.name || 'Người Dùng Khách'}
                </h2>
                <span className={
                  currentUser?.role === 'admin' 
                    ? 'badge badge-amber' 
                    : currentUser?.role === 'coach' 
                    ? 'badge' 
                    : 'badge badge-brand'
                } style={{ fontSize: '0.72rem' }}>
                  {currentUser?.role === 'admin' 
                    ? '🛡️ Quản Trị Viên' 
                    : currentUser?.role === 'coach' 
                    ? '🧘 HLV Thể Hình' 
                    : currentUser?.isGuest 
                    ? 'Khách' 
                    : '🏃 Hội Viên'}
                </span>
              </div>
              <div style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                {currentUser?.email ? currentUser.email : 'Chưa liên kết email'} • Tham gia từ {currentUser?.joinDate || currentUser?.joinedDate || 'Hôm nay'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.88rem', minHeight: '40px' }}
              >
                <Edit3 size={15} />
                Chỉnh Sửa Hồ Sơ
              </button>
            )}

            {currentUser?.isGuest ? (
              <button
                onClick={onOpenAuth}
                className="btn-primary"
                style={{ padding: '8px 18px', fontSize: '0.9rem', minHeight: '40px' }}
              >
                <LogIn size={16} />
                Đăng Nhập
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="btn-ghost"
                style={{ padding: '8px 14px', fontSize: '0.86rem', minHeight: '40px', color: 'var(--color-text-muted)' }}
                title="Đăng xuất khỏi tài khoản"
              >
                <LogOut size={16} />
                Đăng Xuất
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Customer Information & Habits: View Mode vs Edit Mode */}
      <div className="card" style={{ padding: '24px', marginBottom: '20px', border: '1.5px solid var(--color-border)' }}>
        {!isEditing ? (
          /* View Mode */
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Thông Tin Cá Nhân & Thói Quen</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: '2px 0 0 0' }}>
                  Các thông số giúp FitPet và trợ lý AI gợi ý bài tập chuẩn xác nhất cho bạn.
                </p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="btn-ghost"
                style={{ fontSize: '0.84rem', color: 'var(--color-brand-primary)', fontWeight: 700, padding: '4px 10px' }}
              >
                <Edit3 size={14} style={{ marginRight: '4px' }} />
                Chỉnh sửa
              </button>
            </div>

            {/* Structured info grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              {/* Contact item */}
              <div style={{
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-surface-subtle)',
                border: '1px solid var(--color-border-subtle)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                  <Mail size={14} style={{ color: 'var(--color-brand-primary)' }} />
                  EMAIL & ĐIỆN THOẠI
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.94rem', color: 'var(--color-text-primary)' }}>
                  {currentUser?.email || 'Chưa cung cấp email'}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                  {currentUser?.phone ? `SĐT: ${currentUser.phone}` : 'Chưa cập nhật số điện thoại'}
                </div>
              </div>

              {/* Primary Pain Area */}
              <div style={{
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-surface-subtle)',
                border: '1px solid var(--color-border-subtle)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                  <Activity size={14} style={{ color: 'var(--color-accent)' }} />
                  VÙNG ĐAU MỎI ƯU TIÊN
                </div>
                <div>
                  <span className="badge badge-brand" style={{ fontSize: '0.84rem', padding: '4px 10px' }}>
                    {currentUser?.primaryPainArea || 'Cổ & Vai Gáy'}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Các bài tập sẽ ưu tiên giảm áp lực vùng này.
                </div>
              </div>

              {/* Sitting hours */}
              <div style={{
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-surface-subtle)',
                border: '1px solid var(--color-border-subtle)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                  <Clock size={14} style={{ color: '#F59E0B' }} />
                  THỜI GIAN NGỒI LÀM VIỆC
                </div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-text-primary)' }}>
                  {currentUser?.sittingHoursPerDay || '7 - 9 giờ / ngày'}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  Được khuyến nghị nghỉ giãn cơ mỗi 45 phút.
                </div>
              </div>

              {/* Daily workout goal */}
              <div style={{
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-surface-subtle)',
                border: '1px solid var(--color-border-subtle)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                  <Target size={14} style={{ color: '#10B981' }} />
                  MỤC TIÊU VẬN ĐỘNG HÀNG NGÀY
                </div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-text-primary)' }}>
                  {currentUser?.dailyGoalMinutes || 5} phút nhẹ nhàng
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  Đủ để phục hồi cơ và nuôi dưỡng thú cưng Pip.
                </div>
              </div>
            </div>

            {/* Health notes */}
            {currentUser?.notes && (
              <div style={{
                marginTop: '14px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(16, 185, 129, 0.05)',
                border: '1px dashed var(--color-border)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <FileText size={16} style={{ color: 'var(--color-brand-primary)', marginTop: '2px', flexShrink: 0 }} />
                <div style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
                  <strong style={{ color: 'var(--color-text-primary)' }}>Ghi chú thể trạng: </strong>
                  {currentUser.notes}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Edit Mode Form */
          <form onSubmit={handleSaveProfile}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Chỉnh Sửa Thông Tin Cá Nhân</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: '2px 0 0 0' }}>
                  Cập nhật hồ sơ để nhận các bài tập phù hợp nhất với thể trạng của bạn.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="icon-btn"
                style={{ width: '32px', height: '32px' }}
                aria-label="Đóng chỉnh sửa"
              >
                <X size={16} />
              </button>
            </div>

            {/* Error Message */}
            {formError && (
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
                <span>{formError}</span>
              </div>
            )}

            {/* Avatar Emoji Selector */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '8px', color: 'var(--color-text-secondary)' }}>
                Biểu Tượng Đại Diện (Avatar Emoji)
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap',
                padding: '10px',
                backgroundColor: 'var(--color-surface-subtle)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)'
              }}>
                {AVATAR_OPTIONS.map((emoji) => {
                  const isSelected = editFormData.avatarEmoji === emoji;
                  return (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setEditFormData({ ...editFormData, avatarEmoji: emoji })}
                      style={{
                        width: '40px',
                        height: '40px',
                        fontSize: '1.4rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 'var(--radius-full)',
                        border: isSelected ? '2.5px solid var(--color-brand-primary)' : '1px solid transparent',
                        backgroundColor: isSelected ? 'var(--color-brand-light)' : 'transparent',
                        cursor: 'pointer',
                        transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                        transition: 'all 0.15s ease'
                      }}
                      title={`Chọn ${emoji}`}
                    >
                      {emoji}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2-Column Fields Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '14px', marginBottom: '14px' }}>
              {/* Name field */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '5px', color: 'var(--color-text-secondary)' }}>
                  Họ và Tên *
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    placeholder="Nhập tên của bạn"
                    style={{
                      width: '100%',
                      padding: '9px 12px 9px 36px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--color-border)',
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-text-primary)',
                      fontSize: '0.9rem',
                      fontWeight: 600
                    }}
                  />
                </div>
              </div>

              {/* Email field */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '5px', color: 'var(--color-text-secondary)' }}>
                  Địa Chỉ Email
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    placeholder="email@example.com"
                    style={{
                      width: '100%',
                      padding: '9px 12px 9px 36px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--color-border)',
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-text-primary)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
              </div>

              {/* Phone field */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '5px', color: 'var(--color-text-secondary)' }}>
                  Số Điện Thoại Liên Hệ
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input
                    type="tel"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    placeholder="Ví dụ: 0983 221 456"
                    style={{
                      width: '100%',
                      padding: '9px 12px 9px 36px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--color-border)',
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-text-primary)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
              </div>

              {/* Primary Pain Area */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '5px', color: 'var(--color-text-secondary)' }}>
                  Vùng Đau Mỏi Ưu Tiên
                </label>
                <div style={{ position: 'relative' }}>
                  <Activity size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <select
                    value={editFormData.primaryPainArea}
                    onChange={(e) => setEditFormData({ ...editFormData, primaryPainArea: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px 9px 36px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--color-border)',
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-text-primary)',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {PAIN_AREA_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sitting hours */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '5px', color: 'var(--color-text-secondary)' }}>
                  Thời Gian Ngồi Làm Việc / Ngày
                </label>
                <div style={{ position: 'relative' }}>
                  <Clock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <select
                    value={editFormData.sittingHoursPerDay}
                    onChange={(e) => setEditFormData({ ...editFormData, sittingHoursPerDay: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px 9px 36px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--color-border)',
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-text-primary)',
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    {SITTING_HOUR_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Daily Goal */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '5px', color: 'var(--color-text-secondary)' }}>
                  Mục Tiêu Tập Mỗi Ngày (Phút)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                  {DAILY_GOAL_OPTIONS.map(m => {
                    const isSelected = Number(editFormData.dailyGoalMinutes) === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setEditFormData({ ...editFormData, dailyGoalMinutes: m })}
                        style={{
                          padding: '8px 0',
                          borderRadius: 'var(--radius-md)',
                          border: isSelected ? '1.5px solid var(--color-brand-primary)' : '1px solid var(--color-border)',
                          backgroundColor: isSelected ? 'var(--color-brand-light)' : 'var(--color-surface)',
                          color: isSelected ? 'var(--color-brand-dark)' : 'var(--color-text-secondary)',
                          fontWeight: isSelected ? 800 : 600,
                          fontSize: '0.86rem',
                          cursor: 'pointer',
                          textAlign: 'center'
                        }}
                      >
                        {m}p
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Health Notes textarea */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '5px', color: 'var(--color-text-secondary)' }}>
                Ghi Chú Thể Trạng / Lời Nhắn Đến Huấn Luyện Viên
              </label>
              <textarea
                rows={2}
                value={editFormData.notes}
                onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                placeholder="Ví dụ: Ngồi máy tính hơn 8 tiếng/ngày, hay bị mỏi cổ vai lúc 15h, ưu tiên các bài tập không tạo tiếng động..."
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-primary)',
                  fontSize: '0.88rem',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="btn-ghost"
                style={{ padding: '8px 18px', fontSize: '0.88rem' }}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="btn-primary"
                style={{ padding: '8px 22px', fontSize: '0.9rem' }}
              >
                <Check size={16} />
                Lưu Thay Đổi
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Subscription Plan Status Card */}
      <div className="card" style={{
        padding: '22px',
        marginBottom: '20px',
        border: currentUser?.plan === 'vip' 
          ? '2px solid #F59E0B' 
          : currentUser?.plan === 'plus' 
          ? '2px solid var(--color-accent)' 
          : '1.5px solid var(--color-border)',
        backgroundColor: currentUser?.plan === 'vip' 
          ? 'rgba(245, 158, 11, 0.05)' 
          : currentUser?.plan === 'plus' 
          ? 'rgba(255, 107, 74, 0.04)' 
          : 'var(--color-surface)',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              {currentUser?.plan === 'vip' ? (
                <Crown size={22} style={{ color: '#F59E0B' }} />
              ) : currentUser?.plan === 'plus' ? (
                <Star size={22} style={{ color: 'var(--color-accent)' }} />
              ) : (
                <Sparkles size={22} style={{ color: 'var(--color-brand-primary)' }} />
              )}
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {currentUser?.plan === 'vip' ? 'Gói FitPet VIP Trọn Đời' : currentUser?.plan === 'plus' ? 'Gói FitPet Plus' : 'Gói Dịch Vụ: Cơ Bản'}
              </h3>
              <span className={currentUser?.plan === 'vip' ? 'badge badge-amber' : currentUser?.plan === 'plus' ? 'badge badge-brand' : 'badge'} style={{ fontSize: '0.74rem' }}>
                {currentUser?.plan === 'vip' ? '💎 VIP Vĩnh Viễn' : currentUser?.plan === 'plus' ? '⭐ Đang Kích Hoạt' : 'Miễn Phí'}
              </span>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', lineHeight: 1.4, maxWidth: '440px', margin: '4px 0 0 0' }}>
              {currentUser?.plan === 'vip' 
                ? 'Toàn quyền truy cập trọn đời mọi bài tập, camera AI và 02 buổi tham vấn 1-1.'
                : currentUser?.plan === 'plus'
                ? `Mở khóa toàn bộ bài tập chuyên sâu & Camera AI không giới hạn (${currentUser?.planExpiry || '2027-10-28'}).`
                : 'Nâng cấp để mở khóa trọn bộ bài tập mọi vùng đau và Camera AI không giới hạn.'}
            </p>
          </div>

          <div>
            {currentUser?.plan === 'vip' ? (
              <button
                onClick={onOpenSubscription}
                className="btn-secondary"
                style={{ fontSize: '0.85rem', borderColor: '#F59E0B', color: '#F59E0B', padding: '8px 14px' }}
              >
                <Crown size={14} /> Đặc Quyền VIP
              </button>
            ) : currentUser?.plan === 'plus' ? (
              <button
                onClick={onOpenSubscription}
                className="btn-secondary"
                style={{ fontSize: '0.85rem', borderColor: 'var(--color-accent)', color: 'var(--color-accent)', padding: '8px 14px' }}
              >
                <Crown size={14} /> Nâng Lên VIP
              </button>
            ) : (
              <button
                onClick={onOpenSubscription}
                className="btn-primary"
                style={{
                  fontSize: '0.88rem',
                  padding: '9px 18px',
                  backgroundColor: 'var(--color-accent)',
                  borderColor: 'var(--color-accent)'
                }}
              >
                <Sparkles size={15} /> Mua Gói Plus
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Voice & Sound Settings */}
      <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>Trợ Lý Âm Thanh & Giọng Nói AI</h3>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.96rem' }}>Giọng nói hướng dẫn</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              Nhắc nhở súc tích nhịp thở và cách giữ thẳng lưng (Xử lý 100% trên thiết bị)
            </div>
          </div>
          <button
            className={`btn-secondary ${!isVoiceMuted ? 'active' : ''}`}
            onClick={handleVoiceToggle}
            style={{ minWidth: '120px' }}
          >
            {isVoiceMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            {isVoiceMuted ? 'Đang Tắt' : 'Đang Bật'}
          </button>
        </div>

        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            className="btn-ghost"
            onClick={handleTestVoice}
            style={{ fontSize: '0.85rem', border: '1px solid var(--color-border)' }}
          >
            <Volume2 size={15} style={{ marginRight: '4px' }} />
            Nghe thử giọng đọc mẫu
          </button>
          <button
            className="btn-ghost"
            onClick={() => soundService.playVictory()}
            style={{ fontSize: '0.85rem', border: '1px solid var(--color-border)' }}
          >
            <Music size={15} style={{ marginRight: '4px' }} />
            Thử âm thanh hoàn thành
          </button>
          {testSpeechStatus && (
            <span style={{ fontSize: '0.82rem', color: 'var(--color-brand-primary)', fontWeight: 600 }}>
              {testSpeechStatus}
            </span>
          )}
        </div>
      </div>

      {/* Appearance & System */}
      <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>Giao Diện & Trải Nghiệm</h3>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.96rem' }}>Chế độ hiển thị</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              {currentTheme === 'dark' ? 'Giao diện Tối (Bảo vệ mắt)' : 'Giao diện Sáng (Thanh lịch)'}
            </div>
          </div>
          <button
            className="btn-secondary"
            onClick={onToggleTheme}
            style={{ minWidth: '120px' }}
          >
            {currentTheme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
            {currentTheme === 'dark' ? 'Tối' : 'Sáng'}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.96rem' }}>Hướng dẫn ban đầu</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              Xem lại các bước làm quen với FitPet và người bạn Pip
            </div>
          </div>
          <button
            className="btn-secondary"
            onClick={onReplayOnboarding}
            style={{ minWidth: '120px' }}
          >
            <RotateCcw size={15} /> Xem lại
          </button>
        </div>
      </div>

      {/* Role-Based Workspaces & Portals Gateway */}
      <div className="card" style={{
        padding: '22px',
        marginBottom: '20px',
        backgroundColor: 'var(--color-surface-subtle)',
        border: '1.5px solid var(--color-border)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} style={{ color: 'var(--color-brand-primary)' }} />
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>Không Gian Làm Việc Theo Vai Trò</h4>
          </div>

          <button
            onClick={onOpenRoleLogin}
            className="btn-primary"
            style={{ fontSize: '0.8rem', padding: '5px 12px' }}
          >
            <LogIn size={13} /> Đổi Vai Trò
          </button>
        </div>

        {/* 3 Role Portal Badges & Quick Launch */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
          {/* Member App */}
          <div style={{
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-surface)',
            border: currentUser?.role === 'user' ? '2px solid #10B981' : '1px solid var(--color-border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#10B981' }}>🏃 Hội Viên</span>
              {currentUser?.role === 'user' && (
                <span className="badge badge-brand" style={{ fontSize: '0.65rem' }}>Hiện Tại</span>
              )}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
              Tập luyện & nuôi thú cưng Pip.
            </div>
          </div>

          {/* Coach Portal */}
          <div style={{
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-surface)',
            border: currentUser?.role === 'coach' ? '2px solid #8B5CF6' : '1px solid var(--color-border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#8B5CF6' }}>🧘 HLV Thể Hình</span>
              {currentUser?.role === 'coach' && (
                <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>Hiện Tại</span>
              )}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
              Kiểm duyệt bài tập & theo dõi học viên.
            </div>
            <button
              onClick={onSwitchToCoach}
              className="btn-secondary"
              style={{ width: '100%', fontSize: '0.76rem', padding: '4px 8px', borderColor: '#8B5CF6', color: '#7C3AED' }}
            >
              Mở Coach Portal
            </button>
          </div>

          {/* Admin Dashboard */}
          <div style={{
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-surface)',
            border: currentUser?.role === 'admin' ? '2px solid #F59E0B' : '1px solid var(--color-border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#F59E0B' }}>🛡️ Quản Trị Viên</span>
              {currentUser?.role === 'admin' && (
                <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>Hiện Tại</span>
              )}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
              Quản trị người dùng & hệ thống.
            </div>
            <button
              onClick={onSwitchToAdmin}
              className="btn-secondary"
              style={{ width: '100%', fontSize: '0.76rem', padding: '4px 8px', borderColor: '#F59E0B', color: '#B45309' }}
            >
              Mở Admin Portal
            </button>
          </div>
        </div>
      </div>

      {/* Reset Data & Medical Notice */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="card-subtle" style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '12px 16px' }}>
          <ShieldAlert size={18} style={{ color: 'var(--color-brand-primary)', flexShrink: 0 }} />
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
            <strong>Quyền riêng tư:</strong> Nhận diện tư thế và giọng nói được xử lý 100% cục bộ trên máy, không tải video ra ngoài.
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <button
            onClick={handleResetData}
            style={{
              fontSize: '0.8rem',
              color: '#EF4444',
              textDecoration: 'underline',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Thiết lập lại toàn bộ dữ liệu mẫu (Reset Demo Data)
          </button>
        </div>
      </div>
    </div>
  );
};

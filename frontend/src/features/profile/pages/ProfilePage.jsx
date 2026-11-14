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
  onOpenSubscription,
  onNavigateTab
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
    setSaveSuccessMsg('Đã cập nhật thông tin cá nhân thành công!');
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
    <div style={{ width: '100%', padding: '4px 6px 120px 6px', boxSizing: 'border-box' }}>
      {/* Eyebrow and Page Title */}
      <div style={{ marginBottom: '16px', padding: '0 4px' }}>
        <div style={{
          fontSize: '0.72rem',
          fontWeight: 800,
          color: '#F78C25',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '4px'
        }}>
          HỒ SƠ & TÙY CHỌN
        </div>
        <h1 style={{
          fontSize: '1.45rem',
          fontWeight: 900,
          color: '#133E35',
          margin: '0 0 6px 0',
          lineHeight: 1.2
        }}>
          Tài Khoản & Cài Đặt ⚙️
        </h1>
        <p style={{
          fontSize: '0.86rem',
          color: '#4A6B63',
          margin: 0,
          lineHeight: 1.45
        }}>
          Quản lý thông tin cá nhân, thói quen vận động và tùy chỉnh trải nghiệm cùng Mochi.
        </p>
      </div>

      {/* Success Notification Banner */}
      {saveSuccessMsg && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          backgroundColor: '#F78C25',
          borderRadius: '9999px',
          color: '#FFFFFF',
          fontSize: '0.84rem',
          fontWeight: 800,
          marginBottom: '16px',
          boxShadow: '0 4px 12px rgba(247, 140, 37, 0.25)'
        }}>
          <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* User Profile Header Card in Seafoam Mint */}
      <div className="card-mint" style={{ padding: '20px 18px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: '3px solid #133E35',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.9rem',
              boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
              flexShrink: 0
            }}>
              {currentUser?.avatarEmoji || '🌸'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.18rem', fontWeight: 900, color: '#133E35', margin: 0 }}>
                  {currentUser?.name || 'Thu Hà'}
                </h2>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  backgroundColor: '#133E35',
                  color: '#FFFFFF',
                  padding: '3px 8px',
                  borderRadius: '9999px'
                }}>
                  {currentUser?.role === 'admin' 
                    ? 'Quản Trị' 
                    : currentUser?.role === 'coach' 
                    ? 'HLV' 
                    : 'Hội Viên'}
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#2C5E53', marginTop: '2px' }}>
                {currentUser?.email ? currentUser.email : 'ha.nguyen@company.com'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#133E35',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '7px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Edit3 size={13} /> Sửa
              </button>
            )}

            {currentUser?.isGuest ? (
              <button
                onClick={onOpenAuth}
                className="btn-orange"
                style={{ padding: '7px 16px', fontSize: '0.82rem' }}
              >
                <LogIn size={14} /> Đăng Nhập
              </button>
            ) : (
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.4)',
                  color: '#133E35',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '7px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <LogOut size={13} /> Thoát
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Customer Information & Habits: View Mode vs Edit Mode */}
      <div className="card-peach" style={{ padding: '20px 18px', marginBottom: '16px' }}>
        {!isEditing ? (
          /* View Mode */
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#133E35', margin: 0 }}>
                  Thông Tin Thói Quen
                </h3>
                <p style={{ fontSize: '0.76rem', color: '#6A564C', margin: '2px 0 0 0' }}>
                  Giúp Mochi cá nhân hóa bài tập cho bạn
                </p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#F78C25',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '4px 10px',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Chỉnh sửa
              </button>
            </div>

            {/* Structured info grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              <div style={{
                padding: '12px',
                borderRadius: '16px',
                backgroundColor: '#FFFFFF'
              }}>
                <div style={{ fontSize: '0.7rem', color: '#8A756C', fontWeight: 700, marginBottom: '2px' }}>
                  VÙNG ĐAU MỎI
                </div>
                <div style={{ fontWeight: 900, fontSize: '0.88rem', color: '#133E35' }}>
                  {currentUser?.primaryPainArea || 'Cổ & Vai Gáy'}
                </div>
              </div>

              <div style={{
                padding: '12px',
                borderRadius: '16px',
                backgroundColor: '#FFFFFF'
              }}>
                <div style={{ fontSize: '0.7rem', color: '#8A756C', fontWeight: 700, marginBottom: '2px' }}>
                  GIỜ NGỒI LÀM VIỆC
                </div>
                <div style={{ fontWeight: 900, fontSize: '0.88rem', color: '#133E35' }}>
                  {currentUser?.sittingHoursPerDay || '7 - 9 giờ / ngày'}
                </div>
              </div>

              <div style={{
                padding: '12px',
                borderRadius: '16px',
                backgroundColor: '#FFFFFF'
              }}>
                <div style={{ fontSize: '0.7rem', color: '#8A756C', fontWeight: 700, marginBottom: '2px' }}>
                  MỤC TIÊU MỖI NGÀY
                </div>
                <div style={{ fontWeight: 900, fontSize: '0.88rem', color: '#F78C25' }}>
                  {currentUser?.dailyGoalMinutes || 5} phút nhẹ nhàng
                </div>
              </div>

              <div style={{
                padding: '12px',
                borderRadius: '16px',
                backgroundColor: '#FFFFFF'
              }}>
                <div style={{ fontSize: '0.7rem', color: '#8A756C', fontWeight: 700, marginBottom: '2px' }}>
                  BẠN ĐỒNG HÀNH
                </div>
                <div style={{ fontWeight: 900, fontSize: '0.88rem', color: '#133E35' }}>
                  Cún Cưng Mochi 🐾
                </div>
              </div>
            </div>

            {/* Health notes */}
            {currentUser?.notes && (
              <div style={{
                marginTop: '12px',
                padding: '10px 14px',
                borderRadius: '14px',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.78rem',
                color: '#5C473C'
              }}>
                <FileText size={14} style={{ color: '#F78C25', flexShrink: 0 }} />
                <span><strong>Ghi chú:</strong> {currentUser.notes}</span>
              </div>
            )}
          </div>
        ) : (
          /* Edit Mode Form */
          <form onSubmit={handleSaveProfile}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#133E35', margin: 0 }}>
                  Chỉnh Sửa Hồ Sơ
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCancelEdit}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: 'none',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Error Message */}
            {formError && (
              <div style={{
                padding: '8px 12px',
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
                borderRadius: '12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                marginBottom: '12px'
              }}>
                {formError}
              </div>
            )}

            {/* Avatar Emoji Selector */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '6px', color: '#5C473C' }}>
                Biểu Tượng Đại Diện
              </label>
              <div style={{
                display: 'flex',
                gap: '6px',
                overflowX: 'auto',
                padding: '8px',
                backgroundColor: '#FFFFFF',
                borderRadius: '16px'
              }}>
                {AVATAR_OPTIONS.map((emoji) => {
                  const isSelected = editFormData.avatarEmoji === emoji;
                  return (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setEditFormData({ ...editFormData, avatarEmoji: emoji })}
                      style={{
                        width: '36px',
                        height: '36px',
                        fontSize: '1.2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        border: isSelected ? '2px solid #F78C25' : '1px solid transparent',
                        backgroundColor: isSelected ? '#FEDFD2' : 'transparent',
                        cursor: 'pointer',
                        flexShrink: 0
                      }}
                    >
                      {emoji}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Name field */}
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '4px', color: '#5C473C' }}>
                Họ và Tên *
              </label>
              <input
                type="text"
                required
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '12px',
                  border: '1px solid rgba(0,0,0,0.1)',
                  backgroundColor: '#FFFFFF',
                  color: '#133E35',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Primary Pain Area */}
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '4px', color: '#5C473C' }}>
                Vùng Đau Mỏi Ưu Tiên
              </label>
              <select
                value={editFormData.primaryPainArea}
                onChange={(e) => setEditFormData({ ...editFormData, primaryPainArea: e.target.value })}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '12px',
                  border: '1px solid rgba(0,0,0,0.1)',
                  backgroundColor: '#FFFFFF',
                  color: '#133E35',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  boxSizing: 'border-box'
                }}
              >
                {PAIN_AREA_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Daily Goal */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '4px', color: '#5C473C' }}>
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
                        borderRadius: '12px',
                        border: isSelected ? '2px solid #F78C25' : '1px solid rgba(0,0,0,0.08)',
                        backgroundColor: isSelected ? '#F78C25' : '#FFFFFF',
                        color: isSelected ? '#FFFFFF' : '#133E35',
                        fontWeight: 900,
                        fontSize: '0.84rem',
                        cursor: 'pointer'
                      }}
                    >
                      {m}p
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={handleCancelEdit}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#133E35',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '8px 16px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="btn-orange"
                style={{ padding: '8px 20px', fontSize: '0.84rem' }}
              >
                <Check size={14} /> Lưu Thay Đổi
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Subscription Plan Status Card */}
      <div style={{
        background: currentUser?.plan === 'vip' 
          ? 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)' 
          : currentUser?.plan === 'plus' 
          ? 'linear-gradient(135deg, #FFF6EE 0%, #FEDFD2 100%)' 
          : '#FFFFFF',
        borderRadius: '24px',
        padding: '18px 18px',
        marginBottom: '16px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
        border: currentUser?.plan === 'vip' 
          ? '1.5px solid #FDE68A' 
          : currentUser?.plan === 'plus' 
          ? '1.5px solid #FDCBB7' 
          : '1px solid #E2E8F0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <Crown size={18} style={{ color: currentUser?.plan === 'vip' ? '#D97706' : '#F78C25' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#133E35', margin: 0 }}>
                {currentUser?.plan === 'vip' 
                  ? 'Gói FitPet VIP Trọn Đời' 
                  : currentUser?.plan === 'plus' 
                  ? 'Gói FitPet Premium' 
                  : 'Gói Cơ Bản (Miễn Phí)'}
              </h3>
              <span style={{
                fontSize: '0.64rem',
                fontWeight: 800,
                backgroundColor: currentUser?.plan === 'free' ? '#F1F5F9' : '#FEDFD2',
                color: currentUser?.plan === 'free' ? '#64748B' : '#8A4828',
                padding: '2px 8px',
                borderRadius: '9999px'
              }}>
                {currentUser?.plan === 'vip' ? '👑 VIP Vĩnh Viễn' : currentUser?.plan === 'plus' ? '⭐ 59k / Tháng' : 'Bản Miễn Phí'}
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#4A6B63', margin: 0, lineHeight: 1.4 }}>
              {currentUser?.plan === 'free' 
                ? 'Đang giới hạn 8 bài cơ bản. Nâng cấp để mở khóa 100% bài tập & Camera AI đếm reps.'
                : 'Mở khóa toàn bộ bài tập mọi vùng đau & Camera AI không giới hạn.'}
            </p>
          </div>
        </div>

        {/* Quick Features Breakdown for Current Package */}
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: '16px', padding: '10px 12px', marginBottom: '12px', border: '1px solid rgba(0, 0, 0, 0.05)' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#133E35', textTransform: 'uppercase', marginBottom: '4px' }}>
            Quyền lợi gói của bạn:
          </div>
          <div style={{ fontSize: '0.76rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {currentUser?.plan === 'vip' ? (
              <>
                <div>✓ Trọn bộ 100% bài tập mọi vùng đau & Camera AI vĩnh viễn</div>
                <div>✓ 02 buổi tham vấn 1-1 cùng HLV thể hình</div>
                <div>✓ Toàn bộ bộ sưu tập Skin VIP cho Mochi</div>
              </>
            ) : currentUser?.plan === 'plus' ? (
              <>
                <div>✓ Trọn bộ 100% bài tập mọi vùng đau mỏi (59.000 đ / tháng)</div>
                <div>✓ Camera AI đếm reps không giới hạn</div>
                <div>✓ Kho trang phục độc quyền cho Mochi</div>
              </>
            ) : (
              <>
                <div>✓ 8 bài tập khởi động & thả lỏng cơ bản</div>
                <div>✓ Thú cưng Mochi cơ bản (Cấp 1-5)</div>
                <div style={{ color: '#EA580C', fontWeight: 700 }}>✗ Chưa mở khóa Camera AI & 100% bài tập chuyên sâu</div>
              </>
            )}
          </div>
        </div>

        <button
          onClick={onOpenSubscription}
          className="btn-orange"
          style={{ width: '100%', fontSize: '0.88rem', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
        >
          <Crown size={15} />
          {currentUser?.plan === 'free' ? 'Xem Bảng Giá & Nâng Cấp Gói Premium 59k' : 'Xem Bảng Giá & So Sánh Các Gói'}
        </button>
      </div>

      {/* Voice & Sound Settings */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        padding: '18px 16px',
        marginBottom: '16px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
      }}>
        <h3 style={{ fontSize: '0.98rem', fontWeight: 900, color: '#133E35', margin: '0 0 12px 0' }}>
          Trợ Lý & Âm Thanh AI
        </h3>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#133E35' }}>Giọng nói hướng dẫn</div>
            <div style={{ fontSize: '0.74rem', color: '#7E9F97' }}>
              Nhắc nhở nhịp thở và cách giữ thẳng lưng
            </div>
          </div>
          <button
            onClick={handleVoiceToggle}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: !isVoiceMuted ? '#133E35' : '#CBD5E1',
              color: '#FFFFFF',
              fontSize: '0.76rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {isVoiceMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            <span>{isVoiceMuted ? 'Tắt' : 'Bật'}</span>
          </button>
        </div>

        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={handleTestVoice}
            style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              padding: '6px 12px',
              borderRadius: '9999px',
              border: '1px solid rgba(0,0,0,0.1)',
              backgroundColor: '#FFFFFF',
              color: '#133E35',
              cursor: 'pointer'
            }}
          >
            Nghe thử giọng mẫu
          </button>
          <button
            onClick={() => soundService.playVictory()}
            style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              padding: '6px 12px',
              borderRadius: '9999px',
              border: '1px solid rgba(0,0,0,0.1)',
              backgroundColor: '#FFFFFF',
              color: '#133E35',
              cursor: 'pointer'
            }}
          >
            Thử chuông chiến thắng
          </button>
          {testSpeechStatus && (
            <span style={{ fontSize: '0.74rem', color: '#F78C25', fontWeight: 700 }}>
              {testSpeechStatus}
            </span>
          )}
        </div>
      </div>

      {/* Workplace Wellness Quick Access */}
      {onNavigateTab && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '18px 16px',
          marginBottom: '16px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
        }}>
          <h3 style={{ fontSize: '0.98rem', fontWeight: 900, color: '#133E35', margin: '0 0 10px 0' }}>
            Lối Tắt Tiện Ích
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            <button
              onClick={() => onNavigateTab('consultation')}
              style={{
                padding: '10px 6px',
                borderRadius: '16px',
                border: 'none',
                backgroundColor: '#FEDFD2',
                color: '#133E35',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>🩺</span>
              <span style={{ fontWeight: 800, fontSize: '0.72rem' }}>HLV 1-1</span>
            </button>

            <button
              onClick={() => onNavigateTab('reminders')}
              style={{
                padding: '10px 6px',
                borderRadius: '16px',
                border: 'none',
                backgroundColor: 'rgba(114, 213, 195, 0.3)',
                color: '#133E35',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>⏰</span>
              <span style={{ fontWeight: 800, fontSize: '0.72rem' }}>Pomodoro</span>
            </button>

            <button
              onClick={() => onNavigateTab('community')}
              style={{
                padding: '10px 6px',
                borderRadius: '16px',
                border: 'none',
                backgroundColor: '#FEDFD2',
                color: '#133E35',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>🏆</span>
              <span style={{ fontWeight: 800, fontSize: '0.72rem' }}>Cộng Đồng</span>
            </button>
          </div>
        </div>
      )}

      {/* Role Switcher */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        padding: '16px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
      }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#133E35' }}>
            Không gian làm việc
          </div>
          <div style={{ fontSize: '0.72rem', color: '#7E9F97' }}>
            Hội Viên / HLV Thể Hình / Admin
          </div>
        </div>
        <button
          onClick={onOpenRoleLogin}
          style={{
            backgroundColor: '#133E35',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '9999px',
            padding: '6px 14px',
            fontSize: '0.76rem',
            fontWeight: 800,
            cursor: 'pointer'
          }}
        >
          Đổi Vai Trò
        </button>
      </div>

      {/* Reset Data */}
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <button
          onClick={handleResetData}
          style={{
            fontSize: '0.76rem',
            color: '#EF4444',
            textDecoration: 'underline',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Thiết lập lại dữ liệu mẫu
        </button>
      </div>
    </div>
  );
};

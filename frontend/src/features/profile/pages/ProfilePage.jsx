import React, { useState } from 'react';
import { 
  User, Mail, Shield, Volume2, VolumeX, Moon, Sun, 
  Settings, LogOut, LogIn, Edit3, Check, ShieldAlert, 
  RotateCcw, Sparkles, Music, HelpCircle, LayoutDashboard, Crown, Star,
  Award, ShieldCheck
} from 'lucide-react';
import { authService } from '../../auth/services/authService';
import { speechCompanion } from '../../ai-coach/services/speechCompanion';
import { soundService } from '../../workout/services/soundService';

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
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(currentUser?.name || '');

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

  const handleSaveName = () => {
    if (!newName.trim()) return;
    const updated = authService.updateProfile({ name: newName.trim() });
    onUserUpdate(updated);
    setIsEditingName(false);
    soundService.playRepBeep();
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
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '6px' }}>Tài Khoản & Cài Đặt</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.94rem' }}>
          Quản lý thông tin cá nhân, cài đặt âm thanh trợ lý và tùy chỉnh trải nghiệm.
        </p>
      </div>

      {/* User Profile Card */}
      <div className="card" style={{ padding: '24px', marginBottom: '20px', border: '1.5px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-brand-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              {currentUser?.avatarEmoji || '🌱'}
            </div>
            <div>
              {isEditingName ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--color-brand-primary)',
                      fontSize: '1rem',
                      fontWeight: 700
                    }}
                  />
                  <button onClick={handleSaveName} className="icon-btn" style={{ width: '36px', height: '36px' }}>
                    <Check size={18} />
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{currentUser?.name || 'Người Dùng Khách'}</h2>
                  <button onClick={() => setIsEditingName(true)} style={{ color: 'var(--color-text-muted)', padding: '4px' }}>
                    <Edit3 size={16} />
                  </button>
                </div>
              )}
              <div style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                {currentUser?.isGuest ? 'Đang dùng chế độ Khách' : currentUser?.email} • Tham gia từ {currentUser?.joinDate || 'Hôm nay'}
              </div>
            </div>
          </div>

          <div>
            {currentUser?.isGuest ? (
              <button
                onClick={onOpenAuth}
                className="btn-primary"
                style={{ padding: '8px 18px', fontSize: '0.9rem', minHeight: '40px' }}
              >
                <LogIn size={16} />
                Đăng Nhập / Đăng Ký
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.88rem', minHeight: '40px' }}
              >
                <LogOut size={16} />
                Đăng Xuất
              </button>
            )}
          </div>
        </div>
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

            <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', lineHeight: 1.45, maxWidth: '440px' }}>
              {currentUser?.plan === 'vip' 
                ? 'Bạn có toàn quyền truy cập vĩnh viễn vào 100% bài tập, camera AI và 02 buổi tham vấn 1-1 cùng Huấn luyện viên thể hình.'
                : currentUser?.plan === 'plus'
                ? `Đang mở khóa toàn bộ bài tập chuyên sâu mọi vùng đau và nhận diện tư thế Camera AI không giới hạn. Hạn dùng: ${currentUser?.planExpiry || '2027-10-28'}.`
                : 'Nâng cấp lên Plus hoặc VIP để mở khóa Camera AI không giới hạn, trọn bộ bài tập mọi vùng đau và trang phục Pip độc quyền.'}
            </p>
          </div>

          <div>
            {currentUser?.plan === 'vip' ? (
              <button
                onClick={onOpenSubscription}
                className="btn-secondary"
                style={{ fontSize: '0.88rem', borderColor: '#F59E0B', color: '#F59E0B' }}
              >
                <Crown size={15} /> Xem Đặc Quyền VIP
              </button>
            ) : currentUser?.plan === 'plus' ? (
              <button
                onClick={onOpenSubscription}
                className="btn-secondary"
                style={{ fontSize: '0.88rem', borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}
              >
                <Crown size={15} /> Nâng Cấp Lên VIP
              </button>
            ) : (
              <button
                onClick={onOpenSubscription}
                className="btn-primary"
                style={{
                  fontSize: '0.9rem',
                  padding: '10px 20px',
                  backgroundColor: 'var(--color-accent)',
                  borderColor: 'var(--color-accent)',
                  boxShadow: '0 4px 14px rgba(255, 107, 74, 0.3)'
                }}
              >
                <Sparkles size={16} /> Mua Gói FitPet Plus
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
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} style={{ color: 'var(--color-brand-primary)' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Phân Quyền & Không Gian Chuyên Biệt</h4>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', marginTop: '4px', margin: 0 }}>
              Mỗi vai trò (Hội viên / HLV / Admin) sở hữu giao diện làm việc độc lập.
            </p>
          </div>

          <button
            onClick={onOpenRoleLogin}
            className="btn-primary"
            style={{ fontSize: '0.82rem', padding: '6px 14px' }}
          >
            <LogIn size={14} /> Đổi Vai Trò Đăng Nhập
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
              Tập luyện nhẹ nhàng, nuôi thú cưng Pip & theo dõi thói quen.
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
              Thẩm định an toàn, duyệt động tác & kê đơn theo vùng đau.
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
              Quản trị người dùng, gói thuê bao & vận hành hệ thống.
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
        <div className="card-subtle" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '16px' }}>
          <ShieldAlert size={20} style={{ color: 'var(--color-brand-primary)', flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            <strong>Cam kết quyền riêng tư:</strong> FitPet xử lý hình ảnh camera nhận diện tư thế và giọng nói hoàn toàn cục bộ trên thiết bị của bạn. Không có video hay dữ liệu sinh trắc học nào được gửi ra ngoài.
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

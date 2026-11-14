import React, { useState } from 'react';
import { 
  ArrowLeft, CheckCircle2, XCircle, Sparkles, Crown, 
  Star, ShieldCheck, Zap, QrCode, RefreshCw, Award, HeartHandshake, Check
} from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../services/subscriptionService';
import { soundService } from '../../workout/services/soundService';

export const SubscriptionPage = ({
  currentUser,
  onBack,
  onOpenCheckout
}) => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const currentPlan = currentUser?.plan || 'free';

  const handleSelect = (plan) => {
    soundService.playTone(523.25, 'sine', 0.15);
    if (onOpenCheckout) {
      onOpenCheckout(plan, billingCycle);
    }
  };

  return (
    <div style={{ width: '100%', paddingBottom: '120px' }}>
      {/* 1. Header with Back Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', paddingTop: '4px' }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#133E35',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            transition: 'transform 0.15s ease'
          }}
          title="Quay lại"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#133E35', margin: 0, lineHeight: 1.2 }}>
            Bảng Giá & Gói Dịch Vụ
          </h1>
          <div style={{ fontSize: '0.78rem', color: '#4A6B63', fontWeight: 600 }}>
            Lựa chọn giải pháp giải tỏa mỏi cơ phù hợp nhất với bạn
          </div>
        </div>
      </div>

      {/* 2. Current User Plan Status Pill */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '18px',
        padding: '12px 16px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid #E2E8F0',
        boxShadow: '0 2px 8px rgba(19, 62, 53, 0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>
            {currentPlan === 'vip' ? '👑' : currentPlan === 'plus' ? '⭐' : '🌱'}
          </span>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#7E9F97', fontWeight: 700, textTransform: 'uppercase' }}>
              Tài khoản hiện tại
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#133E35' }}>
              {currentPlan === 'vip' ? 'FitPet VIP Trọn Đời' : currentPlan === 'plus' ? 'FitPet Premium (59k/Tháng)' : 'Gói Miễn Phí (Cơ Bản)'}
            </div>
          </div>
        </div>
        <span style={{
          fontSize: '0.72rem',
          fontWeight: 800,
          backgroundColor: currentPlan === 'free' ? '#F1F5F9' : '#FEDFD2',
          color: currentPlan === 'free' ? '#64748B' : '#8A4828',
          padding: '4px 10px',
          borderRadius: '9999px'
        }}>
          {currentPlan === 'free' ? 'Đang Dùng Bản Free' : '⭐ Đang Hoạt Động'}
        </span>
      </div>

      {/* 3. Monthly / Yearly Billing Toggle */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '22px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          borderRadius: '9999px',
          padding: '4px',
          border: '1px solid #CBD5E1',
          boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
        }}>
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            style={{
              padding: '7px 18px',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: billingCycle === 'monthly' ? '#133E35' : 'transparent',
              color: billingCycle === 'monthly' ? '#FFFFFF' : '#64748B',
              fontWeight: 800,
              fontSize: '0.84rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Theo Tháng (59k)
          </button>

          <button
            type="button"
            onClick={() => setBillingCycle('yearly')}
            style={{
              padding: '7px 18px',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: billingCycle === 'yearly' ? '#133E35' : 'transparent',
              color: billingCycle === 'yearly' ? '#FFFFFF' : '#64748B',
              fontWeight: 800,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            Theo Năm
            <span style={{
              fontSize: '0.66rem',
              backgroundColor: '#F78C25',
              color: '#FFFFFF',
              padding: '2px 7px',
              borderRadius: '9999px',
              fontWeight: 900
            }}>
              Tiết Kiệm 30%
            </span>
          </button>
        </div>
      </div>

      {/* 4. Detailed Plan Comparison Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
        
        {/* ================= GÓI FITPET PREMIUM (59K / THÁNG) [FEATURED] ================= */}
        <div style={{
          background: 'linear-gradient(135deg, #FFF9F4 0%, #FEDFD2 100%)',
          borderRadius: '26px',
          padding: '22px 20px',
          border: '2.5px solid #F78C25',
          boxShadow: '0 8px 26px -4px rgba(247, 140, 37, 0.28)',
          position: 'relative'
        }}>
          {/* Top Badge */}
          <div style={{
            position: 'absolute',
            top: '-13px',
            left: '20px',
            backgroundColor: '#F78C25',
            color: '#FFFFFF',
            fontSize: '0.74rem',
            fontWeight: 900,
            padding: '3px 14px',
            borderRadius: '9999px',
            boxShadow: '0 3px 10px rgba(247, 140, 37, 0.4)',
            letterSpacing: '0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span>👑</span>
            <span>PHỔ BIẾN NHẤT — KHUYÊN DÙNG</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '6px', marginBottom: '8px' }}>
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#133E35', margin: 0 }}>
                FitPet Premium
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#8A4828', fontWeight: 700, margin: '2px 0 0 0' }}>
                Lựa chọn lý tưởng nhất cho dân văn phòng & người ngồi lâu
              </p>
            </div>
          </div>

          {/* Pricing Highlight */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '14px 0 16px 0', paddingBottom: '14px', borderBottom: '1px solid rgba(247, 140, 37, 0.25)' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#F78C25', lineHeight: 1 }}>
              {billingCycle === 'yearly' ? '499.000 đ' : '59.000 đ'}
            </span>
            <span style={{ fontSize: '0.85rem', color: '#9A3412', fontWeight: 800 }}>
              {billingCycle === 'yearly' ? '/ năm (~41k/tháng)' : '/ tháng'}
            </span>
          </div>

          {/* Allowed Features Section */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#133E35', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.03em' }}>
              ✓ Tính Năng Được Phép Sử Dụng:
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0, margin: 0 }}>
              {[
                '100% trọn bộ bài tập mọi vùng đau (Cổ vai gáy, Thắt lưng, Cổ tay, Mắt, Hông đùi)',
                'Camera AI toàn thân & tự động nhận diện khớp xương, đếm số reps không giới hạn',
                'Kho trang phục & phụ kiện độc quyền nuôi dưỡng bạn nhỏ Mochi',
                'Báo cáo thói quen chuyên sâu & biểu đồ hồi phục thể lực theo tuần',
                'Chuông nhắc nhở công thái học thông minh tránh ngồi tĩnh tại quá 45 phút',
                'Ưu tiên kết nối máy chủ nhận diện AI tốc độ cao nhất',
                'Hủy gia hạn bất cứ lúc nào chỉ với 1 thao tác'
              ].map((feat, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.86rem', color: '#1E293B', lineHeight: 1.4, fontWeight: 600 }}>
                  <CheckCircle2 size={17} style={{ color: '#16A34A', flexShrink: 0, marginTop: '2px' }} />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={() => handleSelect(SUBSCRIPTION_PLANS.find(p => p.id === 'plus') || SUBSCRIPTION_PLANS[1])}
            className="btn-orange"
            style={{
              width: '100%',
              padding: '13px 20px',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 6px 18px rgba(247, 140, 37, 0.4)'
            }}
          >
            <span>👑 Mua Gói Premium {billingCycle === 'yearly' ? '499k/Năm' : '59k/Tháng'}</span>
          </button>
        </div>

        {/* ================= GÓI CƠ BẢN (MIỄN PHÍ — 0 Đ) ================= */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '22px 20px',
          border: '1.5px solid #E2E8F0',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#133E35', margin: 0 }}>
                Gói Miễn Phí (Cơ Bản)
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, margin: '2px 0 0 0' }}>
                Làm quen thói quen vận động nhẹ nhàng không cần trang bị
              </p>
            </div>
            <span style={{
              backgroundColor: '#F1F5F9',
              color: '#475569',
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: '9999px'
            }}>
              MIỄN PHÍ
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '12px 0 16px 0', paddingBottom: '12px', borderBottom: '1px solid #F1F5F9' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: 900, color: '#1E293B', lineHeight: 1 }}>
              0 đ
            </span>
            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
              / Mãi mãi
            </span>
          </div>

          {/* Allowed Features */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#133E35', textTransform: 'uppercase', marginBottom: '8px' }}>
              ✓ Tính Năng Được Phép Sử Dụng:
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, margin: 0 }}>
              {[
                '8+ bài tập khởi động và thả lỏng cơ bản (2-4 phút)',
                'Thú cưng Mochi cơ bản cấp độ 1-5',
                'Giọng nói AI hướng dẫn nhịp thở cơ bản',
                'Nhận diện cử động đầu và cổ vai cơ bản'
              ].map((feat, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.84rem', color: '#334155', lineHeight: 1.4 }}>
                  <CheckCircle2 size={16} style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Not Included / Limits */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '8px' }}>
              ✗ Giới Hạn (Chưa Bao Gồm):
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, margin: 0 }}>
              {[
                'Không có Camera AI toàn thân & đếm số reps không giới hạn',
                'Không có bài tập chuyên sâu theo từng điểm đau mỏi cột sống & cổ tay',
                'Không có trang phục, phụ kiện độc quyền cho Mochi',
                'Không có biểu đồ phân tích thói quen nâng cao'
              ].map((limit, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.82rem', color: '#94A3B8', lineHeight: 1.35 }}>
                  <XCircle size={15} style={{ color: '#CBD5E1', flexShrink: 0, marginTop: '2px' }} />
                  <span>{limit}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            disabled
            style={{
              width: '100%',
              padding: '10px 16px',
              fontSize: '0.88rem',
              fontWeight: 800,
              backgroundColor: '#F1F5F9',
              color: '#64748B',
              borderRadius: '12px',
              border: 'none',
              cursor: 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            {currentPlan === 'free' ? '✓ Gói Bạn Đang Dùng' : 'Gói Cơ Bản Mặc Định'}
          </button>
        </div>

        {/* ================= GÓI FITPET VIP TRỌN ĐỜI (899.000 Đ) ================= */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '22px 20px',
          border: '1.5px solid #FDE68A',
          boxShadow: '0 4px 16px rgba(245, 158, 11, 0.08)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Crown size={20} style={{ color: '#F59E0B' }} />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#133E35', margin: 0 }}>
                  FitPet VIP Trọn Đời
                </h2>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#D97706', fontWeight: 700, margin: '2px 0 0 0' }}>
                Đầu tư 1 lần duy nhất — Sở hữu trọn đời vĩnh viễn
              </p>
            </div>
            <span style={{
              backgroundColor: '#FEF3C7',
              color: '#B45309',
              fontSize: '0.7rem',
              fontWeight: 900,
              padding: '3px 10px',
              borderRadius: '9999px'
            }}>
              VĨNH VIỄN
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '12px 0 16px 0', paddingBottom: '12px', borderBottom: '1px solid #FEF3C7' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: 900, color: '#D97706', lineHeight: 1 }}>
              899.000 đ
            </span>
            <span style={{ fontSize: '0.8rem', color: '#78350F', fontWeight: 700 }}>
              / Thanh toán 1 lần trọn đời
            </span>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#133E35', textTransform: 'uppercase', marginBottom: '8px' }}>
              ✓ Đặc Quyền VIP Đỉnh Cao:
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, margin: 0 }}>
              {[
                'Toàn bộ 100% quyền lợi gói Premium VĨNH VIỄN không giới hạn ngày',
                '02 Buổi tham vấn 1-1 trực tiếp cùng Huấn luyện viên thể hình & vật lý trị liệu',
                'Trọn bộ Skin & Phụ kiện Mochi VIP Hoàng Gia độc quyền',
                'Ưu tiên trải nghiệm đầu tiên các mô hình AI nhận diện tư thế thế hệ mới'
              ].map((feat, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.84rem', color: '#1E293B', lineHeight: 1.4, fontWeight: 600 }}>
                  <Star size={16} style={{ color: '#F59E0B', flexShrink: 0, marginTop: '2px' }} />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={() => handleSelect(SUBSCRIPTION_PLANS.find(p => p.id === 'vip') || SUBSCRIPTION_PLANS[2])}
            style={{
              width: '100%',
              padding: '11px 18px',
              fontSize: '0.92rem',
              fontWeight: 800,
              backgroundColor: '#F59E0B',
              color: '#FFFFFF',
              borderRadius: '14px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
            }}
          >
            <Crown size={16} />
            {currentPlan === 'vip' ? '✓ Bạn Đang Là Thành Viên VIP' : 'Đăng Ký Gói VIP Trọn Đời (899k)'}
          </button>
        </div>

      </div>

      {/* 5. Safe & Secure Commitment Banner */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        border: '1px solid #E2E8F0'
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          backgroundColor: '#DCFCE7',
          color: '#16A34A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <ShieldCheck size={20} />
        </div>
        <div style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.4 }}>
          <strong style={{ color: '#133E35' }}>Thanh toán an toàn 100%:</strong> Quét mã VietQR hoặc ví MoMo tự động kích hoạt ngay lập tức. Bảo lưu lịch sử và cấp độ thú cưng Mochi vĩnh viễn.
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;

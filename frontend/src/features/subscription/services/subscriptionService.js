/**
 * FitPet Subscription & Plan Purchase Service
 * Quản lý các gói thành viên (Gói Miễn Phí, FitPet Plus, FitPet VIP Trọn Đời).
 * Hỗ trợ tính toán khuyến mãi, tạo mã thanh toán VietQR / MoMo và nâng cấp tài khoản.
 */

import { authService } from '../../auth/services/authService';
import { userService } from '../../auth/services/userService';

export const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Gói Cơ Bản',
    tagline: 'Làm quen thói quen vận động nhẹ nhàng',
    badge: 'Miễn Phí',
    monthlyPrice: 0,
    yearlyPrice: 0,
    priceDisplayMonthly: '0 đ',
    priceDisplayYearly: '0 đ',
    periodText: 'Mãi mãi',
    isPopular: false,
    color: '#10B981',
    features: [
      '8+ bài tập nhẹ nhàng không dụng cụ (2-4 phút)',
      'Thú cưng Pip trạng thái cơ bản khích lệ hàng ngày',
      'Giọng nói AI hướng dẫn nhịp thở tiêu chuẩn',
      'Tự động ghi nhận lịch sử tập luyện trên máy',
      'Camera AI nhận diện tư thế cơ bản (3 lần/tuần)'
    ],
    notIncluded: [
      'Không giới hạn Camera AI phân tích tư thế',
      'Kho bài tập chuyên sâu theo từng điểm đau',
      'Trang phục & phụ kiện đặc biệt cho Pip',
      'Tư vấn trực tiếp 1-1 với Chuyên gia thể hình'
    ]
  },
  {
    id: 'plus',
    name: 'FitPet Plus',
    tagline: 'Giải pháp hoàn hảo cho dân văn phòng ngồi nhiều',
    badge: 'Phổ Biến Nhất',
    monthlyPrice: 59000,
    yearlyPrice: 499000, // ~41.500đ/tháng (Tiết kiệm 30%)
    priceDisplayMonthly: '59.000 đ',
    priceDisplayYearly: '499.000 đ',
    periodText: '/ tháng',
    periodTextYearly: '/ năm (~41k/tháng)',
    isPopular: true,
    color: '#FF6B4A',
    features: [
      '⭐ Mở khóa 100% kho bài tập chuyên sâu mọi vùng đau',
      '📸 Camera AI nhận diện tư thế KHÔNG GIỚI HẠN & đếm reps',
      '🗣️ Trợ lý giọng nói AI siêu thực với nhịp thở sống động',
      '🎽 Bộ sưu tập trang phục & phụ kiện độc quyền cho Pip (Mũ, Kính, Băng đô)',
      '📊 Báo cáo phân tích sinh trắc học & thói quen tuần chuyên sâu',
      '🚀 Chế độ Tải bài tập để sử dụng ngoại tuyến (Offline Mode)',
      '🛡️ Bảo toàn chuỗi thói quen không phán xét'
    ],
    notIncluded: [
      'Tư vấn trực tiếp 1-1 với Chuyên gia thể hình'
    ]
  },
  {
    id: 'vip',
    name: 'FitPet VIP Trọn Đời',
    tagline: 'Đầu tư sức khỏe dài hạn một lần duy nhất',
    badge: 'Tiết Kiệm Nhất',
    monthlyPrice: 899000,
    yearlyPrice: 899000,
    priceDisplayMonthly: '899.000 đ',
    priceDisplayYearly: '899.000 đ',
    periodText: 'Thanh toán 1 lần duy nhất (Trọn đời)',
    periodTextYearly: 'Thanh toán 1 lần duy nhất (Trọn đời)',
    isPopular: false,
    color: '#F59E0B',
    features: [
      '👑 Toàn bộ quyền lợi của FitPet Plus VĨNH VIỄN (Không phí duy trì)',
      '🩺 02 Buổi tham vấn 1-1 trực tuyến với Chuyên gia thể hình kiểm định',
      '💎 Huy hiệu Kim Cương VIP độc quyền trên hồ sơ cá nhân',
      '🏆 Trọn bộ Skin huyền thoại cho thú cưng Pip',
      '⚡ Quyền trải nghiệm sớm các mô hình AI nhận diện tư thế thế hệ mới',
      '🎁 Quà tặng cẩm nang công thái học (Ergonomics Guidebook PDF)'
    ],
    notIncluded: []
  }
];

export const VALID_COUPONS = {
  'FITPET2026': { code: 'FITPET2026', discountPercent: 20, desc: 'Giảm 20% cho thành viên mới' },
  'CHAO2026': { code: 'CHAO2026', discountPercent: 15, desc: 'Giảm 15% chào đón 2026' },
  'DESKWORKER': { code: 'DESKWORKER', discountAmount: 30000, desc: 'Trợ giá 30.000đ cho dân văn phòng' },
  'VIPGOLD': { code: 'VIPGOLD', discountPercent: 25, desc: 'Giảm 25% gói VIP trọn đời' }
};

class SubscriptionService {
  constructor() {
    this.STORAGE_KEY = 'fitpet_user_subscription';
  }

  getPlans() {
    return SUBSCRIPTION_PLANS;
  }

  getPlanById(planId) {
    return SUBSCRIPTION_PLANS.find(p => p.id === planId) || SUBSCRIPTION_PLANS[0];
  }

  validateCoupon(code, rawAmount) {
    if (!code) return { valid: false, message: '' };
    const clean = code.trim().toUpperCase();
    const coupon = VALID_COUPONS[clean];

    if (!coupon) {
      return { valid: false, message: 'Mã giảm giá không tồn tại hoặc đã hết hạn.' };
    }

    let discount = 0;
    if (coupon.discountPercent) {
      discount = Math.round((rawAmount * coupon.discountPercent) / 100);
    } else if (coupon.discountAmount) {
      discount = Math.min(rawAmount, coupon.discountAmount);
    }

    const finalAmount = Math.max(0, rawAmount - discount);
    return {
      valid: true,
      coupon,
      discount,
      finalAmount,
      message: `Áp dụng thành công mã ${coupon.code}: ${coupon.desc}`
    };
  }

  getCurrentSubscription() {
    const user = authService.getCurrentUser();
    if (user && user.plan && user.plan !== 'free') {
      return {
        planId: user.plan,
        planName: user.planName || (user.plan === 'vip' ? 'FitPet VIP Trọn Đời' : 'FitPet Plus'),
        billingCycle: user.billingCycle || 'yearly',
        status: 'active',
        expiryDate: user.planExpiry || '2027-10-28',
        activatedDate: user.planActivatedDate || '2026-10-28'
      };
    }

    return {
      planId: 'free',
      planName: 'Gói Cơ Bản (Miễn Phí)',
      billingCycle: 'none',
      status: 'active',
      expiryDate: 'Vĩnh viễn',
      activatedDate: '2026-10-01'
    };
  }

  generateVietQRData({ plan, billingCycle, finalAmount, user }) {
    const amount = finalAmount;
    const memo = `FITPET ${user?.id ? user.id.replace('user-', '') : 'DEMO'} ${plan.id.toUpperCase()}`;
    const bankCode = 'MB'; // MBBank Quân Đội
    const accountNo = '091234567899';
    const accountName = 'FITPET FITNESS TECH JSC';
    
    // QuickChart / QR server URL for realistic scannable QR
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=https://vietqr.me/${bankCode}/${accountNo}/${amount}/${encodeURIComponent(memo)}&color=064e3b`;

    return {
      bankName: 'Ngân hàng Quân Đội (MBBank)',
      accountNo,
      accountName,
      amount,
      memo,
      qrUrl
    };
  }

  upgradePlan({ planId, billingCycle = 'yearly', paymentMethod = 'vietqr', transactionCode = null }) {
    const currentUser = authService.getCurrentUser();
    const targetPlan = this.getPlanById(planId);

    const now = new Date();
    let expiryDate = 'Vĩnh viễn';
    if (planId === 'plus') {
      const exp = new Date(now);
      if (billingCycle === 'monthly') {
        exp.setMonth(exp.getMonth() + 1);
      } else {
        exp.setFullYear(exp.getFullYear() + 1);
      }
      expiryDate = exp.toLocaleDateString('vi-VN');
    }

    const updatedUser = {
      ...currentUser,
      plan: planId,
      planName: targetPlan.name,
      billingCycle,
      planExpiry: expiryDate,
      planActivatedDate: now.toLocaleDateString('vi-VN'),
      vipBadge: planId === 'vip' ? '💎 VIP Lifetime' : planId === 'plus' ? '⭐ Plus Member' : null,
      avatarEmoji: planId === 'vip' ? '👑' : planId === 'plus' ? '🌟' : currentUser.avatarEmoji || '🌱',
      unlockedOutfits: ['sport_cap', 'headband', 'sunglasses']
    };

    // Save to user session
    authService.saveUser(updatedUser);

    // If registered in users database, update there too
    if (currentUser.id && currentUser.id !== 'guest') {
      userService.updateUser(currentUser.id, {
        plan: planId,
        planName: targetPlan.name,
        planExpiry: expiryDate,
        vipBadge: updatedUser.vipBadge
      });
    }

    return {
      success: true,
      user: updatedUser,
      plan: targetPlan,
      transactionId: transactionCode || 'TXN-' + Date.now().toString().slice(-6),
      timestamp: now.toISOString()
    };
  }

  cancelSubscription() {
    const currentUser = authService.getCurrentUser();
    const updatedUser = {
      ...currentUser,
      plan: 'free',
      planName: 'Gói Cơ Bản',
      billingCycle: 'none',
      planExpiry: null,
      vipBadge: null,
      avatarEmoji: '🌱'
    };

    authService.saveUser(updatedUser);
    if (currentUser.id && currentUser.id !== 'guest') {
      userService.updateUser(currentUser.id, {
        plan: 'free',
        planName: 'Gói Cơ Bản',
        planExpiry: null,
        vipBadge: null
      });
    }

    return updatedUser;
  }
}

export const subscriptionService = new SubscriptionService();

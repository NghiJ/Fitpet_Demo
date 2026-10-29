import React, { useState } from 'react';
import { 
  X, Check, Sparkles, ShieldCheck, Crown, Zap, ArrowRight,
  QrCode, CreditCard, Smartphone, Copy, CheckCircle2, AlertCircle,
  HelpCircle, RefreshCw, Star, Heart
} from 'lucide-react';
import { subscriptionService, SUBSCRIPTION_PLANS } from '../services/subscriptionService';
import { soundService } from '../../workout/services/soundService';
import { VirtualPet } from '../../pet/components/VirtualPet';

export const SubscriptionModal = ({
  isOpen,
  onClose,
  currentUser,
  onSubscriptionSuccess
}) => {
  // Billing cycle: 'monthly' | 'yearly'
  const [billingCycle, setBillingCycle] = useState('yearly');
  
  // Selected plan for checkout: null | plan object
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Checkout flow state: 'select' | 'payment' | 'success'
  const [checkoutStep, setCheckoutStep] = useState('select');

  // Payment method: 'vietqr' | 'momo' | 'card'
  const [paymentMethod, setPaymentMethod] = useState('vietqr');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponFeedback, setCouponFeedback] = useState(null);
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  // Copied feedback
  const [copiedField, setCopiedField] = useState(null);

  // Loading state for payment simulation
  const [isProcessing, setIsProcessing] = useState(false);
  const [successDetails, setSuccessDetails] = useState(null);

  if (!isOpen) return null;

  const currentPlanId = currentUser?.plan || 'free';

  // Calculate pricing for a plan
  const getPlanPrice = (plan) => {
    if (plan.id === 'free') return 0;
    if (plan.id === 'vip') return plan.monthlyPrice;
    return billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
  };

  const handleSelectPlan = (plan) => {
    if (plan.id === 'free') {
      return;
    }
    soundService.playTone(523.25, 'sine', 0.15);
    setSelectedPlan(plan);
    setCheckoutStep('payment');
    setCouponCode('');
    setCouponFeedback(null);
    setAppliedDiscount(0);
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!selectedPlan || !couponCode.trim()) return;

    const rawPrice = getPlanPrice(selectedPlan);
    const result = subscriptionService.validateCoupon(couponCode, rawPrice);

    if (result.valid) {
      setAppliedDiscount(result.discount);
      setCouponFeedback({ type: 'success', message: result.message });
      soundService.playRepBeep();
    } else {
      setAppliedDiscount(0);
      setCouponFeedback({ type: 'error', message: result.message });
    }
  };

  const handleCopyText = (text, fieldName) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleCompletePayment = (isDemoInstant = false) => {
    if (!selectedPlan) return;

    setIsProcessing(true);
    soundService.playTone(659.25, 'sine', 0.15);

    setTimeout(() => {
      const result = subscriptionService.upgradePlan({
        planId: selectedPlan.id,
        billingCycle,
        paymentMethod
      });

      setIsProcessing(false);
      setSuccessDetails(result);
      setCheckoutStep('success');

      // Play victory fanfare
      soundService.playVictory();

      if (onSubscriptionSuccess) {
        onSubscriptionSuccess(result.user);
      }
    }, isDemoInstant ? 600 : 1500);
  };

  const currentRawPrice = selectedPlan ? getPlanPrice(selectedPlan) : 0;
  const finalAmount = Math.max(0, currentRawPrice - appliedDiscount);

  const qrData = selectedPlan ? subscriptionService.generateVietQRData({
    plan: selectedPlan,
    billingCycle,
    finalAmount,
    user: currentUser
  }) : null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()} 
        style={{ 
          maxWidth: checkoutStep === 'select' ? '860px' : '620px',
          padding: '28px 24px',
          maxHeight: '92vh',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="icon-btn"
          style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10 }}
          aria-label="Đóng bảng mua gói"
        >
          <X size={20} />
        </button>

        {/* ================= STEP 1: SELECT PLAN TIER ================= */}
        {checkoutStep === 'select' && (
          <div>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '24px', maxWidth: '580px', margin: '0 auto 24px auto' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(255, 107, 74, 0.12)',
                color: 'var(--color-accent)',
                fontSize: '0.82rem',
                fontWeight: 800,
                marginBottom: '10px'
              }}>
                <Sparkles size={14} /> Nâng Cấp Trải Nghiệm FitPet
              </div>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '8px' }}>
                Chọn Gói Đồng Hành Cùng Bạn
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.94rem', lineHeight: 1.5 }}>
                Không áp lực, không phán xét. Tận hưởng các bài tập công thái học chuyên sâu, camera nhận diện tư thế và sự chăm sóc ân cần từ thú cưng Pip.
              </p>

              {/* Billing Cycle Toggle */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: 'var(--color-surface-subtle)',
                borderRadius: 'var(--radius-full)',
                padding: '4px',
                marginTop: '16px',
                border: '1px solid var(--color-border)'
              }}>
                <button
                  onClick={() => setBillingCycle('monthly')}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    backgroundColor: billingCycle === 'monthly' ? 'var(--color-surface)' : 'transparent',
                    color: billingCycle === 'monthly' ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    boxShadow: billingCycle === 'monthly' ? 'var(--shadow-sm)' : 'none',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  Thanh Toán Hàng Tháng
                </button>

                <button
                  onClick={() => setBillingCycle('yearly')}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    backgroundColor: billingCycle === 'yearly' ? 'var(--color-brand-primary)' : 'transparent',
                    color: billingCycle === 'yearly' ? '#FFFFFF' : 'var(--color-text-muted)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: billingCycle === 'yearly' ? 'var(--shadow-brand)' : 'none',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  Thanh Toán Hàng Năm
                  <span style={{
                    fontSize: '0.7rem',
                    backgroundColor: '#FFFFFF',
                    color: 'var(--color-brand-dark)',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 800
                  }}>
                    Tiết kiệm 30%
                  </span>
                </button>
              </div>
            </div>

            {/* Plan Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '18px',
              marginBottom: '28px'
            }}>
              {SUBSCRIPTION_PLANS.map((plan) => {
                const isCurrent = currentPlanId === plan.id;
                const priceText = billingCycle === 'yearly' ? plan.priceDisplayYearly : plan.priceDisplayMonthly;
                const periodText = billingCycle === 'yearly' && plan.periodTextYearly ? plan.periodTextYearly : plan.periodText;

                return (
                  <div
                    key={plan.id}
                    className="card"
                    style={{
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '24px 20px',
                      border: plan.isPopular 
                        ? '2.5px solid var(--color-accent)' 
                        : isCurrent 
                        ? '2px solid var(--color-brand-primary)' 
                        : '1.5px solid var(--color-border)',
                      backgroundColor: plan.isPopular ? 'var(--color-surface)' : 'var(--color-surface)',
                      borderRadius: 'var(--radius-xl)',
                      boxShadow: plan.isPopular ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                      transform: plan.isPopular ? 'scale(1.02)' : 'none',
                      transition: 'all var(--transition-normal)'
                    }}
                  >
                    {/* Badge */}
                    {plan.badge && (
                      <div style={{
                        position: 'absolute',
                        top: '-12px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: plan.id === 'plus' ? 'var(--color-accent)' : plan.id === 'vip' ? '#F59E0B' : 'var(--color-brand-primary)',
                        color: '#FFFFFF',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        padding: '3px 12px',
                        borderRadius: 'var(--radius-full)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        letterSpacing: '0.02em',
                        whiteSpace: 'nowrap'
                      }}>
                        {plan.badge}
                      </div>
                    )}

                    {/* Plan Header */}
                    <div style={{ marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {plan.id === 'vip' && <Crown size={18} style={{ color: '#F59E0B' }} />}
                        {plan.id === 'plus' && <Star size={18} style={{ color: 'var(--color-accent)' }} />}
                        {plan.name}
                      </h3>
                      <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', minHeight: '36px', lineHeight: 1.4 }}>
                        {plan.tagline}
                      </p>
                    </div>

                    {/* Plan Pricing */}
                    <div style={{ marginBottom: '20px', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                        <span style={{ fontSize: '1.9rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                          {priceText}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                          {periodText}
                        </span>
                      </div>
                    </div>

                    {/* Plan Features Checklist */}
                    <div style={{ flex: 1, marginBottom: '24px' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '10px' }}>
                        Quyền lợi bao gồm:
                      </div>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem' }}>
                        {plan.features.map((feat, idx) => (
                          <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: 1.4 }}>
                            <CheckCircle2 size={15} style={{ color: plan.color, flexShrink: 0, marginTop: '2px' }} />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Button */}
                    <div style={{ marginTop: 'auto' }}>
                      {isCurrent ? (
                        <button
                          disabled
                          className="btn-secondary"
                          style={{ width: '100%', opacity: 0.7, cursor: 'default', justifyContent: 'center' }}
                        >
                          <Check size={16} /> Gói Bạn Đang Dùng
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSelectPlan(plan)}
                          className={plan.isPopular ? 'btn-primary' : 'btn-secondary'}
                          style={{
                            width: '100%',
                            justifyContent: 'center',
                            backgroundColor: plan.id === 'vip' ? '#F59E0B' : undefined,
                            borderColor: plan.id === 'vip' ? '#F59E0B' : undefined,
                            color: plan.id === 'vip' ? '#FFFFFF' : undefined,
                            padding: '10px 16px',
                            fontWeight: 700
                          }}
                        >
                          Chọn {plan.name} <ArrowRight size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reassurance Banner */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              padding: '14px',
              backgroundColor: 'var(--color-surface-subtle)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              flexWrap: 'wrap',
              fontSize: '0.82rem',
              color: 'var(--color-text-secondary)'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} style={{ color: 'var(--color-brand-primary)' }} /> Cam kết bảo mật 100%
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Heart size={16} style={{ color: 'var(--color-accent)' }} /> Hủy đăng ký bất kỳ lúc nào
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} style={{ color: '#F59E0B' }} /> Hỗ trợ khách hàng 24/7
              </span>
            </div>
          </div>
        )}

        {/* ================= STEP 2: CHECKOUT & PAYMENT ================= */}
        {checkoutStep === 'payment' && selectedPlan && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--color-border)', paddingBottom: '14px' }}>
              <button 
                onClick={() => setCheckoutStep('select')}
                className="btn-ghost"
                style={{ padding: '6px 10px', fontSize: '0.82rem' }}
              >
                ← Chọn gói khác
              </button>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                Thanh Toán Nâng Cấp {selectedPlan.name}
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {/* Left Column: Order Summary & Coupon */}
              <div>
                <div className="card" style={{ padding: '18px', backgroundColor: 'var(--color-surface-subtle)', marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '10px' }}>
                    Chi tiết đơn hàng
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                    <span style={{ fontWeight: 700 }}>{selectedPlan.name} ({billingCycle === 'yearly' ? 'Gói 1 Năm' : 'Gói 1 Tháng'})</span>
                    <span style={{ fontWeight: 700 }}>{currentRawPrice.toLocaleString('vi-VN')} đ</span>
                  </div>

                  {appliedDiscount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem', color: '#10B981', fontWeight: 700 }}>
                      <span>Mã giảm giá áp dụng</span>
                      <span>-{appliedDiscount.toLocaleString('vi-VN')} đ</span>
                    </div>
                  )}

                  <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '10px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 800, fontSize: '1rem' }}>Tổng thanh toán:</span>
                    <span style={{ fontWeight: 900, fontSize: '1.45rem', color: 'var(--color-accent)' }}>
                      {finalAmount.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>

                {/* Coupon Form */}
                <form onSubmit={handleApplyCoupon} style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
                    Mã Ưu Đãi / Khuyến Mãi (Thử: FITPET2026, CHAO2026, DESKWORKER)
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Nhập mã ưu đãi..."
                      style={{
                        flex: 1,
                        padding: '9px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        textTransform: 'uppercase',
                        fontWeight: 700
                      }}
                    />
                    <button
                      type="submit"
                      className="btn-secondary"
                      style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                    >
                      Áp Dụng
                    </button>
                  </div>
                  {couponFeedback && (
                    <div style={{
                      marginTop: '6px',
                      fontSize: '0.78rem',
                      color: couponFeedback.type === 'success' ? '#10B981' : '#EF4444',
                      fontWeight: 600
                    }}>
                      {couponFeedback.message}
                    </div>
                  )}
                </form>

                {/* Payment Methods Tabs */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px' }}>
                    Chọn phương thức thanh toán
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('vietqr')}
                      style={{
                        padding: '10px 8px',
                        borderRadius: 'var(--radius-md)',
                        border: `1.5px solid ${paymentMethod === 'vietqr' ? 'var(--color-brand-primary)' : 'var(--color-border)'}`,
                        backgroundColor: paymentMethod === 'vietqr' ? 'var(--color-brand-light)' : 'var(--color-surface)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.78rem',
                        fontWeight: 700
                      }}
                    >
                      <QrCode size={20} color="var(--color-brand-primary)" />
                      VietQR
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('momo')}
                      style={{
                        padding: '10px 8px',
                        borderRadius: 'var(--radius-md)',
                        border: `1.5px solid ${paymentMethod === 'momo' ? '#A21CAF' : 'var(--color-border)'}`,
                        backgroundColor: paymentMethod === 'momo' ? 'rgba(162, 28, 175, 0.1)' : 'var(--color-surface)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.78rem',
                        fontWeight: 700
                      }}
                    >
                      <Smartphone size={20} color="#A21CAF" />
                      Ví MoMo
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      style={{
                        padding: '10px 8px',
                        borderRadius: 'var(--radius-md)',
                        border: `1.5px solid ${paymentMethod === 'card' ? '#0EA5E9' : 'var(--color-border)'}`,
                        backgroundColor: paymentMethod === 'card' ? 'rgba(14, 165, 233, 0.1)' : 'var(--color-surface)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.78rem',
                        fontWeight: 700
                      }}
                    >
                      <CreditCard size={20} color="#0EA5E9" />
                      Thẻ Visa
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Dynamic Payment View */}
              <div>
                {paymentMethod === 'vietqr' && qrData && (
                  <div className="card" style={{ padding: '20px', textAlign: 'center', backgroundColor: 'var(--color-surface)' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--color-brand-primary)', marginBottom: '8px' }}>
                      Quét mã VietQR chuyển khoản tự động
                    </div>
                    
                    {/* QR Code Frame */}
                    <div style={{
                      display: 'inline-block',
                      padding: '10px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-sm)',
                      marginBottom: '12px'
                    }}>
                      <img 
                        src={qrData.qrUrl} 
                        alt="Mã QR Chuyển Khoản FitPet"
                        style={{ width: '180px', height: '180px', display: 'block', objectFit: 'contain' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>

                    {/* Bank Info Details with Quick Copy */}
                    <div style={{ textAlign: 'left', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-md)', padding: '12px', fontSize: '0.82rem', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ color: 'var(--color-text-muted)' }}>Ngân hàng:</span>
                        <strong>{qrData.bankName}</strong>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ color: 'var(--color-text-muted)' }}>Số tài khoản:</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <strong>{qrData.accountNo}</strong>
                          <button
                            type="button"
                            onClick={() => handleCopyText(qrData.accountNo, 'stk')}
                            className="btn-ghost"
                            style={{ padding: '2px 4px', height: '22px' }}
                            title="Sao chép STK"
                          >
                            {copiedField === 'stk' ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ color: 'var(--color-text-muted)' }}>Chủ tài khoản:</span>
                        <strong>{qrData.accountName}</strong>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ color: 'var(--color-text-muted)' }}>Nội dung CK:</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <strong style={{ color: 'var(--color-accent)' }}>{qrData.memo}</strong>
                          <button
                            type="button"
                            onClick={() => handleCopyText(qrData.memo, 'memo')}
                            className="btn-ghost"
                            style={{ padding: '2px 4px', height: '22px' }}
                            title="Sao chép nội dung"
                          >
                            {copiedField === 'memo' ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--color-text-muted)' }}>Số tiền:</span>
                        <strong style={{ color: 'var(--color-brand-primary)' }}>{finalAmount.toLocaleString('vi-VN')} đ</strong>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'momo' && (
                  <div className="card" style={{ padding: '24px 16px', textAlign: 'center' }}>
                    <Smartphone size={40} color="#A21CAF" style={{ margin: '0 auto 12px auto' }} />
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '6px' }}>Thanh Toán Qua Ví MoMo</h4>
                    <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                      Mở ứng dụng MoMo trên điện thoại để quét mã và xác thực giao dịch một chạm.
                    </p>
                    <div style={{ backgroundColor: 'var(--color-surface-subtle)', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '16px' }}>
                      Số tiền cần thanh toán: <strong style={{ color: '#A21CAF' }}>{finalAmount.toLocaleString('vi-VN')} đ</strong>
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                      <CreditCard size={20} color="#0EA5E9" />
                      <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>Thẻ Tín Dụng / Ghi Nợ Quốc Tế</h4>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>Số thẻ</label>
                        <input type="text" placeholder="4123 •••• •••• 9876" style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>Hạn dùng</label>
                          <input type="text" placeholder="MM/YY" style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>CVC/CVV</label>
                          <input type="text" placeholder="123" style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Final Checkout Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
                  <button
                    onClick={() => handleCompletePayment(false)}
                    disabled={isProcessing}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '12px 20px', fontSize: '0.96rem' }}
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw size={18} className="spin" style={{ marginRight: '8px' }} /> Đang xử lý thanh toán...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={18} /> Tôi Đã Chuyển Khoản Thành Công
                      </>
                    )}
                  </button>

                  {/* 1-Click Instant Demo Button */}
                  <button
                    onClick={() => handleCompletePayment(true)}
                    disabled={isProcessing}
                    className="btn-secondary"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      fontSize: '0.82rem',
                      borderColor: 'var(--color-brand-primary)',
                      color: 'var(--color-brand-primary)'
                    }}
                    title="Hoàn tất nâng cấp ngay lập tức để thử nghiệm tính năng"
                  >
                    <Zap size={14} style={{ marginRight: '6px' }} />
                    Thanh Toán Thử Nghiệm Ngay (Demo Instant 1-Click)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 3: CELEBRATION & SUCCESS ================= */}
        {checkoutStep === 'success' && successDetails && (
          <div style={{ textAlign: 'center', padding: '16px 8px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              boxShadow: 'var(--shadow-brand)'
            }}>
              <Sparkles size={32} />
            </div>

            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '6px' }}>
              Chúc Mừng Bạn Đã Nâng Cấp Thành Công!
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.94rem', maxWidth: '480px', margin: '0 auto 20px auto' }}>
              Bạn hiện là thành viên <strong>{successDetails.plan.name}</strong> của FitPet. Toàn bộ các quyền lợi cao cấp đã được mở khóa ngay lập tức trên tài khoản của bạn.
            </p>

            {/* Cheering Pip Pet */}
            <div style={{ marginBottom: '20px' }}>
              <VirtualPet
                state="cheering"
                size="md"
                message="Pip đã mở khóa trang phục mới và sẵn sàng cùng bạn tập luyện mỗi ngày!"
                showSpeechBubble={true}
              />
            </div>

            {/* Unlocked Benefits Summary Card */}
            <div className="card" style={{ padding: '18px', textAlign: 'left', backgroundColor: 'var(--color-surface-subtle)', maxWidth: '440px', margin: '0 auto 24px auto' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-brand-primary)', marginBottom: '8px' }}>
                Đặc quyền của bạn đã được kích hoạt:
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.84rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={14} color="#10B981" /> Mở khóa 100% bài tập mọi vùng đau cổ vai, thắt lưng
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={14} color="#10B981" /> Nhận diện tư thế Camera AI không giới hạn
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={14} color="#10B981" /> Mở khóa trang phục Mũ & Băng đô cho thú cưng Pip
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={14} color="#10B981" /> Huy hiệu {successDetails.user.vipBadge || 'Thành viên Plus'}
                </li>
              </ul>
            </div>

            <button
              onClick={onClose}
              className="btn-primary"
              style={{ padding: '12px 32px', fontSize: '1rem', minWidth: '220px' }}
            >
              Bắt Đầu Trải Nghiệm Ngay
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

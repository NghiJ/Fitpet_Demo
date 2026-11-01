import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, Calendar, MessageSquare, Video, ShieldCheck, 
  Clock, CheckCircle2, User, Play, ChevronRight, Send, AlertCircle, Sparkles, BookOpen
} from 'lucide-react';
import { consultationService } from '../services/consultationService';
import { CURATED_WORKOUTS } from '../../workout/data/curatedWorkouts';
import { soundService } from '../../workout/services/soundService';

export const ConsultationPage = ({ onStartWorkout, currentUser, onOpenSubscription }) => {
  const [data, setData] = useState(() => consultationService.getData());
  const [activeTab, setActiveTab] = useState('prescription'); // 'prescription' | 'appointments' | 'chat' | 'ergonomics'
  const [bookingDate, setBookingDate] = useState('2026-11-05');
  const [bookingTime, setBookingTime] = useState('14:30 - 15:00');
  const [bookingTopic, setBookingTopic] = useState('Đánh giá tình trạng đau mỏi cổ vai khi ngồi máy tính');
  const [chatInput, setChatInput] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    const unsub = consultationService.subscribe(setData);
    return () => unsub();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleBookSubmit = (e) => {
    e.preventDefault();
    if (!bookingTopic.trim()) return;

    consultationService.bookAppointment({
      coachName: 'Phạm Phương Anh',
      coachTitle: 'HLV Phục Hồi Thể Hình FitPet',
      date: bookingDate,
      timeSlot: bookingTime,
      topic: bookingTopic.trim()
    });

    soundService.playVictory();
    showToast('🎉 Đặt lịch hẹn tham vấn 1-1 thành công! HLV sẽ chuẩn bị trước hồ sơ của bạn.');
    setActiveTab('appointments');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    consultationService.sendMessage(chatInput);
    setChatInput('');
  };

  const { activePrescription, appointments, chatMessages } = data;

  return (
    <div style={{ maxWidth: '740px', margin: '0 auto', width: '100%', paddingBottom: 'var(--space-12)' }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '16px',
          left: '16px',
          maxWidth: '380px',
          margin: '0 auto',
          zIndex: 1000,
          backgroundColor: '#8B5CF6',
          color: '#FFFFFF',
          padding: '10px 16px',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.86rem',
          fontWeight: 700
        }}>
          <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '18px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', fontWeight: 800, color: '#8B5CF6', marginBottom: '4px' }}>
          <Stethoscope size={15} /> Tham Vấn Chuyên Gia & Trợ Lý FitPet AI
        </div>
        <h1 style={{ fontSize: 'clamp(1.35rem, 5vw, 1.75rem)', fontWeight: 800, marginBottom: '6px' }}>
          Tư Vấn & Phác Đồ Riêng
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem', lineHeight: 1.5 }}>
          Được thiết lập bởi Huấn luyện viên phục hồi chức năng dành riêng cho thể trạng của bạn.
        </p>
      </div>

      {/* 4 Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '2px solid var(--color-border)',
        marginBottom: '22px',
        overflowX: 'auto',
        scrollbarWidth: 'none'
      }}>
        {[
          { id: 'prescription', label: 'Phác Đồ Của Bạn', icon: Stethoscope },
          { id: 'appointments', label: 'Lịch Tham Vấn 1-1', icon: Calendar },
          { id: 'chat', label: 'Trò Chuyện & Hỏi Đáp', icon: MessageSquare },
          { id: 'ergonomics', label: 'Cẩm Nang Ghế Ngồi', icon: BookOpen }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 16px',
                fontSize: '0.9rem',
                fontWeight: 800,
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: isActive ? '3px solid #8B5CF6' : '3px solid transparent',
                color: isActive ? '#7C3AED' : 'var(--color-text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: PHÁC ĐỒ CỦA BẠN ================= */}
      {activeTab === 'prescription' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Coach Attribution Card */}
          <div className="card" style={{
            padding: '22px',
            border: '2px solid #8B5CF6',
            backgroundColor: 'rgba(139, 92, 246, 0.04)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: '#8B5CF6',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.6rem',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {activePrescription.coachAvatar}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                      {activePrescription.coachName}
                    </h3>
                    <span className="badge" style={{ backgroundColor: 'rgba(139, 92, 246, 0.15)', color: '#7C3AED', fontSize: '0.72rem', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                      HLV Phụ Trách
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    {activePrescription.coachTitle} • Kê đơn ngày {activePrescription.assignedDate}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-brand" style={{ fontSize: '0.74rem' }}>
                  Đang Áp Dụng
                </span>
                <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Hiệu lực đến {activePrescription.validUntil}
                </div>
              </div>
            </div>

            {/* Diagnosis & clinical notes */}
            <div style={{
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              marginBottom: '16px'
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                ĐÁNH GIÁ THỂ TRẠNG VĂN PHÒNG:
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--color-text-primary)', fontWeight: 600, lineHeight: 1.5 }}>
                {activePrescription.diagnosis}
              </div>
              <div style={{ fontSize: '0.84rem', color: '#7C3AED', marginTop: '6px', fontStyle: 'italic' }}>
                💬 Lời dặn của HLV: "{activePrescription.notes}"
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                ⏱ Tần suất khuyên dùng: <strong>{activePrescription.dailyFrequency}</strong>
              </div>
            </div>

            {/* Prescribed workouts list */}
            <div>
              <h4 style={{ fontSize: '0.96rem', fontWeight: 800, marginBottom: '10px' }}>
                Danh Sách Bài Tập Được Chỉ Định:
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activePrescription.prescribedWorkouts.map((pw, i) => {
                  const fullWorkout = CURATED_WORKOUTS.find(w => w.id === pw.workoutId) || CURATED_WORKOUTS[0];
                  return (
                    <div
                      key={pw.workoutId}
                      style={{
                        padding: '14px 16px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--color-surface)',
                        border: '1.5px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            backgroundColor: '#8B5CF6',
                            color: '#FFFFFF',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {i + 1}
                          </span>
                          <span style={{ fontWeight: 800, fontSize: '0.98rem' }}>{pw.title}</span>
                          <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>{pw.targetArea}</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginLeft: '30px' }}>
                          ⚠️ Lưu ý kỹ thuật: {pw.keyNotice}
                        </div>
                      </div>

                      <button
                        onClick={() => onStartWorkout(fullWorkout)}
                        className="btn-primary"
                        style={{ padding: '8px 16px', fontSize: '0.86rem', backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' }}
                      >
                        <Play size={14} fill="currentColor" /> Tập Ngay ({pw.durationMinutes}p)
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: LỊCH THAM VẤN 1-1 ================= */}
      {activeTab === 'appointments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Existing appointments */}
          <div className="card" style={{ padding: '22px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '14px' }}>
              Lịch Hẹn Của Bạn
            </h3>

            {appointments.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                Bạn chưa có lịch hẹn tham vấn nào. Hãy đặt lịch bên dưới!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {appointments.map(apt => (
                  <div
                    key={apt.id}
                    style={{
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-surface-subtle)',
                      border: '1.5px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '14px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span className="badge badge-brand" style={{ fontSize: '0.72rem' }}>
                          ✓ Đã Xác Nhận
                        </span>
                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                          📅 {apt.date} • ⏰ {apt.timeSlot}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '2px 0 4px 0' }}>
                        {apt.topic}
                      </h4>
                      <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                        Chuyên gia: <strong>{apt.coachName}</strong> ({apt.coachTitle})
                      </div>
                    </div>

                    <a
                      href={apt.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                      style={{ padding: '8px 18px', fontSize: '0.88rem', textDecoration: 'none', backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' }}
                      onClick={(e) => {
                        e.preventDefault();
                        showToast(`Đang mở phòng tư vấn trực tuyến (${apt.id})...`);
                      }}
                    >
                      <Video size={16} /> Vào Phòng Tư Vấn
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Booking form */}
          <div className="card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                  Đặt Lịch Tham Vấn 1-1 Mới
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', margin: '2px 0 0 0' }}>
                  Buổi gặp trực tuyến 30 phút để kiểm tra tư thế ngồi và thiết kế bài tập riêng.
                </p>
              </div>

              {currentUser?.plan !== 'vip' && (
                <button
                  onClick={onOpenSubscription}
                  className="btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '5px 10px', borderColor: '#F59E0B', color: '#B45309' }}
                >
                  ⭐ Quyền lợi gói VIP
                </button>
              )}
            </div>

            <form onSubmit={handleBookSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                    Chọn Ngày Hẹn
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--color-border)',
                      backgroundColor: 'var(--color-surface)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                    Khung Giờ Phù Hợp
                  </label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--color-border)',
                      backgroundColor: 'var(--color-surface)',
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="09:30 - 10:00">09:30 - 10:00 (Buổi sáng)</option>
                    <option value="11:30 - 12:00">11:30 - 12:00 (Trước giờ trưa)</option>
                    <option value="14:30 - 15:00">14:30 - 15:00 (Buổi chiều)</option>
                    <option value="16:30 - 17:00">16:30 - 17:00 (Cuối giờ làm)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                  Mô Tả Nhu Cầu & Triệu Chứng Của Bạn
                </label>
                <textarea
                  rows={3}
                  required
                  value={bookingTopic}
                  onChange={(e) => setBookingTopic(e.target.value)}
                  placeholder="Ví dụ: Thường xuyên bị tê ngón tay khi dùng chuột, hoặc đau nhói vùng lưng dưới khi ngồi lâu hơn 2 tiếng..."
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--color-border)',
                    backgroundColor: 'var(--color-surface)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', padding: '11px', fontSize: '0.95rem', backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' }}
              >
                <Calendar size={16} /> Xác Nhận Đặt Lịch Tham Vấn 1-1
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= TAB 3: CHAT VỚI HLV & AI ================= */}
      {activeTab === 'chat' && (
        <div className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '520px' }}>
          {/* Chat Header */}
          <div style={{
            padding: '14px 18px',
            backgroundColor: 'var(--color-surface-subtle)',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#8B5CF6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: '1.1rem'
            }}>
              🧘‍♀️
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                Kênh Trao Đổi Với HLV & Trợ Lý FitPet AI
              </div>
              <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700 }}>
                ● Trực tuyến - Phản hồi tự động & HLV giám sát
              </div>
            </div>
          </div>

          {/* Messages Body */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {chatMessages.map(msg => {
              const isMe = msg.sender === 'user';
              const isAI = msg.sender === 'ai';
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                    maxWidth: '82%',
                    gap: '8px'
                  }}
                >
                  {!isMe && (
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: isAI ? 'rgba(16, 185, 129, 0.15)' : 'rgba(139, 92, 246, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                      flexShrink: 0
                    }}>
                      {msg.avatar}
                    </div>
                  )}

                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '2px', textAlign: isMe ? 'right' : 'left' }}>
                      {msg.senderName} • {msg.time}
                    </div>
                    <div style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isMe ? 'var(--color-brand-primary)' : (isAI ? 'var(--color-surface-subtle)' : 'rgba(139, 92, 246, 0.1)'),
                      color: isMe ? '#FFFFFF' : 'var(--color-text-primary)',
                      fontSize: '0.88rem',
                      lineHeight: 1.45,
                      border: isMe ? 'none' : '1px solid var(--color-border)'
                    }}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendMessage} style={{
            padding: '12px',
            borderTop: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
            display: 'flex',
            gap: '8px'
          }}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Nhập câu hỏi về vùng đau hoặc tư thế ngồi..."
              style={{
                flex: 1,
                padding: '9px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--color-border)',
                backgroundColor: 'var(--color-surface-subtle)',
                fontSize: '0.88rem'
              }}
            />
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '0 18px', backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* ================= TAB 4: CẨM NANG CÔNG THÁI HỌC ================= */}
      {activeTab === 'ergonomics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            {
              title: '1. Quy Tắc Góc Vuông 90-90-90 Bàn Làm Việc',
              desc: 'Khuỷu tay gập 90 độ khi đặt lên bàn. Khớp hông gập 90-100 độ so với lưng ghế. Đầu gối vuông góc 90 độ và hai bàn chân chạm phẳng mặt đất.',
              tag: 'Tư thế chuẩn'
            },
            {
              title: '2. Vị Trí Màn Hình Chuẩn Y Khoa',
              desc: 'Khoảng cách từ mắt tới màn hình bằng chiều dài 1 cánh tay (50 - 70 cm). Mép trên của màn hình ngang hoặc thấp hơn tầm mắt 2-3 cm để cổ luôn ở vị trí trung tính.',
              tag: 'Bảo vệ cổ & mắt'
            },
            {
              title: '3. Chống Hội Chứng Ống Cổ Tay (Carpal Tunnel)',
              desc: 'Không tì ấn cổ tay trực tiếp lên cạnh bàn sắc nhọn. Sử dụng đệm lót chuột mềm hoặc chuột công thái học dọc (Vertical Mouse). Thường xuyên xoay cổ tay sau mỗi 45 phút.',
              tag: 'Cổ tay & Ngón tay'
            },
            {
              title: '4. Giảm Áp Lực Đĩa Đệm Thắt Lưng L4-L5',
              desc: 'Luôn giữ lưng áp sát vào tựa ghế có đệm thắt lưng (Lumbar support). Tránh ngồi trượt mông về phía trước hoặc ngồi bắt chéo chân vì sẽ làm lệch khung chậu 15-20 độ.',
              tag: 'Cột sống'
            }
          ].map((item, idx) => (
            <div key={idx} className="card" style={{ padding: '18px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span className="badge badge-brand" style={{ fontSize: '0.72rem' }}>
                  {item.tag}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Khuyến nghị y khoa FitPet
                </span>
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '6px' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

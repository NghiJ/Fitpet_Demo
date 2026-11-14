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
  const [bookingDate, setBookingDate] = useState('2026-11-20');
  const [bookingTime, setBookingTime] = useState('14:30 - 15:00');
  const [bookingTopic, setBookingTopic] = useState('Đánh giá tình trạng mỏi cổ vai khi ngồi máy tính');
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
    showToast('🎉 Đặt lịch hẹn 1-1 thành công! HLV sẽ chuẩn bị hồ sơ cho bạn.');
    setActiveTab('appointments');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    consultationService.sendMessage(chatInput);
    setChatInput('');
  };

  const { activePrescription, appointments, chatMessages } = data;

  const subTabs = [
    { id: 'prescription', label: 'Phác đồ riêng', icon: Stethoscope },
    { id: 'appointments', label: 'Lịch hẹn 1-1', icon: Calendar },
    { id: 'chat', label: 'Hỏi đáp AI', icon: MessageSquare },
    { id: 'ergonomics', label: 'Cẩm nang tư thế', icon: BookOpen }
  ];

  return (
    <div style={{ width: '100%', padding: '4px 6px 120px 6px', boxSizing: 'border-box' }}>
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
          backgroundColor: '#F78C25',
          color: '#FFFFFF',
          padding: '12px 18px',
          borderRadius: '9999px',
          boxShadow: '0 8px 24px rgba(247, 140, 37, 0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.88rem',
          fontWeight: 700
        }}>
          <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '16px', padding: '0 4px' }}>
        <div style={{
          fontSize: '0.72rem',
          fontWeight: 800,
          color: '#F78C25',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '4px'
        }}>
          THAM VẤN CHUYÊN GIA
        </div>
        <h1 style={{
          fontSize: '1.45rem',
          fontWeight: 900,
          color: '#133E35',
          margin: '0 0 6px 0',
          lineHeight: 1.2
        }}>
          Tư Vấn & Phác Đồ Riêng 🩺
        </h1>
        <p style={{
          fontSize: '0.86rem',
          color: '#4A6B63',
          margin: 0,
          lineHeight: 1.45
        }}>
          Được thiết lập bởi Huấn luyện viên phục hồi và đồng hành cùng Mochi.
        </p>
      </div>

      {/* 4 Subtab Pills */}
      <div style={{
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        paddingBottom: '12px',
        scrollbarWidth: 'none',
        marginBottom: '14px'
      }}>
        {subTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 800,
                border: 'none',
                backgroundColor: isActive ? '#133E35' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : '#4A6B63',
                boxShadow: isActive ? '0 2px 8px rgba(19, 62, 53, 0.2)' : '0 1px 3px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: PHÁC ĐỒ CỦA BẠN ================= */}
      {activeTab === 'prescription' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Coach Attribution Card in Peach */}
          <div className="card-peach" style={{ padding: '18px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                }}>
                  {activePrescription.coachAvatar}
                </div>
                <div>
                  <div style={{ fontWeight: 900, fontSize: '0.98rem', color: '#133E35' }}>
                    {activePrescription.coachName}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#6A564C' }}>
                    {activePrescription.coachTitle}
                  </div>
                </div>
              </div>

              <span style={{
                backgroundColor: '#133E35',
                color: '#FFFFFF',
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '9999px'
              }}>
                Đang Áp Dụng
              </span>
            </div>

            {/* Diagnosis & clinical notes */}
            <div style={{
              padding: '12px 14px',
              borderRadius: '16px',
              backgroundColor: '#FFFFFF',
              marginBottom: '14px'
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#F78C25', textTransform: 'uppercase', marginBottom: '2px' }}>
                ĐÁNH GIÁ THỂ TRẠNG:
              </div>
              <div style={{ fontSize: '0.86rem', color: '#133E35', fontWeight: 700, lineHeight: 1.4 }}>
                {activePrescription.diagnosis}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#5C473C', marginTop: '6px', fontStyle: 'italic' }}>
                💬 Lời dặn: "{activePrescription.notes}"
              </div>
            </div>

            {/* Prescribed workouts list */}
            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 900, color: '#133E35', margin: '0 0 10px 0' }}>
                Bài Tập Được Chỉ Định:
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {activePrescription.prescribedWorkouts.map((pw, i) => {
                  const fullWorkout = CURATED_WORKOUTS.find(w => w.id === pw.workoutId) || CURATED_WORKOUTS[0];
                  return (
                    <div
                      key={pw.workoutId}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '16px',
                        backgroundColor: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: '#133E35',
                            color: '#FFFFFF',
                            fontSize: '0.7rem',
                            fontWeight: 900,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {i + 1}
                          </span>
                          <span style={{ fontWeight: 900, fontSize: '0.88rem', color: '#133E35' }}>
                            {pw.title}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#7E9F97', marginLeft: '26px', marginTop: '2px' }}>
                          {pw.durationMinutes}p • {pw.targetArea}
                        </div>
                      </div>

                      <button
                        onClick={() => onStartWorkout(fullWorkout)}
                        className="btn-orange"
                        style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                      >
                        <Play size={12} fill="currentColor" /> Tập Ngay
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Existing appointments */}
          <div className="card-mint" style={{ padding: '18px 16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#133E35', margin: '0 0 10px 0' }}>
              Lịch Hẹn Của Bạn
            </h3>

            {appointments.length === 0 ? (
              <div style={{ padding: '16px', textAlign: 'center', color: '#2C5E53', fontSize: '0.84rem' }}>
                Chưa có lịch hẹn nào. Hãy đặt lịch bên dưới!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {appointments.map(apt => (
                  <div
                    key={apt.id}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '16px',
                      backgroundColor: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#F78C25' }}>
                        📅 {apt.date} • ⏰ {apt.timeSlot}
                      </div>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 900, color: '#133E35', margin: '2px 0' }}>
                        {apt.topic}
                      </h4>
                      <div style={{ fontSize: '0.74rem', color: '#7E9F97' }}>
                        HLV: {apt.coachName}
                      </div>
                    </div>

                    <button
                      className="btn-orange"
                      style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                      onClick={() => showToast(`Đang mở phòng tư vấn trực tuyến...`)}
                    >
                      <Video size={13} /> Vào Phòng
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Booking form */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '18px 16px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#133E35', margin: '0 0 4px 0' }}>
              Đặt Lịch Tham Vấn Mới
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#7E9F97', margin: '0 0 12px 0' }}>
              Gặp trực tuyến 30 phút cùng HLV phục hồi FitPet
            </p>

            <form onSubmit={handleBookSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, marginBottom: '4px', color: '#4A6B63' }}>
                    Chọn Ngày
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '12px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.84rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, marginBottom: '4px', color: '#4A6B63' }}>
                    Khung Giờ
                  </label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '12px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.84rem',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="09:30 - 10:00">09:30 - 10:00</option>
                    <option value="11:30 - 12:00">11:30 - 12:00</option>
                    <option value="14:30 - 15:00">14:30 - 15:00</option>
                    <option value="16:30 - 17:00">16:30 - 17:00</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, marginBottom: '4px', color: '#4A6B63' }}>
                  Nhu Cầu & Triệu Chứng
                </label>
                <textarea
                  rows={2}
                  required
                  value={bookingTopic}
                  onChange={(e) => setBookingTopic(e.target.value)}
                  placeholder="Mô tả vùng đau mỏi của bạn..."
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '12px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.84rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn-orange"
                style={{ width: '100%', padding: '10px', fontSize: '0.88rem' }}
              >
                <Calendar size={15} /> Xác Nhận Đặt Lịch
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= TAB 3: CHAT VỚI HLV & AI ================= */}
      {activeTab === 'chat' && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '460px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
        }}>
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#FEDFD2',
            fontWeight: 800,
            fontSize: '0.84rem',
            color: '#133E35',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>🧘‍♀️</span>
            <span>Trợ Lý FitPet AI & HLV Phục Hồi</span>
          </div>

          <div style={{ flex: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {chatMessages.map(msg => {
              const isMe = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    gap: '6px'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.68rem', color: '#7E9F97', marginBottom: '2px', textAlign: isMe ? 'right' : 'left' }}>
                      {msg.senderName}
                    </div>
                    <div style={{
                      padding: '8px 12px',
                      borderRadius: '16px',
                      backgroundColor: isMe ? '#F78C25' : '#EAF7F0',
                      color: isMe ? '#FFFFFF' : '#133E35',
                      fontSize: '0.84rem',
                      lineHeight: 1.4
                    }}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSendMessage} style={{
            padding: '10px',
            borderTop: '1px solid rgba(0,0,0,0.06)',
            display: 'flex',
            gap: '6px'
          }}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Nhập câu hỏi cho HLV..."
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '9999px',
                border: '1px solid #CBD5E1',
                fontSize: '0.84rem'
              }}
            />
            <button
              type="submit"
              className="btn-orange"
              style={{ padding: '0 16px' }}
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}

      {/* ================= TAB 4: CẨM NANG CÔNG THÁI HỌC ================= */}
      {activeTab === 'ergonomics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            {
              title: '1. Góc Vuông 90-90-90 Bàn Làm Việc',
              desc: 'Khuỷu tay gập 90° trên mặt bàn. Hông gập 90-100° so với lưng ghế. Đầu gối vuông góc 90° và hai bàn chân chạm sàn.',
              tag: 'Tư thế chuẩn'
            },
            {
              title: '2. Vị Trí Màn Hình Chuẩn Y Khoa',
              desc: 'Khoảng cách từ mắt tới màn hình 50-70cm. Mép trên màn hình ngang hoặc thấp hơn tầm mắt 2-3cm để cổ không ngửa gập.',
              tag: 'Bảo vệ cổ & mắt'
            },
            {
              title: '3. Chống Hội Chứng Ống Cổ Tay',
              desc: 'Không tì ấn cổ tay trực tiếp lên cạnh bàn sắc nhọn. Sử dụng đệm chuột mềm hoặc chuột dọc, xoay cổ tay sau mỗi 45 phút.',
              tag: 'Cổ tay'
            },
            {
              title: '4. Giảm Áp Lực Đĩa Đệm Thắt Lưng L4-L5',
              desc: 'Luôn giữ lưng áp sát vào tựa ghế có đệm thắt lưng. Tránh ngồi trượt mông về phía trước hoặc ngồi vắt chéo chân.',
              tag: 'Cột sống'
            }
          ].map((item, idx) => (
            <div key={idx} className="card-peach" style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  backgroundColor: '#FFFFFF',
                  color: '#F78C25',
                  padding: '2px 8px',
                  borderRadius: '9999px'
                }}>
                  {item.tag}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#7E9F97' }}>
                  Khuyến nghị FitPet
                </span>
              </div>
              <h3 style={{ fontSize: '0.94rem', fontWeight: 900, color: '#133E35', margin: '4px 0' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#5C473C', lineHeight: 1.45, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Dumbbell, ShieldCheck, HeartPulse, Sparkles, CheckCircle2, 
  AlertCircle, Users, Activity, Eye, ArrowLeft, LogOut, ChevronRight,
  ClipboardList, Stethoscope, Award, Camera, MessageSquare, BookOpen,
  Edit3, Check, Filter, Search, Clock, Save, Calendar, Video, TrendingUp, BarChart2, Plus, Trash2
} from 'lucide-react';
import { CURATED_WORKOUTS, PAIN_AREAS } from '../../workout/data/curatedWorkouts';
import { userService } from '../../auth/services/userService';
import { consultationService } from '../../consultation/services/consultationService';

/**
 * CoachDashboard Component
 * Không gian làm việc chuyên biệt dành riêng cho Huấn Luyện Viên (Role: Coach).
 * 6 Phân hệ nghiệp vụ hoàn chỉnh:
 * 1. Tiêu chuẩn bài tập (Curriculum & Camera Tracking Specs)
 * 2. Phác đồ vùng đau (Clinical Protocols)
 * 3. Quản lý học viên & AI (Students & Pose Analysis)
 * 4. Kê đơn phác đồ cá nhân hóa (Custom Prescription Builder) [MỚI]
 * 5. Lịch hẹn tham vấn 1-1 (1-on-1 Consultations) [MỚI]
 * 6. Báo cáo phục hồi & Độ chính xác AI (Recovery Analytics) [MỚI]
 */
export const CoachDashboard = ({ onBackToApp, onLogout, currentUser }) => {
  // Navigation tabs: 'curriculum' | 'protocols' | 'students' | 'prescriptions' | 'appointments' | 'analytics'
  const [activeTab, setActiveTab] = useState('curriculum');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Workouts and Exercises State
  const [workoutsList, setWorkoutsList] = useState(CURATED_WORKOUTS);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [notification, setNotification] = useState(null);

  // Users / Students State
  const [students, setStudents] = useState(() => userService.getUsers());
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentNoteInput, setStudentNoteInput] = useState('');

  // Prescriptions builder state
  const [selectedPrescriptionStudent, setSelectedPrescriptionStudent] = useState('user-002');
  const [prescribedDiagnosis, setPrescribedDiagnosis] = useState('Đau mỏi cơ thang trên & gù lưng trên do ngồi máy tính sai tư thế');
  const [prescribedAdvice, setPrescribedAdvice] = useState('Hạ lỏng 2 vai khi gõ phím. Giữ cằm thu nhẹ về sau và giải lao 3 phút mỗi 45 phút.');
  const [prescribedFrequency, setPrescribedFrequency] = useState('2 lần / ngày (Sáng 10h & Chiều 15h30)');
  const [selectedWorkoutIds, setSelectedWorkoutIds] = useState(['desk-de-stiffener', 'lower-back-relief']);

  // Appointments state
  const [appointments, setAppointments] = useState(() => {
    return [
      {
        id: 'apt-001',
        studentName: 'Trần Thị Thu Hà',
        studentEmail: 'thuha.tran@example.com',
        avatarEmoji: '🌸',
        plan: 'Gói VIP Trọn Đời',
        date: '02/11/2026',
        timeSlot: '14:30 - 15:00',
        topic: 'Đánh giá góc gù lưng và hướng dẫn tư thế ngồi công thái học tại bàn làm việc',
        status: 'confirmed',
        notes: 'Học viên làm thiết kế đồ họa, hay mỏi thắt lưng L4-L5'
      },
      {
        id: 'apt-002',
        studentName: 'Lê Hoàng Nam',
        studentEmail: 'nam.le@company.com',
        avatarEmoji: '💻',
        plan: 'Gói Plus',
        date: '03/11/2026',
        timeSlot: '10:00 - 10:30',
        topic: 'Kiểm tra độ linh hoạt khớp cổ tay và phòng ngừa hội chứng ống cổ tay',
        status: 'pending',
        notes: 'Lập trình viên, gõ phím 9-10 tiếng/ngày'
      }
    ];
  });

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Filtered workouts
  const filteredWorkouts = workoutsList.filter(w => {
    const matchesSearch = w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          w.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || w.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Handle saving coach note for a student
  const handleSaveStudentNote = (studentId) => {
    if (!studentNoteInput.trim()) return;
    userService.updateUser(studentId, { notes: studentNoteInput.trim() });
    setStudents(userService.getUsers());
    showToast(`Đã lưu lời khuyên chuyên môn cho học viên!`);
    setSelectedStudent(null);
    setStudentNoteInput('');
  };

  // Save new customized prescription
  const handleSavePrescription = (e) => {
    e.preventDefault();
    const student = students.find(s => s.id === selectedPrescriptionStudent);
    if (!student) return;

    // Save to user notes
    userService.updateUser(selectedPrescriptionStudent, {
      notes: `Phác đồ HLV Phương Anh: ${prescribedDiagnosis}. Lời dặn: ${prescribedAdvice}`
    });
    setStudents(userService.getUsers());

    showToast(`Đã ban hành phác đồ điều trị riêng cho học viên "${student.name}"!`);
  };

  // Toggle workout in prescription
  const handleTogglePrescribeWorkout = (workoutId) => {
    if (selectedWorkoutIds.includes(workoutId)) {
      if (selectedWorkoutIds.length <= 1) {
        showToast('Phác đồ cần ít nhất 1 bài tập!', 'error');
        return;
      }
      setSelectedWorkoutIds(selectedWorkoutIds.filter(id => id !== workoutId));
    } else {
      setSelectedWorkoutIds([...selectedWorkoutIds, workoutId]);
    }
  };

  // Confirm appointment
  const handleConfirmAppointment = (aptId) => {
    setAppointments(prev => prev.map(a => a.id === aptId ? { ...a, status: 'confirmed' } : a));
    showToast('Đã xác nhận buổi tham vấn 1-1 với học viên!');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', paddingBottom: '60px' }}>
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          zIndex: 1000,
          backgroundColor: notification.type === 'error' ? '#EF4444' : '#8B5CF6',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.9rem',
          fontWeight: 700,
          animation: 'fadeIn 0.2s ease'
        }}>
          <CheckCircle2 size={18} />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Coach Header Bar */}
      <header style={{
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div className="app-container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: '64px',
          height: 'auto',
          padding: '10px 12px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#8B5CF6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              flexShrink: 0
            }}>
              <Award size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                  FitPet Coach Workspace
                </h1>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'rgba(139, 92, 246, 0.15)',
                  color: '#7C3AED',
                  border: '1px solid rgba(139, 92, 246, 0.3)'
                }}>
                  HLV CHUYÊN MÔN
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Không gian thẩm định bài tập, kê đơn phác đồ & tham vấn học viên
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '6px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: 'rgba(139, 92, 246, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem'
              }}>
                {currentUser?.avatarEmoji || '🧘‍♀️'}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                  {currentUser?.name || 'Phạm Phương Anh'}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                  HLV Thể Hình & Phục Hồi
                </div>
              </div>
            </div>

            <button
              onClick={onBackToApp}
              className="btn-secondary"
              style={{ fontSize: '0.84rem', padding: '7px 14px', minHeight: '36px', gap: '6px' }}
              title="Trải nghiệm ứng dụng với tư cách Hội viên"
            >
              <Eye size={15} />
              <span>Giao Diện Hội Viên</span>
            </button>

            <button
              onClick={onLogout}
              className="btn-ghost"
              style={{ fontSize: '0.84rem', padding: '7px 12px', minHeight: '36px', color: '#EF4444', border: '1px solid var(--color-border)' }}
              title="Đổi vai trò hoặc đăng xuất"
            >
              <LogOut size={15} />
              <span>Đổi Vai Trò</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="app-container" style={{ paddingTop: '24px' }}>
        {/* Navigation Tabs (6 Complete Tabs) */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '2px solid var(--color-border)',
          marginBottom: '24px',
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}>
          {[
            { id: 'curriculum', label: `Tiêu Chuẩn Bài Tập (${workoutsList.length})`, icon: Dumbbell },
            { id: 'protocols', label: `Phác Đồ Vùng Đau (${PAIN_AREAS.length})`, icon: Stethoscope },
            { id: 'students', label: `Học Viên & AI (${students.length})`, icon: Users },
            { id: 'prescriptions', label: 'Kê Đơn Phác Đồ Riêng', icon: ClipboardList },
            { id: 'appointments', label: `Lịch Tham Vấn 1-1 (${appointments.length})`, icon: Calendar },
            { id: 'analytics', label: 'Báo Cáo Phục Hồi', icon: TrendingUp }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '12px 18px',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '3px solid #8B5CF6' : '3px solid transparent',
                  color: isActive ? '#7C3AED' : 'var(--color-text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={17} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ================= TAB 1: CURRICULUM ================= */}
        {activeTab === 'curriculum' && (
          <div>
            {/* KPI Cards for Coach */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8B5CF6', marginBottom: '8px' }}>
                  <ShieldCheck size={20} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Tiêu Chuẩn Đã Thẩm Định</span>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800 }}>12 / 12 Động Tác</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Không tạ, không thiết bị, an toàn cho đĩa đệm
                </div>
              </div>

              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', marginBottom: '8px' }}>
                  <Camera size={20} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Độ Chuẩn Nhận Diện AI</span>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10B981' }}>91.8%</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Dựa trên 1,020 lượt nhận diện cử động thực tế
                </div>
              </div>

              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F59E0B', marginBottom: '8px' }}>
                  <HeartPulse size={20} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Ưu Tiên Văn Phòng</span>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '4px' }}>Cổ Vai Gáy & Cột Sống</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Chiếm 78% nhu cầu của học viên ngồi nhiều
                </div>
              </div>
            </div>

            {/* Filter bar */}
            <div className="card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '12px', flex: '1 1 360px', flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative', flex: '1 1 240px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input
                      type="text"
                      placeholder="Tìm kiếm bài tập hoặc vùng cơ..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px 8px 36px',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--color-border)',
                        backgroundColor: 'var(--color-surface)',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>

                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--color-border)',
                      backgroundColor: 'var(--color-surface)',
                      fontSize: '0.88rem',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="all">Tất cả vùng cơ ({workoutsList.length})</option>
                    <option value="Cổ & Vai Gáy">Cổ & Vai Gáy</option>
                    <option value="Thắt Lưng & Cột Sống">Thắt Lưng & Cột Sống</option>
                    <option value="Cổ Tay & Ngón Tay">Cổ Tay & Ngón Tay</option>
                    <option value="Hông & Đôi Chân">Hông & Đôi Chân</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Workouts Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
              {filteredWorkouts.map(workout => (
                <div key={workout.id} className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span className="badge badge-amber" style={{ fontSize: '0.74rem' }}>
                        {workout.category}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                        <ShieldCheck size={14} /> Đã kiểm định y khoa
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '6px' }}>
                      {workout.title}
                    </h3>
                    <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', marginBottom: '14px', lineHeight: 1.5 }}>
                      {workout.description || workout.tagline}
                    </p>

                    <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '12px', marginBottom: '14px' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                        ĐỘNG TÁC THẨM ĐỊNH ({workout.exercises.length}):
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {workout.exercises.map((ex, idx) => (
                          <div
                            key={ex.id}
                            style={{
                              fontSize: '0.8rem',
                              padding: '6px 10px',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: 'var(--color-surface-subtle)',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <span>{idx + 1}. {ex.name}</span>
                            <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>{ex.durationSec}s</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--color-border-subtle)' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      Thời lượng: {workout.durationMinutes} phút
                    </span>
                    <button
                      onClick={() => showToast(`Tiêu chuẩn bài tập "${workout.title}" đạt chứng nhận an toàn!`)}
                      className="btn-secondary"
                      style={{ fontSize: '0.8rem', padding: '6px 12px', borderColor: '#8B5CF6', color: '#7C3AED' }}
                    >
                      <Check size={13} style={{ marginRight: '4px' }} /> Xác Nhận An Toàn
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 2: PROTOCOLS ================= */}
        {activeTab === 'protocols' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {PAIN_AREAS.map(area => (
              <div key={area.id} className="card" style={{ padding: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(139, 92, 246, 0.12)',
                    color: '#7C3AED',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Stethoscope size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>{area.title}</h3>
                    <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>Phác đồ văn phòng tiêu chuẩn</span>
                  </div>
                </div>

                <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                  {area.description}
                </p>

                <div style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-surface-subtle)',
                  border: '1px solid var(--color-border-subtle)',
                  marginBottom: '16px'
                }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#7C3AED', textTransform: 'uppercase', marginBottom: '4px' }}>
                    CHỈ ĐỊNH PHỤC HỒI:
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
                    Tập 1-2 lần mỗi ngày. Tập trung vào biên độ chuyển động không đau, không nín thở và giữ nhịp thở đều đặn.
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('prescriptions');
                    showToast(`Đang mở bộ kê đơn cho vùng "${area.title}"`);
                  }}
                  className="btn-primary"
                  style={{ width: '100%', fontSize: '0.86rem', padding: '8px 14px', backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' }}
                >
                  <ClipboardList size={14} style={{ marginRight: '6px' }} /> Kê Đơn Vùng Này Cho Học Viên
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ================= TAB 3: STUDENTS & POSE TRACKING ================= */}
        {activeTab === 'students' && (
          <div>
            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
                  Danh Sách Học Viên Đang Theo Dõi ({students.length})
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Dữ liệu nhận diện tư thế từ Camera AI on-device
                </span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--color-surface-subtle)', borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '12px 14px' }}>HỌC VIÊN</th>
                      <th style={{ padding: '12px 14px' }}>VÙNG ĐAU MỎI</th>
                      <th style={{ padding: '12px 14px' }}>BUỔI ĐÃ TẬP</th>
                      <th style={{ padding: '12px 14px' }}>ĐỘ CHÍNH XÁC AI</th>
                      <th style={{ padding: '12px 14px' }}>LỜI KHUYÊN HIỆN TẠI</th>
                      <th style={{ padding: '12px 14px', textAlign: 'right' }}>HÀNH ĐỘNG</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(student => (
                      <tr key={student.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--color-surface-subtle)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1.1rem'
                            }}>
                              {student.avatarEmoji || '🏃'}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700 }}>{student.name}</div>
                              <div style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>{student.email}</div>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: '12px 14px' }}>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'rgba(239, 68, 68, 0.08)',
                            color: '#DC2626',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            border: '1px solid rgba(239, 68, 68, 0.2)'
                          }}>
                            {student.primaryPainArea || 'Cổ & Vai Gáy'}
                          </span>
                        </td>

                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 700 }}>{student.totalWorkouts || 0} buổi</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                            {student.totalMinutes || 0} phút vận động
                          </div>
                        </td>

                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 800, color: '#10B981' }}>
                            <Camera size={14} />
                            {student.cameraRepsCount || 0} reps chuẩn
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                            Tỷ lệ chính xác ~92%
                          </div>
                        </td>

                        <td style={{ padding: '12px 14px', maxWidth: '240px' }}>
                          {student.notes ? (
                            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                              "{student.notes}"
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>
                              Chưa có lời khuyên riêng
                            </span>
                          )}
                        </td>

                        <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                          <button
                            onClick={() => {
                              setSelectedStudent(student);
                              setStudentNoteInput(student.notes || '');
                            }}
                            className="btn-secondary"
                            style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                          >
                            <Edit3 size={13} style={{ marginRight: '4px' }} />
                            Ghi Chú
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal: Write Coach Quick Note */}
            {selectedStudent && (
              <div className="modal-backdrop" onClick={() => setSelectedStudent(null)}>
                <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.6rem' }}>{selectedStudent.avatarEmoji || '🏃'}</span>
                      <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                          Lời Khuyên Cho {selectedStudent.name}
                        </h3>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                          Vùng mỏi chính: {selectedStudent.primaryPainArea || 'Cổ vai gáy'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                      Lời khuyên kỹ thuật & phác đồ vận động gợi ý:
                    </label>
                    <textarea
                      rows="4"
                      value={studentNoteInput}
                      onChange={e => setStudentNoteInput(e.target.value)}
                      placeholder="Ví dụ: Cần chú ý giữ khuỷu tay góc 45 độ khi vươn vai, tập thêm 2 hiệp xoay cổ tay mỗi buổi chiều..."
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--color-border)',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button onClick={() => setSelectedStudent(null)} className="btn-ghost">
                      Hủy
                    </button>
                    <button
                      onClick={() => handleSaveStudentNote(selectedStudent.id)}
                      className="btn-primary"
                      style={{ backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' }}
                    >
                      <Save size={15} style={{ marginRight: '6px' }} />
                      Lưu Lời Khuyên
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: PRESCRIPTIONS BUILDER [NEW] ================= */}
        {activeTab === 'prescriptions' && (
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8B5CF6', marginBottom: '4px' }}>
                <ClipboardList size={20} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                  Kê Đơn Phác Đồ Cá Nhân Hóa Cho Học Viên
                </h3>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                Thiết lập danh mục bài tập chuyên biệt, tần suất và lời dặn y khoa. Đơn thuốc vận động sẽ được đồng bộ ngay vào tài khoản học viên.
              </p>
            </div>

            <form onSubmit={handleSavePrescription}>
              {/* Select Student */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                  1. Chọn Học Viên Cần Kê Đơn:
                </label>
                <select
                  value={selectedPrescriptionStudent}
                  onChange={e => setSelectedPrescriptionStudent(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--color-border)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.email}) — Vùng đau: {s.primaryPainArea || 'Cổ vai gáy'} — Gói: {s.plan || 'Free'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Diagnosis & clinical notes */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                    2. Chẩn Đoán Thể Trạng Văn Phòng:
                  </label>
                  <input
                    type="text"
                    required
                    value={prescribedDiagnosis}
                    onChange={e => setPrescribedDiagnosis(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--color-border)',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                    3. Tần Suất Tập Khuyến Nghị:
                  </label>
                  <input
                    type="text"
                    required
                    value={prescribedFrequency}
                    onChange={e => setPrescribedFrequency(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--color-border)',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                  4. Lời Dặn Kỹ Thuật & Lưu Ý Tư Thế Tránh Tái Phát:
                </label>
                <textarea
                  rows="3"
                  required
                  value={prescribedAdvice}
                  onChange={e => setPrescribedAdvice(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--color-border)',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              {/* Select Exercises to Include */}
              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '8px' }}>
                  5. Chỉ Định Các Bài Tập Vào Phác Đồ (Đã chọn {selectedWorkoutIds.length} bài):
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                  {workoutsList.map(w => {
                    const isSelected = selectedWorkoutIds.includes(w.id);
                    return (
                      <div
                        key={w.id}
                        onClick={() => handleTogglePrescribeWorkout(w.id)}
                        style={{
                          padding: '12px 14px',
                          borderRadius: 'var(--radius-md)',
                          border: isSelected ? '2px solid #8B5CF6' : '1px solid var(--color-border)',
                          backgroundColor: isSelected ? 'rgba(139, 92, 246, 0.08)' : 'var(--color-surface)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: isSelected ? '#7C3AED' : 'var(--color-text-primary)' }}>
                            {w.title}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>
                            {w.category} • {w.durationMinutes} phút
                          </div>
                        </div>

                        <div style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          border: isSelected ? '2px solid #8B5CF6' : '1.5px solid var(--color-border)',
                          backgroundColor: isSelected ? '#8B5CF6' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF'
                        }}>
                          {isSelected && <Check size={13} strokeWidth={3} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '0.96rem', backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' }}
              >
                <Save size={16} style={{ marginRight: '6px' }} /> Ban Hành Phác Đồ Vào Hồ Sơ Học Viên
              </button>
            </form>
          </div>
        )}

        {/* ================= TAB 5: APPOINTMENTS 1-1 [NEW] ================= */}
        {activeTab === 'appointments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="card" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                    Lịch Hẹn Tham Vấn Trực Tuyến 1-1 ({appointments.length})
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', margin: '2px 0 0 0' }}>
                    Các buổi tham vấn qua video do học viên đặt lịch trước.
                  </p>
                </div>

                <span className="badge badge-brand" style={{ fontSize: '0.75rem' }}>
                  Phòng Video Call Tích Hợp
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {appointments.map(apt => (
                  <div
                    key={apt.id}
                    style={{
                      padding: '18px 20px',
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: '#8B5CF6',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.4rem'
                      }}>
                        {apt.avatarEmoji}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                          <span style={{ fontWeight: 800, fontSize: '1.02rem' }}>{apt.studentName}</span>
                          <span className="badge badge-amber" style={{ fontSize: '0.68rem' }}>{apt.plan}</span>
                          <span className={`badge ${apt.status === 'confirmed' ? 'badge-brand' : ''}`} style={{ fontSize: '0.68rem' }}>
                            {apt.status === 'confirmed' ? '✓ Đã Xác Nhận' : '⏳ Chờ Duyệt'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.84rem', color: 'var(--color-text-primary)', fontWeight: 600 }}>
                          Chủ đề: {apt.topic}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                          📅 {apt.date} • ⏰ {apt.timeSlot} • Tiền sử: {apt.notes}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {apt.status !== 'confirmed' && (
                        <button
                          onClick={() => handleConfirmAppointment(apt.id)}
                          className="btn-secondary"
                          style={{ fontSize: '0.82rem', padding: '7px 12px', borderColor: '#10B981', color: '#059669' }}
                        >
                          <Check size={14} style={{ marginRight: '4px' }} /> Xác Nhận Lịch
                        </button>
                      )}

                      <button
                        onClick={() => showToast(`Đang mở phòng tư vấn video với ${apt.studentName}...`)}
                        className="btn-primary"
                        style={{ fontSize: '0.84rem', padding: '7px 14px', backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' }}
                      >
                        <Video size={15} style={{ marginRight: '4px' }} /> Vào Phòng Khám Trực Tuyến
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 6: CLINICAL ANALYTICS [NEW] ================= */}
        {activeTab === 'analytics' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  TỶ LỆ GIẢM ĐAU CỔ VAI GÁY
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#10B981' }}>88.4%</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Học viên báo cáo giảm mỏi sau 7 ngày kiên trì
                </div>
              </div>

              <div className="card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  TỶ LỆ GIẢM MỎI THẮT LƯNG
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#F59E0B' }}>82.1%</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Áp dụng phác đồ xoay vặn thân mình 4 phút
                </div>
              </div>

              <div className="card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  ĐỘ CHUẨN CAMERA POSE DETECTION
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#8B5CF6' }}>96.2%</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Khớp xương vai, cổ và khuỷu tay
                </div>
              </div>
            </div>

            {/* Posture Error Distribution */}
            <div className="card" style={{ padding: '22px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '6px' }}>
                Thống Kê Lỗi Tư Thế Thường Gặp Của Dân Văn Phòng
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', marginBottom: '18px' }}>
                Phát hiện tự động qua AI Camera trong quá trình hội viên thực hiện động tác.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { error: 'Nhún vai / Căng cứng cơ thang khi xoay vai', rate: 64, count: '312 lần' },
                  { error: 'Đầu rụt về phía trước (Forward Head Posture) khi nhìn màn hình', rate: 58, count: '280 lần' },
                  { error: 'Vặn hông thay vì vặn cột sống ngực', rate: 42, count: '194 lần' },
                  { error: 'Gập cổ tay góc quá sắc khi gõ bàn phím', rate: 36, count: '162 lần' }
                ].map((item, idx) => (
                  <div key={idx} style={{ backgroundColor: 'var(--color-surface-subtle)', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px' }}>
                      <span>{item.error}</span>
                      <span style={{ color: '#DC2626' }}>{item.rate}% ({item.count})</span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: 'var(--color-border)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ width: `${item.rate}%`, height: '100%', backgroundColor: '#EF4444', borderRadius: '999px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

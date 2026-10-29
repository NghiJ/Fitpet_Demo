import React, { useState } from 'react';
import { 
  Dumbbell, ShieldCheck, HeartPulse, Sparkles, CheckCircle2, 
  AlertCircle, Users, Activity, Eye, ArrowLeft, LogOut, ChevronRight,
  ClipboardList, Stethoscope, Award, Camera, MessageSquare, BookOpen,
  Edit3, Check, Filter, Search, Clock, Save
} from 'lucide-react';
import { CURATED_WORKOUTS, PAIN_AREAS } from '../../workout/data/curatedWorkouts';
import { userService } from '../../auth/services/userService';

/**
 * CoachDashboard Component
 * Không gian làm việc chuyên biệt dành riêng cho Huấn Luyện Viên (Role: Coach).
 * Cho phép:
 * 1. Kiểm duyệt tiêu chuẩn an toàn của các động tác và bài tập
 * 2. Thiết lập phác đồ bài tập phù hợp cho từng vùng đau của dân văn phòng
 * 3. Theo dõi học viên, phân tích độ chính xác nhận diện Camera AI và gửi lời khuyên chuyên môn
 */
export const CoachDashboard = ({ onBackToApp, onLogout, currentUser }) => {
  // Navigation tabs: 'curriculum' (Kiểm duyệt bài tập) | 'protocols' (Phác đồ vùng đau) | 'students' (Theo dõi học viên)
  const [activeTab, setActiveTab] = useState('curriculum');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Workouts and Exercises State
  const [workoutsList, setWorkoutsList] = useState(CURATED_WORKOUTS);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [coachNotes, setCoachNotes] = useState({});
  const [notification, setNotification] = useState(null);

  // Users / Students State
  const [students, setStudents] = useState(() => userService.getUsers());
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentNoteInput, setStudentNoteInput] = useState('');

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
          height: '68px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#8B5CF6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <Award size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
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
                Không gian thẩm định chuyên môn bài tập & theo dõi học viên văn phòng
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
              <div style={{ textAlign: 'left', display: 'none', md: 'block' }}>
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
        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '2px solid var(--color-border)',
          marginBottom: '24px'
        }}>
          <button
            onClick={() => setActiveTab('curriculum')}
            style={{
              padding: '12px 18px',
              fontSize: '0.92rem',
              fontWeight: 800,
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'curriculum' ? '3px solid #8B5CF6' : '3px solid transparent',
              color: activeTab === 'curriculum' ? '#7C3AED' : 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Dumbbell size={18} />
            Kiểm Duyệt & Tiêu Chuẩn Bài Tập ({workoutsList.length})
          </button>

          <button
            onClick={() => setActiveTab('protocols')}
            style={{
              padding: '12px 18px',
              fontSize: '0.92rem',
              fontWeight: 800,
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'protocols' ? '3px solid #8B5CF6' : '3px solid transparent',
              color: activeTab === 'protocols' ? '#7C3AED' : 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Stethoscope size={18} />
            Phác Đồ Kê Đơn Vùng Đau ({PAIN_AREAS.length})
          </button>

          <button
            onClick={() => setActiveTab('students')}
            style={{
              padding: '12px 18px',
              fontSize: '0.92rem',
              fontWeight: 800,
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'students' ? '3px solid #8B5CF6' : '3px solid transparent',
              color: activeTab === 'students' ? '#7C3AED' : 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Users size={18} />
            Theo Dõi Học Viên & Camera AI ({students.length})
          </button>
        </div>

        {/* ================= TAB 1: CURRICULUM & MOVEMENT FORM AUDITING ================= */}
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
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Tìm bài tập hoặc động tác..."
                      style={{
                        width: '100%',
                        padding: '8px 12px 8px 36px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-surface-subtle)',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>

                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-surface)',
                      fontSize: '0.88rem',
                      fontWeight: 600
                    }}
                  >
                    <option value="all">Tất cả danh mục</option>
                    <option value="Cổ & Vai Gáy">Cổ & Vai Gáy</option>
                    <option value="Thắt Lưng & Cột Sống">Thắt Lưng & Cột Sống</option>
                    <option value="Cổ Tay & Ngón Tay">Cổ Tay & Ngón Tay</option>
                    <option value="Hông & Đôi Chân">Hông & Đôi Chân</option>
                    <option value="Toàn Thân">Toàn Thân</option>
                  </select>
                </div>

                <div style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
                  Hiển thị <strong>{filteredWorkouts.length}</strong> bài tập chuyên môn
                </div>
              </div>
            </div>

            {/* Curated Workouts & Exercises Review List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredWorkouts.map(workout => (
                <div key={workout.id} className="card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span className="badge badge-brand" style={{ fontSize: '0.74rem' }}>{workout.category}</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                          ⏱️ {workout.durationMinutes} phút • {workout.exercises.length} động tác
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>{workout.title}</h3>
                      <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', marginTop: '4px', marginBottom: 0 }}>
                        {workout.tagline}
                      </p>
                    </div>

                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'rgba(16, 185, 129, 0.12)',
                      color: '#059669',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      border: '1px solid rgba(16, 185, 129, 0.25)'
                    }}>
                      <CheckCircle2 size={13} /> ĐÃ THẨM ĐỊNH CHUYÊN MÔN
                    </span>
                  </div>

                  {/* List of exercises inside this workout */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                    {workout.exercises.map((ex, idx) => (
                      <div key={ex.id || idx} style={{
                        padding: '14px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--color-surface-subtle)',
                        border: '1px solid var(--color-border)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#8B5CF6' }}>
                            ĐỘNG TÁC {idx + 1}
                          </span>
                          <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                            {ex.durationSec} giây
                          </span>
                        </div>

                        <div style={{ fontWeight: 800, fontSize: '0.94rem', marginBottom: '4px' }}>
                          {ex.name}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.45, marginBottom: '8px' }}>
                          {ex.instruction}
                        </div>

                        {/* Coach Cues & Tips */}
                        {ex.formTips && ex.formTips.length > 0 && (
                          <div style={{ backgroundColor: 'var(--color-surface)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-subtle)', fontSize: '0.74rem' }}>
                            <strong style={{ color: '#8B5CF6', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px' }}>
                              <Award size={12} /> Tiêu chuẩn kỹ thuật HLV:
                            </strong>
                            <ul style={{ margin: 0, paddingLeft: '14px', lineHeight: 1.4 }}>
                              {ex.formTips.map((tip, tipIdx) => (
                                <li key={tipIdx}>{tip}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 2: PAIN AREA PROTOCOLS ================= */}
        {activeTab === 'protocols' && (
          <div>
            <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px' }}>
                Phác Đồ Vận Động Phục Hồi Theo Vùng Đau
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem', margin: 0 }}>
                Các hướng dẫn y học thể thao thiết kế riêng cho người làm việc văn phòng, giúp giải tỏa nhanh các điểm nghẽn cơ và cải thiện lưu thông máu.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {PAIN_AREAS.map(area => (
                <div key={area.id} className="card" style={{ padding: '20px', border: '1.5px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '2rem' }}>{area.icon}</span>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>{area.name}</h3>
                      <span className="badge badge-brand" style={{ fontSize: '0.72rem', marginTop: '3px' }}>
                        {area.badgeText}
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                    {area.description}
                  </p>

                  <div style={{ backgroundColor: 'var(--color-surface-subtle)', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '0.82rem' }}>
                    <div style={{ fontWeight: 800, color: '#8B5CF6', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Stethoscope size={14} /> Khuyến nghị chuyên môn:
                    </div>
                    <div style={{ color: 'var(--color-text-primary)', lineHeight: 1.45 }}>
                      Nên thực hiện phiên tập ngắn <strong>3-4 phút</strong> mỗi 90 phút ngồi làm việc. Kết hợp hít thở sâu bằng cơ hoành để tối đa hóa lượng oxy đến mô cơ.
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: STUDENT ROSTER & CAMERA AI ACCURACY ================= */}
        {activeTab === 'students' && (
          <div>
            <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                    Danh Sách Học Viên & Báo Cáo Nhận Diện Camera AI
                  </h2>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.86rem', marginTop: '4px', marginBottom: 0 }}>
                    Theo dõi tiến độ, số reps phát hiện chuẩn và gửi lời khuyên cá nhân hóa cho học viên.
                  </p>
                </div>
                <span className="badge badge-amber" style={{ fontSize: '0.8rem', fontWeight: 800 }}>
                  {students.length} Học Viên Hoạt Động
                </span>
              </div>
            </div>

            {/* Students Table */}
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '12px 14px' }}>HỌC VIÊN</th>
                      <th style={{ padding: '12px 14px' }}>VÙNG ĐAU KHAI BÁO</th>
                      <th style={{ padding: '12px 14px' }}>THỜI LƯỢNG TẬP</th>
                      <th style={{ padding: '12px 14px' }}>REPS CAMERA AI</th>
                      <th style={{ padding: '12px 14px' }}>LỜI KHUYÊN CỦA HLV</th>
                      <th style={{ padding: '12px 14px', textAlign: 'right' }}>THAO TÁC</th>
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
                            Kê Đơn / Lời Khuyên
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal: Write Coach Prescription / Note */}
            {selectedStudent && (
              <div className="modal-backdrop" onClick={() => setSelectedStudent(null)}>
                <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.6rem' }}>{selectedStudent.avatarEmoji || '🏃'}</span>
                      <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                          Kê Đơn Chuyên Môn Cho {selectedStudent.name}
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
                      placeholder="Ví dụ: Cần chú ý giữ khuỷu tay góc 45 độ khi chống đẩy tường, tập thêm 2 hiệp xoay cổ tay mỗi buổi chiều..."
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
      </div>
    </div>
  );
};

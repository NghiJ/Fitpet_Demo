import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Dumbbell, ShieldCheck, Plus, Edit, 
  Trash2, ArrowLeft, CheckCircle2, Clock, AlertTriangle, Eye, Search,
  Users, UserPlus, UserCheck, UserX, Lock, Unlock, Mail, Phone,
  Calendar, Activity, HeartPulse, Sparkles, X, ChevronRight, RefreshCw,
  Crown, Star, CreditCard, TrendingUp, DollarSign, Settings, Server, Sliders, Check, Tag, Award, Shield, FileText, BarChart2
} from 'lucide-react';
import { CURATED_WORKOUTS } from '../../features/workout/data/curatedWorkouts';
import { userService } from '../../features/auth/services/userService';

export const AdminDashboard = ({ onBackToApp, onLogout, onSwitchToCoach, currentUser }) => {
  // Navigation tabs: 'overview' | 'users' | 'workouts' | 'revenue' | 'coaches' | 'settings' | 'review'
  const [activeTab, setActiveTab] = useState('overview');

  // Revenue & Transactions State
  const [transactions, setTransactions] = useState([
    { id: 'TXN-9021', user: 'Trần Thị Thu Hà', email: 'thuha.tran@example.com', plan: 'FitPet Plus (1 Năm)', amount: '588.000 đ', method: 'VietQR / MoMo', date: '31/10/2026 14:22', status: 'success' },
    { id: 'TXN-9020', user: 'Nguyễn Văn Hùng', email: 'hung.nguyen@tech.com', plan: 'FitPet VIP Trọn Đời', amount: '899.000 đ', method: 'Thẻ Quốc Tế (Visa)', date: '31/10/2026 11:05', status: 'success' },
    { id: 'TXN-9019', user: 'Lê Hoàng Nam', email: 'nam.le@company.com', plan: 'FitPet Plus (Hàng Tháng)', amount: '59.000 đ', method: 'VietQR', date: '30/10/2026 19:40', status: 'success' },
    { id: 'TXN-9018', user: 'Phạm Minh Trang', email: 'trang.pham@vng.vn', plan: 'FitPet VIP Trọn Đời', amount: '899.000 đ', method: 'MoMo E-Wallet', date: '30/10/2026 16:15', status: 'success' },
    { id: 'TXN-9017', user: 'Hoàng Quốc Bảo', email: 'bao.hq@fpt.vn', plan: 'Doanh Nghiệp (B2B 20 Seats)', amount: '9.800.000 đ', method: 'Chuyển Khoản Ngân Hàng', date: '29/10/2026 09:30', status: 'success' }
  ]);

  const [vouchers, setVouchers] = useState([
    { code: 'DESKHERO20', discount: 'Giảm 20%', uses: '142 / 500', expires: '31/12/2026', status: 'active' },
    { code: 'VNGHEALTH50', discount: 'Giảm 50% B2B', uses: '88 / 100', expires: '15/11/2026', status: 'active' },
    { code: 'FPTCORP_VIP', discount: 'Tặng 1 buổi tham vấn 1-1', uses: '210 / 300', expires: '30/11/2026', status: 'active' }
  ]);

  // Coach Roster State
  const [coachesList, setCoachesList] = useState([
    { id: 'coach-1', name: 'Phạm Phương Anh', email: 'phuonganh.pt@gmail.com', avatar: '🧘‍♀️', specialty: 'Phục Hồi Cột Sống & Cổ Vai', assignedStudents: 18, rating: 4.9, consultationsDone: 42, status: 'online' },
    { id: 'coach-2', name: 'Đỗ Hoàng Long', email: 'long.pt@fitpet.vn', avatar: '💪', specialty: 'HLV Thể Hình Công Thái Học', assignedStudents: 14, rating: 4.8, consultationsDone: 35, status: 'online' },
    { id: 'coach-3', name: 'Mai Phương Thảo', email: 'thao.mai@fitpet.vn', avatar: '🌸', specialty: 'Vật Lý Trị Liệu Khớp Cổ Tay & Mắt', assignedStudents: 12, rating: 5.0, consultationsDone: 28, status: 'busy' }
  ]);

  // System & AI Calibration Settings
  const [aiConfidence, setAiConfidence] = useState(0.65);
  const [pricePlus, setPricePlus] = useState(59000);
  const [priceVip, setPriceVip] = useState(899000);
  const [trialDays, setTrialDays] = useState(7);
  const [broadcastMessage, setBroadcastMessage] = useState('FitPet 2.0 đã cập nhật phác đồ phục hồi mới từ đội ngũ Huấn luyện viên!');


  // Workouts State
  const [workouts, setWorkouts] = useState(CURATED_WORKOUTS);
  const [workoutSearchFilter, setWorkoutSearchFilter] = useState('');
  const [isCreateWorkoutModalOpen, setIsCreateWorkoutModalOpen] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    title: '',
    category: 'Cổ & Vai Gáy',
    durationMinutes: 3,
    difficulty: 'Nhẹ nhàng',
    tagline: '',
    description: ''
  });

  // Users State (CRUD)
  const [users, setUsers] = useState(() => userService.getUsers());
  const [userSearchFilter, setUserSearchFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal States
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [notification, setNotification] = useState(null);

  // Form states for Create/Edit User
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    status: 'active',
    plan: 'free',
    planName: 'Gói Miễn Phí (Free)',
    primaryPainArea: 'Cổ & Vai Gáy',
    sittingHoursPerDay: '7-8 giờ',
    notes: ''
  });

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Sync users list whenever userService changes
  const reloadUsers = () => {
    setUsers(userService.getUsers());
  };

  // ================= USER CRUD HANDLERS =================
  const handleOpenCreateUser = () => {
    setUserFormData({
      name: '',
      email: '',
      phone: '',
      role: 'user',
      status: 'active',
      plan: 'free',
      planName: 'Gói Miễn Phí (Free)',
      primaryPainArea: 'Cổ & Vai Gáy',
      sittingHoursPerDay: '7-8 giờ',
      notes: ''
    });
    setIsCreateUserModalOpen(true);
  };

  const handleCreateUserSubmit = (e) => {
    e.preventDefault();
    if (!userFormData.name.trim() || !userFormData.email.trim()) {
      showToast('Vui lòng điền họ tên và email hợp lệ!', 'error');
      return;
    }

    try {
      const created = userService.createUser(userFormData);
      reloadUsers();
      setIsCreateUserModalOpen(false);
      showToast(`Đã thêm thành viên "${created.name}" thành công!`);
    } catch (err) {
      showToast('Không thể thêm người dùng. Vui lòng thử lại.', 'error');
    }
  };

  const handleOpenEditUser = (user) => {
    setUserToEdit(user);
    setUserFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      status: user.status,
      plan: user.plan || 'free',
      planName: user.planName || 'Gói Miễn Phí (Free)',
      primaryPainArea: user.primaryPainArea || 'Cổ & Vai Gáy',
      sittingHoursPerDay: user.sittingHoursPerDay || '7-8 giờ',
      notes: user.notes || ''
    });
  };

  const handleEditUserSubmit = (e) => {
    e.preventDefault();
    if (!userToEdit) return;

    if (!userFormData.name.trim() || !userFormData.email.trim()) {
      showToast('Vui lòng điền họ tên và email hợp lệ!', 'error');
      return;
    }

    const updated = userService.updateUser(userToEdit.id, userFormData);
    reloadUsers();
    
    // If the user being viewed in details is also updated, refresh the view
    if (selectedUserDetail && selectedUserDetail.id === userToEdit.id) {
      setSelectedUserDetail(updated);
    }

    setUserToEdit(null);
    showToast(`Đã cập nhật thông tin "${updated.name}" thành công!`);
  };

  const handleToggleUserStatus = (userId) => {
    const updated = userService.toggleUserStatus(userId);
    reloadUsers();
    if (selectedUserDetail && selectedUserDetail.id === userId) {
      setSelectedUserDetail(updated);
    }
    const statusText = updated.status === 'active' ? 'kích hoạt' : 'tạm khóa';
    showToast(`Đã ${statusText} tài khoản "${updated.name}"!`);
  };

  const handleConfirmDeleteUser = () => {
    if (!userToDelete) return;
    const deletedName = userToDelete.name;
    userService.deleteUser(userToDelete.id);
    reloadUsers();
    if (selectedUserDetail && selectedUserDetail.id === userToDelete.id) {
      setSelectedUserDetail(null);
    }
    setUserToDelete(null);
    showToast(`Đã xóa người dùng "${deletedName}" khỏi hệ thống!`);
  };

  const handleResetUsersDatabase = () => {
    if (window.confirm('Khôi phục danh sách người dùng mẫu ban đầu?')) {
      userService.resetToInitial();
      reloadUsers();
      showToast('Đã khôi phục dữ liệu người dùng mẫu ban đầu!');
    }
  };

  // ================= WORKOUT HANDLERS =================
  const handleCreateWorkoutSubmit = (e) => {
    e.preventDefault();
    if (!newWorkout.title) return;

    const created = {
      id: 'custom-' + Date.now(),
      title: newWorkout.title,
      tagline: newWorkout.tagline || 'Phiên tập tùy chỉnh',
      category: newWorkout.category,
      durationMinutes: Number(newWorkout.durationMinutes),
      difficulty: newWorkout.difficulty,
      isRecommended: false,
      description: newWorkout.description || 'Bài tập nhẹ nhàng tự thiết kế.',
      isReviewedByCoach: true,
      exercises: [
        {
          id: 'ex-custom-1',
          name: 'Vươn Vai & Hít Thở Sâu',
          durationSec: 45,
          targetArea: 'Cổ & Vai',
          instruction: 'Vươn nhẹ hai tay lên cao, hít vào mở rộng ngực và thở ra thả lỏng.',
          illustrationType: 'shoulder_roll',
          voiceCue: 'Vươn tay cao và hít thở sâu nào.'
        },
        {
          id: 'ex-custom-2',
          name: 'Vặn Thân Mình Nhịp Nhàng',
          durationSec: 45,
          targetArea: 'Cột Sống',
          instruction: 'Xoay người sang hai bên nhẹ nhàng trong tầm thoải mái.',
          illustrationType: 'torso_twist',
          voiceCue: 'Xoay người nhẹ nhàng sang hai bên.'
        }
      ]
    };

    setWorkouts([created, ...workouts]);
    setIsCreateWorkoutModalOpen(false);
    setNewWorkout({ title: '', category: 'Cổ & Vai Gáy', durationMinutes: 3, difficulty: 'Nhẹ nhàng', tagline: '', description: '' });
    showToast(`Đã thêm bài tập mới "${created.title}" thành công!`);
  };

  const handleDeleteWorkout = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài tập này khỏi danh mục?')) {
      setWorkouts(prev => prev.filter(w => w.id !== id));
      showToast('Đã xóa bài tập khỏi hệ thống.');
    }
  };

  // Filtered Users calculation
  const filteredUsers = users.filter(u => {
    const query = userSearchFilter.toLowerCase();
    const matchesSearch = 
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      (u.phone && u.phone.includes(query)) ||
      (u.primaryPainArea && u.primaryPainArea.toLowerCase().includes(query));
    
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const activeUsersCount = users.filter(u => u.status === 'active').length;
  const totalWorkoutsLogged = users.reduce((sum, u) => sum + (u.totalWorkouts || 0), 0);
  const totalMinutesLogged = users.reduce((sum, u) => sum + (u.totalMinutes || 0), 0);
  const totalExercises = workouts.reduce((sum, w) => sum + w.exercises.length, 0);

  const filteredWorkouts = workouts.filter(w => 
    w.title.toLowerCase().includes(workoutSearchFilter.toLowerCase()) ||
    w.category.toLowerCase().includes(workoutSearchFilter.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', paddingBottom: '60px', overflowX: 'hidden' }}>
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '16px',
          right: '16px',
          maxWidth: '380px',
          margin: '0 auto',
          zIndex: 1000,
          backgroundColor: notification.type === 'error' ? '#EF4444' : '#10B981',
          color: '#FFFFFF',
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 700,
          fontSize: '0.9rem',
          animation: 'fadeSlideDown 0.3s ease'
        }}>
          {notification.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
          {notification.message}
        </div>
      )}

      {/* Admin Top Header */}
      <header style={{
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        padding: '12px 16px',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-brand-primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-brand)',
              flexShrink: 0
            }}>
              <LayoutDashboard size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                FitPet Admin Portal
                <span className="badge badge-brand" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>v2.4 Pro</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                Hệ Thống Quản Trị Người Dùng & Giáo Án Vận Động
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={handleResetUsersDatabase}
              className="btn-ghost"
              style={{ fontSize: '0.82rem', border: '1px solid var(--color-border)', padding: '7px 11px' }}
              title="Khôi phục danh sách người dùng mẫu"
            >
              <RefreshCw size={14} style={{ marginRight: '4px' }} /> Reset
            </button>

            {onSwitchToCoach && (
              <button
                onClick={onSwitchToCoach}
                className="btn-secondary"
                style={{ fontSize: '0.82rem', padding: '7px 12px', borderColor: '#8B5CF6', color: '#7C3AED' }}
                title="Mở không gian Huấn luyện viên"
              >
                🧘 Cổng HLV
              </button>
            )}

            <button
              onClick={onBackToApp}
              className="btn-secondary"
              style={{ fontSize: '0.82rem', padding: '7px 12px' }}
            >
              <ArrowLeft size={15} /> Hội Viên
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="btn-ghost"
                style={{ fontSize: '0.82rem', padding: '7px 11px', color: '#EF4444', border: '1px solid var(--color-border)' }}
                title="Đổi vai trò hoặc đăng xuất"
              >
                Đổi Vai Trò
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Admin Container */}
      <div style={{ maxWidth: '1200px', margin: '16px auto', padding: '0 14px' }}>
        
        {/* Navigation Tabs (7 Full Operational Portals) */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '2px solid var(--color-border)',
          marginBottom: '24px',
          overflowX: 'auto',
          paddingBottom: '2px',
          scrollbarWidth: 'none'
        }}>
          {[
            { id: 'overview', label: 'Tổng Quan Hệ Thống', icon: LayoutDashboard },
            { id: 'users', label: `Người Dùng (${users.length})`, icon: Users },
            { id: 'workouts', label: `Bài Tập (${workouts.length})`, icon: Dumbbell },
            { id: 'revenue', label: `Doanh Thu & Thuê Bao (${transactions.length})`, icon: DollarSign },
            { id: 'coaches', label: `Đội Ngũ HLV (${coachesList.length})`, icon: Award },
            { id: 'settings', label: 'Cài Đặt & AI', icon: Settings },
            { id: 'review', label: 'Kiểm Duyệt An Toàn', icon: ShieldCheck }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '12px 16px',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '3px solid var(--color-brand-primary)' : '3px solid transparent',
                  color: isActive ? 'var(--color-brand-primary)' : 'var(--color-text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <Icon size={17} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ================= TAB 0: EXECUTIVE OVERVIEW & TELEMETRY [NEW] ================= */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Top 4 Financial & Health KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div className="card" style={{ padding: '22px', borderLeft: '4px solid var(--color-brand-primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    DOANH THU THÁNG (MRR)
                  </span>
                  <DollarSign size={18} style={{ color: 'var(--color-brand-primary)' }} />
                </div>
                <div style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--color-text-primary)' }}>
                  148.500.000 đ
                </div>
                <div style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 700, marginTop: '4px' }}>
                  ↑ +18.4% so với tháng trước (ARR ~1.78 tỷ)
                </div>
              </div>

              <div className="card" style={{ padding: '22px', borderLeft: '4px solid #0EA5E9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    HỘI VIÊN HOẠT ĐỘNG (MAU)
                  </span>
                  <Users size={18} style={{ color: '#0EA5E9' }} />
                </div>
                <div style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--color-text-primary)' }}>
                  2.840 <span style={{ fontSize: '1rem', fontWeight: 600 }}>người</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  1.120 người tập đều đặn hàng ngày (DAU)
                </div>
              </div>

              <div className="card" style={{ padding: '22px', borderLeft: '4px solid #F59E0B' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    TỶ LỆ GIỮ CHÂN (RETENTION)
                  </span>
                  <TrendingUp size={18} style={{ color: '#F59E0B' }} />
                </div>
                <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#F59E0B' }}>
                  84.6%
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Tỷ lệ học viên quay lại sau 30 ngày sử dụng
                </div>
              </div>

              <div className="card" style={{ padding: '22px', borderLeft: '4px solid #8B5CF6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    TỔNG PHÚT VẬN ĐỘNG HỆ THỐNG
                  </span>
                  <Activity size={18} style={{ color: '#8B5CF6' }} />
                </div>
                <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#8B5CF6' }}>
                  54.200 <span style={{ fontSize: '1rem', fontWeight: 600 }}>phút</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Đạt 18.400 phiên giải tỏa cơ mỏi hoàn thành
                </div>
              </div>
            </div>

            {/* Peak Hours Heatmap & AI Engine Telemetry */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
              {/* Peak Hours Box */}
              <div className="card" style={{ padding: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                    Khung Giờ Vận Động Đỉnh Điểm Của Dân Văn Phòng
                  </h3>
                  <span className="badge badge-amber" style={{ fontSize: '0.72rem' }}>Thực Tế</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { time: '09:30 - 10:30', label: 'Vươn vai sáng & Giải tỏa đốt sống cổ', percent: 88, highlight: true },
                    { time: '11:45 - 12:30', label: 'Thả lỏng mắt & Hít thở trước bữa trưa', percent: 52, highlight: false },
                    { time: '15:00 - 16:00', label: 'Đỉnh điểm mỏi thắt lưng & buồn ngủ chiều', percent: 94, highlight: true },
                    { time: '17:15 - 18:00', label: 'Xoay cổ tay & Xả căng thẳng cuối ngày', percent: 68, highlight: false }
                  ].map((slot, idx) => (
                    <div key={idx} style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', backgroundColor: slot.highlight ? 'rgba(16, 185, 129, 0.08)' : 'var(--color-surface-subtle)', border: slot.highlight ? '1.5px solid var(--color-brand-primary)' : '1px solid var(--color-border-subtle)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.88rem', color: slot.highlight ? 'var(--color-brand-dark)' : 'var(--color-text-primary)' }}>
                          ⏰ {slot.time} • {slot.label}
                        </span>
                        <span style={{ fontWeight: 800, fontSize: '0.84rem', color: slot.highlight ? 'var(--color-brand-primary)' : 'var(--color-text-muted)' }}>
                          {slot.percent}% hoạt động
                        </span>
                      </div>
                      <div style={{ height: '6px', backgroundColor: 'var(--color-border)', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ width: `${slot.percent}%`, height: '100%', backgroundColor: slot.highlight ? 'var(--color-brand-primary)' : '#94A3B8', borderRadius: '999px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Server & AI Health */}
              <div className="card" style={{ padding: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                    Hạ Tầng Hệ Thống & AI Pose Engine
                  </h3>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#10B981', fontSize: '0.78rem', fontWeight: 700 }}>
                    ● 100% Sẵn Sàng
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                      <Server size={16} style={{ color: 'var(--color-brand-primary)' }} />
                      Độ trễ AI Pose (On-Device Inference)
                    </div>
                    <span style={{ fontWeight: 800, color: '#10B981' }}>32 ms (Rất nhanh)</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                      <ShieldCheck size={16} style={{ color: '#0EA5E9' }} />
                      Bảo Mật Quyền Riêng Tư (Privacy Sandbox)
                    </div>
                    <span style={{ fontWeight: 800, color: '#0EA5E9' }}>Không tải video</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                      <Clock size={16} style={{ color: '#F59E0B' }} />
                      Uptime Máy Chủ Toàn Thời Gian
                    </div>
                    <span style={{ fontWeight: 800, color: '#F59E0B' }}>99.98%</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                      <CreditCard size={16} style={{ color: '#8B5CF6' }} />
                      Cổng Thanh Toán VietQR / MoMo / Stripe
                    </div>
                    <span style={{ fontWeight: 800, color: '#8B5CF6' }}>Kết Nối Ổn Định</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="btn-secondary"
                    style={{ flex: 1, fontSize: '0.84rem', padding: '8px' }}
                  >
                    <Sliders size={14} style={{ marginRight: '4px' }} /> Cấu Hình AI
                  </button>
                  <button
                    onClick={() => setActiveTab('revenue')}
                    className="btn-primary"
                    style={{ flex: 1, fontSize: '0.84rem', padding: '8px' }}
                  >
                    <DollarSign size={14} style={{ marginRight: '4px' }} /> Xem Doanh Thu
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 1: USERS MANAGEMENT (CRUD) ================= */}
        {activeTab === 'users' && (
          <div>
            {/* KPI Cards for Users */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-brand-primary)', marginBottom: '8px' }}>
                  <Users size={20} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Tổng Số Người Dùng</span>
                </div>
                <div style={{ fontSize: '2.1rem', fontWeight: 800 }}>{users.length}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  {activeUsersCount} đang kích hoạt, {users.length - activeUsersCount} tạm khóa
                </div>
              </div>

              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', marginBottom: '8px' }}>
                  <UserCheck size={20} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Tỷ Lệ Hoạt Động</span>
                </div>
                <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#10B981' }}>
                  {users.length > 0 ? Math.round((activeUsersCount / users.length) * 100) : 0}%
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Người dùng vận động đều đặn hàng tuần
                </div>
              </div>

              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0EA5E9', marginBottom: '8px' }}>
                  <Activity size={20} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Buổi Tập Đã Hoàn Thành</span>
                </div>
                <div style={{ fontSize: '2.1rem', fontWeight: 800 }}>{totalWorkoutsLogged}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Khoảng {totalMinutesLogged} phút vận động nhẹ nhàng
                </div>
              </div>

              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F59E0B', marginBottom: '8px' }}>
                  <HeartPulse size={20} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Vùng Đau Phổ Biến</span>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '8px' }}>Cổ & Vai Gáy (58%)</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Theo thống kê khai báo của người dùng
                </div>
              </div>

              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8B5CF6', marginBottom: '8px' }}>
                  <Crown size={20} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Gói Trả Phí (Paid)</span>
                </div>
                <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#8B5CF6' }}>
                  {users.filter(u => u.role === 'user' && (u.plan === 'plus' || u.plan === 'vip')).length}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  {users.filter(u => u.role === 'user' && u.plan === 'vip').length} VIP trọn đời, {users.filter(u => u.role === 'user' && u.plan === 'plus').length} Plus (Người dùng)
                </div>
              </div>
            </div>

            {/* Filter & Actions Bar */}
            <div className="card" style={{ padding: '20px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
                <div style={{ display: 'flex', gap: '12px', flex: '1 1 500px', flexWrap: 'wrap' }}>
                  {/* Search Input */}
                  <div style={{ position: 'relative', flex: '1 1 260px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input
                      type="text"
                      value={userSearchFilter}
                      onChange={e => setUserSearchFilter(e.target.value)}
                      placeholder="Tìm kiếm theo tên, email, SĐT hoặc vùng đau..."
                      style={{
                        width: '100%',
                        padding: '9px 14px 9px 36px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-surface-subtle)',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>

                  {/* Role Filter */}
                  <select
                    value={roleFilter}
                    onChange={e => setRoleFilter(e.target.value)}
                    style={{
                      padding: '9px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-surface)',
                      fontSize: '0.88rem',
                      fontWeight: 600
                    }}
                  >
                    <option value="all">Tất cả vai trò</option>
                    <option value="user">Thành viên (Member)</option>
                    <option value="admin">Quản trị viên (Admin)</option>
                    <option value="coach">Huấn luyện viên (Coach)</option>
                  </select>

                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    style={{
                      padding: '9px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-surface)',
                      fontSize: '0.88rem',
                      fontWeight: 600
                    }}
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="active">Đang hoạt động</option>
                    <option value="inactive">Đang tạm khóa</option>
                  </select>
                </div>

                {/* Create User Button */}
                <button
                  onClick={handleOpenCreateUser}
                  className="btn-primary"
                  style={{ fontSize: '0.88rem', padding: '9px 18px', minHeight: '38px', gap: '8px' }}
                >
                  <UserPlus size={16} /> Thêm Người Dùng Mới
                </button>
              </div>

              {/* Users Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '12px 14px' }}>NGƯỜI DÙNG</th>
                      <th style={{ padding: '12px 14px' }}>GÓI THUÊ BAO</th>
                      <th style={{ padding: '12px 14px' }}>VAI TRÒ</th>
                      <th style={{ padding: '12px 14px' }}>TRẠNG THÁI</th>
                      <th style={{ padding: '12px 14px' }}>VÙNG QUAN TÂM</th>
                      <th style={{ padding: '12px 14px' }}>BUỔI TẬP</th>
                      <th style={{ padding: '12px 14px' }}>NGÀY THAM GIA</th>
                      <th style={{ padding: '12px 14px', textAlign: 'right' }}>THAO TÁC (CRUD)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ padding: '36px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                          Không tìm thấy người dùng nào phù hợp với bộ lọc.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map(user => (
                        <tr 
                          key={user.id} 
                          style={{ 
                            borderBottom: '1px solid var(--color-border-subtle)',
                            transition: 'background-color 0.15s ease'
                          }}
                        >
                          {/* User Info */}
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--color-surface-subtle)',
                                border: '1px solid var(--color-border)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.2rem',
                                flexShrink: 0
                              }}>
                                {user.avatarEmoji || '🏃'}
                              </div>
                              <div>
                                <div style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
                                  {user.name}
                                </div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Subscription Plan */}
                          <td style={{ padding: '12px 14px' }}>
                            {user.role === 'admin' ? (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '4px 10px',
                                borderRadius: 'var(--radius-full)',
                                backgroundColor: 'rgba(99, 102, 241, 0.08)',
                                color: 'var(--color-brand-primary)',
                                fontWeight: 700,
                                fontSize: '0.74rem',
                                border: '1px dashed rgba(99, 102, 241, 0.3)'
                              }}>
                                <ShieldCheck size={13} /> Đặc quyền Admin
                              </span>
                            ) : user.role === 'coach' ? (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '4px 10px',
                                borderRadius: 'var(--radius-full)',
                                backgroundColor: 'rgba(245, 158, 11, 0.08)',
                                color: '#D97706',
                                fontWeight: 700,
                                fontSize: '0.74rem',
                                border: '1px dashed rgba(245, 158, 11, 0.3)'
                              }}>
                                <Sparkles size={13} /> Đặc quyền HLV
                              </span>
                            ) : user.plan === 'vip' ? (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '4px 10px',
                                borderRadius: 'var(--radius-full)',
                                background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.18), rgba(245, 158, 11, 0.28))',
                                color: '#B45309',
                                fontWeight: 800,
                                fontSize: '0.74rem',
                                border: '1px solid rgba(245, 158, 11, 0.4)'
                              }}>
                                <Crown size={13} style={{ color: '#D97706' }} /> VIP Trọn Đời
                              </span>
                            ) : user.plan === 'plus' ? (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '4px 10px',
                                borderRadius: 'var(--radius-full)',
                                background: 'rgba(59, 130, 246, 0.12)',
                                color: '#2563EB',
                                fontWeight: 800,
                                fontSize: '0.74rem',
                                border: '1px solid rgba(59, 130, 246, 0.3)'
                              }}>
                                <Star size={13} style={{ color: '#2563EB' }} /> Plus Hội Viên
                              </span>
                            ) : (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '3px 8px',
                                borderRadius: 'var(--radius-full)',
                                backgroundColor: 'var(--color-surface-subtle)',
                                color: 'var(--color-text-muted)',
                                fontWeight: 600,
                                fontSize: '0.74rem',
                                border: '1px solid var(--color-border)'
                              }}>
                                Cơ bản (Free)
                              </span>
                            )}
                          </td>

                          {/* Role */}
                          <td style={{ padding: '12px 14px' }}>
                            {user.role === 'admin' ? (
                              <span className="badge badge-brand" style={{ fontSize: '0.72rem', fontWeight: 700 }}>
                                Quản trị viên
                              </span>
                            ) : user.role === 'coach' ? (
                              <span className="badge badge-amber" style={{ fontSize: '0.72rem', fontWeight: 700 }}>
                                HLV Thể hình
                              </span>
                            ) : (
                              <span className="badge" style={{ fontSize: '0.72rem', backgroundColor: 'var(--color-surface-subtle)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>
                                Thành viên
                              </span>
                            )}
                          </td>

                          {/* Status */}
                          <td style={{ padding: '12px 14px' }}>
                            {user.status === 'active' ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#10B981', fontWeight: 600, fontSize: '0.8rem' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
                                Hoạt động
                              </span>
                            ) : (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#EF4444', fontWeight: 600, fontSize: '0.8rem' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444', display: 'inline-block' }} />
                                Tạm khóa
                              </span>
                            )}
                          </td>

                          {/* Primary Pain Area */}
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{
                              fontSize: '0.76rem',
                              fontWeight: 600,
                              padding: '3px 8px',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: 'rgba(239, 68, 68, 0.08)',
                              color: '#DC2626',
                              border: '1px solid rgba(239, 68, 68, 0.2)'
                            }}>
                              {user.primaryPainArea || 'Cổ & Vai Gáy'}
                            </span>
                          </td>

                          {/* Workout Activity */}
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ fontWeight: 700 }}>{user.totalWorkouts || 0} buổi</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                              {user.totalMinutes || 0} phút ({user.cameraRepsCount || 0} reps AI)
                            </div>
                          </td>

                          {/* Joined Date */}
                          <td style={{ padding: '12px 14px', color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>
                            {user.joinedDate || '2026-10-01'}
                          </td>

                          {/* Actions (CRUD) */}
                          <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                              {/* View Details */}
                              <button
                                onClick={() => setSelectedUserDetail(user)}
                                className="icon-btn"
                                style={{ width: '32px', height: '32px', color: 'var(--color-brand-primary)' }}
                                title="Xem chi tiết thông tin và lịch sử tập"
                              >
                                <Eye size={15} />
                              </button>

                              {/* Edit User */}
                              <button
                                onClick={() => handleOpenEditUser(user)}
                                className="icon-btn"
                                style={{ width: '32px', height: '32px', color: '#0EA5E9' }}
                                title="Chỉnh sửa thông tin"
                              >
                                <Edit size={15} />
                              </button>

                              {/* Toggle Status */}
                              <button
                                onClick={() => handleToggleUserStatus(user.id)}
                                className="icon-btn"
                                style={{ width: '32px', height: '32px', color: user.status === 'active' ? '#F59E0B' : '#10B981' }}
                                title={user.status === 'active' ? 'Tạm khóa tài khoản' : 'Kích hoạt lại'}
                              >
                                {user.status === 'active' ? <Lock size={15} /> : <Unlock size={15} />}
                              </button>

                              {/* Delete User */}
                              <button
                                onClick={() => setUserToDelete(user)}
                                className="icon-btn"
                                style={{ width: '32px', height: '32px', color: '#EF4444' }}
                                title="Xóa người dùng"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: WORKOUTS MANAGEMENT ================= */}
        {activeTab === 'workouts' && (
          <div>
            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-brand-primary)', marginBottom: '8px' }}>
                  <Dumbbell size={20} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Tổng Bài Tập</span>
                </div>
                <div style={{ fontSize: '2.1rem', fontWeight: 800 }}>{workouts.length}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>Giáo án vận động không dụng cụ</div>
              </div>

              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0EA5E9', marginBottom: '8px' }}>
                  <Clock size={20} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Tổng Động Tác Mẫu</span>
                </div>
                <div style={{ fontSize: '2.1rem', fontWeight: 800 }}>{totalExercises}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>Động tác giải tỏa cơ học mẫu</div>
              </div>

              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', marginBottom: '8px' }}>
                  <ShieldCheck size={20} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Kiểm Duyệt Thể Hình</span>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10B981', marginTop: '4px' }}>100% Đã Duyệt</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>Theo tiêu chuẩn an toàn cho người mới</div>
              </div>
            </div>

            {/* Content Management Bar */}
            <div className="card" style={{ padding: '20px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
                <div style={{ position: 'relative', flex: '1 1 280px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input
                    type="text"
                    value={workoutSearchFilter}
                    onChange={e => setWorkoutSearchFilter(e.target.value)}
                    placeholder="Tìm bài tập theo tên hoặc danh mục..."
                    style={{
                      width: '100%',
                      padding: '9px 14px 9px 36px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-surface-subtle)',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>

                <button
                  onClick={() => setIsCreateWorkoutModalOpen(true)}
                  className="btn-primary"
                  style={{ fontSize: '0.88rem', padding: '9px 18px', minHeight: '38px', gap: '8px' }}
                >
                  <Plus size={16} /> Thêm Bài Tập Mới
                </button>
              </div>

              {/* Table of Curated Workouts */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '12px 14px' }}>TÊN BÀI TẬP</th>
                      <th style={{ padding: '12px 14px' }}>DANH MỤC</th>
                      <th style={{ padding: '12px 14px' }}>THỜI LƯỢNG</th>
                      <th style={{ padding: '12px 14px' }}>SỐ ĐỘNG TÁC</th>
                      <th style={{ padding: '12px 14px' }}>TRẠNG THÁI</th>
                      <th style={{ padding: '12px 14px', textAlign: 'right' }}>THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWorkouts.map(w => (
                      <tr key={w.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                          {w.title}
                          {w.isRecommended && <span className="badge badge-brand" style={{ marginLeft: '8px', fontSize: '0.7rem' }}>Khuyên Dùng</span>}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span className="badge badge-amber" style={{ fontSize: '0.72rem' }}>{w.category}</span>
                        </td>
                        <td style={{ padding: '12px 14px', color: 'var(--color-text-muted)' }}>{w.durationMinutes} phút</td>
                        <td style={{ padding: '12px 14px', color: 'var(--color-text-muted)' }}>{w.exercises.length} động tác</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#10B981', fontWeight: 600, fontSize: '0.8rem' }}>
                            <CheckCircle2 size={14} /> Đã kiểm định
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                          <button
                            onClick={() => handleDeleteWorkout(w.id)}
                            className="icon-btn"
                            style={{ width: '32px', height: '32px', color: '#EF4444' }}
                            title="Xóa bài tập"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: REVIEW GUIDELINES ================= */}
        {activeTab === 'review' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <ShieldCheck size={26} style={{ color: 'var(--color-brand-primary)' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Nguyên Tắc Kiểm Duyệt Giáo Án Vận Động FitPet</h3>
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
                Định vị sản phẩm FitPet: <strong>Không định vị như một phương pháp điều trị y tế hay phục hồi chấn thương</strong>. Thay vào đó, FitPet đóng vai trò là một người bạn đồng hành xây dựng thói quen nhẹ nhàng, khích lệ và không phán xét cho người ngồi nhiều và người mới bắt đầu.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface-subtle)', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontWeight: 800, color: 'var(--color-brand-primary)', marginBottom: '6px' }}>1. Thiết Kế Không Dụng Cụ (Zero Equipment)</div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                    Mọi bài tập phải có thể thực hiện ngay tại bàn làm việc hoặc không gian nhỏ hẹp ở nhà mà không cần thảm, tạ hay dụng cụ hỗ trợ.
                  </div>
                </div>

                <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface-subtle)', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontWeight: 800, color: '#0EA5E9', marginBottom: '6px' }}>2. Luôn Có Phương Án Nhẹ Hơn (Easier Variant)</div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                    Bất kỳ động tác nào cũng phải có biến thể nhẹ hơn để người đang mỏi mệt hoặc người lớn tuổi có thể điều chỉnh bất kỳ lúc nào.
                  </div>
                </div>

                <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface-subtle)', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontWeight: 800, color: '#10B981', marginBottom: '6px' }}>3. Nhận Diện Tư Thế Tùy Chọn & Riêng Tư</div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                    Tính năng Camera AI chỉ là tùy chọn hỗ trợ người dùng căn chỉnh góc nghiêng cơ bản, 100% xử lý trên thiết bị, không lưu trữ hình ảnh cá nhân.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: REVENUE, SUBSCRIPTIONS & TRANSACTIONS [NEW] ================= */}
        {activeTab === 'revenue' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Subscription Tiers KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              <div className="card" style={{ padding: '22px', borderTop: '4px solid #10B981' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    GÓI MIỄN PHÍ (FREE)
                  </span>
                  <span className="badge" style={{ fontSize: '0.7rem' }}>Cơ Bản</span>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-text-primary)' }}>
                  1.080 <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>hội viên (38%)</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Mở 3 bài tập cơ bản, nuôi dưỡng thú cưng Pip level 1-5
                </div>
              </div>

              <div className="card" style={{ padding: '22px', borderTop: '4px solid #2563EB' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    GÓI PLUS (59.000 Đ/THÁNG)
                  </span>
                  <span className="badge badge-brand" style={{ fontSize: '0.7rem' }}>Phổ Biến Nhất</span>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#2563EB' }}>
                  1.250 <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>hội viên (44%)</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Doanh thu tháng: ~73.750.000 đ • Mở khóa Camera AI & mọi vùng đau
                </div>
              </div>

              <div className="card" style={{ padding: '22px', borderTop: '4px solid #D97706' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    GÓI VIP TRỌN ĐỜI (899.000 Đ)
                  </span>
                  <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>Cao Cấp</span>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#D97706' }}>
                  510 <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>hội viên (18%)</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Doanh thu tích lũy: ~458.490.000 đ • Kèm 02 buổi tham vấn 1-1 cùng HLV
                </div>
              </div>
            </div>

            {/* Transactions Log Table */}
            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                    Nhật Ký Giao Dịch Thanh Toán Mới Nhất
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    Tự động đồng bộ từ cổng VietQR, MoMo và Stripe quốc tế
                  </div>
                </div>
                <button
                  onClick={() => showToast('Đang xuất hóa đơn & báo cáo tài chính Excel...')}
                  className="btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                >
                  <FileText size={14} style={{ marginRight: '4px' }} /> Xuất Báo Cáo
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--color-surface-subtle)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '12px 16px' }}>MÃ GIAO DỊCH</th>
                      <th style={{ padding: '12px 16px' }}>KHÁCH HÀNG</th>
                      <th style={{ padding: '12px 16px' }}>GÓI DỊCH VỤ</th>
                      <th style={{ padding: '12px 16px' }}>SỐ TIỀN</th>
                      <th style={{ padding: '12px 16px' }}>PHƯƠNG THỨC</th>
                      <th style={{ padding: '12px 16px' }}>THỜI GIAN</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>TRẠNG THÁI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(txn => (
                      <tr key={txn.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
                          {txn.id}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontWeight: 700 }}>{txn.user}</div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>{txn.email}</div>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span className={txn.plan.includes('VIP') ? 'badge badge-amber' : 'badge badge-brand'} style={{ fontSize: '0.74rem' }}>
                            {txn.plan}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                          {txn.amount}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
                          {txn.method}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                          {txn.date}
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#10B981', fontWeight: 700, fontSize: '0.8rem' }}>
                            <CheckCircle2 size={14} /> Thành công
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Corporate Vouchers Management */}
            <div className="card" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                    Mã Ưu Đãi Doanh Nghiệp & Đối Tác (B2B Vouchers)
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    Áp dụng cho các công ty triển khai chương trình phúc lợi vận động nhân viên
                  </div>
                </div>
                <button
                  onClick={() => showToast('Mở form tạo mã ưu đãi B2B')}
                  className="btn-primary"
                  style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                >
                  <Plus size={14} style={{ marginRight: '4px' }} /> Thêm Mã Mới
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                {vouchers.map(v => (
                  <div key={v.code} style={{ padding: '14px 16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface-subtle)', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '1rem', color: 'var(--color-brand-dark)', letterSpacing: '0.05em' }}>
                        🏷️ {v.code}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#10B981', fontWeight: 700, marginTop: '2px' }}>
                        {v.discount} • Đã dùng: {v.uses}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        Hết hạn: {v.expires}
                      </div>
                    </div>
                    <span className="badge badge-brand" style={{ fontSize: '0.68rem' }}>Đang Chạy</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: COACHES ROSTER [NEW] ================= */}
        {activeTab === 'coaches' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="card" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                    Đội Ngũ Huấn Luyện Viên Thể Hình & Phục Hồi Chức Năng
                  </h3>
                  <div style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    Thẩm định bài tập, kê đơn phác đồ điều trị và tham vấn 1-1 cho hội viên VIP.
                  </div>
                </div>
                <button
                  onClick={() => showToast('Mở form mời Huấn luyện viên mới')}
                  className="btn-primary"
                  style={{ fontSize: '0.84rem', padding: '7px 16px', backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' }}
                >
                  <Plus size={15} style={{ marginRight: '4px' }} /> Mời HLV Mới
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                {coachesList.map(c => (
                  <div key={c.id} style={{ padding: '18px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface-subtle)', border: '1.5px solid var(--color-border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                        <div style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(139, 92, 246, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.4rem'
                        }}>
                          {c.avatar}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>{c.name}</h4>
                            <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 700 }}>● Online</span>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{c.email}</div>
                        </div>
                      </div>

                      <div style={{ fontSize: '0.84rem', color: '#7C3AED', fontWeight: 700, marginBottom: '12px' }}>
                        Chuyên môn: {c.specialty}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', padding: '10px', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-subtle)', textAlign: 'center', marginBottom: '14px' }}>
                        <div>
                          <div style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>{c.assignedStudents}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Học viên</div>
                        </div>
                        <div>
                          <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#F59E0B' }}>⭐ {c.rating}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Đánh giá</div>
                        </div>
                        <div>
                          <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#10B981' }}>{c.consultationsDone}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Ca tham vấn</div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => showToast(`Đã mở danh sách học viên của HLV ${c.name}`)}
                        className="btn-secondary"
                        style={{ flex: 1, fontSize: '0.8rem', padding: '6px' }}
                      >
                        Học Viên
                      </button>
                      <button
                        onClick={() => {
                          onSwitchToCoach();
                          showToast(`Đã chuyển sang không gian làm việc của HLV ${c.name}`);
                        }}
                        className="btn-primary"
                        style={{ flex: 1, fontSize: '0.8rem', padding: '6px', backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' }}
                      >
                        Vào Cổng HLV
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 6: SYSTEM & AI CALIBRATION SETTINGS [NEW] ================= */}
        {activeTab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* AI Engine Calibration */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <Sliders size={22} style={{ color: 'var(--color-brand-primary)' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                  Cấu Hình Ngưỡng Nhận Diện AI Camera (Pose Detection Engine)
                </h3>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', marginBottom: '18px' }}>
                Thiết lập độ nhạy nhận diện góc nghiêng khớp xương khi hội viên thực hiện các động tác xoay vai, vặn thân mình và giãn cổ tay.
              </p>

              <div style={{ backgroundColor: 'var(--color-surface-subtle)', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>Ngưỡng tin cậy khớp xương (Confidence Threshold):</span>
                  <span style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--color-brand-primary)' }}>{aiConfidence}</span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="0.85"
                  step="0.05"
                  value={aiConfidence}
                  onChange={e => setAiConfidence(parseFloat(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  <span>0.40 (Dễ tính - Khuyên dùng cho phòng thiếu sáng)</span>
                  <span>0.65 (Cân bằng chuẩn y khoa)</span>
                  <span>0.85 (Khắt khe - Dành cho VĐV)</span>
                </div>
              </div>
            </div>

            {/* Pricing & Free Trial */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <DollarSign size={22} style={{ color: '#F59E0B' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                  Thiết Lập Giá Niêm Yết & Thời Gian Dùng Thử
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                    Giá Gói FitPet Plus (VNĐ / Tháng)
                  </label>
                  <input
                    type="number"
                    step="1000"
                    value={pricePlus}
                    onChange={e => setPricePlus(parseInt(e.target.value))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', fontSize: '0.92rem', fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                    Giá Gói FitPet VIP Trọn Đời (VNĐ)
                  </label>
                  <input
                    type="number"
                    step="1000"
                    value={priceVip}
                    onChange={e => setPriceVip(parseInt(e.target.value))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', fontSize: '0.92rem', fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                    Số Ngày Dùng Thử Miễn Phí (Trial Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={trialDays}
                    onChange={e => setTrialDays(parseInt(e.target.value))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', fontSize: '0.92rem', fontWeight: 700 }}
                  />
                </div>
              </div>
            </div>

            {/* Broadcast System Banner */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <ShieldCheck size={22} style={{ color: '#0EA5E9' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                  Phát Thông Báo Toàn Ứng Dụng (Broadcast Notification)
                </h3>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
                Thông điệp này sẽ hiển thị trên đầu ứng dụng của toàn bộ Hội viên khi đăng nhập.
              </p>

              <textarea
                rows="2"
                value={broadcastMessage}
                onChange={e => setBroadcastMessage(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', fontSize: '0.88rem', marginBottom: '16px' }}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => showToast('Đã lưu cấu hình hệ thống & hiệu chuẩn AI thành công!')}
                  className="btn-primary"
                  style={{ padding: '10px 24px', fontSize: '0.92rem' }}
                >
                  <Save size={16} style={{ marginRight: '6px' }} /> Lưu Thay Đổi Cấu Hình
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL: VIEW USER DETAILS ================= */}
      {selectedUserDetail && (
        <div className="modal-backdrop" onClick={() => setSelectedUserDetail(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '620px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-surface-subtle)',
                  border: '2px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {selectedUserDetail.avatarEmoji || '🏃'}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{selectedUserDetail.name}</h3>
                    {selectedUserDetail.status === 'active' ? (
                      <span className="badge badge-brand" style={{ fontSize: '0.72rem' }}>Hoạt động</span>
                    ) : (
                      <span className="badge" style={{ fontSize: '0.72rem', backgroundColor: '#FEE2E2', color: '#DC2626' }}>Tạm khóa</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    ID: {selectedUserDetail.id} • Tham gia ngày {selectedUserDetail.joinedDate || '2026-10-01'}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedUserDetail(null)} className="icon-btn">
                <X size={18} />
              </button>
            </div>

            {/* Profile Detail Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div style={{ padding: '12px', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                  <Mail size={13} /> Email liên hệ
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{selectedUserDetail.email}</div>
              </div>

              <div style={{ padding: '12px', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                  <Phone size={13} /> Số điện thoại
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{selectedUserDetail.phone || 'Chưa cập nhật'}</div>
              </div>

              <div style={{ padding: '12px', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                  <HeartPulse size={13} /> Vùng cơ thể hay mỏi
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#DC2626' }}>
                  {selectedUserDetail.primaryPainArea || 'Cổ & Vai Gáy'}
                </div>
              </div>

              <div style={{ padding: '12px', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                  <Clock size={13} /> Thời gian ngồi làm việc
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                  {selectedUserDetail.sittingHoursPerDay || '7-8 giờ/ngày'}
                </div>
              </div>

              {/* Subscription Plan Detail */}
              {selectedUserDetail.role === 'admin' || selectedUserDetail.role === 'coach' ? (
                <div style={{
                  padding: '14px',
                  backgroundColor: 'var(--color-surface-subtle)',
                  borderRadius: 'var(--radius-md)',
                  gridColumn: 'span 2',
                  border: '1px dashed var(--color-border)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: selectedUserDetail.role === 'admin' ? 'rgba(99, 102, 241, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: selectedUserDetail.role === 'admin' ? 'var(--color-brand-primary)' : '#D97706'
                    }}>
                      {selectedUserDetail.role === 'admin' ? <ShieldCheck size={20} /> : <Sparkles size={20} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--color-text-primary)' }}>
                        {selectedUserDetail.role === 'admin' ? 'Tài Khoản Quản Trị Viên Hệ Thống' : 'Tài Khoản Huấn Luyện Viên Thể Hình'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        🛡️ Tài khoản đặc quyền nội bộ FitPet — Không áp dụng và không cần mua gói thuê bao người dùng.
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '12px', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-md)', gridColumn: 'span 2' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                        <Crown size={13} style={{ color: '#D97706' }} /> Gói Thuê Bao Hiện Tại
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {selectedUserDetail.planName || (selectedUserDetail.plan === 'vip' ? 'FitPet VIP Trọn Đời' : selectedUserDetail.plan === 'plus' ? 'FitPet Plus' : 'Gói Miễn Phí (Free)')}
                        {selectedUserDetail.plan === 'vip' && <span className="badge badge-amber" style={{ fontSize: '0.68rem' }}>Trọn Đời</span>}
                        {selectedUserDetail.plan === 'plus' && <span className="badge badge-brand" style={{ fontSize: '0.68rem' }}>Plus</span>}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      Hết hạn: <strong style={{ color: 'var(--color-text-primary)' }}>{selectedUserDetail.planExpiry || 'Vĩnh viễn'}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Activity Summary Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              padding: '14px',
              backgroundColor: 'var(--color-surface-subtle)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              marginBottom: '20px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-brand-primary)' }}>
                  {selectedUserDetail.totalWorkouts || 0}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>Buổi Tập</div>
              </div>

              <div style={{ height: '30px', width: '1px', backgroundColor: 'var(--color-border)' }} />

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0EA5E9' }}>
                  {selectedUserDetail.totalMinutes || 0}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>Phút Vận Động</div>
              </div>

              <div style={{ height: '30px', width: '1px', backgroundColor: 'var(--color-border)' }} />

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10B981' }}>
                  {selectedUserDetail.cameraRepsCount || 0}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>Reps Camera AI</div>
              </div>
            </div>

            {/* Recent Workouts History */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Activity size={16} /> Lịch Sử Buổi Tập Gần Nhất
              </div>
              {selectedUserDetail.workoutHistory && selectedUserDetail.workoutHistory.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedUserDetail.workoutHistory.map((h, idx) => (
                    <div key={idx} style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--color-surface-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.84rem'
                    }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>{h.workoutTitle}</div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                          {h.date} • {h.durationMinutes} phút • {h.repsDetected} reps nhận diện
                        </div>
                      </div>
                      <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, fontSize: '0.78rem' }}>
                        <CheckCircle2 size={14} /> Hoàn tất
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '16px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.84rem', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-sm)' }}>
                  Người dùng này chưa ghi nhận buổi tập nào gần đây.
                </div>
              )}
            </div>

            {/* Notes */}
            {selectedUserDetail.notes && (
              <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-surface-subtle)', fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
                <strong>Ghi chú chuyên môn:</strong> {selectedUserDetail.notes}
              </div>
            )}

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
              <button
                onClick={() => handleToggleUserStatus(selectedUserDetail.id)}
                className="btn-ghost"
                style={{
                  fontSize: '0.84rem',
                  color: selectedUserDetail.status === 'active' ? '#EF4444' : '#10B981',
                  border: '1px solid var(--color-border)'
                }}
              >
                {selectedUserDetail.status === 'active' ? (
                  <>
                    <Lock size={14} style={{ marginRight: '6px' }} /> Tạm Khóa Tài Khoản
                  </>
                ) : (
                  <>
                    <Unlock size={14} style={{ marginRight: '6px' }} /> Kích Hoạt Tài Khoản
                  </>
                )}
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => {
                    handleOpenEditUser(selectedUserDetail);
                  }}
                  className="btn-secondary"
                  style={{ fontSize: '0.84rem', padding: '8px 16px' }}
                >
                  <Edit size={14} /> Chỉnh Sửa
                </button>
                <button
                  onClick={() => setSelectedUserDetail(null)}
                  className="btn-primary"
                  style={{ fontSize: '0.84rem', padding: '8px 18px', minHeight: '36px' }}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE NEW USER ================= */}
      {isCreateUserModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsCreateUserModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus size={20} style={{ color: 'var(--color-brand-primary)' }} /> Thêm Người Dùng Mới
              </h3>
              <button onClick={() => setIsCreateUserModalOpen(false)} className="icon-btn">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '4px' }}>
                  Họ và Tên *
                </label>
                <input
                  type="text"
                  required
                  value={userFormData.name}
                  onChange={e => setUserFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ví dụ: Lê Bảo Hoàng"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '4px' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={userFormData.email}
                    onChange={e => setUserFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@example.com"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '4px' }}>
                    Số Điện Thoại
                  </label>
                  <input
                    type="text"
                    value={userFormData.phone}
                    onChange={e => setUserFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="0912 xxx xxx"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '4px' }}>
                    Vai Trò (Role)
                  </label>
                  <select
                    value={userFormData.role}
                    onChange={e => setUserFormData(prev => ({ ...prev, role: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}
                  >
                    <option value="user">Thành viên (User)</option>
                    <option value="admin">Quản trị viên (Admin)</option>
                    <option value="coach">Huấn luyện viên (Coach)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '4px' }}>
                    Trạng Thái
                  </label>
                  <select
                    value={userFormData.status}
                    onChange={e => setUserFormData(prev => ({ ...prev, status: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}
                  >
                    <option value="active">Hoạt động (Active)</option>
                    <option value="inactive">Tạm khóa (Inactive)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '4px' }}>
                    Vùng Hay Đau Mỏi
                  </label>
                  <select
                    value={userFormData.primaryPainArea}
                    onChange={e => setUserFormData(prev => ({ ...prev, primaryPainArea: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}
                  >
                    <option value="Cổ & Vai Gáy">Cổ & Vai Gáy</option>
                    <option value="Thắt Lưng & Cột Sống">Thắt Lưng & Cột Sống</option>
                    <option value="Cổ Tay & Ngón Tay">Cổ Tay & Ngón Tay</option>
                    <option value="Hông & Đôi Chân">Hông & Đôi Chân</option>
                    <option value="Toàn Thân">Toàn Thân</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '4px' }}>
                    Thời Gian Ngồi
                  </label>
                  <select
                    value={userFormData.sittingHoursPerDay}
                    onChange={e => setUserFormData(prev => ({ ...prev, sittingHoursPerDay: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}
                  >
                    <option value="Dưới 4 giờ/ngày">Dưới 4 giờ/ngày</option>
                    <option value="4-6 giờ/ngày">4-6 giờ/ngày</option>
                    <option value="7-8 giờ/ngày">7-8 giờ/ngày</option>
                    <option value="Trên 8 giờ/ngày">Trên 8 giờ/ngày</option>
                  </select>
                </div>
              </div>

              {userFormData.role === 'user' ? (
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '4px' }}>
                    Gói Dịch Vụ Thành Viên (Subscription Plan)
                  </label>
                  <select
                    value={userFormData.plan || 'free'}
                    onChange={e => {
                      const plan = e.target.value;
                      const planName = plan === 'vip' ? 'FitPet VIP Trọn Đời' : plan === 'plus' ? 'FitPet Plus' : 'Gói Miễn Phí (Free)';
                      setUserFormData(prev => ({ ...prev, plan, planName }));
                    }}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', fontWeight: 600 }}
                  >
                    <option value="free">Gói Miễn Phí (Free) — 0đ</option>
                    <option value="plus">FitPet Plus — 59.000đ/tháng (Không giới hạn & AI Pose)</option>
                    <option value="vip">FitPet VIP Trọn Đời — 899.000đ (Trọn gói trọn đời)</option>
                  </select>
                </div>
              ) : (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-surface-subtle)',
                  border: '1px dashed var(--color-border)',
                  fontSize: '0.82rem',
                  color: 'var(--color-text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <ShieldCheck size={16} style={{ color: 'var(--color-brand-primary)', flexShrink: 0 }} />
                  <span>Vai trò <strong>{userFormData.role === 'admin' ? 'Quản trị viên' : 'Huấn luyện viên'}</strong> được cấp đặc quyền nội bộ, không cần mua gói dịch vụ.</span>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '4px' }}>
                  Ghi Chú Hoặc Mục Tiêu Vận Động
                </label>
                <textarea
                  rows="2"
                  value={userFormData.notes}
                  onChange={e => setUserFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Ví dụ: Cần tập giãn cơ bàn tay và hông 5 phút mỗi ngày..."
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsCreateUserModalOpen(false)} className="btn-ghost">
                  Hủy
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '9px 20px', minHeight: '38px' }}>
                  Lưu Người Dùng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT USER ================= */}
      {userToEdit && (
        <div className="modal-backdrop" onClick={() => setUserToEdit(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit size={20} style={{ color: '#0EA5E9' }} /> Chỉnh Sửa Thông Tin Người Dùng
              </h3>
              <button onClick={() => setUserToEdit(null)} className="icon-btn">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditUserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '4px' }}>
                  Họ và Tên *
                </label>
                <input
                  type="text"
                  required
                  value={userFormData.name}
                  onChange={e => setUserFormData(prev => ({ ...prev, name: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '4px' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={userFormData.email}
                    onChange={e => setUserFormData(prev => ({ ...prev, email: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '4px' }}>
                    Số Điện Thoại
                  </label>
                  <input
                    type="text"
                    value={userFormData.phone}
                    onChange={e => setUserFormData(prev => ({ ...prev, phone: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '4px' }}>
                    Vai Trò (Role)
                  </label>
                  <select
                    value={userFormData.role}
                    onChange={e => setUserFormData(prev => ({ ...prev, role: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}
                  >
                    <option value="user">Thành viên (User)</option>
                    <option value="admin">Quản trị viên (Admin)</option>
                    <option value="coach">Huấn luyện viên (Coach)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '4px' }}>
                    Trạng Thái
                  </label>
                  <select
                    value={userFormData.status}
                    onChange={e => setUserFormData(prev => ({ ...prev, status: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}
                  >
                    <option value="active">Hoạt động (Active)</option>
                    <option value="inactive">Tạm khóa (Inactive)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '4px' }}>
                    Vùng Hay Đau Mỏi
                  </label>
                  <select
                    value={userFormData.primaryPainArea}
                    onChange={e => setUserFormData(prev => ({ ...prev, primaryPainArea: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}
                  >
                    <option value="Cổ & Vai Gáy">Cổ & Vai Gáy</option>
                    <option value="Thắt Lưng & Cột Sống">Thắt Lưng & Cột Sống</option>
                    <option value="Cổ Tay & Ngón Tay">Cổ Tay & Ngón Tay</option>
                    <option value="Hông & Đôi Chân">Hông & Đôi Chân</option>
                    <option value="Toàn Thân">Toàn Thân</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '4px' }}>
                    Thời Gian Ngồi
                  </label>
                  <select
                    value={userFormData.sittingHoursPerDay}
                    onChange={e => setUserFormData(prev => ({ ...prev, sittingHoursPerDay: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}
                  >
                    <option value="Dưới 4 giờ/ngày">Dưới 4 giờ/ngày</option>
                    <option value="4-6 giờ/ngày">4-6 giờ/ngày</option>
                    <option value="7-8 giờ/ngày">7-8 giờ/ngày</option>
                    <option value="Trên 8 giờ/ngày">Trên 8 giờ/ngày</option>
                  </select>
                </div>
              </div>

              {userFormData.role === 'user' ? (
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '4px' }}>
                    Gói Dịch Vụ Thành Viên (Subscription Plan)
                  </label>
                  <select
                    value={userFormData.plan || 'free'}
                    onChange={e => {
                      const plan = e.target.value;
                      const planName = plan === 'vip' ? 'FitPet VIP Trọn Đời' : plan === 'plus' ? 'FitPet Plus' : 'Gói Miễn Phí (Free)';
                      setUserFormData(prev => ({ ...prev, plan, planName }));
                    }}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', fontWeight: 600 }}
                  >
                    <option value="free">Gói Miễn Phí (Free) — 0đ</option>
                    <option value="plus">FitPet Plus — 59.000đ/tháng (Không giới hạn & AI Pose)</option>
                    <option value="vip">FitPet VIP Trọn Đời — 899.000đ (Trọn gói trọn đời)</option>
                  </select>
                </div>
              ) : (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-surface-subtle)',
                  border: '1px dashed var(--color-border)',
                  fontSize: '0.82rem',
                  color: 'var(--color-text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <ShieldCheck size={16} style={{ color: 'var(--color-brand-primary)', flexShrink: 0 }} />
                  <span>Vai trò <strong>{userFormData.role === 'admin' ? 'Quản trị viên' : 'Huấn luyện viên'}</strong> được cấp đặc quyền nội bộ, không cần mua gói dịch vụ.</span>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '4px' }}>
                  Ghi Chú Chuyên Môn
                </label>
                <textarea
                  rows="2"
                  value={userFormData.notes}
                  onChange={e => setUserFormData(prev => ({ ...prev, notes: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setUserToEdit(null)} className="btn-ghost">
                  Hủy
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '9px 20px', minHeight: '38px' }}>
                  Cập Nhật Người Dùng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DELETE CONFIRMATION ================= */}
      {userToDelete && (
        <div className="modal-backdrop" onClick={() => setUserToDelete(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#EF4444', marginBottom: '14px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#FEE2E2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <AlertTriangle size={20} color="#DC2626" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                Xác Nhận Xóa Người Dùng
              </h3>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
              Bạn có chắc chắn muốn xóa tài khoản của <strong>{userToDelete.name}</strong> ({userToDelete.email}) khỏi hệ thống FitPet? Thao tác này không thể hoàn tác.
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setUserToDelete(null)} className="btn-ghost">
                Hủy Bỏ
              </button>
              <button
                onClick={handleConfirmDeleteUser}
                style={{
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  padding: '9px 18px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Xóa Người Dùng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE WORKOUT ================= */}
      {isCreateWorkoutModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsCreateWorkoutModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '16px' }}>Thêm Bài Tập Mới</h3>
            <form onSubmit={handleCreateWorkoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '4px' }}>Tên Bài Tập</label>
                <input
                  type="text"
                  required
                  value={newWorkout.title}
                  onChange={e => setNewWorkout(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ví dụ: Giãn Cơ Bàn Tay 2 Phút"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '4px' }}>Danh Mục</label>
                  <select
                    value={newWorkout.category}
                    onChange={e => setNewWorkout(prev => ({ ...prev, category: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}
                  >
                    <option value="Cổ & Vai Gáy">Cổ & Vai Gáy</option>
                    <option value="Thắt Lưng & Cột Sống">Thắt Lưng & Cột Sống</option>
                    <option value="Cổ Tay & Ngón Tay">Cổ Tay & Ngón Tay</option>
                    <option value="Hông & Đôi Chân">Hông & Đôi Chân</option>
                    <option value="Toàn Thân">Toàn Thân</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '4px' }}>Thời Lượng (Phút)</label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={newWorkout.durationMinutes}
                    onChange={e => setNewWorkout(prev => ({ ...prev, durationMinutes: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '4px' }}>Mô Tả Ngắn</label>
                <textarea
                  rows="3"
                  value={newWorkout.description}
                  onChange={e => setNewWorkout(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Mô tả mục đích và lưu ý an toàn..."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsCreateWorkoutModalOpen(false)} className="btn-ghost">
                  Hủy
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '10px 20px', minHeight: '40px' }}>
                  Lưu Bài Tập
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * FitPet User Management Service
 * Hỗ trợ các thao tác CRUD người dùng đầy đủ cho giao diện Quản trị viên (Admin Portal).
 * Dữ liệu được lưu trữ và đồng bộ an toàn qua localStorage ('fitpet_users_database').
 */

const STORAGE_KEY = 'fitpet_users_database';

const INITIAL_USERS = [
  {
    id: 'user-001',
    name: 'Nguyễn Minh Tuấn',
    email: 'tuan.nguyen@example.com',
    phone: '0912 345 678',
    role: 'admin',
    status: 'active',
    plan: 'internal',
    planName: 'Đặc quyền Quản trị viên',
    planExpiry: 'Vĩnh viễn',
    avatarEmoji: '⚡',
    primaryPainArea: 'Cổ & Vai Gáy',
    sittingHoursPerDay: '8-10 giờ',
    totalWorkouts: 24,
    totalMinutes: 112,
    cameraRepsCount: 186,
    joinedDate: '2026-09-15',
    lastActive: 'Hôm nay, 10:30',
    notes: 'Quản trị viên hệ thống & kiểm định an toàn bài tập FitPet.',
    workoutHistory: [
      { id: 'wh-1', workoutTitle: 'Giảm Mỏi Cổ Vai Nhanh 3 Phút', date: '28/10/2026', durationMinutes: 3, repsDetected: 14, completed: true },
      { id: 'wh-2', workoutTitle: 'Giải Tỏa Thắt Lưng Tại Bàn Làm Việc', date: '27/10/2026', durationMinutes: 4, repsDetected: 18, completed: true },
      { id: 'wh-3', workoutTitle: 'Khởi Động Nhanh 2 Phút Tỉnh Táo', date: '26/10/2026', durationMinutes: 2, repsDetected: 12, completed: true }
    ]
  },
  {
    id: 'user-002',
    name: 'Trần Thị Thu Hà',
    email: 'thuha.tran@example.com',
    phone: '0983 221 456',
    role: 'user',
    status: 'active',
    plan: 'plus',
    planName: 'FitPet Plus',
    planExpiry: '2027-10-28',
    avatarEmoji: '🌸',
    primaryPainArea: 'Thắt Lưng & Cột Sống',
    sittingHoursPerDay: '7-9 giờ',
    totalWorkouts: 18,
    totalMinutes: 84,
    cameraRepsCount: 142,
    joinedDate: '2026-09-28',
    lastActive: 'Hôm nay, 08:45',
    notes: 'Nhân viên thiết kế đồ họa, ngồi lâu hay bị mỏi đốt sống L4-L5.',
    workoutHistory: [
      { id: 'wh-4', workoutTitle: 'Giải Tỏa Thắt Lưng Tại Bàn Làm Việc', date: '28/10/2026', durationMinutes: 4, repsDetected: 20, completed: true },
      { id: 'wh-5', workoutTitle: 'Thư Giãn Khớp Hông & Đùi Trong', date: '25/10/2026', durationMinutes: 4, repsDetected: 16, completed: true }
    ]
  },
  {
    id: 'user-003',
    name: 'Lê Hoàng Nam',
    email: 'nam.le@company.com',
    phone: '0905 112 334',
    role: 'user',
    status: 'active',
    plan: 'free',
    planName: 'Gói Cơ Bản',
    planExpiry: 'Vĩnh viễn',
    avatarEmoji: '💻',
    primaryPainArea: 'Cổ Tay & Ngón Tay',
    sittingHoursPerDay: '9-12 giờ',
    totalWorkouts: 31,
    totalMinutes: 145,
    cameraRepsCount: 230,
    joinedDate: '2026-08-10',
    lastActive: 'Hôm qua, 17:15',
    notes: 'Kỹ sư phần mềm, thường xuyên gõ phím liên tục, rất thích động tác xoay cổ tay.',
    workoutHistory: [
      { id: 'wh-6', workoutTitle: 'Thư Giãn Cổ Tay Cho Người Gõ Phím', date: '27/10/2026', durationMinutes: 3, repsDetected: 22, completed: true },
      { id: 'wh-7', workoutTitle: 'Giảm Mỏi Cổ Vai Nhanh 3 Phút', date: '24/10/2026', durationMinutes: 3, repsDetected: 15, completed: true }
    ]
  },
  {
    id: 'user-004',
    name: 'Phạm Phương Anh',
    email: 'phuonganh.pt@gmail.com',
    phone: '0977 889 001',
    role: 'coach',
    status: 'active',
    plan: 'internal',
    planName: 'Đặc quyền Huấn luyện viên',
    planExpiry: 'Vĩnh viễn',
    avatarEmoji: '🧘‍♀️',
    primaryPainArea: 'Cổ & Vai Gáy',
    sittingHoursPerDay: '4-6 giờ',
    totalWorkouts: 45,
    totalMinutes: 210,
    cameraRepsCount: 380,
    joinedDate: '2026-07-20',
    lastActive: 'Hôm nay, 11:15',
    notes: 'Chuyên gia huấn luyện thể hình và phục hồi chức năng văn phòng.',
    workoutHistory: [
      { id: 'wh-8', workoutTitle: 'Nạp Lại Năng Lượng Toàn Thân 5 Phút', date: '28/10/2026', durationMinutes: 5, repsDetected: 28, completed: true }
    ]
  },
  {
    id: 'user-005',
    name: 'Đặng Đức Huy',
    email: 'huy.dang@fintech.vn',
    phone: '0938 990 122',
    role: 'user',
    status: 'inactive',
    plan: 'free',
    planName: 'Gói Cơ Bản',
    planExpiry: 'Vĩnh viễn',
    avatarEmoji: '☕',
    primaryPainArea: 'Hông & Đôi Chân',
    sittingHoursPerDay: '8 giờ',
    totalWorkouts: 4,
    totalMinutes: 14,
    cameraRepsCount: 22,
    joinedDate: '2026-10-02',
    lastActive: '1 tuần trước',
    notes: 'Đang tạm dừng thông báo nhắc nhở do đi công tác xa.',
    workoutHistory: [
      { id: 'wh-9', workoutTitle: 'Khởi Động Nhanh 2 Phút Tỉnh Táo', date: '19/10/2026', durationMinutes: 2, repsDetected: 10, completed: true }
    ]
  },
  {
    id: 'user-006',
    name: 'Vũ Mai Chi',
    email: 'maichi.vu@creative.io',
    phone: '0918 554 223',
    role: 'user',
    status: 'active',
    plan: 'plus',
    planName: 'FitPet Plus',
    planExpiry: '2027-11-15',
    avatarEmoji: '🎨',
    primaryPainArea: 'Cổ & Vai Gáy',
    sittingHoursPerDay: '7-8 giờ',
    totalWorkouts: 12,
    totalMinutes: 52,
    cameraRepsCount: 95,
    joinedDate: '2026-10-11',
    lastActive: 'Hôm nay, 09:20',
    notes: 'Thành viên mới tích cực, thường tập vào khung giờ 14:00 chiều.',
    workoutHistory: [
      { id: 'wh-10', workoutTitle: 'Giảm Mỏi Cổ Vai Nhanh 3 Phút', date: '28/10/2026', durationMinutes: 3, repsDetected: 16, completed: true }
    ]
  }
];

class UserService {
  constructor() {
    this.initDatabase();
  }

  initDatabase() {
    if (typeof window === 'undefined') return;
    try {
      const existing = localStorage.getItem(STORAGE_KEY);
      if (!existing) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      }
    } catch (e) {
      console.warn('Error initializing users database:', e);
    }
  }

  getUsers() {
    if (typeof window === 'undefined') return INITIAL_USERS;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        // Normalize: internal roles (admin & coach) do not have purchase plans
        let mutated = false;
        const normalized = parsed.map(u => {
          if ((u.role === 'admin' || u.role === 'coach') && u.plan !== 'internal') {
            mutated = true;
            return {
              ...u,
              plan: 'internal',
              planName: u.role === 'admin' ? 'Đặc quyền Quản trị viên' : 'Đặc quyền Huấn luyện viên'
            };
          }
          return u;
        });
        if (mutated) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        }
        return normalized;
      }
    } catch (e) {
      console.warn('Error reading users database:', e);
    }
    return INITIAL_USERS;
  }

  getUserById(id) {
    const users = this.getUsers();
    return users.find(u => u.id === id) || null;
  }

  saveUsers(users) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      } catch (e) {
        console.error('Error persisting users to localStorage:', e);
      }
    }
    return users;
  }

  createUser(userData) {
    const users = this.getUsers();
    const isInternalRole = userData.role === 'admin' || userData.role === 'coach';
    const plan = isInternalRole ? 'internal' : (userData.plan || 'free');
    const planName = isInternalRole
      ? (userData.role === 'admin' ? 'Đặc quyền Quản trị viên' : 'Đặc quyền Huấn luyện viên')
      : (plan === 'vip' ? 'FitPet VIP Trọn Đời' : plan === 'plus' ? 'FitPet Plus' : 'Gói Cơ Bản');
    const planExpiry = isInternalRole ? 'Vĩnh viễn' : (plan === 'plus' ? '2027-10-28' : 'Vĩnh viễn');

    const newUser = {
      id: 'user-' + Date.now().toString().slice(-6),
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      phone: userData.phone ? userData.phone.trim() : 'Chưa cập nhật',
      role: userData.role || 'user',
      status: userData.status || 'active',
      plan,
      planName,
      planExpiry,
      avatarEmoji: userData.avatarEmoji || (userData.role === 'admin' ? '⚡' : userData.role === 'coach' ? '🧘‍♂️' : plan === 'vip' ? '👑' : plan === 'plus' ? '🌟' : '🏃'),
      primaryPainArea: userData.primaryPainArea || 'Cổ & Vai Gáy',
      sittingHoursPerDay: userData.sittingHoursPerDay || '6-8 giờ',
      totalWorkouts: 0,
      totalMinutes: 0,
      cameraRepsCount: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      lastActive: 'Vừa tham gia',
      notes: userData.notes || 'Thành viên mới tham gia hệ thống FitPet.',
      workoutHistory: []
    };

    const updated = [newUser, ...users];
    this.saveUsers(updated);
    return newUser;
  }

  updateUser(id, updates) {
    const users = this.getUsers();
    let updatedUser = null;
    const updated = users.map(u => {
      if (u.id === id) {
        const targetRole = updates.role !== undefined ? updates.role : u.role;
        const isInternalRole = targetRole === 'admin' || targetRole === 'coach';
        let planUpdates = {};

        if (isInternalRole) {
          planUpdates.plan = 'internal';
          planUpdates.planName = targetRole === 'admin' ? 'Đặc quyền Quản trị viên' : 'Đặc quyền Huấn luyện viên';
          planUpdates.planExpiry = 'Vĩnh viễn';
        } else if (updates.plan && updates.plan !== u.plan) {
          planUpdates.planName = updates.plan === 'vip' ? 'FitPet VIP Trọn Đời' : updates.plan === 'plus' ? 'FitPet Plus' : 'Gói Cơ Bản';
          planUpdates.planExpiry = updates.plan === 'plus' ? '2027-10-28' : 'Vĩnh viễn';
        }
        updatedUser = { ...u, ...updates, ...planUpdates };
        return updatedUser;
      }
      return u;
    });

    if (updatedUser) {
      this.saveUsers(updated);
    }
    return updatedUser;
  }

  deleteUser(id) {
    const users = this.getUsers();
    const filtered = users.filter(u => u.id !== id);
    this.saveUsers(filtered);
    return true;
  }

  toggleUserStatus(id) {
    const users = this.getUsers();
    let toggledUser = null;
    const updated = users.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'active' ? 'inactive' : 'active';
        toggledUser = { ...u, status: nextStatus };
        return toggledUser;
      }
      return u;
    });

    if (toggledUser) {
      this.saveUsers(updated);
    }
    return toggledUser;
  }

  resetToInitial() {
    this.saveUsers(INITIAL_USERS);
    return INITIAL_USERS;
  }
}

export const userService = new UserService();

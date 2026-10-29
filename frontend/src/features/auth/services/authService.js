import { userService } from './userService';

/**
 * FitPet Authentication & Role-Based Session Service
 * Quản lý phiên làm việc, phân quyền theo 3 vai trò chính:
 * 1. 'user': Thành viên người tập (Giao diện ứng dụng chính FitPet)
 * 2. 'coach': Huấn luyện viên thể hình chuyên môn (Coach Workspace)
 * 3. 'admin': Quản trị viên hệ thống tối cao (Admin Control Dashboard)
 */

class AuthService {
  constructor() {
    this.STORAGE_KEY = 'fitpet_user_session';
  }

  getCurrentUser() {
    if (typeof window === 'undefined') {
      return { id: 'guest', name: 'Người Dùng Khách', email: '', isGuest: true, role: 'user', plan: 'free' };
    }
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Error reading user session:', e);
    }
    // Default guest profile
    return {
      id: 'guest',
      name: 'Người Dùng Khách',
      email: '',
      isGuest: true,
      role: 'user',
      plan: 'free',
      planName: 'Gói Cơ Bản',
      avatarEmoji: '🌱',
      joinDate: new Date().toLocaleDateString('vi-VN')
    };
  }

  saveUser(user) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    }
    return user;
  }

  /**
   * Login with email & password, matching against the registered users database
   */
  login(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!email || !email.includes('@')) {
          reject(new Error('Vui lòng nhập định dạng email hợp lệ.'));
          return;
        }
        if (!password || password.length < 6) {
          reject(new Error('Mật khẩu phải có ít nhất 6 ký tự.'));
          return;
        }

        const normalizedEmail = email.trim().toLowerCase();
        const allUsers = userService.getUsers();
        
        // Find user by email
        const existing = allUsers.find(u => u.email.toLowerCase() === normalizedEmail);

        if (existing) {
          if (existing.status === 'inactive') {
            reject(new Error('Tài khoản này hiện đang tạm khóa. Vui lòng liên hệ Quản trị viên để được hỗ trợ.'));
            return;
          }

          const loggedInUser = {
            ...existing,
            isGuest: false,
            lastLogin: new Date().toLocaleString('vi-VN')
          };
          this.saveUser(loggedInUser);
          resolve(loggedInUser);
          return;
        }

        // If not in seed, create a dynamic authenticated session
        const isAdmin = normalizedEmail.includes('admin');
        const isCoach = normalizedEmail.includes('coach') || normalizedEmail.includes('hlv');
        const role = isAdmin ? 'admin' : (isCoach ? 'coach' : 'user');

        const newUser = {
          id: 'user_' + Date.now(),
          name: email.split('@')[0],
          email: normalizedEmail,
          isGuest: false,
          role: role,
          plan: 'free',
          planName: 'Gói Cơ Bản',
          avatarEmoji: isAdmin ? '⚡' : (isCoach ? '🧘‍♀️' : '🏃'),
          joinDate: new Date().toLocaleDateString('vi-VN')
        };

        this.saveUser(newUser);
        resolve(newUser);
      }, 400);
    });
  }

  /**
   * Quick 1-Click Demo Login by Role
   * Giúp trải nghiệm tức thì màn hình của từng role mà không cần gõ mật khẩu.
   */
  loginAsRole(roleKey) {
    const allUsers = userService.getUsers();
    let target = null;

    if (roleKey === 'admin') {
      target = allUsers.find(u => u.role === 'admin') || {
        id: 'user-001',
        name: 'Nguyễn Minh Tuấn',
        email: 'tuan.nguyen@example.com',
        role: 'admin',
        avatarEmoji: '⚡',
        plan: 'vip',
        planName: 'FitPet VIP Trọn Đời'
      };
    } else if (roleKey === 'coach') {
      target = allUsers.find(u => u.role === 'coach') || {
        id: 'user-004',
        name: 'Phạm Phương Anh',
        email: 'phuonganh.pt@gmail.com',
        role: 'coach',
        avatarEmoji: '🧘‍♀️',
        plan: 'vip',
        planName: 'FitPet VIP Trọn Đời'
      };
    } else {
      // Regular user
      target = allUsers.find(u => u.role === 'user' && u.plan === 'plus') || allUsers.find(u => u.role === 'user') || {
        id: 'user-002',
        name: 'Trần Thị Thu Hà',
        email: 'thuha.tran@example.com',
        role: 'user',
        avatarEmoji: '🌸',
        plan: 'plus',
        planName: 'FitPet Plus'
      };
    }

    const session = {
      ...target,
      isGuest: false,
      lastLogin: new Date().toLocaleString('vi-VN')
    };

    this.saveUser(session);
    return session;
  }

  /**
   * Retrieve curated demo accounts for each role
   */
  getDemoAccounts() {
    return {
      user: {
        role: 'user',
        roleLabel: 'Hội Viên (Member)',
        roleTagline: 'Tập luyện 3-5 phút mỗi ngày cùng thú cưng Pip',
        badgeColor: '#10B981',
        account: {
          name: 'Trần Thị Thu Hà',
          email: 'thuha.tran@example.com',
          avatarEmoji: '🌸',
          plan: 'Gói Plus',
          primaryPainArea: 'Thắt Lưng & Cột Sống'
        }
      },
      coach: {
        role: 'coach',
        roleLabel: 'Huấn Luyện Viên (Coach)',
        roleTagline: 'Kiểm duyệt động tác, theo dõi tư thế & kê đơn vùng đau',
        badgeColor: '#8B5CF6',
        account: {
          name: 'Phạm Phương Anh',
          email: 'phuonganh.pt@gmail.com',
          avatarEmoji: '🧘‍♀️',
          title: 'Chuyên gia HLV Thể hình & Phục hồi chức năng',
          primaryPainArea: 'Cổ & Vai Gáy'
        }
      },
      admin: {
        role: 'admin',
        roleLabel: 'Quản Trị Viên (Admin)',
        roleTagline: 'Điều hành hệ thống, quản lý người dùng & gói thuê bao',
        badgeColor: '#F59E0B',
        account: {
          name: 'Nguyễn Minh Tuấn',
          email: 'tuan.nguyen@example.com',
          avatarEmoji: '⚡',
          title: 'Quản trị viên tối cao FitPet',
          plan: 'VIP Trọn Đời'
        }
      }
    };
  }

  register(name, email, password, role = 'user') {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!name || name.trim().length < 2) {
          reject(new Error('Vui lòng nhập tên của bạn (tối thiểu 2 ký tự).'));
          return;
        }
        if (!email || !email.includes('@')) {
          reject(new Error('Vui lòng nhập định dạng email hợp lệ.'));
          return;
        }
        if (!password || password.length < 6) {
          reject(new Error('Mật khẩu phải có ít nhất 6 ký tự.'));
          return;
        }

        const newUser = {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          role: role,
          status: 'active',
          plan: 'free',
          planName: 'Gói Cơ Bản',
          primaryPainArea: 'Cổ & Vai Gáy',
          sittingHoursPerDay: '7-8 giờ',
          avatarEmoji: role === 'coach' ? '🧘‍♀️' : (role === 'admin' ? '⚡' : '🌟')
        };

        const created = userService.createUser(newUser);
        const session = {
          ...created,
          isGuest: false,
          lastLogin: new Date().toLocaleString('vi-VN')
        };

        this.saveUser(session);
        resolve(session);
      }, 500);
    });
  }

  logout() {
    const guestUser = {
      id: 'guest',
      name: 'Người Dùng Khách',
      email: '',
      isGuest: true,
      role: 'user',
      plan: 'free',
      planName: 'Gói Cơ Bản',
      avatarEmoji: '🌱',
      joinDate: new Date().toLocaleDateString('vi-VN')
    };
    this.saveUser(guestUser);
    return guestUser;
  }

  updateProfile(updates) {
    const current = this.getCurrentUser();
    const updated = { ...current, ...updates };
    this.saveUser(updated);

    if (current.id && current.id !== 'guest') {
      try {
        userService.updateUser(current.id, updates);
      } catch (e) {
        console.warn('Sync to userService failed:', e);
      }
    }
    return updated;
  }

  requestPasswordReset(email) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!email || !email.includes('@')) {
          reject(new Error('Vui lòng nhập email hợp lệ để nhận hướng dẫn khôi phục.'));
          return;
        }
        resolve(`Hướng dẫn đặt lại mật khẩu đã được gửi đến hộp thư ${email}.`);
      }, 500);
    });
  }
}

export const authService = new AuthService();

/**
 * FitPet Achievement & Streak Service
 * Quản lý hệ thống chuỗi ngày liên tiếp (Streak) và mốc thành tựu (Milestones)
 * Dựa trên thời gian vận động tích lũy và số buổi hoàn thành.
 */

export const ACHIEVEMENT_DEFINITIONS = [
  // --- MỐC CHUỖI NGÀY LIÊN TIẾP (STREAK) ---
  {
    id: 'streak_3',
    title: 'Khởi Đầu Nhẹ Nhàng',
    category: 'streak',
    categoryLabel: 'Chuỗi Ngày',
    target: 3,
    unit: 'ngày',
    icon: '🌱',
    color: '#10B981',
    badgeType: 'Đồng',
    description: 'Duy trì vận động 3 ngày liên tiếp không ngắt quãng.',
    reward: '+30 Điểm Thú Cưng',
    quote: 'Bước khởi đầu vững chắc cho thói quen lành mạnh.'
  },
  {
    id: 'streak_7',
    title: 'Thói Quen Vững Vàng',
    category: 'streak',
    categoryLabel: 'Chuỗi Ngày',
    target: 7,
    unit: 'ngày',
    icon: '🔥',
    color: '#F59E0B',
    badgeType: 'Bạc',
    description: 'Chạm mốc 1 tuần (7 ngày) vận động liên tục.',
    reward: '+70 Điểm & Mở Huy Hiệu Tuần Vàng',
    quote: '7 ngày vàng giúp các khớp cơ thích nghi tự nhiên.'
  },
  {
    id: 'streak_14',
    title: 'Ý Chí Bền Bỉ',
    category: 'streak',
    categoryLabel: 'Chuỗi Ngày',
    target: 14,
    unit: 'ngày',
    icon: '⚡',
    color: '#8B5CF6',
    badgeType: 'Vàng',
    description: 'Giữ vững chuỗi tập luyện 14 ngày (2 tuần) kiên trì.',
    reward: '+150 Điểm & Danh Hiệu Bền Bỉ',
    quote: 'Hai tuần kiên định, lưng và vai đã nhẹ nhõm hơn hẳn.'
  },
  {
    id: 'streak_30',
    title: 'Bậc Thầy Kiên Trì',
    category: 'streak',
    categoryLabel: 'Chuỗi Ngày',
    target: 30,
    unit: 'ngày',
    icon: '👑',
    color: '#EC4899',
    badgeType: 'Kim Cương',
    description: 'Đạt đỉnh cao 30 ngày liên tiếp vận động cùng Pip.',
    reward: 'Huy Hiệu Kim Cương Trọn Đời',
    quote: 'Làm chủ sức khỏe cột sống, không còn sợ ngồi lâu.'
  },

  // --- MỐC TỔNG THỜI GIAN VẬN ĐỘNG (TIME) ---
  {
    id: 'time_15',
    title: 'Bước Chân Đầu Tiên',
    category: 'time',
    categoryLabel: 'Thời Lượng',
    target: 15,
    unit: 'phút',
    icon: '⏱️',
    color: '#3B82F6',
    badgeType: 'Khởi Đầu',
    description: 'Tích lũy tổng cộng 15 phút vận động giải tỏa căng cơ.',
    reward: '+20 Điểm Phục Hồi',
    quote: 'Mỗi phút tích lũy đều là món quà cho cơ thể.'
  },
  {
    id: 'time_30',
    title: 'Hơi Thở Tươi Mới',
    category: 'time',
    categoryLabel: 'Thời Lượng',
    target: 30,
    unit: 'phút',
    icon: '🌿',
    color: '#10B981',
    badgeType: 'Chăm Chỉ',
    description: 'Đạt 30 phút vận động nhẹ nhàng nuôi dưỡng khớp xương.',
    reward: '+50 Điểm Thú Cưng',
    quote: 'Cột sống và lồng ngực được mở rộng, hít thở sâu hơn.'
  },
  {
    id: 'time_60',
    title: 'Chiến Binh Bền Bỉ',
    category: 'time',
    categoryLabel: 'Thời Lượng',
    target: 60,
    unit: 'phút',
    icon: '💎',
    color: '#6366F1',
    badgeType: 'Chuyên Cần',
    description: 'Chạm mốc 1 giờ (60 phút) chăm sóc cơ thể trọn vẹn.',
    reward: '+100 Điểm & Khăn Quàng Cho Pet',
    quote: '1 giờ vàng loại bỏ tình trạng co cứng cơ cổ vai gáy.'
  },
  {
    id: 'time_120',
    title: 'Huyền Thoại FitPet',
    category: 'time',
    categoryLabel: 'Thời Lượng',
    target: 120,
    unit: 'phút',
    icon: '🏆',
    color: '#F59E0B',
    badgeType: 'Huyền Thoại',
    description: 'Cán mốc 2 giờ (120 phút) vận động vàng văn phòng.',
    reward: 'Cúp Vinh Danh FitPet Master',
    quote: 'Tấm gương truyền cảm hứng vận động tích cực mỗi ngày.'
  },

  // --- MỐC SỐ BUỔI HOÀN THÀNH (SESSIONS) ---
  {
    id: 'sessions_5',
    title: 'Mầm Non Thói Quen',
    category: 'sessions',
    categoryLabel: 'Buổi Tập',
    target: 5,
    unit: 'buổi',
    icon: '🌸',
    color: '#10B981',
    badgeType: 'Đồng',
    description: 'Hoàn thành 5 buổi tập luyện bất kỳ.',
    reward: '+25 Điểm',
    quote: 'Thói quen nhỏ tạo nên thay đổi lớn.'
  },
  {
    id: 'sessions_15',
    title: 'Chuyên Gia Giãn Cơ',
    category: 'sessions',
    categoryLabel: 'Buổi Tập',
    target: 15,
    unit: 'buổi',
    icon: '🧘',
    color: '#8B5CF6',
    badgeType: 'Bạc',
    description: 'Tích lũy 15 buổi tập chăm sóc cột sống.',
    reward: '+75 Điểm & Huy Hiệu Huấn Luyện',
    quote: 'Cơ thể dẻo dai và tràn đầy năng lượng làm việc.'
  }
];

class AchievementService {
  /**
   * Helper format date YYYY-MM-DD
   */
  formatDateKey(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Calculate current streak & best streak from workout history
   */
  calculateStreaks(history = []) {
    if (!history || history.length === 0) {
      return { currentStreak: 0, bestStreak: 0, distinctDaysCount: 0 };
    }

    const uniqueDateKeys = new Set();
    history.forEach(session => {
      const ts = session.startTime || session.endTime || Date.now();
      uniqueDateKeys.add(this.formatDateKey(ts));
    });

    const sortedDates = Array.from(uniqueDateKeys).sort();
    if (sortedDates.length === 0) {
      return { currentStreak: 0, bestStreak: 0, distinctDaysCount: 0 };
    }

    const todayKey = this.formatDateKey(new Date());
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = this.formatDateKey(yesterday);

    // Calculate current streak
    let currentStreak = 0;
    const hasToday = uniqueDateKeys.has(todayKey);
    const hasYesterday = uniqueDateKeys.has(yesterdayKey);

    if (hasToday || hasYesterday) {
      let checkDate = new Date();
      if (!hasToday && hasYesterday) {
        checkDate = yesterday;
      }
      while (true) {
        const key = this.formatDateKey(checkDate);
        if (uniqueDateKeys.has(key)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    // Calculate best streak historically
    let bestStreak = currentStreak;
    let tempStreak = 0;
    let prevDate = null;

    sortedDates.forEach(dateStr => {
      const curr = new Date(dateStr);
      if (!prevDate) {
        tempStreak = 1;
      } else {
        const diffMs = curr.getTime() - prevDate.getTime();
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else if (diffDays > 1) {
          tempStreak = 1;
        }
      }
      prevDate = curr;
      if (tempStreak > bestStreak) {
        bestStreak = tempStreak;
      }
    });

    return {
      currentStreak,
      bestStreak: Math.max(bestStreak, currentStreak),
      distinctDaysCount: sortedDates.length
    };
  }

  /**
   * Calculate total minutes moved across all sessions
   */
  calculateTotalMinutes(history = []) {
    if (!history || history.length === 0) return 0;
    return history.reduce((sum, item) => {
      const sec = item.totalSecondsMoved || 0;
      const mins = sec > 0 ? Math.round(sec / 60) : (item.durationMinutes || 2);
      return sum + Math.max(1, mins);
    }, 0);
  }

  /**
   * Evaluate user's progress and return enriched achievement status list
   */
  getUserAchievements(history = []) {
    const { currentStreak, bestStreak } = this.calculateStreaks(history);
    const totalMinutes = this.calculateTotalMinutes(history);
    const totalSessions = history.length;

    const achievements = ACHIEVEMENT_DEFINITIONS.map(def => {
      let currentVal = 0;
      if (def.category === 'streak') {
        currentVal = Math.max(currentStreak, bestStreak);
      } else if (def.category === 'time') {
        currentVal = totalMinutes;
      } else if (def.category === 'sessions') {
        currentVal = totalSessions;
      }

      const isUnlocked = currentVal >= def.target;
      const progressPercent = Math.min(100, Math.round((currentVal / def.target) * 100));

      return {
        ...def,
        current: currentVal,
        unlocked: isUnlocked,
        progressPercent,
        remaining: Math.max(0, def.target - currentVal)
      };
    });

    const unlockedCount = achievements.filter(a => a.unlocked).length;

    return {
      currentStreak,
      bestStreak,
      totalMinutes,
      totalSessions,
      achievements,
      unlockedCount,
      totalCount: achievements.length
    };
  }

  /**
   * Find any newly unlocked achievements when a workout completes
   */
  checkNewlyUnlocked(prevHistory = [], newHistory = []) {
    const prev = this.getUserAchievements(prevHistory);
    const curr = this.getUserAchievements(newHistory);

    const prevUnlockedIds = new Set(prev.achievements.filter(a => a.unlocked).map(a => a.id));
    const newlyUnlocked = curr.achievements.filter(a => a.unlocked && !prevUnlockedIds.has(a.id));

    return newlyUnlocked;
  }
}

export const achievementService = new AchievementService();

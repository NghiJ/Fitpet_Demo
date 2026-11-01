/**
 * FitPet Community & Challenges Service
 * Quản lý các thử thách văn phòng, bảng xếp hạng tuần và bản tin hoạt động đồng nghiệp.
 */

const STORAGE_KEY = 'fitpet_community_data';

const INITIAL_DATA = {
  challenges: [
    {
      id: 'ch-neck-7d',
      title: '7 Ngày Giải Cứu Cổ Vai Gáy',
      description: 'Vận động 3 phút cổ vai mỗi ngày liên tục trong 7 ngày để giải phóng áp lực đốt sống cổ.',
      category: 'Cổ & Vai Gáy',
      participantsCount: 428,
      daysTotal: 7,
      daysCompleted: 4,
      isJoined: true,
      rewardBadge: '🛡️ Hiệp Sĩ Cổ Vai',
      petExpReward: 150,
      workoutTargetId: 'desk-de-stiffener'
    },
    {
      id: 'ch-wrist-500',
      title: '500 Reps Xoay Cổ Tay Dân IT',
      description: 'Thực hiện đủ 500 lần gập và xoay cổ tay trước camera AI để ngừa hội chứng ống cổ tay.',
      category: 'Cổ Tay & Ngón Tay',
      participantsCount: 312,
      currentReps: 320,
      targetReps: 500,
      isJoined: true,
      rewardBadge: '⚡ Đôi Bàn Tay Vàng',
      petExpReward: 200,
      workoutTargetId: 'desk-wrist-flow'
    },
    {
      id: 'ch-lowerback-14d',
      title: '14 Ngày Thắt Lưng Vững Chắc',
      description: 'Giải phóng áp lực vùng đĩa đệm L4-L5 với các bài vặn xoắn nhẹ nhàng tại ghế ngồi.',
      category: 'Thắt Lưng & Cột Sống',
      participantsCount: 586,
      daysTotal: 14,
      daysCompleted: 0,
      isJoined: false,
      rewardBadge: '🌿 Cột Sống Dẻo Dai',
      petExpReward: 300,
      workoutTargetId: 'lower-back-relief'
    }
  ],
  leaderboard: [
    { rank: 1, name: 'Nguyễn Minh Tuấn', avatar: '⚡', minutes: 112, streak: 12, company: 'FitPet Team', badge: 'Quán Quân Tuần' },
    { rank: 2, name: 'Lê Hoàng Nam', avatar: '💻', minutes: 98, streak: 9, company: 'FPT Software', badge: 'Chiến Binh IT' },
    { rank: 3, name: 'Trần Thị Thu Hà', avatar: '🌸', minutes: 84, streak: 7, company: 'VNG Campus', badge: 'Dẻo Dai Vô Địch' },
    { rank: 4, name: 'Phạm Phương Anh', avatar: '🧘‍♀️', minutes: 76, streak: 6, company: 'HLV Phục Hồi', badge: 'Coach Uy Tín' },
    { rank: 5, name: 'Đỗ Hải Đăng', avatar: '🦁', minutes: 65, streak: 5, company: 'Viettel Telecom', badge: 'Năng Động' }
  ],
  activityFeed: [
    { id: 'act-1', userName: 'Trần Thị Thu Hà', avatar: '🌸', action: 'vừa hoàn thành', workoutTitle: 'Giảm Mỏi Cổ Vai Nhanh 3 Phút', timeAgo: '5 phút trước', cheers: 14, isCheered: false },
    { id: 'act-2', userName: 'Lê Hoàng Nam', avatar: '💻', action: 'đã đạt chuỗi', workoutTitle: 'Chuỗi 9 ngày liên tục cùng Pip 🐾', timeAgo: '28 phút trước', cheers: 23, isCheered: true },
    { id: 'act-3', userName: 'Đỗ Hải Đăng', avatar: '🦁', action: 'vừa mở khóa huy hiệu', workoutTitle: 'Hiệp Sĩ Cổ Tay Vàng ⭐', timeAgo: '1 giờ trước', cheers: 9, isCheered: false },
    { id: 'act-4', userName: 'HLV Phương Anh', avatar: '🧘‍♀️', action: 'vừa phát hành phác đồ mới', workoutTitle: 'Giải Tỏa Thắt Lưng Tại Bàn Làm Việc', timeAgo: '2 giờ trước', cheers: 31, isCheered: false }
  ]
};

class CommunityService {
  constructor() {
    this.listeners = new Set();
  }

  getData() {
    if (typeof window === 'undefined') return INITIAL_DATA;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading community data:', e);
    }
    return INITIAL_DATA;
  }

  saveData(data) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.warn('Error saving community data:', e);
      }
    }
    this.notify(data);
    return data;
  }

  joinChallenge(challengeId) {
    const data = this.getData();
    const updatedChallenges = data.challenges.map(ch => {
      if (ch.id === challengeId) {
        return { ...ch, isJoined: true, participantsCount: ch.participantsCount + 1 };
      }
      return ch;
    });
    return this.saveData({ ...data, challenges: updatedChallenges });
  }

  toggleCheer(activityId) {
    const data = this.getData();
    const updatedFeed = data.activityFeed.map(act => {
      if (act.id === activityId) {
        const nextCheered = !act.isCheered;
        return {
          ...act,
          isCheered: nextCheered,
          cheers: nextCheered ? act.cheers + 1 : act.cheers - 1
        };
      }
      return act;
    });
    return this.saveData({ ...data, activityFeed: updatedFeed });
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(data) {
    this.listeners.forEach(fn => fn(data));
  }
}

export const communityService = new CommunityService();

/**
 * FitPet Consultation & Coach Prescription Service
 * Quản lý phác đồ điều trị của HLV, lịch hẹn tham vấn 1-1 và hộp thoại hỏi đáp tư thế.
 */

const STORAGE_KEY = 'fitpet_consultation_data';

const INITIAL_DATA = {
  activePrescription: {
    id: 'rx-2026-001',
    coachName: 'Phạm Phương Anh',
    coachAvatar: '🧘‍♀️',
    coachTitle: 'Chuyên gia HLV Thể hình & Phục hồi chức năng',
    assignedDate: '26/10/2026',
    validUntil: '26/11/2026',
    diagnosis: 'Căng cơ thang trên & đau thắt lưng cơ năng do ngồi máy tính sai tư thế (gù lưng trên 7h/ngày).',
    notes: 'Chú ý luôn hạ hai vai thả lỏng khi gõ phím. Cứ mỗi 45 phút ngồi thì đứng dậy xoay hông và vươn vai 3 phút.',
    dailyFrequency: '2 lần / ngày (10:00 sáng & 15:30 chiều)',
    prescribedWorkouts: [
      {
        workoutId: 'desk-de-stiffener',
        title: 'Giảm Mỏi Cổ Vai Nhanh 3 Phút',
        targetArea: 'Cổ & Vai Gáy',
        durationMinutes: 3,
        keyNotice: 'Không rụt cổ khi xoay vai, hít thở sâu bằng bụng'
      },
      {
        workoutId: 'lower-back-relief',
        title: 'Giải Tỏa Thắt Lưng Tại Bàn Làm Việc',
        targetArea: 'Thắt Lưng & Cột Sống',
        durationMinutes: 4,
        keyNotice: 'Giữ hông cố định trên mặt ghế khi xoay thân mình'
      }
    ]
  },
  appointments: [
    {
      id: 'apt-001',
      coachName: 'Phạm Phương Anh',
      coachTitle: 'HLV Phục Hồi Thể Hình FitPet',
      date: '02/11/2026',
      timeSlot: '14:30 - 15:00',
      topic: 'Đánh giá góc gù lưng và hướng dẫn tư thế ngồi công thái học tại bàn làm việc',
      status: 'confirmed',
      meetingLink: 'https://fitpet.app/call/consult-8821'
    }
  ],
  chatMessages: [
    {
      id: 'msg-1',
      sender: 'coach',
      senderName: 'HLV Phương Anh',
      avatar: '🧘‍♀️',
      time: '10:15',
      text: 'Chào bạn! Mình đã xem qua dữ liệu các bài tập gần đây của bạn. Camera AI ghi nhận bạn thường xuyên bị nhún vai khi mỏi cổ. Hãy chú ý hạ vai và thả lỏng nhé!'
    },
    {
      id: 'msg-2',
      sender: 'user',
      senderName: 'Bạn',
      avatar: '🌸',
      time: '10:20',
      text: 'Cảm ơn HLV! Mình thường bị mỏi nhiều vào khoảng 15h chiều khi ngồi gõ phím liên tục.'
    },
    {
      id: 'msg-3',
      sender: 'ai',
      senderName: 'FitPet AI Assistant',
      avatar: '🤖',
      time: '10:21',
      text: '💡 Gợi ý công thái học: Vào lúc 15h chiều, hãy đặt hẹn giờ giải lao 3 phút với bài "Giải Tỏa Thắt Lưng". Điều chỉnh màn hình máy tính sao cho mép trên ngang tầm mắt nhé!'
    }
  ]
};

class ConsultationService {
  constructor() {
    this.listeners = new Set();
  }

  getData() {
    if (typeof window === 'undefined') return INITIAL_DATA;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading consultation data:', e);
    }
    return INITIAL_DATA;
  }

  saveData(data) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.warn('Error saving consultation data:', e);
      }
    }
    this.notify(data);
    return data;
  }

  bookAppointment(newApt) {
    const data = this.getData();
    const created = {
      id: 'apt-' + Date.now(),
      status: 'confirmed',
      meetingLink: 'https://fitpet.app/call/consult-' + Math.floor(1000 + Math.random() * 9000),
      ...newApt
    };
    const updated = {
      ...data,
      appointments: [created, ...data.appointments]
    };
    return this.saveData(updated);
  }

  sendMessage(text) {
    const data = this.getData();
    const userMsg = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      senderName: 'Bạn',
      avatar: '🌸',
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      text: text.trim()
    };

    const nextMessages = [...data.chatMessages, userMsg];
    this.saveData({ ...data, chatMessages: nextMessages });

    // AI automated clinical companion reply
    setTimeout(() => {
      let aiReply = 'Cảm ơn câu hỏi của bạn. Mình khuyên bạn nên điều chỉnh độ cao ghế và thực hiện bài tập cổ vai 3 phút để thư giãn cơ bắp.';
      const lower = text.toLowerCase();
      if (lower.includes('cổ tay') || lower.includes('chuột')) {
        aiReply = 'Với triệu chứng cổ tay, hãy kê thêm đệm lót cổ tay và tập bài "Thư Giãn Cổ Tay Cho Người Gõ Phím" trong 3 phút để tránh chèn ép dây thần kinh giữa.';
      } else if (lower.includes('lưng') || lower.includes('cột sống')) {
        aiReply = 'Đau thắt lưng thường do thiếu điểm tựa thắt lưng. Hãy đặt một gối mỏng phía sau lưng ghế và tránh ngồi bắt chéo chân nhé!';
      }

      const botMsg = {
        id: 'msg-' + Date.now(),
        sender: 'ai',
        senderName: 'FitPet AI Assistant',
        avatar: '🤖',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        text: aiReply
      };

      const finalData = this.getData();
      this.saveData({
        ...finalData,
        chatMessages: [...finalData.chatMessages, botMsg]
      });
    }, 700);

    return userMsg;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(data) {
    this.listeners.forEach(fn => fn(data));
  }
}

export const consultationService = new ConsultationService();

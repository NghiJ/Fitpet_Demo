/**
 * FitPet Desk Reminder & Smart Pomodoro Service
 * Quản lý lịch nhắc vận động vi mô và đồng hồ Pomodoro bàn làm việc cho dân văn phòng.
 */

const STORAGE_KEY = 'fitpet_desk_reminders';

const DEFAULT_SETTINGS = {
  isEnabled: true,
  intervalMinutes: 45,
  sound: 'pip_voice',
  soundVolume: 0.8,
  autoStartWorkout: false,
  workHours: {
    start: '08:30',
    end: '18:00',
    days: ['T2', 'T3', 'T4', 'T5', 'T6']
  },
  idealSchedule: [
    {
      id: 'sch-1',
      time: '10:00',
      label: 'Khởi động sáng - Giải tỏa cổ vai',
      workoutId: 'desk-de-stiffener',
      durationMinutes: 3,
      enabled: true
    },
    {
      id: 'sch-2',
      time: '12:00',
      label: 'Nghỉ trưa - Hít thở & thả lỏng mắt',
      workoutId: 'quick-2min-refresh',
      durationMinutes: 2,
      enabled: true
    },
    {
      id: 'sch-3',
      time: '15:30',
      label: 'Xả mỏi chiều - Giải tỏa thắt lưng',
      workoutId: 'lower-back-relief',
      durationMinutes: 4,
      enabled: true
    },
    {
      id: 'sch-4',
      time: '17:15',
      label: 'Cuối giờ - Thư giãn cổ tay & ngón tay',
      workoutId: 'desk-wrist-flow',
      durationMinutes: 3,
      enabled: true
    }
  ]
};

class ReminderService {
  constructor() {
    this.listeners = new Set();
  }

  getSettings() {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
    } catch (e) {
      console.warn('Error reading desk reminder settings:', e);
    }
    return DEFAULT_SETTINGS;
  }

  saveSettings(newSettings) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      } catch (e) {
        console.warn('Error saving desk reminder settings:', e);
      }
    }
    this.notify(newSettings);
    return newSettings;
  }

  updateSetting(key, value) {
    const current = this.getSettings();
    const updated = { ...current, [key]: value };
    return this.saveSettings(updated);
  }

  toggleScheduleSlot(slotId) {
    const current = this.getSettings();
    const updatedSlots = current.idealSchedule.map(s => 
      s.id === slotId ? { ...s, enabled: !s.enabled } : s
    );
    return this.saveSettings({ ...current, idealSchedule: updatedSlots });
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(data) {
    this.listeners.forEach(fn => fn(data));
  }
}

export const reminderService = new ReminderService();

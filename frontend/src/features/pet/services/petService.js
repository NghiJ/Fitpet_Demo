/**
 * FitPet Companion Service
 * Quản lý đa dạng thú cưng (Pip, Mochi, Lulu, Bubu), lưu trữ tên tùy biến của người dùng
 * và đồng bộ trạng thái xuyên suốt ứng dụng qua localStorage & Event Listener.
 */

const PET_STORAGE_KEY = 'fitpet_companion_data';

export const PET_SPECIES_LIST = [
  {
    id: 'pip',
    name: 'Pip',
    title: 'Chim Cánh Cụt Năng Động',
    badge: 'Biểu Tượng FitPet',
    description: 'Thích vỗ cánh nhảy múa, mang yếm ngọc bích tràn đầy năng lượng tích cực.',
    themeColor: '#F59E0B',
    bgColor: '#FEF3C7',
    sound: 'tweet',
    defaultCheer: 'Pip rất vui khi được bạn vuốt ve! Cùng vươn vai nào bạn ơi! 🥰',
    defaultIdle: 'Pip luôn sẵn sàng mỗi khi bạn muốn dành 3 phút duỗi người!',
    defaultRest: 'Pip đang chợp mắt một chút... Nghỉ ngơi thật tốt nhé! 💤'
  },
  {
    id: 'mochi',
    name: 'Mochi',
    title: 'Mèo Cam Thư Thái',
    badge: 'Bậc Thầy Yoga Mèo',
    description: 'Mèo cam tròn xoe, thích duỗi lưng uốn éo yoga và đeo chuông vàng xinh xắn.',
    themeColor: '#F97316',
    bgColor: '#FFEDD5',
    sound: 'meow',
    defaultCheer: 'Meo meo~ Mochi rất khoái được gãi cằm! Giãn cơ đã lưng quá nè! 🐾',
    defaultIdle: 'Mèo con duỗi lưng lười, bạn cũng giãn cơ cùng Mochi nha meo~',
    defaultRest: 'Mochi đang cuộn tròn sưởi nắng... Khò khò... 💤'
  },
  {
    id: 'lulu',
    name: 'Lulu',
    title: 'Cún Shiba Tươi Vui',
    badge: 'Nguồn Năng Lượng Tích Cực',
    description: 'Cún Shiba má hồng đáng yêu, quàng khăn mint thời trang, luôn vẫy đuôi khích lệ.',
    themeColor: '#D97706',
    bgColor: '#FDE68A',
    sound: 'woof',
    defaultCheer: 'Gâu gâu! Lulu vẫy đuôi khen bạn đấy, tiếp tục phát huy nha! 🐶',
    defaultIdle: 'Lulu đang ngồi chờ bạn đứng dậy lắc lư vài nhịp nè!',
    defaultRest: 'Lulu nằm duỗi chân sau ngủ ngoan... Zzz 💤'
  },
  {
    id: 'bubu',
    name: 'Bubu',
    title: 'Gấu Trúc Điềm Đạm',
    badge: 'Chữa Lành & Tịnh Tâm',
    description: 'Gấu trúc tròn vo dễ thương, quàng khăn đỏ may mắn, chuyên hít thở sâu và thư giãn cổ vai.',
    themeColor: '#475569',
    bgColor: '#F1F5F9',
    sound: 'hum',
    defaultCheer: 'Bubu xoa bụng khen bạn! Thở một hơi thật sâu, sảng khoái quá! 🐼',
    defaultIdle: 'Hít vào bình an, thở ra nhẹ nhõm cùng Bubu nhé!',
    defaultRest: 'Bubu ôm cành trúc nghỉ ngơi rồi... Khò khò... 💤'
  }
];

class PetService {
  constructor() {
    this.listeners = new Set();
  }

  getPetData() {
    if (typeof window === 'undefined') {
      return { species: 'pip', customName: 'Pip', pettedCount: 0 };
    }

    try {
      const data = localStorage.getItem(PET_STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          species: parsed.species || 'pip',
          customName: parsed.customName ? parsed.customName.trim() : (this.getSpeciesInfo(parsed.species || 'pip')?.name || 'Pip'),
          pettedCount: parsed.pettedCount || 0,
          affinityLevel: parsed.affinityLevel || 1
        };
      }
    } catch (e) {
      console.warn('Error reading pet data from storage:', e);
    }

    return { species: 'pip', customName: 'Pip', pettedCount: 0, affinityLevel: 1 };
  }

  getSpeciesInfo(speciesId) {
    return PET_SPECIES_LIST.find(p => p.id === speciesId) || PET_SPECIES_LIST[0];
  }

  savePetData(newData) {
    if (typeof window === 'undefined') return;
    try {
      const current = this.getPetData();
      const updated = { ...current, ...newData };
      localStorage.setItem(PET_STORAGE_KEY, JSON.stringify(updated));
      this.notifyListeners(updated);
      return updated;
    } catch (e) {
      console.error('Error saving pet data:', e);
    }
  }

  setSpecies(speciesId) {
    const species = this.getSpeciesInfo(speciesId);
    const current = this.getPetData();
    // If the pet still has default name of previous pet or blank, update default name
    const prevSpecies = this.getSpeciesInfo(current.species);
    const shouldUpdateName = !current.customName || current.customName === prevSpecies.name;
    
    return this.savePetData({
      species: speciesId,
      customName: shouldUpdateName ? species.name : current.customName
    });
  }

  renamePet(newName) {
    const trimmed = (newName || '').trim();
    if (!trimmed) return this.getPetData();
    return this.savePetData({ customName: trimmed });
  }

  petCompanion() {
    const current = this.getPetData();
    const newCount = (current.pettedCount || 0) + 1;
    const newLevel = Math.min(5, Math.floor(newCount / 5) + 1);
    return this.savePetData({
      pettedCount: newCount,
      affinityLevel: newLevel
    });
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners(data) {
    this.listeners.forEach(callback => {
      try {
        callback(data);
      } catch (e) {
        console.error('Error in pet listener:', e);
      }
    });
  }
}

export const petService = new PetService();

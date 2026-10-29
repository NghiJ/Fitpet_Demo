import React, { useState } from 'react';
import { 
  Play, Pause, RotateCcw, CheckCircle2, AlertCircle, Wind, 
  Sparkles, ShieldCheck, Target, ChevronDown, ChevronUp, Layers,
  Compass, Eye, ArrowRight, Gauge
} from 'lucide-react';

/**
 * ExerciseIllustration Component
 * Hệ thống minh họa động tác trực quan, sống động và chuẩn giải phẫu học cho FitPet.
 * 
 * Nâng cấp vượt bậc so với nét vẽ que gậy:
 * 1. Nhân vật thể thao đa khối mềm mại (Volumetric Athletic Character) với trang phục, giày chạy, cơ bắp và khớp uốn tự nhiên.
 * 2. Chế độ "So Sánh 2 Bước Song Song" (Side-by-Side Dual Cards): Xem cùng lúc Bước 1 (Bắt đầu) và Bước 2 (Đỉnh động tác).
 * 3. Chế độ "Chuyển Động Sống Động" với Bóng Mờ (Ghost Silhouette Trail) và Quỹ Đạo Chuyển Động (Trajectory Flow).
 * 4. Bộ điều khiển tốc độ linh hoạt: 1.0x (Chuẩn) | 0.5x (Chậm để quan sát kỹ thuật) | Tạm dừng.
 * 5. Bảng kiểm tra DO vs DON'T (Tư thế chuẩn ✓ vs Lỗi sai cần tránh ✗).
 * 6. Hướng dẫn nhịp thở đồng điệu (Breathing Rhythm Indicator).
 */
export const ExerciseIllustration = ({
  type = 'wall_push',
  name = 'Động tác vận động',
  className = '',
  showControls = true,
  compact = false
}) => {
  // Mode: 'anim' (Chuyển động liên tục) | 'side_by_side' (So sánh 2 bước song song) | 'blueprint' (Chuẩn tư thế & Lỗi sai)
  const [activeTab, setActiveTab] = useState('anim');
  
  // Animation speed: 'normal' (3.2s) | 'slow' (5.5s) | 'paused'
  const [animSpeed, setAnimSpeed] = useState('normal');
  const [activePin, setActivePin] = useState(null);

  // Palettes for premium vector styling
  const skinTone = '#FED7AA'; // Warm peach skin
  const skinShadow = '#FDBA74';
  const hairColor = '#1E293B'; // Deep athletic slate
  const topColor = '#FF6B4A'; // FitPet signature coral
  const topDark = '#EA580C';
  const shortsColor = '#334155'; // Athletic slate
  const accentColor = '#10B981'; // Emerald glow
  const trajectoryColor = '#0EA5E9'; // Cyan motion arc
  const shoeColor = '#FFFFFF';
  const shoeTrim = '#10B981';

  // Comprehensive metadata for all 12 exercise types
  const getExerciseMeta = () => {
    switch (type) {
      case 'wall_push':
        return {
          title: 'Chống Đẩy Vào Tường (Wall Push-Up)',
          targetMuscles: 'Cơ Ngực • Bắp Tay Sau • Khớp Vai & Cơ Lõi',
          breathingCue: 'Hạ ngực sát tường: Hít vào sâu bằng mũi • Đẩy thẳng người trở lại: Thở ra êm qua miệng',
          step1: {
            title: 'Bước 1: Tư Thế Chuẩn Bị',
            desc: 'Đứng cách tường 1 bước chân (~50-70cm). Hai tay chống tường ngang ngực, bàn tay xòe đều, người thẳng từ gót chân đến đỉnh đầu.',
            badge: 'Duỗi tay, thẳng người'
          },
          step2: {
            title: 'Bước 2: Gập Tay Hạ Ngực',
            desc: 'Từ từ gập khuỷu tay góc 45° xuôi theo sườn, hạ ngực gần chạm tường. Giữ chắc cơ bụng, không võng lưng, gót chân nhón nhẹ.',
            badge: 'Khuỷu tay mở 45°'
          },
          checkpoints: [
            { id: 1, x: 172, y: 64, label: 'Bàn tay', tip: 'Đặt bàn tay ngang tầm ngực, các ngón tay xòe nhẹ bám chắc mặt tường để bảo vệ cổ tay.' },
            { id: 2, x: 122, y: 78, label: 'Khuỷu tay', tip: 'Khuỷu tay chếch 45 độ hình mũi tên xuôi theo thân mình, không bè ngang 90 độ.' },
            { id: 3, x: 74, y: 88, label: 'Cột sống', tip: 'Gáy, lưng và gót chân tạo thành một đường thẳng tự nhiên, siết nhẹ cơ bụng.' },
            { id: 4, x: 38, y: 138, label: 'Gót chân', tip: 'Gót hơi nhón nhẹ tự nhiên theo độ dốc của cơ thể khi người ngả về phía trước.' }
          ],
          dos: [
            'Giữ thân người thẳng như một tấm ván (Plank đứng)',
            'Khuỷu tay khép góc 45 độ so với thân mình',
            'Chuyển động chậm rãi 2-3 giây mỗi lượt'
          ],
          donts: [
            'Không võng lưng hoặc gập hông đung đưa',
            'Không bè ngang khuỷu tay 90 độ gây đau khớp vai',
            'Không cúi gập cằm sát ngực'
          ]
        };

      case 'shoulder_roll':
        return {
          title: 'Xoay Vai Mở Ngực (Shoulder Rolls)',
          targetMuscles: 'Cơ Cầu Vai • Cơ Trám • Giải Tỏa Đốt Sống Cổ',
          breathingCue: 'Nâng vai lên tai: Hít sâu mở rộng ngực • Xoay trượt ra sau xuống dưới: Thở ra thả lỏng',
          step1: {
            title: 'Bước 1: Thả Lỏng Tự Nhiên',
            desc: 'Đứng hoặc ngồi thẳng lưng, hai cánh tay thả lỏng tự nhiên dọc hai bên hông, cằm song song mặt đất.',
            badge: 'Thả lỏng vai & cổ'
          },
          step2: {
            title: 'Bước 2: Vẽ Vòng Tròn Lớn',
            desc: 'Nâng bờ vai hướng lên dái tai, mở căng lồng ngực ép hai bả vai ra sau, rồi từ từ trượt vai ép xuống dưới.',
            badge: 'Xoay tròn trọn vẹn'
          },
          checkpoints: [
            { id: 1, x: 100, y: 38, label: 'Cổ & Cằm', tip: 'Giữ cằm song song mặt đất, mắt nhìn thẳng, không rụt cổ hay ngửa đầu.' },
            { id: 2, x: 68, y: 76, label: 'Khớp vai', tip: 'Vẽ vòng xoay tròn lớn: Lên tai ➔ Ra sau mở ngực ➔ Trượt ép xuống dưới.' },
            { id: 3, x: 100, y: 92, label: 'Lồng ngực', tip: 'Cảm nhận lồng ngực mở rộng tối đa để lấy oxy vào đáy phổi.' }
          ],
          dos: [
            'Xoay vòng tròn trọn vẹn và êm ái',
            'Thả lỏng cơ hàm và cơ mặt',
            'Hít thở sâu đồng nhịp với vòng xoay'
          ],
          donts: [
            'Không xoay giật cục hoặc quá nhanh',
            'Không gồng cứng cơ cổ',
            'Không nín thở'
          ]
        };

      case 'torso_twist':
        return {
          title: 'Vặn Thân Mình Nhịp Nhàng (Torso Twist)',
          targetMuscles: 'Cơ Liên Sườn • Cột Sống Ngực • Khớp Hông',
          breathingCue: 'Xoay người sang bên: Thở ra nhẹ nhàng • Trở về chính diện: Hít sâu lấy hơi',
          step1: {
            title: 'Bước 1: Giữ Trục Trung Tâm',
            desc: 'Đứng thẳng, chân mở rộng bằng vai, hai tay gập nhẹ đặt trước ngực hoặc đặt trên hông để giữ thăng bằng.',
            badge: 'Hông hướng phía trước'
          },
          step2: {
            title: 'Bước 2: Xoay Đốt Sống Ngực',
            desc: 'Từ từ xoay thân trên sang một bên 20-30°, cảm nhận cơ liên sườn được kéo dãn nhẹ. Giữ hông cố định không xoay theo.',
            badge: 'Xoay nhẹ 20-30°'
          },
          checkpoints: [
            { id: 1, x: 100, y: 122, label: 'Khớp hông', tip: 'Chủ động giữ hông và đầu gối hướng thẳng về phía trước, chỉ xoay phần thân trên.' },
            { id: 2, x: 100, y: 76, label: 'Cột sống ngực', tip: 'Xoay xuất phát từ eo và đốt sống ngực một cách êm ái, biên độ thoải mái.' }
          ],
          dos: [
            'Xoay êm ái trong tầm thoải mái',
            'Giữ hai bàn chân bám chắc mặt sàn',
            'Mắt nhìn theo hướng xoay của vai'
          ],
          donts: [
            'Không xoay cả đầu gối và hông theo đà',
            'Không vặn người giật mạnh đột ngột',
            'Không nín thở'
          ]
        };

      case 'hip_hinge':
        return {
          title: 'Gập Hông Lưng Thẳng (Hip Hinge)',
          targetMuscles: 'Cơ Mông • Cơ Đùi Sau • Cột Sống Thắt Lưng',
          breathingCue: 'Đẩy hông ra sau: Hít vào giữ thẳng lưng • Đứng thẳng trở lại: Thở ra siết nhẹ mông',
          step1: {
            title: 'Bước 1: Đứng Thẳng Chuẩn',
            desc: 'Đứng thẳng, hai chân mở rộng bằng hông, ngực mở, hai tay đặt tại nếp gấp hông hoặc vươn nhẹ trước ngực.',
            badge: 'Cột sống trung tính'
          },
          step2: {
            title: 'Bước 2: Đẩy Hông Ra Sau',
            desc: 'Gập người từ khớp hông, chủ động đẩy mông ra phía sau như dùng mông đóng cửa xe. Lưng giữ thẳng tuyệt đối, gối chùng nhẹ.',
            badge: 'Lưng thẳng 180°'
          },
          checkpoints: [
            { id: 1, x: 104, y: 64, label: 'Lưng & Gáy', tip: 'Giữ lưng thẳng tự nhiên từ xương cụt lên đến gáy; mắt nhìn chếch xuống sàn 45 độ.' },
            { id: 2, x: 62, y: 92, label: 'Khớp hông', tip: 'Chuyển động đẩy lùi hông ra sau, cảm nhận cơ đùi sau và mông căng nhẹ.' },
            { id: 3, x: 74, y: 126, label: 'Khớp gối', tip: 'Gối hơi chùng nhẹ tự nhiên, không khóa cứng nhưng tuyệt đối không đẩy gối ra trước.' }
          ],
          dos: [
            'Chủ động đẩy hông về phía sau',
            'Giữ cột sống luôn thẳng tự nhiên',
            'Dồn trọng lượng vào gót chân'
          ],
          donts: [
            'Tuyệt đối không gù cong lưng khi cúi xuống',
            'Không khuỵu gối thành tư thế ngồi xổm (Squat)',
            'Không ngửa cổ nhìn thẳng trần nhà'
          ]
        };

      case 'chair_squat':
        return {
          title: 'Đứng Lên Ngồi Xuống Ghế (Chair Squat)',
          targetMuscles: 'Cơ Đùi Trước • Cơ Mông • Khớp Gối & Thăng Bằng',
          breathingCue: 'Hạ hông chạm ghế: Hít sâu giữ thăng bằng • Đạp gót đứng lên: Thở ra dứt khoát',
          step1: {
            title: 'Bước 1: Đứng Trước Ghế',
            desc: 'Đứng thẳng trước mép ghế 10cm, hai chân rộng bằng vai, mũi chân chếch nhẹ ra ngoài 10-15°, hai tay vươn trước ngực.',
            badge: 'Ngực mở thẳng'
          },
          step2: {
            title: 'Bước 2: Chạm Nhẹ Mép Ghế',
            desc: 'Đẩy hông ra sau hạ thấp người cho đến khi mông chạm nhẹ vào mép ghế (không ngồi sụp xuống), rồi đạp gót chân đứng thẳng lên.',
            badge: 'Gối theo mũi chân'
          },
          checkpoints: [
            { id: 1, x: 92, y: 52, label: 'Thân trên', tip: 'Ngực mở rộng, giữ thân trên đứng vững, hai tay vươn thẳng để tạo đối trọng thăng bằng.' },
            { id: 2, x: 68, y: 96, label: 'Vị trí mông', tip: 'Chạm nhẹ mép ghế như kiểm tra xem ghế có bụi không, sau đó đứng lên ngay.' },
            { id: 3, x: 98, y: 114, label: 'Đầu gối', tip: 'Đầu gối hướng thẳng theo hướng ngón chân thứ hai, không để đầu gối chụm vào nhau.' }
          ],
          dos: [
            'Đầu gối mở hướng theo mũi chân',
            'Đạp đều lực từ toàn bộ bàn chân và gót chân',
            'Chạm nhẹ ghế rồi đứng lên ngay'
          ],
          donts: [
            'Không để hai đầu gối chụm vào nhau (Knock-knee)',
            'Không nhấc gót chân khỏi sàn',
            'Không thả người ngồi sụp xuống ghế'
          ]
        };

      case 'wrist_neck':
        return {
          title: 'Sóng Cổ Tay Lượn Sóng (Wrist Waves)',
          targetMuscles: 'Gân Gấp/Duỗi Cẳng Tay • Khớp Cổ Tay & Bàn Tay',
          breathingCue: 'Xoay tròn mềm mại theo nhịp thở chậm, thả lỏng bờ vai và cơ mặt',
          step1: {
            title: 'Bước 1: Đan Nhẹ Bàn Tay',
            desc: 'Đan lỏng các ngón tay vào nhau trước ngực, khuỷu tay gập tự nhiên, hai vai thả lỏng hạ thấp.',
            badge: 'Đan lỏng bàn tay'
          },
          step2: {
            title: 'Bước 2: Xoay Hình Số 8',
            desc: 'Chuyển động hai bàn tay theo hình lượn sóng hoặc số 8 nằm ngang liên tục, xoay êm ái cả hai chiều.',
            badge: 'Uốn lượn số 8 mềm'
          },
          checkpoints: [
            { id: 1, x: 100, y: 106, label: 'Khớp cổ tay', tip: 'Chuyển động dẻo dai hình lượn sóng, giảm áp lực chèn ép ống cổ tay do gõ phím.' },
            { id: 2, x: 100, y: 65, label: 'Bờ vai', tip: 'Thả lỏng hoàn toàn hai bên vai, tránh co rụt vai khi xoay tay.' }
          ],
          dos: [
            'Chuyển động nhịp nhàng, liên tục như làn sóng',
            'Đổi chiều xoay sau 15-20 giây',
            'Thả lỏng toàn bộ cơ mặt và cổ'
          ],
          donts: [
            'Không bẻ gập cổ tay quá góc chịu đựng',
            'Không gồng cứng cơ bắp bả vai',
            'Không siết chặt các ngón tay'
          ]
        };

      case 'side_reach':
        return {
          title: 'Nghiêng Lườn Vươn Tay (Side Reach)',
          targetMuscles: 'Cơ Liên Sườn • Cơ Vuông Thắt Lưng • Khớp Vai',
          breathingCue: 'Vươn tay nghiêng lườn: Hít sâu mở rộng mạn sườn • Trở về giữa: Thở ra thả lỏng',
          step1: {
            title: 'Bước 1: Đứng Vững Trọng Tâm',
            desc: 'Đứng thẳng, hai chân rộng hơn vai một chút, tay phải chống nhẹ bên hông, tay trái buông xuôi.',
            badge: 'Đứng vững hai chân'
          },
          step2: {
            title: 'Bước 2: Vươn Cánh Tay Qua Đầu',
            desc: 'Vươn tay trái lên cao rồi nghiêng nhẹ sang phải tạo thành đường cong cung vĩ, cảm nhận cơ liên sườn được kéo dãn.',
            badge: 'Vươn cánh cung mềm'
          },
          checkpoints: [
            { id: 1, x: 140, y: 34, label: 'Cánh tay vươn', tip: 'Cánh tay vươn dài tự nhiên tạo thành đường cong cầu vồng qua đỉnh đầu.' },
            { id: 2, x: 86, y: 88, label: 'Cơ liên sườn', tip: 'Cảm nhận từng khoang liên sườn được tách rộng nhẹ nhàng để nạp oxy.' }
          ],
          dos: [
            'Vươn tay dài hướng lên cao trước khi nghiêng',
            'Hai bàn chân bám vững trên sàn chia đều trọng lượng',
            'Giữ ngực mở thẳng về phía trước'
          ],
          donts: [
            'Không đổ người chúi về phía trước',
            'Không nhấc chân bên đối diện khỏi sàn',
            'Không gập người quá sâu gây đau nhói'
          ]
        };

      case 'calf_raise':
        return {
          title: 'Nhón Gót Chân (Calf Raise)',
          targetMuscles: 'Cơ Bắp Chân • Gân Achilles • Kích Hoạt Tuần Hoàn Máu',
          breathingCue: 'Nhón cao gót chân: Thở ra siết bắp chân • Hạ gót chạm sàn: Hít sâu chậm rãi',
          step1: {
            title: 'Bước 1: Bàn Chân Bằng Phẳng',
            desc: 'Đứng thẳng, hai chân mở rộng bằng hông, hai tay thả lỏng bên sườn hoặc vịn nhẹ vào mép bàn/ghế nếu cần thăng bằng.',
            badge: 'Bám vững mặt sàn'
          },
          step2: {
            title: 'Bước 2: Nhón Cao Đầu Ngón Chân',
            desc: 'Dồn lực lên ức bàn chân, nâng gót chân lên cao khỏi mặt đất 5-7cm, giữ lại 1 nhịp ở đỉnh rồi hạ xuống chậm.',
            badge: 'Nâng gót +5-7cm'
          },
          checkpoints: [
            { id: 1, x: 100, y: 122, label: 'Cơ bắp chân', tip: 'Cơ bắp chân hoạt động như "trái tim thứ hai" bơm máu tĩnh mạch từ chân về tim.' },
            { id: 2, x: 100, y: 145, label: 'Ức bàn chân', tip: 'Nhấn đều lực vào khớp ngón chân cái và các ngón, không để mắt cá chân lật ra ngoài.' }
          ],
          dos: [
            'Nhón cao hết biên độ thoải mái',
            'Hạ gót xuống chậm rãi 2 giây (kiểm soát lực)',
            'Giữ thân người thẳng đứng như thang máy'
          ],
          donts: [
            'Không để mắt cá chân bị vặn lật ra ngoài',
            'Không gập hông hoặc chúi người về trước',
            'Không thả gót rơi sụp mạnh xuống sàn'
          ]
        };

      case 'arm_sweep':
        return {
          title: 'Vươn Tay Mở Lồng Ngực (Arm Sweep)',
          targetMuscles: 'Cơ Ngực Lớn • Cơ Lưng Giữa • Tuần Hoàn Hô Hấp',
          breathingCue: 'Quét hai tay lên cao: Hít sâu lồng ngực căng tràn • Hạ tay xuôi xuống: Thở êm thả lỏng',
          step1: {
            title: 'Bước 1: Buông Xuôi Thả Lỏng',
            desc: 'Đứng thẳng, chân mở bằng vai, hai cánh tay thả lỏng dọc theo thân mình, lòng bàn tay hướng vào nhau.',
            badge: 'Thả lỏng chuẩn bị'
          },
          step2: {
            title: 'Bước 2: Quét Vòng Cung Lên Cao',
            desc: 'Vẽ hai cánh tay sang hai bên thành vòng tròn lớn vươn lên qua đầu, mở rộng lồng ngực đón oxy tối đa.',
            badge: 'Mở rộng 180° đón oxy'
          },
          checkpoints: [
            { id: 1, x: 100, y: 78, label: 'Lồng ngực', tip: 'Lồng ngực mở căng tự nhiên giúp giải phóng áp lực lồng ngực do ngồi gù làm việc.' },
            { id: 2, x: 52, y: 45, label: 'Cánh tay', tip: 'Hai cánh tay vươn dài mềm mại tạo thành hình cánh quạt uyển chuyển.' }
          ],
          dos: [
            'Vẽ vòng cung thật rộng và êm',
            'Hít thở sâu đồng bộ với nhịp tay',
            'Thả lỏng cổ và cơ quai hàm'
          ],
          donts: [
            'Không gồng cứng cơ vai khi vươn tay',
            'Không ưỡn ngửa thắt lưng quá mức',
            'Không nín thở'
          ]
        };

      case 'march_place':
        return {
          title: 'Nâng Cao Đùi Tại Chỗ (Gentle March)',
          targetMuscles: 'Cơ Gập Hông • Cơ Đùi Trước • Tim Mạch Nhẹ',
          breathingCue: 'Hít thở đều đặn theo nhịp bước chân, giữ nhịp điệu thong thả thoải mái',
          step1: {
            title: 'Bước 1: Đứng Cân Bằng',
            desc: 'Đứng thẳng, giữ trục thăng bằng vững chắc, hai tay co tự nhiên ngang thắt lưng.',
            badge: 'Trục thẳng đứng'
          },
          step2: {
            title: 'Bước 2: Nâng Đùi Góc 90°',
            desc: 'Nhấc nhẹ một bên đầu gối lên cao tầm ngang hông (hoặc thấp hơn tùy sức), tay đối diện đánh nhẹ về trước theo phản xạ tự nhiên.',
            badge: 'Nâng gối ngang hông'
          },
          checkpoints: [
            { id: 1, x: 100, y: 96, label: 'Khớp hông & gối', tip: 'Nâng đùi nhẹ nhàng, đầu gối mở tự nhiên theo góc thoải mái, không cần cố nâng quá cao.' },
            { id: 2, x: 100, y: 64, label: 'Thân trên', tip: 'Giữ thân mình thẳng đứng, mắt nhìn thẳng, tránh ngả người ra sau khi nhấc chân.' }
          ],
          dos: [
            'Đánh tay tự nhiên nhịp nhàng cùng chân đối diện',
            'Tiếp đất êm ái bằng nửa bàn chân trước',
            'Giữ nhịp điệu đều đặn như đi dạo'
          ],
          donts: [
            'Không giậm chân mạnh gây ồn hoặc chấn động gối',
            'Không ngả lưng ra sau khi nhấc gối',
            'Không nín thở'
          ]
        };

      case 'side_step':
        return {
          title: 'Bước Ngang Nhịp Nhàng (Side Steps)',
          targetMuscles: 'Cơ Giạng Hông • Đùi Ngoài • Cơ Mông Nhỏ',
          breathingCue: 'Hít thở thoải mái theo từng nhịp bước qua trái và qua phải',
          step1: {
            title: 'Bước 1: Chân Khép Tự Nhiên',
            desc: 'Đứng ở vị trí trung tâm, gối hơi chùng nhẹ, hai tay gập trước ngực chuẩn bị vỗ tay nhẹ.',
            badge: 'Vị trí trung tâm'
          },
          step2: {
            title: 'Bước 2: Bước Rộng Sang Bên',
            desc: 'Bước một chân rộng sang bên khoảng 40-50cm, chùng nhẹ gối rồi rút chân kia theo chạm nhẹ mũi chân.',
            badge: 'Bước nhịp 40-50cm'
          },
          checkpoints: [
            { id: 1, x: 100, y: 110, label: 'Cơ hông ngoài', tip: 'Kích hoạt cơ mông nhỡ và cơ giạng hông vốn bị chèn ép khi ngồi ghế cả ngày.' }
          ],
          dos: [
            'Bước chân êm ái, nhịp nhàng theo nhạc',
            'Gối hơi chùng nhẹ để giảm xóc cho khớp',
            'Giữ nụ cười và tinh thần thư giãn'
          ],
          donts: [
            'Không bước chân quá rộng gây mất thăng bằng',
            'Không khóa cứng khớp gối'
          ]
        };

      case 'shake_out':
        return {
          title: 'Thả Lỏng Rung Toàn Thân (Shake Out)',
          targetMuscles: 'Giải Tỏa Axit Lactic • Tuần Hoàn Toàn Bộ Khớp',
          breathingCue: 'Hít sâu qua mũi và thở phào nhẹ nhõm qua miệng để giải phóng toàn bộ căng thẳng',
          step1: {
            title: 'Bước 1: Thả Lỏng Khớp',
            desc: 'Đứng thả lỏng toàn bộ cơ thể, hạ thấp bờ vai, nhắm mắt nhẹ hoặc nhìn thư thái phía trước.',
            badge: 'Buông lỏng toàn thân'
          },
          step2: {
            title: 'Bước 2: Rung Nhịp Nhàng',
            desc: 'Lắc nhẹ hai bàn tay, vung vẩy hai cổ chân và thả lỏng bả vai theo chuyển động lượn sóng êm dịu.',
            badge: 'Giải phóng căng thẳng'
          },
          checkpoints: [
            { id: 1, x: 100, y: 55, label: 'Toàn thân', tip: 'Giải phóng năng lượng tù đọng, đưa cơ thể về trạng thái tươi mới và sảng khoái.' }
          ],
          dos: [
            'Thả lỏng tối đa các khớp ngón tay và cổ chân',
            'Thở ra một hơi dài thật khoan khoái',
            'Lắng nghe cảm giác nhẹ nhõm của cơ thể'
          ],
          donts: [
            'Không gồng cứng bất kỳ nhóm cơ nào',
            'Không lắc giật quá mạnh'
          ]
        };

      default:
        return {
          title: 'Vận Động Thư Giãn (Gentle Move)',
          targetMuscles: 'Toàn Thân • Tuần Hoàn Năng Lượng',
          breathingCue: 'Hít thở sâu mở ngực, thở chậm thả lỏng toàn bộ cơ thể',
          step1: { title: 'Bước 1: Chuẩn Bị', desc: 'Đứng thẳng lưng, thở đều đặn và thả lỏng.', badge: 'Chuẩn bị' },
          step2: { title: 'Bước 2: Vận Động', desc: 'Vươn duỗi nhẹ nhàng trong tầm biên độ thoải mái.', badge: 'Vận động' },
          checkpoints: [{ id: 1, x: 100, y: 55, label: 'Tư thế thẳng', tip: 'Giữ lưng thẳng, thở đều và vận động vừa sức.' }],
          dos: ['Thở đều', 'Thả lỏng'],
          donts: ['Không nín thở']
        };
    }
  };

  const meta = getExerciseMeta();

  /**
   * Helper: Render Volumetric Human Vector Character
   * Renders realistic aesthetic character with athletic clothing, sneakers, curves, and proper joints.
   * mode: 'step1' | 'step2' | 'anim' | 'ghost'
   */
  const renderVolumetricCharacter = (poseStep = 'step1', isGhost = false) => {
    const isStep2 = poseStep === 'step2';
    const characterOpacity = isGhost ? 0.3 : 1;
    const filterEffect = isGhost ? 'url(#ghostFilter)' : 'none';

    switch (type) {
      // 1. WALL PUSH-UP
      case 'wall_push': {
        return (
          <g opacity={characterOpacity} filter={filterEffect}>
            {/* Floor Plane & Mat */}
            <line x1="20" y1="145" x2="195" y2="145" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" />
            
            {/* Architectural Wall with Bevel */}
            <defs>
              <linearGradient id="wallGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="100%" stopColor="#64748B" />
              </linearGradient>
              <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={topColor} />
                <stop offset="100%" stopColor={topDark} />
              </linearGradient>
              <filter id="ghostFilter" x="-10%" y="-10%" width="120%" height="120%">
                <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0.4 0"/>
              </filter>
            </defs>
            <rect x="168" y="14" width="14" height="134" rx="4" fill="url(#wallGrad)" />
            <line x1="168" y1="14" x2="168" y2="148" stroke="#94A3B8" strokeWidth="1.5" />
            
            {/* Target Hand Contact Zone on Wall */}
            <rect x="163" y="56" width="16" height="34" rx="5" fill="none" stroke="#10B981" strokeWidth="1.8" strokeDasharray="3 3" />
            <circle cx="168" cy="73" r="5" fill="#10B981" opacity="0.3" />

            {/* Character Body Group */}
            {isStep2 ? (
              /* Step 2: Chest closer to wall, elbows bent 45 degrees */
              <g transform="translate(24, 0)">
                {/* Back Leg & Foot */}
                <path d="M 54 144 Q 68 116 88 94" fill="none" stroke="#475569" strokeWidth="10" strokeLinecap="round" />
                <ellipse cx="54" cy="144" rx="10" ry="4.5" fill="#1E293B" />
                <path d="M 45 145 L 63 145" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />

                {/* Torso & Athletic Top (Angled plank) */}
                <path d="M 88 94 L 126 62 Q 132 58 136 64 L 118 100 Z" fill="url(#shirtGrad)" />
                <path d="M 88 94 L 102 106 L 90 110 Z" fill={shortsColor} />

                {/* Front Leg */}
                <path d="M 94 102 L 68 144" stroke="#334155" strokeWidth="11" strokeLinecap="round" />
                <ellipse cx="68" cy="144" rx="10" ry="4.5" fill="#0F172A" />
                <path d="M 59 145 L 77 145" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />

                {/* Head with athletic hair */}
                <circle cx="138" cy="44" r="14" fill={skinTone} stroke={skinShadow} strokeWidth="1.5" />
                <path d="M 127 40 Q 134 30 148 35 Q 152 44 146 50 Q 135 48 127 40 Z" fill={hairColor} />
                <circle cx="134" cy="45" r="2.5" fill={hairColor} />

                {/* Bent Arm at 45 degree angle */}
                <path d="M 124 65 L 106 82 L 144 73" fill="none" stroke={skinTone} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 124 65 L 114 74" stroke={topColor} strokeWidth="11" strokeLinecap="round" />
                {/* Hand on Wall */}
                <circle cx="144" cy="73" r="6" fill={skinShadow} />

                {/* Angle Badge Callout 45 deg */}
                <g transform="translate(94, 88)">
                  <circle cx="0" cy="0" r="10" fill="#0EA5E9" />
                  <text x="0" y="3.5" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="900">45°</text>
                </g>
              </g>
            ) : (
              /* Step 1: Arms extended, body straight */
              <g>
                {/* Back Leg & Foot */}
                <path d="M 54 144 Q 68 116 84 94" fill="none" stroke="#475569" strokeWidth="10" strokeLinecap="round" />
                <ellipse cx="54" cy="144" rx="10" ry="4.5" fill="#1E293B" />
                <path d="M 45 145 L 63 145" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />

                {/* Torso & Athletic Top */}
                <path d="M 84 94 L 118 60 Q 124 56 128 62 L 112 98 Z" fill="url(#shirtGrad)" />
                <path d="M 84 94 L 98 106 L 86 110 Z" fill={shortsColor} />

                {/* Front Leg */}
                <path d="M 90 102 L 64 144" stroke="#334155" strokeWidth="11" strokeLinecap="round" />
                <ellipse cx="64" cy="144" rx="10" ry="4.5" fill="#0F172A" />
                <path d="M 55 145 L 73 145" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />

                {/* Head */}
                <circle cx="128" cy="42" r="14" fill={skinTone} stroke={skinShadow} strokeWidth="1.5" />
                <path d="M 117 38 Q 124 28 138 33 Q 142 42 136 48 Q 125 46 117 38 Z" fill={hairColor} />
                <circle cx="124" cy="43" r="2.5" fill={hairColor} />

                {/* Extended Arms reaching to wall */}
                <path d="M 116 64 L 142 72 L 168 72" fill="none" stroke={skinTone} strokeWidth="8.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 116 64 L 128 68" stroke={topColor} strokeWidth="10.5" strokeLinecap="round" />
                <circle cx="168" cy="72" r="6" fill={skinShadow} />

                {/* Straight Line Spinal Alignment Guide */}
                <line x1="56" y1="142" x2="134" y2="40" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" />
              </g>
            )}
          </g>
        );
      }

      // 2. SHOULDER ROLLS
      case 'shoulder_roll': {
        return (
          <g opacity={characterOpacity} filter={filterEffect}>
            {/* Upper Body Portrait with Activewear */}
            <ellipse cx="100" cy="148" rx="48" ry="10" fill="rgba(0,0,0,0.06)" />
            
            {/* Neck */}
            <rect x="94" y="60" width="12" height="16" rx="3" fill={skinTone} />

            {/* Head & Athletic Hairstyle */}
            <circle cx="100" cy="42" r="19" fill={skinTone} stroke={skinShadow} strokeWidth="1.5" />
            <path d="M 83 38 Q 100 20 117 38 Q 112 50 100 48 Q 88 50 83 38 Z" fill={hairColor} />
            <ellipse cx="94" cy="43" rx="2" ry="2.5" fill={hairColor} />
            <ellipse cx="106" cy="43" rx="2" ry="2.5" fill={hairColor} />
            <path d="M 96 52 Q 100 55 104 52" stroke="#EA580C" strokeWidth="1.5" fill="none" strokeLinecap="round" />

            {isStep2 ? (
              /* Step 2: Shoulders rolled high & back, chest broad */
              <g transform="translate(0, -6)">
                {/* Broad Athletic Torso */}
                <path d="M 64 80 Q 100 86 136 80 L 140 140 L 60 140 Z" fill={topColor} />
                <path d="M 90 74 Q 100 80 110 74" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
                
                {/* Elevated Shoulder Bulbs with Muscle Glow */}
                <circle cx="66" cy="80" r="14" fill="#F97316" opacity="0.35" className="anim-glow-ring" />
                <circle cx="66" cy="80" r="9" fill={skinTone} />
                <circle cx="134" cy="80" r="14" fill="#F97316" opacity="0.35" className="anim-glow-ring" />
                <circle cx="134" cy="80" r="9" fill={skinTone} />

                {/* Arms back */}
                <path d="M 66 84 Q 58 110 62 135" stroke={skinTone} strokeWidth="10" strokeLinecap="round" fill="none" />
                <path d="M 134 84 Q 142 110 138 135" stroke={skinTone} strokeWidth="10" strokeLinecap="round" fill="none" />
              </g>
            ) : (
              /* Step 1: Relaxed neutral shoulders */
              <g>
                <path d="M 68 88 Q 100 92 132 88 L 136 142 L 64 142 Z" fill={topColor} />
                <path d="M 92 76 Q 100 82 108 76" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
                
                <circle cx="70" cy="88" r="9" fill={skinTone} />
                <circle cx="130" cy="88" r="9" fill={skinTone} />

                <path d="M 70 90 L 66 138" stroke={skinTone} strokeWidth="10" strokeLinecap="round" fill="none" />
                <path d="M 130 90 L 134 138" stroke={skinTone} strokeWidth="10" strokeLinecap="round" fill="none" />
              </g>
            )}

            {/* Circular Rotation Guide Arrows */}
            <path d="M 52 74 A 18 18 0 1 1 76 104" fill="none" stroke={trajectoryColor} strokeWidth="3" strokeDasharray="5 3" className="anim-trajectory" />
            <polygon points="50,72 58,68 57,78" fill={trajectoryColor} />

            <path d="M 124 104 A 18 18 0 1 1 148 74" fill="none" stroke={trajectoryColor} strokeWidth="3" strokeDasharray="5 3" className="anim-trajectory" />
            <polygon points="150,74 142,68 141,78" fill={trajectoryColor} />
          </g>
        );
      }

      // 3. TORSO TWIST
      case 'torso_twist': {
        return (
          <g opacity={characterOpacity} filter={filterEffect}>
            {/* Stable Feet Base Disc */}
            <ellipse cx="100" cy="144" rx="44" ry="10" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="1.5" />
            <text x="100" y="152" textAnchor="middle" fill="#64748B" fontSize="8" fontWeight="800">Hông cố định</text>

            {/* Legs and Shorts */}
            <path d="M 84 108 L 82 142" stroke={shortsColor} strokeWidth="12" strokeLinecap="round" />
            <path d="M 116 108 L 118 142" stroke={shortsColor} strokeWidth="12" strokeLinecap="round" />
            <ellipse cx="80" cy="142" rx="9" ry="4" fill="#0F172A" />
            <ellipse cx="120" cy="142" rx="9" ry="4" fill="#0F172A" />

            {/* Torso with Twist Rotation */}
            {isStep2 ? (
              <g transform="rotate(18, 100, 110)">
                <path d="M 76 74 Q 100 80 124 74 L 118 112 Q 100 114 82 112 Z" fill={topColor} />
                <circle cx="100" cy="44" r="16" fill={skinTone} stroke={skinShadow} strokeWidth="1.5" />
                <path d="M 85 40 Q 100 24 115 40 Z" fill={hairColor} />
                
                {/* Bent Arms in front of chest */}
                <path d="M 74 76 Q 100 94 136 78" fill="none" stroke={skinTone} strokeWidth="9" strokeLinecap="round" />
                <circle cx="134" cy="78" r="5" fill={skinShadow} />

                {/* Oblique muscle stretch highlight */}
                <ellipse cx="90" cy="94" rx="8" ry="12" fill="#F97316" opacity="0.4" className="anim-glow-ring" />
              </g>
            ) : (
              <g>
                <path d="M 78 74 Q 100 78 122 74 L 118 112 Q 100 114 82 112 Z" fill={topColor} />
                <circle cx="100" cy="44" r="16" fill={skinTone} stroke={skinShadow} strokeWidth="1.5" />
                <path d="M 85 40 Q 100 24 115 40 Z" fill={hairColor} />
                <path d="M 74 78 Q 100 92 126 78" fill="none" stroke={skinTone} strokeWidth="9" strokeLinecap="round" />
              </g>
            )}

            {/* Twist Trajectory Arc Indicator */}
            <path d="M 44 98 Q 100 122 156 98" fill="none" stroke="#F97316" strokeWidth="3" strokeDasharray="5 3" className="anim-trajectory" />
            <polygon points="42,94 48,104 38,102" fill="#F97316" />
            <polygon points="158,94 152,104 162,102" fill="#F97316" />
          </g>
        );
      }

      // 4. HIP HINGE
      case 'hip_hinge': {
        return (
          <g opacity={characterOpacity} filter={filterEffect}>
            <line x1="30" y1="145" x2="170" y2="145" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="3 3" />
            
            {isStep2 ? (
              /* Step 2: Hips back, torso angled forward 45 deg, spine straight */
              <g>
                {/* Legs (Soft knee bend, hips driven backward) */}
                <path d="M 78 144 L 84 108 L 62 94" fill="none" stroke={shortsColor} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                <ellipse cx="78" cy="144" rx="10" ry="4" fill="#0F172A" />

                {/* Torso angled 45 degrees, neutral spine */}
                <path d="M 62 94 L 118 64 Q 124 60 126 66 L 102 100 Z" fill={topColor} />
                
                {/* Head aligned with spine */}
                <circle cx="132" cy="56" r="14" fill={skinTone} stroke={skinShadow} strokeWidth="1.5" />
                <path d="M 122 52 Q 130 40 142 46 Z" fill={hairColor} />

                {/* Arms hanging naturally or reaching */}
                <path d="M 112 70 L 100 114" stroke={skinTone} strokeWidth="8" strokeLinecap="round" />

                {/* Spine Neutral Straight Guide Line */}
                <line x1="52" y1="98" x2="142" y2="50" stroke="#10B981" strokeWidth="2" strokeDasharray="4 3" />
                
                {/* Hip Drive Backward Arrow */}
                <g transform="translate(56, 92)">
                  <line x1="0" y1="0" x2="-28" y2="0" stroke="#F97316" strokeWidth="3" strokeDasharray="4 3" className="anim-trajectory" />
                  <polygon points="-32,0 -24,-4 -24,4" fill="#F97316" />
                  <text x="-48" y="-6" fill="#F97316" fontSize="8" fontWeight="800">Đẩy Hông Ra Sau</text>
                </g>
              </g>
            ) : (
              /* Step 1: Upright standing posture */
              <g>
                <path d="M 76 144 L 76 102" stroke={shortsColor} strokeWidth="12" strokeLinecap="round" />
                <ellipse cx="76" cy="144" rx="10" ry="4" fill="#0F172A" />

                <path d="M 72 102 L 72 62 Q 78 58 84 62 L 84 102 Z" fill={topColor} />
                <circle cx="78" cy="44" r="14" fill={skinTone} stroke={skinShadow} strokeWidth="1.5" />
                <path d="M 68 40 Q 78 28 88 36 Z" fill={hairColor} />

                {/* Arms relaxed at sides */}
                <path d="M 80 66 L 82 108" stroke={skinTone} strokeWidth="8" strokeLinecap="round" />
              </g>
            )}
          </g>
        );
      }

      // 5. CHAIR SQUAT
      case 'chair_squat': {
        return (
          <g opacity={characterOpacity} filter={filterEffect}>
            <line x1="20" y1="145" x2="180" y2="145" stroke="#CBD5E1" strokeWidth="2" />
            
            {/* Modern Ergonomic Studio Chair */}
            <path d="M 46 145 L 46 96 L 78 96" fill="none" stroke="#64748B" strokeWidth="5" strokeLinecap="round" />
            <line x1="76" y1="96" x2="76" y2="145" stroke="#64748B" strokeWidth="4" />
            <rect x="42" y="93" width="38" height="6" rx="2" fill="#94A3B8" />
            <path d="M 44 96 L 40 54" stroke="#64748B" strokeWidth="4.5" strokeLinecap="round" />

            {isStep2 ? (
              /* Step 2: Hips lowered touching seat, thighs parallel, arms forward */
              <g transform="translate(0, 20)">
                {/* Thigh & Calf */}
                <path d="M 98 125 L 98 94 L 72 90" fill="none" stroke={shortsColor} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                <ellipse cx="98" cy="125" rx="10" ry="4" fill="#0F172A" />

                {/* Torso upright leaning slightly */}
                <path d="M 72 90 L 92 48 L 104 54 L 84 96 Z" fill={topColor} />
                <circle cx="98" cy="34" r="14" fill={skinTone} stroke={skinShadow} strokeWidth="1.5" />
                <path d="M 88 30 Q 98 18 108 26 Z" fill={hairColor} />

                {/* Arms reaching forward for counter-balance */}
                <path d="M 94 54 L 138 54" stroke={skinTone} strokeWidth="8" strokeLinecap="round" />
                <circle cx="138" cy="54" r="5" fill={skinShadow} />

                {/* Glute muscle activation glow */}
                <circle cx="74" cy="90" r="12" fill="#F97316" opacity="0.35" className="anim-glow-ring" />
              </g>
            ) : (
              /* Step 1: Standing tall in front of chair */
              <g>
                <path d="M 96 144 L 96 102" stroke={shortsColor} strokeWidth="12" strokeLinecap="round" />
                <ellipse cx="96" cy="144" rx="10" ry="4" fill="#0F172A" />

                <path d="M 90 102 L 90 60 L 102 60 L 102 102 Z" fill={topColor} />
                <circle cx="96" cy="42" r="14" fill={skinTone} stroke={skinShadow} strokeWidth="1.5" />
                <path d="M 86 38 Q 96 26 106 34 Z" fill={hairColor} />

                <path d="M 96 66 L 130 66" stroke={skinTone} strokeWidth="8" strokeLinecap="round" />
              </g>
            )}

            {/* Vertical Motion Flow Indicator */}
            <g transform="translate(146, 74)">
              <line x1="0" y1="0" x2="0" y2="38" stroke="#F97316" strokeWidth="2.5" strokeDasharray="4 3" className="anim-trajectory" />
              <polygon points="0,-4 -4,4 4,4" fill="#F97316" />
              <polygon points="0,42 -4,34 4,34" fill="#F97316" />
              <text x="6" y="20" fill="#F97316" fontSize="8" fontWeight="800">Chạm ghế ➔ Lên</text>
            </g>
          </g>
        );
      }

      // 6. WRIST WAVE
      case 'wrist_neck': {
        return (
          <g opacity={characterOpacity} filter={filterEffect}>
            <ellipse cx="100" cy="146" rx="40" ry="8" fill="rgba(0,0,0,0.06)" />
            
            {/* Upper Chest and Forearms */}
            <path d="M 70 82 Q 100 86 130 82 L 134 140 L 66 140 Z" fill={topColor} />
            <circle cx="100" cy="44" r="18" fill={skinTone} stroke={skinShadow} strokeWidth="1.5" />
            <path d="M 84 38 Q 100 22 116 38 Z" fill={hairColor} />

            {/* Clasped Hands Wave */}
            {isStep2 ? (
              <g transform="rotate(16, 100, 102)">
                <path d="M 70 86 L 86 102 L 114 102 L 130 86" fill="none" stroke={skinTone} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="100" cy="102" r="12" fill={skinShadow} />
                <path d="M 88 102 Q 100 90 112 102" fill="none" stroke="#0EA5E9" strokeWidth="3" />
              </g>
            ) : (
              <g>
                <path d="M 70 86 L 86 104 L 114 104 L 130 86" fill="none" stroke={skinTone} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="100" cy="104" r="12" fill={skinShadow} />
                <path d="M 88 104 Q 100 116 112 104" fill="none" stroke="#0EA5E9" strokeWidth="3" />
              </g>
            )}

            {/* Ripple Wave Cues */}
            <path d="M 64 104 Q 56 92 64 80" fill="none" stroke={trajectoryColor} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 136 104 Q 144 92 136 80" fill="none" stroke={trajectoryColor} strokeWidth="2.5" strokeLinecap="round" />
            <text x="100" y="148" textAnchor="middle" fill="#64748B" fontSize="8.5" fontWeight="800">Sóng mềm mại hình số 8</text>
          </g>
        );
      }

      // 7. SIDE REACH
      case 'side_reach': {
        return (
          <g opacity={characterOpacity} filter={filterEffect}>
            <line x1="40" y1="145" x2="160" y2="145" stroke="#CBD5E1" strokeWidth="2" />
            
            {/* Legs */}
            <path d="M 86 144 L 92 110" stroke={shortsColor} strokeWidth="11" strokeLinecap="round" />
            <path d="M 114 144 L 108 110" stroke={shortsColor} strokeWidth="11" strokeLinecap="round" />
            <ellipse cx="84" cy="144" rx="8" ry="4" fill="#0F172A" />
            <ellipse cx="116" cy="144" rx="8" ry="4" fill="#0F172A" />

            {isStep2 ? (
              /* Step 2: Gracefully arched to the right, left arm overhead */
              <g transform="rotate(20, 100, 110)">
                <path d="M 88 72 Q 100 76 112 72 L 108 110 L 92 110 Z" fill={topColor} />
                <circle cx="100" cy="46" r="14" fill={skinTone} stroke={skinShadow} strokeWidth="1.5" />
                <path d="M 90 42 Q 100 30 110 38 Z" fill={hairColor} />

                {/* Hand on hip */}
                <path d="M 90 74 L 80 88 L 92 92" fill="none" stroke={skinTone} strokeWidth="7" strokeLinecap="round" />

                {/* Arm reaching arched overhead */}
                <path d="M 112 72 Q 134 42 144 28" fill="none" stroke={skinTone} strokeWidth="8" strokeLinecap="round" />
                <circle cx="144" cy="28" r="5" fill={skinShadow} />

                {/* Ribcage stretch indicator */}
                <path d="M 88 76 Q 78 92 88 108" fill="none" stroke="#F97316" strokeWidth="4" strokeLinecap="round" opacity="0.6" className="anim-glow-ring" />
              </g>
            ) : (
              /* Step 1: Upright posture */
              <g>
                <path d="M 88 72 Q 100 76 112 72 L 108 110 L 92 110 Z" fill={topColor} />
                <circle cx="100" cy="46" r="14" fill={skinTone} stroke={skinShadow} strokeWidth="1.5" />
                <path d="M 90 42 Q 100 30 110 38 Z" fill={hairColor} />

                <path d="M 90 74 L 80 88 L 92 92" fill="none" stroke={skinTone} strokeWidth="7" strokeLinecap="round" />
                <path d="M 112 72 L 118 108" stroke={skinTone} strokeWidth="7" strokeLinecap="round" />
              </g>
            )}

            {/* Arc Curve Flow Indicator */}
            <path d="M 116 26 Q 146 44 152 76" fill="none" stroke={trajectoryColor} strokeWidth="2.5" strokeDasharray="4 3" className="anim-trajectory" />
            <polygon points="116,26 124,30 120,34" fill={trajectoryColor} />
          </g>
        );
      }

      // 8. CALF RAISE
      case 'calf_raise': {
        return (
          <g opacity={characterOpacity} filter={filterEffect}>
            <line x1="30" y1="145" x2="170" y2="145" stroke="#CBD5E1" strokeWidth="2" />
            
            {isStep2 ? (
              /* Step 2: Elevated on balls of feet, +5cm, calves flexed */
              <g transform="translate(0, -18)">
                <ellipse cx="100" cy="158" rx="26" ry="5" fill="rgba(0,0,0,0.12)" />

                {/* Legs & Flexed Calves */}
                <path d="M 90 142 L 90 102" stroke={shortsColor} strokeWidth="12" strokeLinecap="round" />
                <path d="M 110 142 L 110 102" stroke={shortsColor} strokeWidth="12" strokeLinecap="round" />
                
                {/* Elevated Feet (Tipped on toes) */}
                <path d="M 84 144 L 94 138" stroke="#0F172A" strokeWidth="7" strokeLinecap="round" />
                <path d="M 104 144 L 114 138" stroke="#0F172A" strokeWidth="7" strokeLinecap="round" />

                {/* Calves muscle glow */}
                <ellipse cx="88" cy="118" rx="8" ry="12" fill="#F97316" opacity="0.4" className="anim-glow-ring" />
                <ellipse cx="112" cy="118" rx="8" ry="12" fill="#F97316" opacity="0.4" className="anim-glow-ring" />

                {/* Body & Head */}
                <path d="M 84 102 L 84 62 L 116 62 L 116 102 Z" fill={topColor} />
                <circle cx="100" cy="44" r="15" fill={skinTone} stroke={skinShadow} strokeWidth="1.5" />
                <path d="M 88 40 Q 100 26 112 36 Z" fill={hairColor} />

                <path d="M 84 68 L 78 106" stroke={skinTone} strokeWidth="7" strokeLinecap="round" />
                <path d="M 116 68 L 122 106" stroke={skinTone} strokeWidth="7" strokeLinecap="round" />
              </g>
            ) : (
              /* Step 1: Flat on feet */
              <g>
                <path d="M 90 144 L 90 102" stroke={shortsColor} strokeWidth="12" strokeLinecap="round" />
                <path d="M 110 144 L 110 102" stroke={shortsColor} strokeWidth="12" strokeLinecap="round" />
                <ellipse cx="88" cy="144" rx="9" ry="4" fill="#0F172A" />
                <ellipse cx="112" cy="144" rx="9" ry="4" fill="#0F172A" />

                <path d="M 84 102 L 84 62 L 116 62 L 116 102 Z" fill={topColor} />
                <circle cx="100" cy="44" r="15" fill={skinTone} stroke={skinShadow} strokeWidth="1.5" />
                <path d="M 88 40 Q 100 26 112 36 Z" fill={hairColor} />

                <path d="M 84 68 L 78 106" stroke={skinTone} strokeWidth="7" strokeLinecap="round" />
                <path d="M 116 68 L 122 106" stroke={skinTone} strokeWidth="7" strokeLinecap="round" />
              </g>
            )}

            {/* Upward Elevation Arrows */}
            <g transform="translate(142, 118)">
              <line x1="0" y1="24" x2="0" y2="0" stroke="#10B981" strokeWidth="3" strokeDasharray="4 3" className="anim-trajectory" />
              <polygon points="0,-4 -4,4 4,4" fill="#10B981" />
              <text x="6" y="14" fill="#10B981" fontSize="8.5" fontWeight="900">+5-7cm</text>
            </g>
          </g>
        );
      }

      // 9. ARM SWEEP
      case 'arm_sweep': {
        return (
          <g opacity={characterOpacity} filter={filterEffect}>
            <ellipse cx="100" cy="146" rx="36" ry="8" fill="rgba(0,0,0,0.06)" />
            
            {/* Legs & Torso */}
            <path d="M 90 144 L 92 108" stroke={shortsColor} strokeWidth="11" strokeLinecap="round" />
            <path d="M 110 144 L 108 108" stroke={shortsColor} strokeWidth="11" strokeLinecap="round" />
            <path d="M 86 108 L 86 66 L 114 66 L 114 108 Z" fill={topColor} />
            
            <circle cx="100" cy="46" r="15" fill={skinTone} stroke={skinShadow} strokeWidth="1.5" />
            <path d="M 88 42 Q 100 28 112 38 Z" fill={hairColor} />

            {isStep2 ? (
              /* Step 2: Arms swept wide overhead, chest expanded */
              <g>
                <path d="M 86 70 Q 56 46 64 24" stroke={skinTone} strokeWidth="8" strokeLinecap="round" fill="none" />
                <circle cx="64" cy="24" r="5" fill={skinShadow} />

                <path d="M 114 70 Q 144 46 136 24" stroke={skinTone} strokeWidth="8" strokeLinecap="round" fill="none" />
                <circle cx="136" cy="24" r="5" fill={skinShadow} />

                {/* Expanded Chest Glow */}
                <ellipse cx="100" cy="78" rx="18" ry="12" fill="#F97316" opacity="0.35" className="anim-glow-ring" />
              </g>
            ) : (
              /* Step 1: Arms down at sides */
              <g>
                <path d="M 86 70 L 68 106" stroke={skinTone} strokeWidth="8" strokeLinecap="round" />
                <path d="M 114 70 L 132 106" stroke={skinTone} strokeWidth="8" strokeLinecap="round" />
              </g>
            )}

            {/* Sweeping Arcs */}
            <path d="M 44 96 A 54 54 0 0 1 76 24" fill="none" stroke={trajectoryColor} strokeWidth="2.5" strokeDasharray="4 3" className="anim-trajectory" />
            <polygon points="78,22 72,28 68,22" fill={trajectoryColor} />

            <path d="M 156 96 A 54 54 0 0 0 124 24" fill="none" stroke={trajectoryColor} strokeWidth="2.5" strokeDasharray="4 3" className="anim-trajectory" />
            <polygon points="122,22 128,28 132,22" fill={trajectoryColor} />
          </g>
        );
      }

      // Default: Universal graceful mover
      default: {
        return (
          <g opacity={characterOpacity} filter={filterEffect}>
            <ellipse cx="100" cy="146" rx="36" ry="8" fill="rgba(0,0,0,0.06)" />
            <path d="M 90 144 L 92 108" stroke={shortsColor} strokeWidth="11" strokeLinecap="round" />
            <path d="M 110 144 L 108 108" stroke={shortsColor} strokeWidth="11" strokeLinecap="round" />
            <path d="M 86 108 L 86 66 L 114 66 L 114 108 Z" fill={topColor} />
            <circle cx="100" cy="46" r="15" fill={skinTone} stroke={skinShadow} strokeWidth="1.5" />
            <path d="M 88 42 Q 100 28 112 38 Z" fill={hairColor} />
            <path d="M 86 70 L 68 106" stroke={skinTone} strokeWidth="8" strokeLinecap="round" />
            <path d="M 114 70 L 132 106" stroke={skinTone} strokeWidth="8" strokeLinecap="round" />
          </g>
        );
      }
    }
  };

  return (
    <div className={`exercise-illustration-root ${className}`} style={{ width: '100%' }}>
      {/* Top Header & Visual Tab Switcher */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '10px'
      }}>
        {/* Title & Target Muscles */}
        <div>
          <div style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
            {meta.title}
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--color-brand-primary)', fontWeight: 700, marginTop: '2px' }}>
            🎯 {meta.targetMuscles}
          </div>
        </div>

        {/* View Mode Tabs */}
        {showControls && (
          <div style={{
            display: 'inline-flex',
            backgroundColor: 'var(--color-surface-subtle)',
            borderRadius: 'var(--radius-full)',
            padding: '3px',
            border: '1px solid var(--color-border)'
          }}>
            <button
              onClick={() => { setActiveTab('anim'); setActivePin(null); }}
              style={{
                padding: '5px 12px',
                fontSize: '0.74rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-full)',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === 'anim' ? 'var(--color-brand-primary)' : 'transparent',
                color: activeTab === 'anim' ? '#FFFFFF' : 'var(--color-text-secondary)',
                boxShadow: activeTab === 'anim' ? '0 2px 6px rgba(16, 185, 129, 0.3)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all var(--transition-fast)'
              }}
            >
              <RotateCcw size={12} /> Chuyển Động
            </button>

            <button
              onClick={() => { setActiveTab('side_by_side'); setActivePin(null); }}
              style={{
                padding: '5px 12px',
                fontSize: '0.74rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-full)',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === 'side_by_side' ? 'var(--color-brand-primary)' : 'transparent',
                color: activeTab === 'side_by_side' ? '#FFFFFF' : 'var(--color-text-secondary)',
                boxShadow: activeTab === 'side_by_side' ? '0 2px 6px rgba(16, 185, 129, 0.3)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Layers size={12} /> So Sánh 2 Bước
            </button>

            <button
              onClick={() => { setActiveTab('blueprint'); setActivePin(null); }}
              style={{
                padding: '5px 12px',
                fontSize: '0.74rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-full)',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === 'blueprint' ? 'var(--color-brand-primary)' : 'transparent',
                color: activeTab === 'blueprint' ? '#FFFFFF' : 'var(--color-text-secondary)',
                boxShadow: activeTab === 'blueprint' ? '0 2px 6px rgba(16, 185, 129, 0.3)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all var(--transition-fast)'
              }}
            >
              <ShieldCheck size={12} /> Chuẩn & Lỗi Cần Tránh
            </button>
          </div>
        )}
      </div>

      {/* ================= TAB 1: ANIMATED VIEW (With Ghost Silhouette Trail & Speed Controls) ================= */}
      {activeTab === 'anim' && (
        <div>
          <div style={{
            position: 'relative',
            width: '100%',
            height: compact ? '180px' : '230px',
            backgroundColor: 'var(--color-surface-subtle)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at 50% 40%, rgba(16, 185, 129, 0.05) 0%, var(--color-surface-subtle) 75%)'
          }}>
            <svg
              viewBox="0 0 200 160"
              width="100%"
              height="100%"
              aria-label={`Hình minh họa chuyển động động tác ${name}`}
              role="img"
              style={{ overflow: 'visible' }}
              className={`anim-speed-${animSpeed}`}
            >
              {/* Ghost Silhouette of Step 1 (Underneath, showing motion starting range) */}
              {renderVolumetricCharacter('step1', true)}

              {/* Active Animated Character */}
              <g className={`anim-${type.replace(/_/g, '-')}`}>
                {renderVolumetricCharacter('step2', false)}
              </g>

              {/* Interactive Checkpoint Pins Overlay */}
              {meta.checkpoints && meta.checkpoints.map((pin) => (
                <g
                  key={pin.id}
                  className="illustration-pin"
                  transform={`translate(${pin.x}, ${pin.y})`}
                  onClick={() => setActivePin(activePin === pin.id ? null : pin.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle
                    cx="0" cy="0" r="10"
                    fill="var(--color-surface)"
                    stroke={activePin === pin.id ? '#FF6B4A' : '#10B981'}
                    strokeWidth="2.5"
                    filter="drop-shadow(0 2px 5px rgba(0,0,0,0.18))"
                  />
                  <text
                    x="0" y="3.5"
                    textAnchor="middle"
                    fill={activePin === pin.id ? '#FF6B4A' : '#10B981'}
                    fontSize="9.5"
                    fontWeight="900"
                  >
                    {pin.id}
                  </text>
                </g>
              ))}
            </svg>

            {/* Floating Speed Control Buttons Overlay in Top-Right */}
            {showControls && (
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.88)',
                backdropFilter: 'blur(6px)',
                borderRadius: 'var(--radius-full)',
                padding: '3px 8px',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--color-border-subtle)',
                zIndex: 5
              }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--color-text-muted)', marginRight: '2px' }}>
                  Tốc độ:
                </span>
                <button
                  onClick={() => setAnimSpeed('slow')}
                  style={{
                    border: 'none',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: animSpeed === 'slow' ? '#10B981' : 'transparent',
                    color: animSpeed === 'slow' ? '#FFFFFF' : 'var(--color-text-secondary)'
                  }}
                  title="Chuyển động chậm để quan sát kỹ thuật"
                >
                  0.5x
                </button>
                <button
                  onClick={() => setAnimSpeed('normal')}
                  style={{
                    border: 'none',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: animSpeed === 'normal' ? '#10B981' : 'transparent',
                    color: animSpeed === 'normal' ? '#FFFFFF' : 'var(--color-text-secondary)'
                  }}
                  title="Tốc độ bình thường"
                >
                  1.0x
                </button>
                <button
                  onClick={() => setAnimSpeed(animSpeed === 'paused' ? 'normal' : 'paused')}
                  style={{
                    border: 'none',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: animSpeed === 'paused' ? '#EF4444' : 'transparent',
                    color: animSpeed === 'paused' ? '#FFFFFF' : 'var(--color-text-secondary)'
                  }}
                  title={animSpeed === 'paused' ? 'Tiếp tục' : 'Tạm dừng'}
                >
                  {animSpeed === 'paused' ? <Play size={10} /> : <Pause size={10} />}
                </button>
              </div>
            )}

            {/* Checkpoint Pin Tooltip Callout */}
            {activePin && (
              <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '12px',
                right: '12px',
                backgroundColor: 'rgba(15, 23, 42, 0.94)',
                backdropFilter: 'blur(8px)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                padding: '9px 14px',
                fontSize: '0.8rem',
                lineHeight: 1.45,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-md)',
                zIndex: 10,
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div>
                  <span style={{ color: '#34D399', fontWeight: 800, marginRight: '6px' }}>
                    Điểm {activePin} ({meta.checkpoints.find(c => c.id === activePin)?.label}):
                  </span>
                  <span>{meta.checkpoints.find(c => c.id === activePin)?.tip}</span>
                </div>
                <button
                  onClick={() => setActivePin(null)}
                  style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '2px 6px', fontSize: '1rem', marginLeft: '8px' }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
            <span>💡 <em>Bóng mờ mờ đằng sau minh họa vị trí xuất phát. Bấm vào các số tròn để xem lưu ý tư thế.</em></span>
          </div>
        </div>
      )}

      {/* ================= TAB 2: SIDE-BY-SIDE DUAL CARDS (Giải Quyết Triệt Để "Khó Hình Dung") ================= */}
      {activeTab === 'side_by_side' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            {/* CARD 1: STEP 1 (START POSITION) */}
            <div style={{
              backgroundColor: 'var(--color-surface-subtle)',
              borderRadius: 'var(--radius-lg)',
              border: '1.5px solid var(--color-border)',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  color: 'var(--color-brand-primary)',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-full)'
                }}>
                  {meta.step1.badge}
                </span>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                  BẮT ĐẦU
                </span>
              </div>

              {/* Graphic Step 1 */}
              <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 200 160" width="100%" height="100%">
                  {renderVolumetricCharacter('step1', false)}
                </svg>
              </div>

              {/* Step 1 Details */}
              <div style={{ marginTop: '8px', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '8px' }}>
                <div style={{ fontWeight: 800, fontSize: '0.86rem', color: 'var(--color-text-primary)', marginBottom: '3px' }}>
                  {meta.step1.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                  {meta.step1.desc}
                </div>
              </div>
            </div>

            {/* CARD 2: STEP 2 (PEAK / CONTRACTION POSITION) */}
            <div style={{
              backgroundColor: 'var(--color-surface-subtle)',
              borderRadius: 'var(--radius-lg)',
              border: '1.5px solid rgba(255, 107, 74, 0.35)',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 4px 16px rgba(255, 107, 74, 0.08)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  color: '#FF6B4A',
                  backgroundColor: 'rgba(255, 107, 74, 0.12)',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-full)'
                }}>
                  {meta.step2.badge}
                </span>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#FF6B4A' }}>
                  ĐỈNH ĐỘNG TÁC
                </span>
              </div>

              {/* Graphic Step 2 */}
              <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 200 160" width="100%" height="100%">
                  {renderVolumetricCharacter('step2', false)}
                </svg>
              </div>

              {/* Step 2 Details */}
              <div style={{ marginTop: '8px', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '8px' }}>
                <div style={{ fontWeight: 800, fontSize: '0.86rem', color: 'var(--color-text-primary)', marginBottom: '3px' }}>
                  {meta.step2.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                  {meta.step2.desc}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: BLUEPRINT & DO / DON'T CHECKLIST ================= */}
      {activeTab === 'blueprint' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
          {/* Green Card: DO (Nên Làm) */}
          <div style={{
            padding: '14px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            border: '1.5px solid rgba(16, 185, 129, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: '#059669', fontSize: '0.88rem', marginBottom: '8px' }}>
              <CheckCircle2 size={16} /> NÊN LÀM (Tư Thế Chuẩn)
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.8rem', color: 'var(--color-text-primary)', lineHeight: 1.5 }}>
              {meta.dos && meta.dos.map((item, idx) => (
                <li key={idx} style={{ marginBottom: '6px' }}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Red Card: DON'T (Cần Tránh) */}
          <div style={{
            padding: '14px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1.5px solid rgba(239, 68, 68, 0.28)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: '#DC2626', fontSize: '0.88rem', marginBottom: '8px' }}>
              <AlertCircle size={16} /> CẦN TRÁNH (Lỗi Sai Phổ Biến)
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.8rem', color: 'var(--color-text-primary)', lineHeight: 1.5 }}>
              {meta.donts && meta.donts.map((item, idx) => (
                <li key={idx} style={{ marginBottom: '6px' }}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Breathing Guide Ribbon (Always visible to guide oxygen rhythm) */}
      <div style={{
        marginTop: '10px',
        padding: '8px 12px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'rgba(14, 165, 233, 0.08)',
        border: '1px solid rgba(14, 165, 233, 0.25)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.78rem',
        color: 'var(--color-text-primary)',
        lineHeight: 1.4
      }}>
        <Wind size={16} style={{ color: '#0EA5E9', flexShrink: 0 }} />
        <div>
          <strong style={{ color: '#0284C7' }}>Nhịp thở đồng điệu:</strong> {meta.breathingCue}
        </div>
      </div>
    </div>
  );
};

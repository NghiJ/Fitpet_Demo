/**
 * Danh mục bài tập vận động nhẹ nhàng không cần dụng cụ cho FitPet
 * Được thiết kế đặc biệt cho dân văn phòng ngồi nhiều và người mới bắt đầu.
 */

export const PAIN_AREAS = [
  {
    id: 'neck-shoulder',
    name: 'Cổ & Vai Gáy',
    icon: '💆',
    badgeText: 'Giải tỏa mỏi gáy',
    keywords: ['cổ', 'vai', 'gáy', 'mỏi cổ', 'đau vai', 'đau cổ', 'căng vai', 'cổ gáy', 'cúi nhiều', 'mỏi vai gáy'],
    recommendedWorkoutId: 'desk-break-3min',
    description: 'Giải phóng co thắt cơ thang và áp lực đốt sống cổ do cúi nhìn màn hình máy tính lâu.'
  },
  {
    id: 'lower-back',
    name: 'Thắt Lưng & Cột Sống',
    icon: '🪑',
    badgeText: 'Thả lỏng thắt lưng',
    keywords: ['lưng', 'thắt lưng', 'cột sống', 'đau lưng', 'mỏi lưng', 'gù lưng', 'ngồi cong lưng', 'ê lưng'],
    recommendedWorkoutId: 'lower-back-relief',
    description: 'Giảm tải áp lực nén lên đĩa đệm và thắt lưng dưới do ngồi ghế liên tục.'
  },
  {
    id: 'wrist-hand',
    name: 'Cổ Tay & Cẳng Tay',
    icon: '⌨️',
    badgeText: 'Thư giãn gõ phím',
    keywords: ['cổ tay', 'cẳng tay', 'bàn tay', 'ngón tay', 'chuột', 'gõ phím', 'mỏi tay', 'tê tay', 'ống cổ tay'],
    recommendedWorkoutId: 'wrist-hand-relief',
    description: 'Kéo dãn gân gấp duỗi cẳng tay, phòng ngừa căng tức khớp cổ tay do cầm chuột máy tính.'
  },
  {
    id: 'hip-legs',
    name: 'Khớp Hông & Tê Mỏi Chân',
    icon: '🧘',
    badgeText: 'Lưu thông đôi chân',
    keywords: ['hông', 'khớp hông', 'chân', 'tê chân', 'mỏi chân', 'đùi', 'bắp chân', 'khớp gối', 'ngồi tê mông'],
    recommendedWorkoutId: 'hip-glute-relief',
    description: 'Đánh thức cơ mông và kéo dãn cơ gấp hông bị co rút sau nhiều giờ ngồi làm việc.'
  },
  {
    id: 'full-body',
    name: 'Toàn Thân Uể Oải',
    icon: '⚡',
    badgeText: 'Lấy lại tỉnh táo',
    keywords: ['toàn thân', 'mệt mỏi', 'buồn ngủ', 'uể oải', 'mệt', 'thiếu năng lượng', 'căng thẳng', 'đau đầu', 'stress'],
    recommendedWorkoutId: 'quick-2min-refresh',
    description: 'Kích thích oxy lên não và tuần hoàn máu toàn thân chỉ trong 2-3 phút.'
  }
];

export const CURATED_WORKOUTS = [
  {
    id: 'desk-break-3min',
    title: 'Giải Tỏa Cổ Vai Gáy',
    tagline: 'Xua tan mỏi mệt sau nhiều giờ ngồi làm việc',
    category: 'Cổ & Vai Gáy',
    durationMinutes: 3,
    difficulty: 'Nhẹ nhàng',
    targetDiscomfort: ['Cổ', 'Vai', 'Gáy'],
    isRecommended: true,
    description: 'Bài tập 3 phút giải phóng áp lực vùng vai, cổ và thắt lưng ngay tại bàn làm việc mà không cần thay trang phục hay chuẩn bị dụng cụ.',
    exercises: [
      {
        id: 'shoulder-rolls',
        name: 'Xoay Vai & Mở Rộng Lồng Ngực',
        durationSec: 40,
        targetArea: 'Cổ & Vai Gáy',
        instruction: 'Thả lỏng 2 tay. Nhẹ nhàng xoay tròn 2 bờ vai hướng lên trên về phía tai, rồi mở rộng ra sau và trượt nhẹ xuống dưới. Hít vào khi vai nâng lên, thở ra khi hạ xuống.',
        formTips: [
          'Giữ cằm song song với mặt đất, không ngửa cổ quá mức',
          'Thả lỏng cánh tay tự nhiên hai bên hông',
          'Đổi chiều xoay sau 20 giây nếu cảm thấy dễ chịu'
        ],
        easierVariant: 'Thực hiện vòng xoay nhỏ hơn, chậm rãi khi đang ngồi tựa lưng trên ghế.',
        replacementExercise: {
          id: 'gentle-neck-tilt',
          name: 'Nghiêng Cổ Kéo Dãn Nhẹ',
          instruction: 'Nhẹ nhàng nghiêng tai phải về phía vai phải trong 15 giây, sau đó đổi sang trái. Giữ hai vai thả lỏng.'
        },
        voiceCue: 'Xoay tròn bờ vai nhẹ nhàng lên, ra sau và hạ xuống. Hít thở sâu và thư giãn cổ nhé.',
        illustrationType: 'shoulder_roll'
      },
      {
        id: 'torso-twist',
        name: 'Vặn Thân Mình Nhịp Nhàng',
        durationSec: 45,
        targetArea: 'Cột Sống & Lưng Giữa',
        instruction: 'Đặt hai tay lên hông hoặc đan nhẹ trước ngực. Từ từ xoay thân trên sang phải, dừng lại 1 nhịp, sau đó xoay nhẹ nhàng sang trái.',
        formTips: [
          'Chỉ xoay trong biên độ dễ chịu, không gượng ép',
          'Giữ hông cố định hướng về phía trước',
          'Thở đều đặn theo từng nhịp xoay'
        ],
        easierVariant: 'Ngồi thẳng trên ghế và xoay nhẹ 20-30 độ mỗi bên.',
        replacementExercise: {
          id: 'seated-side-reach',
          name: 'Nghiêng Lườn Thư Giãn',
          instruction: 'Vươn một tay qua đầu và hơi nghiêng người sang một bên, hít sâu vào lồng ngực.'
        },
        voiceCue: 'Xoay người nhịp nhàng sang phải, trở về giữa rồi sang trái. Giữ lưng thẳng tự nhiên.',
        illustrationType: 'torso_twist'
      },
      {
        id: 'hip-hinge',
        name: 'Gập Hông Vươn Tay (Hip Hinge)',
        durationSec: 45,
        targetArea: 'Hông & Cơ Đùi Sau',
        instruction: 'Đứng thẳng, chân rộng bằng hông. Hơi chùng gối, đẩy hông ra phía sau và hạ thân trên xuống sao cho lưng vẫn thẳng, sau đó đứng thẳng dậy.',
        formTips: [
          'Tưởng tượng đang dùng mông đóng cửa xe phía sau',
          'Giữ lưng thẳng, không gù lưng',
          'Siết nhẹ cơ mông khi đứng thẳng trở lại'
        ],
        easierVariant: 'Đặt tay lên bàn làm việc hoặc thành ghế để giữ thăng bằng và chỉ gập hông nhẹ.',
        replacementExercise: {
          id: 'seated-knee-hug',
          name: 'Ôm Gối Thư Giãn Khớp Hông',
          instruction: 'Ngồi trên ghế, nâng một đầu gối và ôm nhẹ về phía ngực trong 20 giây, sau đó đổi chân.'
        },
        voiceCue: 'Đẩy nhẹ hông ra sau, giữ lưng thẳng, rồi đứng thẳng dậy một cách thoải mái.',
        illustrationType: 'hip_hinge'
      },
      {
        id: 'wrist-neck-release',
        name: 'Sóng Cổ Tay & Thả Lỏng Cơ Mặt',
        durationSec: 40,
        targetArea: 'Cẳng Tay & Khớp Cổ',
        instruction: 'Đan các ngón tay vào nhau và xoay nhẹ khớp cổ tay theo hình lượn sóng. Sau đó hạ tay xuống, thả lỏng quai hàm và hít một hơi thật sâu.',
        formTips: [
          'Xoay khớp cổ tay êm ái, không bẻ giật mạnh',
          'Thả lỏng quai hàm và cơ mặt',
          'Hít vào bằng mũi và thở ra chậm rãi bằng miệng'
        ],
        easierVariant: 'Mở và nắm nhẹ các đầu ngón tay mà không cần đan tay.',
        replacementExercise: {
          id: 'deep-breath-shake',
          name: 'Vung Vẩy Cánh Tay & Thở Sâu',
          instruction: 'Hít sâu bằng bụng và thả lỏng vung nhẹ hai bàn tay để xua tan mỏi mệt.'
        },
        voiceCue: 'Xoay nhẹ cổ tay, thả lỏng quai hàm và hít một hơi thật sảng khoái nào.',
        illustrationType: 'wrist_neck'
      }
    ]
  },
  {
    id: 'lower-back-relief',
    title: 'Giải Áp Lực Thắt Lưng',
    tagline: 'Phục hồi đường cong tự nhiên và giảm mỏi lưng dưới',
    category: 'Thắt Lưng & Cột Sống',
    durationMinutes: 4,
    difficulty: 'Cực kỳ nhẹ nhàng',
    targetDiscomfort: ['Thắt lưng', 'Lưng dưới', 'Cột sống'],
    isRecommended: false,
    description: 'Chuyên biệt cho tình trạng ê mỏi thắt lưng do ngồi ghế văn phòng lâu ngày. Giúp giải phóng sự chèn ép đĩa đệm một cách an toàn.',
    exercises: [
      {
        id: 'seated-cat-cow',
        name: 'Uốn Cong Cột Sống Mèo - Bò Ngồi Ghế',
        durationSec: 50,
        targetArea: 'Thắt Lưng & Cột Sống',
        instruction: 'Ngồi thẳng trên ghế, tay đặt lên đùi. Hít vào: ưỡn nhẹ ngực về phía trước và nhìn lên trần; Thở ra: cuộn tròn lưng ra sau, cúi đầu thả lỏng cổ.',
        formTips: [
          'Chuyển động mượt mà như một làn sóng',
          'Không ép cơ thể gập quá mức',
          'Hít thở sâu nhịp nhàng cùng chuyển động'
        ],
        easierVariant: 'Thực hiện với biên độ nhỏ hơn, chỉ gập nhẹ cổ và lưng trên.',
        replacementExercise: {
          id: 'seated-pelvic-tilt',
          name: 'Nhịp Xương Chậu Ngồi Ghế',
          instruction: 'Cuộn nhẹ xương cụt về phía trước rồi trả về trung tính.'
        },
        voiceCue: 'Hít vào mở ngực, thở ra cuộn tròn lưng thả lỏng. Cảm nhận từng đốt sống được thư giãn.',
        illustrationType: 'torso_twist'
      },
      {
        id: 'standing-back-extension',
        name: 'Đứng Đặt Tay Hông Ngả Sau Nhẹ',
        durationSec: 45,
        targetArea: 'Thắt Lưng Dưới',
        instruction: 'Đứng thẳng, đặt hai lòng bàn tay vào vùng thắt lưng sau hông. Hơi chùng gối và ngả nhẹ thân trên ra sau 10-15 độ để kéo dãn cơ bụng và thắt lưng.',
        formTips: [
          'Dùng hai tay trợ lực đỡ thắt lưng',
          'Không ngửa đầu quá sâu làm chóng mặt',
          'Giữ nhịp thở đều, không nín thở'
        ],
        easierVariant: 'Chỉ đứng thẳng và vươn hai tay lên cao hít thở sâu.',
        replacementExercise: {
          id: 'wall-support-hinge',
          name: 'Tựa Tường Thả Lỏng Lưng',
          instruction: 'Tựa lưng vào tường và chùng nhẹ gối thư giãn.'
        },
        voiceCue: 'Đặt tay lên hông, ngả nhẹ người ra sau mở rộng lồng ngực. Rất thoải mái.',
        illustrationType: 'hip_hinge'
      },
      {
        id: 'seated-side-bend',
        name: 'Nghiêng Lườn Mở Rộng Cơ Vuông Thắt Lưng',
        durationSec: 50,
        targetArea: 'Cơ Vuông Thắt Lưng (QL)',
        instruction: 'Ngồi vững trên ghế. Vươn tay phải lên cao và nghiêng người nhẹ nhàng sang trái trong 25 giây, sau đó đổi sang bên còn lại.',
        formTips: [
          'Giữ hai mông cố định trên mặt ghế',
          'Cảm nhận sự kéo dãn dịu êm dọc mạn sườn xuống hông',
          'Hít thở sâu vào bên lườn đang kéo dãn'
        ],
        easierVariant: 'Đặt tay lên đùi và chỉ nghiêng nhẹ đầu và vai sang một bên.',
        replacementExercise: {
          id: 'gentle-torso-sway',
          name: 'Đung Đưa Thân Mình',
          instruction: 'Ngồi đung đưa nhẹ thân mình qua lại như con lắc đồng hồ.'
        },
        voiceCue: 'Vươn tay cao và nghiêng nhẹ người, giải tỏa mọi sự căng cứng ở vùng thắt lưng.',
        illustrationType: 'side_reach'
      },
      {
        id: 'seated-knee-hug-hold',
        name: 'Ôm Gối Nhẹ Giải Tỏa Khớp Cùng Chậu',
        durationSec: 45,
        targetArea: 'Khớp Cùng Chậu & Lưng Dưới',
        instruction: 'Ngồi tựa lưng vào ghế. Nâng đầu gối phải lên và đan hai tay ôm nhẹ trước cẳng chân trong 20 giây, sau đó đổi sang chân trái.',
        formTips: [
          'Giữ lưng áp sát lưng ghế',
          'Thả lỏng bàn chân và cổ chân',
          'Thở ra êm ái khi kéo nhẹ gối về phía người'
        ],
        easierVariant: 'Dùng khăn hoặc hai tay đỡ dưới đùi thay vì ôm cẳng chân.',
        replacementExercise: {
          id: 'ankle-pump',
          name: 'Nhịp Cổ Chân Ngồi Ghế',
          instruction: 'Nhịp gót và mũi chân lên xuống để tăng tuần hoàn.'
        },
        voiceCue: 'Ôm nhẹ gối về phía ngực, cảm nhận vùng lưng dưới được kéo dãn êm dịu.',
        illustrationType: 'hip_hinge'
      }
    ]
  },
  {
    id: 'wrist-hand-relief',
    title: 'Thư Giãn Cổ Tay & Chuột Máy Tính',
    tagline: 'Phòng ngừa hội chứng ống cổ tay cho người gõ phím',
    category: 'Cổ Tay & Ngón Tay',
    durationMinutes: 3,
    difficulty: 'Nhẹ nhàng',
    targetDiscomfort: ['Cổ tay', 'Bàn tay', 'Ngón tay', 'Cẳng tay'],
    isRecommended: false,
    description: 'Chuyên sâu giải tỏa áp lực dây thần kinh giữa và gân cẳng tay do dùng chuột và bàn phím máy tính hàng giờ.',
    exercises: [
      {
        id: 'wrist-extensor-stretch',
        name: 'Kéo Dãn Cơ Duỗi Cổ Tay (Hướng Xuống)',
        durationSec: 45,
        targetArea: 'Cẳng Tay & Cổ Tay Ngoài',
        instruction: 'Duỗi thẳng tay phải ra trước với lòng bàn tay hướng về mình, mũi tay chỉ xuống đất. Dùng tay trái ép nhẹ mu bàn tay phải về phía người trong 20 giây, sau đó đổi bên.',
        formTips: [
          'Khuỷu tay duỗi thẳng nhẹ, không gồng cứng',
          'Chỉ ép nhẹ tới khi thấy căng tức dễ chịu',
          'Thả lỏng các ngón tay'
        ],
        easierVariant: 'Gập nhẹ khuỷu tay lại để giảm độ căng.',
        replacementExercise: {
          id: 'finger-spreads',
          name: 'Xòe Nắm Ngón Tay Nhịp Nhàng',
          instruction: 'Xòe rộng các ngón tay rồi nắm nhẹ thành nắm đấm, lặp lại chậm rãi.'
        },
        voiceCue: 'Kéo nhẹ mu bàn tay về phía người, cảm nhận cẳng tay ngoài được thư giãn.',
        illustrationType: 'wrist_neck'
      },
      {
        id: 'wrist-flexor-stretch',
        name: 'Kéo Dãn Cơ Gập Cổ Tay (Hướng Lên)',
        durationSec: 45,
        targetArea: 'Cẳng Tay & Ống Cổ Tay',
        instruction: 'Duỗi thẳng tay ra trước như đang ra hiệu "dừng lại" (lòng bàn tay hướng ra ngoài, mũi tay chỉ lên trời). Dùng tay kia kéo nhẹ các ngón tay về phía người, 20 giây mỗi bên.',
        formTips: [
          'Không giật mạnh ngón tay cái',
          'Giữ bả vai thả lỏng cách xa tai',
          'Hít thở đều đặn'
        ],
        easierVariant: 'Chỉ kéo nhẹ 4 ngón tay chính, không kéo ngón cái.',
        replacementExercise: {
          id: 'wrist-circles',
          name: 'Xoay Tròn Khớp Cổ Tay',
          instruction: 'Xoay tròn hai khớp cổ tay êm ái theo hai chiều.'
        },
        voiceCue: 'Kéo nhẹ các ngón tay về sau, mở rộng đường ống cổ tay giúp giải tỏa tê mỏi.',
        illustrationType: 'wrist_neck'
      },
      {
        id: 'finger-piano-wave',
        name: 'Lượn Sóng Ngón Tay & Lắc Nhẹ Cẳng Tay',
        durationSec: 45,
        targetArea: 'Gân Ngón Tay & Bàn Tay',
        instruction: 'Đan các ngón tay lượn sóng nhịp nhàng, sau đó tách tay ra và lắc nhẹ hai cổ tay như đang vẩy những giọt nước.',
        formTips: [
          'Thả lỏng hoàn toàn cơ bắp từ khuỷu tay xuống ngón tay',
          'Lắc với biên độ vừa phải, không giật cục',
          'Cảm nhận sự ấm áp và dòng máu lưu thông trở lại các đầu ngón tay'
        ],
        easierVariant: 'Chỉ mở xòe và khép các ngón tay trên đùi.',
        replacementExercise: {
          id: 'palm-press',
          name: 'Chắp Tay Cầu Nguyện Ép Nhẹ',
          instruction: 'Chắp hai lòng bàn tay trước ngực và hạ nhẹ khuỷu tay xuống.'
        },
        voiceCue: 'Lắc nhẹ hai bàn tay như rũ nước. Mọi cảm giác tê cứng đang tan biến dần.',
        illustrationType: 'wrist_neck'
      }
    ]
  },
  {
    id: 'hip-glute-relief',
    title: 'Mở Khớp Hông & Giải Tê Mỏi Chân',
    tagline: 'Kích hoạt tuần hoàn máu sau nhiều giờ ngồi làm việc',
    category: 'Hông & Đôi Chân',
    durationMinutes: 4,
    difficulty: 'Nhẹ nhàng',
    targetDiscomfort: ['Khớp hông', 'Cơ mông', 'Tê chân', 'Đầu gối'],
    isRecommended: false,
    description: 'Chống ứ trệ tuần hoàn tĩnh mạch chi dưới, mở rộng khớp hông và kéo dãn cơ hình lê giúp giảm cảm giác tê bì mông chân khi ngồi lâu.',
    exercises: [
      {
        id: 'seated-figure-four',
        name: 'Kéo Dãn Cơ Mông Hình Số 4 Ngồi Ghế',
        durationSec: 50,
        targetArea: 'Cơ Mông & Khớp Hông Ngoài',
        instruction: 'Ngồi thẳng trên ghế. Đặt mắt cá chân phải lên đầu gối trái tạo thành hình số 4. Giữ lưng thẳng, hơi nghiêng người về phía trước cho đến khi thấy cơ mông căng nhẹ. Giữ 25s rồi đổi chân.',
        formTips: [
          'Không gù lưng khi nghiêng người',
          'Chỉ nghiêng trong tầm không thấy đau khớp gối',
          'Bàn chân tựa giữ vuông góc nhẹ để bảo vệ sụn gối'
        ],
        easierVariant: 'Bắt chéo chân ở mắt cá chân thay vì gác lên đầu gối.',
        replacementExercise: {
          id: 'seated-hip-sway',
          name: 'Nhấc Mông Luân Phiên Ngồi Ghế',
          instruction: 'Lần lượt nhấc nhẹ mông trái rồi mông phải lên khỏi mặt ghế.'
        },
        voiceCue: 'Gác chân số 4 và hơi rướn nhẹ người tới trước. Cảm nhận cơ mông được thư giãn tối đa.',
        illustrationType: 'hip_hinge'
      },
      {
        id: 'standing-hip-circles',
        name: 'Đứng Vịn Bàn Xoay Khớp Hông Nhịp Nhàng',
        durationSec: 45,
        targetArea: 'Khớp Hông & Khung Chậu',
        instruction: 'Đứng vịn một tay vào bàn làm việc. Chân đứng vững, vẽ các vòng tròn lớn nhịp nhàng bằng hông như đang lắc vòng chậm rãi. Đổi chiều sau 20 giây.',
        formTips: [
          'Đầu gối hơi chùng nhẹ và thả lỏng',
          'Vẽ vòng tròn êm ái, bôi trơn ổ khớp hông',
          'Thở đều theo từng vòng quay'
        ],
        easierVariant: 'Chỉ lắc hông nhẹ nhàng sang trái và sang phải.',
        replacementExercise: {
          id: 'marching-low',
          name: 'Nhấc Gối Nhẹ Tại Chỗ',
          instruction: 'Đứng tại chỗ nhấc nhẹ gối từng bên.'
        },
        voiceCue: 'Xoay tròn hông chậm rãi, bôi trơn dịch khớp và đánh thức các nhóm cơ quanh hông.',
        illustrationType: 'torso_twist'
      },
      {
        id: 'calf-pump-circulation',
        name: 'Nhón Gót Kích Hoạt Tuần Hoàn Chi Dưới',
        durationSec: 50,
        targetArea: 'Bắp Chân & Tĩnh Mạch Chân',
        instruction: 'Đứng vịn bàn làm việc. Nhón cao gót chân giữ 1 giây, hạ xuống rồi nhấc nhẹ mũi chân lên. Chuyển động nhịp nhàng như bập bênh để bơm máu về tim.',
        formTips: [
          'Cảm nhận cơ bắp chân co bóp nhịp nhàng',
          'Giúp xua tan cảm giác nặng nề và sưng phù mắt cá chân',
          'Thực hiện đều đặn theo nhịp thở'
        ],
        easierVariant: 'Thực hiện nhón gót và nhấc mũi chân khi đang ngồi trên ghế.',
        replacementExercise: {
          id: 'seated-foot-taps',
          name: 'Nhịp Mũi Chân Ngồi Ghế',
          instruction: 'Nhịp mũi chân đều đặn như đang nghe một bản nhạc vui tươi.'
        },
        voiceCue: 'Nhón gót rồi nhấc mũi chân nhịp nhàng, bơm tuần hoàn máu tươi mới trở lại đôi chân.',
        illustrationType: 'calf_raise'
      }
    ]
  },
  {
    id: 'morning-wake-5min',
    title: 'Đánh Thức Năng Lượng',
    tagline: 'Kích hoạt cơ thể tràn đầy sức sống không đổ mồ hôi',
    category: 'Toàn Thân',
    durationMinutes: 5,
    difficulty: 'Dễ chịu',
    targetDiscomfort: ['Toàn thân', 'Buồn ngủ', 'Căng thẳng'],
    isRecommended: false,
    description: 'Các chuyển động kích thích tuần hoàn máu, bôi trơn khớp xương và xua tan cơn buồn ngủ mà không làm bạn mệt mỏi.',
    exercises: [
      {
        id: 'arm-sweeps',
        name: 'Vươn Tay Qua Đầu & Hít Thở Sâu',
        durationSec: 45,
        targetArea: 'Vai & Cơ Hoành',
        instruction: 'Hít vào thật sâu khi hai tay vươn rộng sang hai bên và lên cao qua đầu; thở ra từ từ khi hạ tay xuống cạnh hông.',
        formTips: [
          'Chuyển động nhịp nhàng theo hơi thở của bạn',
          'Vươn tay trong tầm với thoải mái nhất',
          'Đầu gối giữ mềm, không khóa khớp'
        ],
        easierVariant: 'Ngồi trên ghế và chỉ vươn tay lên ngang tầm ngực.',
        replacementExercise: {
          id: 'shoulder-shrugs',
          name: 'Nhún Vai Kèm Hơi Thở',
          instruction: 'Nhún hai vai lên tai khi hít vào, thả rơi êm ái khi thở ra.'
        },
        voiceCue: 'Hít vào khi hai tay vươn cao, thở ra khi hạ tay xuống nhẹ nhàng.',
        illustrationType: 'arm_sweep'
      },
      {
        id: 'march-in-place',
        name: 'Bước Đi Tại Chỗ Nhịp Nhàng',
        durationSec: 50,
        targetArea: 'Tuần Hoàn & Đôi Chân',
        instruction: 'Đứng thẳng và bước nhịp nhàng tại chỗ, nâng nhẹ đầu gối cách mặt sàn vài centimet kèm vung tay tự nhiên.',
        formTips: [
          'Tiếp đất êm ái bằng nửa bàn chân trước',
          'Giữ tư thế người ngay ngắn',
          'Hít thở tự nhiên qua mũi'
        ],
        easierVariant: 'Bước chân nhẹ nhàng trong khi vịn tay vào thành ghế chắc chắn.',
        replacementExercise: {
          id: 'seated-toe-taps',
          name: 'Nhịp Mũi Chân Ngồi Ghế',
          instruction: 'Ngồi thoải mái trên ghế và lần lượt nhịp mũi chân về phía trước.'
        },
        voiceCue: 'Bước chân nhẹ nhàng theo nhịp điệu. Đánh thức tuần hoàn máu khắp cơ thể.',
        illustrationType: 'march_place'
      },
      {
        id: 'wall-push',
        name: 'Chống Đẩy Vào Tường Nhẹ Nhàng',
        durationSec: 50,
        targetArea: 'Ngực & Cánh Tay',
        instruction: 'Đặt hai lòng bàn tay lên tường ngang tầm vai. Lùi chân ra sau một bước, gập khuỷu tay đưa ngực về phía tường, rồi đẩy nhẹ về vị trí cũ.',
        formTips: [
          'Thân người giữ trên một đường thẳng tự nhiên',
          'Khuỷu tay mở góc 45 độ so với thân',
          'Không gồng cứng cổ'
        ],
        easierVariant: 'Đứng gần tường hơn để giảm tải trọng.',
        replacementExercise: {
          id: 'chest-expansion',
          name: 'Kéo Dãn Lồng Ngực',
          instruction: 'Vòng hai tay ra sau hông, khép nhẹ hai bả vai để mở rộng ngực.'
        },
        voiceCue: 'Gập nhẹ khuỷu tay về phía tường, rồi đẩy về vị trí cũ. Nhịp thở đều đặn.',
        illustrationType: 'wall_push'
      },
      {
        id: 'chair-squats',
        name: 'Đứng Lên Ngồi Xuống Ghế (Chair Squats)',
        durationSec: 50,
        targetArea: 'Cơ Đùi & Thăng Bằng',
        instruction: 'Đứng ngay trước ghế. Hạ hông xuống chạm nhẹ mặt ghế (hoặc ngồi xuống nghỉ 1 giây), rồi nhấn gót chân đứng thẳng dậy.',
        formTips: [
          'Đầu gối hướng thẳng theo hướng ngón chân',
          'Ngực mở và mắt nhìn về phía trước',
          'Có thể vịn tay vịn ghế nếu cần hỗ trợ'
        ],
        easierVariant: 'Ngồi hẳn xuống ghế, hít một hơi rồi dùng tay hỗ trợ đứng lên.',
        replacementExercise: {
          id: 'glute-squeezes',
          name: 'Siết Cơ Mông Đứng Thẳng',
          instruction: 'Đứng thẳng và siết nhẹ cơ mông trong 3 giây, sau đó thả lỏng.'
        },
        voiceCue: 'Hạ nhẹ hông về phía ghế, rồi nhấn chân đứng thẳng dậy thật tự tin.',
        illustrationType: 'chair_squat'
      },
      {
        id: 'calf-raises',
        name: 'Nhón Gót & Cân Bằng Cột Sống',
        durationSec: 45,
        targetArea: 'Bắp Chân & Cổ Chân',
        instruction: 'Nhón cao hai gót chân đứng trên mũi chân, giữ 1 giây rồi hạ gót xuống mặt sàn có kiểm soát.',
        formTips: [
          'Chạm nhẹ vào tường hoặc bàn làm việc nếu cần giữ thăng bằng',
          'Trọng lượng chia đều các ngón chân',
          'Không khóa cứng khớp gối'
        ],
        easierVariant: 'Ngồi trên ghế và thực hiện nhón gót chân lên xuống.',
        replacementExercise: {
          id: 'ankle-circles',
          name: 'Xoay Tròn Cổ Chân Ngồi Ghế',
          instruction: 'Nâng nhẹ một chân và vẽ vòng tròn bằng mũi chân, 15 giây mỗi bên.'
        },
        voiceCue: 'Nhón chân lên cao, giữ một nhịp rồi hạ xuống nhẹ nhàng.',
        illustrationType: 'calf_raise'
      }
    ]
  },
  {
    id: 'quick-2min-refresh',
    title: 'Thư Giãn Cấp Tốc 2 Phút',
    tagline: 'Lấy lại năng lượng ngay giữa 2 cuộc họp',
    category: 'Nạp năng lượng nhanh',
    durationMinutes: 2,
    difficulty: 'Cực kỳ nhẹ nhàng',
    targetDiscomfort: ['Căng thẳng', 'Uể oải', 'Đầu óc'],
    isRecommended: false,
    description: 'Dành riêng cho những lúc lịch làm việc bận rộn. Hai động tác đơn giản giúp đầu óc tỉnh táo ngay lập tức.',
    exercises: [
      {
        id: 'boxer-step',
        name: 'Nhún Chân Nhịp Nhàng & Vung Tay',
        durationSec: 60,
        targetArea: 'Tuần Hoàn Toàn Thân',
        instruction: 'Chuyển trọng lượng nhẹ nhàng từ chân này sang chân kia theo nhịp điệu thư giãn, hai tay vung thả lỏng tự nhiên.',
        formTips: [
          'Đầu gối mềm mại, thả lỏng',
          'Thở êm và buông bỏ mọi căng thẳng trên cơ bắp',
          'Tận hưởng nhịp điệu đơn giản'
        ],
        easierVariant: 'Đứng yên và chỉ vung nhẹ hai tay thư giãn.',
        replacementExercise: {
          id: 'seated-torso-sway',
          name: 'Đung Đưa Thân Mình Ngồi Ghế',
          instruction: 'Ngồi trên ghế và đung đưa nhẹ nhàng thân trên từ bên này sang bên kia.'
        },
        voiceCue: 'Nhún chân nhịp nhàng, vung tay thoải mái. Giúp cơ thể rũ bỏ sự trì trệ.',
        illustrationType: 'side_step'
      },
      {
        id: 'deep-reset-breath',
        name: 'Rũ Bỏ Căng Thẳng & Thở Phù',
        durationSec: 60,
        targetArea: 'Hệ Thần Kinh & Cơ Bắp',
        instruction: 'Vung vẩy nhẹ nhàng các ngón tay, cánh tay và vai. Hít ba hơi thở thật sâu bằng bụng, rồi thở ra bằng một tiếng thở phào sảng khoái.',
        formTips: [
          'Thả rơi hoàn toàn hai vai sau mỗi lần thở ra',
          'Thả lỏng hàm răng và vùng trán',
          'Cảm nhận sự bình an và tươi mới'
        ],
        easierVariant: 'Nhắm mắt ngồi trên ghế và hít thở sâu 4 nhịp với hai tay đặt trên đùi.',
        replacementExercise: {
          id: 'temple-massage',
          name: 'Mát-xa Thái Dương Thư Giãn',
          instruction: 'Dùng đầu ngón tay xoa nhẹ hai bên thái dương theo vòng tròn chậm rãi.'
        },
        voiceCue: 'Rũ nhẹ hai bàn tay và bờ vai. Hít một hơi thật sâu và thở phào nhẹ nhõm.',
        illustrationType: 'shake_out'
      }
    ]
  }
];

/**
 * Tìm bài tập theo vùng đau hoặc từ khóa người dùng nhập vào
 */
export function findWorkoutsByPainQuery(inputQuery) {
  if (!inputQuery || !inputQuery.trim()) {
    return null;
  }

  const query = inputQuery.toLowerCase().trim();

  // 1. Tìm theo pain area ID hoặc keywords
  const matchedArea = PAIN_AREAS.find(area => {
    if (area.id.toLowerCase() === query) return true;
    if (area.name.toLowerCase().includes(query)) return true;
    return area.keywords.some(kw => query.includes(kw) || kw.includes(query));
  });

  if (matchedArea) {
    const workout = CURATED_WORKOUTS.find(w => w.id === matchedArea.recommendedWorkoutId);
    return {
      area: matchedArea,
      workout: workout || CURATED_WORKOUTS[0]
    };
  }

  // 2. Tìm theo bài tập title, targetArea, hoặc exercise name
  const matchedWorkout = CURATED_WORKOUTS.find(w => {
    if (w.title.toLowerCase().includes(query)) return true;
    if (w.category.toLowerCase().includes(query)) return true;
    if (w.targetDiscomfort && w.targetDiscomfort.some(td => td.toLowerCase().includes(query))) return true;
    return w.exercises.some(ex => 
      ex.name.toLowerCase().includes(query) || 
      ex.targetArea.toLowerCase().includes(query)
    );
  });

  if (matchedWorkout) {
    return {
      area: {
        id: 'custom-match',
        name: `Giải tỏa vùng ${inputQuery}`,
        icon: '🎯',
        badgeText: 'Đề xuất tùy chọn',
        description: `Bài tập phù hợp nhất với nhu cầu giải tỏa mệt mỏi ở vùng "${inputQuery}".`
      },
      workout: matchedWorkout
    };
  }

  // Mặc định trả về bài desk break nếu không tìm thấy
  return {
    area: {
      id: 'default',
      name: 'Giải tỏa cơ bản',
      icon: '🌿',
      badgeText: 'Phổ biến nhất',
      description: 'Bài tập 3 phút cân bằng toàn diện cho cơ thể khi làm việc văn phòng.'
    },
    workout: CURATED_WORKOUTS[0]
  };
}

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, SkipForward, Volume2, VolumeX, 
  X, Check, ChevronLeft, ShieldCheck, Heart, Sparkles,
  Camera, CameraOff, AlertCircle, Clock, RotateCcw
} from 'lucide-react';
import { ExerciseIllustration } from './ExerciseIllustration';
import { CameraPoseDetector } from './CameraPoseDetector';
import { VirtualPet } from '../../pet/components/VirtualPet';
import { speechCompanion } from '../../ai-coach/services/speechCompanion';
import { soundService } from '../services/soundService';

export const WorkoutPlayer = ({ workout, onFinish, onCancel }) => {
  const [isPreparing, setIsPreparing] = useState(true);
  const [prepCount, setPrepCount] = useState(3);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [exercisesList, setExercisesList] = useState(workout.exercises);
  const [timeLeft, setTimeLeft] = useState(workout.exercises[0].durationSec);
  const [isPaused, setIsPaused] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(10);
  const [isVoiceMuted, setIsVoiceMuted] = useState(speechCompanion.isMuted);

  // Camera Motion Recognition State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraFeedback, setCameraFeedback] = useState(null);
  const [cameraReps, setCameraReps] = useState(0);

  // Performance log
  const sessionLogRef = useRef({
    workoutId: workout.id,
    workoutTitle: workout.title,
    startTime: Date.now(),
    completedExercises: [],
    skippedExercises: [],
    totalSecondsMoved: 0,
    cameraRepsCount: 0,
    usedCamera: false,
    restSeconds: 20
  });

  const currentExercise = exercisesList[exerciseIndex] || exercisesList[0];
  const totalExercises = exercisesList.length;

  // Speak voice cue when exercise changes
  useEffect(() => {
    if (isPreparing) return;
    if (!currentExercise) return;
    setTimeLeft(currentExercise.durationSec);

    if (!isVoiceMuted && !isResting) {
      speechCompanion.speak(currentExercise.voiceCue || currentExercise.instruction, true);
    }

    return () => {
      speechCompanion.stop();
    };
  }, [exerciseIndex, isResting, isPreparing]);

  // Main countdown timer
  useEffect(() => {
    if (isPreparing) return;
    if (isPaused) return;

    if (isResting) {
      if (restTimeLeft <= 0) {
        setIsResting(false);
        setRestTimeLeft(10);
        speechCompanion.speak('Hết thời gian nghỉ ngơi. Cùng bắt đầu động tác tiếp theo nào!', true);
        return;
      }
      const restTimer = setInterval(() => {
        setRestTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(restTimer);
    }

    if (timeLeft <= 0) {
      // Completed this exercise
      sessionLogRef.current.completedExercises.push(currentExercise.id);
      sessionLogRef.current.totalSecondsMoved += currentExercise.durationSec;

      if (exerciseIndex + 1 < totalExercises) {
        setExerciseIndex((prev) => prev + 1);
        setIsResting(true);
        setRestTimeLeft(10);
        soundService.playTone(659.25, 'sine', 0.25);
      } else {
        // Finished workout!
        finishWorkout(true);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
      sessionLogRef.current.totalSecondsMoved += 1;
    }, 1000);

    return () => clearInterval(timer);
  }, [isPreparing, isPaused, isResting, restTimeLeft, timeLeft, exerciseIndex]);

  const handleSkipExercise = () => {
    soundService.playTone(330, 'sine', 0.1);
    sessionLogRef.current.skippedExercises.push(currentExercise.id);
    if (exerciseIndex + 1 < totalExercises) {
      setExerciseIndex((prev) => prev + 1);
      setIsResting(true);
      setRestTimeLeft(10);
    } else {
      finishWorkout(sessionLogRef.current.completedExercises.length > 0);
    }
  };

  const handleSkipRest = () => {
    soundService.playTone(523.25, 'sine', 0.15);
    setIsResting(false);
    setRestTimeLeft(10);
  };

  const handleAddRestTime = () => {
    soundService.playTone(440, 'sine', 0.1);
    setRestTimeLeft((prev) => prev + 30);
    sessionLogRef.current.restSeconds += 30;
  };

  const finishWorkout = (isFullCompletion = true) => {
    soundService.playVictory();
    const finalReport = {
      ...sessionLogRef.current,
      endTime: Date.now(),
      isFullCompletion,
      totalSecondsMoved: Math.max(180, sessionLogRef.current.totalSecondsMoved),
      completedExercises: sessionLogRef.current.completedExercises.length > 0 
        ? sessionLogRef.current.completedExercises 
        : exercisesList.map(e => e.id),
      workoutTitle: workout.title,
      xpEarned: workout.xpReward || 50,
      coinsEarned: workout.coinReward || 15,
      caloriesBurn: workout.caloriesBurn || 12.5,
      cameraRepsCount: cameraReps
    };
    onFinish(finalReport);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(Math.max(0, seconds) / 60);
    const secs = Math.max(0, seconds) % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // ================= 1. PRE-WORKOUT PREPARATION SCREEN (Image 2 screen 1) =================
  if (isPreparing) {
    return (
      <div style={{ width: '100%', paddingBottom: '30px' }}>
        {/* Header bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
          padding: '4px 0'
        }}>
          <button
            onClick={onCancel}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: '#133E35',
              fontWeight: 800,
              fontSize: '0.88rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <ChevronLeft size={20} />
            <span>Active Workout Session</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={onCancel}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(19, 62, 53, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={15} />
            </button>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              border: '2px solid #10B981',
              overflow: 'hidden'
            }}>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Avatar"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>

        {/* Sub-header Badges */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
          <span style={{
            backgroundColor: '#D1FAE5',
            color: '#065F46',
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)'
          }}>
            🌿 Thư giãn & tập trung
          </span>
          <span style={{
            backgroundColor: '#FEF3C7',
            color: '#92400E',
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)'
          }}>
            ⚡ CẤP ĐỘ: KHỞI ĐỘNG
          </span>
        </div>

        {/* Hero Media Card */}
        <div style={{
          position: 'relative',
          height: '170px',
          borderRadius: '20px',
          overflow: 'hidden',
          marginBottom: '14px',
          boxShadow: '0 4px 14px rgba(0,0,0,0.08)'
        }}>
          <img
            src={workout.imageUrl || "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80"}
            alt="Workout"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#059669'
          }}>
            <ShieldCheck size={16} />
          </div>
        </div>

        {/* Mochi Companion Card */}
        <div style={{
          backgroundColor: '#72D5C3',
          borderRadius: '18px',
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '14px'
        }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: '2px solid #FEF3C7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            overflow: 'hidden'
          }}>
            <VirtualPet species="mochi" size="sm" state="cheering" interactive={false} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 900, color: '#064E3B', marginBottom: '2px' }}>
              Mochi Bạn Đồng Hành ✨
            </div>
            <div style={{ fontSize: '0.78rem', color: '#133E35', fontWeight: 700, lineHeight: 1.35 }}>
              "Cùng Mochi dành {workout.durationMinutes} phút để thư giãn cổ, vai và lưng nhé! Hãy di chuyển chậm rãi và giữ cơ thể thật thoải mái."
            </div>
          </div>
        </div>

        {/* 4 Stat Chips (Peach #FEDFD2) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px',
          marginBottom: '16px'
        }}>
          <div className="card-peach" style={{ padding: '10px 12px' }}>
            <div style={{ fontSize: '1rem', fontWeight: 900, color: '#C2410C' }}>
              {workout.durationMinutes} phút
            </div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569' }}>
              Vận động
            </div>
          </div>

          <div className="card-peach" style={{ padding: '10px 12px' }}>
            <div style={{ fontSize: '1rem', fontWeight: 900, color: '#C2410C' }}>
              {workout.exercises.length} động tác
            </div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569' }}>
              Giãn cơ nhẹ
            </div>
          </div>

          <div className="card-peach" style={{ padding: '10px 12px' }}>
            <div style={{ fontSize: '1rem', fontWeight: 900, color: '#C2410C' }}>
              2 lần
            </div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569' }}>
              Nghỉ ngắn
            </div>
          </div>

          <div className="card-peach" style={{ padding: '10px 12px' }}>
            <div style={{ fontSize: '1rem', fontWeight: 900, color: '#C2410C' }}>
              0 món
            </div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569' }}>
              Không dụng cụ
            </div>
          </div>
        </div>

        {/* Circular Countdown Card (Mint #72D5C3) */}
        <div style={{
          backgroundColor: '#72D5C3',
          borderRadius: '22px',
          padding: '16px',
          textAlign: 'center',
          marginBottom: '16px',
          boxShadow: '0 6px 20px -3px rgba(114, 213, 195, 0.35)'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.72rem',
            fontWeight: 800,
            color: '#133E35',
            textTransform: 'uppercase',
            marginBottom: '10px'
          }}>
            <Clock size={13} />
            <span>Đếm ngược tự động</span>
          </div>

          {/* Circle */}
          <div style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: '4px solid #A7EDB8',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 10px auto',
            boxShadow: '0 4px 12px rgba(19, 62, 53, 0.1)'
          }}>
            <span style={{ fontSize: '1.65rem', fontWeight: 900, color: '#133E35', lineHeight: 1 }}>
              {prepCount}
            </span>
            <span style={{ fontSize: '0.64rem', fontWeight: 700, color: '#64748B' }}>
              giây
            </span>
          </div>

          <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#133E35', marginBottom: '2px' }}>
            Chuẩn bị vào động tác đầu tiên
          </div>
          <div style={{ fontSize: '0.78rem', color: '#133E35', opacity: 0.9, marginBottom: '10px' }}>
            Hít một hơi thật sâu... hạ lỏng hai vai nào!
          </div>

          <div style={{
            backgroundColor: '#FEDFD2',
            color: '#9A3412',
            fontSize: '0.76rem',
            fontWeight: 800,
            padding: '5px 14px',
            borderRadius: 'var(--radius-full)',
            display: 'inline-block'
          }}>
            ĐỘNG TÁC 1: {workout.exercises[0].name} ({workout.exercises[0].durationSec} giây)
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => {
              soundService.playTone(523.25, 'sine', 0.2);
              setIsPreparing(false);
            }}
            className="btn-orange"
            style={{ width: '100%', padding: '13px 20px', fontSize: '1.02rem' }}
          >
            <span>Bắt đầu ngay</span>
            <span>🚀</span>
          </button>

          <button
            onClick={onCancel}
            className="btn-peach"
            style={{ width: '100%', padding: '11px 20px' }}
          >
            ← Quay lại chi tiết
          </button>
        </div>
      </div>
    );
  }

  // ================= 2. REST SCREEN (Image 2 screen 3) =================
  if (isResting) {
    const nextExercise = exercisesList[exerciseIndex] || currentExercise;
    return (
      <div style={{ width: '100%', paddingBottom: '30px' }}>
        {/* Header bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px'
        }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#133E35' }}>
            Active Workout Session
          </span>
          <button
            onClick={onCancel}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(19, 62, 53, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Top Finished Banner */}
        <div style={{
          backgroundColor: '#D1FAE5',
          color: '#065F46',
          fontSize: '0.72rem',
          fontWeight: 800,
          padding: '4px 12px',
          borderRadius: 'var(--radius-full)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          marginBottom: '12px'
        }}>
          <Check size={13} />
          <span>ĐÃ HOÀN THÀNH ĐỘNG TÁC {exerciseIndex}/{totalExercises}</span>
        </div>

        {/* Rest Heading */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1E293B', margin: '0 0 2px 0' }}>
          Nghỉ giữa động tác
        </h2>
        <p style={{ fontSize: '0.86rem', color: '#475569', margin: '0 0 16px 0' }}>
          {workout.title}
        </p>

        {/* Big Circular Rest Timer (Mint Card #72D5C3) */}
        <div style={{
          backgroundColor: '#72D5C3',
          borderRadius: '24px',
          padding: '24px 16px',
          textAlign: 'center',
          marginBottom: '16px',
          boxShadow: '0 8px 24px -4px rgba(114, 213, 195, 0.35)'
        }}>
          {/* Circular Ring */}
          <div style={{
            width: '130px',
            height: '130px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: '6px solid #A7EDB8',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto',
            boxShadow: '0 6px 18px rgba(19, 62, 53, 0.12)'
          }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
              Thời gian nghỉ
            </div>
            <div style={{ fontSize: '1.95rem', fontWeight: 900, color: '#133E35', lineHeight: 1.1 }}>
              {formatTime(restTimeLeft)}
            </div>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#059669', marginTop: '2px' }}>
              Thở sâu & thư giãn
            </div>
          </div>

          <button
            onClick={handleAddRestTime}
            style={{
              backgroundColor: '#FFFFFF',
              color: '#065F46',
              fontSize: '0.78rem',
              fontWeight: 800,
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
            }}
          >
            + Nghỉ thêm 30 giây
          </button>
        </div>

        {/* Mochi Cheer Bubble */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
          border: '1px solid rgba(19, 62, 53, 0.08)'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: '#FEF3C7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            overflow: 'hidden'
          }}>
            <VirtualPet species="mochi" size="sm" state="cheering" interactive={false} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#EA580C', marginBottom: '2px' }}>
              Bé Mochi nhắn nhủ ✨
            </div>
            <div style={{ fontSize: '0.78rem', color: '#1E293B', fontWeight: 700, lineHeight: 1.35 }}>
              "Bạn làm tốt lắm! Thả lỏng cổ và vai trong {restTimeLeft} giây nhé. Chúng mình sắp chuyển sang động tác tiếp theo rồi!"
            </div>
          </div>
        </div>

        {/* Next Exercise Preview Card (Peach #FEDFD2) */}
        <div className="card-peach" style={{ marginBottom: '16px', padding: '14px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              backgroundColor: '#FFFFFF',
              overflow: 'hidden',
              flexShrink: 0
            }}>
              <img
                src={workout.imageUrl || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&auto=format&fit=crop&q=80"}
                alt="Next"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#9A3412', textTransform: 'uppercase' }}>
                ĐỘNG TÁC TIẾP THEO • {exerciseIndex + 1}/{totalExercises}
              </div>
              <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#1E293B' }}>
                {nextExercise.name} - {nextExercise.durationSec} giây
              </div>
              <div style={{ fontSize: '0.74rem', color: '#475569', marginTop: '2px' }}>
                Vùng tác động: {nextExercise.targetArea || 'Cơ thể'}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={handleSkipRest}
            className="btn-orange"
            style={{ width: '100%', padding: '13px 20px', fontSize: '1rem' }}
          >
            <span>Bỏ qua nghỉ & Tập tiếp ngay</span>
            <span>🚀</span>
          </button>

          <button
            onClick={handleAddRestTime}
            className="btn-peach"
            style={{ width: '100%', padding: '11px 20px' }}
          >
            ⏰ Nghỉ thêm 30 giây
          </button>
        </div>
      </div>
    );
  }

  // ================= 3. ACTIVE EXERCISE SCREEN (Image 2 screens 2, 4, 5) =================
  const isLastExercise = exerciseIndex + 1 === totalExercises;

  return (
    <div style={{ width: '100%', paddingBottom: '30px' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            backgroundColor: '#D1FAE5',
            color: '#065F46',
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span>•</span>
            <span>{isLastExercise ? 'ĐỘNG TÁC CUỐI' : 'ĐANG TẬP'}</span>
          </span>

          <span style={{
            backgroundColor: '#FFFFFF',
            color: '#133E35',
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid rgba(19, 62, 53, 0.1)'
          }}>
            Động tác {exerciseIndex + 1}/{totalExercises} {isLastExercise && '(100% về đích)'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Camera toggle */}
          <button
            onClick={() => setIsCameraActive(!isCameraActive)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: isCameraActive ? '#D1FAE5' : '#FFFFFF',
              color: isCameraActive ? '#059669' : '#64748B',
              border: '1px solid rgba(19, 62, 53, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title={isCameraActive ? 'Tắt camera AI' : 'Bật camera đếm nhịp AI'}
          >
            {isCameraActive ? <Camera size={16} /> : <CameraOff size={16} />}
          </button>

          {/* Close */}
          <button
            onClick={onCancel}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(19, 62, 53, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Muscle Tag Chips */}
      {currentExercise.tags && (
        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {currentExercise.tags.map((t, idx) => (
            <span
              key={idx}
              style={{
                backgroundColor: '#FEDFD2',
                color: '#9A3412',
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)'
              }}
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Video / Illustration / Camera Box */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '22px',
        padding: '12px',
        marginBottom: '16px',
        boxShadow: '0 4px 16px rgba(19, 62, 53, 0.08)',
        border: '1px solid rgba(19, 62, 53, 0.08)'
      }}>
        {isCameraActive ? (
          <CameraPoseDetector
            exerciseType={currentExercise.illustrationType}
            onRepCount={(reps) => {
              setCameraReps(reps);
              sessionLogRef.current.usedCamera = true;
            }}
            onFeedback={(fb) => setCameraFeedback(fb)}
          />
        ) : (
          <ExerciseIllustration
            type={currentExercise.illustrationType}
            name={currentExercise.name}
            showControls={false}
          />
        )}
      </div>

      {/* Big Circular Progress Timer (Seafoam Mint #72D5C3) */}
      <div style={{
        backgroundColor: '#72D5C3',
        borderRadius: '24px',
        padding: '20px 16px',
        textAlign: 'center',
        marginBottom: '16px',
        boxShadow: '0 8px 24px -4px rgba(114, 213, 195, 0.35)'
      }}>
        <div style={{
          width: '136px',
          height: '136px',
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          border: '7px solid #A7EDB8',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 10px auto',
          boxShadow: '0 6px 20px rgba(19, 62, 53, 0.12)'
        }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
            Thời gian còn lại
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#133E35', lineHeight: 1.1 }}>
            {formatTime(timeLeft)}
          </div>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#059669', marginTop: '2px' }}>
            Nhịp thở đều
          </div>
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#133E35', margin: '0 0 4px 0' }}>
          {currentExercise.name}
        </h3>
        <p style={{ fontSize: '0.82rem', color: '#133E35', margin: 0, opacity: 0.9, lineHeight: 1.4 }}>
          {currentExercise.instruction}
        </p>
      </div>

      {/* Mochi Coach Speech Bubble */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '18px',
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '12px',
        border: '1px solid rgba(19, 62, 53, 0.08)'
      }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          backgroundColor: '#FEF3C7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          overflow: 'hidden'
        }}>
          <VirtualPet species="mochi" size="sm" state={isPaused ? "idle" : "exercising"} interactive={false} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#EA580C', marginBottom: '2px' }}>
            Mochi nhắc nhở 💡
          </div>
          <div style={{ fontSize: '0.78rem', color: '#1E293B', fontWeight: 700, lineHeight: 1.35 }}>
            {currentExercise.voiceCue || "Hít vào khi về giữa, thở ra khi nghiêng! Đừng cố kéo căng quá, chỉ cần cảm thấy dễ chịu là được rồi nè."}
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '0.74rem',
        color: '#64748B',
        marginBottom: '16px',
        padding: '0 4px'
      }}>
        <AlertCircle size={14} style={{ color: '#059669', flexShrink: 0 }} />
        <span>Chỉ vận động trong phạm vi thoải mái. Dừng lại nếu thấy đau hoặc chóng mặt.</span>
      </div>

      {/* Action Controls */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="btn-orange"
          style={{ flex: 1, padding: '12px 18px', fontSize: '0.96rem' }}
        >
          {isPaused ? <Play size={16} fill="currentColor" /> : <Pause size={16} />}
          <span>{isPaused ? 'Tiếp tục' : 'Tạm dừng'}</span>
        </button>

        {isLastExercise ? (
          <button
            onClick={() => finishWorkout(true)}
            style={{
              backgroundColor: '#A7EDB8',
              color: '#064E3B',
              fontWeight: 800,
              fontSize: '0.92rem',
              padding: '12px 18px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Check size={16} />
            <span>Hoàn thành ngay</span>
          </button>
        ) : (
          <button
            onClick={handleSkipExercise}
            style={{
              backgroundColor: '#FFFFFF',
              color: '#64748B',
              fontWeight: 700,
              fontSize: '0.88rem',
              padding: '12px 18px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(19, 62, 53, 0.12)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <SkipForward size={16} />
            <span>Bỏ qua động tác</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default WorkoutPlayer;

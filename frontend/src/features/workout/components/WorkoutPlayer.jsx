import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, SkipForward, Volume2, VolumeX, 
  Coffee, HelpCircle, X, Check, RefreshCw, Feather,
  Camera, CameraOff, LayoutTemplate, Sparkles, CheckCircle2
} from 'lucide-react';
import { ExerciseIllustration } from './ExerciseIllustration';
import { CameraPoseDetector } from './CameraPoseDetector';
import { VirtualPet } from '../../pet/components/VirtualPet';
import { speechCompanion } from '../../ai-coach/services/speechCompanion';
import { soundService } from '../services/soundService';

export const WorkoutPlayer = ({ workout, onFinish, onCancel }) => {
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [exercisesList, setExercisesList] = useState(workout.exercises);
  const [timeLeft, setTimeLeft] = useState(workout.exercises[0].durationSec);
  const [isPaused, setIsPaused] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(30);
  const [isVoiceMuted, setIsVoiceMuted] = useState(speechCompanion.isMuted);
  const [isEasierActive, setIsEasierActive] = useState(false);
  const [showStopConfirm, setShowStopConfirm] = useState(false);

  // Camera Motion Recognition State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraViewMode, setCameraViewMode] = useState('split'); // 'split' | 'camera' | 'illustration'
  const [cameraFeedback, setCameraFeedback] = useState(null);
  const [cameraReps, setCameraReps] = useState(0);

  // Performance & Honest tracking log
  const sessionLogRef = useRef({
    workoutId: workout.id,
    workoutTitle: workout.title,
    startTime: Date.now(),
    completedExercises: [],
    skippedExercises: [],
    modifiedExercises: [],
    totalSecondsMoved: 0,
    cameraRepsCount: 0,
    usedCamera: false
  });

  const currentExercise = exercisesList[exerciseIndex];
  const totalExercises = exercisesList.length;

  // Speak initial cue on exercise start
  useEffect(() => {
    if (!currentExercise) return;
    setTimeLeft(currentExercise.durationSec);
    setIsEasierActive(false);

    if (!isVoiceMuted && !isResting) {
      speechCompanion.speak(currentExercise.voiceCue, true);
    }

    return () => {
      speechCompanion.stop();
    };
  }, [exerciseIndex, isResting]);

  // Main countdown timer
  useEffect(() => {
    if (isPaused || showStopConfirm) return;

    if (isResting) {
      if (restTimeLeft <= 0) {
        setIsResting(false);
        setRestTimeLeft(30);
        speechCompanion.speak('Rest complete. Ready for the next movement.', true);
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
      } else {
        // Finished workout!
        finishWorkout(true);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === Math.floor(currentExercise.durationSec / 2)) {
          if (!isVoiceMuted) {
            speechCompanion.speak('Halfway there. Keep your breathing steady.');
          }
        }
        return prev - 1;
      });
      sessionLogRef.current.totalSecondsMoved += 1;
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, isResting, restTimeLeft, timeLeft, exerciseIndex, showStopConfirm, isVoiceMuted]);

  const handleToggleVoice = () => {
    const newMuted = speechCompanion.toggleMute();
    setIsVoiceMuted(newMuted);
  };

  const handleTogglePause = () => {
    setIsPaused((prev) => !prev);
    if (!isPaused) {
      speechCompanion.stop();
    }
  };

  const handleTakeRest = () => {
    setIsResting(true);
    setRestTimeLeft(30);
    setIsPaused(false);
    soundService.playRestChime();
    if (!isVoiceMuted) {
      speechCompanion.speak('Nghỉ ngơi một chút nào. Hít thở sâu và thư giãn nhé.', true);
    }
  };

  const handleSkipExercise = () => {
    sessionLogRef.current.skippedExercises.push(currentExercise.id);
    if (exerciseIndex + 1 < totalExercises) {
      setExerciseIndex((prev) => prev + 1);
    } else {
      finishWorkout(false);
    }
  };

  const handleReplaceExercise = () => {
    if (!currentExercise.replacementExercise) return;
    const replacement = currentExercise.replacementExercise;
    const updated = [...exercisesList];
    updated[exerciseIndex] = {
      ...currentExercise,
      name: replacement.name,
      instruction: replacement.instruction,
      isReplaced: true
    };
    setExercisesList(updated);
    sessionLogRef.current.modifiedExercises.push(currentExercise.id);
    if (!isVoiceMuted) {
      speechCompanion.speak(`Đã đổi sang ${replacement.name}. Tập theo sức của bạn nhé.`, true);
    }
  };

  const handleToggleEasier = () => {
    setIsEasierActive((prev) => !prev);
    if (!isEasierActive) {
      sessionLogRef.current.modifiedExercises.push(currentExercise.id);
      if (!isVoiceMuted) {
        speechCompanion.speak('Đã chuyển sang biến thể nhẹ hơn. Vận động thoải mái là được nhé.', true);
      }
    }
  };

  const handleToggleCamera = () => {
    const nextState = !isCameraActive;
    setIsCameraActive(nextState);
    if (nextState) {
      sessionLogRef.current.usedCamera = true;
      if (!isVoiceMuted) {
        speechCompanion.speak('Camera AI nhận diện đã kích hoạt. Hãy đứng trong khung hình.', true);
      }
    }
  };

  const handleRepDetected = (reps) => {
    setCameraReps(reps);
    sessionLogRef.current.cameraRepsCount = reps;
    soundService.playRepBeep();
  };

  const finishWorkout = (isFullCompletion) => {
    speechCompanion.stop();
    if (isFullCompletion) {
      soundService.playVictory();
    }
    const finalReport = {
      ...sessionLogRef.current,
      endTime: Date.now(),
      isFullCompletion: isFullCompletion && sessionLogRef.current.skippedExercises.length === 0,
      totalExercisesCount: totalExercises
    };
    onFinish(finalReport);
  };

  // Progress percentage
  const progressPercent = Math.min(
    100,
    Math.round(((exerciseIndex) / totalExercises) * 100 + ((currentExercise.durationSec - timeLeft) / currentExercise.durationSec / totalExercises) * 100)
  );

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', width: '100%', padding: '0 0 var(--space-8) 0' }}>
      {/* Top Header Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--color-border-subtle)', marginBottom: '16px' }}>
        <button
          className="btn-ghost"
          onClick={() => setShowStopConfirm(true)}
          style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}
          aria-label="Stop workout"
        >
          <X size={18} style={{ marginRight: '4px' }} /> Dừng buổi tập
        </button>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {workout.title}
          </div>
          <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-brand-primary)' }}>
            Động tác {exerciseIndex + 1} / {totalExercises}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Camera AI Quick Toggle */}
          <button
            className={`icon-btn ${isCameraActive ? 'active' : ''}`}
            onClick={handleToggleCamera}
            title={isCameraActive ? 'Tắt Camera AI' : 'Bật Camera AI nhận diện động tác'}
            aria-label={isCameraActive ? 'Tắt Camera AI' : 'Bật Camera AI nhận diện động tác'}
          >
            {isCameraActive ? <Camera size={18} /> : <CameraOff size={18} />}
          </button>

          {/* Voice Companion Toggle */}
          <button
            className={`icon-btn ${!isVoiceMuted ? 'active' : ''}`}
            onClick={handleToggleVoice}
            title={isVoiceMuted ? 'Voice companion muted (click to unmute)' : 'Voice companion active (click to mute)'}
            aria-label={isVoiceMuted ? 'Unmute voice companion' : 'Mute voice companion'}
          >
            {isVoiceMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--color-surface-muted)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: '16px' }}>
        <div
          style={{
            height: '100%',
            width: `${progressPercent}%`,
            backgroundColor: 'var(--color-brand-primary)',
            transition: 'width 0.3s ease-out'
          }}
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>

      {/* Camera AI Feature Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: isCameraActive ? 'var(--color-brand-subtle)' : 'var(--color-surface-subtle)',
        border: `1px solid ${isCameraActive ? 'var(--color-brand-primary)' : 'var(--color-border)'}`,
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: isCameraActive ? 'var(--color-brand-primary)' : 'var(--color-surface)',
            color: isCameraActive ? '#FFFFFF' : 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Camera size={15} />
          </div>
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Camera AI Nhận Diện Tư Thế
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              {isCameraActive ? 'Đang phân tích thao tác theo thời gian thực (On-device)' : 'Nhận diện bạn tập đúng hay sai & đếm nhịp tự động'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isCameraActive && (
            <div style={{ display: 'flex', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', padding: '2px', border: '1px solid var(--color-border)' }}>
              <button
                className={`btn-ghost ${cameraViewMode === 'split' ? 'active' : ''}`}
                onClick={() => setCameraViewMode('split')}
                style={{ padding: '4px 8px', fontSize: '0.75rem', fontWeight: 600, height: '28px', minHeight: 'unset' }}
              >
                Chia đôi
              </button>
              <button
                className={`btn-ghost ${cameraViewMode === 'camera' ? 'active' : ''}`}
                onClick={() => setCameraViewMode('camera')}
                style={{ padding: '4px 8px', fontSize: '0.75rem', fontWeight: 600, height: '28px', minHeight: 'unset' }}
              >
                Camera
              </button>
              <button
                className={`btn-ghost ${cameraViewMode === 'illustration' ? 'active' : ''}`}
                onClick={() => setCameraViewMode('illustration')}
                style={{ padding: '4px 8px', fontSize: '0.75rem', fontWeight: 600, height: '28px', minHeight: 'unset' }}
              >
                Hình mẫu
              </button>
            </div>
          )}

          <button
            className={`btn-secondary ${isCameraActive ? 'active' : ''}`}
            onClick={handleToggleCamera}
            style={{ padding: '6px 12px', fontSize: '0.82rem', height: '32px', minHeight: 'unset' }}
          >
            {isCameraActive ? 'Tắt Camera' : 'Bật Camera'}
          </button>
        </div>
      </div>

      {/* Rest Overlay Mode */}
      {isResting ? (
        <div className="card" style={{ textAlign: 'center', padding: '36px 20px', backgroundColor: 'var(--color-pet-bg)', borderColor: 'var(--color-pet-amber)' }}>
          <span className="badge badge-amber" style={{ marginBottom: '12px' }}>Nghỉ Ngơi & Hít Thở</span>
          <h2 style={{ fontSize: '2rem', marginBottom: '8px', color: 'var(--color-text-primary)' }}>
            {restTimeLeft}s
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px', maxWidth: '380px', margin: '0 auto 24px auto', fontSize: '0.95rem' }}>
            Nghỉ ngơi là một phần quan trọng của buổi tập. Hãy hít thở sâu, thả lỏng cổ và vai.
          </p>

          <VirtualPet state="resting" size="md" message="Thư giãn nào! Nghỉ ngơi giúp cơ thể hồi phục." showSpeechBubble={true} />

          <div style={{ marginTop: '28px' }}>
            <button
              className="btn-primary"
              onClick={() => setIsResting(false)}
              style={{ minWidth: '160px' }}
            >
              Tiếp tục tập luyện
            </button>
          </div>
        </div>
      ) : (
        /* Active Exercise Display */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Visual Display Section (Illustration vs Camera vs Split) */}
          <div style={{ position: 'relative' }}>
            {isCameraActive ? (
              cameraViewMode === 'split' ? (
                /* Split View: Illustration on Left, Camera on Right */
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Động tác mẫu
                    </div>
                    <ExerciseIllustration
                      type={currentExercise.illustrationType}
                      name={currentExercise.name}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-brand-primary)', marginBottom: '6px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Camera size={13} /> Nhận diện tư thế của bạn
                    </div>
                    <CameraPoseDetector
                      exercise={currentExercise}
                      isActive={!isPaused && !isResting}
                      onPoseStatusChange={(fb) => setCameraFeedback(fb)}
                      onRepDetected={handleRepDetected}
                    />
                  </div>
                </div>
              ) : cameraViewMode === 'camera' ? (
                /* Full Camera View */
                <CameraPoseDetector
                  exercise={currentExercise}
                  isActive={!isPaused && !isResting}
                  onPoseStatusChange={(fb) => setCameraFeedback(fb)}
                  onRepDetected={handleRepDetected}
                />
              ) : (
                /* Illustration View */
                <ExerciseIllustration
                  type={currentExercise.illustrationType}
                  name={currentExercise.name}
                />
              )
            ) : (
              /* Standard Illustration View */
              <ExerciseIllustration
                type={currentExercise.illustrationType}
                name={currentExercise.name}
              />
            )}

            {/* Supportive Pet Companion in corner */}
            <div style={{ position: 'absolute', bottom: '-10px', right: '12px', zIndex: 10 }}>
              <VirtualPet
                state={isPaused ? 'idle' : (cameraFeedback?.status === 'good' ? 'cheering' : 'exercising')}
                size="sm"
                message={
                  isPaused
                    ? "Đang tạm dừng"
                    : cameraFeedback?.status === 'good'
                    ? "Tư thế chuẩn!"
                    : null
                }
              />
            </div>
          </div>

          {/* Exercise Details Card */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <span className="badge badge-brand" style={{ marginBottom: '6px' }}>{currentExercise.targetArea}</span>
                <h1 style={{ fontSize: '1.45rem', fontWeight: 800 }}>{currentExercise.name}</h1>
              </div>

              {/* Big, High-Contrast Countdown Timer */}
              <div style={{ textAlign: 'right', minWidth: '70px' }}>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: timeLeft <= 5 ? 'var(--color-accent)' : 'var(--color-brand-primary)', lineHeight: 1 }}>
                  {timeLeft}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>giây</div>
              </div>
            </div>

            {/* Core Instruction (Prominent, legible) */}
            <p style={{ fontSize: '1.05rem', color: 'var(--color-text-primary)', lineHeight: 1.55, fontWeight: 500, marginBottom: '16px' }}>
              {isEasierActive && currentExercise.easierVariant ? (
                <span style={{ color: 'var(--color-brand-primary)' }}>
                  <strong>Biến thể nhẹ nhàng:</strong> {currentExercise.easierVariant}
                </span>
              ) : (
                currentExercise.instruction
              )}
            </p>

            {/* Key Form Tips */}
            {currentExercise.formTips && currentExercise.formTips.length > 0 && (
              <div style={{ backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-md)', padding: '12px 14px', borderLeft: '3px solid var(--color-brand-primary)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '4px', textTransform: 'uppercase' }}>
                  Lưu ý động tác đúng
                </div>
                <ul style={{ paddingLeft: '18px', fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
                  {currentExercise.formTips.map((tip, i) => (
                    <li key={i} style={{ marginBottom: '2px' }}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quick Autonomy Toggles: Make Easier or Replace */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--color-border-subtle)' }}>
              {currentExercise.easierVariant && (
                <button
                  className={`btn-ghost ${isEasierActive ? 'active' : ''}`}
                  onClick={handleToggleEasier}
                  style={{
                    fontSize: '0.82rem',
                    border: '1px solid var(--color-border)',
                    backgroundColor: isEasierActive ? 'var(--color-brand-light)' : 'transparent'
                  }}
                >
                  <Feather size={14} style={{ marginRight: '4px' }} />
                  {isEasierActive ? 'Đang dùng bản nhẹ' : 'Tập nhẹ hơn'}
                </button>
              )}

              {currentExercise.replacementExercise && (
                <button
                  className="btn-ghost"
                  onClick={handleReplaceExercise}
                  style={{ fontSize: '0.82rem', border: '1px solid var(--color-border)' }}
                >
                  <RefreshCw size={14} style={{ marginRight: '4px' }} />
                  Đổi động tác khác
                </button>
              )}

              <button
                className="btn-ghost"
                onClick={handleTakeRest}
                style={{ fontSize: '0.82rem', border: '1px solid var(--color-border)', marginLeft: 'auto' }}
              >
                <Coffee size={14} style={{ marginRight: '4px' }} />
                Nghỉ 30 giây
              </button>
            </div>
          </div>

          {/* Primary Controls Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '8px' }}>
            <button
              className="btn-secondary"
              onClick={handleTakeRest}
              style={{ minWidth: '110px' }}
              title="Pause and take a relaxed rest"
            >
              <Coffee size={18} />
              Nghỉ
            </button>

            <button
              className="btn-primary"
              onClick={handleTogglePause}
              style={{ minWidth: '160px', padding: '12px 28px' }}
              aria-label={isPaused ? 'Resume exercise timer' : 'Pause exercise timer'}
            >
              {isPaused ? <Play size={20} fill="currentColor" /> : <Pause size={20} />}
              {isPaused ? 'Tiếp tục' : 'Tạm dừng'}
            </button>

            <button
              className="btn-secondary"
              onClick={handleSkipExercise}
              style={{ minWidth: '110px' }}
              title="Bỏ qua động tác này"
            >
              Bỏ qua
              <SkipForward size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog on Stop */}
      {showStopConfirm && (
        <div className="modal-backdrop" onClick={() => setShowStopConfirm(false)} role="dialog" aria-modal="true">
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Dừng buổi tập sớm?</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', marginBottom: '20px' }}>
              Hoàn toàn không sao cả! {Math.round(sessionLogRef.current.totalSecondsMoved / 60)} phút vận động vừa rồi của bạn vẫn được lưu lại đầy đủ.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                className="btn-secondary"
                onClick={() => setShowStopConfirm(false)}
                style={{ flex: 1 }}
              >
                Tập tiếp
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  setShowStopConfirm(false);
                  finishWorkout(false);
                }}
                style={{ flex: 1, backgroundColor: 'var(--color-brand-primary)' }}
              >
                Lưu & Hoàn tất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

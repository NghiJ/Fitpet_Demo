import React, { useState, useEffect } from 'react';
import { TopNav } from './components/common/TopNav/TopNav';
import { BottomNav } from './components/common/BottomNav/BottomNav';
import { HomePage } from './pages/HomePage/HomePage';
import { WorkoutLibraryPage } from './features/workout/pages/WorkoutLibraryPage';
import { WorkoutPlayer } from './features/workout/components/WorkoutPlayer';
import { WorkoutPreviewModal } from './features/workout/components/WorkoutPreviewModal';
import { WorkoutSummary } from './features/workout/components/WorkoutSummary';
import { PetSanctuary } from './features/pet/components/PetSanctuary';
import { ProgressView } from './features/analytics/ProgressView';
import { ProfilePage } from './features/profile/pages/ProfilePage';
import { DeskReminderPage } from './features/reminders/pages/DeskReminderPage';
import { CommunityPage } from './features/community/pages/CommunityPage';
import { ConsultationPage } from './features/consultation/pages/ConsultationPage';
import { AdminDashboard } from './pages/AdminPage/AdminDashboard';
import { CoachDashboard } from './features/coach/pages/CoachDashboard';
import { RoleLoginPage } from './features/auth/components/RoleLoginPage';
import { AuthModal } from './features/auth/components/AuthModal';
import { OnboardingFlow } from './features/onboarding/components/OnboardingFlow';
import { SubscriptionModal } from './features/subscription/components/SubscriptionModal';
import { CURATED_WORKOUTS } from './features/workout/data/curatedWorkouts';
import { speechCompanion } from './features/ai-coach/services/speechCompanion';
import { authService } from './features/auth/services/authService';


export const App = () => {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('fitpet_theme') || 'light';
  });

  // User & Authentication state
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRoleLoginOpen, setIsRoleLoginOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  // Dedicated Workspace States for Roles
  const [isAdminMode, setIsAdminMode] = useState(() => {
    return currentUser?.role === 'admin';
  });
  const [isCoachMode, setIsCoachMode] = useState(() => {
    return currentUser?.role === 'coach';
  });

  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('fitpet_onboarding_completed');
  });

  // Voice Companion state
  const [isVoiceMuted, setIsVoiceMuted] = useState(speechCompanion.isMuted);

  // Navigation tab: 'home' | 'library' | 'pet' | 'progress' | 'profile'
  const [activeTab, setActiveTab] = useState('home');

  // Workout state machine
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [previewWorkout, setPreviewWorkout] = useState(null);
  const [summaryData, setSummaryData] = useState(null);

  // Workout History with seed fallback for immediate demo experience
  const [workoutHistory, setWorkoutHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('fitpet_workout_history');
      if (saved) return JSON.parse(saved);
      const defaultSeed = [
        {
          workoutId: 'desk-de-stiffener',
          workoutTitle: 'Giảm Mỏi Cổ Vai Nhanh 3 Phút',
          startTime: Date.now() - 2 * 24 * 60 * 60 * 1000,
          endTime: Date.now() - 2 * 24 * 60 * 60 * 1000 + 180000,
          totalSecondsMoved: 180,
          isFullCompletion: true,
          usedCamera: true,
          cameraRepsCount: 16
        },
        {
          workoutId: 'lower-back-relief',
          workoutTitle: 'Giải Tỏa Thắt Lưng Tại Bàn Làm Việc',
          startTime: Date.now() - 1 * 24 * 60 * 60 * 1000,
          endTime: Date.now() - 1 * 24 * 60 * 60 * 1000 + 240000,
          totalSecondsMoved: 240,
          isFullCompletion: true,
          usedCamera: false
        },
        {
          workoutId: 'desk-wrist-flow',
          workoutTitle: 'Thư Giãn Cổ Tay Cho Người Gõ Phím',
          startTime: Date.now() - 3 * 60 * 60 * 1000,
          endTime: Date.now() - 3 * 60 * 60 * 1000 + 180000,
          totalSecondsMoved: 180,
          isFullCompletion: true,
          usedCamera: true,
          cameraRepsCount: 20
        }
      ];
      localStorage.setItem('fitpet_workout_history', JSON.stringify(defaultSeed));
      return defaultSeed;
    } catch (e) {
      return [];
    }
  });

  // Apply theme to HTML root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('fitpet_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleVoice = () => {
    const next = speechCompanion.toggleMute();
    setIsVoiceMuted(next);
  };

  // Login handler that routes directly to the screen dedicated for that role
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsRoleLoginOpen(false);
    setIsAuthModalOpen(false);

    if (user.role === 'admin') {
      setIsAdminMode(true);
      setIsCoachMode(false);
    } else if (user.role === 'coach') {
      setIsCoachMode(true);
      setIsAdminMode(false);
    } else {
      setIsAdminMode(false);
      setIsCoachMode(false);
      setActiveTab('home');
    }
  };

  const handleLogoutOrSwitchRole = () => {
    setIsAdminMode(false);
    setIsCoachMode(false);
    setIsRoleLoginOpen(true);
  };

  const handleStartWorkout = (workout) => {
    setPreviewWorkout(null);
    setSummaryData(null);
    setActiveWorkout(workout);
  };

  const handleFinishWorkout = (finalReport) => {
    setActiveWorkout(null);
    setSummaryData(finalReport);

    // Save to real local storage history
    const updated = [finalReport, ...workoutHistory];
    setWorkoutHistory(updated);
    try {
      localStorage.setItem('fitpet_workout_history', JSON.stringify(updated));
    } catch (e) {
      console.warn('Unable to persist session to local storage:', e);
    }
  };

  const handleStartAnotherWorkout = () => {
    const quickRefresh = CURATED_WORKOUTS.find(w => w.id === 'quick-2min-refresh') || CURATED_WORKOUTS[0];
    setSummaryData(null);
    setActiveWorkout(quickRefresh);
  };

  const handleReturnHome = () => {
    setSummaryData(null);
    setActiveWorkout(null);
    setPreviewWorkout(null);
    setIsAdminMode(false);
    setIsCoachMode(false);
    setActiveTab('home');
  };

  // ================= 1. FULLSCREEN MULTI-ROLE LOGIN SCREEN =================
  if (isRoleLoginOpen) {
    return (
      <RoleLoginPage
        initialRole={currentUser?.role === 'admin' ? 'admin' : (currentUser?.role === 'coach' ? 'coach' : 'user')}
        onLoginSuccess={handleLoginSuccess}
        onClose={() => setIsRoleLoginOpen(false)}
      />
    );
  }

  // ================= 2. DEDICATED ADMIN DASHBOARD WORKSPACE (ROLE: ADMIN) =================
  if (isAdminMode) {
    return (
      <AdminDashboard
        currentUser={currentUser}
        onBackToApp={() => setIsAdminMode(false)}
        onSwitchToCoach={() => {
          setIsAdminMode(false);
          setIsCoachMode(true);
        }}
        onLogout={handleLogoutOrSwitchRole}
      />
    );
  }

  // ================= 3. DEDICATED COACH DASHBOARD WORKSPACE (ROLE: COACH) =================
  if (isCoachMode) {
    return (
      <CoachDashboard
        currentUser={currentUser}
        onBackToApp={() => setIsCoachMode(false)}
        onLogout={handleLogoutOrSwitchRole}
      />
    );
  }

  // ================= 4. DEDICATED MEMBER WORKSPACE (ROLE: USER) =================
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Header Navigation */}
      <TopNav
        theme={theme}
        onToggleTheme={toggleTheme}
        isVoiceMuted={isVoiceMuted}
        onToggleVoice={toggleVoice}
        onBrandClick={handleReturnHome}
        currentUser={currentUser}
        onUserIconClick={() => setActiveTab('profile')}
        onSwitchToAdmin={() => setIsAdminMode(true)}
        onSwitchToCoach={() => setIsCoachMode(true)}
        onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
        onOpenRoleLogin={() => setIsRoleLoginOpen(true)}
        onOpenReminders={() => {
          setActiveTab('reminders');
          setSummaryData(null);
        }}
        onOpenCommunity={() => {
          setActiveTab('community');
          setSummaryData(null);
        }}
        onOpenConsultation={() => {
          setActiveTab('consultation');
          setSummaryData(null);
        }}
      />

      {/* Main App Content Viewport */}
      <main className="app-container" style={{ flex: 1, paddingTop: '16px' }}>
        {/* Active Workout Player Mode (Zero distractions) */}
        {activeWorkout ? (
          <WorkoutPlayer
            workout={activeWorkout}
            onFinish={handleFinishWorkout}
            onCancel={handleReturnHome}
          />
        ) : summaryData ? (
          /* Workout Summary Mode */
          <WorkoutSummary
            sessionData={summaryData}
            onDone={handleReturnHome}
            onStartAnother={handleStartAnotherWorkout}
          />
        ) : (
          /* Full Role Member Tabs */
          <>
            {activeTab === 'home' && (
              <HomePage
                onStartWorkout={handleStartWorkout}
                onPreviewWorkout={(w) => setPreviewWorkout(w)}
                workoutHistory={workoutHistory}
                onNavigateTab={(tab) => {
                  setActiveTab(tab);
                  setSummaryData(null);
                }}
              />
            )}

            {activeTab === 'library' && (
              <WorkoutLibraryPage
                onStartWorkout={handleStartWorkout}
                onPreviewWorkout={(w) => setPreviewWorkout(w)}
              />
            )}

            {activeTab === 'reminders' && (
              <DeskReminderPage
                onStartWorkout={handleStartWorkout}
              />
            )}

            {activeTab === 'community' && (
              <CommunityPage
                onStartWorkout={handleStartWorkout}
                currentUser={currentUser}
              />
            )}

            {activeTab === 'consultation' && (
              <ConsultationPage
                onStartWorkout={handleStartWorkout}
                currentUser={currentUser}
                onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
              />
            )}

            {activeTab === 'pet' && (
              <PetSanctuary sessionCount={workoutHistory.length} />
            )}

            {activeTab === 'progress' && (
              <ProgressView workoutHistory={workoutHistory} />
            )}

            {activeTab === 'profile' && (
              <ProfilePage
                currentUser={currentUser}
                onUserUpdate={(u) => setCurrentUser(u)}
                onOpenAuth={() => setIsRoleLoginOpen(true)}
                onReplayOnboarding={() => setShowOnboarding(true)}
                onSwitchToAdmin={() => setIsAdminMode(true)}
                onSwitchToCoach={() => setIsCoachMode(true)}
                onOpenRoleLogin={() => setIsRoleLoginOpen(true)}
                currentTheme={theme}
                onToggleTheme={toggleTheme}
                onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
                onNavigateTab={(tab) => {
                  setActiveTab(tab);
                  setSummaryData(null);
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Workout Preview Modal */}
      {previewWorkout && !activeWorkout && (
        <WorkoutPreviewModal
          workout={previewWorkout}
          onStart={handleStartWorkout}
          onClose={() => setPreviewWorkout(null)}
          onSelectAlternative={() => {
            const next = CURATED_WORKOUTS.find(w => w.id !== previewWorkout.id);
            setPreviewWorkout(next);
          }}
        />
      )}

      {/* Onboarding Flow for new users or replayed */}
      {showOnboarding && !activeWorkout && (
        <OnboardingFlow
          onComplete={(prefs) => {
            setShowOnboarding(false);
            if (prefs?.voiceEnabled !== undefined) {
              speechCompanion.setMuted(!prefs.voiceEnabled);
              setIsVoiceMuted(!prefs.voiceEnabled);
            }
          }}
        />
      )}

      {/* Authentication Modal (Login / Register / Forgot Password) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialRole={currentUser?.role || 'user'}
        onAuthSuccess={handleLoginSuccess}
      />

      {/* Subscription & Plan Purchase Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        currentUser={currentUser}
        onSubscriptionSuccess={(updatedUser) => {
          setCurrentUser(updatedUser);
        }}
      />

      {/* Persistent Bottom Navigation (Hidden during active workout to maximize focus) */}
      {!activeWorkout && !summaryData && (
        <BottomNav
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setSummaryData(null);
          }}
        />
      )}
    </div>
  );
};

export default App;

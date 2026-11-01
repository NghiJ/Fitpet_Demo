import React, { useState, useEffect } from 'react';
import { 
  Trophy, Flame, Users, Heart, Sparkles, CheckCircle2, 
  ArrowRight, Award, Zap, Clock, ShieldCheck, Share2, Copy
} from 'lucide-react';
import { communityService } from '../services/communityService';
import { CURATED_WORKOUTS } from '../../workout/data/curatedWorkouts';
import { soundService } from '../../workout/services/soundService';

export const CommunityPage = ({ onStartWorkout, currentUser }) => {
  const [communityData, setCommunityData] = useState(() => communityService.getData());
  const [subTab, setSubTab] = useState('challenges'); // 'challenges' | 'leaderboard' | 'feed' | 'coworkout'
  const [toastMsg, setToastMsg] = useState('');
  const [roomCode, setRoomCode] = useState('FIT-8829');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const unsub = communityService.subscribe(setCommunityData);
    return () => unsub();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleJoinChallenge = (chId, title) => {
    communityService.joinChallenge(chId);
    soundService.playVictory();
    showToast(`🎉 Đã tham gia "${title}"! Chúc bạn kiên trì cùng Pip.`);
  };

  const handleCheer = (actId) => {
    communityService.toggleCheer(actId);
    soundService.playTone(659.25, 'sine', 0.12);
  };

  const handleCopyRoomCode = () => {
    navigator.clipboard?.writeText(roomCode);
    setIsCopied(true);
    soundService.playTone(523.25, 'sine', 0.1);
    showToast(`Đã sao chép mã phòng "${roomCode}" để gửi cho đồng nghiệp!`);
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <div style={{ maxWidth: '740px', margin: '0 auto', width: '100%', paddingBottom: 'var(--space-12)' }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          zIndex: 1000,
          backgroundColor: 'var(--color-brand-primary)',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.9rem',
          fontWeight: 700
        }}>
          <CheckCircle2 size={18} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-brand-primary)', marginBottom: '4px' }}>
          <Users size={16} /> Thử Thách & Cộng Đồng Văn Phòng FitPet
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '6px' }}>
          Cùng Nhau Vận Động
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem' }}>
          Không còn cảm giác tập một mình. Cùng hàng ngàn đồng nghiệp chinh phục thử thách bàn làm việc!
        </p>
      </div>

      {/* 4 Community Sub Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '2px solid var(--color-border)',
        marginBottom: '22px',
        overflowX: 'auto',
        scrollbarWidth: 'none'
      }}>
        {[
          { id: 'challenges', label: 'Thử Thách Tuần', icon: Trophy },
          { id: 'leaderboard', label: 'Bảng Xếp Hạng', icon: Flame },
          { id: 'feed', label: 'Bản Tin Đồng Nghiệp', icon: Heart },
          { id: 'coworkout', label: 'Phòng Tập Đôi', icon: Users }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              style={{
                padding: '10px 16px',
                fontSize: '0.9rem',
                fontWeight: 800,
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: isActive ? '3px solid var(--color-brand-primary)' : '3px solid transparent',
                color: isActive ? 'var(--color-brand-primary)' : 'var(--color-text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: CHALLENGES ================= */}
      {subTab === 'challenges' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {communityData.challenges.map(ch => {
            const targetWorkout = CURATED_WORKOUTS.find(w => w.id === ch.workoutTargetId) || CURATED_WORKOUTS[0];
            const percent = ch.daysTotal 
              ? Math.round((ch.daysCompleted / ch.daysTotal) * 100)
              : Math.round((ch.currentReps / ch.targetReps) * 100);

            return (
              <div
                key={ch.id}
                className="card"
                style={{
                  padding: '22px',
                  border: ch.isJoined ? '2px solid var(--color-brand-primary)' : '1px solid var(--color-border)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {ch.isJoined && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    backgroundColor: 'var(--color-brand-primary)',
                    color: '#FFFFFF',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '3px 12px',
                    borderBottomLeftRadius: 'var(--radius-md)'
                  }}>
                    Đang Tham Gia
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className="badge badge-amber" style={{ fontSize: '0.74rem' }}>
                    {ch.category}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    👥 {ch.participantsCount} người tham gia
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px' }}>
                  {ch.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                  {ch.description}
                </p>

                {/* Progress Bar if Joined */}
                {ch.isJoined && (
                  <div style={{ marginBottom: '16px', backgroundColor: 'var(--color-surface-subtle)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                      <span>Tiến trình của bạn:</span>
                      <span style={{ color: 'var(--color-brand-primary)' }}>
                        {ch.daysTotal ? `${ch.daysCompleted}/${ch.daysTotal} ngày (${percent}%)` : `${ch.currentReps}/${ch.targetReps} reps (${percent}%)`}
                      </span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: 'var(--color-border)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ width: `${percent}%`, height: '100%', backgroundColor: 'var(--color-brand-primary)', borderRadius: '999px', transition: 'width 0.3s ease' }} />
                    </div>
                  </div>
                )}

                {/* Rewards and Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>Phần thưởng:</span>
                    <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#B45309', padding: '3px 8px', borderRadius: 'var(--radius-sm)', fontWeight: 700 }}>
                      {ch.rewardBadge}
                    </span>
                    <span style={{ color: '#10B981', fontWeight: 700 }}>
                      +{ch.petExpReward} EXP thú cưng
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {ch.isJoined ? (
                      <button
                        onClick={() => onStartWorkout(targetWorkout)}
                        className="btn-primary"
                        style={{ padding: '8px 18px', fontSize: '0.88rem' }}
                      >
                        <Zap size={15} /> Tập Nhiệm Vụ Hôm Nay
                      </button>
                    ) : (
                      <button
                        onClick={() => handleJoinChallenge(ch.id, ch.title)}
                        className="btn-secondary"
                        style={{ padding: '8px 18px', fontSize: '0.88rem', borderColor: 'var(--color-brand-primary)', color: 'var(--color-brand-primary)' }}
                      >
                        Tham Gia Thử Thách
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= TAB 2: LEADERBOARD ================= */}
      {subTab === 'leaderboard' && (
        <div>
          {/* User's current rank card */}
          <div className="card" style={{
            padding: '18px 22px',
            marginBottom: '20px',
            backgroundColor: 'var(--color-brand-light)',
            border: '2px solid var(--color-brand-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-brand-primary)',
                color: '#FFFFFF',
                fontWeight: 900,
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                #3
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-brand-dark)' }}>
                  Vị trí của bạn: Hạng 3 Tuần Này
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
                  Bạn chỉ còn cách Hạng 2 là 14 phút vận động nữa thôi!
                </div>
              </div>
            </div>

            <button
              onClick={() => onStartWorkout(CURATED_WORKOUTS[0])}
              className="btn-primary"
              style={{ fontSize: '0.85rem', padding: '8px 16px' }}
            >
              <Zap size={14} /> Tập Ngay +3 Phút
            </button>
          </div>

          {/* Leaderboard Table List */}
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-subtle)', fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              TOP VẬN ĐỘNG VIÊN VĂN PHÒNG TUẦN NÀY
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {communityData.leaderboard.map((item) => {
                const isMe = item.name.includes('Thu Hà') || item.name === currentUser?.name;
                return (
                  <div
                    key={item.rank}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      borderBottom: '1px solid var(--color-border-subtle)',
                      backgroundColor: isMe ? 'rgba(16, 185, 129, 0.06)' : 'transparent'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '32px',
                        fontWeight: 900,
                        fontSize: '1.1rem',
                        color: item.rank === 1 ? '#F59E0B' : (item.rank === 2 ? '#94A3B8' : (item.rank === 3 ? '#B45309' : 'var(--color-text-muted)')),
                        textAlign: 'center'
                      }}>
                        {item.rank === 1 ? '🥇' : (item.rank === 2 ? '🥈' : (item.rank === 3 ? '🥉' : `#${item.rank}`))}
                      </div>

                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-surface-subtle)',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem'
                      }}>
                        {item.avatar}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{item.name}</span>
                          {isMe && <span className="badge badge-brand" style={{ fontSize: '0.65rem' }}>Bạn</span>}
                          <span style={{ fontSize: '0.74rem', color: '#B45309', backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontWeight: 700 }}>
                            {item.badge}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                          {item.company}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 900, fontSize: '1.05rem', color: 'var(--color-brand-primary)' }}>
                        {item.minutes} <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>phút</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: 700 }}>
                        🔥 {item.streak} ngày streak
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: CHEER WALL & FEED ================= */}
      {subTab === 'feed' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {communityData.activityFeed.map(feed => (
            <div
              key={feed.id}
              className="card"
              style={{
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '14px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-surface-subtle)',
                  border: '1.5px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                  flexShrink: 0
                }}>
                  {feed.avatar}
                </div>

                <div>
                  <div style={{ fontSize: '0.9rem', lineHeight: 1.4 }}>
                    <strong>{feed.userName}</strong> <span style={{ color: 'var(--color-text-muted)' }}>{feed.action}</span> <strong>{feed.workoutTitle}</strong>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    {feed.timeAgo}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleCheer(feed.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: feed.isCheered ? '1.5px solid #EF4444' : '1px solid var(--color-border)',
                  backgroundColor: feed.isCheered ? 'rgba(239, 68, 68, 0.1)' : 'var(--color-surface)',
                  color: feed.isCheered ? '#EF4444' : 'var(--color-text-muted)',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.15s ease'
                }}
              >
                <Heart size={15} fill={feed.isCheered ? '#EF4444' : 'none'} />
                <span>{feed.cheers}</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ================= TAB 4: CO-WORKOUT ROOM ================= */}
      {subTab === 'coworkout' && (
        <div className="card" style={{ padding: '28px', textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-brand-light)',
            color: 'var(--color-brand-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}>
            <Users size={32} />
          </div>

          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '6px' }}>
            Phòng Vận Động Đôi Cùng Đồng Nghiệp
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', maxWidth: '480px', margin: '0 auto 20px auto', lineHeight: 1.5 }}>
            Rủ đồng nghiệp cùng bàn hoặc bạn bè cùng công ty mở phòng tập chung 3 phút. Cùng theo dõi số rep qua Camera AI!
          </p>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 20px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--color-surface-subtle)',
            border: '2px dashed var(--color-brand-primary)',
            marginBottom: '20px'
          }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>Mã phòng của bạn:</span>
            <span style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '0.05em', color: 'var(--color-brand-dark)' }}>
              {roomCode}
            </span>
            <button
              onClick={handleCopyRoomCode}
              className="btn-ghost"
              style={{ padding: '6px 10px', fontSize: '0.8rem', border: '1px solid var(--color-border)' }}
            >
              <Copy size={14} style={{ marginRight: '4px' }} />
              {isCopied ? 'Đã sao chép' : 'Sao chép'}
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button
              onClick={() => {
                showToast('Đang kết nối phòng đồng nghiệp...');
                setTimeout(() => onStartWorkout(CURATED_WORKOUTS[0]), 800);
              }}
              className="btn-primary"
              style={{ padding: '10px 22px', fontSize: '0.94rem' }}
            >
              <Zap size={16} /> Bắt Đầu Phòng Ngay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

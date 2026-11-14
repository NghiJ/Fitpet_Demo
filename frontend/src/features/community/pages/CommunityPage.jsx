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
    showToast(`🎉 Đã tham gia "${title}"! Cùng Mochi kiên trì nhé!`);
  };

  const handleCheer = (actId) => {
    communityService.toggleCheer(actId);
    soundService.playTone(659.25, 'sine', 0.12);
  };

  const handleCopyRoomCode = () => {
    navigator.clipboard?.writeText(roomCode);
    setIsCopied(true);
    soundService.playTone(523.25, 'sine', 0.1);
    showToast(`Đã sao chép mã phòng "${roomCode}"!`);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const subTabs = [
    { id: 'challenges', label: 'Thử thách tuần', icon: Trophy },
    { id: 'leaderboard', label: 'Bảng xếp hạng', icon: Flame },
    { id: 'feed', label: 'Bản tin', icon: Heart },
    { id: 'coworkout', label: 'Tập đôi', icon: Users }
  ];

  return (
    <div style={{ width: '100%', padding: '4px 6px 120px 6px', boxSizing: 'border-box' }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '16px',
          left: '16px',
          maxWidth: '380px',
          margin: '0 auto',
          zIndex: 1000,
          backgroundColor: '#F78C25',
          color: '#FFFFFF',
          padding: '12px 18px',
          borderRadius: '9999px',
          boxShadow: '0 8px 24px rgba(247, 140, 37, 0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.88rem',
          fontWeight: 700
        }}>
          <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Eyebrow and Page Title */}
      <div style={{ marginBottom: '16px', padding: '0 4px' }}>
        <div style={{
          fontSize: '0.72rem',
          fontWeight: 800,
          color: '#F78C25',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '4px'
        }}>
          ĐỒNG HÀNH & CỘNG ĐỒNG
        </div>
        <h1 style={{
          fontSize: '1.45rem',
          fontWeight: 900,
          color: '#133E35',
          margin: '0 0 6px 0',
          lineHeight: 1.2
        }}>
          Cùng Nhau Vận Động 🐾
        </h1>
        <p style={{
          fontSize: '0.86rem',
          color: '#4A6B63',
          margin: 0,
          lineHeight: 1.45
        }}>
          Không còn cảm giác tập một mình. Cùng Mochi và đồng nghiệp duy trì thói quen mỗi ngày!
        </p>
      </div>

      {/* Subtab Pill Navigation */}
      <div style={{
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        paddingBottom: '12px',
        scrollbarWidth: 'none',
        marginBottom: '14px'
      }}>
        {subTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 800,
                border: 'none',
                backgroundColor: isActive ? '#133E35' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : '#4A6B63',
                boxShadow: isActive ? '0 2px 8px rgba(19, 62, 53, 0.2)' : '0 1px 3px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: CHALLENGES ================= */}
      {subTab === 'challenges' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {communityData.challenges.map(ch => {
            const targetWorkout = CURATED_WORKOUTS.find(w => w.id === ch.workoutTargetId) || CURATED_WORKOUTS[0];
            const percent = ch.daysTotal 
              ? Math.round((ch.daysCompleted / ch.daysTotal) * 100)
              : Math.round((ch.currentReps / ch.targetReps) * 100);

            return (
              <div
                key={ch.id}
                className="card-peach"
                style={{
                  position: 'relative',
                  padding: '18px 18px 16px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                {ch.isJoined && (
                  <div style={{
                    position: 'absolute',
                    top: '14px',
                    right: '14px',
                    backgroundColor: '#133E35',
                    color: '#FFFFFF',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '4px 10px',
                    borderRadius: '9999px'
                  }}>
                    Đang Tham Gia ✓
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    backgroundColor: '#FFFFFF',
                    color: '#F78C25',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }}>
                    {ch.category}
                  </span>
                  <span style={{ fontSize: '0.76rem', color: '#6A564C', fontWeight: 600 }}>
                    👥 {ch.participantsCount} đồng đội
                  </span>
                </div>

                <div>
                  <h3 style={{
                    fontSize: '1.08rem',
                    fontWeight: 900,
                    color: '#133E35',
                    margin: '0 0 4px 0'
                  }}>
                    {ch.title}
                  </h3>
                  <p style={{
                    fontSize: '0.82rem',
                    color: '#5C473C',
                    lineHeight: 1.45,
                    margin: 0
                  }}>
                    {ch.description}
                  </p>
                </div>

                {/* Progress Bar if Joined */}
                {ch.isJoined && (
                  <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.65)',
                    padding: '10px 12px',
                    borderRadius: '16px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', fontWeight: 800, marginBottom: '6px', color: '#133E35' }}>
                      <span>Tiến trình của bạn:</span>
                      <span style={{ color: '#F78C25' }}>
                        {ch.daysTotal ? `${ch.daysCompleted}/${ch.daysTotal} ngày (${percent}%)` : `${ch.currentReps}/${ch.targetReps} reps (${percent}%)`}
                      </span>
                    </div>
                    <div style={{ height: '7px', backgroundColor: 'rgba(19, 62, 53, 0.1)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ width: `${percent}%`, height: '100%', backgroundColor: '#F78C25', borderRadius: '999px', transition: 'width 0.3s ease' }} />
                    </div>
                  </div>
                )}

                {/* Rewards and Actions */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '4px',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem' }}>
                    <span style={{
                      backgroundColor: '#FFFFFF',
                      color: '#133E35',
                      padding: '3px 8px',
                      borderRadius: '8px',
                      fontWeight: 800
                    }}>
                      🏅 {ch.rewardBadge}
                    </span>
                    <span style={{
                      backgroundColor: 'rgba(114, 213, 195, 0.4)',
                      color: '#133E35',
                      padding: '3px 8px',
                      borderRadius: '8px',
                      fontWeight: 800
                    }}>
                      +{ch.petExpReward} XP Mochi
                    </span>
                  </div>

                  <div>
                    {ch.isJoined ? (
                      <button
                        onClick={() => onStartWorkout(targetWorkout)}
                        className="btn-orange"
                        style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                      >
                        <Zap size={13} /> Tập Hôm Nay
                      </button>
                    ) : (
                      <button
                        onClick={() => handleJoinChallenge(ch.id, ch.title)}
                        style={{
                          backgroundColor: '#FFFFFF',
                          color: '#F78C25',
                          border: '2px solid #F78C25',
                          borderRadius: '9999px',
                          padding: '7px 16px',
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        Tham Gia
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* User's current rank card in Seafoam Mint */}
          <div className="card-mint" style={{
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: '#133E35',
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
                <div style={{ fontWeight: 900, fontSize: '0.98rem', color: '#133E35' }}>
                  Vị trí: Hạng 3 Tuần Này
                </div>
                <div style={{ fontSize: '0.78rem', color: '#2C5E53', marginTop: '2px' }}>
                  Cách Hạng 2 chỉ 14 phút vận động!
                </div>
              </div>
            </div>

            <button
              onClick={() => onStartWorkout(CURATED_WORKOUTS[0])}
              className="btn-orange"
              style={{ fontSize: '0.78rem', padding: '8px 14px' }}
            >
              <Zap size={13} /> Tập +3p
            </button>
          </div>

          {/* Leaderboard Table List */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
          }}>
            <div style={{
              padding: '12px 18px',
              backgroundColor: '#FEDFD2',
              fontWeight: 800,
              fontSize: '0.76rem',
              color: '#8A4828',
              letterSpacing: '0.04em'
            }}>
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
                      padding: '14px 16px',
                      borderBottom: '1px solid rgba(0,0,0,0.05)',
                      backgroundColor: isMe ? 'rgba(114, 213, 195, 0.18)' : 'transparent'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '26px',
                        fontWeight: 900,
                        fontSize: '1rem',
                        textAlign: 'center'
                      }}>
                        {item.rank === 1 ? '🥇' : (item.rank === 2 ? '🥈' : (item.rank === 3 ? '🥉' : `#${item.rank}`))}
                      </div>

                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: '#FEDFD2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem'
                      }}>
                        {item.avatar}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#133E35' }}>{item.name}</span>
                          {isMe && (
                            <span style={{
                              fontSize: '0.62rem',
                              fontWeight: 800,
                              backgroundColor: '#133E35',
                              color: '#FFFFFF',
                              padding: '2px 6px',
                              borderRadius: '9999px'
                            }}>
                              Bạn
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#7E9F97', marginTop: '2px' }}>
                          {item.company}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 900, fontSize: '0.96rem', color: '#F78C25' }}>
                        {item.minutes} <span style={{ fontSize: '0.74rem', fontWeight: 600 }}>phút</span>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#E0751A', fontWeight: 700 }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {communityData.activityFeed.map(feed => (
            <div
              key={feed.id}
              className="card-peach"
              style={{
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  flexShrink: 0,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                }}>
                  {feed.avatar}
                </div>

                <div>
                  <div style={{ fontSize: '0.84rem', lineHeight: 1.4, color: '#133E35' }}>
                    <strong>{feed.userName}</strong> <span style={{ color: '#6A564C' }}>{feed.action}</span> <strong>{feed.workoutTitle}</strong>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#8A756C', marginTop: '2px' }}>
                    {feed.timeAgo}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleCheer(feed.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  border: feed.isCheered ? '1.5px solid #EF4444' : '1px solid rgba(19,62,53,0.15)',
                  backgroundColor: feed.isCheered ? '#FEE2E2' : '#FFFFFF',
                  color: feed.isCheered ? '#EF4444' : '#133E35',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.15s ease'
                }}
              >
                <Heart size={14} fill={feed.isCheered ? '#EF4444' : 'none'} />
                <span>{feed.cheers}</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ================= TAB 4: CO-WORKOUT ROOM ================= */}
      {subTab === 'coworkout' && (
        <div className="card-mint" style={{ padding: '24px 18px', textAlign: 'center' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#133E35',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px auto'
          }}>
            <Users size={28} />
          </div>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#133E35', margin: '0 0 6px 0' }}>
            Phòng Vận Động Đôi
          </h3>
          <p style={{ fontSize: '0.84rem', color: '#2C5E53', margin: '0 auto 16px auto', lineHeight: 1.45 }}>
            Rủ đồng nghiệp cùng bàn mở phòng tập chung 3 phút. Cùng theo dõi số rep qua Camera AI!
          </p>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 16px',
            borderRadius: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            border: '2px dashed #133E35',
            marginBottom: '18px'
          }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4A6B63' }}>Mã phòng:</span>
            <span style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '0.05em', color: '#133E35' }}>
              {roomCode}
            </span>
            <button
              onClick={handleCopyRoomCode}
              style={{
                backgroundColor: '#133E35',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '5px 10px',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {isCopied ? 'Đã sao chép' : 'Sao chép'}
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={() => {
                showToast('Đang kết nối phòng đồng nghiệp...');
                setTimeout(() => onStartWorkout(CURATED_WORKOUTS[0]), 800);
              }}
              className="btn-orange"
              style={{ padding: '10px 24px', fontSize: '0.92rem' }}
            >
              <Zap size={16} /> Bắt Đầu Phòng Ngay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

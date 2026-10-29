import React from 'react';
import { Calendar, Award, Heart, CheckCircle2 } from 'lucide-react';

export const ProgressView = ({ workoutHistory = [] }) => {
  const totalMinutes = workoutHistory.reduce((acc, curr) => acc + (Math.round((curr.totalSecondsMoved || 0) / 60) || 2), 0);
  const totalSessions = workoutHistory.length;

  const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const todayIndex = (new Date().getDay() + 6) % 7; // 0 for Mon, 6 for Sun

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', width: '100%', paddingBottom: 'var(--space-12)' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '6px' }}>Thói Quen Vận Động</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          Thói quen bền vững được xây dựng từ sự đều đặn nhẹ nhàng, không phải từ việc ép buộc bản thân quá mức.
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-brand-primary)', marginBottom: '8px' }}>
            <Award size={22} />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase' }}>Số Buổi Đã Tập</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
            {totalSessions}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Khoảng nghỉ vận động đã hoàn thành
          </div>
        </div>

        <div className="card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-accent)', marginBottom: '8px' }}>
            <Calendar size={22} />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase' }}>Thời Lượng Vận Động</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
            {totalMinutes} <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>phút</span>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Tổng thời gian thư giãn cơ thể
          </div>
        </div>
      </div>

      {/* Non-Guilt Weekly Movement Rhythm */}
      <div className="card" style={{ marginBottom: '24px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Nhịp Điệu Tuần Này</h2>
            <div style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)' }}>
              Ngày nghỉ ngơi và ngày vận động đều được trân trọng như nhau
            </div>
          </div>
        </div>

        {/* Days Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center' }}>
          {daysOfWeek.map((day, idx) => {
            const isToday = idx === todayIndex;
            const hasActivity = idx === todayIndex && totalSessions > 0;
            return (
              <div
                key={day}
                style={{
                  padding: '14px 6px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: hasActivity
                    ? 'var(--color-brand-light)'
                    : isToday
                    ? 'var(--color-surface-subtle)'
                    : 'var(--color-surface)',
                  border: isToday ? '2px solid var(--color-brand-primary)' : '1px solid var(--color-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                  {day}
                </span>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: hasActivity ? 'var(--color-brand-primary)' : 'transparent',
                  color: hasActivity ? '#FFFFFF' : 'var(--color-text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem'
                }}>
                  {hasActivity ? <CheckCircle2 size={18} /> : (isToday ? '•' : '—')}
                </div>
              </div>
            );
          })}
        </div>

        {/* Gentle Rest Principle */}
        <div style={{
          marginTop: '22px',
          padding: '14px 18px',
          backgroundColor: 'var(--color-surface-subtle)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          fontSize: '0.86rem',
          color: 'var(--color-text-secondary)'
        }}>
          <Heart size={22} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
          <span>
            <strong>Không lo lắng đứt chuỗi:</strong> Cuộc sống luôn có lúc bận rộn. Nghỉ ngơi khi mệt mỏi là một phần thiết yếu để duy trì thói quen dài lâu.
          </span>
        </div>
      </div>

      {/* Recent Movement Log */}
      <div className="card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>Các Phiên Vận Động Gần Đây</h2>
        {workoutHistory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '28px 0', color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
            Chưa có buổi tập nào. Hãy thử bài tập 3 phút cho bàn làm việc ngay hôm nay nhé!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {workoutHistory.slice(0, 5).map((session, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--color-surface-subtle)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>{session.workoutTitle}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    {session.isFullCompletion ? 'Hoàn thành trọn vẹn' : 'Phiên tập ngắn nhẹ nhàng'} • {Math.round((session.totalSecondsMoved || 0) / 60)} phút
                    {session.usedCamera && ` • Camera AI ghi nhận ${session.cameraRepsCount || 0} nhịp`}
                  </div>
                </div>
                <span className={`badge ${session.isFullCompletion ? 'badge-brand' : 'badge-amber'}`}>
                  {session.isFullCompletion ? 'Hoàn tất' : 'Đã ghi nhận'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

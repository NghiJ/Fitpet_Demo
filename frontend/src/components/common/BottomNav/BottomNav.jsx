import React, { useState, useEffect } from 'react';
import { Zap, Dumbbell, Clock, Users, Heart, Award, User } from 'lucide-react';
import { petService } from '../../../features/pet/services/petService';

export const BottomNav = ({ activeTab, onSelectTab }) => {
  const [petData, setPetData] = useState(() => petService.getPetData());

  useEffect(() => {
    const unsub = petService.subscribe(setPetData);
    return () => unsub();
  }, []);

  const tabs = [
    { id: 'home', label: 'Trang chủ', icon: Zap },
    { id: 'library', label: 'Khám phá', icon: Dumbbell },
    { id: 'reminders', label: 'Nhắc nhở', icon: Clock },
    { id: 'community', label: 'Cộng đồng', icon: Users },
    { id: 'pet', label: petData.customName || 'Thú cưng', icon: Heart },
    { id: 'progress', label: 'Tiến độ', icon: Award },
    { id: 'profile', label: 'Cá nhân', icon: User }
  ];

  return (
    <nav className="bottom-nav" aria-label="Điều hướng chính">
      <div className="app-container">
        <ul className="nav-links">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <li key={tab.id}>
                <button
                  className={`nav-item-btn ${isActive ? 'active' : ''}`}
                  onClick={() => onSelectTab(tab.id)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{tab.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

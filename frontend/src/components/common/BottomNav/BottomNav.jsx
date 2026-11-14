import React, { useState, useEffect } from 'react';
import { Dumbbell, Sparkles, PawPrint, BookOpen, User } from 'lucide-react';
import { petService } from '../../../features/pet/services/petService';

export const BottomNav = ({ activeTab, onSelectTab }) => {
  const [petData, setPetData] = useState(() => petService.getPetData());

  useEffect(() => {
    const unsub = petService.subscribe(setPetData);
    return () => unsub();
  }, []);

  const tabs = [
    { id: 'home', label: 'Hôm nay', icon: Sparkles },
    { id: 'library', label: 'Bài tập', icon: Dumbbell },
    { id: 'pet', label: 'Thú cưng', icon: PawPrint },
    { id: 'companion', label: 'Đồng hành', icon: BookOpen },
    { id: 'profile', label: 'Cá nhân', icon: User }
  ];

  return (
    <nav className="bottom-nav" aria-label="Điều hướng chính">
      <div className="bottom-nav-capsule">
        <ul className="nav-links">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            // Map companion tab to either 'reminders', 'community' or 'progress'
            const isActive = activeTab === tab.id || (tab.id === 'companion' && ['reminders', 'community', 'progress', 'companion'].includes(activeTab));
            return (
              <li key={tab.id} style={{ listStyle: 'none' }}>
                <button
                  className={`nav-item-btn ${isActive ? 'active' : ''}`}
                  onClick={() => onSelectTab(tab.id === 'companion' ? 'community' : tab.id)}
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


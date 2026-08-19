'use strict';
'use client';

import React from 'react';
import {
  Activity,
  UserCheck,
  Camera,
  Calendar,
  UploadCloud,
  Clock,
  Bell,
  LogOut,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function PhotographerSidebar({ activeTab, setActiveTab, user, onLogout }) {
  const navItems = [
    { id: 'performance', label: 'Performance Dashboard', icon: Activity },
    { id: 'profile', label: 'Profile & Experience', icon: UserCheck },
    { id: 'portfolio', label: 'Portfolio Showcase', icon: Camera },
    { id: 'events', label: 'Assigned & Upcoming', icon: Calendar },
    { id: 'upload', label: 'Gallery Proof Upload', icon: UploadCloud },
    { id: 'availability', label: 'Availability & Calendar', icon: Clock },
    { id: 'notifications', label: 'Notifications Hub', icon: Bell },
  ];

  return (
    <aside className="w-[280px] bg-surface-0 dark:bg-[#121220] border-r border-borderColor dark:border-[#C8A96E]/20 flex flex-col justify-between h-screen sticky top-0 left-0 z-40 flex-shrink-0 transition-colors duration-300">
      {/* Top Section */}
      <div className="p-7">
        {/* Logo / Brand */}
        <div className="flex items-center gap-3 mb-9">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C8A96E] to-[#9A7B4F] flex items-center justify-center text-[#121220] font-extrabold text-xl shadow-md">
            PH
          </div>
          <div>
            <div className="text-lg font-bold text-textPalette-primary dark:text-[#F8F6F3] tracking-wide">
              Moment<span className="text-brand-primary dark:text-[#C8A96E]">Grid</span>
            </div>
            <div className="text-[11px] text-textPalette-secondary dark:text-[#9A9AA6] uppercase tracking-[0.12em] mt-0.5 flex items-center gap-1 font-semibold">
              <Sparkles size={11} className="text-brand-primary dark:text-[#C8A96E]" /> Artist Portal
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border-none text-sm transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-brand-primary/15 text-brand-primary dark:text-[#C8A96E] font-bold shadow-sm'
                    : 'bg-transparent text-textPalette-secondary dark:text-[#B8B8C6] hover:bg-surface-2 dark:hover:bg-white/5 hover:text-textPalette-primary dark:hover:text-[#F8F6F3] font-medium'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon
                    size={19}
                    className={isActive ? 'text-brand-primary dark:text-[#C8A96E]' : 'text-textPalette-muted dark:text-[#9A9AA6]'}
                  />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight size={16} className="text-brand-primary dark:text-[#C8A96E]" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Info & Logout */}
      <div className="p-5 border-t border-borderColor dark:border-white/10 bg-surface-1 dark:bg-black/20 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-brand-primary/20 border border-brand-primary/50 flex items-center justify-center text-brand-primary dark:text-[#C8A96E] font-bold text-sm flex-shrink-0">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'P'}
            </div>
            <div className="overflow-hidden min-w-0">
              <div className="text-xs font-bold text-textPalette-primary dark:text-[#F8F6F3] truncate">
                {user?.fullName || 'Photographer Artist'}
              </div>
              <div className="text-[11px] text-brand-primary dark:text-[#C8A96E] capitalize font-medium">
                Lead Photographer
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Sign out"
            className="bg-transparent border-none text-textPalette-muted dark:text-[#9A9AA6] hover:text-red-500 p-2 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}

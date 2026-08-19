'use strict';
'use client';

import React from 'react';
import { Search, Bell, Plus, Sparkles, RefreshCw } from 'lucide-react';

export default function StudioHeader({ title, subtitle, onRefresh, isRefreshing, onQuickAction, quickActionLabel }) {
  return (
    <header className="h-[84px] bg-surface-0 dark:bg-[#161628] border-b border-borderColor dark:border-white/10 flex items-center justify-between px-9 sticky top-0 z-30 transition-colors duration-300">
      <div>
        <h1 className="text-xl font-bold text-textPalette-primary dark:text-[#F8F6F3] m-0">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-textPalette-secondary dark:text-[#9A9AA6] mt-1 m-0">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Quick Search input */}
        <div className="relative w-64">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textPalette-muted dark:text-[#7A7A8C]"
          />
          <input
            type="text"
            placeholder="Search bookings, clients..."
            className="w-full bg-surface-1 dark:bg-white/5 border border-borderColor dark:border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-textPalette-primary dark:text-[#F8F6F3] text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all duration-200"
          />
        </div>

        {/* Refresh button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh Studio Data"
            className="bg-surface-1 dark:bg-white/5 border border-borderColor dark:border-white/12 text-textPalette-primary dark:text-[#F8F6F3] rounded-xl p-2.5 hover:bg-surface-2 dark:hover:bg-white/10 transition-colors disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
          >
            <RefreshCw
              size={16}
              className={`${isRefreshing ? 'animate-spin' : ''} text-brand-primary dark:text-[#C8A96E]`}
            />
          </button>
        )}

        {/* Quick Action Button */}
        {onQuickAction && (
          <button
            onClick={onQuickAction}
            className="bg-gradient-to-r from-[#C8A96E] to-[#9A7B4F] text-[#121220] border-none rounded-xl px-5 py-2.5 font-semibold text-sm flex items-center gap-2 shadow-md hover:opacity-95 transition-all cursor-pointer transform active:scale-[0.98]"
          >
            <Plus size={16} />
            <span>{quickActionLabel || 'New Action'}</span>
          </button>
        )}
      </div>
    </header>
  );
}

'use strict';
'use client';

import React, { useState } from 'react';
import { Search, RefreshCw, Bell, Calendar, CreditCard, HeartHandshake } from 'lucide-react';

export default function ClientHeader({ activeTabName, onRefresh, unreadCount = 0, onRequestBooking, onQuickPay }) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshClick = async () => {
    setIsRefreshing(true);
    if (onRefresh) await onRefresh();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <header className="h-[72px] bg-surface-0 dark:bg-[#121220] border-b border-borderColor dark:border-[#C8A96E]/20 flex items-center justify-between px-8 sticky top-0 z-30 transition-colors duration-300">
      {/* Left: Active Tab Title & VIP Status Badge */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-textPalette-primary dark:text-[#F8F6F3] m-0">
          {activeTabName || 'Client VIP Portal'}
        </h1>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/30 text-[11px] font-semibold text-brand-primary dark:text-[#C8A96E]">
          <HeartHandshake size={13} /> VIP Patron Status
        </div>
      </div>

      {/* Right: Search, Refresh, Notifications, Quick Actions */}
      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="relative w-[220px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-textPalette-muted dark:text-[#9A9AA6]"
          />
          <input
            type="text"
            placeholder="Search bookings, proofs..."
            className="w-full bg-surface-2 dark:bg-white/5 border border-borderColor dark:border-white/10 rounded-lg py-2 pr-3 pl-9 text-textPalette-primary dark:text-[#F8F6F3] text-xs outline-none focus:border-brand-primary transition-colors"
          />
        </div>

        {/* Sync Refresh Button */}
        <button
          onClick={handleRefreshClick}
          title="Sync Portal Data"
          className="bg-transparent border border-borderColor dark:border-white/15 rounded-lg py-2 px-3 flex items-center gap-1.5 text-textPalette-secondary dark:text-[#B8B8C6] text-xs cursor-pointer hover:bg-surface-2 dark:hover:bg-white/5 transition-all"
        >
          <RefreshCw size={15} className={`${isRefreshing ? 'animate-spin' : ''} text-brand-primary dark:text-[#C8A96E]`} />
          <span>Sync</span>
        </button>

        {/* Quick Actions */}
        <button
          onClick={onRequestBooking}
          className="bg-surface-1 dark:bg-white/5 border border-brand-primary/30 rounded-lg py-2 px-3.5 flex items-center gap-2 text-textPalette-primary dark:text-[#F8F6F3] text-xs font-semibold cursor-pointer hover:bg-surface-2 transition-colors"
        >
          <Calendar size={15} className="text-brand-primary dark:text-[#C8A96E]" />
          <span>Request Session</span>
        </button>

        <button
          onClick={onQuickPay}
          className="bg-gradient-to-r from-[#C8A96E] to-[#9A7B4F] border-none rounded-lg py-2 px-4 flex items-center gap-2 text-[#121220] text-xs font-bold cursor-pointer shadow-md hover:brightness-105 transition-all"
        >
          <CreditCard size={16} />
          <span>Pay Invoices</span>
        </button>
      </div>
    </header>
  );
}

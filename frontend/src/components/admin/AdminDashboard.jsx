'use strict';
'use client';

import React, { useState } from 'react';
import { Search, Bell } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import AdminOverviewPanel from './AdminOverviewPanel';
import AdminUsersPanel from './AdminUsersPanel';
import AdminStudiosPanel from './AdminStudiosPanel';
import AdminPhotographersPanel from './AdminPhotographersPanel';
import AdminClientsPanel from './AdminClientsPanel';
import AdminReportsPanel from './AdminReportsPanel';
import AdminRevenuePanel from './AdminRevenuePanel';
import AdminAnalyticsPanel from './AdminAnalyticsPanel';
import AdminSubscriptionsPanel from './AdminSubscriptionsPanel';
import AdminSettingsPanel from './AdminSettingsPanel';
import AdminActivityLogsPanel from './AdminActivityLogsPanel';

const PANEL_MAP = {
  overview: AdminOverviewPanel,
  users: AdminUsersPanel,
  studios: AdminStudiosPanel,
  photographers: AdminPhotographersPanel,
  clients: AdminClientsPanel,
  reports: AdminReportsPanel,
  revenue: AdminRevenuePanel,
  analytics: AdminAnalyticsPanel,
  subscriptions: AdminSubscriptionsPanel,
  settings: AdminSettingsPanel,
  activity: AdminActivityLogsPanel,
};

const PANEL_TITLES = {
  overview: 'Platform Overview',
  users: 'User Management',
  studios: 'Studios Directory',
  photographers: 'Photographers Roster',
  clients: 'Client Management',
  reports: 'Reports Centre',
  revenue: 'Revenue Command Centre',
  analytics: 'Analytics Dashboard',
  subscriptions: 'Subscription Management',
  settings: 'Platform Settings',
  activity: 'Activity Logs',
};

/**
 * AdminDashboard — Master Super Admin Command Centre orchestrator.
 * Renders the sidebar + dynamic panel based on activePanel state.
 */
export default function AdminDashboard() {
  const [activePanel, setActivePanel] = useState('overview');

  const ActivePanel = PANEL_MAP[activePanel] || AdminOverviewPanel;

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A14] text-white">
      {/* Sidebar */}
      <AdminSidebar
        activePanel={activePanel}
        onPanelChange={setActivePanel}
        unreadAlerts={3}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="flex-shrink-0 flex items-center justify-between gap-4 px-6 py-4 border-b border-white/[0.06] bg-[#0A0A14]/80 backdrop-blur-xl">
          <div>
            <h1 className="text-base font-black text-white tracking-tight">
              {PANEL_TITLES[activePanel]}
            </h1>
            <p className="text-[10px] text-white/40 font-medium">
              MomentGrid Super Admin · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Global Search */}
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 w-48">
              <Search className="w-3.5 h-3.5 text-white/30" />
              <input id="input-admin-global-search" type="text" placeholder="Quick search..."
                className="flex-1 bg-transparent text-xs text-white placeholder-white/30 focus:outline-none" />
              <kbd className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/30 font-mono">⌘K</kbd>
            </div>

            {/* Notification Bell */}
            <button id="btn-admin-header-bell" className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-rose-400 text-[8px] font-black text-white flex items-center justify-center">3</span>
            </button>

            {/* Admin Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C8A96E] to-[#a8894e] flex items-center justify-center shadow-lg shadow-[#C8A96E]/20">
              <span className="text-[11px] font-black text-[#0A0A14]">SA</span>
            </div>
          </div>
        </header>

        {/* Scrollable Panel Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <ActivePanel />
          </div>
        </main>
      </div>
    </div>
  );
}

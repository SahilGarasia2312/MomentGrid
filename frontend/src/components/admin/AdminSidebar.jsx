'use strict';
'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard, Users, Building2, Camera, UserCheck, FileBarChart2,
  DollarSign, BarChart3, CreditCard, Settings, ScrollText,
  ChevronLeft, ChevronRight, Shield, LogOut, Bell,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: null },
  { id: 'users', label: 'Users', icon: Users, badge: null },
  { id: 'studios', label: 'Studios', icon: Building2, badge: null },
  { id: 'photographers', label: 'Photographers', icon: Camera, badge: null },
  { id: 'clients', label: 'Clients', icon: UserCheck, badge: null },
  { id: 'reports', label: 'Reports', icon: FileBarChart2, badge: null },
  { id: 'revenue', label: 'Revenue', icon: DollarSign, badge: null },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
  { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard, badge: null },
  { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  { id: 'activity', label: 'Activity Logs', icon: ScrollText, badge: null },
];

export default function AdminSidebar({ activePanel, onPanelChange, unreadAlerts = 0 }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay backdrop */}
      <div className="lg:hidden" />

      {/* Sidebar */}
      <aside
        className={`relative flex flex-col h-full bg-[#0D0D1A] border-r border-white/[0.07] transition-all duration-300 ease-in-out
          ${collapsed ? 'w-[72px]' : 'w-64'}`}
        style={{ boxShadow: '4px 0 32px rgba(0,0,0,0.4)' }}
      >
        {/* Glassmorphism header */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
          <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-[#C8A96E] to-[#a8894e] flex items-center justify-center shadow-lg shadow-[#C8A96E]/20">
            <Shield className="w-5 h-5 text-[#0A0A14]" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-black text-white tracking-tight">MomentGrid</p>
              <p className="text-[10px] font-bold text-[#C8A96E] uppercase tracking-widest">Super Admin</p>
            </div>
          )}
          <button
            id="btn-sidebar-collapse"
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto flex-shrink-0 w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white flex items-center justify-center transition-all"
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 space-y-0.5 px-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePanel === item.id;

            return (
              <button
                key={item.id}
                id={`btn-admin-nav-${item.id}`}
                onClick={() => onPanelChange(item.id)}
                title={collapsed ? item.label : undefined}
                className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200
                  ${isActive
                    ? 'bg-[#C8A96E]/15 text-[#C8A96E] border border-[#C8A96E]/20'
                    : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
              >
                {/* Active left bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#C8A96E] rounded-r-full" />
                )}

                <Icon className={`flex-shrink-0 w-4.5 h-4.5 ${isActive ? 'text-[#C8A96E]' : 'text-white/50 group-hover:text-white'} transition-colors`} style={{ width: '1.125rem', height: '1.125rem' }} />

                {!collapsed && (
                  <span className="text-xs font-semibold truncate flex-1">{item.label}</span>
                )}

                {!collapsed && item.id === 'overview' && unreadAlerts > 0 && (
                  <span className="flex-shrink-0 text-[10px] font-black px-1.5 py-0.5 rounded-full bg-rose-400/20 text-rose-400">
                    {unreadAlerts}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Admin profile footer */}
        <div className="border-t border-white/5 px-3 py-3">
          <div className={`flex items-center gap-3 px-2 py-2 rounded-xl ${!collapsed ? 'bg-white/[0.03]' : ''}`}>
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#C8A96E]/40 to-[#C8A96E]/10 border border-[#C8A96E]/30 flex items-center justify-center">
              <span className="text-xs font-black text-[#C8A96E]">SA</span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-white truncate">Super Admin</p>
                <p className="text-[10px] text-white/40 truncate">superadmin@momentgrid.com</p>
              </div>
            )}
            {!collapsed && (
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-lg text-white/40 hover:text-[#C8A96E] hover:bg-[#C8A96E]/10 transition-all" title="Notifications">
                  <Bell className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 rounded-lg text-white/40 hover:text-rose-400 hover:bg-rose-400/10 transition-all" title="Logout">
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

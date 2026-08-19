'use strict';
'use client';

import React from 'react';
import { FileBarChart2, Download, TrendingUp, Users, DollarSign, Camera, Bell, LayoutGrid } from 'lucide-react';

const REPORT_CARDS = [
  { id: 'user-report', icon: Users, label: 'User Report', desc: 'All users by role, status, and join date', color: 'text-[#C8A96E]', bg: 'bg-[#C8A96E]/10', border: 'border-[#C8A96E]/20' },
  { id: 'revenue-report', icon: DollarSign, label: 'Revenue Report', desc: 'Platform-wide collections, outstanding, MRR', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  { id: 'booking-report', icon: LayoutGrid, label: 'Booking Report', desc: 'All bookings by status, studio, and client', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
  { id: 'photographer-report', icon: Camera, label: 'Photographer Report', desc: 'Performance, sessions, ratings per photographer', color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
  { id: 'gallery-report', icon: TrendingUp, label: 'Gallery Report', desc: 'Upload volumes, storage usage, delivery times', color: 'text-sky-400', bg: 'bg-sky-400/10', border: 'border-sky-400/20' },
  { id: 'notification-report', icon: Bell, label: 'Notification Report', desc: 'Dispatch logs, open rates, channel breakdown', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
];

const SAMPLE_DATA = [
  { label: 'Total Users', value: '1,284', delta: '+12%', positive: true },
  { label: 'Active Studios', value: '47', delta: '+5%', positive: true },
  { label: 'Revenue MTD', value: '$41,800', delta: '+9%', positive: true },
  { label: 'Suspended Accounts', value: '12', delta: '+2', positive: false },
  { label: 'Bookings This Month', value: '92', delta: '+8%', positive: true },
  { label: 'Galleries Uploaded', value: '73', delta: '+20%', positive: true },
];

export default function AdminReportsPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-white">Reports Centre</h2>
        <p className="text-xs text-white/40 mt-0.5">Generate and export platform data reports</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {SAMPLE_DATA.map((s) => (
          <div key={s.label} className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">{s.label}</p>
            <p className="text-2xl font-black text-white">{s.value}</p>
            <p className={`text-[10px] font-bold mt-1 ${s.positive ? 'text-emerald-400' : 'text-rose-400'}`}>{s.delta} vs last month</p>
          </div>
        ))}
      </div>

      {/* Report Generator Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {REPORT_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.id} className={`group bg-white/[0.03] border ${card.border} hover:${card.bg} rounded-2xl p-5 transition-all duration-300 cursor-pointer`}>
              <div className={`w-10 h-10 rounded-xl ${card.bg} border ${card.border} flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">{card.label}</h3>
              <p className="text-[11px] text-white/40 mb-4 leading-relaxed">{card.desc}</p>
              <div className="flex items-center gap-2">
                <button id={`btn-export-${card.id}`}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${card.bg} border ${card.border} ${card.color} text-[10px] font-bold transition-all hover:opacity-80`}>
                  <Download className="w-3 h-3" />
                  Export CSV
                </button>
                <button className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-[10px] font-bold hover:text-white transition-all">
                  Preview
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Note */}
      <div className="bg-[#C8A96E]/5 border border-[#C8A96E]/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <FileBarChart2 className="w-4 h-4 text-[#C8A96E] flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-white/60 leading-relaxed">
            Report exports are generated in real-time from live database aggregations. CSV exports are formatted for Excel and Google Sheets compatibility. For large datasets, exports run asynchronously and are emailed to <span className="text-[#C8A96E]">superadmin@momentgrid.com</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

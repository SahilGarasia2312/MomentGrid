'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Camera, CalendarCheck, Bell, RefreshCw, TrendingUp } from 'lucide-react';
import { adminApi } from '../../lib/api/adminApi';

// Generic SVG line chart
function LineChart({ data, color = '#C8A96E', keyField = '_id', valueField = 'count' }) {
  if (!data?.length) return <div className="h-20 flex items-center justify-center text-white/30 text-xs">No data</div>;
  const values = data.map((d) => d[valueField] || 0);
  const min = Math.min(...values);
  const max = Math.max(...values) || 1;
  const W = 300, H = 60;
  const pts = values.map((v, i) => {
    const x = (i / Math.max(values.length - 1, 1)) * W;
    const y = H - ((v - min) / (max - min || 1)) * H;
    return `${x},${y}`;
  }).join(' ');
  const area = `0,${H} ${pts} ${W},${H}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-16" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#grad-${color.replace('#', '')})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Role distribution bars (horizontal)
function RoleDistBar({ data }) {
  const total = data?.reduce((s, d) => s + d.count, 0) || 1;
  const COLORS = { admin: '#C8A96E', studio_owner: '#a78bfa', photographer: '#60a5fa', client: '#4ade80' };
  return (
    <div className="space-y-2">
      {(data || []).map((d) => (
        <div key={d.role}>
          <div className="flex justify-between mb-1">
            <span className="text-[10px] font-bold text-white/60 capitalize">{d.role?.replace(/_/g, ' ')}</span>
            <span className="text-[10px] font-bold text-white">{d.count} <span className="text-white/40">({Math.round((d.count / total) * 100)}%)</span></span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${(d.count / total) * 100}%`, backgroundColor: COLORS[d.role] || '#6b7280' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// Notification type ring
function NotifTypeRing({ data }) {
  const total = data?.reduce((s, d) => s + d.count, 0) || 1;
  const COLORS = { gallery_ready: '#C8A96E', booking_update: '#60a5fa', album_ready: '#a78bfa', payment_reminder: '#4ade80' };
  return (
    <div className="grid grid-cols-2 gap-2">
      {(data || []).map((d) => (
        <div key={d.type} className="bg-white/5 rounded-xl p-3">
          <div className="w-2 h-2 rounded-full mb-2" style={{ backgroundColor: COLORS[d.type] || '#6b7280' }} />
          <p className="text-lg font-black text-white">{d.count}</p>
          <p className="text-[9px] text-white/40 capitalize">{d.type?.replace(/_/g, ' ')}</p>
        </div>
      ))}
    </div>
  );
}

export default function AdminAnalyticsPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAnalyticsData();
      if (res?.data) setData(res.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const skeleton = <div className="h-16 bg-white/5 rounded-lg animate-pulse" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">Analytics Dashboard</h2>
          <p className="text-xs text-white/40 mt-0.5">Platform growth and activity metrics</p>
        </div>
        <button id="btn-analytics-refresh" onClick={load}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* User Growth */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-[#C8A96E]" />
            <h3 className="text-sm font-bold text-white">User Registrations — Last 30 Days</h3>
          </div>
          {loading ? skeleton : <LineChart data={data?.userGrowth} color="#C8A96E" keyField="_id" valueField="count" />}
          <div className="mt-2 flex justify-between text-[9px] text-white/30">
            <span>{data?.userGrowth?.[0]?._id?.slice(5)}</span>
            <span>{data?.userGrowth?.[data?.userGrowth?.length - 1]?._id?.slice(5)}</span>
          </div>
        </div>

        {/* Role Distribution */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white">User Role Distribution</h3>
          </div>
          {loading ? skeleton : <RoleDistBar data={data?.roleDistribution} />}
        </div>

        {/* Bookings by Month */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <CalendarCheck className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Bookings Per Month — Last 12 Months</h3>
          </div>
          {loading ? skeleton : <LineChart data={data?.bookingsByMonth} color="#60a5fa" keyField="month" valueField="count" />}
        </div>

        {/* Gallery Uploads by Week */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Camera className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Gallery Uploads — Last 8 Weeks</h3>
          </div>
          {loading ? skeleton : <LineChart data={data?.galleryUploads} color="#4ade80" keyField="week" valueField="count" />}
        </div>
      </div>

      {/* Notification Dispatch + Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-[#C8A96E]" />
            <h3 className="text-sm font-bold text-white">Notifications Dispatched — by Type</h3>
          </div>
          {loading ? skeleton : <NotifTypeRing data={data?.notificationsByType} />}
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Account Status Distribution</h3>
          </div>
          {loading ? skeleton : (
            <div className="space-y-3">
              {(data?.statusDistribution || []).map((s) => {
                const total = (data?.statusDistribution || []).reduce((a, d) => a + d.count, 0) || 1;
                const pct = Math.round((s.count / total) * 100);
                const colors = { active: 'bg-emerald-400', suspended: 'bg-rose-400', pending_verification: 'bg-amber-400' };
                return (
                  <div key={s.status}>
                    <div className="flex justify-between mb-1">
                      <span className="text-[11px] font-bold text-white/60 capitalize">{s.status?.replace(/_/g, ' ')}</span>
                      <span className="text-[11px] font-bold text-white">{s.count} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${colors[s.status] || 'bg-white/20'} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

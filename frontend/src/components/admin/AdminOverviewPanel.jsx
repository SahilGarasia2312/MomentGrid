'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import {
  Users, Building2, Camera, UserCheck, DollarSign,
  LayoutGrid, Clock, TrendingUp, RefreshCw, CheckCircle2, AlertCircle,
} from 'lucide-react';
import { adminApi } from '../../lib/api/adminApi';
import AdminStatCard from './AdminStatCard';

const formatTimeAgo = (iso) => {
  if (!iso) return 'never';
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const STATUS_COLORS = {
  active: 'text-emerald-400 bg-emerald-400/10',
  suspended: 'text-rose-400 bg-rose-400/10',
  pending_verification: 'text-amber-400 bg-amber-400/10',
  paid: 'text-emerald-400 bg-emerald-400/10',
  advance_paid: 'text-[#C8A96E] bg-[#C8A96E]/10',
  pending: 'text-amber-400 bg-amber-400/10',
  overdue: 'text-rose-400 bg-rose-400/10',
  refunded: 'text-purple-400 bg-purple-400/10',
};

const ROLE_COLORS = {
  admin: 'text-[#C8A96E]',
  studio_owner: 'text-purple-400',
  photographer: 'text-blue-400',
  client: 'text-emerald-400',
};

// Mini SVG sparkline from weekly signup data
function Sparkline({ data }) {
  if (!data || data.length < 2) return null;
  const values = data.map((d) => d.count);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const W = 200;
  const H = 48;
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * W;
    const y = H - ((v - min) / range) * H;
    return `${x},${y}`;
  }).join(' ');
  const areaPoints = `0,${H} ${points} ${W},${H}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-12" preserveAspectRatio="none">
      <defs>
        <linearGradient id="spark-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C8A96E" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#C8A96E" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#spark-grad)" />
      <polyline points={points} fill="none" stroke="#C8A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AdminOverviewPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getPlatformOverview();
      if (res?.data) setData(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const kpis = data?.kpis || {};

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">Platform Overview</h2>
          <p className="text-xs text-white/40 mt-0.5">
            {data?.generatedAt ? `Updated ${formatTimeAgo(data.generatedAt)}` : 'Loading metrics...'}
          </p>
        </div>
        <button id="btn-overview-refresh" onClick={load}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white/60 hover:text-white transition-all">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
        <AdminStatCard icon={Users} label="Total Users" value={kpis.totalUsers ?? 0} trend={12} color="gold" loading={loading} />
        <AdminStatCard icon={Building2} label="Studios" value={kpis.totalStudios ?? 0} trend={5} color="purple" loading={loading} />
        <AdminStatCard icon={Camera} label="Photographers" value={kpis.totalPhotographers ?? 0} trend={8} color="blue" loading={loading} />
        <AdminStatCard icon={UserCheck} label="Clients" value={kpis.totalClients ?? 0} trend={15} color="emerald" loading={loading} />
        <AdminStatCard icon={DollarSign} label="Total Revenue" value={kpis.totalRevenue ?? 0} trend={9} color="gold" loading={loading} format="currency" />
        <AdminStatCard icon={AlertCircle} label="Outstanding" value={kpis.totalOutstanding ?? 0} trend={-3} color="rose" loading={loading} format="currency" />
        <AdminStatCard icon={LayoutGrid} label="Bookings" value={kpis.totalBookings ?? 0} trend={22} color="sky" loading={loading} />
        <AdminStatCard icon={CheckCircle2} label="Active Users" value={kpis.activeUsers ?? 0} trend={7} color="emerald" loading={loading} />
      </div>

      {/* Weekly Signups Sparkline */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-[#C8A96E]" />
          <h3 className="text-sm font-bold text-white">New Registrations — Last 7 Days</h3>
        </div>
        {loading ? (
          <div className="h-12 bg-white/5 rounded-lg animate-pulse" />
        ) : (
          <Sparkline data={data?.weeklySignups || []} />
        )}
        <div className="flex justify-between mt-2">
          {(data?.weeklySignups || []).map((d) => (
            <div key={d._id} className="text-center">
              <p className="text-[10px] font-bold text-white/60">{d.count}</p>
              <p className="text-[9px] text-white/30">{d._id?.slice(5)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Signups + Recent Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Signups */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5">
            <Users className="w-4 h-4 text-[#C8A96E]" />
            <h3 className="text-sm font-bold text-white">Recent Signups</h3>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {loading ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="px-5 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-white/10 rounded w-32 animate-pulse" />
                  <div className="h-2.5 bg-white/5 rounded w-48 animate-pulse" />
                </div>
              </div>
            )) : (data?.recentSignups || []).map((u) => (
              <div key={u.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.03] transition-colors">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center">
                  <span className="text-xs font-black text-white/80">{u.fullName?.[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">{u.fullName}</p>
                  <p className="text-[10px] text-white/40 truncate">{u.email}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${ROLE_COLORS[u.role] || 'text-white/60'}`}>
                    {u.role?.replace('_', ' ')}
                  </span>
                  <span className="text-[9px] text-white/30">{formatTimeAgo(u.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5">
            <DollarSign className="w-4 h-4 text-[#C8A96E]" />
            <h3 className="text-sm font-bold text-white">Recent Invoices</h3>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {loading ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="px-5 py-3">
                <div className="h-3 bg-white/10 rounded w-40 animate-pulse mb-1.5" />
                <div className="h-2.5 bg-white/5 rounded w-56 animate-pulse" />
              </div>
            )) : (data?.recentPayments || []).map((p) => (
              <div key={p.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.03] transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white">{p.invoiceNumber}</p>
                  <p className="text-[10px] text-white/40 truncate">{p.clientEmail}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-bold text-white">
                    {p.currency === 'INR' ? '₹' : '$'}{Number(p.amountPaid).toLocaleString()}
                    <span className="text-white/30"> / {p.currency === 'INR' ? '₹' : '$'}{Number(p.amount).toLocaleString()}</span>
                  </p>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${STATUS_COLORS[p.status] || 'text-white/40 bg-white/5'}`}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

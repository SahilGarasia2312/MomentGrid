'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, RefreshCw, Trophy, BarChart2, Percent } from 'lucide-react';
import { adminApi } from '../../lib/api/adminApi';
import AdminStatCard from './AdminStatCard';

const formatCurrency = (v) => `$${Number(v || 0).toLocaleString()}`;

// Pure SVG Bar Chart for monthly MRR
function MrrBarChart({ data }) {
  if (!data?.length) return null;
  const max = Math.max(...data.map((d) => d.revenue), 1);
  const W = 100, BAR_W = 8, GAP = 4;
  const totalW = data.length * (BAR_W + GAP) - GAP;
  const H = 64;

  return (
    <svg viewBox={`0 0 ${totalW} ${H + 20}`} className="w-full h-24" preserveAspectRatio="none">
      <defs>
        <linearGradient id="bar-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C8A96E" stopOpacity="1" />
          <stop offset="100%" stopColor="#C8A96E" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {data.map((d, i) => {
        const barH = (d.revenue / max) * H;
        const x = i * (BAR_W + GAP);
        const y = H - barH;
        return (
          <g key={d.month}>
            <rect x={x} y={y} width={BAR_W} height={barH} rx="2" fill="url(#bar-grad)" />
            <text x={x + BAR_W / 2} y={H + 14} textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.3)">
              {d.month?.slice(5)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// Status donut chart (SVG)
function StatusDonut({ data }) {
  if (!data?.length) return null;
  const total = data.reduce((s, d) => s + d.count, 0) || 1;
  const colors = { paid: '#4ade80', advance_paid: '#C8A96E', pending: '#fbbf24', refunded: '#a78bfa', overdue: '#f87171' };
  const R = 40, CX = 50, CY = 50, strokeW = 12;
  let cumAngle = -90;

  return (
    <svg viewBox="0 0 100 100" className="w-28 h-28">
      {data.map((d) => {
        const angle = (d.count / total) * 360;
        const startRad = (cumAngle * Math.PI) / 180;
        const endRad = ((cumAngle + angle) * Math.PI) / 180;
        const x1 = CX + R * Math.cos(startRad);
        const y1 = CY + R * Math.sin(startRad);
        const x2 = CX + R * Math.cos(endRad);
        const y2 = CY + R * Math.sin(endRad);
        const largeArc = angle > 180 ? 1 : 0;
        const path = `M ${x1} ${y1} A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2}`;
        cumAngle += angle;
        return (
          <path key={d.status} d={path} fill="none"
            stroke={colors[d.status] || '#6b7280'} strokeWidth={strokeW} strokeLinecap="round" />
        );
      })}
      <text x={CX} y={CY - 4} textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">
        {data.reduce((s, d) => s + d.count, 0)}
      </text>
      <text x={CX} y={CY + 8} textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.4)">invoices</text>
    </svg>
  );
}

export default function AdminRevenuePanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getRevenueReport();
      if (res?.data) setData(res.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const kpis = data?.kpis || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">Revenue Command Centre</h2>
          <p className="text-xs text-white/40 mt-0.5">Platform-wide financial analytics</p>
        </div>
        <button id="btn-revenue-refresh" onClick={load}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <AdminStatCard icon={DollarSign} label="Total Collected" value={kpis.totalCollected ?? 0} trend={9} color="gold" loading={loading} format="currency" />
        <AdminStatCard icon={TrendingUp} label="Contract Volume" value={kpis.totalContractVolume ?? 0} trend={14} color="emerald" loading={loading} format="currency" />
        <AdminStatCard icon={BarChart2} label="Outstanding" value={kpis.totalOutstanding ?? 0} trend={-4} color="rose" loading={loading} format="currency" />
        <AdminStatCard icon={Percent} label="Refunded" value={kpis.totalRefunded ?? 0} trend={0} color="purple" loading={loading} format="currency" />
        <AdminStatCard icon={DollarSign} label="Avg Invoice" value={kpis.avgInvoiceValue ?? 0} trend={6} color="sky" loading={loading} format="currency" />
        <AdminStatCard icon={BarChart2} label="Total Invoices" value={kpis.totalInvoices ?? 0} trend={11} color="blue" loading={loading} />
      </div>

      {/* MRR Chart + Status Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5">
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-1">Monthly Revenue (MRR) — Last 12 Months</h3>
          <p className="text-[10px] text-white/40 mb-4">All currencies normalized to USD</p>
          {loading ? <div className="h-24 bg-white/5 rounded-lg animate-pulse" /> : <MrrBarChart data={data?.monthlyMRR || []} />}
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-4">Invoice Status Breakdown</h3>
          <div className="flex items-center gap-4">
            {loading ? <div className="w-28 h-28 rounded-full bg-white/5 animate-pulse" /> : <StatusDonut data={data?.statusBreakdown || []} />}
            <div className="space-y-1.5">
              {(data?.statusBreakdown || []).map((s) => (
                <div key={s.status} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{
                    backgroundColor: { paid: '#4ade80', advance_paid: '#C8A96E', pending: '#fbbf24', refunded: '#a78bfa', overdue: '#f87171' }[s.status] || '#6b7280'
                  }} />
                  <span className="text-[10px] text-white/60 capitalize">{s.status?.replace(/_/g, ' ')}</span>
                  <span className="text-[10px] font-bold text-white ml-auto">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Studios Leaderboard */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5">
          <Trophy className="w-4 h-4 text-[#C8A96E]" />
          <h3 className="text-sm font-bold text-white">Top Studios by Revenue</h3>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {loading ? Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="px-5 py-4 flex items-center gap-4">
              <div className="w-6 h-6 rounded-full bg-white/10 animate-pulse" />
              <div className="flex-1 h-3 bg-white/10 rounded animate-pulse" />
              <div className="w-24 h-3 bg-white/10 rounded animate-pulse" />
            </div>
          )) : (data?.topStudios || []).map((s, i) => {
            const maxRevenue = data.topStudios[0]?.totalCollected || 1;
            const pct = Math.round((s.totalCollected / maxRevenue) * 100);
            return (
              <div key={s.studioId} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black
                  ${i === 0 ? 'bg-[#C8A96E]/20 text-[#C8A96E]' : i === 1 ? 'bg-white/10 text-white/70' : 'bg-white/5 text-white/50'}`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-bold text-white truncate">{s.studioName}</p>
                    <p className="text-xs font-black text-[#C8A96E] ml-4 flex-shrink-0">{formatCurrency(s.totalCollected)}</p>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#C8A96E] to-[#C8A96E]/40 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-[9px] text-white/30 mt-0.5">{s.invoiceCount} invoices</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

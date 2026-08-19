'use strict';
'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * AdminStatCard — Reusable KPI metric card for the Super Admin dashboard.
 * Shows an icon, metric value, label, and trend delta badge.
 */
export default function AdminStatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendLabel,
  color = 'gold',
  loading = false,
  format = 'number',
  prefix = '',
  suffix = '',
}) {
  const colorMap = {
    gold: { icon: 'text-[#C8A96E]', bg: 'bg-[#C8A96E]/10', border: 'border-[#C8A96E]/20', glow: 'shadow-[#C8A96E]/10' },
    blue: { icon: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', glow: 'shadow-blue-400/10' },
    emerald: { icon: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', glow: 'shadow-emerald-400/10' },
    purple: { icon: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20', glow: 'shadow-purple-400/10' },
    rose: { icon: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20', glow: 'shadow-rose-400/10' },
    sky: { icon: 'text-sky-400', bg: 'bg-sky-400/10', border: 'border-sky-400/20', glow: 'shadow-sky-400/10' },
  };

  const c = colorMap[color] || colorMap.gold;

  const formatValue = (v) => {
    if (loading) return '—';
    if (format === 'currency') return `$${Number(v).toLocaleString()}`;
    if (format === 'inr') return `₹${Number(v).toLocaleString('en-IN')}`;
    return `${prefix}${Number(v).toLocaleString()}${suffix}`;
  };

  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
  const trendColor = trend > 0 ? 'text-emerald-400' : trend < 0 ? 'text-rose-400' : 'text-white/40';
  const trendBg = trend > 0 ? 'bg-emerald-400/10' : trend < 0 ? 'bg-rose-400/10' : 'bg-white/5';

  return (
    <div className={`group relative bg-white/[0.03] border ${c.border} rounded-2xl p-5 shadow-xl ${c.glow} hover:bg-white/[0.05] transition-all duration-300 overflow-hidden`}>
      {/* Background shimmer on hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${c.bg} rounded-2xl`} />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">
            {label}
          </p>
          {loading ? (
            <div className="h-8 w-24 bg-white/10 rounded-lg animate-pulse mb-1" />
          ) : (
            <p className="text-3xl font-black text-white tracking-tight">
              {formatValue(value)}
            </p>
          )}

          {trend !== undefined && !loading && (
            <div className={`mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${trendBg}`}>
              <TrendIcon className={`w-3 h-3 ${trendColor}`} />
              <span className={`text-[10px] font-bold ${trendColor}`}>
                {trend > 0 ? '+' : ''}{trend}% {trendLabel || 'vs last week'}
              </span>
            </div>
          )}
        </div>

        <div className={`flex-shrink-0 w-12 h-12 rounded-2xl ${c.bg} border ${c.border} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${c.icon}`} />
        </div>
      </div>
    </div>
  );
}

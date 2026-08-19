'use strict';
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ScrollText, Search, Filter, RefreshCw, User, Settings, FileBarChart2, LogIn, Shield } from 'lucide-react';
import { adminApi } from '../../lib/api/adminApi';

const TYPE_CONFIG = {
  user_update: { label: 'User Update', icon: User, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
  settings: { label: 'Settings', icon: Settings, color: 'text-[#C8A96E]', bg: 'bg-[#C8A96E]/10', border: 'border-[#C8A96E]/20' },
  report: { label: 'Report', icon: FileBarChart2, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
  login: { label: 'Login', icon: LogIn, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  other: { label: 'Other', icon: Shield, color: 'text-white/50', bg: 'bg-white/5', border: 'border-white/10' },
};

const TYPE_OPTS = ['all', 'user_update', 'settings', 'report', 'login', 'other'];

const formatTime = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const fullTime = (iso) => iso ? new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '';

export default function AdminActivityLogsPanel() {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getActivityLogs({ type, search, page, limit: 30 });
      if (res?.data) {
        setLogs(res.data.logs || []);
        setPagination(res.data.pagination || null);
      }
    } finally { setLoading(false); }
  }, [type, search, page]);

  useEffect(() => { load(); }, [load]);

  const handleSearch = (e) => { e.preventDefault(); setSearch(searchInput); setPage(1); };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-black text-white">Activity Logs</h2>
          <p className="text-xs text-white/40 mt-0.5">Chronological audit trail of all admin actions</p>
        </div>
        <button id="btn-activity-refresh" onClick={load}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <form onSubmit={handleSearch} className="flex-1 min-w-[180px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <input id="input-activity-search" type="text" value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search action or actor..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#C8A96E]/50 transition-colors" />
        </form>
        <select id="select-activity-type" value={type}
          onChange={(e) => { setType(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/70 focus:outline-none">
          {TYPE_OPTS.map((t) => <option key={t} value={t} className="bg-[#0A0A14]">{t === 'all' ? 'All Types' : t.replace('_', ' ')}</option>)}
        </select>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-[21px] top-0 bottom-0 w-px bg-gradient-to-b from-[#C8A96E]/30 via-white/5 to-transparent" />

        <div className="space-y-1">
          {loading ? Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-4 ml-[44px] py-3">
              <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse flex-shrink-0 -ml-[44px]" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-white/10 rounded w-64 animate-pulse" />
                <div className="h-2.5 bg-white/5 rounded w-40 animate-pulse" />
              </div>
            </div>
          )) : logs.map((log, idx) => {
            const cfg = TYPE_CONFIG[log.type] || TYPE_CONFIG.other;
            const Icon = cfg.icon;
            return (
              <div key={log.id} className="flex gap-4 group py-2 hover:bg-white/[0.02] rounded-xl px-2 -mx-2 transition-colors">
                {/* Timeline dot */}
                <div className={`relative z-10 flex-shrink-0 w-9 h-9 rounded-full ${cfg.bg} border ${cfg.border} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${cfg.color}`} />
                </div>

                <div className="flex-1 min-w-0 pt-1.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white leading-snug">{log.action}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                          {cfg.label}
                        </span>
                        {log.target && (
                          <span className="text-[10px] text-white/40 font-mono truncate max-w-[200px]">→ {log.target}</span>
                        )}
                        <span className="text-[10px] text-white/40">{log.actor}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-white/30 flex-shrink-0 whitespace-nowrap" title={fullTime(log.timestamp)}>
                      {formatTime(log.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button id="btn-activity-prev" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/60 hover:text-white disabled:opacity-30 transition-all">
            Previous
          </button>
          <span className="text-xs text-white/40">{page} / {pagination.totalPages}</span>
          <button id="btn-activity-next" onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/60 hover:text-white disabled:opacity-30 transition-all">
            Next
          </button>
        </div>
      )}
    </div>
  );
}

'use strict';
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Users, Search, Filter, ChevronLeft, ChevronRight, ShieldCheck, ShieldX, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import { adminApi } from '../../lib/api/adminApi';

const ROLE_OPTS = ['all', 'admin', 'studio_owner', 'photographer', 'client'];
const STATUS_OPTS = ['all', 'active', 'suspended', 'pending_verification'];

const STATUS_STYLES = {
  active: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  suspended: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
  pending_verification: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
};

const ROLE_STYLES = {
  admin: 'text-[#C8A96E] bg-[#C8A96E]/10',
  studio_owner: 'text-purple-400 bg-purple-400/10',
  photographer: 'text-blue-400 bg-blue-400/10',
  client: 'text-emerald-400 bg-emerald-400/10',
};

const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
const formatTimeAgo = (iso) => {
  if (!iso) return 'Never';
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

export default function AdminUsersPanel() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('all');
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAllUsers({ role, status, search, page, limit: 20 });
      if (res?.data) {
        setUsers(res.data.users || []);
        setPagination(res.data.pagination || null);
      }
    } finally {
      setLoading(false);
    }
  }, [role, status, search, page]);

  useEffect(() => { load(); }, [load]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleStatusAction = async (userId, newStatus) => {
    setActionLoading(userId);
    try {
      const res = await adminApi.updateUserStatus({ userId, status: newStatus });
      if (res?.data) {
        setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: newStatus } : u));
      }
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-black text-white">User Management</h2>
          <p className="text-xs text-white/40 mt-0.5">{pagination?.total ?? users.length} total users registered</p>
        </div>
        <button id="btn-users-refresh" onClick={load}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/60 hover:text-white transition-all">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <form onSubmit={handleSearch} className="flex-1 min-w-[180px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <input id="input-users-search" type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search name or email..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#C8A96E]/50 transition-colors" />
        </form>

        <select id="select-users-role" value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/70 focus:outline-none focus:border-[#C8A96E]/50">
          {ROLE_OPTS.map((r) => <option key={r} value={r} className="bg-[#0A0A14]">{r === 'all' ? 'All Roles' : r.replace('_', ' ')}</option>)}
        </select>

        <select id="select-users-status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/70 focus:outline-none focus:border-[#C8A96E]/50">
          {STATUS_OPTS.map((s) => <option key={s} value={s} className="bg-[#0A0A14]">{s === 'all' ? 'All Statuses' : s.replace('_', ' ')}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['User', 'Role', 'Status', 'Email Verified', 'Last Login', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-white/40 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 7 }).map((__, j) => (
                    <td key={j} className="px-4 py-3.5"><div className="h-3 bg-white/10 rounded animate-pulse" style={{ width: `${40 + j * 10}%` }} /></td>
                  ))}
                </tr>
              )) : users.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.03] transition-colors group">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-black text-white/70">{u.fullName?.[0]}</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{u.fullName}</p>
                        <p className="text-[10px] text-white/40">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ROLE_STYLES[u.role] || 'text-white/50 bg-white/5'}`}>
                      {u.role?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLES[u.status] || 'text-white/40 bg-white/5 border-white/10'}`}>
                      {u.status?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    {u.emailVerified
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      : <XCircle className="w-4 h-4 text-white/20" />}
                  </td>
                  <td className="px-4 py-3.5 text-[11px] text-white/50">{formatTimeAgo(u.lastLoginAt)}</td>
                  <td className="px-4 py-3.5 text-[11px] text-white/50 whitespace-nowrap">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {u.status !== 'active' && (
                        <button id={`btn-activate-${u.id}`}
                          onClick={() => handleStatusAction(u.id, 'active')}
                          disabled={actionLoading === u.id}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-400/10 hover:bg-emerald-400/20 text-emerald-400 text-[10px] font-bold transition-all disabled:opacity-50">
                          <ShieldCheck className="w-3 h-3" /> Activate
                        </button>
                      )}
                      {u.status !== 'suspended' && (
                        <button id={`btn-suspend-${u.id}`}
                          onClick={() => handleStatusAction(u.id, 'suspended')}
                          disabled={actionLoading === u.id}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-400/10 hover:bg-rose-400/20 text-rose-400 text-[10px] font-bold transition-all disabled:opacity-50">
                          <ShieldX className="w-3 h-3" /> Suspend
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
            <span className="text-[11px] text-white/40">
              Page {pagination.page} of {pagination.totalPages} · {pagination.total} users
            </span>
            <div className="flex items-center gap-2">
              <button id="btn-users-prev" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 rounded-lg bg-white/5 text-white/60 hover:text-white disabled:opacity-30 transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button id="btn-users-next" onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages}
                className="p-1.5 rounded-lg bg-white/5 text-white/60 hover:text-white disabled:opacity-30 transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

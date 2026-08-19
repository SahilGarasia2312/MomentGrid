'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { UserCheck, Search, DollarSign, CalendarCheck, RefreshCw, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { adminApi } from '../../lib/api/adminApi';

const STATUS_STYLES = {
  active: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  suspended: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
  pending_verification: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
};

const StatusIcon = ({ status }) => {
  if (status === 'active') return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
  if (status === 'suspended') return <XCircle className="w-3.5 h-3.5 text-rose-400" />;
  return <Clock className="w-3.5 h-3.5 text-amber-400" />;
};

const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
const formatTimeAgo = (iso) => {
  if (!iso) return 'Never';
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

export default function AdminClientsPanel() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const load = async (search = '', status = statusFilter) => {
    setLoading(true);
    try {
      const res = await adminApi.getAllClients({ search, status });
      if (res?.data) setClients(res.data.clients || []);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e) => { e.preventDefault(); load(searchInput, statusFilter); };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-black text-white">Client Management</h2>
          <p className="text-xs text-white/40 mt-0.5">{clients.length} clients in the platform</p>
        </div>
        <button id="btn-clients-refresh" onClick={() => load(searchInput, statusFilter)}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <form onSubmit={handleSearch} className="flex-1 min-w-[180px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <input id="input-clients-search" type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search clients..." className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#C8A96E]/50" />
        </form>
        <select id="select-clients-status" value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); load(searchInput, e.target.value); }}
          className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/70 focus:outline-none">
          {['all', 'active', 'suspended', 'pending_verification'].map((s) => (
            <option key={s} value={s} className="bg-[#0A0A14]">{s === 'all' ? 'All Statuses' : s.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Client', 'Status', 'Bookings', 'Total Paid', 'Invoices', 'Last Active', 'Joined'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-white/40 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>{Array.from({ length: 7 }).map((__, j) => (
                  <td key={j} className="px-4 py-4"><div className="h-3 bg-white/10 rounded animate-pulse" /></td>
                ))}</tr>
              )) : clients.map((c) => (
                <tr key={c.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400/20 to-white/5 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-black text-emerald-400">{c.fullName?.[0]}</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{c.fullName}</p>
                        <p className="text-[10px] text-white/40">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <StatusIcon status={c.status} />
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${STATUS_STYLES[c.status] || ''}`}>
                        {c.status?.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <CalendarCheck className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-xs font-bold text-white">{c.bookingCount}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-[#C8A96E]" />
                      <span className="text-xs font-bold text-white">${Number(c.totalPaid).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-xs text-white/60">{c.invoiceCount}</td>
                  <td className="px-4 py-4 text-[11px] text-white/50">{formatTimeAgo(c.lastLoginAt)}</td>
                  <td className="px-4 py-4 text-[11px] text-white/50 whitespace-nowrap">{formatDate(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

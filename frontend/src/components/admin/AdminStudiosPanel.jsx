'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Search, Camera, DollarSign, RefreshCw, ExternalLink } from 'lucide-react';
import { adminApi } from '../../lib/api/adminApi';

const formatCurrency = (v) => `$${Number(v || 0).toLocaleString()}`;
const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

export default function AdminStudiosPanel() {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const load = async (s = search) => {
    setLoading(true);
    try {
      const res = await adminApi.getAllStudios({ search: s });
      if (res?.data) setStudios(res.data.studios || []);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e) => { e.preventDefault(); setSearch(searchInput); load(searchInput); };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-black text-white">Studios Directory</h2>
          <p className="text-xs text-white/40 mt-0.5">{studios.length} studios registered on MomentGrid</p>
        </div>
        <button id="btn-studios-refresh" onClick={() => load()}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <form onSubmit={handleSearch} className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
        <input id="input-studios-search" type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search studios..." className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#C8A96E]/50 transition-colors" />
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-3">
            {[48, 32, 24].map((h) => <div key={h} className={`h-${h < 32 ? '3' : h < 48 ? '4' : '8'} bg-white/10 rounded animate-pulse`} />)}
          </div>
        )) : studios.map((studio) => (
          <div key={studio.id} className="group bg-white/[0.03] border border-white/10 hover:border-[#C8A96E]/30 rounded-2xl p-5 transition-all duration-300">
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
                style={{ backgroundColor: `${studio.brandColor}20`, borderColor: `${studio.brandColor}30`, border: '1px solid' }}>
                <Building2 className="w-5 h-5" style={{ color: studio.brandColor || '#C8A96E' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{studio.name}</p>
                <p className="text-[10px] text-white/40">/{studio.slug}</p>
              </div>
              <button className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-white/40 hover:text-white transition-all">
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[10px] text-white/40 mb-3 truncate">{studio.contactEmail || 'No contact email'}</p>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/5 rounded-xl p-2.5">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Camera className="w-3 h-3 text-blue-400" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">Photographers</span>
                </div>
                <p className="text-lg font-black text-white">{studio.photographerCount}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-2.5">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <DollarSign className="w-3 h-3 text-[#C8A96E]" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">Revenue</span>
                </div>
                <p className="text-lg font-black text-white">{formatCurrency(studio.totalRevenue)}</p>
              </div>
            </div>

            <p className="text-[9px] text-white/30 mt-3">Joined {formatDate(studio.createdAt)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

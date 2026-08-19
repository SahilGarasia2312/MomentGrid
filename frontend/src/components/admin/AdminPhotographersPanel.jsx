'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { Camera, Star, Search, RefreshCw } from 'lucide-react';
import { adminApi } from '../../lib/api/adminApi';

export default function AdminPhotographersPanel() {
  const [photographers, setPhotographers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const load = async (s = search) => {
    setLoading(true);
    try {
      const res = await adminApi.getAllPhotographers({ search: s });
      if (res?.data) setPhotographers(res.data.photographers || []);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e) => { e.preventDefault(); setSearch(searchInput); load(searchInput); };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-3 h-3 ${i < Math.round(rating) ? 'text-[#C8A96E] fill-[#C8A96E]' : 'text-white/20'}`} />
    ));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-black text-white">Photographers Roster</h2>
          <p className="text-xs text-white/40 mt-0.5">{photographers.length} photographers on the platform</p>
        </div>
        <button id="btn-photographers-refresh" onClick={() => load()}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <form onSubmit={handleSearch} className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
        <input id="input-photographers-search" type="text" value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search photographers..."
          className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#C8A96E]/50 transition-colors" />
      </form>

      <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Photographer', 'Studio', 'Specializations', 'Experience', 'Rating', 'Sessions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-white/40 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((__, j) => (
                    <td key={j} className="px-4 py-4"><div className="h-3 bg-white/10 rounded animate-pulse" style={{ width: `${50 + j * 8}%` }} /></td>
                  ))}
                </tr>
              )) : photographers.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img src={p.avatarUrl} alt={p.fullName}
                        className="w-9 h-9 rounded-full object-cover border border-white/10 flex-shrink-0"
                        onError={(e) => { e.target.style.display = 'none'; }} />
                      <div>
                        <p className="text-xs font-bold text-white">{p.fullName}</p>
                        <p className="text-[10px] text-white/40">{p.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-[11px] text-purple-400 font-semibold">{p.studioName || 'Independent'}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {(p.specializations || []).slice(0, 2).map((s) => (
                        <span key={s} className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-400/10 text-blue-400">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[11px] text-white/60">{p.yearsExperience}y exp</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <div className="flex">{renderStars(p.stats?.averageRating || 0)}</div>
                      <span className="text-[10px] text-white/50">{p.stats?.averageRating?.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-xs font-bold text-white">{p.stats?.totalSessions || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

'use strict';

import React from 'react';
import { Search, Heart, Filter, Grid, SlidersHorizontal, ChevronLeft, ChevronRight, CheckSquare, Square } from 'lucide-react';

export default function SearchFilterPaginationBar({
  searchQuery,
  onSearchChange,
  favoritesOnly,
  onToggleFavorites,
  pagination = { page: 1, limit: 24, totalItems: 16, totalPages: 1, hasNextPage: false, hasPrevPage: false },
  onPageChange,
  onLimitChange,
  isSelectAll,
  onToggleSelectAll,
  selectedCount,
}) {
  return (
    <div className="bg-[#161628]/90 border border-[#C8A96E]/20 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg backdrop-blur-sm">
      
      {/* Search Input & Select All */}
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={onToggleSelectAll}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/80 transition-colors shrink-0"
          title="Select all currently filtered photos"
        >
          {isSelectAll ? (
            <CheckSquare className="w-4 h-4 text-[#C8A96E]" />
          ) : (
            <Square className="w-4 h-4 text-white/40" />
          )}
          <span>{selectedCount > 0 ? `${selectedCount} Selected` : 'Select Batch'}</span>
        </button>

        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search by photo caption or filename..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0d0d1a] border border-white/20 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#C8A96E] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-white/40 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filter Toggles & Pagination Controls */}
      <div className="flex items-center justify-between md:justify-end gap-3 flex-wrap">
        
        {/* Favorites Toggle */}
        <button
          onClick={onToggleFavorites}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all border ${
            favoritesOnly
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-sm'
              : 'bg-white/5 text-white/70 border-white/10 hover:border-white/30 hover:text-white'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-rose-400 text-rose-400' : ''}`} />
          <span>Favorites ({favoritesOnly ? 'Active' : 'All'})</span>
        </button>

        {/* Items Per Page Selector */}
        <div className="flex items-center gap-1.5 bg-[#0d0d1a] border border-white/20 rounded-xl px-2.5 py-1.5 text-xs text-white/70">
          <Grid className="w-3.5 h-3.5 text-[#C8A96E]" />
          <span className="text-[10px] text-white/50">Show:</span>
          <select
            value={pagination.limit || 24}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="bg-transparent text-white text-xs font-medium focus:outline-none cursor-pointer"
          >
            <option value={12} className="bg-[#161628]">12</option>
            <option value={24} className="bg-[#161628]">24</option>
            <option value={48} className="bg-[#161628]">48</option>
            <option value={96} className="bg-[#161628]">96</option>
          </select>
        </div>

        {/* Page Navigator */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={!pagination.hasPrevPage}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none border border-white/10 text-white transition-colors"
            title="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="px-2.5 text-xs font-semibold text-white/80">
            Page <span className="text-[#C8A96E]">{pagination.page}</span> of {pagination.totalPages || 1}
          </span>

          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={!pagination.hasNextPage}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none border border-white/10 text-white transition-colors"
            title="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}

'use strict';
'use client';

import React, { useState } from 'react';
import { Star, X, MessageSquare, Check, Eye, Filter, Sparkles, Layers } from 'lucide-react';

export default function PhotoCuratorGrid({
  photos = [],
  favoritedPhotoIds = [],
  rejectedPhotoIds = [],
  photoComments = [],
  onToggleFavorite,
  onToggleReject,
  onOpenCommentModal,
  onOpenLightbox,
  status,
}) {
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'favorites' | 'rejected'
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = ['all', ...Array.from(new Set(photos.map((p) => p.category || 'general')))];

  const filteredPhotos = photos.filter((photo) => {
    const isFav = favoritedPhotoIds.includes(photo.id);
    const isRej = rejectedPhotoIds.includes(photo.id);

    if (filterMode === 'favorites' && !isFav) return false;
    if (filterMode === 'rejected' && !isRej) return false;
    if (filterMode === 'all' && isRej) return false; // hide rejected by default in all view unless specified

    if (categoryFilter !== 'all' && photo.category !== categoryFilter) return false;
    return true;
  });

  const getCommentCount = (photoId) => {
    return photoComments.filter((c) => c.photoId === photoId).length;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Filter and Category Bar */}
      <div className="bg-[#161628] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Main Filter Mode Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              filterMode === 'all'
                ? 'bg-[#C8A96E] text-black shadow-md shadow-[#C8A96E]/20'
                : 'bg-white/5 hover:bg-white/10 text-white/70'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Active Proofs ({photos.length - rejectedPhotoIds.length})</span>
          </button>

          <button
            onClick={() => setFilterMode('favorites')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              filterMode === 'favorites'
                ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                : 'bg-white/5 hover:bg-white/10 text-white/70'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Favorites ({favoritedPhotoIds.length})</span>
          </button>

          <button
            onClick={() => setFilterMode('rejected')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              filterMode === 'rejected'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'bg-white/5 hover:bg-white/10 text-white/70'
            }`}
          >
            <X className="w-3.5 h-3.5" />
            <span>Rejected Outtakes ({rejectedPhotoIds.length})</span>
          </button>
        </div>

        {/* Category Facet Selector */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs text-white/50 flex items-center gap-1 mr-1 shrink-0">
            <Filter className="w-3 h-3" /> Tag:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium capitalize shrink-0 transition-colors ${
                categoryFilter === cat
                  ? 'bg-white/20 text-white border border-white/40'
                  : 'bg-white/5 hover:bg-white/10 text-white/60'
              }`}
            >
              #{cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid View */}
      {filteredPhotos.length === 0 ? (
        <div className="bg-[#161628]/60 border border-dashed border-white/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <Sparkles className="w-10 h-10 text-[#C8A96E]/50 mb-3 animate-pulse" />
          <h4 className="text-base font-bold text-white">No proofs found in this view</h4>
          <p className="text-xs text-white/60 mt-1 max-w-md">
            {filterMode === 'favorites'
              ? 'You have not favorited any shots yet. Click the golden star on any proof to add it to your album.'
              : filterMode === 'rejected'
              ? 'No photos have been marked as rejected.'
              : 'Try selecting a different tag filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredPhotos.map((photo) => {
            const isFav = favoritedPhotoIds.includes(photo.id);
            const isRej = rejectedPhotoIds.includes(photo.id);
            const commentCount = getCommentCount(photo.id);

            return (
              <div
                key={photo.id}
                className={`group relative rounded-2xl overflow-hidden bg-[#161628] border transition-all duration-200 ${
                  isFav
                    ? 'border-amber-400/80 shadow-lg shadow-amber-400/10'
                    : isRej
                    ? 'border-rose-500/60 opacity-60'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                {/* Photo Thumbnail */}
                <div
                  className="aspect-[3/2] w-full relative bg-black/40 cursor-pointer overflow-hidden"
                  onClick={() => onOpenLightbox && onOpenLightbox(photo)}
                >
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Status Badge Top Left */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
                    {isFav && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-400 text-black font-bold text-[10px] uppercase flex items-center gap-1 shadow-md">
                        <Star className="w-3 h-3 fill-current" /> Favorite
                      </span>
                    )}
                    {isRej && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-500 text-white font-bold text-[10px] uppercase flex items-center gap-1 shadow-md">
                        <X className="w-3 h-3" /> Rejected
                      </span>
                    )}
                  </div>

                  {/* Comments Badge Top Right */}
                  {commentCount > 0 && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenCommentModal(photo);
                      }}
                      className="absolute top-2.5 right-2.5 px-2 py-1 rounded-md bg-[#161628]/90 text-[#C8A96E] font-bold text-[11px] flex items-center gap-1 border border-[#C8A96E]/40 z-10 shadow-md hover:bg-[#C8A96E] hover:text-black transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{commentCount} Note{commentCount > 1 ? 's' : ''}</span>
                    </div>
                  )}

                  {/* Hover Quick Action Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3 pointer-events-none">
                    <span className="text-xs text-white/90 font-medium truncate max-w-[70%]">
                      {photo.caption}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenLightbox && onOpenLightbox(photo);
                      }}
                      className="p-1.5 rounded-lg bg-white/20 hover:bg-white/40 text-white pointer-events-auto transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Bottom Interactive Toolbar */}
                {status === 'selecting' && (
                  <div className="p-3 bg-[#131324] border-t border-white/5 flex items-center justify-between gap-2">
                    {/* Favorite Button */}
                    <button
                      onClick={() => onToggleFavorite(photo.id)}
                      className={`flex-1 py-1.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                        isFav
                          ? 'bg-amber-400 text-black shadow-sm'
                          : 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-white'
                      }`}
                      title="Mark as Favorite for Album Spreads"
                    >
                      <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                      <span>{isFav ? 'Favorited' : 'Favorite'}</span>
                    </button>

                    {/* Comment Button */}
                    <button
                      onClick={() => onOpenCommentModal(photo)}
                      className={`p-2 rounded-xl border transition-all ${
                        commentCount > 0
                          ? 'bg-[#C8A96E]/20 text-[#C8A96E] border-[#C8A96E]/60'
                          : 'bg-white/5 hover:bg-white/10 text-white/70 border-white/5'
                      }`}
                      title="Add layout or retouching note"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>

                    {/* Reject Button */}
                    <button
                      onClick={() => onToggleReject(photo.id)}
                      className={`p-2 rounded-xl border transition-all ${
                        isRej
                          ? 'bg-rose-500 text-white border-rose-400'
                          : 'bg-white/5 hover:bg-rose-500/20 text-white/70 hover:text-rose-300 border-white/5'
                      }`}
                      title="Reject outtake"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

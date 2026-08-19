'use strict';

import React, { useState } from 'react';
import { Heart, Download, CheckSquare, Square, Eye, FolderInput, Tag, Sparkles, Maximize2, ShieldCheck } from 'lucide-react';

export default function OptimizedLazyPhotoGrid({
  photos = [],
  selectedIds = [],
  onToggleSelect,
  onToggleFavorite,
  onDownloadSingle,
  onOpenLightbox,
  isWatermarkActive = true,
  watermarkConfig = { enabled: true, text: '© MomentGrid Collective', opacity: 45, position: 'south_east' },
  onMoveToFolder,
  folders = [],
}) {
  const [hoveredId, setHoveredId] = useState(null);
  const [moveMenuId, setMoveMenuId] = useState(null);

  if (photos.length === 0) {
    return (
      <div className="w-full py-20 bg-[#161628]/40 border border-white/10 rounded-2xl flex flex-col items-center justify-center text-center p-6">
        <div className="p-4 rounded-full bg-[#C8A96E]/10 border border-[#C8A96E]/20 text-[#C8A96E] mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h4 className="text-base font-semibold text-white tracking-wide">No Proofs Found in Current Filter</h4>
        <p className="text-xs text-white/50 mt-1 max-w-sm">
          Try clearing your search query or category tag, or upload new high-resolution proofs directly to this folder.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
      {photos.map((photo) => {
        const isSelected = selectedIds.includes(photo.id);
        const isFavorite = photo.isFavorite;

        return (
          <div
            key={photo.id}
            onMouseEnter={() => setHoveredId(photo.id)}
            onMouseLeave={() => {
              setHoveredId(null);
              setMoveMenuId(null);
            }}
            className={`group relative bg-[#161628] border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col shadow-lg ${
              isSelected
                ? 'border-[#C8A96E] ring-2 ring-[#C8A96E]/30 scale-[0.99]'
                : 'border-white/10 hover:border-[#C8A96E]/50 hover:shadow-2xl hover:shadow-[#C8A96E]/10'
            }`}
          >
            {/* Image Container with Lazy Loading & Watermarking Overlay */}
            <div className="relative aspect-[3/2] w-full bg-[#0d0d1a] overflow-hidden cursor-pointer" onClick={() => onOpenLightbox(photo)}>
              <img
                src={photo.url}
                alt={photo.caption || 'MomentGrid proof'}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Dynamic Cloudinary Watermark Simulation Overlay */}
              {isWatermarkActive && watermarkConfig.enabled && (
                <div
                  className="absolute inset-0 pointer-events-none flex items-end justify-end p-3 select-none"
                  style={{ opacity: (watermarkConfig.opacity || 45) / 100 }}
                >
                  <span className="px-2.5 py-1 rounded bg-black/60 backdrop-blur-sm border border-white/20 text-white font-bold tracking-widest text-[11px] shadow-md uppercase">
                    {watermarkConfig.text || '© MomentGrid'}
                  </span>
                </div>
              )}

              {/* Top Bar Action Overlays */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
                {/* Checkbox Select */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSelect(photo.id);
                  }}
                  className={`p-1.5 rounded-lg transition-all ${
                    isSelected
                      ? 'bg-[#C8A96E] text-black shadow-md'
                      : 'bg-black/60 text-white/70 hover:text-white backdrop-blur-sm border border-white/20'
                  }`}
                  title="Select for batch operations"
                >
                  {isSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                </button>

                {/* Favorite Toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(photo.id);
                  }}
                  className={`p-1.5 rounded-lg backdrop-blur-sm border transition-all ${
                    isFavorite
                      ? 'bg-rose-500/80 text-white border-rose-400 shadow-md scale-110'
                      : 'bg-black/60 text-white/70 border-white/20 hover:text-rose-400 hover:scale-105'
                  }`}
                  title="Mark as Client Favorite"
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Bottom Quick Action Bar on Hover */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenLightbox(photo);
                  }}
                  className="p-1.5 rounded-lg bg-black/70 text-white/90 hover:text-[#C8A96E] backdrop-blur-md border border-white/20 transition-colors"
                  title="Fullscreen preview"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownloadSingle(photo);
                  }}
                  className="p-1.5 rounded-lg bg-black/70 text-white/90 hover:text-[#C8A96E] backdrop-blur-md border border-white/20 transition-colors"
                  title="Download full resolution file"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMoveMenuId(moveMenuId === photo.id ? null : photo.id);
                    }}
                    className="p-1.5 rounded-lg bg-black/70 text-white/90 hover:text-[#C8A96E] backdrop-blur-md border border-white/20 transition-colors"
                    title="Move to folder"
                  >
                    <FolderInput className="w-3.5 h-3.5" />
                  </button>

                  {/* Folder Selection Dropdown Menu */}
                  {moveMenuId === photo.id && (
                    <div className="absolute bottom-full right-0 mb-1 w-44 bg-[#161628] border border-[#C8A96E]/40 rounded-xl shadow-2xl p-1 z-30 animate-in zoom-in-95 duration-150">
                      <p className="px-2.5 py-1 text-[10px] font-bold uppercase text-[#C8A96E] border-b border-white/10">
                        Move to Folder
                      </p>
                      {folders.map((f) => (
                        <button
                          key={f.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onMoveToFolder(photo.id, f.id);
                            setMoveMenuId(null);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-white/80 hover:bg-[#C8A96E]/20 hover:text-white transition-colors flex items-center justify-between"
                        >
                          <span className="truncate pr-1">📁 {f.name}</span>
                          {photo.folderId === f.id && <span className="text-[10px] text-[#C8A96E]">Active</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Photo Footer Caption & Metadata */}
            <div className="p-3.5 flex flex-col justify-between flex-1 bg-gradient-to-b from-[#161628] to-[#121220]">
              <p className="text-xs font-semibold text-white/90 truncate pr-2" title={photo.caption}>
                {photo.caption || `Proof #${photo.id.slice(-4)}`}
              </p>
              <div className="flex items-center justify-between text-[10px] text-white/50 mt-2 pt-2 border-t border-white/10">
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3 text-[#C8A96E]" />
                  <span>#{photo.category || 'general'}</span>
                </span>
                <span>
                  {photo.width || 3840}×{photo.height || 2160} • {((photo.bytes || 2048000) / (1024 * 1024)).toFixed(1)} MB
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

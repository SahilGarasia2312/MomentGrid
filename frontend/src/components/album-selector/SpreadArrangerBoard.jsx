'use strict';
'use client';

import React from 'react';
import { ArrowLeft, ArrowRight, Layers, Sparkles, Move, Eye, MessageSquare, Trash2 } from 'lucide-react';

export default function SpreadArrangerBoard({
  photos = [],
  orderedPhotoIds = [],
  photoComments = [],
  onReorderSequence,
  onRemoveFromSelection,
  onOpenCommentModal,
  status,
}) {
  const photoMap = new Map();
  photos.forEach((p) => photoMap.set(p.id, p));

  const orderedPhotos = orderedPhotoIds
    .map((id) => photoMap.get(id))
    .filter(Boolean);

  const handleMoveLeft = (index) => {
    if (index <= 0 || status !== 'selecting') return;
    const newOrder = [...orderedPhotoIds];
    const temp = newOrder[index - 1];
    newOrder[index - 1] = newOrder[index];
    newOrder[index] = temp;
    onReorderSequence(newOrder);
  };

  const handleMoveRight = (index) => {
    if (index >= orderedPhotoIds.length - 1 || status !== 'selecting') return;
    const newOrder = [...orderedPhotoIds];
    const temp = newOrder[index + 1];
    newOrder[index + 1] = newOrder[index];
    newOrder[index] = temp;
    onReorderSequence(newOrder);
  };

  // Group into two-page spreads (2 photos per spread roughly, or individual full pages)
  const spreads = [];
  for (let i = 0; i < orderedPhotos.length; i += 2) {
    spreads.push({
      spreadNumber: Math.floor(i / 2) + 1,
      leftPhoto: orderedPhotos[i],
      rightPhoto: orderedPhotos[i + 1] || null,
      leftIndex: i,
      rightIndex: i + 1,
    });
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      {/* Instructions Banner */}
      <div className="bg-gradient-to-r from-[#161628] via-[#1f1f3a] to-[#161628] border border-[#C8A96E]/40 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-[#C8A96E]/20 text-[#C8A96E] shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Heirloom Spread Storyboard</span>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-white/70 uppercase font-mono">
                {spreads.length} Spreads Configured
              </span>
            </h3>
            <p className="text-xs text-white/60 mt-1 max-w-2xl leading-relaxed">
              Arrange your favorited moments into chronological physical spreads. The studio production team will craft side-by-side flush mount layouts following your storyboard sequence. Use the arrows to shift order across pages.
            </p>
          </div>
        </div>

        {status === 'selecting' && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#C8A96E] font-medium bg-[#C8A96E]/10 px-3 py-1.5 rounded-xl border border-[#C8A96E]/30 shrink-0">
              ⚡ Live Reordering Active
            </span>
          </div>
        )}
      </div>

      {/* Spreads Storyboard Grid */}
      {spreads.length === 0 ? (
        <div className="bg-[#161628] border border-dashed border-white/10 rounded-3xl p-16 text-center flex flex-col items-center justify-center">
          <Sparkles className="w-10 h-10 text-[#C8A96E]/50 mb-3 animate-pulse" />
          <h4 className="text-base font-bold text-white">No photos in spread sequence yet</h4>
          <p className="text-xs text-white/60 mt-1 max-w-md">
            Go to step 1 (Select & Reject Proofs) and favorite your must-have moments. They will automatically populate right here in your storyboard.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {spreads.map((spread) => (
            <div
              key={spread.spreadNumber}
              className="bg-[#161628] border border-white/10 rounded-3xl overflow-hidden shadow-2xl transition-all hover:border-white/20"
            >
              {/* Spread Header */}
              <div className="px-6 py-3.5 bg-[#1b1b32] border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-[#C8A96E] text-black font-extrabold text-xs">
                    Spread #{spread.spreadNumber}
                  </span>
                  <span className="text-xs font-semibold text-white/80">
                    Pages {(spread.spreadNumber - 1) * 2 + 1} & {(spread.spreadNumber - 1) * 2 + 2}
                  </span>
                </div>
                <span className="text-[11px] text-white/40">
                  {spread.rightPhoto ? 'Dual Side-by-Side Spread' : 'Full Page Solo Feature'}
                </span>
              </div>

              {/* Spread Pages Container */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10 bg-black/30">
                
                {/* Left Page Photo */}
                <div className="p-4 sm:p-6 flex flex-col gap-3 group relative">
                  <div className="aspect-[3/2] rounded-2xl overflow-hidden bg-black/60 border border-white/10 relative shadow-inner">
                    <img
                      src={spread.leftPhoto.url}
                      alt={spread.leftPhoto.caption}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-bold border border-white/20">
                      Page {(spread.spreadNumber - 1) * 2 + 1}
                    </div>

                    {/* Move Left / Right Overlay Controls */}
                    {status === 'selecting' && (
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleMoveLeft(spread.leftIndex)}
                          disabled={spread.leftIndex === 0}
                          className="px-3 py-1.5 rounded-xl bg-black/80 hover:bg-black text-white font-bold text-xs flex items-center gap-1 border border-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" /> Shift Left
                        </button>
                        <button
                          onClick={() => handleMoveRight(spread.leftIndex)}
                          disabled={spread.leftIndex === orderedPhotos.length - 1}
                          className="px-3 py-1.5 rounded-xl bg-black/80 hover:bg-black text-white font-bold text-xs flex items-center gap-1 border border-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          Shift Right <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs px-1">
                    <span className="text-white/80 font-medium truncate max-w-[70%]">
                      {spread.leftPhoto.caption}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onOpenCommentModal(spread.leftPhoto)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-[#C8A96E]/20 text-white/70 hover:text-[#C8A96E] transition-colors"
                        title="Add/view note"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                      {status === 'selecting' && (
                        <button
                          onClick={() => onRemoveFromSelection(spread.leftPhoto.id)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-white/70 hover:text-rose-400 transition-colors"
                          title="Remove from storyboard"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Page Photo */}
                <div className="p-4 sm:p-6 flex flex-col gap-3 group relative">
                  {spread.rightPhoto ? (
                    <>
                      <div className="aspect-[3/2] rounded-2xl overflow-hidden bg-black/60 border border-white/10 relative shadow-inner">
                        <img
                          src={spread.rightPhoto.url}
                          alt={spread.rightPhoto.caption}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-bold border border-white/20">
                          Page {(spread.spreadNumber - 1) * 2 + 2}
                        </div>

                        {/* Move Left / Right Controls */}
                        {status === 'selecting' && (
                          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleMoveLeft(spread.rightIndex)}
                              disabled={spread.rightIndex === 0}
                              className="px-3 py-1.5 rounded-xl bg-black/80 hover:bg-black text-white font-bold text-xs flex items-center gap-1 border border-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" /> Shift Left
                            </button>
                            <button
                              onClick={() => handleMoveRight(spread.rightIndex)}
                              disabled={spread.rightIndex === orderedPhotos.length - 1}
                              className="px-3 py-1.5 rounded-xl bg-black/80 hover:bg-black text-white font-bold text-xs flex items-center gap-1 border border-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              Shift Right <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs px-1">
                        <span className="text-white/80 font-medium truncate max-w-[70%]">
                          {spread.rightPhoto.caption}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onOpenCommentModal(spread.rightPhoto)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-[#C8A96E]/20 text-white/70 hover:text-[#C8A96E] transition-colors"
                            title="Add/view note"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                          {status === 'selecting' && (
                            <button
                              onClick={() => onRemoveFromSelection(spread.rightPhoto.id)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-white/70 hover:text-rose-400 transition-colors"
                              title="Remove from storyboard"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="aspect-[3/2] rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-6 text-white/40">
                      <Sparkles className="w-6 h-6 mb-2 text-white/20" />
                      <p className="text-xs font-medium">Page {(spread.spreadNumber - 1) * 2 + 2} Empty</p>
                      <p className="text-[11px] text-white/30 mt-0.5">
                        Add another favorite or leave empty for a full-bleed statement page.
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

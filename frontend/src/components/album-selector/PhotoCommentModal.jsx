'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Save, Trash2, Sparkles } from 'lucide-react';

export default function PhotoCommentModal({
  isOpen,
  photo,
  initialComment = '',
  onClose,
  onSaveComment,
}) {
  const [commentText, setCommentText] = useState(initialComment);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setCommentText(initialComment || '');
  }, [initialComment, photo]);

  if (!isOpen || !photo) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveComment(photo.id, commentText);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = async () => {
    setIsSaving(true);
    try {
      await onSaveComment(photo.id, '');
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="bg-[#161628] border border-white/10 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 px-6 border-b border-white/10 flex items-center justify-between bg-[#1f1f3a]/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#C8A96E]/20 text-[#C8A96E]">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Retouching & Layout Note</h3>
              <p className="text-[11px] text-white/50">Proof #{photo.id} • {photo.category}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Photo Preview Banner */}
        <div className="p-4 bg-black/40 flex items-center gap-4 border-b border-white/5">
          <img
            src={photo.url}
            alt={photo.caption}
            className="w-20 h-16 object-cover rounded-xl border border-white/10 shrink-0 shadow-md"
          />
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">{photo.caption}</p>
            <p className="text-[11px] text-white/60 mt-0.5">
              Specify cropping preference, blemish removal, color adjustments, or spread placement instructions.
            </p>
          </div>
        </div>

        {/* Comment Input Form */}
        <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-white/90 mb-2 flex items-center justify-between">
              <span>Client Instruction</span>
              <span className="text-[10px] text-[#C8A96E] flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Visible to Studio Production Team
              </span>
            </label>
            <textarea
              rows={4}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="e.g., Please make this a full double-page spread. Also soften highlights on the background archway..."
              className="w-full rounded-2xl bg-[#0d0d1a] border border-white/15 focus:border-[#C8A96E] focus:outline-none p-4 text-xs text-white placeholder-white/40 leading-relaxed resize-none transition-colors"
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            {initialComment ? (
              <button
                type="button"
                onClick={handleClear}
                disabled={isSaving}
                className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Note</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C8A96E] to-[#a3854d] text-black font-bold text-xs flex items-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-[#C8A96E]/20"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving Note...' : 'Save Note'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

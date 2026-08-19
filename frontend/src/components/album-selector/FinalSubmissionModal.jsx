'use strict';
'use client';

import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, X, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

export default function FinalSubmissionModal({
  isOpen,
  albumTitle,
  favoritedCount,
  orderedCount,
  albumSize,
  pageCount,
  coverMaterial,
  onClose,
  onSubmitConfirm,
}) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!agreedToTerms) return;
    setIsSubmitting(true);
    try {
      await onSubmitConfirm();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="bg-[#161628] border border-white/10 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-[#1f1f3a] to-[#161628] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#C8A96E]/20 text-[#C8A96E] border border-[#C8A96E]/40">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Sign Off & Submit for Production</h3>
              <p className="text-xs text-white/60">Heirloom Print Curation Confirmation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Summary Specifications Card */}
        <div className="p-6 flex flex-col gap-4">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C8A96E] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Approved Specifications
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-white/50 block text-[11px]">Album Format:</span>
                <span className="font-bold text-white">{albumSize}</span>
              </div>
              <div>
                <span className="text-white/50 block text-[11px]">Total Page Spreads:</span>
                <span className="font-bold text-white">{pageCount} Pages ({pageCount / 2} Spreads)</span>
              </div>
              <div>
                <span className="text-white/50 block text-[11px]">Selected Favorites:</span>
                <span className="font-bold text-emerald-400">{favoritedCount} Must-Have Shots</span>
              </div>
              <div>
                <span className="text-white/50 block text-[11px]">Cover Material:</span>
                <span className="font-bold text-white">{coverMaterial}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200/90 leading-relaxed">
              <strong className="text-amber-400 block mb-0.5">Important Production Notice:</strong>
              Once submitted, your album selection will be locked and sent directly to our master printers and binders. Further photo swaps or spread adjustments will require contacting your lead photographer.
            </div>
          </div>

          {/* Terms Checkbox */}
          <label className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/10 cursor-pointer hover:bg-white/[0.05] transition-colors mt-2">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-white/30 accent-[#C8A96E] cursor-pointer"
            />
            <span className="text-xs text-white/80 leading-normal">
              I verify that I have reviewed my favorite selections and spread arrangement for <strong className="text-white">{albumTitle}</strong> and approve these specifications for final physical production.
            </span>
          </label>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#131324] border-t border-white/10 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 font-semibold text-xs transition-colors"
          >
            Review Again
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!agreedToTerms || isSubmitting}
            className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-xl ${
              agreedToTerms
                ? 'bg-gradient-to-r from-[#C8A96E] to-[#a3854d] text-black hover:brightness-110 shadow-[#C8A96E]/20 cursor-pointer'
                : 'bg-white/10 text-white/30 cursor-not-allowed border border-white/5'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isSubmitting ? 'Transmitting Manifest...' : 'Confirm & Submit to Studio'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

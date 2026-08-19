'use strict';
'use client';

import React from 'react';
import { BookOpen, CheckCircle, Sparkles, AlertCircle, Save } from 'lucide-react';

export default function AlbumHeaderAndStatusBar({
  albumTitle,
  clientName,
  status,
  favoritedCount,
  rejectedCount,
  orderedCount,
  currentStep,
  onStepChange,
  minPhotosRequired = 10,
  maxPhotosRecommended = 60,
  onOpenSubmissionModal,
}) {
  const steps = [
    { id: 'curate', label: '1. Select & Reject Proofs', count: `${favoritedCount} Favs` },
    { id: 'arrange', label: '2. Arrange Spread Sequence', count: `${orderedCount} Ordered` },
    { id: 'styling', label: '3. Cover & Sizing Specs', count: 'Luxury Finish' },
    { id: 'review', label: '4. Final Review & Submit', count: status === 'submitted' ? 'Submitted' : 'Ready' },
  ];

  const progressPercentage = Math.min(100, Math.round((favoritedCount / minPhotosRequired) * 100));

  return (
    <header className="sticky top-0 z-40 bg-[#161628]/95 border-b border-white/10 backdrop-blur-md px-4 sm:px-8 py-4 flex flex-col gap-4 shadow-xl">
      {/* Top row: Title and Status badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#C8A96E]/20 text-[#C8A96E] text-[10px] font-bold uppercase tracking-widest border border-[#C8A96E]/40 flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              <span>Heirloom Album Curation Module</span>
            </span>
            <span className="text-xs text-white/50">• Prepared for {clientName}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide mt-1 flex items-center gap-2">
            <span>{albumTitle}</span>
          </h1>
        </div>

        {/* Status Indicator & Submission Button */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end text-right text-xs mr-2">
            <div className="flex items-center gap-1.5 text-white/90 font-medium">
              <span>Status:</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                status === 'submitted' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-[#C8A96E]/20 text-[#C8A96E] border border-[#C8A96E]/40'
              }`}>
                {status === 'submitted' ? 'Approved & Submitted' : 'In Selection (Draft)'}
              </span>
            </div>
            <p className="text-[10px] text-white/50 mt-0.5">
              {favoritedCount >= minPhotosRequired ? `✓ Minimum requirement (${minPhotosRequired}) met` : `Need at least ${minPhotosRequired} favorites to submit`}
            </p>
          </div>

          {status === 'selecting' && (
            <button
              onClick={onOpenSubmissionModal}
              disabled={favoritedCount < minPhotosRequired}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs tracking-wide transition-all flex items-center gap-2 shadow-lg ${
                favoritedCount >= minPhotosRequired
                  ? 'bg-gradient-to-r from-[#C8A96E] to-[#a3854d] text-black hover:brightness-110 shadow-[#C8A96E]/20 cursor-pointer'
                  : 'bg-white/10 text-white/40 cursor-not-allowed border border-white/5'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Submit Final Album</span>
            </button>
          )}
        </div>
      </div>

      {/* Step Wizard Navigation Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 pt-2 border-t border-white/5">
        {steps.map((step, idx) => {
          const isActive = currentStep === step.id;
          return (
            <button
              key={step.id}
              onClick={() => onStepChange(step.id)}
              className={`p-2.5 rounded-xl text-left transition-all border flex items-center justify-between ${
                isActive
                  ? 'bg-[#C8A96E]/20 border-[#C8A96E] text-white shadow-md'
                  : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10 text-white/70 hover:text-white'
              }`}
            >
              <div className="flex flex-col">
                <span className={`text-xs font-bold ${isActive ? 'text-[#C8A96E]' : 'text-white'}`}>
                  {step.label}
                </span>
                <span className="text-[10px] text-white/50">{step.count}</span>
              </div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                isActive ? 'bg-[#C8A96E] text-black' : 'bg-white/10 text-white/50'
              }`}>
                {idx + 1}
              </div>
            </button>
          );
        })}
      </div>
    </header>
  );
}

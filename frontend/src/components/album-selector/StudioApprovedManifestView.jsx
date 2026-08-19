'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Download, Printer, ShieldCheck, MessageSquare, Sparkles, Layers, FileCheck } from 'lucide-react';
import { albumSelectionApi } from '../../lib/api/albumSelectionApi';

export default function StudioApprovedManifestView({
  albumId = 'album-heirloom-2026',
  manifestData = null,
  onBackToSelector,
}) {
  const [manifest, setManifest] = useState(manifestData);
  const [loading, setLoading] = useState(!manifestData);

  useEffect(() => {
    if (!manifestData) {
      setLoading(true);
      albumSelectionApi
        .getStudioManifest({ albumId })
        .then((res) => {
          if (res?.data) setManifest(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setManifest(manifestData);
    }
  }, [albumId, manifestData]);

  if (loading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center text-center p-8 bg-[#161628] rounded-3xl border border-white/10">
        <Sparkles className="w-10 h-10 text-[#C8A96E] animate-spin mb-4" />
        <h3 className="text-lg font-bold text-white">Generating Production Review Manifest...</h3>
        <p className="text-xs text-white/50 mt-1">Collating spread sequence and client retouch instructions</p>
      </div>
    );
  }

  if (!manifest) {
    return (
      <div className="p-8 text-center bg-[#161628] rounded-3xl border border-white/10 text-white">
        <p>No production manifest data available.</p>
      </div>
    );
  }

  const { specifications, statistics, spreads = [] } = manifest;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* Studio Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-[#161628] to-[#1f1f3a] border border-emerald-500/40 rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
            <FileCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/40">
                Studio Production Manifest Approved
              </span>
              <span className="text-xs text-white/60">• Client Sign-Off Complete</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide mt-1">
              {manifest.title}
            </h2>
            <p className="text-xs text-white/70 mt-1">
              Submitted by <strong className="text-white">{manifest.clientName}</strong> ({manifest.clientEmail}) on {new Date(manifest.submittedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-3">
          {onBackToSelector && (
            <button
              onClick={onBackToSelector}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-colors"
            >
              ← Back to Live Draft
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 border border-white/20 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Manifest</span>
          </button>
          <button
            onClick={() => alert('Exporting InDesign XML & high-res print asset bundle for binding lab...')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C8A96E] to-[#a3854d] text-black font-extrabold text-xs flex items-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-[#C8A96E]/20"
          >
            <Download className="w-4 h-4" />
            <span>Export InDesign Bundle</span>
          </button>
        </div>
      </div>

      {/* Production Specifications & Statistics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Specs Box */}
        <div className="bg-[#161628] border border-white/10 rounded-3xl p-6 flex flex-col justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#C8A96E] flex items-center gap-1.5 border-b border-white/10 pb-3">
              <BookOpen className="w-4 h-4" /> Physical Album Binding Specifications
            </h3>
            <div className="mt-4 flex flex-col gap-3 text-xs">
              <div className="flex justify-between">
                <span className="text-white/60">Dimensions:</span>
                <span className="font-bold text-white">{specifications.albumSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Page Spreads:</span>
                <span className="font-bold text-white">{specifications.pageCount} Pages ({specifications.pageCount / 2} Spreads)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Cover Material:</span>
                <span className="font-bold text-white">{specifications.coverMaterial}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Emboss Foil Color:</span>
                <span className="font-bold text-[#C8A96E]">{specifications.coverColor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Embossed Text:</span>
                <span className="font-bold text-white text-right max-w-[180px] truncate">{specifications.embossText}</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-[11px] text-white/70">
            <strong>Cover Photo ID:</strong> {specifications.coverPhoto?.id || 'Spread #1 Solo'}
          </div>
        </div>

        {/* Client Notes Box */}
        <div className="bg-[#161628] border border-white/10 rounded-3xl p-6 flex flex-col gap-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#C8A96E] flex items-center gap-1.5 border-b border-white/10 pb-3">
            <MessageSquare className="w-4 h-4" /> Client Master Production Notes
          </h3>
          <div className="p-4 rounded-2xl bg-[#0d0d1a] border border-white/10 text-xs text-white/90 leading-relaxed min-h-[120px]">
            {specifications.clientNotes || 'No master layout notes specified. Proceed with standard clean borderless spreads.'}
          </div>
        </div>

        {/* Statistics Box */}
        <div className="bg-[#161628] border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#C8A96E] flex items-center gap-1.5 border-b border-white/10 pb-3">
            <Layers className="w-4 h-4" /> Curation Metrics
          </h3>
          <div className="grid grid-cols-2 gap-4 my-2">
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
              <span className="text-2xl font-black text-[#C8A96E]">{statistics.totalPhotosFavorited}</span>
              <span className="block text-[10px] text-white/60 uppercase font-bold mt-1">Favorited Proofs</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
              <span className="text-2xl font-black text-white">{statistics.totalSpreadsConfigured}</span>
              <span className="block text-[10px] text-white/60 uppercase font-bold mt-1">Total Spreads</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
              <span className="text-2xl font-black text-amber-400">{statistics.totalCommentsAttached}</span>
              <span className="block text-[10px] text-white/60 uppercase font-bold mt-1">Retouch Notes</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
              <span className="text-2xl font-black text-rose-400">{statistics.totalPhotosRejected}</span>
              <span className="block text-[10px] text-white/60 uppercase font-bold mt-1">Rejected Outtakes</span>
            </div>
          </div>
        </div>

      </div>

      {/* Spreads Production Sequence Table / Grid */}
      <div className="bg-[#161628] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Production Spread Sequence Manifest</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#C8A96E]/20 text-[#C8A96E] text-xs font-mono">
              Ordered Proofs ({spreads.length})
            </span>
          </h3>
          <span className="text-xs text-white/50">Ready for binder layout export</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {spreads.map((item) => (
            <div
              key={item.sequenceNumber}
              className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row gap-4 items-start"
            >
              <div className="w-full sm:w-36 aspect-[3/2] rounded-xl overflow-hidden bg-black/80 border border-white/15 relative shrink-0">
                <img src={item.photo?.url} alt={item.photo?.caption} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[#C8A96E] text-[10px] font-bold border border-[#C8A96E]/40">
                  Seq #{item.sequenceNumber}
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between h-full gap-2 text-xs">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Proof #{item.photo?.id}</span>
                    <span className="text-[11px] text-white/50">Est. Spread Page {item.spreadPageEstimate}</span>
                  </div>
                  <p className="text-white/70 mt-1 line-clamp-2">{item.photo?.caption}</p>
                </div>

                {item.comments && item.comments.length > 0 ? (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200">
                    <strong className="text-amber-400 block mb-0.5">Note ({item.comments[0].clientName}):</strong>
                    {item.comments[0].comment}
                  </div>
                ) : (
                  <span className="text-[11px] text-white/40 italic">No retouch note attached</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

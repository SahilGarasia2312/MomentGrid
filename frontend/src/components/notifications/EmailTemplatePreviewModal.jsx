'use strict';
'use client';

import React, { useState } from 'react';
import { Mail, X, ChevronLeft, ChevronRight, ExternalLink, Clock, Eye } from 'lucide-react';

export default function EmailTemplatePreviewModal({
  emailLogs = [],
  isOpen,
  onClose,
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!isOpen) return null;

  const TYPE_LABELS = {
    gallery_ready: { label: 'Gallery Live', color: 'text-[#C8A96E] bg-[#C8A96E]/10 border-[#C8A96E]/20' },
    album_ready: { label: 'Album Selection', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
    booking_update: { label: 'Booking Confirmed', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
    payment_reminder: { label: 'Payment Escrow', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  };

  const log = emailLogs[activeIndex];

  const handlePrev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const handleNext = () => setActiveIndex((i) => Math.min(emailLogs.length - 1, i + 1));

  const formatTime = (iso) => {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleString('en-IN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (_) {
      return iso;
    }
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      style={{ animation: 'fadeIn 0.2s ease-out forwards' }}
      role="dialog"
      aria-modal="true"
      aria-label="Email Template Preview"
    >
      <div className="relative w-full max-w-4xl bg-[#0E0E1C] border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C8A96E]/10 border border-[#C8A96E]/20 flex items-center justify-center">
              <Mail className="w-4 h-4 text-[#C8A96E]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">HTML Email Dispatch Log</h2>
              <p className="text-[11px] text-white/40">
                {emailLogs.length} email{emailLogs.length !== 1 ? 's' : ''} dispatched this session
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Navigation */}
            {emailLogs.length > 1 && (
              <div className="flex items-center gap-1 mr-2">
                <button
                  id="btn-email-log-prev"
                  onClick={handlePrev}
                  disabled={activeIndex === 0}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white/70 hover:text-white transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs text-white/50 font-mono min-w-[40px] text-center">
                  {activeIndex + 1} / {emailLogs.length}
                </span>
                <button
                  id="btn-email-log-next"
                  onClick={handleNext}
                  disabled={activeIndex === emailLogs.length - 1}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white/70 hover:text-white transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              id="btn-close-email-preview"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {emailLogs.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20 text-white/30">
            <Mail className="w-12 h-12" />
            <p className="text-sm font-bold uppercase tracking-widest">No Emails Dispatched Yet</p>
            <p className="text-xs text-center max-w-xs">Trigger a notification from the Simulator panel to generate a luxury HTML email preview.</p>
          </div>
        ) : log ? (
          <>
            {/* Email Metadata Bar */}
            <div className="flex flex-wrap items-center gap-3 px-6 py-3 bg-white/[0.02] border-b border-white/5 flex-shrink-0">
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${(TYPE_LABELS[log.type] || TYPE_LABELS.booking_update).color}`}>
                {(TYPE_LABELS[log.type] || TYPE_LABELS.booking_update).label}
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-white/50">
                <Mail className="w-3 h-3" />
                <span className="font-mono">{log.recipientEmail}</span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-white/40">
                <Clock className="w-3 h-3" />
                <span>{formatTime(log.dispatchedAt)}</span>
              </div>

              <div className="ml-auto flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-1 rounded-full">
                <Eye className="w-3 h-3" />
                Luxury HTML Preview
              </div>
            </div>

            {/* Subject Line */}
            <div className="px-6 py-3 border-b border-white/5 flex-shrink-0">
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Subject</p>
              <p className="text-sm text-white font-semibold">{log.title}</p>
            </div>

            {/* HTML Iframe Preview */}
            <div className="flex-1 overflow-hidden relative">
              {log.htmlContent ? (
                <iframe
                  srcDoc={log.htmlContent}
                  title="Email preview"
                  className="w-full h-full min-h-[400px] border-0"
                  sandbox="allow-same-origin"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-white/30">
                  <p className="text-sm">No HTML template generated for this log entry.</p>
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

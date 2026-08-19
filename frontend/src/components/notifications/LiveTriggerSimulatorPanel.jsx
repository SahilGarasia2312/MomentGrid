'use strict';
'use client';

import React, { useState } from 'react';
import { Zap, BookOpen, Image, Bell, CreditCard, Loader2, CheckCircle2, Sparkles } from 'lucide-react';
import { notificationApi } from '../../lib/api/notificationApi';

const REMINDER_TYPES = [
  {
    id: 'gallery_ready',
    label: 'Gallery Live',
    description: 'Master heirloom gallery collection is ready for review',
    icon: Image,
    color: 'text-[#C8A96E]',
    bg: 'bg-[#C8A96E]/10',
    border: 'border-[#C8A96E]/20',
    hoverBorder: 'hover:border-[#C8A96E]/50',
  },
  {
    id: 'album_ready',
    label: 'Album Selection',
    description: 'Luxe album curation portal is open for spread selection',
    icon: BookOpen,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/20',
    hoverBorder: 'hover:border-purple-400/50',
  },
  {
    id: 'booking_update',
    label: 'Booking Confirmed',
    description: 'Session schedule, photographers & location locked',
    icon: Bell,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
    hoverBorder: 'hover:border-blue-400/50',
  },
  {
    id: 'payment_reminder',
    label: 'Payment Escrow',
    description: 'Remaining balance due via Razorpay cryptographic ledger',
    icon: CreditCard,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
    hoverBorder: 'hover:border-emerald-400/50',
  },
];

export default function LiveTriggerSimulatorPanel({
  recipientEmail = 'elena.rossi@momentgrid.com',
  onNotificationDispatched,
}) {
  const [loadingType, setLoadingType] = useState(null);
  const [lastDispatched, setLastDispatched] = useState(null);
  const [customEmail, setCustomEmail] = useState(recipientEmail);

  const handleTrigger = async (type) => {
    setLoadingType(type);
    setLastDispatched(null);
    try {
      const res = await notificationApi.simulateReminder({
        recipientEmail: customEmail,
        reminderType: type,
      });
      if (res?.data) {
        setLastDispatched({ type, notification: res.data.notification });
        if (onNotificationDispatched) {
          onNotificationDispatched(res.data);
        }
      }
    } catch (e) {
      console.error('Simulation trigger failed:', e);
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
        <div className="w-8 h-8 rounded-xl bg-[#C8A96E]/10 border border-[#C8A96E]/20 flex items-center justify-center">
          <Zap className="w-4 h-4 text-[#C8A96E]" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Live Trigger Simulator</h3>
          <p className="text-[11px] text-white/40">Fire real-time alerts across Email + SSE + In-App channels</p>
        </div>
        <div className="ml-auto">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-1 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
        </div>
      </div>

      {/* Recipient Input */}
      <div className="px-5 pt-4 pb-3">
        <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">
          Dispatch Recipient
        </label>
        <input
          id="input-simulator-email"
          type="email"
          value={customEmail}
          onChange={(e) => setCustomEmail(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#C8A96E]/50 transition-colors"
          placeholder="client@momentgrid.com"
        />
      </div>

      {/* Trigger Buttons Grid */}
      <div className="px-5 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {REMINDER_TYPES.map((rt) => {
          const Icon = rt.icon;
          const isLoading = loadingType === rt.id;
          const wasDispatched = lastDispatched?.type === rt.id;

          return (
            <button
              key={rt.id}
              id={`btn-simulate-${rt.id}`}
              onClick={() => handleTrigger(rt.id)}
              disabled={!!loadingType}
              className={`relative flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all duration-300
                ${wasDispatched
                  ? 'bg-emerald-400/10 border-emerald-400/30'
                  : `${rt.bg} ${rt.border} ${rt.hoverBorder}`
                }
                disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${rt.bg} border ${rt.border} flex items-center justify-center`}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 text-white/60 animate-spin" />
                ) : wasDispatched ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Icon className={`w-4 h-4 ${rt.color}`} />
                )}
              </div>
              <div className="min-w-0">
                <p className={`text-xs font-bold ${wasDispatched ? 'text-emerald-300' : 'text-white'}`}>
                  {wasDispatched ? 'Dispatched ✓' : rt.label}
                </p>
                <p className="text-[10px] text-white/40 leading-snug mt-0.5">
                  {rt.description}
                </p>
              </div>
              {!isLoading && !wasDispatched && (
                <Sparkles className={`absolute top-2.5 right-2.5 w-3 h-3 ${rt.color} opacity-40`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Last Dispatched Confirmation */}
      {lastDispatched && (
        <div className="mx-5 mb-4 p-3 rounded-xl bg-emerald-400/10 border border-emerald-400/20">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-300">
                Alert dispatched to {customEmail}
              </p>
              <p className="text-[10px] text-white/40 mt-0.5">
                {lastDispatched.notification?.title || 'Notification sent'} — Check bell & email log
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

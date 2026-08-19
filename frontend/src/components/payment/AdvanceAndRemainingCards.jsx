'use strict';
'use client';

import React from 'react';
import { CreditCard, CheckCircle2, AlertCircle, Calendar, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function AdvanceAndRemainingCards({
  invoice,
  currency = 'USD',
  onOpenCheckout,
}) {
  if (!invoice) return null;

  const {
    advanceAmount = 960,
    remainingAmount = 2240,
    amountPaid = 960,
    taxRate = 18,
    dueDate,
  } = invoice;

  // Calculate taxes on splits for clean presentation
  const advanceTax = Math.round((advanceAmount * taxRate) / 100);
  const advanceTotal = advanceAmount + advanceTax;
  const isAdvancePaid = amountPaid >= advanceAmount;

  const remainingTax = Math.round((remainingAmount * taxRate) / 100);
  const remainingTotal = remainingAmount + remainingTax;
  const isFullyPaid = amountPaid >= advanceAmount + remainingAmount;

  const formatMoney = (val) => {
    if (currency === 'INR') {
      return `₹${Math.round(val * 83).toLocaleString('en-IN')}`;
    }
    return `$${Number(val).toLocaleString()}`;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-[#161628] p-6 rounded-3xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Milestone Payment Schedule</span>
            <Sparkles className="w-4 h-4 text-[#C8A96E]" />
          </h2>
          <p className="text-xs text-white/60 mt-0.5">
            MomentGrid uses milestone deposits: an initial advance booking deposit locks your event date, and the remaining balance is collected prior to digital proofing or print release.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold bg-[#C8A96E]/10 border border-[#C8A96E]/20 px-4 py-2 rounded-xl text-[#C8A96E] self-start sm:self-auto whitespace-nowrap">
          <ShieldCheck className="w-4 h-4" />
          <span>256-Bit SSL Razorpay Protected</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Milestone 1: Advance Booking Deposit */}
        <div className={`p-6 sm:p-8 rounded-3xl border transition-all relative flex flex-col justify-between ${
          isAdvancePaid
            ? 'bg-[#161628]/60 border-emerald-500/30'
            : 'bg-gradient-to-br from-[#161628] to-[#1f1f3a] border-[#C8A96E]/40 shadow-2xl shadow-[#C8A96E]/10'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#C8A96E] px-3 py-1 rounded-full bg-[#C8A96E]/10 border border-[#C8A96E]/20">
                Milestone 01 • Advance Deposit
              </span>
              {isAdvancePaid ? (
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Paid & Verified</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  <AlertCircle className="w-4 h-4" />
                  <span>Due Immediately</span>
                </span>
              )}
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight">Advance Date Reservation Fee</h3>
            <p className="text-xs text-white/60 mt-1">
              Secures your lead photographers (`2 Master Photographers + Drone Coverage`) for the selected dates.
            </p>

            <div className="my-6 space-y-2 py-4 border-y border-white/10 text-sm">
              <div className="flex justify-between text-white/70">
                <span>Advance Deposit (30%):</span>
                <span className="font-bold text-white">{formatMoney(advanceAmount)}</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Estimated GST/Tax ({taxRate}%):</span>
                <span className="font-bold text-white">{formatMoney(advanceTax)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#C8A96E] pt-2 border-t border-white/10">
                <span>Total Milestone 01 Amount:</span>
                <span>{formatMoney(advanceTotal)}</span>
              </div>
            </div>
          </div>

          <div>
            {isAdvancePaid ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-center text-xs text-emerald-300 font-medium flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Advance deposit collected. Event dates are locked!</span>
              </div>
            ) : (
              <button
                onClick={() => onOpenCheckout && onOpenCheckout('advance', advanceTotal)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#C8A96E] via-[#dfbe82] to-[#a3854d] text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#C8A96E]/20 hover:brightness-110 transition-all group"
              >
                <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Pay Advance Deposit ({formatMoney(advanceTotal)}) via Razorpay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Milestone 2: Remaining Balance */}
        <div className={`p-6 sm:p-8 rounded-3xl border transition-all relative flex flex-col justify-between ${
          isFullyPaid
            ? 'bg-[#161628]/60 border-emerald-500/30'
            : 'bg-[#161628] border-white/10 hover:border-white/20'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-white/60 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                Milestone 02 • Remaining Balance
              </span>
              {isFullyPaid ? (
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Settled & Paid</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs font-bold text-white/60 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                  <Calendar className="w-4 h-4 text-[#C8A96E]" />
                  <span>Due Prior to Gallery Release</span>
                </span>
              )}
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight">Final Settlement & Digital Rights</h3>
            <p className="text-xs text-white/60 mt-1">
              Covers full post-production film grading, master album artisan print binding, and watermark-free cloud vault access.
            </p>

            <div className="my-6 space-y-2 py-4 border-y border-white/10 text-sm">
              <div className="flex justify-between text-white/70">
                <span>Remaining Package Balance (70%):</span>
                <span className="font-bold text-white">{formatMoney(remainingAmount)}</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Estimated GST/Tax ({taxRate}%):</span>
                <span className="font-bold text-white">{formatMoney(remainingTax)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                <span>Total Milestone 02 Amount:</span>
                <span>{formatMoney(remainingTotal)}</span>
              </div>
            </div>
          </div>

          <div>
            {isFullyPaid ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-center text-xs text-emerald-300 font-medium flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>All milestone balances settled in full.</span>
              </div>
            ) : !isAdvancePaid ? (
              <button
                disabled
                className="w-full py-4 rounded-2xl bg-white/5 text-white/30 font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed border border-white/5"
              >
                <span>Complete Advance Deposit First</span>
              </button>
            ) : (
              <button
                onClick={() => onOpenCheckout && onOpenCheckout('remaining', remainingTotal)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 hover:brightness-110 transition-all group"
              >
                <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Pay Remaining Balance ({formatMoney(remainingTotal)}) via Razorpay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

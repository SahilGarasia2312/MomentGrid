'use strict';
'use client';

import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, RefreshCw, X, CheckCircle2, DollarSign } from 'lucide-react';

export default function RefundManagerModal({
  invoice,
  currency = 'USD',
  onInitiateRefund,
}) {
  const [refundAmount, setRefundAmount] = useState('');
  const [reason, setReason] = useState('Client cancellation / mutual reschedule dispute');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!invoice) return null;

  const {
    amountPaid = 960,
    refunds = [],
    status,
  } = invoice;

  const formatMoney = (val) => {
    if (currency === 'INR') {
      return `₹${Math.round(val * 83).toLocaleString('en-IN')}`;
    }
    return `$${Number(val).toLocaleString()}`;
  };

  const handleRefundSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const amt = Number(refundAmount) || amountPaid;
    if (amt <= 0) {
      setError('Please enter a valid refund amount greater than zero.');
      return;
    }
    if (amt > amountPaid) {
      setError(`Cannot refund an amount (${formatMoney(amt)}) exceeding the total collected deposit (${formatMoney(amountPaid)}).`);
      return;
    }
    if (!reason || !reason.trim()) {
      setError('A valid dispute or cancellation reason is required.');
      return;
    }

    setLoading(true);
    try {
      await onInitiateRefund({
        amount: amt,
        reason: reason.trim(),
        initiatedBy: 'studio_executive_portal',
      });
      setSuccessMsg(`Refund of ${formatMoney(amt)} initiated successfully via Razorpay Payout Gateway.`);
      setRefundAmount('');
    } catch (err) {
      setError(err.message || 'Refund processing failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-[#161628] p-6 rounded-3xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span>Refund & Dispute Resolution Center</span>
          </h2>
          <p className="text-xs text-white/60 mt-0.5">
            Process instant partial or full refunds directly back to the client's original UPI / Credit Card payment source via Razorpay Payouts.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-xl text-rose-400 font-bold text-xs self-start sm:self-auto">
          <span>Available Escrow: {formatMoney(amountPaid)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Refund Initiation Form */}
        <form onSubmit={handleRefundSubmit} className="bg-[#161628] p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2 border-b border-white/10 pb-4">
            <span>Initiate New Refund Request</span>
          </h3>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/70">
              Refund Amount ({currency}) • Max: {formatMoney(amountPaid)}
            </label>
            <div className="relative">
              <input
                type="number"
                step="any"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                placeholder={`Leave empty for full refund (${amountPaid})`}
                disabled={amountPaid <= 0 || loading}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/30 focus:border-[#C8A96E] focus:outline-none text-sm font-bold disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/70">
              Dispute / Cancellation Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={amountPaid <= 0 || loading}
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#C8A96E] focus:outline-none text-xs font-bold"
            >
              <option value="Client cancellation / mutual reschedule dispute">Client cancellation / mutual reschedule dispute</option>
              <option value="Event weather cancellation - Full refund policy">Event weather cancellation - Full refund policy</option>
              <option value="Partial refund for unfulfilled drone coverage">Partial refund for unfulfilled drone coverage</option>
              <option value="Goodwill discount refund adjustment">Goodwill discount refund adjustment</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={amountPaid <= 0 || loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-rose-500/20 hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processing Cryptographic Payout...</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4" />
                <span>Process Refund via Razorpay</span>
              </>
            )}
          </button>
        </form>

        {/* Right: Refund History Ledger */}
        <div className="bg-[#161628] p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white tracking-tight border-b border-white/10 pb-4">
            <span>Historical Refund Audit Trail ({refunds.length})</span>
          </h3>

          {refunds.length === 0 ? (
            <div className="text-center py-12 text-white/40 space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400/40" />
              <p className="font-bold text-white/70 text-sm">No Refunds Processed</p>
              <p className="text-xs">All deposits for this invoice are verified and active.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {refunds.map((ref, i) => (
                <div key={ref.id || i} className="p-4 rounded-2xl bg-black/30 border border-white/10 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-400">{formatMoney(ref.amount)} Refunded</span>
                    <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                      {ref.status || 'Processed'}
                    </span>
                  </div>
                  <p className="text-xs text-white/80 font-medium">{ref.reason}</p>
                  <div className="flex items-center justify-between text-[11px] text-white/40 border-t border-white/5 pt-2">
                    <span>ID: {ref.id}</span>
                    <span>{ref.createdAt ? new Date(ref.createdAt).toLocaleString() : 'Just now'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

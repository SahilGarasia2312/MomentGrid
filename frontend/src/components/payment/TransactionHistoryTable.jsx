'use strict';
'use client';

import React from 'react';
import { History, CheckCircle2, RefreshCw, CreditCard, ArrowUpRight, Search } from 'lucide-react';

export default function TransactionHistoryTable({
  transactions = [],
  currency = 'USD',
}) {
  const formatMoney = (val) => {
    if (currency === 'INR') {
      return `₹${Math.round(Math.abs(val) * 83).toLocaleString('en-IN')}`;
    }
    return `$${Number(Math.abs(val)).toLocaleString()}`;
  };

  const getMethodBadge = (method = '') => {
    if (method.includes('upi')) {
      return <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold">UPI / GPay</span>;
    }
    if (method.includes('card')) {
      return <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold">Credit/Debit Card</span>;
    }
    if (method.includes('refund')) {
      return <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold">Refund Payout</span>;
    }
    return <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white border border-white/20 text-xs font-bold">Bank Transfer</span>;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-[#161628] p-6 rounded-3xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-[#C8A96E]" />
            <span>Cryptographic Payment Audit Log</span>
          </h2>
          <p className="text-xs text-white/60 mt-0.5">
            Every transaction is verified against Razorpay cryptographic signatures (`order_id`, `payment_id`, `signature`) and permanently logged to the studio ledger.
          </p>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="bg-[#161628] p-12 rounded-3xl border border-white/10 text-center text-white/50 space-y-2">
          <History className="w-10 h-10 mx-auto text-white/20" />
          <p className="font-bold text-white">No Transactions Recorded Yet</p>
          <p className="text-xs">Once advance or remaining deposits are processed via Razorpay, they will appear here instantly.</p>
        </div>
      ) : (
        <div className="bg-[#161628] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-[11px] uppercase tracking-wider text-white/50">
                  <th className="py-4 px-6">Transaction ID / Razorpay ID</th>
                  <th className="py-4 px-6">Milestone / Type</th>
                  <th className="py-4 px-6">Payment Method</th>
                  <th className="py-4 px-6">Timestamp</th>
                  <th className="py-4 px-6 text-right">Net Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {transactions.map((tx, i) => {
                  const isRefund = tx.amount < 0 || tx.type === 'refund' || tx.status === 'refunded';
                  return (
                    <tr key={tx.id || i} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{tx.razorpayPaymentId || tx.id}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-white/40" />
                        </div>
                        <span className="text-xs text-white/40 block mt-0.5">Order: {tx.razorpayOrderId || 'N/A'}</span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="font-medium text-white/90 capitalize">
                          {tx.type ? tx.type.replace('_', ' ') : 'Online Settlement'}
                        </div>
                        <span className="text-xs text-white/50 block mt-0.5">{tx.note || 'Verified transaction'}</span>
                      </td>

                      <td className="py-4 px-6">
                        {getMethodBadge(tx.method)}
                      </td>

                      <td className="py-4 px-6 text-xs text-white/60">
                        {tx.createdAt ? new Date(tx.createdAt).toLocaleString() : 'Just now'}
                      </td>

                      <td className="py-4 px-6 text-right font-black">
                        {isRefund ? (
                          <span className="text-rose-400">-{formatMoney(tx.amount)}</span>
                        ) : (
                          <span className="text-emerald-400">+{formatMoney(tx.amount)}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

'use strict';
'use client';

import React from 'react';
import { BarChart3, DollarSign, TrendingUp, AlertTriangle, CheckCircle2, Clock, Users, ArrowUpRight, ShieldCheck } from 'lucide-react';

export default function AdminFinancialDashboard({
  reportData,
  currency = 'USD',
  onRefresh,
}) {
  if (!reportData || !reportData.financialKpis) return null;

  const { financialKpis, recentLedger = [] } = reportData;

  const formatMoney = (val) => {
    if (currency === 'INR') {
      return `₹${Math.round(val * 83).toLocaleString('en-IN')}`;
    }
    return `$${Number(val || 0).toLocaleString()}`;
  };

  const kpis = [
    {
      label: 'Total Revenue Collected',
      value: formatMoney(financialKpis.totalRevenueCollected),
      icon: DollarSign,
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
      sub: `${financialKpis.paidInvoicesCount} full settlements verified`,
    },
    {
      label: 'Outstanding Receivables',
      value: formatMoney(financialKpis.totalOutstandingReceivables),
      icon: TrendingUp,
      color: 'from-[#C8A96E]/20 to-[#967d4f]/10 border-[#C8A96E]/30 text-[#C8A96E]',
      sub: `${financialKpis.advancePaidCount} advance deposits active`,
    },
    {
      label: 'Total Package Contract Volume',
      value: formatMoney(financialKpis.totalPackageVolume),
      icon: BarChart3,
      color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400',
      sub: `${financialKpis.totalInvoicesCount} invoices generated across collective`,
    },
    {
      label: 'Overdue / Dispute Action Required',
      value: `${financialKpis.overdueCount + financialKpis.refundedCount} Invoices`,
      icon: AlertTriangle,
      color: 'from-rose-500/20 to-pink-500/10 border-rose-500/30 text-rose-400',
      sub: `${financialKpis.refundedCount} refunds processed to date`,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header banner */}
      <div className="bg-[#161628] p-6 rounded-3xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#C8A96E]" />
            <span>Studio Executive Financial Analytics</span>
          </h2>
          <p className="text-xs text-white/60 mt-0.5">
            Real-time multi-currency aggregate KPIs across all MomentGrid destination bookings, automated milestone escrows, and tax reports.
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/10 flex items-center gap-2 self-start sm:self-auto transition-colors"
        >
          <span>Refresh Ledger Metrics</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className={`p-6 rounded-3xl bg-gradient-to-br border flex flex-col justify-between ${kpi.color}`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-extrabold uppercase tracking-wider opacity-80">{kpi.label}</span>
                <Icon className="w-5 h-5 opacity-90" />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight text-white">{kpi.value}</h3>
                <p className="text-xs opacity-70 mt-1">{kpi.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Studio Executive Ledger Table */}
      <div className="bg-[#161628] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Recent Studio Invoices & Collection Ledger</h3>
          <span className="text-xs font-bold text-white/40">{recentLedger.length} Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-[11px] uppercase tracking-wider text-white/50">
                <th className="py-4 px-6">Invoice # / Client</th>
                <th className="py-4 px-6">Event Description</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Contract Total</th>
                <th className="py-4 px-6 text-right">Collected</th>
                <th className="py-4 px-6 text-right">Balance Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {recentLedger.map((inv, i) => {
                const bal = inv.financials ? inv.financials.balanceDue : (inv.totalPackageAmount - (inv.amountPaid || 0));
                return (
                  <tr key={inv.invoiceNumber || i} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{inv.invoiceNumber}</span>
                      </div>
                      <span className="text-xs text-white/50 block mt-0.5">{inv.clientEmail}</span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="text-xs text-white/80 font-medium block max-w-xs truncate">{inv.description || 'Destination Wedding Package'}</span>
                    </td>

                    <td className="py-4 px-6">
                      {inv.status === 'paid' ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Paid
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-[#C8A96E]/20 text-[#C8A96E] font-bold text-xs border border-[#C8A96E]/30 inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Advance Paid
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right font-bold text-white">
                      {formatMoney(inv.financials?.grandTotal || inv.totalPackageAmount)}
                    </td>

                    <td className="py-4 px-6 text-right font-bold text-emerald-400">
                      {formatMoney(inv.financials?.amountPaid || inv.amountPaid)}
                    </td>

                    <td className="py-4 px-6 text-right font-black text-[#C8A96E]">
                      {bal > 0 ? formatMoney(bal) : <span className="text-white/30">$0</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

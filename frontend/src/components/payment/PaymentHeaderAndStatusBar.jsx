'use strict';
'use client';

import React from 'react';
import { CreditCard, DollarSign, FileText, History, ShieldAlert, BarChart3, CheckCircle, Clock, AlertTriangle, RefreshCw } from 'lucide-react';

export default function PaymentHeaderAndStatusBar({
  invoiceNumber = 'INV-2026-089',
  clientEmail = 'elena.rossi@momentgrid.com',
  status = 'advance_paid',
  currency = 'USD',
  amountPaid = 960,
  grandTotal = 3776,
  activeTab = 'milestones', // 'milestones' | 'invoice' | 'history' | 'refund' | 'admin'
  onTabChange,
  onCurrencyToggle,
}) {
  const percentPaid = grandTotal > 0 ? Math.min(100, Math.round((amountPaid / grandTotal) * 100)) : 0;

  const getStatusBadge = () => {
    switch (status) {
      case 'paid':
        return (
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Fully Paid</span>
          </span>
        );
      case 'advance_paid':
        return (
          <span className="px-3 py-1 rounded-full bg-[#C8A96E]/20 text-[#C8A96E] border border-[#C8A96E]/30 text-xs font-bold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Advance Deposit Paid (30%)</span>
          </span>
        );
      case 'overdue':
        return (
          <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Overdue Balance</span>
          </span>
        );
      case 'refunded':
        return (
          <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-bold flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Fully Refunded</span>
          </span>
        );
      case 'partial_refund':
        return (
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-bold flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Partially Refunded</span>
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full bg-white/10 text-white/70 border border-white/20 text-xs font-bold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Deposit</span>
          </span>
        );
    }
  };

  const tabs = [
    { id: 'milestones', label: 'Advance & Remaining', icon: CreditCard },
    { id: 'invoice', label: 'Itemized Invoice', icon: FileText },
    { id: 'history', label: 'Transaction History', icon: History },
    { id: 'refund', label: 'Refund & Dispute', icon: ShieldAlert },
    { id: 'admin', label: 'Admin Reports', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0A0A14]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-4 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        
        {/* Top bar: Invoice info & currency switch */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#C8A96E] to-[#967d4f] flex items-center justify-center shadow-lg shadow-[#C8A96E]/20 text-black font-extrabold text-sm">
              ₹$
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  <span>Invoice {invoiceNumber}</span>
                </h1>
                {getStatusBadge()}
              </div>
              <p className="text-xs text-white/50 mt-0.5">Client: {clientEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onCurrencyToggle}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 flex items-center gap-1.5 transition-colors"
              title="Switch currency formatting"
            >
              <DollarSign className="w-3.5 h-3.5 text-[#C8A96E]" />
              <span>Currency: {currency}</span>
            </button>
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[11px] uppercase tracking-wider text-white/40 font-bold">Collected Balance</span>
              <span className="text-xs font-bold text-[#C8A96E]">
                {currency === 'INR' ? `₹${amountPaid.toLocaleString('en-IN')}` : `$${amountPaid.toLocaleString()}`} / {currency === 'INR' ? `₹${grandTotal.toLocaleString('en-IN')}` : `$${grandTotal.toLocaleString()}`} ({percentPaid}%)
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-[#C8A96E] to-emerald-400 transition-all duration-500 ease-out"
            style={{ width: `${percentPaid}%` }}
          />
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange && onTabChange(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#C8A96E] text-black shadow-lg shadow-[#C8A96E]/20'
                    : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-[#C8A96E]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

      </div>
    </header>
  );
}

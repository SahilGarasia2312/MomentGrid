'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { paymentApi } from '../../lib/api/paymentApi';
import PaymentHeaderAndStatusBar from './PaymentHeaderAndStatusBar';
import AdvanceAndRemainingCards from './AdvanceAndRemainingCards';
import ItemizedInvoiceView from './ItemizedInvoiceView';
import TransactionHistoryTable from './TransactionHistoryTable';
import RefundManagerModal from './RefundManagerModal';
import AdminFinancialDashboard from './AdminFinancialDashboard';
import MockRazorpayCheckoutModal from './MockRazorpayCheckoutModal';
import { RefreshCw, Sparkles, Building2, User } from 'lucide-react';

export default function PaymentSuite({
  initialEmail = 'elena.rossi@momentgrid.com',
  initialBookingId = 'booking-momentgrid-como-2026',
}) {
  const [invoice, setInvoice] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [activeTab, setActiveTab] = useState('milestones'); // 'milestones' | 'invoice' | 'history' | 'refund' | 'admin'
  const [currency, setCurrency] = useState('USD'); // 'USD' | 'INR'
  const [loading, setLoading] = useState(true);

  // Razorpay modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutMilestone, setCheckoutMilestone] = useState('advance');
  const [checkoutAmount, setCheckoutAmount] = useState(960);

  const loadData = async () => {
    setLoading(true);
    try {
      const invRes = await paymentApi.getOrCreateInvoice({
        clientEmail: initialEmail,
        bookingId: initialBookingId,
      });
      if (invRes?.data) {
        setInvoice(invRes.data);
      }

      const adminRes = await paymentApi.getAdminReports('studio-momentgrid-collective');
      if (adminRes?.data) {
        setAdminData(adminRes.data);
      }
    } catch (e) {
      console.error('Failed to load payment data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [initialEmail]);

  const handleCurrencyToggle = () => {
    setCurrency((prev) => (prev === 'USD' ? 'INR' : 'USD'));
  };

  const handleOpenCheckout = (milestone, amount) => {
    setCheckoutMilestone(milestone);
    setCheckoutAmount(amount);
    setIsCheckoutOpen(true);
  };

  const handleRazorpaySuccess = async (paymentData) => {
    if (!invoice) return;
    const updated = await paymentApi.processRazorpay({
      paymentId: invoice.id,
      ...paymentData,
    });
    if (updated?.data) {
      setInvoice(updated.data);
    }
    await loadData(); // refresh ledger
  };

  const handleInitiateRefund = async (refundPayload) => {
    if (!invoice) return;
    const updated = await paymentApi.initiateRefund({
      paymentId: invoice.id,
      ...refundPayload,
    });
    if (updated?.data) {
      setInvoice(updated.data);
    }
    await loadData();
  };

  if (loading && !invoice) {
    return (
      <div className="min-h-screen bg-[#0A0A14] flex flex-col items-center justify-center text-white space-y-4">
        <RefreshCw className="w-10 h-10 text-[#C8A96E] animate-spin" />
        <p className="font-bold text-sm tracking-widest uppercase text-white/60">Loading MomentGrid Cryptographic Ledger...</p>
      </div>
    );
  }

  const grandTotal = invoice
    ? (invoice.invoiceItems || []).reduce((acc, it) => acc + (it.total || 0), 0) * (1 + (invoice.taxRate || 18) / 100)
    : 3776;

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white pb-20 selection:bg-[#C8A96E]/30">
      
      {/* Sticky Header */}
      <PaymentHeaderAndStatusBar
        invoiceNumber={invoice?.invoiceNumber || 'INV-2026-089'}
        clientEmail={invoice?.clientEmail || initialEmail}
        status={invoice?.status || 'advance_paid'}
        currency={currency}
        amountPaid={invoice?.amountPaid || 0}
        grandTotal={Math.round(grandTotal)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onCurrencyToggle={handleCurrencyToggle}
      />

      {/* Main Suite Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-8 space-y-8">
        
        {/* Top switch bar between Client Billing & Studio Executive Portal view */}
        <div className="flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/10 text-xs">
          <div className="flex items-center gap-2 text-white/70">
            <Sparkles className="w-4 h-4 text-[#C8A96E]" />
            <span className="font-bold">MomentGrid Billing Gateway</span>
            <span className="hidden sm:inline">• Automated Advance & Remaining Balance Escrow</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('milestones')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                activeTab !== 'admin'
                  ? 'bg-[#C8A96E]/20 text-[#C8A96E] border border-[#C8A96E]/30'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Client Portal</span>
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'admin'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Executive Portal</span>
            </button>
          </div>
        </div>

        {/* Dynamic Tab Content */}
        {activeTab === 'milestones' && (
          <AdvanceAndRemainingCards
            invoice={invoice}
            currency={currency}
            onOpenCheckout={handleOpenCheckout}
          />
        )}

        {activeTab === 'invoice' && (
          <ItemizedInvoiceView
            invoice={invoice}
            currency={currency}
          />
        )}

        {activeTab === 'history' && (
          <TransactionHistoryTable
            transactions={invoice?.transactions || []}
            currency={currency}
          />
        )}

        {activeTab === 'refund' && (
          <RefundManagerModal
            invoice={invoice}
            currency={currency}
            onInitiateRefund={handleInitiateRefund}
          />
        )}

        {activeTab === 'admin' && (
          <AdminFinancialDashboard
            reportData={adminData}
            currency={currency}
            onRefresh={loadData}
          />
        )}

      </main>

      {/* Interactive Razorpay Checkout Modal */}
      <MockRazorpayCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        milestone={checkoutMilestone}
        amount={checkoutAmount}
        currency={currency}
        clientEmail={invoice?.clientEmail || initialEmail}
        onSuccess={handleRazorpaySuccess}
      />
    </div>
  );
}

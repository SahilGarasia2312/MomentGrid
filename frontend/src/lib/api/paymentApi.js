'use strict';

import { httpClient } from '../utils/httpClient';

// Fallback sample state for offline or demonstration preview
let fallbackInvoiceState = {
  id: 'pay-heirloom-2026-089',
  invoiceNumber: 'INV-2026-089',
  clientEmail: 'elena.rossi@momentgrid.com',
  bookingId: 'booking-momentgrid-como-2026',
  studioId: 'studio-momentgrid-collective',
  description: 'Villa d’Este Destination Wedding Coverage & Master Heirloom Delivery Package',
  totalPackageAmount: 3200,
  advanceAmount: 960,
  remainingAmount: 2240,
  amountPaid: 960,
  amount: 3200,
  currency: 'USD',
  status: 'advance_paid',
  method: 'razorpay_upi',
  paymentType: 'advance',
  razorpayOrderId: 'order_mock_17206000',
  razorpayPaymentId: 'pay_mock_892311',
  razorpaySignature: 'sig_mock_verified_e3b0c44',
  taxRate: 18,
  invoiceItems: [
    {
      id: 'item-1',
      title: 'Full Day Destination Wedding Photography (2 Master Photographers + Drone)',
      quantity: 1,
      unitPrice: 2400,
      total: 2400,
    },
    {
      id: 'item-2',
      title: '12x12 Master Luxe Italian Leather Heirloom Print Album (40 Pages)',
      quantity: 1,
      unitPrice: 600,
      total: 600,
    },
    {
      id: 'item-3',
      title: 'Cinematic 4K Highlights Film Grading & Cloud Delivery Vault (10 Year Access)',
      quantity: 1,
      unitPrice: 200,
      total: 200,
    },
  ],
  transactions: [
    {
      id: 'tx-adv-17206000',
      type: 'advance_deposit',
      amount: 960,
      status: 'success',
      method: 'razorpay_upi',
      razorpayPaymentId: 'pay_mock_892311',
      razorpayOrderId: 'order_mock_17206000',
      note: 'Advance booking deposit verification complete (Google Pay / UPI).',
      createdAt: '2026-05-15T10:30:00Z',
    },
  ],
  refunds: [],
  dueDate: '2026-07-25T23:59:59Z',
  paidAt: null,
  createdAt: '2026-05-14T18:00:00Z',
  updatedAt: '2026-05-15T10:30:00Z',
};

const fallbackAdminStats = {
  totalRevenueCollected: 148500,
  totalOutstandingReceivables: 32400,
  totalPackageVolume: 180900,
  totalInvoicesCount: 42,
  paidInvoicesCount: 28,
  advancePaidCount: 11,
  overdueCount: 3,
  refundedCount: 1,
};

export const paymentApi = {
  /**
   * Create or retrieve itemized booking invoice
   */
  async getOrCreateInvoice(payload = {}) {
    try {
      const res = await httpClient('/payments/invoices', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res?.data) return res;
    } catch (e) {
      // Fallback
    }
    return {
      success: true,
      data: { ...fallbackInvoiceState },
    };
  },

  /**
   * Verify and process Razorpay Advance or Remaining balance payment
   */
  async processRazorpay({ paymentId = fallbackInvoiceState.id, milestone, amount, method, razorpayPaymentId, razorpayOrderId, razorpaySignature, note }) {
    try {
      const res = await httpClient(`/payments/${paymentId}/razorpay`, {
        method: 'POST',
        body: JSON.stringify({ milestone, amount, method, razorpayPaymentId, razorpayOrderId, razorpaySignature, note }),
      });
      if (res?.data) return res;
    } catch (e) {
      // Fallback update
    }

    const payAmt = Number(amount) || (milestone === 'advance' ? fallbackInvoiceState.advanceAmount : fallbackInvoiceState.remainingAmount);
    fallbackInvoiceState.amountPaid += payAmt;
    fallbackInvoiceState.method = method || 'razorpay_card';
    fallbackInvoiceState.razorpayPaymentId = razorpayPaymentId || `pay_mock_${Date.now()}`;
    fallbackInvoiceState.razorpayOrderId = razorpayOrderId || `order_mock_${Date.now()}`;
    fallbackInvoiceState.razorpaySignature = razorpaySignature || 'sig_mock_verified';
    fallbackInvoiceState.paymentType = milestone;

    fallbackInvoiceState.transactions.push({
      id: `tx-${milestone}-${Date.now()}`,
      type: milestone === 'advance' ? 'advance_deposit' : 'remaining_balance',
      amount: payAmt,
      status: 'success',
      method: method || 'razorpay_card',
      razorpayPaymentId: fallbackInvoiceState.razorpayPaymentId,
      razorpayOrderId: fallbackInvoiceState.razorpayOrderId,
      note: note || `Online Razorpay verification (${milestone}) complete.`,
      createdAt: new Date().toISOString(),
    });

    // Recalculate balance due
    const subtotal = fallbackInvoiceState.invoiceItems.reduce((acc, it) => acc + (it.total || 0), 0);
    const tax = Math.round((subtotal * fallbackInvoiceState.taxRate) / 100);
    const grand = subtotal + tax;
    if (fallbackInvoiceState.amountPaid >= grand) {
      fallbackInvoiceState.status = 'paid';
      fallbackInvoiceState.paidAt = new Date().toISOString();
    } else {
      fallbackInvoiceState.status = 'advance_paid';
    }
    fallbackInvoiceState.updatedAt = new Date().toISOString();

    return {
      success: true,
      data: { ...fallbackInvoiceState },
    };
  },

  /**
   * Initiate full or partial refund
   */
  async initiateRefund({ paymentId = fallbackInvoiceState.id, amount, reason, initiatedBy = 'studio_admin' }) {
    try {
      const res = await httpClient(`/payments/${paymentId}/refund`, {
        method: 'POST',
        body: JSON.stringify({ amount, reason, initiatedBy }),
      });
      if (res?.data) return res;
    } catch (e) {
      // Fallback update
    }

    const refAmt = Number(amount) || fallbackInvoiceState.amountPaid;
    fallbackInvoiceState.amountPaid -= refAmt;
    fallbackInvoiceState.refunds.push({
      id: `ref-${Date.now()}`,
      amount: refAmt,
      reason: reason || 'Client cancellation / dispute resolution',
      initiatedBy,
      status: 'processed',
      createdAt: new Date().toISOString(),
    });

    fallbackInvoiceState.transactions.push({
      id: `tx-ref-${Date.now()}`,
      type: 'refund',
      amount: -refAmt,
      status: 'refunded',
      method: 'razorpay_refund_payout',
      note: `Refund processed (${reason}). Initiated by ${initiatedBy}.`,
      createdAt: new Date().toISOString(),
    });

    if (fallbackInvoiceState.amountPaid <= 0) {
      fallbackInvoiceState.status = 'refunded';
    } else {
      fallbackInvoiceState.status = 'partial_refund';
    }
    fallbackInvoiceState.updatedAt = new Date().toISOString();

    return {
      success: true,
      data: { ...fallbackInvoiceState },
    };
  },

  /**
   * Get client payment history list
   */
  async getClientHistory(email = 'elena.rossi@momentgrid.com') {
    try {
      const res = await httpClient(`/payments/client/${encodeURIComponent(email)}`, {
        method: 'GET',
      });
      if (res?.data) return res;
    } catch (e) {
      // Fallback
    }

    const subtotal = fallbackInvoiceState.invoiceItems.reduce((acc, it) => acc + (it.total || 0), 0);
    const tax = Math.round((subtotal * fallbackInvoiceState.taxRate) / 100);
    const grand = subtotal + tax;
    const balanceDue = Math.max(0, grand - fallbackInvoiceState.amountPaid);

    return {
      success: true,
      data: {
        clientEmail: email,
        totalInvoiced: grand,
        totalPaid: fallbackInvoiceState.amountPaid,
        totalOutstanding: balanceDue,
        invoicesCount: 1,
        invoices: [
          {
            invoiceNumber: fallbackInvoiceState.invoiceNumber,
            clientEmail: fallbackInvoiceState.clientEmail,
            bookingId: fallbackInvoiceState.bookingId,
            description: fallbackInvoiceState.description,
            status: fallbackInvoiceState.status,
            currency: fallbackInvoiceState.currency,
            taxRate: fallbackInvoiceState.taxRate,
            items: fallbackInvoiceState.invoiceItems,
            financials: {
              totalPackageAmount: fallbackInvoiceState.totalPackageAmount,
              advanceDepositRequired: fallbackInvoiceState.advanceAmount,
              itemsSubtotal: subtotal,
              taxAmount: tax,
              grandTotal: grand,
              amountPaid: fallbackInvoiceState.amountPaid,
              balanceDue,
            },
            razorpayIntegration: {
              orderId: fallbackInvoiceState.razorpayOrderId,
              paymentId: fallbackInvoiceState.razorpayPaymentId,
              isVerified: true,
            },
            dates: {
              dueDate: fallbackInvoiceState.dueDate,
              paidAt: fallbackInvoiceState.paidAt,
              createdAt: fallbackInvoiceState.createdAt,
            },
            transactions: fallbackInvoiceState.transactions,
            refunds: fallbackInvoiceState.refunds,
          },
        ],
      },
    };
  },

  /**
   * Get studio admin financial reports dashboard data
   */
  async getAdminReports(studioId = 'studio-momentgrid-collective') {
    try {
      const res = await httpClient(`/payments/admin/reports?studioId=${encodeURIComponent(studioId)}`, {
        method: 'GET',
      });
      if (res?.data) return res;
    } catch (e) {
      // Fallback
    }

    const subtotal = fallbackInvoiceState.invoiceItems.reduce((acc, it) => acc + (it.total || 0), 0);
    const tax = Math.round((subtotal * fallbackInvoiceState.taxRate) / 100);
    const grand = subtotal + tax;
    const balanceDue = Math.max(0, grand - fallbackInvoiceState.amountPaid);

    return {
      success: true,
      data: {
        financialKpis: { ...fallbackAdminStats },
        recentLedger: [
          {
            invoiceNumber: fallbackInvoiceState.invoiceNumber,
            clientEmail: fallbackInvoiceState.clientEmail,
            bookingId: fallbackInvoiceState.bookingId,
            description: fallbackInvoiceState.description,
            status: fallbackInvoiceState.status,
            currency: fallbackInvoiceState.currency,
            taxRate: fallbackInvoiceState.taxRate,
            items: fallbackInvoiceState.invoiceItems,
            financials: {
              totalPackageAmount: fallbackInvoiceState.totalPackageAmount,
              advanceDepositRequired: fallbackInvoiceState.advanceAmount,
              itemsSubtotal: subtotal,
              taxAmount: tax,
              grandTotal: grand,
              amountPaid: fallbackInvoiceState.amountPaid,
              balanceDue,
            },
            transactions: fallbackInvoiceState.transactions,
            refunds: fallbackInvoiceState.refunds,
          },
          {
            invoiceNumber: 'INV-2026-088',
            clientEmail: 'harper.davis@momentgrid.com',
            bookingId: 'booking-momentgrid-napa-2026',
            description: 'Napa Valley Vineyard Wedding Photography & Album Package',
            status: 'paid',
            currency: 'USD',
            taxRate: 18,
            items: [{ title: 'Full Day Vineyard Coverage + Master Album', quantity: 1, unitPrice: 4200, total: 4200 }],
            financials: {
              totalPackageAmount: 4200,
              advanceDepositRequired: 1260,
              itemsSubtotal: 4200,
              taxAmount: 756,
              grandTotal: 4956,
              amountPaid: 4956,
              balanceDue: 0,
            },
            transactions: [
              { id: 'tx-adv-88', type: 'advance_deposit', amount: 1260, status: 'success', method: 'razorpay_card', createdAt: '2026-05-10T12:00:00Z' },
              { id: 'tx-rem-88', type: 'remaining_balance', amount: 3696, status: 'success', method: 'razorpay_upi', createdAt: '2026-06-20T16:00:00Z' },
            ],
            refunds: [],
          },
          {
            invoiceNumber: 'INV-2026-085',
            clientEmail: 'vikram.singh@momentgrid.com',
            bookingId: 'booking-momentgrid-jaipur-2026',
            description: 'Palace Royal 3-Day Wedding Photography & 3-Camera Cinematography',
            status: 'advance_paid',
            currency: 'INR',
            taxRate: 18,
            items: [{ title: 'Royal Palace 3-Day Coverage + Gold Album Suite', quantity: 1, unitPrice: 250000, total: 250000 }],
            financials: {
              totalPackageAmount: 250000,
              advanceDepositRequired: 75000,
              itemsSubtotal: 250000,
              taxAmount: 45000,
              grandTotal: 295000,
              amountPaid: 75000,
              balanceDue: 220000,
            },
            transactions: [
              { id: 'tx-adv-85', type: 'advance_deposit', amount: 75000, status: 'success', method: 'razorpay_upi', createdAt: '2026-06-01T09:00:00Z' },
            ],
            refunds: [],
          },
        ],
        generatedAt: new Date().toISOString(),
      },
    };
  },
};

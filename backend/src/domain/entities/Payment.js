'use strict';

/**
 * Payment — Pure Domain Entity
 *
 * Represents an itemized invoice, milestone advance/remaining deposit tracking,
 * and Razorpay online payment transactions associated with a MomentGrid booking/package.
 */
class Payment {
  /**
   * @param {object} props
   * @param {string} props.id
   * @param {string} props.clientEmail
   * @param {string|null} props.bookingId
   * @param {string|null} props.studioId
   * @param {string} props.invoiceNumber — e.g. 'INV-2026-089'
   * @param {string} props.description
   * @param {number} props.amount — legacy/default total invoice amount
   * @param {number} props.totalPackageAmount — total package price before tax/advance
   * @param {number} props.advanceAmount — advance booking deposit required (e.g. 30%)
   * @param {number} props.remainingAmount — remaining balance due before gallery delivery
   * @param {number} props.amountPaid — cumulative amount collected so far
   * @param {string} props.currency — 'USD' | 'INR'
   * @param {string} props.status — 'pending' | 'advance_paid' | 'paid' | 'overdue' | 'refunded' | 'partial_refund'
   * @param {string|null} props.method — 'razorpay_upi' | 'razorpay_card' | 'credit_card' | 'bank_transfer' | 'cash' | null
   * @param {string} props.paymentType — 'advance' | 'remaining' | 'full' | 'refund'
   * @param {string|null} props.razorpayOrderId — e.g. 'order_mock_17206000'
   * @param {string|null} props.razorpayPaymentId — e.g. 'pay_mock_892311'
   * @param {string|null} props.razorpaySignature — cryptographic verification signature
   * @param {Array<object>} props.invoiceItems — array of { id, title, quantity, unitPrice, total }
   * @param {number} props.taxRate — e.g. 18 (for 18% GST) or 8
   * @param {Array<object>} props.transactions — audit trail of all payments
   * @param {Array<object>} props.refunds — audit trail of refunds processed
   * @param {Date|null} props.dueDate
   * @param {Date|null} props.paidAt
   * @param {Date} props.createdAt
   * @param {Date} props.updatedAt
   */
  constructor(props = {}) {
    this.id = props.id || null;
    this.clientEmail = (props.clientEmail || '').toLowerCase().trim();
    this.bookingId = props.bookingId || null;
    this.studioId = props.studioId || null;
    this.invoiceNumber = props.invoiceNumber || `INV-${Date.now().toString().slice(-6)}`;
    this.description = props.description || 'Photography Coverage & Master Heirloom Delivery Package';
    
    // Financial milestones & balances
    this.totalPackageAmount = Number(props.totalPackageAmount || props.amount || 0);
    this.advanceAmount = Number(props.advanceAmount || Math.round(this.totalPackageAmount * 0.3));
    this.remainingAmount = Number(props.remainingAmount || Math.max(0, this.totalPackageAmount - this.advanceAmount));
    this.amountPaid = Number(props.amountPaid || 0);
    this.amount = Number(props.amount || this.totalPackageAmount);
    this.currency = props.currency || 'USD';
    
    this.status = props.status || Payment.STATUSES.PENDING;
    this.method = props.method || null;
    this.paymentType = props.paymentType || 'full';
    
    // Razorpay Integration fields
    this.razorpayOrderId = props.razorpayOrderId || null;
    this.razorpayPaymentId = props.razorpayPaymentId || null;
    this.razorpaySignature = props.razorpaySignature || null;
    
    // Itemized invoice & tax calculation
    this.invoiceItems = Array.isArray(props.invoiceItems) ? props.invoiceItems : [
      {
        id: 'item-1',
        title: 'Master Photography & Asset Collection Package',
        quantity: 1,
        unitPrice: this.totalPackageAmount,
        total: this.totalPackageAmount,
      }
    ];
    this.taxRate = Number(props.taxRate || 18); // default 18% GST/Tax
    
    // Audit logs
    this.transactions = Array.isArray(props.transactions) ? props.transactions : [];
    this.refunds = Array.isArray(props.refunds) ? props.refunds : [];
    
    this.dueDate = props.dueDate ? new Date(props.dueDate) : new Date(Date.now() + 14 * 86400000);
    this.paidAt = props.paidAt ? new Date(props.paidAt) : null;
    this.createdAt = props.createdAt ? new Date(props.createdAt) : new Date();
    this.updatedAt = props.updatedAt ? new Date(props.updatedAt) : new Date();
  }

  static STATUSES = Object.freeze({
    PENDING: 'pending',
    ADVANCE_PAID: 'advance_paid',
    PAID: 'paid',
    OVERDUE: 'overdue',
    REFUNDED: 'refunded',
    PARTIAL_REFUND: 'partial_refund',
  });

  /**
   * Calculates the exact remaining balance due after accounting for taxes and collected deposits.
   */
  calculateBalanceDue() {
    const itemsSubtotal = this.invoiceItems.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
    const taxAmount = Math.round((itemsSubtotal * this.taxRate) / 100);
    const grandTotal = itemsSubtotal + taxAmount;
    const balanceDue = Math.max(0, grandTotal - this.amountPaid);
    return {
      itemsSubtotal,
      taxAmount,
      grandTotal,
      amountPaid: this.amountPaid,
      balanceDue,
      isFullyPaid: balanceDue <= 0 && this.amountPaid > 0,
    };
  }

  /**
   * Records an advance booking deposit payment via Razorpay or offline method.
   */
  recordAdvancePayment({ amount, method = 'razorpay_upi', razorpayPaymentId, razorpayOrderId, razorpaySignature, note = '' }) {
    const paymentAmt = Number(amount) || this.advanceAmount;
    this.amountPaid += paymentAmt;
    this.method = method;
    this.razorpayPaymentId = razorpayPaymentId || this.razorpayPaymentId;
    this.razorpayOrderId = razorpayOrderId || this.razorpayOrderId;
    this.razorpaySignature = razorpaySignature || this.razorpaySignature;
    this.paymentType = 'advance';

    this.transactions.push({
      id: `tx-adv-${Date.now()}`,
      type: 'advance_deposit',
      amount: paymentAmt,
      status: 'success',
      method,
      razorpayPaymentId: razorpayPaymentId || `pay_mock_${Date.now()}`,
      razorpayOrderId: razorpayOrderId || `order_mock_${Date.now()}`,
      note: note || 'Advance booking deposit verification complete.',
      createdAt: new Date(),
    });

    const balanceInfo = this.calculateBalanceDue();
    if (balanceInfo.isFullyPaid) {
      this.status = Payment.STATUSES.PAID;
      this.paidAt = new Date();
    } else {
      this.status = Payment.STATUSES.ADVANCE_PAID;
    }
    this.updatedAt = new Date();
    return this;
  }

  /**
   * Records payment of the remaining balance due prior to digital proofing or print delivery.
   */
  recordRemainingPayment({ amount, method = 'razorpay_card', razorpayPaymentId, razorpayOrderId, razorpaySignature, note = '' }) {
    const balanceInfo = this.calculateBalanceDue();
    const paymentAmt = Number(amount) || balanceInfo.balanceDue;
    this.amountPaid += paymentAmt;
    this.method = method;
    this.razorpayPaymentId = razorpayPaymentId || this.razorpayPaymentId;
    this.razorpayOrderId = razorpayOrderId || this.razorpayOrderId;
    this.razorpaySignature = razorpaySignature || this.razorpaySignature;
    this.paymentType = 'remaining';

    this.transactions.push({
      id: `tx-rem-${Date.now()}`,
      type: 'remaining_balance',
      amount: paymentAmt,
      status: 'success',
      method,
      razorpayPaymentId: razorpayPaymentId || `pay_mock_${Date.now()}`,
      razorpayOrderId: razorpayOrderId || `order_mock_${Date.now()}`,
      note: note || 'Remaining balance settlement verified.',
      createdAt: new Date(),
    });

    const newBalance = this.calculateBalanceDue();
    if (newBalance.isFullyPaid) {
      this.status = Payment.STATUSES.PAID;
      this.paidAt = new Date();
    } else {
      this.status = Payment.STATUSES.ADVANCE_PAID;
    }
    this.updatedAt = new Date();
    return this;
  }

  /**
   * Initiates a full or partial refund for cancellations or disputed milestones.
   */
  initiateRefund({ amount, reason = 'Client cancellation request', initiatedBy = 'system' }) {
    const refundAmt = Number(amount) || this.amountPaid;
    if (refundAmt <= 0) {
      throw new Error('Refund amount must be greater than zero.');
    }
    if (refundAmt > this.amountPaid) {
      throw new Error('Cannot refund an amount exceeding the total amount paid (`amountPaid`).');
    }

    this.amountPaid -= refundAmt;
    this.refunds.push({
      id: `ref-${Date.now()}`,
      amount: refundAmt,
      reason,
      initiatedBy,
      status: 'processed',
      createdAt: new Date(),
    });

    this.transactions.push({
      id: `tx-ref-${Date.now()}`,
      type: 'refund',
      amount: -refundAmt,
      status: 'refunded',
      method: 'razorpay_refund_payout',
      note: `Refund processed (${reason}). Initiated by ${initiatedBy}.`,
      createdAt: new Date(),
    });

    if (this.amountPaid <= 0) {
      this.status = Payment.STATUSES.REFUNDED;
    } else {
      this.status = Payment.STATUSES.PARTIAL_REFUND;
    }
    this.updatedAt = new Date();
    return this;
  }

  /**
   * Generates a clean structured invoice manifest ready for PDF export or client presentation.
   */
  generateInvoiceManifest() {
    const balanceInfo = this.calculateBalanceDue();
    return {
      invoiceNumber: this.invoiceNumber,
      clientEmail: this.clientEmail,
      bookingId: this.bookingId,
      description: this.description,
      status: this.status,
      currency: this.currency,
      taxRate: this.taxRate,
      items: this.invoiceItems,
      financials: {
        totalPackageAmount: this.totalPackageAmount,
        advanceDepositRequired: this.advanceAmount,
        itemsSubtotal: balanceInfo.itemsSubtotal,
        taxAmount: balanceInfo.taxAmount,
        grandTotal: balanceInfo.grandTotal,
        amountPaid: balanceInfo.amountPaid,
        balanceDue: balanceInfo.balanceDue,
      },
      razorpayIntegration: {
        orderId: this.razorpayOrderId,
        paymentId: this.razorpayPaymentId,
        isVerified: Boolean(this.razorpayPaymentId && this.razorpaySignature),
      },
      dates: {
        dueDate: this.dueDate ? this.dueDate.toISOString() : null,
        paidAt: this.paidAt ? this.paidAt.toISOString() : null,
        createdAt: this.createdAt.toISOString(),
      },
      transactions: this.transactions,
      refunds: this.refunds,
    };
  }
}

module.exports = Payment;

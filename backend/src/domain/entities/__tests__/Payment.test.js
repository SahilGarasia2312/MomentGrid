'use strict';

const Payment = require('../Payment');
const AppError = require('../../../application/errors/AppError');

describe('Payment domain entity', () => {
  const makePayment = (overrides = {}) =>
    new Payment({
      clientEmail: 'Client@Test.com',
      bookingId: 'booking_1',
      studioId: 'studio_1',
      totalPackageAmount: 10000,
      currency: 'INR',
      ...overrides,
    });

  describe('constructor', () => {
    it('should lowercase and trim clientEmail', () => {
      const p = makePayment();
      expect(p.clientEmail).toBe('client@test.com');
    });

    it('should auto-calculate advanceAmount as 30% of totalPackageAmount', () => {
      const p = makePayment({ totalPackageAmount: 10000 });
      expect(p.advanceAmount).toBe(3000);
      expect(p.remainingAmount).toBe(7000);
    });

    it('should default status to PENDING', () => {
      const p = makePayment();
      expect(p.status).toBe(Payment.STATUSES.PENDING);
    });

    it('should expose all required payment status constants', () => {
      expect(Payment.STATUSES.PENDING).toBe('pending');
      expect(Payment.STATUSES.ADVANCE_PAID).toBe('advance_paid');
      expect(Payment.STATUSES.PAID).toBe('paid');
      expect(Payment.STATUSES.OVERDUE).toBe('overdue');
      expect(Payment.STATUSES.REFUNDED).toBe('refunded');
      expect(Payment.STATUSES.PARTIAL_REFUND).toBe('partial_refund');
    });

    it('should be frozen — statuses cannot be mutated', () => {
      expect(() => { Payment.STATUSES.PENDING = 'hacked'; }).toThrow();
    });
  });

  describe('calculateBalanceDue', () => {
    it('should calculate grandTotal including 18% tax', () => {
      const p = makePayment({ totalPackageAmount: 10000, taxRate: 18 });
      const result = p.calculateBalanceDue();
      expect(result.itemsSubtotal).toBe(10000);
      expect(result.taxAmount).toBe(1800);
      expect(result.grandTotal).toBe(11800);
      expect(result.balanceDue).toBe(11800);
      expect(result.isFullyPaid).toBe(false);
    });

    it('should reflect amountPaid in balanceDue', () => {
      const p = makePayment({ totalPackageAmount: 10000, taxRate: 18, amountPaid: 5000 });
      const result = p.calculateBalanceDue();
      expect(result.balanceDue).toBe(6800); // 11800 - 5000
    });

    it('should mark isFullyPaid when amountPaid covers grandTotal', () => {
      const p = makePayment({ totalPackageAmount: 10000, taxRate: 18, amountPaid: 11800 });
      const result = p.calculateBalanceDue();
      expect(result.isFullyPaid).toBe(true);
      expect(result.balanceDue).toBe(0);
    });
  });

  describe('recordAdvancePayment', () => {
    it('should add to amountPaid and set status ADVANCE_PAID', () => {
      const p = makePayment({ totalPackageAmount: 10000, taxRate: 18 }); // grandTotal = 11800
      p.recordAdvancePayment({ amount: 3000, method: 'razorpay_upi', razorpayPaymentId: 'pay_1', razorpaySignature: 'sig_1' });
      expect(p.amountPaid).toBe(3000);
      expect(p.status).toBe(Payment.STATUSES.ADVANCE_PAID);
      expect(p.transactions).toHaveLength(1);
      expect(p.transactions[0].type).toBe('advance_deposit');
    });

    it('should set status PAID if advance covers full grandTotal', () => {
      const p = makePayment({ totalPackageAmount: 5000, taxRate: 0 }); // grandTotal = 5000
      p.recordAdvancePayment({ amount: 5000, method: 'razorpay_upi', razorpayPaymentId: 'pay_1', razorpaySignature: 'sig_1' });
      expect(p.status).toBe(Payment.STATUSES.PAID);
      expect(p.paidAt).not.toBeNull();
    });
  });

  describe('recordRemainingPayment', () => {
    it('should settle balance and set status to PAID', () => {
      const p = makePayment({ totalPackageAmount: 5000, taxRate: 0, amountPaid: 1500 }); // grandTotal = 5000
      p.recordRemainingPayment({ amount: 3500, method: 'razorpay_card', razorpayPaymentId: 'pay_2', razorpaySignature: 'sig_2' });
      expect(p.amountPaid).toBe(5000);
      expect(p.status).toBe(Payment.STATUSES.PAID);
    });
  });

  describe('initiateRefund', () => {
    it('should throw AppError if refundAmt is zero', () => {
      const p = makePayment({ amountPaid: 1000 });
      expect(() => p.initiateRefund({ amount: 0 })).toThrow(AppError);
    });

    it('should throw AppError if refundAmt exceeds amountPaid', () => {
      const p = makePayment({ amountPaid: 1000 });
      expect(() => p.initiateRefund({ amount: 5000 })).toThrow(AppError);
      expect(() => p.initiateRefund({ amount: 5000 })).toThrow(expect.objectContaining({ code: 'REFUND_EXCEEDS_COLLECTED' }));
    });

    it('should process full refund and set status REFUNDED', () => {
      const p = makePayment({ amountPaid: 3000 });
      p.initiateRefund({ amount: 3000, reason: 'Client cancellation' });
      expect(p.amountPaid).toBe(0);
      expect(p.status).toBe(Payment.STATUSES.REFUNDED);
      expect(p.refunds).toHaveLength(1);
    });

    it('should process partial refund and set status PARTIAL_REFUND', () => {
      const p = makePayment({ amountPaid: 3000 });
      p.initiateRefund({ amount: 1000, reason: 'Partial dispute settlement' });
      expect(p.amountPaid).toBe(2000);
      expect(p.status).toBe(Payment.STATUSES.PARTIAL_REFUND);
    });
  });

  describe('generateInvoiceManifest', () => {
    it('should return a structured manifest with all expected keys', () => {
      const p = makePayment({ totalPackageAmount: 10000 });
      const manifest = p.generateInvoiceManifest();
      expect(manifest).toHaveProperty('invoiceNumber');
      expect(manifest).toHaveProperty('financials');
      expect(manifest).toHaveProperty('razorpayIntegration');
      expect(manifest).toHaveProperty('transactions');
      expect(manifest).toHaveProperty('refunds');
      expect(manifest.financials.grandTotal).toBeGreaterThan(0);
    });

    it('should mark isVerified true when razorpayPaymentId and signature exist', () => {
      const p = makePayment({ razorpayPaymentId: 'pay_x', razorpaySignature: 'sig_x' });
      const manifest = p.generateInvoiceManifest();
      expect(manifest.razorpayIntegration.isVerified).toBe(true);
    });
  });
});

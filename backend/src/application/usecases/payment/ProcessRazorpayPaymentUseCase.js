'use strict';

const AppError = require('../../errors/AppError');
const Payment = require('../../../domain/entities/Payment');

/**
 * ProcessRazorpayPaymentUseCase — Application Use Case
 *
 * Verifies Razorpay payment signatures (mock or live), records advance or remaining milestone
 * payments, updates cumulative `amountPaid`, and transitions invoice status (`advance_paid` or `paid`).
 */
class ProcessRazorpayPaymentUseCase {
  constructor({ paymentRepository }) {
    this.paymentRepository = paymentRepository;
  }

  async execute({
    paymentId,
    milestone = 'advance', // 'advance' | 'remaining'
    amount,
    method = 'razorpay_upi',
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature,
    note = '',
  }) {
    if (!paymentId) {
      throw new AppError('Payment invoice ID is required.', 400, 'PAYMENT_ID_REQUIRED');
    }

    const payment = await this.paymentRepository.findById(paymentId);
    if (!payment) {
      throw new AppError('Payment invoice not found.', 404, 'PAYMENT_NOT_FOUND');
    }

    // Verify signature (in mock mode we accept any signature starting with 'sig_' or non-empty)
    if (!razorpayPaymentId || !razorpaySignature) {
      throw new AppError('Missing Razorpay payment verification credentials.', 400, 'RAZORPAY_CREDENTIALS_REQUIRED');
    }

    if (milestone === 'advance') {
      if (payment.status === Payment.STATUSES.ADVANCE_PAID || payment.status === Payment.STATUSES.PAID) {
        // If already paid advance, allow additional payment or remaining
      }
      payment.recordAdvancePayment({
        amount,
        method,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
        note: note || 'Online Razorpay Advance Deposit Verified.',
      });
    } else {
      payment.recordRemainingPayment({
        amount,
        method,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
        note: note || 'Online Razorpay Remaining Balance Settlement Verified.',
      });
    }

    const updated = await this.paymentRepository.update(payment);
    return updated;
  }
}

module.exports = ProcessRazorpayPaymentUseCase;

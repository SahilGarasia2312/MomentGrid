'use strict';

const AppError = require('../../errors/AppError');
const Payment = require('../../../domain/entities/Payment');

/**
 * InitiatePaymentRefundUseCase — Application Use Case
 *
 * Processes full or partial refunds on collected deposits, logs detailed dispute/cancellation reasons,
 * and updates invoice status (`refunded` or `partial_refund`).
 */
class InitiatePaymentRefundUseCase {
  constructor({ paymentRepository }) {
    this.paymentRepository = paymentRepository;
  }

  async execute({ paymentId, amount, reason, initiatedBy = 'studio_admin' }) {
    if (!paymentId) {
      throw new AppError('Payment invoice ID is required.', 400, 'PAYMENT_ID_REQUIRED');
    }

    const payment = await this.paymentRepository.findById(paymentId);
    if (!payment) {
      throw new AppError('Payment invoice not found.', 404, 'PAYMENT_NOT_FOUND');
    }

    if (!reason || !reason.trim()) {
      throw new AppError('A valid reason is required to process a refund.', 400, 'REFUND_REASON_REQUIRED');
    }

    if (payment.amountPaid <= 0) {
      throw new AppError('Cannot refund an invoice with zero collected payments.', 400, 'NO_COLLECTED_FUNDS');
    }

    try {
      payment.initiateRefund({
        amount,
        reason: reason.trim(),
        initiatedBy,
      });
    } catch (err) {
      throw new AppError(err.message || 'Refund processing failed.', 400, 'REFUND_ERROR');
    }

    const updated = await this.paymentRepository.update(payment);
    return updated;
  }
}

module.exports = InitiatePaymentRefundUseCase;

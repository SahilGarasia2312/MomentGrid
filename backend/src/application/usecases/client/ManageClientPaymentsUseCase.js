'use strict';

const AppError = require('../../errors/AppError');

class ManageClientPaymentsUseCase {
  constructor(clientRepository) {
    this.clientRepository = clientRepository;
  }

  async listPayments({ clientEmail }) {
    if (!clientEmail) {
      throw new AppError('Client email is required to list invoices.', 400, 'CLIENT_EMAIL_REQUIRED');
    }
    return this.clientRepository.findPaymentsByClientEmail(clientEmail);
  }

  async payInvoice({ clientEmail, paymentId, method }) {
    if (!paymentId) {
      throw new AppError('Payment ID is required.', 400, 'PAYMENT_ID_REQUIRED');
    }

    const payment = await this.clientRepository.findPaymentById(paymentId);
    if (!payment) {
      throw new AppError('Invoice not found.', 404, 'INVOICE_NOT_FOUND');
    }

    if (payment.clientEmail !== clientEmail.toLowerCase().trim()) {
      throw new AppError('Unauthorized access to invoice.', 403, 'FORBIDDEN');
    }

    if (payment.status === 'paid') {
      throw new AppError('This invoice is already marked as paid.', 400, 'ALREADY_PAID');
    }

    payment.status = 'paid';
    payment.method = method || 'credit_card';
    payment.paidAt = new Date();

    return this.clientRepository.updatePayment(payment);
  }
}

module.exports = ManageClientPaymentsUseCase;

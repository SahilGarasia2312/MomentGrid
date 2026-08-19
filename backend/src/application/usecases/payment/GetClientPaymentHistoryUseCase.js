'use strict';

const AppError = require('../../errors/AppError');

/**
 * GetClientPaymentHistoryUseCase — Application Use Case
 *
 * Retrieves the complete payment history for a client (by email or booking ID) or lists all studio invoices.
 * Calculates cumulative balance due across all active invoices.
 */
class GetClientPaymentHistoryUseCase {
  constructor({ paymentRepository }) {
    this.paymentRepository = paymentRepository;
  }

  async execute({ clientEmail = null, bookingId = null, studioId = null, status = 'all', page = 1, limit = 50 }) {
    let invoices = [];
    if (clientEmail) {
      invoices = await this.paymentRepository.findByClientEmail(clientEmail);
    } else if (bookingId) {
      invoices = await this.paymentRepository.findByBookingId(bookingId);
    } else {
      const result = await this.paymentRepository.findAll({ studioId, status, page, limit });
      return result;
    }

    // Calculate aggregated stats for the client
    let totalInvoiced = 0;
    let totalPaid = 0;
    let totalOutstanding = 0;

    const manifestList = invoices.map((inv) => {
      const bal = inv.calculateBalanceDue();
      totalInvoiced += bal.grandTotal;
      totalPaid += bal.amountPaid;
      totalOutstanding += bal.balanceDue;
      return inv.generateInvoiceManifest();
    });

    return {
      clientEmail: clientEmail || 'Studio Overall',
      totalInvoiced,
      totalPaid,
      totalOutstanding,
      invoicesCount: manifestList.length,
      invoices: manifestList,
    };
  }
}

module.exports = GetClientPaymentHistoryUseCase;

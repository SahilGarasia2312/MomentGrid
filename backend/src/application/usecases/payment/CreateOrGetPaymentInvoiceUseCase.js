'use strict';

const AppError = require('../../errors/AppError');
const Payment = require('../../../domain/entities/Payment');

/**
 * CreateOrGetPaymentInvoiceUseCase — Application Use Case
 *
 * Retrieves an active invoice for a client/booking or creates a structured itemized invoice
 * breaking down the Total Package Amount into Advance Booking Deposit vs. Remaining Balance Due.
 */
class CreateOrGetPaymentInvoiceUseCase {
  constructor({ paymentRepository }) {
    this.paymentRepository = paymentRepository;
  }

  async execute({
    clientEmail,
    bookingId = null,
    studioId = null,
    invoiceNumber = null,
    description = 'Photography Coverage & Master Heirloom Delivery Package',
    totalPackageAmount = 2500,
    advancePercentage = 30,
    currency = 'USD',
    invoiceItems = null,
    taxRate = 18,
  }) {
    if (!clientEmail || !clientEmail.trim()) {
      throw new AppError('Client email address is required to create or get an invoice.', 400, 'CLIENT_EMAIL_REQUIRED');
    }

    // Lookup existing by invoiceNumber or bookingId if provided
    if (invoiceNumber) {
      const existing = await this.paymentRepository.findByInvoiceNumber(invoiceNumber);
      if (existing) return existing;
    }

    if (bookingId) {
      const existingList = await this.paymentRepository.findByBookingId(bookingId);
      if (existingList.length > 0) return existingList[0];
    }

    // Calculate advance deposit and remaining
    const totalAmt = Number(totalPackageAmount) || 2500;
    const advAmt = Math.round((totalAmt * Number(advancePercentage || 30)) / 100);
    const remAmt = Math.max(0, totalAmt - advAmt);

    const defaultItems = Array.isArray(invoiceItems) && invoiceItems.length > 0
      ? invoiceItems
      : [
          {
            id: 'item-1',
            title: description,
            quantity: 1,
            unitPrice: totalAmt,
            total: totalAmt,
          },
        ];

    const newPayment = new Payment({
      clientEmail: clientEmail.trim().toLowerCase(),
      bookingId,
      studioId,
      description,
      totalPackageAmount: totalAmt,
      advanceAmount: advAmt,
      remainingAmount: remAmt,
      amountPaid: 0,
      amount: totalAmt,
      currency: currency || 'USD',
      status: Payment.STATUSES.PENDING,
      paymentType: 'full',
      invoiceItems: defaultItems,
      taxRate: Number(taxRate || 18),
    });

    const saved = await this.paymentRepository.save(newPayment);
    return saved;
  }
}

module.exports = CreateOrGetPaymentInvoiceUseCase;

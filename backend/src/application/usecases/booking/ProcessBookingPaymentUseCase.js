'use strict';

/**
 * ProcessBookingPaymentUseCase
 *
 * Processes online payment or studio retainer settlement for a booking invoice.
 * Transitions invoice status to 'paid' and confirms the photography session itinerary.
 */
class ProcessBookingPaymentUseCase {
  /**
   * @param {import('../../domain/repositories/IBookingRepository')} bookingRepository
   */
  constructor(bookingRepository) {
    this.bookingRepository = bookingRepository;
  }

  /**
   * @param {object} params
   * @param {string} params.bookingId
   * @param {string|null} params.paymentId
   * @param {string} params.method — 'credit_card' | 'bank_transfer' | 'cash'
   */
  async execute({ bookingId, paymentId = null, method = 'credit_card' }) {
    if (!bookingId) {
      throw new Error('Booking ID is required to process payment.');
    }

    // Verify existing booking exists
    const { event, payment } = await this.bookingRepository.findBookingByIdWithDetails(bookingId);
    if (!event) {
      throw new Error('Booking session not found.');
    }
    if (event.status === 'cancelled') {
      throw new Error('Cannot process payment for a cancelled booking session.');
    }
    if (payment && payment.status === 'paid') {
      throw new Error('This invoice has already been fully paid.');
    }

    // feature: mark invoice paid and session confirmed
    return await this.bookingRepository.markBookingPaidAndConfirmed(bookingId, paymentId, method);
  }
}

module.exports = ProcessBookingPaymentUseCase;

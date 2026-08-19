'use strict';

/**
 * CancelEventBookingUseCase
 *
 * Cancels a scheduled photography booking session and evaluates the 48-Hour Refund Eligibility Policy.
 * If the session is more than 48 hours away, paid invoices are eligible for full refund/credit.
 * If within 48 hours, retainer fees are forfeited according to studio policy.
 */
class CancelEventBookingUseCase {
  /**
   * @param {import('../../domain/repositories/IBookingRepository')} bookingRepository
   */
  constructor(bookingRepository) {
    this.bookingRepository = bookingRepository;
  }

  /**
   * @param {object} params
   * @param {string} params.bookingId
   * @param {string} params.cancellationReason
   */
  async execute({ bookingId, cancellationReason = '' }) {
    if (!bookingId) {
      throw new Error('Booking ID is required to process cancellation.');
    }

    const { event, payment } = await this.bookingRepository.findBookingByIdWithDetails(bookingId);
    if (!event) {
      throw new Error('Booking session not found.');
    }
    if (event.status === 'cancelled') {
      throw new Error('Booking is already cancelled.');
    }

    // feature: evaluate 48-hour cancellation deadline threshold
    const eventTimeMs = new Date(`${event.eventDate}T${event.startTime || '10:00'}:00`).getTime();
    const nowMs = Date.now();
    const hoursRemaining = (eventTimeMs - nowMs) / (1000 * 60 * 60);

    let newPaymentStatus = 'cancelled';
    if (payment) {
      if (payment.status === 'paid') {
        if (hoursRemaining >= 48) {
          newPaymentStatus = 'refunded'; // Eligible for 100% refund (> 48h notice)
        } else {
          newPaymentStatus = 'retainer_forfeited'; // < 48h notice, retainer non-refundable
        }
      } else {
        newPaymentStatus = 'cancelled'; // Was pending, now cancelled
      }
    }

    return await this.bookingRepository.cancelBookingWithPolicy(
      bookingId,
      cancellationReason || `Client cancellation (${Math.round(hoursRemaining)}h prior to session)`,
      newPaymentStatus
    );
  }
}

module.exports = CancelEventBookingUseCase;

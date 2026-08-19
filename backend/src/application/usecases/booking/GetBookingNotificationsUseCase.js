'use strict';

/**
 * GetBookingNotificationsUseCase
 *
 * Retrieves the complete lifecycle alert and event audit trail for a booking session.
 */
class GetBookingNotificationsUseCase {
  /**
   * @param {import('../../domain/repositories/IBookingRepository')} bookingRepository
   */
  constructor(bookingRepository) {
    this.bookingRepository = bookingRepository;
  }

  /**
   * @param {string} bookingId
   */
  async execute(bookingId) {
    if (!bookingId) {
      throw new Error('Booking ID is required to list notifications.');
    }
    // feature: query real-time booking alert logs
    return await this.bookingRepository.findBookingNotifications(bookingId);
  }
}

module.exports = GetBookingNotificationsUseCase;

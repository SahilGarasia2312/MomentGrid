'use strict';

/**
 * GetBookingDetailsUseCase
 *
 * Retrieves comprehensive details for a specific booking session including linked invoice,
 * studio contact credentials, and photography package specifications.
 */
class GetBookingDetailsUseCase {
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
      throw new Error('Booking ID is required.');
    }
    const result = await this.bookingRepository.findBookingByIdWithDetails(bookingId);
    if (!result || !result.event) {
      throw new Error('Booking session not found.');
    }
    return result;
  }
}

module.exports = GetBookingDetailsUseCase;

'use strict';

/**
 * GetCalendarAvailabilityUseCase
 *
 * Computes open and booked calendar time slots for a studio on a specified date.
 * Automatically checks package duration if packageId is supplied.
 */
class GetCalendarAvailabilityUseCase {
  /**
   * @param {import('../../domain/repositories/IBookingRepository')} bookingRepository
   */
  constructor(bookingRepository) {
    this.bookingRepository = bookingRepository;
  }

  /**
   * @param {object} params
   * @param {string} params.studioId
   * @param {string} params.date — YYYY-MM-DD
   * @param {string|null} params.packageId
   */
  async execute({ studioId, date, packageId = null }) {
    if (!studioId || !date) {
      throw new Error('Studio ID and Date (YYYY-MM-DD) are required to check availability.');
    }

    let durationMinutes = 120; // Default 2 hours
    if (packageId) {
      const pkg = await this.bookingRepository.findPackageById(packageId);
      if (pkg && pkg.durationMinutes > 0) {
        durationMinutes = pkg.durationMinutes;
      }
    }

    // feature: compute available calendar slots taking clash & blocked dates into account
    return await this.bookingRepository.findAvailableSlots(studioId, date, durationMinutes);
  }
}

module.exports = GetCalendarAvailabilityUseCase;

'use strict';

/**
 * ListBookingPackagesUseCase
 *
 * Retrieves all active packages for a given studio to populate step 1 of the booking wizard.
 */
class ListBookingPackagesUseCase {
  /**
   * @param {import('../../domain/repositories/IBookingRepository')} bookingRepository
   */
  constructor(bookingRepository) {
    this.bookingRepository = bookingRepository;
  }

  /**
   * @param {string} studioId
   */
  async execute(studioId) {
    if (!studioId) {
      throw new Error('Studio ID is required to list booking packages.');
    }
    // feature: query active photography tiers
    return await this.bookingRepository.findActivePackagesByStudio(studioId);
  }
}

module.exports = ListBookingPackagesUseCase;

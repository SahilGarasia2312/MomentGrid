'use strict';

const AppError = require('../../errors/AppError');

class ManageBlockedDatesUseCase {
  /**
   * @param {import('../../../domain/repositories/IPhotographerRepository')} photographerRepository
   */
  constructor(photographerRepository) {
    this.photographerRepository = photographerRepository;
  }

  async execute({ photographerId, dates, action = 'block' }) {
    if (!photographerId) {
      throw new AppError('Photographer ID is required.', 400, 'MISSING_PHOTOGRAPHER_ID');
    }
    if (!Array.isArray(dates) || dates.length === 0) {
      throw new AppError('Dates array must be non-empty.', 400, 'INVALID_DATES');
    }

    const existing = await this.photographerRepository.findById(photographerId);
    if (!existing) {
      throw new AppError('Photographer profile not found.', 404, 'PHOTOGRAPHER_NOT_FOUND');
    }

    let updatedBlocked = [...existing.blockedDates];

    if (action === 'block') {
      dates.forEach((d) => {
        if (!updatedBlocked.includes(d)) {
          updatedBlocked.push(d);
        }
      });
    } else if (action === 'unblock') {
      updatedBlocked = updatedBlocked.filter((d) => !dates.includes(d));
    } else {
      throw new AppError('Action must be either "block" or "unblock".', 400, 'INVALID_ACTION');
    }

    return await this.photographerRepository.blockDates(photographerId, updatedBlocked);
  }
}

module.exports = ManageBlockedDatesUseCase;

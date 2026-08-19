'use strict';

const AppError = require('../../errors/AppError');

class UpdatePhotographerProfileUseCase {
  /**
   * @param {import('../../../domain/repositories/IPhotographerRepository')} photographerRepository
   */
  constructor(photographerRepository) {
    this.photographerRepository = photographerRepository;
  }

  async execute({ photographerId, bio, avatarUrl, portfolioUrl, specializations, yearsExperience, availability, portfolioItems }) {
    if (!photographerId) {
      throw new AppError('Photographer ID is required for updates.', 400, 'MISSING_PHOTOGRAPHER_ID');
    }

    const existing = await this.photographerRepository.findById(photographerId);
    if (!existing) {
      throw new AppError('Photographer profile not found.', 404, 'PHOTOGRAPHER_NOT_FOUND');
    }

    const updateProps = {};
    if (bio !== undefined) updateProps.bio = bio;
    if (avatarUrl !== undefined) updateProps.avatarUrl = avatarUrl;
    if (portfolioUrl !== undefined) updateProps.portfolioUrl = portfolioUrl;
    if (Array.isArray(specializations)) updateProps.specializations = specializations;
    if (typeof yearsExperience === 'number') updateProps.yearsExperience = yearsExperience;
    if (availability !== undefined && typeof availability === 'object') {
      updateProps.availability = { ...existing.availability, ...availability };
    }
    if (Array.isArray(portfolioItems)) updateProps.portfolioItems = portfolioItems;

    return await this.photographerRepository.update(photographerId, updateProps);
  }
}

module.exports = UpdatePhotographerProfileUseCase;

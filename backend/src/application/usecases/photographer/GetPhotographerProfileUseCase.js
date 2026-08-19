'use strict';

const AppError = require('../../errors/AppError');
const Photographer = require('../../../domain/entities/Photographer');

class GetPhotographerProfileUseCase {
  /**
   * @param {import('../../../domain/repositories/IPhotographerRepository')} photographerRepository
   * @param {import('../../../domain/repositories/IUserRepository')} userRepository
   */
  constructor(photographerRepository, userRepository) {
    this.photographerRepository = photographerRepository;
    this.userRepository = userRepository;
  }

  async execute({ photographerId = null, userId = null }) {
    if (photographerId) {
      const profile = await this.photographerRepository.findById(photographerId);
      if (!profile) {
        throw new AppError('Photographer profile not found.', 404, 'PHOTOGRAPHER_NOT_FOUND');
      }
      return profile;
    }

    if (!userId) {
      throw new AppError('Must provide either photographerId or userId.', 400, 'MISSING_IDENTIFIER');
    }

    let profile = await this.photographerRepository.findByUserId(userId);
    if (!profile) {
      // Auto-create initial profile if User exists and is photographer/owner
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new AppError('Associated user account not found.', 404, 'USER_NOT_FOUND');
      }

      const newEntity = new Photographer({
        userId: user.id,
        studioId: user.studioId || null,
        fullName: user.fullName || 'Photographer Artist',
        email: user.email,
        bio: 'Passionate visual storyteller and editorial photographer.',
        specializations: ['wedding', 'portrait', 'editorial'],
        yearsExperience: 5,
      });

      profile = await this.photographerRepository.create(newEntity);
    }

    return profile;
  }
}

module.exports = GetPhotographerProfileUseCase;

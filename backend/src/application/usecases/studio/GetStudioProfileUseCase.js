'use strict';

const AppError = require('../../errors/AppError');
const Studio = require('../../../domain/entities/Studio');

class GetStudioProfileUseCase {
  constructor(studioRepository, userRepository) {
    this.studioRepository = studioRepository;
    this.userRepository = userRepository;
  }

  async execute({ studioId, ownerId }) {
    let studio = null;
    if (studioId) {
      studio = await this.studioRepository.findById(studioId);
    } else if (ownerId) {
      studio = await this.studioRepository.findByOwnerId(ownerId);
      if (!studio) {
        // Auto-initialize studio profile for studio_owner if not exists yet
        const user = await this.userRepository.findById(ownerId);
        if (user && user.role === 'studio_owner') {
          const newStudio = new Studio({
            name: `${user.fullName}'s Studio`,
            slug: `${user.fullName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`,
            ownerId: user.id,
            contactEmail: user.email,
            phone: user.phone,
          });
          studio = await this.studioRepository.save(newStudio);
          user.studioId = studio.id;
          await this.userRepository.update(user);
        }
      }
    }

    if (!studio) {
      throw new AppError('Studio profile not found.', 404, 'STUDIO_NOT_FOUND');
    }

    return studio.toPublic();
  }
}

module.exports = GetStudioProfileUseCase;

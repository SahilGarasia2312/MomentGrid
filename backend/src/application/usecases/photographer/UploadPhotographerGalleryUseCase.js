'use strict';

const AppError = require('../../errors/AppError');
const Gallery = require('../../../domain/entities/Gallery');

class UploadPhotographerGalleryUseCase {
  /**
   * @param {import('../../../domain/repositories/IGalleryRepository')} galleryRepository
   * @param {import('../../../domain/repositories/IPhotographerRepository')} photographerRepository
   */
  constructor(galleryRepository, photographerRepository) {
    this.galleryRepository = galleryRepository;
    this.photographerRepository = photographerRepository;
  }

  async execute({ photographerId, title, pinCode, eventId, packageId, clientEmail, coverUrl, photos, status = 'draft' }) {
    if (!photographerId) {
      throw new AppError('Photographer ID is required.', 400, 'MISSING_PHOTOGRAPHER_ID');
    }
    if (!title || !pinCode) {
      throw new AppError('Gallery title and 4-digit PIN code are required.', 400, 'MISSING_REQUIRED_FIELDS');
    }

    const photographer = await this.photographerRepository.findById(photographerId);
    if (!photographer) {
      throw new AppError('Photographer profile not found.', 404, 'PHOTOGRAPHER_NOT_FOUND');
    }

    const galleryEntity = new Gallery({
      studioId: photographer.studioId || null,
      title,
      pinCode,
      eventId: eventId || null,
      packageId: packageId || null,
      clientEmail: clientEmail || photographer.email,
      coverUrl: coverUrl || (Array.isArray(photos) && photos.length > 0 ? photos[0].url : null),
      photos: Array.isArray(photos) ? photos : [],
      status,
    });

    const savedGallery = await this.galleryRepository.save(galleryEntity);

    // Update photographer delivered photos stat
    if (Array.isArray(photos) && photos.length > 0) {
      const currentDelivered = photographer.stats?.totalPhotosDelivered || 0;
      await this.photographerRepository.update(photographer.id, {
        stats: {
          ...photographer.stats,
          totalPhotosDelivered: currentDelivered + photos.length,
        },
      });
    }

    return savedGallery;
  }
}

module.exports = UploadPhotographerGalleryUseCase;

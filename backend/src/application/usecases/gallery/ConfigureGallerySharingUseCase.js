'use strict';

const AppError = require('../../errors/AppError');

/**
 * ConfigureGallerySharingUseCase — Application Use Case
 *
 * Configures public sharing rules for a client gallery:
 * - Public visibility vs private
 * - PIN code assignment & verification gate toggle
 * - Download permissions
 * - Expiration timestamp
 */
class ConfigureGallerySharingUseCase {
  constructor({ galleryRepository }) {
    this.galleryRepository = galleryRepository;
  }

  async execute({ galleryId, studioId, sharingConfig }) {
    const gallery = await this.galleryRepository.findById(galleryId);
    if (!gallery || (studioId && gallery.studioId !== studioId)) {
      throw new AppError('Gallery not found or access denied.', 404, 'GALLERY_NOT_FOUND');
    }

    if (!sharingConfig || typeof sharingConfig !== 'object') {
      throw new AppError('sharingConfig payload is required.', 400, 'INVALID_SHARING_CONFIG');
    }

    gallery.sharingConfig = {
      isPublic: sharingConfig.isPublic !== undefined ? Boolean(sharingConfig.isPublic) : true,
      requirePin: sharingConfig.requirePin !== undefined ? Boolean(sharingConfig.requirePin) : true,
      pinCode: sharingConfig.pinCode || gallery.pinCode || '2026',
      allowDownloads: sharingConfig.allowDownloads !== undefined ? Boolean(sharingConfig.allowDownloads) : true,
      expiresAt: sharingConfig.expiresAt ? new Date(sharingConfig.expiresAt) : null,
    };

    if (sharingConfig.pinCode) {
      gallery.pinCode = sharingConfig.pinCode;
    }

    await this.galleryRepository.update(gallery);

    return {
      success: true,
      galleryId: gallery.id,
      sharingConfig: gallery.sharingConfig,
      shareableUrl: `/share/${gallery.id}?pin=${gallery.sharingConfig.pinCode}`,
    };
  }
}

module.exports = ConfigureGallerySharingUseCase;

'use strict';

const AppError = require('../../errors/AppError');

class ManageClientGalleriesUseCase {
  constructor(clientRepository) {
    this.clientRepository = clientRepository;
  }

  async listGalleries({ clientEmail }) {
    if (!clientEmail) {
      throw new AppError('Client email is required to list galleries.', 400, 'CLIENT_EMAIL_REQUIRED');
    }
    return this.clientRepository.findGalleriesByClientEmail(clientEmail);
  }

  async toggleFavorite({ clientEmail, galleryId, photoId }) {
    if (!galleryId || !photoId) {
      throw new AppError('Gallery ID and Photo ID are required.', 400, 'VALIDATION_ERROR');
    }

    const gallery = await this.clientRepository.findGalleryById(galleryId);
    if (!gallery) {
      throw new AppError('Gallery not found.', 404, 'GALLERY_NOT_FOUND');
    }

    if (gallery.clientEmail !== clientEmail.toLowerCase().trim()) {
      throw new AppError('Unauthorized access to gallery.', 403, 'FORBIDDEN');
    }

    const photoIndex = gallery.photos.findIndex((p) => (p.id || p._id) === photoId);
    if (photoIndex === -1) {
      throw new AppError('Photo not found in gallery.', 404, 'PHOTO_NOT_FOUND');
    }

    gallery.photos[photoIndex].isFavorite = !gallery.photos[photoIndex].isFavorite;
    return this.clientRepository.updateGallery(gallery);
  }

  async logDownload({ clientEmail, galleryId, format, assetId }) {
    const gallery = await this.clientRepository.findGalleryById(galleryId);
    if (!gallery || gallery.clientEmail !== clientEmail.toLowerCase().trim()) {
      throw new AppError('Unauthorized access to download asset.', 403, 'FORBIDDEN');
    }

    return {
      success: true,
      downloadUrl: assetId === 'all'
        ? `https://assets.momentgrid.io/zip/${galleryId}_full_${format || 'print'}.zip`
        : `https://assets.momentgrid.io/raw/${galleryId}/${assetId}.${format === 'web' ? 'jpg' : 'cr2'}`,
      expiresIn: '24 hours',
      loggedAt: new Date(),
    };
  }
}

module.exports = ManageClientGalleriesUseCase;

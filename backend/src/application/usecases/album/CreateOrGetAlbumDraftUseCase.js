'use strict';

const AppError = require('../../errors/AppError');
const Album = require('../../../domain/entities/Album');

/**
 * CreateOrGetAlbumDraftUseCase — Application Use Case
 *
 * Retrieves an active client album selection session (`selecting`) for a given gallery and client email,
 * or creates a fresh draft if one does not exist yet.
 */
class CreateOrGetAlbumDraftUseCase {
  constructor({ albumRepository, galleryRepository }) {
    this.albumRepository = albumRepository;
    this.galleryRepository = galleryRepository;
  }

  async execute({ galleryId, clientEmail, clientName, title, initialPhotoIds }) {
    if (!clientEmail || !clientEmail.trim()) {
      throw new AppError('Client email address is required to start an album draft.', 400, 'CLIENT_EMAIL_REQUIRED');
    }

    let existing = null;
    if (galleryId) {
      existing = await this.albumRepository.findByClientOrGallery({
        galleryId,
        clientEmail: clientEmail.trim().toLowerCase(),
      });
    }

    if (existing) {
      return existing;
    }

    // Verify gallery if ID provided
    let studioId = null;
    let galleryTitle = title || 'Wedding & Heirloom Print Album';
    let defaultPhotos = Array.isArray(initialPhotoIds) ? initialPhotoIds : [];

    if (galleryId && this.galleryRepository) {
      const gallery = await this.galleryRepository.findById(galleryId);
      if (gallery) {
        studioId = gallery.studioId;
        galleryTitle = title || gallery.title || 'Client Heirloom Album';
        if (defaultPhotos.length === 0 && Array.isArray(gallery.photos)) {
          // Pre-populate with favorited photos from gallery if available
          defaultPhotos = gallery.photos.filter((p) => p.isFavorite).map((p) => p.id);
        }
      }
    }

    const newDraft = new Album({
      clientEmail: clientEmail.trim().toLowerCase(),
      clientName: clientName || 'Valued Client',
      galleryId: galleryId || null,
      studioId,
      title: galleryTitle,
      selectedPhotoIds: defaultPhotos,
      favoritedPhotoIds: defaultPhotos,
      orderedPhotoIds: defaultPhotos,
      status: Album.STATUSES.SELECTING,
    });

    const saved = await this.albumRepository.create(newDraft);
    return saved;
  }
}

module.exports = CreateOrGetAlbumDraftUseCase;

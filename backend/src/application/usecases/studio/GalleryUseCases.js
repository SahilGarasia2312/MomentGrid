'use strict';

const AppError = require('../../errors/AppError');
const Gallery = require('../../../domain/entities/Gallery');

class ListGalleriesUseCase {
  constructor(galleryRepository) {
    this.galleryRepository = galleryRepository;
  }

  async execute({ studioId, clientEmail }) {
    if (clientEmail && !studioId) {
      return await this.galleryRepository.findByClientEmail(clientEmail);
    }
    return await this.galleryRepository.findByStudioId(studioId);
  }
}

class CreateGalleryUseCase {
  constructor(galleryRepository) {
    this.galleryRepository = galleryRepository;
  }

  async execute({ studioId, title, eventId, packageId, clientEmail, pinCode, coverUrl, photos, status }) {
    const gallery = new Gallery({
      studioId,
      title,
      eventId,
      packageId,
      clientEmail,
      pinCode: pinCode || Math.floor(1000 + Math.random() * 9000).toString(),
      coverUrl: coverUrl || (photos && photos[0] ? photos[0].url : 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'),
      photos: Array.isArray(photos) ? photos : [],
      status: status || Gallery.STATUSES.PUBLISHED,
    });

    return await this.galleryRepository.save(gallery);
  }
}

class TogglePhotoFavoriteUseCase {
  constructor(galleryRepository) {
    this.galleryRepository = galleryRepository;
  }

  async execute({ galleryId, photoId }) {
    const gallery = await this.galleryRepository.findById(galleryId);
    if (!gallery) {
      throw new AppError('Gallery not found.', 404, 'GALLERY_NOT_FOUND');
    }

    const photo = gallery.photos.find((p) => p.id === photoId);
    if (!photo) {
      throw new AppError('Photo not found inside this gallery.', 404, 'PHOTO_NOT_FOUND');
    }

    photo.isFavorite = !photo.isFavorite;
    return await this.galleryRepository.update(gallery);
  }
}

class DeleteGalleryUseCase {
  constructor(galleryRepository) {
    this.galleryRepository = galleryRepository;
  }

  async execute({ galleryId, studioId }) {
    const gallery = await this.galleryRepository.findById(galleryId);
    if (!gallery || gallery.studioId !== studioId) {
      throw new AppError('Gallery not found in this studio.', 404, 'GALLERY_NOT_FOUND');
    }

    await this.galleryRepository.delete(galleryId);
    return { success: true, message: 'Gallery deleted successfully.' };
  }
}

module.exports = {
  ListGalleriesUseCase,
  CreateGalleryUseCase,
  TogglePhotoFavoriteUseCase,
  DeleteGalleryUseCase,
};

'use strict';

const AppError = require('../../errors/AppError');

/**
 * UploadGalleryImagesUseCase — Application Use Case
 *
 * Adds new images to a specified gallery folder, registers tags/categories,
 * stores exact dimensions (width/height) & file sizes, and generates optimized URLs.
 */
class UploadGalleryImagesUseCase {
  constructor({ galleryRepository, storageService }) {
    this.galleryRepository = galleryRepository;
    this.storageService = storageService;
  }

  async execute({ galleryId, studioId, photos, targetFolderId = 'root', category = 'general' }) {
    const gallery = await this.galleryRepository.findById(galleryId);
    if (!gallery || (studioId && gallery.studioId !== studioId)) {
      throw new AppError('Gallery not found or access denied.', 404, 'GALLERY_NOT_FOUND');
    }

    if (!Array.isArray(photos) || photos.length === 0) {
      throw new AppError('No photo payloads provided for upload.', 400, 'NO_PHOTOS_PROVIDED');
    }

    // Ensure folder exists or attach to root
    const folderExists = gallery.folders.some((f) => f.id === targetFolderId);
    const resolvedFolderId = folderExists ? targetFolderId : 'root';

    // Ensure category exists in gallery categories
    const normalizedCat = category.toLowerCase().trim();
    if (normalizedCat && !gallery.categories.includes(normalizedCat)) {
      gallery.categories.push(normalizedCat);
    }

    const addedPhotos = [];
    for (const p of photos) {
      const photoId = p.id || `photo-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      const optimizedUrl = this.storageService
        ? this.storageService.getOptimizedUrl(p.url, { width: 2400, quality: 'auto' })
        : p.url;

      const newPhoto = {
        id: photoId,
        url: optimizedUrl || p.url,
        caption: p.caption || '',
        category: normalizedCat || 'general',
        folderId: resolvedFolderId,
        width: Number(p.width) || 3840,
        height: Number(p.height) || 2160,
        format: p.format || 'jpg',
        bytes: Number(p.bytes) || 2048000,
        isFavorite: false,
        createdAt: new Date(),
      };

      gallery.photos.push(newPhoto);
      addedPhotos.push(newPhoto);
    }

    // Update folder photo count
    const folder = gallery.folders.find((f) => f.id === resolvedFolderId);
    if (folder) {
      folder.photoCount = gallery.photos.filter((p) => p.folderId === resolvedFolderId).length;
    }
    const rootFolder = gallery.folders.find((f) => f.id === 'root');
    if (rootFolder) {
      rootFolder.photoCount = gallery.photos.length;
    }

    // Automatically set coverUrl if gallery has no cover
    if (!gallery.coverUrl && addedPhotos[0]) {
      gallery.coverUrl = addedPhotos[0].url;
    }

    await this.galleryRepository.update(gallery);
    return {
      success: true,
      addedCount: addedPhotos.length,
      totalPhotos: gallery.photos.length,
      photos: addedPhotos,
      galleryId: gallery.id,
    };
  }
}

module.exports = UploadGalleryImagesUseCase;

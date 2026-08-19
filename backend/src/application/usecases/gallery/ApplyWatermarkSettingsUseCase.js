'use strict';

const AppError = require('../../errors/AppError');

/**
 * ApplyWatermarkSettingsUseCase — Application Use Case
 *
 * Updates gallery watermark configuration (enabled, text, opacity, position)
 * and returns dynamic watermarked preview URLs.
 */
class ApplyWatermarkSettingsUseCase {
  constructor({ galleryRepository, storageService }) {
    this.galleryRepository = galleryRepository;
    this.storageService = storageService;
  }

  async execute({ galleryId, studioId, watermarkConfig }) {
    const gallery = await this.galleryRepository.findById(galleryId);
    if (!gallery || (studioId && gallery.studioId !== studioId)) {
      throw new AppError('Gallery not found or access denied.', 404, 'GALLERY_NOT_FOUND');
    }

    if (!watermarkConfig || typeof watermarkConfig !== 'object') {
      throw new AppError('watermarkConfig object is required.', 400, 'INVALID_WATERMARK_CONFIG');
    }

    gallery.watermarkConfig = {
      enabled: Boolean(watermarkConfig.enabled),
      text: (watermarkConfig.text || '© MomentGrid Collective').trim(),
      opacity: Math.min(100, Math.max(10, Number(watermarkConfig.opacity) || 45)),
      position: watermarkConfig.position || 'south_east',
    };

    await this.galleryRepository.update(gallery);

    // Generate watermarked preview URLs for the first 12 photos
    const previewPhotos = gallery.photos.slice(0, 12).map((p) => ({
      id: p.id,
      originalUrl: p.url,
      watermarkedUrl: this.storageService
        ? this.storageService.getWatermarkedUrl(p.url, gallery.watermarkConfig)
        : `${p.url}#watermark=${encodeURIComponent(gallery.watermarkConfig.text)}`,
    }));

    return {
      success: true,
      galleryId: gallery.id,
      watermarkConfig: gallery.watermarkConfig,
      previewPhotos,
    };
  }
}

module.exports = ApplyWatermarkSettingsUseCase;

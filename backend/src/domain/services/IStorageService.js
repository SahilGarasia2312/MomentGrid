'use strict';

/**
 * IStorageService — Abstract Domain Service Interface
 *
 * Defines cloud asset storage, dynamic image optimization, watermarking,
 * and ZIP download archive operations.
 */
class IStorageService {
  // eslint-disable-next-line no-unused-vars
  async getUploadSignature({ folderPath, tags }) {
    throw new Error('IStorageService.getUploadSignature() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  getOptimizedUrl(publicIdOrUrl, { width, height, quality, format }) {
    throw new Error('IStorageService.getOptimizedUrl() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  getWatermarkedUrl(publicIdOrUrl, watermarkConfig) {
    throw new Error('IStorageService.getWatermarkedUrl() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async generateZipDownloadBundle(photos, { format, galleryTitle }) {
    throw new Error('IStorageService.generateZipDownloadBundle() must be implemented.');
  }
}

module.exports = IStorageService;

'use strict';

const { validationResult } = require('express-validator');
const AppError = require('../../application/errors/AppError');

// Repository & Storage Service
const MongoGalleryRepository = require('../../infrastructure/database/repositories/MongoGalleryRepository');
const CloudinaryStorageService = require('../../infrastructure/services/CloudinaryStorageService');

// Use Cases
const UploadGalleryImagesUseCase = require('../../application/usecases/gallery/UploadGalleryImagesUseCase');
const ManageGalleryFoldersUseCase = require('../../application/usecases/gallery/ManageGalleryFoldersUseCase');
const SearchAndFilterPhotosUseCase = require('../../application/usecases/gallery/SearchAndFilterPhotosUseCase');
const ApplyWatermarkSettingsUseCase = require('../../application/usecases/gallery/ApplyWatermarkSettingsUseCase');
const ConfigureGallerySharingUseCase = require('../../application/usecases/gallery/ConfigureGallerySharingUseCase');
const DownloadGalleryBundleUseCase = require('../../application/usecases/gallery/DownloadGalleryBundleUseCase');

const galleryRepository = new MongoGalleryRepository();
const storageService = new CloudinaryStorageService();

const assertValid = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new AppError('Request validation failed.', 422, 'VALIDATION_ERROR');
    err.details = errors.array().map((e) => ({ field: e.path, message: e.msg }));
    throw err;
  }
};

/**
 * GalleryManagementController
 *
 * REST controller handling digital proofing, asset uploading, folder organization,
 * pagination/filtering/search, image optimization, watermarking, and ZIP archiving.
 */
class GalleryManagementController {
  /**
   * POST /v1/gallery-manager/upload-signature
   * Generates a signed Cloudinary upload token for direct browser uploads.
   */
  async getUploadSignature(req, res, next) {
    try {
      assertValid(req);
      const { folderPath, tags } = req.body;
      const signaturePayload = await storageService.getUploadSignature({ folderPath, tags });

      return res.status(200).json({
        success: true,
        data: signaturePayload,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /v1/gallery-manager/:id/photos
   * Adds uploaded image payloads into a specific gallery folder with category tags.
   */
  async uploadPhotos(req, res, next) {
    try {
      assertValid(req);
      const galleryId = req.params.id;
      const { studioId, photos, targetFolderId, category } = req.body;
      const useCase = new UploadGalleryImagesUseCase({ galleryRepository, storageService });
      const result = await useCase.execute({ galleryId, studioId, photos, targetFolderId, category });

      return res.status(201).json({
        success: true,
        message: 'Photos uploaded and optimized successfully.',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /v1/gallery-manager/:id/photos
   * Retrieves paginated, searchable, and filterable photo assets for a gallery.
   */
  async listPhotos(req, res, next) {
    try {
      assertValid(req);
      const galleryId = req.params.id;
      const { searchQuery, category, folderId, favoritesOnly, page, limit } = req.query;
      const useCase = new SearchAndFilterPhotosUseCase({ galleryRepository });
      const result = await useCase.execute({
        galleryId,
        searchQuery,
        category,
        folderId,
        favoritesOnly,
        page,
        limit,
      });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /v1/gallery-manager/:id/folders
   * Handles folder creation, renaming, deletion, or photo reassignment.
   */
  async manageFolders(req, res, next) {
    try {
      assertValid(req);
      const galleryId = req.params.id;
      const { studioId, action, folderPayload } = req.body;
      const useCase = new ManageGalleryFoldersUseCase({ galleryRepository });
      const result = await useCase.execute({ galleryId, studioId, action, folderPayload });

      return res.status(200).json({
        success: true,
        message: `Folder action '${action}' completed successfully.`,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /v1/gallery-manager/:id/watermark
   * Updates dynamic watermark configuration and returns watermarked preview URLs.
   */
  async applyWatermark(req, res, next) {
    try {
      assertValid(req);
      const galleryId = req.params.id;
      const { studioId, watermarkConfig } = req.body;
      const useCase = new ApplyWatermarkSettingsUseCase({ galleryRepository, storageService });
      const result = await useCase.execute({ galleryId, studioId, watermarkConfig });

      return res.status(200).json({
        success: true,
        message: 'Watermark settings applied and preview URLs generated.',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /v1/gallery-manager/:id/sharing
   * Configures public visibility, PIN access gate, and download permissions.
   */
  async configureSharing(req, res, next) {
    try {
      assertValid(req);
      const galleryId = req.params.id;
      const { studioId, sharingConfig } = req.body;
      const useCase = new ConfigureGallerySharingUseCase({ galleryRepository });
      const result = await useCase.execute({ galleryId, studioId, sharingConfig });

      return res.status(200).json({
        success: true,
        message: 'Gallery sharing configuration updated.',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /v1/gallery-manager/:id/download
   * Generates a lossless high-res print or sRGB web ZIP archive bundle.
   */
  async downloadBundle(req, res, next) {
    try {
      const galleryId = req.params.id;
      const { format, folderId, favoritesOnly, photoIds } = req.body || {};
      const useCase = new DownloadGalleryBundleUseCase({ galleryRepository, storageService });
      const result = await useCase.execute({ galleryId, format, folderId, favoritesOnly, photoIds });

      return res.status(200).json({
        success: true,
        message: 'ZIP download archive generated successfully.',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new GalleryManagementController();

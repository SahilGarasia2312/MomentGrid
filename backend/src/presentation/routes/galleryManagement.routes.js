'use strict';

const express = require('express');
const router = express.Router();

const GalleryManagementController = require('../controllers/GalleryManagementController');
const {
  uploadSignatureValidator,
  uploadPhotosValidator,
  manageFoldersValidator,
  searchAndFilterValidator,
  applyWatermarkValidator,
  configureSharingValidator,
} = require('../validators/galleryManagement.validators');

// POST /v1/gallery-manager/upload-signature — Generate Cloudinary upload token
router.post(
  '/upload-signature',
  uploadSignatureValidator,
  GalleryManagementController.getUploadSignature.bind(GalleryManagementController)
);

// GET /v1/gallery-manager/:id/photos — Search, filter & paginate gallery images
router.get(
  '/:id/photos',
  searchAndFilterValidator,
  GalleryManagementController.listPhotos.bind(GalleryManagementController)
);

// POST /v1/gallery-manager/:id/photos — Upload and register new images
router.post(
  '/:id/photos',
  uploadPhotosValidator,
  GalleryManagementController.uploadPhotos.bind(GalleryManagementController)
);

// POST /v1/gallery-manager/:id/folders — Create, rename, delete folders & move photos
router.post(
  '/:id/folders',
  manageFoldersValidator,
  GalleryManagementController.manageFolders.bind(GalleryManagementController)
);

// PATCH /v1/gallery-manager/:id/watermark — Update watermark and get preview URLs
router.patch(
  '/:id/watermark',
  applyWatermarkValidator,
  GalleryManagementController.applyWatermark.bind(GalleryManagementController)
);

// PATCH /v1/gallery-manager/:id/sharing — Configure public link, PIN gate & download rules
router.patch(
  '/:id/sharing',
  configureSharingValidator,
  GalleryManagementController.configureSharing.bind(GalleryManagementController)
);

// POST /v1/gallery-manager/:id/download — Generate high-res print or web ZIP archive
router.post(
  '/:id/download',
  GalleryManagementController.downloadBundle.bind(GalleryManagementController)
);

module.exports = router;

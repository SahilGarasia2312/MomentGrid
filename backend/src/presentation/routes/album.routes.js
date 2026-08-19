'use strict';

const express = require('express');
const router = express.Router();

const AlbumController = require('../controllers/AlbumController');
const {
  createOrGetDraftValidator,
  updateSelectionValidator,
  addCommentValidator,
  configureCoverValidator,
  submitAlbumValidator,
  getStudioManifestValidator,
} = require('../validators/album.validators');

// POST /v1/albums/draft — Initialize or retrieve client album selection session
router.post(
  '/draft',
  createOrGetDraftValidator,
  AlbumController.createOrGetDraft.bind(AlbumController)
);

// PATCH /v1/albums/:id/selection — Update favorite, reject, or spread ordering
router.patch(
  '/:id/selection',
  updateSelectionValidator,
  AlbumController.updateSelection.bind(AlbumController)
);

// POST /v1/albums/:id/comments — Add or update retouching/layout notes on a photo
router.post(
  '/:id/comments',
  addCommentValidator,
  AlbumController.addOrUpdateComment.bind(AlbumController)
);

// PATCH /v1/albums/:id/cover-and-size — Configure dimensions, cover material, color, and embossed text
router.patch(
  '/:id/cover-and-size',
  configureCoverValidator,
  AlbumController.configureCoverAndSize.bind(AlbumController)
);

// POST /v1/albums/:id/submit — Formally sign off and submit album for studio production
router.post(
  '/:id/submit',
  submitAlbumValidator,
  AlbumController.submitAlbum.bind(AlbumController)
);

// GET /v1/albums/:id/studio-review — Studio review dashboard production manifest
router.get(
  '/:id/studio-review',
  getStudioManifestValidator,
  AlbumController.getStudioManifest.bind(AlbumController)
);

module.exports = router;

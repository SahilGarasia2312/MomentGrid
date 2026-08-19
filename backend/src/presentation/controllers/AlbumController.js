'use strict';

const { validationResult } = require('express-validator');
const AppError = require('../../application/errors/AppError');

// Repositories
const MongoAlbumRepository = require('../../infrastructure/database/repositories/MongoAlbumRepository');
const MongoGalleryRepository = require('../../infrastructure/database/repositories/MongoGalleryRepository');

// Use Cases
const CreateOrGetAlbumDraftUseCase = require('../../application/usecases/album/CreateOrGetAlbumDraftUseCase');
const UpdatePhotoSelectionStatusUseCase = require('../../application/usecases/album/UpdatePhotoSelectionStatusUseCase');
const AddOrUpdatePhotoCommentUseCase = require('../../application/usecases/album/AddOrUpdatePhotoCommentUseCase');
const ConfigureCoverAndSizingUseCase = require('../../application/usecases/album/ConfigureCoverAndSizingUseCase');
const SubmitAlbumSelectionUseCase = require('../../application/usecases/album/SubmitAlbumSelectionUseCase');
const GetStudioAlbumReviewManifestUseCase = require('../../application/usecases/album/GetStudioAlbumReviewManifestUseCase');

const albumRepository = new MongoAlbumRepository();
const galleryRepository = new MongoGalleryRepository();

const assertValid = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new AppError('Request validation failed.', 422, 'VALIDATION_ERROR');
    err.details = errors.array().map((e) => ({ field: e.path, message: e.msg }));
    throw err;
  }
};

/**
 * AlbumController
 *
 * REST controller handling client album selection workflows, favoriting/rejecting,
 * photo retouch notes, spread sequencing, cover & sizing specs, and studio production review manifests.
 */
class AlbumController {
  async createOrGetDraft(req, res, next) {
    try {
      assertValid(req);
      const { galleryId, clientEmail, clientName, title, initialPhotoIds } = req.body;
      const useCase = new CreateOrGetAlbumDraftUseCase({ albumRepository, galleryRepository });
      const album = await useCase.execute({
        galleryId,
        clientEmail,
        clientName,
        title,
        initialPhotoIds,
      });
      return res.status(200).json({
        success: true,
        message: 'Album selection session active.',
        data: album,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateSelection(req, res, next) {
    try {
      assertValid(req);
      const { id } = req.params;
      const { action, photoId, orderedPhotoIds } = req.body;
      const useCase = new UpdatePhotoSelectionStatusUseCase({ albumRepository });
      const updated = await useCase.execute({
        albumId: id,
        action,
        photoId,
        orderedPhotoIds,
      });
      return res.status(200).json({
        success: true,
        message: `Photo selection updated (${action}).`,
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  async addOrUpdateComment(req, res, next) {
    try {
      assertValid(req);
      const { id } = req.params;
      const { photoId, comment, clientName } = req.body;
      const useCase = new AddOrUpdatePhotoCommentUseCase({ albumRepository });
      const updated = await useCase.execute({
        albumId: id,
        photoId,
        comment,
        clientName,
      });
      return res.status(200).json({
        success: true,
        message: 'Photo comment attached successfully.',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  async configureCoverAndSize(req, res, next) {
    try {
      assertValid(req);
      const { id } = req.params;
      const { coverSpecs, albumSize, pageCount, clientNotes } = req.body;
      const useCase = new ConfigureCoverAndSizingUseCase({ albumRepository });
      const updated = await useCase.execute({
        albumId: id,
        coverSpecs,
        albumSize,
        pageCount,
        clientNotes,
      });
      return res.status(200).json({
        success: true,
        message: 'Album cover styling and sizing specifications saved.',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  async submitAlbum(req, res, next) {
    try {
      assertValid(req);
      const { id } = req.params;
      const useCase = new SubmitAlbumSelectionUseCase({ albumRepository });
      const submitted = await useCase.execute({ albumId: id });
      return res.status(200).json({
        success: true,
        message: 'Final album selection submitted to studio for production.',
        data: submitted,
      });
    } catch (err) {
      next(err);
    }
  }

  async getStudioManifest(req, res, next) {
    try {
      assertValid(req);
      const { id } = req.params;
      const studioId = req.user ? req.user.studioId : req.query.studioId;
      const useCase = new GetStudioAlbumReviewManifestUseCase({ albumRepository, galleryRepository });
      const manifest = await useCase.execute({
        albumId: id,
        studioId,
      });
      return res.status(200).json({
        success: true,
        message: 'Studio production review manifest generated successfully.',
        data: manifest,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AlbumController();

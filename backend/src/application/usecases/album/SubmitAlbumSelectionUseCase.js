'use strict';

const AppError = require('../../errors/AppError');
const Album = require('../../../domain/entities/Album');

/**
 * SubmitAlbumSelectionUseCase — Application Use Case
 *
 * Formally signs off and locks the curated album selection (`status: 'submitted'`),
 * making it ready for studio production review and print layout.
 */
class SubmitAlbumSelectionUseCase {
  constructor({ albumRepository }) {
    this.albumRepository = albumRepository;
  }

  async execute({ albumId }) {
    const album = await this.albumRepository.findById(albumId);
    if (!album) {
      throw new AppError('Album selection session not found.', 404, 'ALBUM_NOT_FOUND');
    }

    if (album.status !== Album.STATUSES.SELECTING) {
      throw new AppError('This album selection has already been submitted to the studio.', 400, 'ALBUM_ALREADY_SUBMITTED');
    }

    try {
      album.submitSelection();
    } catch (err) {
      throw new AppError(err.message, 400, 'SUBMISSION_VALIDATION_FAILED');
    }

    const updated = await this.albumRepository.update(album);
    return updated;
  }
}

module.exports = SubmitAlbumSelectionUseCase;

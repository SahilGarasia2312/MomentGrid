'use strict';

const AppError = require('../../errors/AppError');

/**
 * AddOrUpdatePhotoCommentUseCase — Application Use Case
 *
 * Attaches or removes client retouching, cropping, or layout feedback on specific photos within an album selection.
 */
class AddOrUpdatePhotoCommentUseCase {
  constructor({ albumRepository }) {
    this.albumRepository = albumRepository;
  }

  async execute({ albumId, photoId, comment, clientName }) {
    const album = await this.albumRepository.findById(albumId);
    if (!album) {
      throw new AppError('Album selection session not found.', 404, 'ALBUM_NOT_FOUND');
    }

    if (!album.canModify()) {
      throw new AppError('Cannot modify photo comments after the album has been submitted.', 403, 'ALBUM_LOCKED');
    }

    if (!photoId) {
      throw new AppError('photoId is required to add or update a comment.', 400, 'MISSING_PHOTO_ID');
    }

    album.addOrUpdateComment(photoId, comment, clientName);

    const updated = await this.albumRepository.update(album);
    return updated;
  }
}

module.exports = AddOrUpdatePhotoCommentUseCase;

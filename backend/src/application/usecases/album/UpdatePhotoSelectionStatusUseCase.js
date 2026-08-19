'use strict';

const AppError = require('../../errors/AppError');

/**
 * UpdatePhotoSelectionStatusUseCase — Application Use Case
 *
 * Handles photo selection state updates (`toggle_favorite`, `toggle_reject`, `set_order`)
 * for an active client album draft.
 */
class UpdatePhotoSelectionStatusUseCase {
  constructor({ albumRepository }) {
    this.albumRepository = albumRepository;
  }

  async execute({ albumId, action, photoId, orderedPhotoIds }) {
    const album = await this.albumRepository.findById(albumId);
    if (!album) {
      throw new AppError('Album selection session not found.', 404, 'ALBUM_NOT_FOUND');
    }

    if (!album.canModify()) {
      throw new AppError('Cannot modify photo selection after the album has been submitted.', 403, 'ALBUM_LOCKED');
    }

    if (action === 'toggle_favorite') {
      if (!photoId) throw new AppError('photoId is required for toggle_favorite action.', 400, 'MISSING_PHOTO_ID');
      album.toggleFavorite(photoId);
    } else if (action === 'toggle_reject') {
      if (!photoId) throw new AppError('photoId is required for toggle_reject action.', 400, 'MISSING_PHOTO_ID');
      album.toggleReject(photoId);
    } else if (action === 'set_order') {
      if (!Array.isArray(orderedPhotoIds)) {
        throw new AppError('orderedPhotoIds must be an array of string IDs.', 400, 'INVALID_ORDER_ARRAY');
      }
      album.setSpreadOrder(orderedPhotoIds);
    } else {
      throw new AppError('Invalid selection action. Expected toggle_favorite, toggle_reject, or set_order.', 400, 'INVALID_ACTION');
    }

    const updated = await this.albumRepository.update(album);
    return updated;
  }
}

module.exports = UpdatePhotoSelectionStatusUseCase;

'use strict';

const AppError = require('../../errors/AppError');

/**
 * ConfigureCoverAndSizingUseCase — Application Use Case
 *
 * Configures physical album specifications: cover photo selection, luxury binding material, cover color,
 * embossed title foil text, dimensional format (`albumSize`), and total spread `pageCount`.
 */
class ConfigureCoverAndSizingUseCase {
  constructor({ albumRepository }) {
    this.albumRepository = albumRepository;
  }

  async execute({ albumId, coverSpecs, albumSize, pageCount, clientNotes }) {
    const album = await this.albumRepository.findById(albumId);
    if (!album) {
      throw new AppError('Album selection session not found.', 404, 'ALBUM_NOT_FOUND');
    }

    if (!album.canModify()) {
      throw new AppError('Cannot modify cover or sizing specifications after album submission.', 403, 'ALBUM_LOCKED');
    }

    album.setCoverAndSize({ coverSpecs, albumSize, pageCount, clientNotes });

    const updated = await this.albumRepository.update(album);
    return updated;
  }
}

module.exports = ConfigureCoverAndSizingUseCase;

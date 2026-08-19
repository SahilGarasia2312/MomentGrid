'use strict';

/**
 * IAlbumRepository — Domain Repository Interface
 *
 * Defines contract for album selection persistence and query methods.
 */
class IAlbumRepository {
  async findById(id) {
    throw new Error('IAlbumRepository#findById must be implemented.');
  }

  async findByClientOrGallery({ galleryId, clientEmail }) {
    throw new Error('IAlbumRepository#findByClientOrGallery must be implemented.');
  }

  async create(album) {
    throw new Error('IAlbumRepository#create must be implemented.');
  }

  async update(album) {
    throw new Error('IAlbumRepository#update must be implemented.');
  }

  async listByStudio(studioId, options = {}) {
    throw new Error('IAlbumRepository#listByStudio must be implemented.');
  }
}

module.exports = IAlbumRepository;

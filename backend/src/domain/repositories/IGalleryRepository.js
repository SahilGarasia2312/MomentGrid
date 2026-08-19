'use strict';

/**
 * IGalleryRepository — Abstract Repository Interface
 */
class IGalleryRepository {
  // eslint-disable-next-line no-unused-vars
  async findById(id) {
    throw new Error('IGalleryRepository.findById() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async findByStudioId(studioId) {
    throw new Error('IGalleryRepository.findByStudioId() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async findByClientEmail(clientEmail) {
    throw new Error('IGalleryRepository.findByClientEmail() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async save(gallery) {
    throw new Error('IGalleryRepository.save() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async update(gallery) {
    throw new Error('IGalleryRepository.update() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async delete(id) {
    throw new Error('IGalleryRepository.delete() must be implemented.');
  }
}

module.exports = IGalleryRepository;

'use strict';

/**
 * IStudioRepository — Abstract Repository Interface
 */
class IStudioRepository {
  // eslint-disable-next-line no-unused-vars
  async findById(id) {
    throw new Error('IStudioRepository.findById() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async findByOwnerId(ownerId) {
    throw new Error('IStudioRepository.findByOwnerId() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async findBySlug(slug) {
    throw new Error('IStudioRepository.findBySlug() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async save(studio) {
    throw new Error('IStudioRepository.save() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async update(studio) {
    throw new Error('IStudioRepository.update() must be implemented.');
  }

  // eslint-disable-next-line no-unused-vars
  async delete(id) {
    throw new Error('IStudioRepository.delete() must be implemented.');
  }
}

module.exports = IStudioRepository;
